'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  { label: 'Dashboard', href: '/', icon: <LayoutDashboard size={18} /> },
  { label: 'Finance', href: '/finance', icon: <TrendingUp size={18} /> },
  { label: 'Marketing', href: '/marketing', icon: <Megaphone size={18} /> },
  { label: 'Instagram', href: '/instagram', icon: <Camera size={18} /> },
  { label: 'Marketplace', href: '/marketplace', icon: <Store size={18} /> },
  { label: 'Operations', href: '/operations', icon: <Truck size={18} /> },
  { label: 'Customers & Reviews', href: '/customers', icon: <Users size={18} /> },
  { label: 'Reports', href: '/reports', icon: <FileText size={18} /> },
  { label: 'Configuration', href: '/configuration', icon: <Settings size={18} /> },
];

interface SidebarProps {
  currentPath: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ currentPath, isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-52 xl:w-56 flex-col border-r border-border bg-card flex-shrink-0">
        <SidebarContent currentPath={currentPath} />
      </aside>

      {/* Mobile drawer */}
      <aside
        className={`fixed left-0 top-0 z-30 h-full w-64 flex-col border-r border-border bg-card shadow-card-lift transition-transform duration-300 ease-in-out lg:hidden flex ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <AppLogo size={28} />
            <span className="font-bold text-base text-foreground tracking-tight">D2C Dashboard</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
            aria-label="Close navigation"
          >
            <X size={18} className="text-muted-foreground" />
          </button>
        </div>
        <SidebarContent currentPath={currentPath} onItemClick={onClose} />
      </aside>
    </>
  );
}

function SidebarContent({
  currentPath,
  onItemClick,
}: {
  currentPath: string;
  onItemClick?: () => void;
}) {
  const { user, signOut } = useAuth();
  const router = useRouter();

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
      <div className="hidden lg:flex items-center gap-2.5 px-4 py-4 border-b border-border">
        <AppLogo size={28} />
        <span className="font-bold text-sm text-foreground tracking-tight">D2C Dashboard</span>
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
              <span className="flex-shrink-0">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
              {item.badge && (
                <span className="ml-auto text-xs font-semibold bg-negative text-white rounded-full px-1.5 py-0.5">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        <div className="my-2 border-t border-border" />

        <Link
          href="/ask-ai"
          onClick={onItemClick}
          className={`nav-item ${currentPath === '/ask-ai' ? 'nav-item-active' : ''}`}
        >
          <Sparkles size={18} />
          <span className="text-sm">Ask AI</span>
          <span className="ml-auto text-xs font-semibold bg-violet-100 text-violet-700 rounded-full px-1.5 py-0.5">
            AI
          </span>
        </Link>
      </nav>

      {/* Account chip */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-muted transition-colors">
          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-primary-foreground">{initials}</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-600 text-foreground truncate">{displayName}</p>
            <p className="text-xs text-muted-foreground">{roleLabel}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="p-1 rounded-md hover:bg-muted-foreground/10 transition-colors flex-shrink-0"
            title="Sign out"
          >
            <LogOut size={14} className="text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}