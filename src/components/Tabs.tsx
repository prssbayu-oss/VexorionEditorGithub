import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  count?: number | string;
  badge?: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
  variant?: 'underline' | 'pills';
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = '',
  variant = 'underline',
}) => {
  return (
    <div
      className={`flex items-center gap-1 overflow-x-auto no-scrollbar select-none w-full max-w-full whitespace-nowrap scroll-smooth ${
        variant === 'underline' ? 'border-b border-[#30363d]' : 'p-1 bg-[#161b22] rounded-lg border border-[#30363d]'
      } ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        if (variant === 'pills') {
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all shrink-0 whitespace-nowrap ${
                isActive
                  ? 'bg-[#21262d] text-[#f0f6fc] shadow-xs'
                  : 'text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#21262d]/50'
              }`}
            >
              {tab.icon && <span className="shrink-0">{tab.icon}</span>}
              <span className="whitespace-nowrap">{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold shrink-0 ${
                    isActive ? 'bg-[#30363d] text-[#f0f6fc]' : 'bg-[#21262d] text-[#8b949e]'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        }

        // Underline modern GitHub tab
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`relative flex items-center gap-2 px-3 py-2 text-xs md:text-sm font-medium transition-colors cursor-pointer shrink-0 whitespace-nowrap ${
              isActive
                ? 'text-[#f0f6fc]'
                : 'text-[#8b949e] hover:text-[#c9d1d9]'
            }`}
          >
            {tab.icon && <span className="shrink-0 text-current">{tab.icon}</span>}
            <span className="whitespace-nowrap">{tab.label}</span>

            {tab.count !== undefined && (
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                  isActive
                    ? 'bg-[rgba(56,139,253,0.15)] text-[#58a6ff]'
                    : 'bg-[#21262d] text-[#8b949e]'
                }`}
              >
                {tab.count}
              </span>
            )}

            {tab.badge}

            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#fd8c73] rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
};
