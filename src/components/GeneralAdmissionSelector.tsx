import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Minus, Plus, Check } from 'lucide-react';
import { GeneralAdmissionTier } from '../types';
import { useCart } from '../context/CartContext';

interface GeneralAdmissionSelectorProps {
  tiers: GeneralAdmissionTier[];
}

interface GATierRowProps {
  tier: GeneralAdmissionTier;
  count: number;
  onSetQuantity: (tierId: string, quantity: number) => void;
}

const GATierRow = React.memo<GATierRowProps>(({ tier, count, onSetQuantity }) => {
  const isSelected = count > 0;

  return (
    <motion.div
      animate={{
        borderColor: isSelected ? 'var(--theme-accent, #C7A06B)' : undefined,
      }}
      className={`rounded-[2px] border bg-theme-surface p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-shadow ${
        isSelected
          ? 'border-theme-accent shadow-sm shadow-theme-accent/10'
          : 'border-theme-border'
      }`}
    >
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <h4 className="font-display text-base font-medium text-theme-ink">
            {tier.name}
          </h4>
          <span className="rounded-[2px] border border-theme-border px-2 py-0.5 text-xs font-mono font-semibold text-theme-accent">
            ₹{tier.price.toLocaleString('en-IN')}
          </span>
          {isSelected && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center gap-1 rounded-[2px] border border-theme-accent/30 bg-theme-accent/15 px-2 py-0.5 text-[10px] font-mono text-theme-accent"
            >
              <Check className="h-3 w-3" />
              Selected
            </motion.span>
          )}
        </div>
        <p className="text-xs text-theme-muted max-w-md leading-relaxed">
          {tier.description}
        </p>
        <div className="text-[11px] font-mono text-theme-muted/80">
          {tier.available} passes remaining in this tier
        </div>
      </div>

      {/* Quantity Stepper with fluid number animations */}
      <div className="flex items-center self-end sm:self-center gap-3 bg-theme-bg/60 p-1.5 rounded-xl border border-theme-border">
        <motion.button
          type="button"
          whileTap={{ scale: 0.82 }}
          whileHover={{ scale: 1.08 }}
          onClick={() => onSetQuantity(tier.id, count - 1)}
          disabled={count <= 0}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-theme-border bg-theme-surface text-theme-ink disabled:opacity-30 disabled:cursor-not-allowed hover:border-theme-accent focus:outline-none transition-colors"
          aria-label={`Decrease quantity for ${tier.name}`}
        >
          <Minus className="h-3.5 w-3.5" strokeWidth={1.5} />
        </motion.button>

        <div className="relative w-8 h-8 flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.span
              key={count}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="text-sm font-semibold font-mono text-theme-ink absolute"
            >
              {count}
            </motion.span>
          </AnimatePresence>
        </div>

        <motion.button
          type="button"
          whileTap={{ scale: 0.82 }}
          whileHover={{ scale: 1.08 }}
          onClick={() => onSetQuantity(tier.id, count + 1)}
          disabled={count >= 8}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-theme-border bg-theme-surface text-theme-ink disabled:opacity-30 disabled:cursor-not-allowed hover:border-theme-accent focus:outline-none transition-colors"
          aria-label={`Increase quantity for ${tier.name}`}
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
        </motion.button>
      </div>
    </motion.div>
  );
});
GATierRow.displayName = 'GATierRow';

export const GeneralAdmissionSelector: React.FC<GeneralAdmissionSelectorProps> = ({ tiers }) => {
  const { gaQuantities, setGaQuantity, inlineError } = useCart();

  return (
    <div className="w-full space-y-6">
      <div className="border-b border-theme-border pb-3">
        <h3 className="font-display text-lg font-medium text-theme-ink">
          Admission passes
        </h3>
        <p className="text-xs text-theme-muted mt-1">
          Select desired quantity per pass tier. Maximum 8 passes per reservation.
        </p>
      </div>

      {inlineError && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          role="alert"
          className="rounded-[2px] border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-xs text-red-700 dark:text-red-400"
        >
          {inlineError}
        </motion.div>
      )}

      <div className="space-y-4">
        {tiers.map((tier) => (
          <GATierRow
            key={tier.id}
            tier={tier}
            count={gaQuantities[tier.id] || 0}
            onSetQuantity={setGaQuantity}
          />
        ))}
      </div>
    </div>
  );
};
