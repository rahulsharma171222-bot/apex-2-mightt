import React, { createContext, useContext } from 'react';
import type { PublicBootstrapPayload } from '../admin/types';

export interface PublicPortalContextValue {
  bootstrap: PublicBootstrapPayload | null;
  loading: boolean;
  onNavigate: (path: string) => void;
  refreshBootstrap: () => Promise<void>;
}

const PublicPortalContext = createContext<PublicPortalContextValue>({
  bootstrap: null,
  loading: false,
  onNavigate: () => {},
  refreshBootstrap: async () => {},
});

export function PublicPortalProvider({
  value,
  children,
}: {
  value: PublicPortalContextValue;
  children: React.ReactNode;
}) {
  return (
    <PublicPortalContext.Provider value={value}>
      {children}
    </PublicPortalContext.Provider>
  );
}

export function usePublicPortal() {
  return useContext(PublicPortalContext);
}
