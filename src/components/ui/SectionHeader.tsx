import React from 'react';

interface SectionHeaderProps {
  icon?: React.ReactNode;
  label: string;
  action?: React.ReactNode;
}

export default function SectionHeader({ icon, label, action }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
      <div className="flex items-center gap-2">
        {icon && <span className="text-muted-foreground">{icon}</span>}
        <span className="text-xs font-700 uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}