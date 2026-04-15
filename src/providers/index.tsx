'use client';

import { AmdlreProvider, presetThemes } from '@amdlre/design-system';

import { AuthProvider } from './auth-provider';

const projectTheme = presetThemes.royal;

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AmdlreProvider theme={projectTheme}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </AmdlreProvider>
  );
}
