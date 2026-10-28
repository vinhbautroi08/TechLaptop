import React from 'react';
import { User } from '../types';

export type ActivePage =
  | 'home'
  | 'products'
  | 'product-detail'
  | 'cart'
  | 'checkout'
  | 'order-success'
  | 'account'
  | 'admin'
  | 'deliverables';

interface NavbarProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  cartCount: number;
  currentUser: User | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  onNavigate,
  cartCount,
  currentUser,
}) => {
  const navItems: { id: ActivePage; label: string }[] = [
    { id: 'home', label: 'Trang chủ' },
    { id: 'products', label: 'Sản phẩm' },
    { id: 'account', label: currentUser ? `Tài khoản (${currentUser.username})` : 'Tài khoản' },
    { id: 'admin', label: 'Quản trị Admin' },
    { id: 'deliverables', label: 'Đồ án & Code PHP' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-4">
        {/* Zone 1: Brand Wordmark (single text element, one line) */}
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="text-xl font-bold tracking-tight text-white hover:text-blue-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          TechLaptop
        </button>

        {/* Zone 2: 5 single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          {navItems.map((item) => {
            const isActive =
              activePage === item.id ||
              (item.id === 'products' && activePage === 'product-detail') ||
              (item.id === 'account' && activePage === 'order-success');
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors cursor-pointer ${
                  isActive
                    ? 'border-blue-400 text-white font-semibold'
                    : 'border-transparent text-slate-300 hover:text-white hover:border-slate-500'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('cart')}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors whitespace-nowrap shrink-0 cursor-pointer tabular-nums"
          >
            Giỏ hàng ({cartCount})
          </button>
        </div>
      </div>

      {/* Mobile navigation strip */}
      <div className="flex md:hidden items-center gap-4 overflow-x-auto px-6 py-2.5 bg-slate-950/70 border-t border-slate-800 text-xs font-medium">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onNavigate(item.id)}
            className={`whitespace-nowrap shrink-0 py-1 ${
              activePage === item.id ? 'text-blue-400 font-semibold' : 'text-slate-300'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
