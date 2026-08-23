import { useState, useMemo } from 'react';
import {
  Sparkles,
  ArrowRight,
  RotateCcw,
  Coffee,
  Laptop,
  Moon,
  Video,
  PiggyBank,
  CheckCircle2,
  Heart,
  ExternalLink,
  Star,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';

import type { Product } from '@/types';
import { useProducts, toggleWishlist, useWishlist } from '@/lib/storage';
import { formatPHP } from '@/lib/format';
import { trackAffiliateClick } from '@/lib/analytics';

// Vibe Options
interface VibeOption {
  id: string;
  title: string;
  subtitle: string;
  icon: typeof Coffee;
  categoryMatch: string[];
  tagsMatch: string[];
}

const VIBE_OPTIONS: VibeOption[] = [
  {
    id: 'desk-glowup',
    title: 'Minimalist WFH Studio',
    subtitle: 'Zero cable clutter, ergonomic flow, and deep focus acoustics',
    icon: Laptop,
    categoryMatch: ['Tech & Setup'],
    tagsMatch: ['Desk Setup', 'WFH Must-Have', 'Clean Desk', 'Ergonomic'],
  },
  {
    id: 'coffee-nook',
    title: 'Artisanal Home Cafe',
    subtitle: 'Morning slow brews, precision grinders, and barista essentials',
    icon: Coffee,
    categoryMatch: ['Kitchen & Coffee'],
    tagsMatch: ['Home Cafe', 'Aesthetic Kitchen', 'Morning Routine'],
  },
  {
    id: 'night-study',
    title: 'Midnight Lo-Fi Study Loft',
    subtitle: 'Warm ambient lighting, creamy mechanical switches & chill vibes',
    icon: Moon,
    categoryMatch: ['Tech & Setup'],
    tagsMatch: ['Creamy Thock', 'Anti-Glare', 'Desk Glow Up'],
  },
  {
    id: 'creator-starter',
    title: 'Creator Studio & Aesthetic Room',
    subtitle: 'High-contrast desk flair, soft studio lighting & clean backdrops',
    icon: Video,
    categoryMatch: ['Viral TikTok', 'Tech & Setup', 'Home & Living'],
    tagsMatch: ['TikTok Viral', 'Desk Glow Up', 'Room Aesthetic'],
  },
  {
    id: 'budget-gems',
    title: 'Sub-₱300 Hidden Grails',
    subtitle: 'Dangerously affordable pieces that feel 5x more premium than their price',
    icon: PiggyBank,
    categoryMatch: ['Tech & Setup', 'Home & Living', 'Kitchen & Coffee', 'Fashion & Accessories'],
    tagsMatch: ['Under ₱1k', 'Best Value', 'Secret Glitch', 'Student Friendly'],
  },
];

// Budget Options
interface BudgetOption {
  id: string;
  label: string;
  detail: string;
  maxBudget: number;
}

const BUDGET_OPTIONS: BudgetOption[] = [
  {
    id: 'budget-student',
    label: '🪴 Entry / Student Cap',
    detail: 'Under ₱500 total bundle ceiling',
    maxBudget: 500,
  },
  {
    id: 'budget-sweetspot',
    label: '🛋️ The Sweet Spot Range',
    detail: '₱500 - ₱1,500 high-yield upgrades',
    maxBudget: 1500,
  },
  {
    id: 'budget-premium',
    label: '👑 Holy Grail / Buy-It-For-Life',
    detail: '₱1,500+ top-tier benchmark pieces',
    maxBudget: 10000,
  },
  {
    id: 'budget-all',
    label: '🎁 Value-First Benchmark',
    detail: 'Optimal price-to-performance ratio',
    maxBudget: 99999,
  },
];

// Priority Options
interface PriorityOption {
  id: string;
  label: string;
  detail: string;
  tagFilter?: string;
}

const PRIORITY_OPTIONS: PriorityOption[] = [
  {
    id: 'sensory',
    label: '🔊 Acoustic & Sensory Feel',
    detail: 'Creamy linear switches, deep thock resonance, tactile precision',
    tagFilter: 'Creamy Thock',
  },
  {
    id: 'minimalist',
    label: '🪴 Spatial Hygiene & Zero Clutter',
    detail: 'Cable hiding, uniform desk mats, glare-free asymmetrical lighting',
    tagFilter: 'Desk Setup',
  },
  {
    id: 'tested-viral',
    label: '⭐ Verified Buyer Consensus',
    detail: 'Consistently holds 4.9+ stars across thousands of Shopee verified orders',
    tagFilter: 'TikTok Viral',
  },
  {
    id: 'pure-utility',
    label: '⚡ Daily Practical Utility',
    detail: 'Immediate quality-of-life elevation in daily routines',
  },
];

interface CozyMatchmakerProps {
  onProductClick?: (product: Product) => void;
}

export function CozyMatchmaker({ onProductClick }: CozyMatchmakerProps) {
  const products = useProducts();
  const wishlist = useWishlist();

  const [step, setStep] = useState<number>(1);
  const [selectedVibe, setSelectedVibe] = useState<string>('desk-glowup');
  const [selectedBudget, setSelectedBudget] = useState<string>('budget-sweetspot');
  const [selectedPriority, setSelectedPriority] = useState<string>('sensory');
  const [isCalculated, setIsCalculated] = useState<boolean>(false);

  // Matchmaking Algorithm
  const recommendations = useMemo(() => {
    if (!isCalculated) return [];

    const vibeObj = VIBE_OPTIONS.find((v) => v.id === selectedVibe);
    const budgetObj = BUDGET_OPTIONS.find((b) => b.id === selectedBudget);
    const priorityObj = PRIORITY_OPTIONS.find((p) => p.id === selectedPriority);

    const scored = products.map((p) => {
      let score = 0;

      // Match category
      if (vibeObj?.categoryMatch.includes(p.category)) {
        score += 30;
      }

      // Match tags
      if (vibeObj?.tagsMatch) {
        for (const tag of vibeObj.tagsMatch) {
          if (p.tags.some((t) => t.toLowerCase().includes(tag.toLowerCase()))) {
            score += 20;
          }
        }
      }

      // Priority Match
      if (priorityObj?.tagFilter) {
        if (p.tags.some((t) => t.toLowerCase().includes(priorityObj.tagFilter!.toLowerCase()))) {
          score += 25;
        }
      }

      // Budget Fit
      if (budgetObj) {
        if (budgetObj.id === 'budget-student') {
          if (p.price <= 350) score += 35;
          else if (p.price <= 600) score += 10;
          else score -= 40;
        } else if (budgetObj.id === 'budget-sweetspot') {
          if (p.price >= 300 && p.price <= 1500) score += 30;
          else if (p.price < 300) score += 15;
        } else if (budgetObj.id === 'budget-premium') {
          if (p.price >= 1200) score += 35;
        }
      }

      // Tajie Top Pick boost
      if (p.badge === "Tajie's Top Pick ⭐" || p.featured) {
        score += 15;
      }

      // Quality rating boost
      score += p.rating * 5;

      return { product: p, score };
    });

    // Sort by score descending and take top 3 distinct items
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 3).map((s) => s.product);
  }, [products, isCalculated, selectedVibe, selectedBudget, selectedPriority]);

  const bundleTotal = useMemo(() => {
    return recommendations.reduce((acc, curr) => acc + curr.price, 0);
  }, [recommendations]);

  const bundleOriginal = useMemo(() => {
    return recommendations.reduce((acc, curr) => acc + (curr.originalPrice || curr.price), 0);
  }, [recommendations]);

  const totalSaved = bundleOriginal - bundleTotal;

  const handleCalculate = () => {
    setIsCalculated(true);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  const handleReset = () => {
    setIsCalculated(false);
    setStep(1);
  };

  const handleAddAllToWishlist = () => {
    for (const p of recommendations) {
      if (!wishlist.includes(p.id)) {
        toggleWishlist(p.id);
      }
    }
    confetti({
      particleCount: 25,
      spread: 45,
    });
  };

  return (
    <section aria-labelledby="curation-engine-heading" className="relative overflow-hidden rounded-3xl bg-white border border-[#E8E6E1] shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-6 sm:p-10 md:p-12 text-[#141312] transition-all">
      {/* Editorial Header */}
      <div className="relative max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FAF9F6] border border-neutral-300/80 px-3.5 py-1 text-[0.625rem] font-semibold uppercase tracking-widest text-neutral-600 shadow-2xs font-sans">
          <Sparkles className="h-3 w-3 text-[#B89358]" />
          <span>Interactive Curation Engine</span>
        </div>

        <h2 id="curation-engine-heading" className="mt-3 font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#141312] tracking-tight leading-tight">
          Eliminate decision fatigue. <br className="hidden sm:block" />
          <span className="italic font-normal text-[#9B381E]">Receive your handpicked 3-piece dossier.</span>
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-neutral-500 leading-relaxed max-w-lg mx-auto font-sans">
          Specify your space, budget parameters, and sensory requirements. Tajie Studio algorithmically curates your verified holy grail trio.
        </p>
      </div>

      {!isCalculated ? (
        <div className="mt-8 max-w-3xl mx-auto font-sans">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-8">
            {[
              { num: 1, title: 'Spatial Vibe' },
              { num: 2, title: 'Budget Parameter' },
              { num: 3, title: 'Sensory Priority' },
            ].map((s) => (
              <button
                key={s.num}
                type="button"
                onClick={() => setStep(s.num)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-all cursor-pointer ${
                  step === s.num
                    ? 'bg-[#141312] text-white shadow-xs'
                    : step > s.num
                    ? 'bg-neutral-100 text-neutral-700'
                    : 'bg-white text-neutral-400 border border-neutral-200'
                }`}
              >
                <span className="w-3.5 h-3.5 rounded-full bg-white/20 grid place-items-center text-[0.5625rem] font-mono">
                  {s.num}
                </span>
                <span className="hidden sm:inline">{s.title}</span>
              </button>
            ))}
          </div>

          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-3">
              <div className="text-center sm:text-left mb-4">
                <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider">
                  1. Select your target environment
                </h3>
                <p className="text-xs text-neutral-500">What specific setup aesthetic are you constructing?</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {VIBE_OPTIONS.map((v) => {
                  const Icon = v.icon;
                  const isSelected = selectedVibe === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVibe(v.id)}
                      className={`group text-left p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                        isSelected
                          ? 'bg-[#FAF9F6] border-[#141312] shadow-xs ring-1 ring-[#141312]'
                          : 'bg-white border-[#E8E6E1] hover:bg-[#FAF9F6] hover:border-neutral-300'
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl grid place-items-center shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-[#141312] text-white'
                            : 'bg-neutral-100 text-neutral-600 group-hover:bg-neutral-200 group-hover:text-neutral-900'
                        }`}
                      >
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs sm:text-sm font-semibold text-neutral-900">
                            {v.title}
                          </h4>
                          {isSelected && <CheckCircle2 className="h-4 w-4 text-[#141312] shrink-0" />}
                        </div>
                        <p className="mt-0.5 text-xs text-neutral-500 leading-snug">{v.subtitle}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#141312] text-white px-5 py-2.5 text-xs font-semibold hover:bg-[#262524] transition-colors cursor-pointer shadow-xs"
                >
                  <span>Step 2: Budget</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-3">
              <div className="text-center sm:text-left mb-4">
                <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider">
                  2. Define target investment parameter
                </h3>
                <p className="text-xs text-neutral-500">Every recommendation is scored against maximum value thresholds.</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {BUDGET_OPTIONS.map((b) => {
                  const isSelected = selectedBudget === b.id;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setSelectedBudget(b.id)}
                      className={`text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#FAF9F6] border-[#141312] shadow-xs ring-1 ring-[#141312]'
                          : 'bg-white border-[#E8E6E1] hover:bg-[#FAF9F6] hover:border-neutral-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs sm:text-sm font-semibold text-neutral-900">{b.label}</h4>
                        {isSelected && <CheckCircle2 className="h-4 w-4 text-[#141312] shrink-0" />}
                      </div>
                      <p className="mt-1 text-xs text-neutral-500">{b.detail}</p>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-medium text-neutral-500 hover:text-neutral-900 px-3 py-2 cursor-pointer"
                >
                  ← Previous
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#141312] text-white px-5 py-2.5 text-xs font-semibold hover:bg-[#262524] transition-colors cursor-pointer shadow-xs"
                >
                  <span>Step 3: Priority</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="space-y-3">
              <div className="text-center sm:text-left mb-4">
                <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider">
                  3. Select decisive specification factor
                </h3>
                <p className="text-xs text-neutral-500">What is the non-negotiable benchmark for your setup?</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {PRIORITY_OPTIONS.map((p) => {
                  const isSelected = selectedPriority === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPriority(p.id)}
                      className={`text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#FAF9F6] border-[#141312] shadow-xs ring-1 ring-[#141312]'
                          : 'bg-white border-[#E8E6E1] hover:bg-[#FAF9F6] hover:border-neutral-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs sm:text-sm font-semibold text-neutral-900">{p.label}</h4>
                        {isSelected && <CheckCircle2 className="h-4 w-4 text-[#141312] shrink-0" />}
                      </div>
                      <p className="mt-1 text-xs text-neutral-500">{p.detail}</p>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs font-medium text-neutral-500 hover:text-neutral-900 px-3 py-2 cursor-pointer"
                >
                  ← Previous
                </button>
                <button
                  type="button"
                  onClick={handleCalculate}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#141312] hover:bg-[#262524] text-white px-6 py-3 text-xs sm:text-sm font-semibold shadow-md transition-transform hover:scale-[1.01] cursor-pointer"
                >
                  <Sparkles className="h-4 w-4 text-[#B89358]" />
                  <span>Generate Curated Dossier</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Results View */
        <div className="mt-8 max-w-4xl mx-auto font-sans">
          {/* Dossier Header */}
          <div className="rounded-2xl bg-[#FAF9F6] p-5 sm:p-6 border border-[#E8E6E1] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <span className="text-[0.625rem] font-bold uppercase tracking-widest text-[#B89358] bg-white px-2.5 py-1 rounded border border-[#E8E6E1]">
                Curated Dossier № {Math.floor(1000 + Math.random() * 9000)}
              </span>
              <h3 className="mt-2 font-serif text-lg sm:text-xl font-bold text-[#141312]">
                Your Custom 3-Piece Synergy Bundle
              </h3>
              <p className="text-xs text-neutral-500">
                Calibrated for {VIBE_OPTIONS.find((v) => v.id === selectedVibe)?.title}.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 rounded-xl bg-white hover:bg-neutral-100 text-neutral-700 text-xs font-medium px-3.5 py-2 border border-neutral-200 transition-colors cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reconfigure</span>
              </button>
              <button
                type="button"
                onClick={handleAddAllToWishlist}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#141312] hover:bg-[#262524] text-white text-xs font-semibold px-4 py-2 shadow-xs transition-colors cursor-pointer"
              >
                <Heart className="h-3 w-3 fill-rose-400 text-rose-400" />
                <span>Save All to Bag</span>
              </button>
            </div>
          </div>

          {/* 3 Matched Product Cards */}
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {recommendations.map((item, idx) => {
              const isSaved = wishlist.includes(item.id);
              return (
                <div
                  key={item.id}
                  className="group relative flex flex-col rounded-2xl bg-white p-4 border border-[#E8E6E1] shadow-2xs hover:shadow-md transition-all"
                >
                  <div className="absolute top-3 left-3 z-10 rounded-md bg-[#141312]/90 backdrop-blur-xs text-[#FAF9F6] text-[0.5625rem] font-semibold uppercase tracking-wider px-2 py-0.5">
                    Tier {idx + 1}
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleWishlist(item.id)}
                    className="absolute top-3 right-3 z-10 h-7 w-7 rounded-full bg-white/90 backdrop-blur-xs grid place-items-center shadow-xs text-neutral-500 hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    <Heart className={`h-3.5 w-3.5 ${isSaved ? 'fill-rose-600 text-rose-600' : ''}`} />
                  </button>

                  {/* Image */}
                  <div
                    onClick={() => onProductClick?.(item)}
                    className="relative aspect-video sm:aspect-square rounded-xl overflow-hidden bg-neutral-100 cursor-pointer"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {item.discountPercentage > 0 && (
                      <span className="absolute bottom-2 left-2 rounded bg-[#9B381E] text-white text-[0.5625rem] font-bold px-1.5 py-0.5">
                        -{item.discountPercentage}%
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="mt-3 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[0.625rem] text-neutral-400 font-semibold tracking-wider uppercase mb-1">
                        <span className="text-[#9B381E]">{item.category}</span>
                        <span className="flex items-center gap-0.5 text-neutral-700">
                          <Star className="h-3 w-3 fill-[#B89358] text-[#B89358]" /> {item.rating}
                        </span>
                      </div>

                      <h4
                        onClick={() => onProductClick?.(item)}
                        className="font-semibold text-xs text-neutral-900 line-clamp-2 cursor-pointer hover:text-[#9B381E] transition-colors"
                      >
                        {item.title}
                      </h4>

                      {/* Editorial Verdict */}
                      {item.reviewQuote && (
                        <div className="mt-2 rounded-lg bg-[#FAF9F6] border-l-2 border-[#B89358] p-2 text-[0.6875rem] italic text-neutral-600 font-serif leading-snug">
                          "{item.reviewQuote}"
                        </div>
                      )}
                    </div>

                    {/* Price & Link */}
                    <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-sm text-[#141312]">
                          {formatPHP(item.price)}
                        </span>
                        {item.originalPrice > item.price && (
                          <span className="ml-1.5 text-[0.625rem] text-neutral-400 line-through">
                            {formatPHP(item.originalPrice)}
                          </span>
                        )}
                      </div>

                      <a
                        href={`/go/${item.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => trackAffiliateClick(item.id)}
                        className="inline-flex items-center gap-1 rounded-lg bg-[#141312] hover:bg-[#262524] text-white px-2.5 py-1.5 text-[0.6875rem] font-medium transition-transform hover:scale-105"
                      >
                        <span>Shopee</span>
                        <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bundle Summary */}
          <div className="mt-6 rounded-2xl bg-[#141312] text-white p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-[0.625rem] font-bold uppercase tracking-widest text-[#B89358]">
                Combined Bundle Valuation
              </span>
              <div className="mt-1 flex items-baseline gap-2.5">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-white">
                  {formatPHP(bundleTotal)}
                </span>
                {totalSaved > 0 && (
                  <span className="text-xs text-neutral-400 line-through">
                    {formatPHP(bundleOriginal)}
                  </span>
                )}
                {totalSaved > 0 && (
                  <span className="rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[0.625rem] font-semibold px-2 py-0.5">
                    Net Savings: {formatPHP(totalSaved)}
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-neutral-400 flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Direct Star/Mall verified sellers with Shopee Guarantee protection.</span>
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <a
                href="#all-finds"
                className="flex-1 sm:flex-initial text-center rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-3 border border-white/20 transition-colors"
              >
                Browse Full Catalog
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
