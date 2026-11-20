import React from 'react';
import { ArrowLeft, Lock, ShieldCheck, LogOut, AlertCircle } from 'lucide-react';
import { BrandLogo } from '../components/BrandLogo';

interface AdminAuthGateProps {
  loading: boolean;
  signingIn: boolean;
  unauthorizedEmail: string | null;
  errorMessage: string | null;
  onGoogleSignIn: () => void;
  onSignOut: () => void;
  onBackToSite: () => void;
}

export function AdminAuthGate({
  loading,
  signingIn,
  unauthorizedEmail,
  errorMessage,
  onGoogleSignIn,
  onSignOut,
  onBackToSite,
}: AdminAuthGateProps) {
  return (
    <div className="min-h-dvh bg-[#F7F9F7] text-[#142119] flex flex-col justify-between px-4 py-8">
      <div className="max-w-5xl w-full mx-auto flex items-center justify-between">
        <button
          type="button"
          onClick={onBackToSite}
          className="inline-flex items-center gap-2 text-xs font-medium text-[#44544A] hover:text-[#144527] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Return to GOVEDA Website</span>
        </button>
        <span className="text-xs text-[#55685C] tabular-nums">
          Section 8 Governance Portal
        </span>
      </div>

      <div className="max-w-md w-full mx-auto my-auto py-8">
        <div className="bg-white rounded-2xl border border-[#E2EAE4] p-7 sm:p-9 space-y-6">
          <div className="space-y-4">
            <BrandLogo compact />
            <div className="pt-1 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#368737]">
                <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Protected Administrative Workspace</span>
              </div>
              <h1 className="font-editorial text-2xl sm:text-[26px] font-bold text-[#142119] tracking-tight text-balance">
                GOVEDA Foundation Admin Console
              </h1>
              <p className="text-sm text-[#55685C] leading-relaxed">
                Sign in with an authorized Google account to manage the 12 registration forms, district operations, verified impact metrics, and foundation governance.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="space-y-3 py-4" aria-busy="true" aria-label="Checking session">
              <div className="h-11 rounded-xl bg-[#EEF3EE] animate-pulse" />
              <div className="h-4 w-2/3 mx-auto rounded bg-[#EEF3EE] animate-pulse" />
            </div>
          ) : unauthorizedEmail ? (
            <div className="space-y-4">
              <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 space-y-2">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="space-y-1 text-xs text-amber-950">
                    <p className="font-semibold">Access Pending Authorization</p>
                    <p className="leading-relaxed">
                      Signed in as <span className="font-mono font-semibold">{unauthorizedEmail}</span>, which is not yet listed in GOVEDA&apos;s authorized admin directory. Ask a Super Admin to assign your role under Team &amp; Roles.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2.5">
                <button
                  type="button"
                  onClick={onSignOut}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#144527] hover:bg-[#0F351E] text-white text-sm font-semibold transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" aria-hidden="true" />
                  <span>Switch Google Account</span>
                </button>
                <button
                  type="button"
                  onClick={onBackToSite}
                  className="px-4 py-2.5 rounded-xl border border-[#D4E0D7] text-sm font-medium text-[#142119] hover:bg-[#F7F9F7] transition-colors cursor-pointer"
                >
                  Public Site
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {errorMessage && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50/80 p-3.5 text-xs text-red-800 flex items-start gap-2"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" aria-hidden="true" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="button"
                onClick={onGoogleSignIn}
                disabled={signingIn}
                className="w-full inline-flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-[#144527] hover:bg-[#0F351E] disabled:opacity-60 text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M21.35 11.1h-9.18v2.92h5.27c-.23 1.48-1.76 4.34-5.27 4.34-3.17 0-5.76-2.62-5.76-5.86s2.59-5.86 5.76-5.86c1.81 0 3.02.77 3.71 1.43l2.53-2.44C16.79 4.1 14.68 3.2 12.17 3.2 7.21 3.2 3.2 7.21 3.2 12.5s4.01 9.3 8.97 9.3c5.18 0 8.61-3.64 8.61-8.77 0-.59-.07-1.26-.18-1.93z"
                  />
                </svg>
                <span>{signingIn ? 'Verifying Credentials...' : 'Sign in with Google'}</span>
              </button>

              <div className="pt-3 border-t border-[#EDF2EE] space-y-2 text-xs text-[#55685C]">
                <div className="flex items-center gap-2 text-[#144527] font-medium">
                  <ShieldCheck className="w-4 h-4 text-[#368737]" aria-hidden="true" />
                  <span>Role-Based Access Control Active</span>
                </div>
                <p className="leading-relaxed">
                  Super Admin · District Coordinators (district-scoped) · Content Editors (PII isolated). Every admin mutation is recorded in the audit trail.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl w-full mx-auto text-center text-xs text-[#6B7E71]">
        GOVEDA Carbon &amp; Climate India Foundation · Authorized Personnel Only
      </div>
    </div>
  );
}
