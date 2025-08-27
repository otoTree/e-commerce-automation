'use client';

import { useState, ReactNode } from 'react';
import {
  useFloating,
  useTransitionStyles,
  useClick,
  useDismiss,
  useInteractions,
  offset,
  flip,
  shift,
  FloatingPortal,
  autoUpdate,
} from '@floating-ui/react';

interface HeaderDropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  className?: string;
}

export function HeaderDropdown({ trigger, children, className = '' }: HeaderDropdownProps) {
  const [open, setOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: 'bottom-start',
    strategy: 'fixed',
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(8),
      flip({
        fallbackPlacements: ['bottom-end', 'top-start', 'top-end'],
      }),
      shift({ padding: 16 }),
    ],
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss]);

  const { isMounted, styles } = useTransitionStyles(context, {
    duration: { open: 150, close: 100 },
    initial: {
      opacity: 0,
      transform: 'translateY(-8px) scale(0.95)',
    },
    common: {
      transformOrigin: 'top center',
      transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
    },
  });

  return (
    <>
      <div
        ref={refs.setReference}
        {...getReferenceProps()}
        className={`inline-block ${className}`}
      >
        {trigger}
      </div>

      {open && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={{
              ...floatingStyles,
              ...styles,
              zIndex: 9999,
            }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 focus:outline-none"
            {...getFloatingProps()}
          >
            {children}
          </div>
        </FloatingPortal>
      )}
    </>
  );
}
