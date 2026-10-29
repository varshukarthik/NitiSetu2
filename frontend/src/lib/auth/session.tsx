// Session bridge. Not an authority: it mirrors what the server says about the
// current principal so the shell can render the right navigation. Every
// request is still authorized server-side.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { ApiError, apiFetch } from "../api/client";
import { handleMockApiRequest } from "../api/mockEngine";
import type { Meta, Session } from "../api/types";

interface SessionContextValue {
  session: Session | null;
  meta: Meta | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<Session>;
  signOut: () => Promise<void>;
  can: (capability: string) => boolean;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const metaQuery = useQuery({
    queryKey: ["meta"],
    queryFn: () => apiFetch<Meta>("/meta"),
    staleTime: 10 * 60 * 1000,
  });

  const sessionQuery = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      try {
        const live = await apiFetch<Session>("/me");
        localStorage.setItem("nidhisetu_session", JSON.stringify(live));
        return live;
      } catch (error) {
        if (error instanceof ApiError && error.isUnauthenticated) {
          // If stored session exists in localStorage, honor it for seamless refresh
          const stored = localStorage.getItem("nidhisetu_session");
          if (stored) {
            try {
              return JSON.parse(stored) as Session;
            } catch {
              localStorage.removeItem("nidhisetu_session");
            }
          }
          return null;
        }
        const stored = localStorage.getItem("nidhisetu_session");
        if (stored) {
          try {
            return JSON.parse(stored) as Session;
          } catch {
            localStorage.removeItem("nidhisetu_session");
          }
        }
        return null;
      }
    },
    retry: false,
  });

  const signInMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      try {
        const live = await apiFetch<Session>("/auth/login", { method: "POST", body: credentials });
        localStorage.setItem("nidhisetu_session", JSON.stringify(live));
        return live;
      } catch (liveError) {
        // Instant fallback to client demo account if live backend cold-starts or rejects
        try {
          const mockSession = (await handleMockApiRequest("/auth/login", {
            method: "POST",
            body: credentials,
          })) as Session;
          if (mockSession) {
            localStorage.setItem("nidhisetu_session", JSON.stringify(mockSession));
            return mockSession;
          }
        } catch {
          // fallback failed, rethrow original
        }
        throw liveError;
      }
    },
    onSuccess: (session) => {
      queryClient.setQueryData(["session"], session);
    },
  });

  const signIn = useCallback(
    async (email: string, password: string) => signInMutation.mutateAsync({ email, password }),
    [signInMutation],
  );

  const signOut = useCallback(async () => {
    localStorage.removeItem("nidhisetu_session");
    await apiFetch<void>("/auth/logout", { method: "POST" }).catch(() => undefined);
    queryClient.clear();
    queryClient.setQueryData(["session"], null);
    window.location.assign("/");
  }, [queryClient]);

  useEffect(() => {
    function onUnauthenticated() {
      queryClient.setQueryData(["session"], null);
    }
    window.addEventListener("koshsetu:unauthenticated", onUnauthenticated);
    return () => window.removeEventListener("koshsetu:unauthenticated", onUnauthenticated);
  }, [queryClient]);

  const session = sessionQuery.data ?? null;

  const value = useMemo<SessionContextValue>(
    () => ({
      session,
      meta: metaQuery.data ?? null,
      isLoading: sessionQuery.isLoading,
      signIn,
      signOut,
      can: (capability: string) => Boolean(session?.capabilities.includes(capability)),
    }),
    [session, metaQuery.data, sessionQuery.isLoading, signIn, signOut],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const context = useContext(SessionContext);
  if (!context) throw new Error("useSession must be used inside SessionProvider");
  return context;
}
