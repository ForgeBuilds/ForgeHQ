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
    classes: 'banner-warning',
    role: 'status',
  },
  critical: {
    icon: IoAlertCircle,
    classes: 'banner-critical',
    role: 'alert',
  },
  info: {
    icon: IoMegaphone,
    classes: 'banner-info',
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
          className={`banner overflow-hidden ${classes}`}
        >
          <div role={role} aria-atomic="true">
            <div className="banner-inner">
              <Icon aria-hidden="true" className="h-4 w-4 shrink-0 opacity-60" />
              <p>{message}</p>

              {isClosable && (
                <button
                  type="button"
                  onClick={() => setIsVisible(false)}
                  aria-label="Dismiss notification"
                >
                  <IoClose aria-hidden="true" className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
