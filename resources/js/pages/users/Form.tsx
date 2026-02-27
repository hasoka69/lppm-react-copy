import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { BreadcrumbItem } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface Role {
  id: number;
  name: string;
}

interface User {
  id?: number;
  name: string;
  email: string;
  roles?: string[];
}

interface DosenProfile {
  nidn?: string;
  prodi?: string;
}

interface Props {
  user?: User;
  roles: Role[];
  currentRoles?: string[];
  dosenProfile?: DosenProfile;
}

export default function UserForm({ user, roles, currentRoles, dosenProfile }: Props) {
  const isEdit = !!user;

  const { data, setData, post, put, processing, errors } = useForm({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    roles: currentRoles || [],
    nidn: dosenProfile?.nidn || '',
    prodi: dosenProfile?.prodi || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    isEdit ? put(`/lppm/users/${user?.id}`) : post('/lppm/users');
  };

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Manajemen Pengguna', href: '/lppm/users' },
    { title: isEdit ? 'Ubah Pengguna' : 'Tambah Pengguna', href: '#' },
  ];

  const showDosenFields = data.roles.some(r => r.toLowerCase() === 'dosen') || data.roles.some(r => r.toLowerCase() === 'kaprodi');

  return (
    <AppLayout breadcrumbs={breadcrumbs} hideSidebar={true}>
      <Head title={isEdit ? 'Ubah Pengguna' : 'Tambah Pengguna'} />
      <div className="flex-1 p-4 md:p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Card className="max-w-3xl mx-auto shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-2xl font-bold tracking-tight">
              {isEdit ? 'Ubah Pengguna' : 'Tambah Pengguna Baru'}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {isEdit ? 'Perbarui data pengguna dan hak akses' : 'Masukkan data pengguna dan atur hak akses'}
            </p>
          </CardHeader>

          <Separator />

          <CardContent className="pt-5">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                {/* Name */}
                <div className="animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
                  <Label htmlFor="name" className="mb-2 block">Nama Lengkap</Label>
                  <Input
                    id="name"
                    placeholder="Nama lengkap pengguna"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && <p className="text-sm text-red-500 mt-2">{errors.name}</p>}
                </div>

                {/* Email */}
                <div className="animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: '150ms', animationFillMode: 'both' }}>
                  <Label htmlFor="email" className="mb-2 block">Alamat Email</Label>
                  <Input
                    id="email"
                    placeholder="Alamat email aktif"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && <p className="text-sm text-red-500 mt-2">{errors.email}</p>}
                </div>

                {/* Password */}
                <div className="animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
                  <Label htmlFor="password" className="mb-2 block">Kata Sandi {isEdit ? '(Opsional)' : ''}</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    className={errors.password ? 'border-red-500' : ''}
                  />
                  {errors.password && <p className="text-sm text-red-500 mt-2">{errors.password}</p>}
                </div>

                {/* Roles */}
                <div className="animate-in fade-in slide-in-from-bottom-2" style={{ animationDelay: '250ms', animationFillMode: 'both' }}>
                  <Label className="mb-3 block">Peran / Hak Akses</Label>
                  <div className="space-y-3 border rounded-lg p-4 bg-muted/20">
                    {roles.map((role) => (
                      <div key={role.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`role-${role.id}`}
                          checked={data.roles.includes(role.name)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setData('roles', [...data.roles, role.name]);
                            } else {
                              setData('roles', data.roles.filter(r => r !== role.name));
                            }
                          }}
                        />
                        <Label htmlFor={`role-${role.id}`} className="text-sm font-normal cursor-pointer capitalize">
                          {role.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {errors.roles && <p className="text-sm text-red-500 mt-2">{errors.roles}</p>}
                </div>

                {/* Dosen Specific Fields - Animate or just conditional render */}
                {showDosenFields && (
                  <div className="bg-blue-50 p-4 rounded-lg space-y-4 border border-blue-100 animate-in fade-in slide-in-from-top-2">
                    <h4 className="font-semibold text-blue-800 text-sm">Informasi Dosen / Kaprodi</h4>

                    <div>
                      <Label htmlFor="nidn" className="mb-2 block">NIDN</Label>
                      <Input
                        id="nidn"
                        placeholder="Nomor Induk Dosen Nasional"
                        value={data.nidn}
                        onChange={(e) => setData('nidn', e.target.value)}
                        className={`bg-white ${errors.nidn ? 'border-red-500' : ''}`}
                      />
                      {errors.nidn && <p className="text-sm text-red-500 mt-2">{errors.nidn}</p>}
                    </div>

                    <div>
                      <Label htmlFor="prodi" className="mb-2 block">Program Studi</Label>
                      {/* Bisa diganti Select jika ada data master Prodi */}
                      <Input
                        id="prodi"
                        placeholder="Contoh: Teknik Informatika"
                        value={data.prodi}
                        onChange={(e) => setData('prodi', e.target.value)}
                        className={`bg-white ${errors.prodi ? 'border-red-500' : ''}`}
                      />
                      {errors.prodi && <p className="text-sm text-red-500 mt-2">{errors.prodi}</p>}
                    </div>
                  </div>
                )}


              </div>

              <Separator />

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
                <Link href="/lppm/users" className="w-full sm:w-auto">
                  <Button type="button" variant="secondary" className="w-full hover:shadow-sm transition-shadow">
                    Kembali
                  </Button>
                </Link>
                <Button type="submit" disabled={processing} className="w-full sm:w-auto shadow-sm hover:shadow-md transition-shadow">
                  {processing
                    ? <span className="animate-pulse">Menyimpan...</span>
                    : isEdit
                      ? 'Simpan Perubahan'
                      : 'Buat Pengguna'
                  }
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
