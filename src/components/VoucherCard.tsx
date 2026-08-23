import { useState } from 'react';
import { Check, Copy, ExternalLink, Sparkles } from 'lucide-react';
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
      particleCount: 35,
      spread: 60,
      origin: { y: 0.7 },
    });
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-dashed border-[#E0D5C3] bg-gradient-to-br from-[#FAF6F0] via-white to-[#F4EDE4] p-4 shadow-2xs hover:shadow-md transition-shadow">
      {/* Left ticket cutout circles */}
      <div className="absolute -left-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-[#FAF7F2] border-r border-[#E0D5C3]" />
      <div className="absolute -right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-[#FAF7F2] border-l border-[#E0D5C3]" />

      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="rounded-md bg-[#C8522C] px-2 py-0.5 text-[0.625rem] font-bold text-white uppercase tracking-wider">
              {voucher.discount}
            </span>
            {voucher.isHot && (
              <span className="flex items-center gap-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.5 text-[0.625rem] font-bold">
                <Sparkles className="h-3 w-3 text-amber-600" /> Hot
              </span>
            )}
          </div>
          <h3 className="mt-1.5 text-sm font-bold text-stone-900 leading-tight">
            {voucher.title}
          </h3>
          <p className="mt-1 text-xs text-stone-600 leading-relaxed">
            {voucher.description}
          </p>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-dashed border-stone-200 flex flex-wrap items-center justify-between gap-2">
        <div className="text-[0.6875rem] text-stone-500 font-medium">
          <span>Min. Spend: <strong className="text-stone-700">{voucher.minSpend}</strong></span>
          <span className="mx-1.5">·</span>
          <span className="text-[#C8522C] font-bold">{voucher.expiresAt}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Copy Code Button */}
          <button
            type="button"
            onClick={handleCopy}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-[#C8522C] hover:bg-[#B34420] text-white shadow-2xs'
            }`}
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Copied!</span>
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
            className="inline-flex items-center gap-1 text-[0.6875rem] font-bold text-stone-600 hover:text-[#C8522C]"
          >
            <span>Claim</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
