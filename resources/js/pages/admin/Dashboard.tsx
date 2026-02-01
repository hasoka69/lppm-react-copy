import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import {
  Activity,
  Users,
  Server,
  Database,
  ShieldAlert,
  FileText,
  Settings,
  HardDrive,
  Terminal,
  Cpu,
  Globe
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Super Admin', href: '/admin/dashboard' },
  { title: 'Command Center', href: '#' },
];

interface DashboardProps {
  stats: {
    users: {
      total: number;
      dosen: number;
      reviewer: number;
      kaprodi: number;
      admin: number;
    };
    proposals: {
      penelitian: number;
      pengabdian: number;
      total_funds: number;
    };
    system: {
      php_version: string;
      laravel_version: string;
      server_os: string;
      database_connection: string;
    };
  };
}

export default function DashboardAdmin({ stats }: DashboardProps) {

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs} hideSidebar={true}>
      <Head title="Super Admin Command Center" />

      <div className="p-6 space-y-6 bg-slate-50/50 min-h-screen">

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="outline" className="border-green-400 text-green-400 animate-pulse bg-green-400/10">
                SYSTEM ONLINE
              </Badge>
              <span className="text-slate-400 text-xs font-mono">
                v{stats.system.laravel_version}
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">System Overseer</h1>
            <p className="text-slate-300 mt-1 max-w-xl text-sm">
              Real-time monitoring and control center for LPPM Application. You have full root access.
            </p>
          </div>
          <div className="relative z-10 mt-6 md:mt-0 flex gap-3">
            <Link href="/lppm/settings">
              <Button variant="secondary" className="bg-slate-700 hover:bg-slate-600 text-white border-slate-600">
                <Settings className="mr-2 h-4 w-4" /> System Config
              </Button>
            </Link>
            <Link href="/audit-logs">
              <Button variant="outline" className="bg-transparent border-slate-600 text-slate-200 hover:bg-slate-800 hover:text-white">
                <Terminal className="mr-2 h-4 w-4" /> View Logs
              </Button>
            </Link>
          </div>

          {/* Background Decoration */}
          <div className="absolute right-0 top-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          <div className="absolute left-0 bottom-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>
        </div>

        {/* System Vital Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <h3 className="text-2xl font-bold mt-1">{stats.users.total}</h3>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <Users className="h-3 w-3 mr-1" /> Active Accounts
                </p>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                <Users className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">LPPM Proposals</p>
                <h3 className="text-2xl font-bold mt-1">
                  {stats.proposals.penelitian + stats.proposals.pengabdian}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Penelitian & Pengabdian
                </p>
              </div>
              <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                <FileText className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Funds Disbursed</p>
                <h3 className="text-xl font-bold mt-1 tracking-tight">
                  {formatCurrency(stats.proposals.total_funds)}
                </h3>
                <p className="text-xs text-amber-600 mt-1">
                  Total Granted
                </p>
              </div>
              <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                <Activity className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">System Health</p>
                <h3 className="text-2xl font-bold mt-1 text-green-600">Stable</h3>
                <p className="text-xs text-muted-foreground mt-1 font-mono">
                  PHP {stats.system.php_version}
                </p>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                <Server className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* User Distribution Column */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-indigo-500" />
                Role Distribution
              </CardTitle>
              <CardDescription>Breakdown of system access levels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span className="font-medium text-sm">Super Admin</span>
                </div>
                <span className="font-bold text-slate-700">{stats.users.admin}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="font-medium text-sm">Dosen</span>
                </div>
                <span className="font-bold text-slate-700">{stats.users.dosen}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <span className="font-medium text-sm">Kaprodi</span>
                </div>
                <span className="font-bold text-slate-700">{stats.users.kaprodi}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <span className="font-medium text-sm">Reviewer</span>
                </div>
                <span className="font-bold text-slate-700">{stats.users.reviewer}</span>
              </div>

              <div className="pt-4 mt-4 border-t">
                <Link href={route('lppm.users.index')}>
                  <Button className="w-full" variant="outline">Manage All Users</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Quick Shortcuts & System Info */}
          <div className="lg:col-span-2 space-y-6">

            {/* Quick Command Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href={route('lppm.users.index')} className="group">
                <Card className="hover:border-blue-500 hover:shadow-md transition-all cursor-pointer h-full">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-full mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Users className="h-5 w-5" />
                    </div>
                    <span className="font-semibold text-sm">User Management</span>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/lppm/data" className="group">
                <Card className="hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer h-full">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                    <div className="p-3 bg-indigo-100 text-indigo-600 rounded-full mb-3 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Database className="h-5 w-5" />
                    </div>
                    <span className="font-semibold text-sm">Master Data</span>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/backup" className="group">
                <Card className="hover:border-amber-500 hover:shadow-md transition-all cursor-pointer h-full">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                    <div className="p-3 bg-amber-100 text-amber-600 rounded-full mb-3 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                      <HardDrive className="h-5 w-5" />
                    </div>
                    <span className="font-semibold text-sm">Backups</span>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/audit-logs" className="group">
                <Card className="hover:border-slate-500 hover:shadow-md transition-all cursor-pointer h-full">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                    <div className="p-3 bg-slate-100 text-slate-600 rounded-full mb-3 group-hover:bg-slate-600 group-hover:text-white transition-colors">
                      <Terminal className="h-5 w-5" />
                    </div>
                    <span className="font-semibold text-sm">System Logs</span>
                  </CardContent>
                </Card>
              </Link>
            </div>

            {/* Technical Info */}
            <Card className="bg-slate-900 text-slate-400 border-slate-800">
              <CardHeader>
                <CardTitle className="text-slate-200 text-base flex items-center gap-2">
                  <Cpu className="h-4 w-4" /> Server Environment
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm font-mono">
                <div>
                  <span className="block text-slate-500 text-xs uppercase mb-1">PHP Version</span>
                  <span className="text-slate-200">{stats.system.php_version}</span>
                </div>
                <div>
                  <span className="block text-slate-500 text-xs uppercase mb-1">Laravel Framework</span>
                  <span className="text-slate-200">v{stats.system.laravel_version}</span>
                </div>
                <div>
                  <span className="block text-slate-500 text-xs uppercase mb-1">OS</span>
                  <span className="text-slate-200">{stats.system.server_os}</span>
                </div>
                <div>
                  <span className="block text-slate-500 text-xs uppercase mb-1">Database</span>
                  <span className="text-slate-200 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    {stats.system.database_connection}
                  </span>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>

      </div>
    </AppLayout>
  );
}