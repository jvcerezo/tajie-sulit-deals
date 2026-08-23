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
    title: 'Minimalist WFH Desk',
    subtitle: 'Zero cable clutter, ergonomic flow, and deep focus aesthetics',
    icon: Laptop,
    categoryMatch: ['Tech & Setup'],
    tagsMatch: ['Desk Setup', 'WFH Must-Have', 'Clean Desk', 'Ergonomic'],
  },
  {
    id: 'coffee-nook',
    title: 'Cozy Home Cafe',
    subtitle: 'Morning slow brews, aesthetic glassware, and barista essentials',
    icon: Coffee,
    categoryMatch: ['Kitchen & Coffee'],
    tagsMatch: ['Home Cafe', 'Aesthetic Kitchen', 'Morning Routine'],
  },
  {
    id: 'night-study',
    title: 'Midnight Study & Lo-Fi Loft',
    subtitle: 'Warm ambient lighting, creamy thocky keyboard sounds & chill vibes',
    icon: Moon,
    categoryMatch: ['Tech & Setup'],
    tagsMatch: ['Creamy Thock', 'Anti-Glare', 'Desk Glow Up'],
  },
  {
    id: 'creator-starter',
    title: 'TikTok Creator & Aesthetic Room',
    subtitle: 'High-contrast desk flair, creator lighting, and viral photo backdrops',
    icon: Video,
    categoryMatch: ['Viral TikTok', 'Tech & Setup', 'Home & Living'],
    tagsMatch: ['TikTok Viral', 'Desk Glow Up', 'Room Aesthetic'],
  },
  {
    id: 'budget-gems',
    title: 'Dangerously Cheap Hidden Gems',
    subtitle: 'Under ₱300 holy grails that feel 5x more expensive than they cost',
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
    label: '🪴 Super Sulit / Student Budget',
    detail: 'Under ₱500 total bundle ceiling',
    maxBudget: 500,
  },
  {
    id: 'budget-sweetspot',
    label: '🛋️ The Sweet Spot Upgrade',
    detail: '₱500 - ₱1,500 for high-value upgrades',
    maxBudget: 1500,
  },
  {
    id: 'budget-premium',
    label: '👑 Dream Setup / Buy It For Life',
    detail: '₱1,500+ for top-tier holy grail pieces',
    maxBudget: 10000,
  },
  {
    id: 'budget-all',
    label: '🎁 Surprise Me / Value-First',
    detail: 'Handpick the best bang-for-buck pieces',
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
    label: '🔊 Sensory & Acoustic Feel',
    detail: 'Creamy keyboard sounds, tactile switches, satisfying clicks',
    tagFilter: 'Creamy Thock',
  },
  {
    id: 'minimalist',
    label: '🪴 Minimalist & Zero Clutter',
    detail: 'Clean desk mat, anti-glare lighting, organized aesthetics',
    tagFilter: 'Desk Setup',
  },
  {
    id: 'tested-viral',
    label: '⭐ Verified Viral Must-Haves',
    detail: 'Top 5-star ratings with thousands of verified Shopee buyer reviews',
    tagFilter: 'TikTok Viral',
  },
  {
    id: 'pure-utility',
    label: '⚡ Daily Practicality & Speed',
    detail: 'Things you will genuinely use every single day',
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
      particleCount: 50,
      spread: 70,
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
      particleCount: 30,
      spread: 50,
    });
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#F9F6F1] via-[#F4EDE4] to-[#EFE7DC] border border-[#E5DBCC] shadow-xl p-6 sm:p-8 md:p-10 text-stone-900 transition-all">
      {/* Decorative ambient background accents */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-orange-600/10 blur-3xl pointer-events-none" />

      {/* Header / Intro */}
      <div className="relative max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-xs border border-stone-200/80 px-3.5 py-1 text-xs font-semibold text-stone-700 shadow-2xs">
          <Sparkles className="h-3.5 w-3.5 text-amber-600" />
          <span>Tajie's Personal Budol Matchmaker</span>
        </div>

        <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight leading-tight">
          Stop scrolling through 10,000 items. <br className="hidden sm:block" />
          <span className="text-[#C8522C]">Let's build your exact holy grail bundle.</span>
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed max-w-lg mx-auto">
          Answer 3 quick questions about your space, vibe, and budget. I'll handpick 3 tested pieces you won't regret buying.
        </p>
      </div>

      {!isCalculated ? (
        <div className="mt-8 max-w-3xl mx-auto">
          {/* Step Progress Bar */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8">
            {[
              { num: 1, title: 'The Vibe' },
              { num: 2, title: 'Budget' },
              { num: 3, title: 'Priority' },
            ].map((s) => (
              <button
                key={s.num}
                type="button"
                onClick={() => setStep(s.num)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  step === s.num
                    ? 'bg-[#C8522C] text-white shadow-md'
                    : step > s.num
                    ? 'bg-stone-200 text-stone-700'
                    : 'bg-white/50 text-stone-400 border border-stone-200'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-white/20 grid place-items-center text-[0.625rem]">
                  {s.num}
                </span>
                <span className="hidden sm:inline">{s.title}</span>
              </button>
            ))}
          </div>

          {/* Step 1: Vibe Selection */}
          {step === 1 && (
            <div className="space-y-3">
              <div className="text-center sm:text-left mb-4">
                <h3 className="text-sm sm:text-base font-bold text-stone-800">
                  Step 1: What space or vibe are you crafting right now?
                </h3>
                <p className="text-xs text-stone-500">Pick the primary theme for your room or setup.</p>
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
                      className={`group relative text-left p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                        isSelected
                          ? 'bg-white border-[#C8522C] shadow-md ring-2 ring-[#C8522C]/20'
                          : 'bg-white/70 border-stone-200/80 hover:bg-white hover:border-stone-300'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl grid place-items-center shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-[#C8522C] text-white'
                            : 'bg-stone-100 text-stone-600 group-hover:bg-amber-100 group-hover:text-amber-800'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-stone-900 group-hover:text-[#C8522C] transition-colors">
                            {v.title}
                          </h4>
                          {isSelected && <CheckCircle2 className="h-4 w-4 text-[#C8522C] shrink-0" />}
                        </div>
                        <p className="mt-0.5 text-xs text-stone-500 leading-snug">{v.subtitle}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#C8522C] text-white px-5 py-2.5 text-xs font-bold shadow-md hover:bg-[#B34420] transition-colors cursor-pointer"
                >
                  <span>Next: Set Budget</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Budget Range */}
          {step === 2 && (
            <div className="space-y-3">
              <div className="text-center sm:text-left mb-4">
                <h3 className="text-sm sm:text-base font-bold text-stone-800">
                  Step 2: What is your total budget goal?
                </h3>
                <p className="text-xs text-stone-500">I'll ensure the handpicked items fit your wallet comfortably.</p>
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
                          ? 'bg-white border-[#C8522C] shadow-md ring-2 ring-[#C8522C]/20'
                          : 'bg-white/70 border-stone-200/80 hover:bg-white hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-stone-900">{b.label}</h4>
                        {isSelected && <CheckCircle2 className="h-4 w-4 text-[#C8522C] shrink-0" />}
                      </div>
                      <p className="mt-1 text-xs text-stone-500">{b.detail}</p>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-stone-600 hover:text-stone-900 px-3 py-2 cursor-pointer"
                >
                  ← Back to Vibe
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#C8522C] text-white px-5 py-2.5 text-xs font-bold shadow-md hover:bg-[#B34420] transition-colors cursor-pointer"
                >
                  <span>Next: Choose Priority</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Priority */}
          {step === 3 && (
            <div className="space-y-3">
              <div className="text-center sm:text-left mb-4">
                <h3 className="text-sm sm:text-base font-bold text-stone-800">
                  Step 3: What matters most to you right now?
                </h3>
                <p className="text-xs text-stone-500">Pick your top decisive factor.</p>
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
                          ? 'bg-white border-[#C8522C] shadow-md ring-2 ring-[#C8522C]/20'
                          : 'bg-white/70 border-stone-200/80 hover:bg-white hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-stone-900">{p.label}</h4>
                        {isSelected && <CheckCircle2 className="h-4 w-4 text-[#C8522C] shrink-0" />}
                      </div>
                      <p className="mt-1 text-xs text-stone-500">{p.detail}</p>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs font-bold text-stone-600 hover:text-stone-900 px-3 py-2 cursor-pointer"
                >
                  ← Back to Budget
                </button>
                <button
                  type="button"
                  onClick={handleCalculate}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C8522C] to-amber-600 hover:from-[#B34420] hover:to-amber-700 text-white px-6 py-3 text-sm font-extrabold shadow-lg transition-transform hover:scale-[1.02] cursor-pointer"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Reveal My Handpicked Bundle</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Results / Curated Prescription */
        <div className="mt-8 max-w-4xl mx-auto">
          {/* Prescription Banner */}
          <div className="rounded-2xl bg-white/90 backdrop-blur-md p-5 border border-stone-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <span className="text-[0.6875rem] font-extrabold uppercase tracking-wider text-[#C8522C] bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                ✨ Tajie's Handpicked Prescription
              </span>
              <h3 className="mt-1.5 text-base sm:text-lg font-black text-stone-900">
                Your Curated 3-Piece Holy Grail Match
              </h3>
              <p className="text-xs text-stone-600">
                Tailored for {VIBE_OPTIONS.find((v) => v.id === selectedVibe)?.title} on a sensible budget.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold px-3 py-2 transition-colors cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Retake Quiz</span>
              </button>
              <button
                type="button"
                onClick={handleAddAllToWishlist}
                className="inline-flex items-center gap-1.5 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-bold px-4 py-2 shadow-md transition-colors cursor-pointer"
              >
                <Heart className="h-3.5 w-3.5 fill-rose-400 text-rose-400" />
                <span>Save All 3</span>
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
                  className="group relative flex flex-col rounded-2xl bg-white p-4 border border-stone-200/90 shadow-sm hover:shadow-lg transition-all"
                >
                  {/* Step index badge */}
                  <div className="absolute top-3 left-3 z-10 rounded-full bg-stone-900/80 backdrop-blur-xs text-white text-[0.625rem] font-extrabold px-2 py-0.5">
                    Match #{idx + 1}
                  </div>

                  {/* Wishlist quick toggle */}
                  <button
                    type="button"
                    onClick={() => toggleWishlist(item.id)}
                    className="absolute top-3 right-3 z-10 h-7 w-7 rounded-full bg-white/90 backdrop-blur-xs grid place-items-center shadow-xs text-stone-500 hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    <Heart className={`h-3.5 w-3.5 ${isSaved ? 'fill-rose-600 text-rose-600' : ''}`} />
                  </button>

                  {/* Image */}
                  <div
                    onClick={() => onProductClick?.(item)}
                    className="relative aspect-video sm:aspect-square rounded-xl overflow-hidden bg-stone-100 cursor-pointer"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {item.discountPercentage > 0 && (
                      <span className="absolute bottom-2 left-2 rounded bg-red-600 text-white text-[0.625rem] font-black px-1.5 py-0.5">
                        -{item.discountPercentage}%
                      </span>
                    )}
                  </div>

                  {/* Item info */}
                  <div className="mt-3 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[0.6875rem] text-stone-500 font-bold mb-1">
                        <span className="text-[#C8522C] uppercase">{item.category}</span>
                        <span className="flex items-center gap-0.5 text-amber-600">
                          <Star className="h-3 w-3 fill-amber-500" /> {item.rating}
                        </span>
                      </div>

                      <h4
                        onClick={() => onProductClick?.(item)}
                        className="font-bold text-xs sm:text-sm text-stone-900 line-clamp-2 cursor-pointer hover:text-[#C8522C] transition-colors"
                      >
                        {item.title}
                      </h4>

                      {/* Tajie Honest Note */}
                      {item.reviewQuote && (
                        <div className="mt-2 rounded-lg bg-[#FAF6F0] border border-[#EBE3D7] p-2 text-[0.6875rem] text-stone-700 italic">
                          <span className="font-bold not-italic text-stone-900 block text-[0.625rem]">
                            💬 Why Tajie Picked This:
                          </span>
                          "{item.reviewQuote}"
                        </div>
                      )}
                    </div>

                    {/* Price & Shopee Link */}
                    <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between">
                      <div>
                        <span className="font-extrabold text-sm text-[#C8522C]">
                          {formatPHP(item.price)}
                        </span>
                        {item.originalPrice > item.price && (
                          <span className="ml-1.5 text-[0.625rem] text-stone-400 line-through">
                            {formatPHP(item.originalPrice)}
                          </span>
                        )}
                      </div>

                      <a
                        href={`/go/${item.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => trackAffiliateClick(item.id)}
                        className="inline-flex items-center gap-1 rounded-lg bg-[#C8522C] hover:bg-[#B34420] text-white px-2.5 py-1.5 text-[0.6875rem] font-bold shadow-xs transition-transform hover:scale-105"
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

          {/* Bundle Savings Summary Tray */}
          <div className="mt-6 rounded-2xl bg-stone-900 text-white p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-[0.6875rem] font-bold uppercase tracking-wider text-amber-400">
                Total 3-Piece Bundle Price
              </span>
              <div className="mt-1 flex items-baseline gap-2.5">
                <span className="text-2xl sm:text-3xl font-black text-white">
                  {formatPHP(bundleTotal)}
                </span>
                {totalSaved > 0 && (
                  <span className="text-xs text-stone-400 line-through">
                    {formatPHP(bundleOriginal)}
                  </span>
                )}
                {totalSaved > 0 && (
                  <span className="rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[0.6875rem] font-bold px-2 py-0.5">
                    Save {formatPHP(totalSaved)} with vouchers
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-stone-400">
                All 3 items are verified Star/Mall sellers with cash-on-delivery & Shopee guarantee.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <a
                href="#all-finds"
                className="flex-1 sm:flex-initial text-center rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-3 border border-white/20 transition-colors"
              >
                Browse More Finds
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
