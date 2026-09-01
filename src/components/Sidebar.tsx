'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  TrendingUp,
  Megaphone,
  Camera,
  Store,
  Truck,
  Users,
  FileText,
  Sparkles,
  X,
  LogOut,
  Settings,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: <LayoutDashboard size={16} /> },
  { label: 'Finance', href: '/finance', icon: <TrendingUp size={16} /> },
  { label: 'Marketing', href: '/marketing', icon: <Megaphone size={16} /> },
  { label: 'Instagram', href: '/instagram', icon: <Camera size={16} /> },
  { label: 'Marketplace', href: '/marketplace', icon: <Store size={16} /> },
  { label: 'Operations', href: '/operations', icon: <Truck size={16} /> },
  { label: 'Customers & Reviews', href: '/customers', icon: <Users size={16} /> },
  { label: 'Reports', href: '/reports', icon: <FileText size={16} /> },
  { label: 'Configuration', href: '/configuration', icon: <Settings size={16} /> },
];

interface SidebarProps {
  currentPath?: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-48 xl:w-52 flex-col border-r border-gray-100 bg-white flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      <aside
        className={`fixed left-0 top-0 z-30 h-full w-60 flex-col border-r border-gray-100 bg-white shadow-lg transition-transform duration-300 ease-in-out lg:hidden flex ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <AppLogo size={26} />
            <span className="font-bold text-sm text-gray-900 tracking-tight">EcomCommand</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close navigation"
          >
            <X size={16} className="text-gray-400" />
          </button>
        </div>
        <SidebarContent onItemClick={onClose} />
      </aside>
    </>
  );
}

function SidebarContent({
  onItemClick,
}: {
  currentPath?: string;
  onItemClick?: () => void;
}) {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const currentPath = usePathname();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/login');
      router.refresh();
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const initials = displayName.charAt(0).toUpperCase();
  const roleLabel = user?.user_metadata?.role === 'admin' ? 'Admin' : 'Owner';

  return (
    <div className="flex flex-col h-full">
      {/* Logo — desktop only */}
      <div className="hidden lg:flex items-center gap-2.5 px-4 py-4 border-b border-gray-100">
        <AppLogo size={26} />
        <span className="font-bold text-sm text-gray-900 tracking-tight">EcomCommand</span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map((item) => {
          const isActive = currentPath === item.href;
          return (
            <Link
              key={`nav-${item.href}`}
              href={item.href}
              onClick={onItemClick}
              className={`nav-item ${isActive ? 'nav-item-active' : ''}`}
            >
              <span className="flex-shrink-0 text-gray-400">{item.icon}</span>
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-auto text-xs font-semibold bg-red-100 text-red-600 rounded-full px-1.5 py-0.5">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        <div className="my-2 border-t border-gray-100" />

        <Link
          href="/ask-ai"
          onClick={onItemClick}
          className={`nav-item ${currentPath === '/ask-ai' ? 'nav-item-active' : ''}`}
        >
          <Sparkles size={16} className="text-violet-400 flex-shrink-0" />
          <span>Ask AI</span>
          <span className="ml-auto text-xs font-semibold bg-violet-50 text-violet-600 rounded-full px-1.5 py-0.5">
            AI
          </span>
        </Link>
      </nav>

      {/* Account chip */}
      <div className="p-3 border-t border-gray-100">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-white">{initials}</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-gray-800 truncate">{displayName}</p>
            <p className="text-xs text-gray-400">{roleLabel}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="p-1 rounded-md hover:bg-gray-100 transition-colors flex-shrink-0"
            title="Sign out"
          >
            <LogOut size={13} className="text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
}