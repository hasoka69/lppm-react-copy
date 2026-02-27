import React from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { type BreadcrumbItem } from '@/types';
import Pagination from '@/components/Pagination';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/id';

dayjs.extend(relativeTime);
dayjs.locale('id');

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Manajemen Pengguna',
    href: '/lppm/users',
  },
];

interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  roles: {
    id: number;
    name: string;
  }[];
  dosen?: {
    nidn: string;
    prodi: string;
  };
}

interface Props {
  users: {
    data: User[];
    current_page: number;
    last_page: number;
    links: { url: string | null; label: string; active: boolean }[];
  };
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

export default function UserIndex({ users }: Props) {
  const { delete: destroy, processing } = useForm();

  const handleDelete = (id: number) => {
    destroy(`/lppm/users/${id}`, {
      preserveScroll: true,
      onSuccess: () => {
        // Data akan otomatis terupdate karena Inertia.js
      },
      onError: (errors) => {
        console.error('Delete failed:', errors);
      }
    });
  };

  const handleResetPassword = (id: number) => {
    router.put(`/lppm/users/${id}/reset-password`, {}, { preserveScroll: true });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs} hideSidebar={true}>
      <Head title="Manajemen Pengguna" />
      <div className="p-4 md:p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Manajemen Pengguna</h1>
            <p className="text-muted-foreground">Kelola data pengguna dan hak akses mereka di dalam sistem.</p>
          </div>
          <Link href="/lppm/users/create">
            <Button className="w-full md:w-auto shadow-sm hover:shadow-md transition-shadow" size="sm">+ Tambah Pengguna</Button>
          </Link>
        </div>

        <div className="space-y-2 divide-y rounded-md border bg-background shadow-sm">
          {users.data.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">Tidak ada data pengguna tersedia.</div>
          ) : (
            users.data.map((user, index) => (
              <div
                key={user.id}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4 py-5 hover:bg-muted/50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2"
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
              >
                {/* Avatar dan Informasi */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-lg font-semibold text-primary">
                    {getInitials(user.name)}
                  </div>
                  <div className="space-y-1">
                    <div className="text-base font-medium flex items-center gap-2">
                      {user.name}
                      {user.dosen?.nidn && (
                        <span className="text-xs font-normal text-muted-foreground bg-gray-100 px-1.5 py-0.5 rounded">
                          NIDN: {user.dosen.nidn}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {user.email}
                      {user.dosen?.prodi && (
                        <span className="ml-2 text-gray-500">• {user.dosen.prodi}</span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground italic">
                      Terdaftar {dayjs(user.created_at).fromNow()}
                    </div>
                    {user.roles.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {user.roles.map((role) => (
                          <Badge key={role.id} variant="secondary" className="text-xs font-normal">
                            {role.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Aksi */}
                <div className="flex flex-wrap gap-2 md:justify-end">
                  <Link href={`/lppm/users/${user.id}/edit`}>
                    <Button size="sm" variant="outline" className="hover:bg-primary hover:text-primary-foreground transition-colors">Ubah</Button>
                  </Link>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="secondary" className="hover:shadow-sm transition-shadow">Atur Ulang</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Atur Ulang Kata Sandi?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Kata sandi untuk <strong>{user.name}</strong> akan diatur ulang menjadi:
                          <br />
                          <code className="bg-muted rounded px-2 py-1 text-sm mt-2 block w-fit">ResetPasswordNya</code>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleResetPassword(user.id)}
                          disabled={processing}
                        >
                          Ya, Atur Ulang
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="destructive" className="hover:shadow-sm transition-shadow">Hapus</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Pengguna?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Pengguna <strong>{user.name}</strong> akan dihapus secara permanen.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(user.id)}
                          disabled={processing}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Ya, Hapus
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))
          )}
        </div>
        {users.links && users.links.length > 3 && (
          <div className="mt-6 flex justify-center">
            <Pagination links={users.links} />
          </div>
        )}
      </div>
    </AppLayout>
  );
}
