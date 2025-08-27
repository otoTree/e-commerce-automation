'use client';

import { useState, ReactNode, useRef, useEffect } from 'react';

interface SimpleDropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  className?: string;
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
}

export function SimpleDropdown({ 
  trigger, 
  children, 
  className = '',
  placement = 'bottom-start'
}: SimpleDropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [open]);

  // ESC键关闭
  const handleEscapeKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setOpen(false);
    }
  };

  const getDropdownPosition = () => {
    const positions = {
      'bottom-start': 'top-full left-0',
      'bottom-end': 'top-full right-0', 
      'top-start': 'bottom-full left-0',
      'top-end': 'bottom-full right-0'
    };
    return positions[placement];
  };

  return (
    <div className={`relative ${className}`}>
      <div
        ref={triggerRef}
        onClick={() => setOpen(!open)}
        className="cursor-pointer"
      >
        {trigger}
      </div>

      {open && (
        <>
          {/* 背景遮罩 - 用于点击关闭 */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setOpen(false)}
          />
          
          {/* 下拉菜单 */}
          <div
            ref={dropdownRef}
            className={`
              absolute z-50 mt-2 min-w-max
              ${getDropdownPosition()}
              bg-white dark:bg-gray-800 
              rounded-lg shadow-xl border border-gray-200 dark:border-gray-700
              transform transition-all duration-150 ease-out
              opacity-100 scale-100 translate-y-0
            `}
            style={{
              transformOrigin: placement.includes('top') ? 'bottom' : 'top'
            }}
          >
            {children}
          </div>
        </>
      )}
    </div>
  );
}
