// resources/js/layouts/app-layout.tsx
import React from 'react';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';

interface AppLayoutProps {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  title?: string;
  hideSidebar?: boolean; // Tambahkan prop ini
}

export default function AppLayout({ children, breadcrumbs, title, hideSidebar = false }: AppLayoutProps) {
  return (
    <AppLayoutTemplate 
      breadcrumbs={breadcrumbs} 
      title={title}
      hideSidebar={hideSidebar}
    >
      {children}
    </AppLayoutTemplate>
  );
}