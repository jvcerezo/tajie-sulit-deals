import { useState } from 'react';
import { Check, Copy, ExternalLink, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

import type { Voucher } from '@/types';

interface VoucherCardProps {
  voucher: Voucher;
}

export function VoucherCard({ voucher }: VoucherCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(voucher.code);
    setCopied(true);
    confetti({
      particleCount: 40,
      spread: 70,
      origin: { y: 0.7 },
    });
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-dashed border-orange-300 bg-gradient-to-br from-orange-50/80 via-white to-amber-50/50 p-4 shadow-2xs hover:shadow-md transition-shadow">
      {/* Left ticket cutout circles */}
      <div className="absolute -left-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-slate-50 border-r border-orange-300" />
      <div className="absolute -right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-slate-50 border-l border-orange-300" />

      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="rounded bg-orange-600 px-2 py-0.5 text-[0.625rem] font-black text-white uppercase tracking-wider">
              {voucher.discount}
            </span>
            {voucher.isHot && (
              <span className="flex items-center gap-0.5 rounded bg-red-100 text-red-700 px-1.5 py-0.5 text-[0.625rem] font-bold">
                <Flame className="h-3 w-3 fill-red-600 text-red-600" /> Hot
              </span>
            )}
          </div>
          <h3 className="mt-1.5 text-sm font-bold text-slate-900 leading-tight">
            {voucher.title}
          </h3>
          <p className="mt-1 text-xs text-slate-600 leading-relaxed">
            {voucher.description}
          </p>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-dashed border-orange-200 flex flex-wrap items-center justify-between gap-2">
        <div className="text-[0.6875rem] text-slate-500 font-medium">
          <span>Min. Spend: <strong>{voucher.minSpend}</strong></span>
          <span className="mx-1.5">·</span>
          <span className="text-orange-700 font-bold">{voucher.expiresAt}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Copy Code Button */}
          <button
            type="button"
            onClick={handleCopy}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-black transition-all cursor-pointer ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-orange-600 hover:bg-orange-700 text-white shadow-xs'
            }`}
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Code Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy {voucher.code}</span>
              </>
            )}
          </button>

          {/* Claim Direct */}
          <a
            href={voucher.shopeeClaimUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-[0.6875rem] font-bold text-orange-700 hover:underline"
          >
            <span>Shopee Wallet</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
