import React from 'react';
import {
  CheckCircle2,
  Clock,
  CreditCard,
  Download,
  IndianRupee,
  Search,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import type { AdminPaymentTransaction } from './types';

interface AdminPaymentsProps {
  transactions: AdminPaymentTransaction[];
  summary: {
    totalCollectedInr: number;
    capturedCount: number;
    pendingCount: number;
    failedOrRefundedCount: number;
    categoryBreakdown: { category: string; count: number; amountInr: number }[];
  };
  gatewayConfig: {
    mode: 'live' | 'test' | 'sandbox';
    hasKeys: boolean;
    webhookConfigured: boolean;
  };
  loading: boolean;
  filters: {
    status: string;
    purpose: string;
    dateFrom: string;
    dateTo: string;
    q: string;
  };
  onChangeFilters: (next: Partial<AdminPaymentsProps['filters']>) => void;
  onExportCsv: () => Promise<void>;
}

function statusBadgeStyle(status: string): string {
  const s = status.toUpperCase();
  if (s === 'CAPTURED') return 'bg-emerald-50 text-emerald-800 border-emerald-200';
  if (s === 'CREATED') return 'bg-amber-50 text-amber-800 border-amber-200';
  return 'bg-red-50 text-red-800 border-red-200';
}

export function AdminPayments({
  transactions,
  summary,
  gatewayConfig,
  loading,
  filters,
  onChangeFilters,
  onExportCsv,
}: AdminPaymentsProps) {
  const maxCategoryAmount = Math.max(
    1,
    ...summary.categoryBreakdown.map((c) => c.amountInr)
  );

  const gatewayLabel =
    gatewayConfig.mode === 'live'
      ? 'Razorpay Live Production'
      : gatewayConfig.mode === 'test'
      ? 'Razorpay Test Keys Active'
      : 'Sandbox Test Mode (No Razorpay Keys in Env)';

  return (
    <div className="space-y-5">
      {/* Header & Gateway Status */}
      <div className="bg-white rounded-2xl border border-[#E2EAE4] p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#368737]">
            <CreditCard className="w-4 h-4" />
            <span>Tamper-Proof Server-Verified Payment Ledger</span>
          </div>
          <h2 className="text-base font-bold text-[#142119] mt-0.5">
            Payments &amp; Razorpay Collection Dashboard
          </h2>
          <p className="text-xs text-[#55685C] mt-0.5">
            Every Harit Marathon fee is calculated server-side from database category rates and verified via HMAC-SHA256 signatures &amp; webhooks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div
            className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
              gatewayConfig.mode === 'live'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : gatewayConfig.mode === 'test'
                ? 'bg-blue-50 border-blue-200 text-blue-900'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <div className="leading-tight">
              <div>{gatewayLabel}</div>
              <div className="text-[10px] font-normal opacity-80">
                Webhook Secret: {gatewayConfig.webhookConfigured ? 'Configured' : 'Pending Env Setup'}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onExportCsv}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#144527] hover:bg-[#0F351E] text-white text-xs font-semibold cursor-pointer whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Reconciliation CSV</span>
          </button>
        </div>
      </div>

      {/* Live KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-[#E2EAE4] p-5 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-[#55685C]">
            <span>Total Verified Collection</span>
            <IndianRupee className="w-4 h-4 text-[#144527]" />
          </div>
          <p className="text-2xl font-bold text-[#144527] font-mono tabular-nums">
            ₹{summary.totalCollectedInr.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-[#6B7E71]">
            Strictly CAPTURED &amp; signature-verified receipts
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2EAE4] p-5 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-[#55685C]">
            <span>Verified Paid Receipts</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          </div>
          <p className="text-2xl font-bold text-[#142119] font-mono tabular-nums">
            {summary.capturedCount}
          </p>
          <p className="text-[11px] text-[#6B7E71]">Auto-synced to Runner Registrations</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2EAE4] p-5 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-[#55685C]">
            <span>Pending Checkout Orders</span>
            <Clock className="w-4 h-4 text-amber-700" />
          </div>
          <p className="text-2xl font-bold text-[#142119] font-mono tabular-nums">
            {summary.pendingCount}
          </p>
          <p className="text-[11px] text-[#6B7E71]">Order created, awaiting payment completion</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2EAE4] p-5 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-[#55685C]">
            <span>Failed / Refunded</span>
            <XCircle className="w-4 h-4 text-red-700" />
          </div>
          <p className="text-2xl font-bold text-[#142119] font-mono tabular-nums">
            {summary.failedOrRefundedCount}
          </p>
          <p className="text-[11px] text-[#6B7E71]">Tracked via Razorpay webhook events</p>
        </div>
      </div>

      {/* Category Collection Breakdown */}
      {summary.categoryBreakdown.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#E2EAE4] p-5 space-y-3">
          <h3 className="text-xs font-bold text-[#142119]">
            Verified Collection Breakdown by Race Category / Purpose
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {summary.categoryBreakdown.map((item) => {
              const pct = Math.max(6, Math.round((item.amountInr / maxCategoryAmount) * 100));
              return (
                <div
                  key={item.category}
                  className="p-3.5 rounded-xl bg-[#FAFBF8] border border-[#EDF2EE] space-y-2"
                >
                  <div className="flex items-center justify-between text-xs gap-2">
                    <span className="font-semibold text-[#142119] truncate">
                      {item.category}
                    </span>
                    <span className="font-mono font-bold text-[#144527] tabular-nums shrink-0">
                      ₹{item.amountInr.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-[#E6EFE7] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#2E7D32]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-[#6B7E71] tabular-nums">
                    {item.count} verified {item.count === 1 ? 'receipt' : 'receipts'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-[#E2EAE4] p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 text-xs">
        <div className="lg:col-span-4 relative">
          <Search
            className="w-4 h-4 text-[#7C8F82] absolute left-3 top-1/2 -translate-y-1/2"
            aria-hidden="true"
          />
          <input
            type="search"
            value={filters.q}
            onChange={(e) => onChangeFilters({ q: e.target.value })}
            placeholder="Search order ID, payment ID, payer, ref..."
            aria-label="Search payments"
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#DCE5DE] bg-[#FAFBF8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#368737]/40"
          />
        </div>
        <div className="lg:col-span-2">
          <select
            aria-label="Filter payment status"
            value={filters.status}
            onChange={(e) => onChangeFilters({ status: e.target.value })}
            className="w-full px-3 py-2 rounded-xl border border-[#DCE5DE] bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="CAPTURED">Verified Paid (CAPTURED)</option>
            <option value="CREATED">Pending (CREATED)</option>
            <option value="FAILED">Failed</option>
            <option value="REFUNDED">Refunded</option>
          </select>
        </div>
        <div className="lg:col-span-2">
          <select
            aria-label="Filter payment purpose"
            value={filters.purpose}
            onChange={(e) => onChangeFilters({ purpose: e.target.value })}
            className="w-full px-3 py-2 rounded-xl border border-[#DCE5DE] bg-white"
          >
            <option value="all">All Purposes</option>
            <option value="marathon">Harit Marathon</option>
            <option value="donation">Donations / Support</option>
          </select>
        </div>
        <div className="lg:col-span-2">
          <input
            type="datetime-local"
            aria-label="Payments from date and time"
            title="From Date & Time (applied to CSV export)"
            value={filters.dateFrom}
            onChange={(e) => onChangeFilters({ dateFrom: e.target.value })}
            className="w-full px-2.5 py-2 rounded-xl border border-[#DCE5DE] bg-white font-mono text-[11px]"
          />
        </div>
        <div className="lg:col-span-2">
          <input
            type="datetime-local"
            aria-label="Payments to date and time"
            title="To Date & Time (applied to CSV export)"
            value={filters.dateTo}
            onChange={(e) => onChangeFilters({ dateTo: e.target.value })}
            className="w-full px-2.5 py-2 rounded-xl border border-[#DCE5DE] bg-white font-mono text-[11px]"
          />
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-2xl border border-[#E2EAE4] overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3" aria-busy="true">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-12 rounded-xl bg-[#F4F7F4] animate-pulse" />
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-12 text-center space-y-1.5">
            <CreditCard className="w-7 h-7 text-[#98AA9D] mx-auto" />
            <p className="text-sm font-semibold text-[#142119]">No payment records found</p>
            <p className="text-xs text-[#55685C]">
              Completed Harit Marathon fee receipts and donations appear here automatically.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#EDF2EE] bg-[#FAFBF8] text-[11px] font-semibold text-[#55685C]">
                  <th className="py-3 px-5">Order / Payment ID</th>
                  <th className="py-3 px-3">Payer &amp; Reference</th>
                  <th className="py-3 px-3">Purpose &amp; Category</th>
                  <th className="py-3 px-3 text-right">Amount</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Verification</th>
                  <th className="py-3 px-5 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F4F1]">
                {transactions.map((tx) => (
                  <tr key={tx.orderId} className="hover:bg-[#FAFBF8]">
                    <td className="py-3.5 px-5 font-mono text-[11px]">
                      <div className="font-semibold text-[#144527]">{tx.orderId}</div>
                      <div className="text-[#6B7E71]">{tx.paymentId || 'Awaiting capture'}</div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-[#142119]">{tx.payerName}</div>
                      <div className="text-[11px] text-[#6B7E71] font-mono tabular-nums">
                        {tx.payerMobile}
                        {tx.referenceId ? ` · ${tx.referenceId}` : ''}
                        {tx.district ? ` · ${tx.district}` : ''}
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-[#142119] capitalize">{tx.purpose}</div>
                      <div className="text-[11px] text-[#55685C]">{tx.categoryName || '—'}</div>
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-bold text-[#142119] tabular-nums whitespace-nowrap">
                      ₹{Number(tx.amountInr || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-md border text-[11px] font-semibold ${statusBadgeStyle(
                          tx.status
                        )}`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-[11px] whitespace-nowrap">
                      <div className="text-[#2A3A30]">
                        Sig: {tx.signatureVerified ? 'HMAC Verified' : 'Pending'}
                      </div>
                      <div className="text-[#6B7E71]">
                        Hook: {tx.webhookVerified ? 'Confirmed' : tx.paymentMethod || 'Checkout'}
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-right font-mono text-[11px] text-[#6B7E71] tabular-nums whitespace-nowrap">
                      {String(tx.paidAt || tx.createdAt).slice(0, 16).replace('T', ' ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
