import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface DropdownItem {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  badge?: string;
  isDefault?: boolean;
}

export interface DropdownProps {
  items: DropdownItem[];
  selectedId?: string;
  onSelect: (item: DropdownItem) => void;
  trigger?: React.ReactNode;
  label?: string;
  icon?: React.ReactNode;
  headerTitle?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  align?: 'left' | 'right';
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  items,
  selectedId,
  onSelect,
  trigger,
  label = 'Select',
  icon,
  headerTitle,
  searchable = false,
  searchPlaceholder = 'Filter...',
  align = 'left',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const filteredItems = items.filter(item =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  const selectedItem = items.find(i => i.id === selectedId);

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {trigger ? (
        <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] border border-[#30363d] rounded-md transition-colors shadow-xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#58a6ff]"
        >
          {icon && <span className="text-[#8b949e]">{icon}</span>}
          <span>{selectedItem ? selectedItem.label : label}</span>
          <ChevronDown className="w-3.5 h-3.5 text-[#8b949e]" />
        </button>
      )}

      {isOpen && (
        <div
          className={`absolute ${
            align === 'right' ? 'right-0' : 'left-0'
          } mt-1.5 w-64 bg-[#161b22] border border-[#30363d] rounded-lg shadow-xl z-50 overflow-hidden text-left`}
        >
          {headerTitle && (
            <div className="px-3 py-2 border-b border-[#30363d] text-xs font-semibold text-[#f0f6fc] bg-[#161b22]">
              {headerTitle}
            </div>
          )}

          {searchable && (
            <div className="p-2 border-b border-[#30363d]">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                autoFocus
                className="w-full bg-[#0d1117] text-xs text-[#f0f6fc] placeholder-[#8b949e] border border-[#30363d] rounded px-2.5 py-1.5 focus:outline-none focus:border-[#58a6ff]"
              />
            </div>
          )}

          <div className="max-h-56 overflow-y-auto py-1">
            {filteredItems.length === 0 ? (
              <div className="px-3 py-3 text-xs text-[#8b949e] text-center">No matching items</div>
            ) : (
              filteredItems.map((item) => {
                const isSelected = item.id === selectedId;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onSelect(item);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[rgba(56,139,253,0.1)] text-[#58a6ff] font-medium'
                        : 'text-[#c9d1d9] hover:bg-[#21262d] hover:text-[#f0f6fc]'
                    }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      {item.icon && <span className="shrink-0 text-[#8b949e]">{item.icon}</span>}
                      <span className="truncate">{item.label}</span>
                      {item.isDefault && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded border border-[#30363d] text-[#8b949e]">
                          default
                        </span>
                      )}
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#58a6ff] shrink-0 ml-2" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
