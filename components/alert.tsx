import { useEffect, useState } from 'react';
import { IoAlertCircle, IoClose, IoMegaphone, IoWarning } from 'react-icons/io5';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

export type BannerVariant = 'warning' | 'critical' | 'info';

interface MaintenanceBannerProps {
  message: string;
  variant?: BannerVariant;
  isClosable?: boolean;
  autoDismissSecs?: number;
}

const variantStyles: Record<
  BannerVariant,
  { icon: typeof IoWarning; classes: string; role: 'alert' | 'status' }
> = {
  warning: {
    icon: IoWarning,
    classes: 'border-amber-400/20 bg-amber-950/80 text-amber-100',
    role: 'status',
  },
  critical: {
    icon: IoAlertCircle,
    classes: 'border-rose-400/25 bg-rose-950/85 text-rose-100',
    role: 'alert',
  },
  info: {
    icon: IoMegaphone,
    classes: 'border-white/10 bg-zinc-950/95 text-white',
    role: 'status',
  },
};

export function MaintenanceBanner({
  message,
  variant = 'warning',
  isClosable = true,
  autoDismissSecs,
}: MaintenanceBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const shouldReduceMotion = useReducedMotion();
  const { icon: Icon, classes, role } = variantStyles[variant];

  useEffect(() => {
    if (
      !isVisible ||
      !Number.isFinite(autoDismissSecs) ||
      autoDismissSecs === undefined ||
      autoDismissSecs <= 0
    ) {
      return;
    }

    const timer = window.setTimeout(() => setIsVisible(false), autoDismissSecs * 1000);
    return () => window.clearTimeout(timer);
  }, [autoDismissSecs, isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.2, ease: 'easeOut' }}
          className={`w-full overflow-hidden border-b backdrop-blur-md ${classes}`}
        >
          <div role={role} aria-atomic="true">
            <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
              <Icon aria-hidden="true" className="h-5 w-5 shrink-0 opacity-90" />
              <p className="min-w-0 flex-1 text-sm font-medium leading-6 tracking-wide sm:text-base">
                {message}
              </p>

              {isClosable && (
                <button
                  type="button"
                  onClick={() => setIsVisible(false)}
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-current transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
                  aria-label="Dismiss notification"
                >
                  <IoClose aria-hidden="true" className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
