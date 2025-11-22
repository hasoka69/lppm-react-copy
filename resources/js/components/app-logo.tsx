import { usePage } from '@inertiajs/react';
import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
  const setting = usePage().props.setting as {
    nama_app?: string;
    logo?: string;
  } | null;

  const defaultAppName = 'LPPM Asaindo';
  const defaultLogo = '/image/logo-asaindo.png'; // Default logo dari path /image/

  const appName = setting?.nama_app || defaultAppName;
  const logo = setting?.logo ? `/storage/${setting.logo}` : defaultLogo;

  return (
    <div className="flex items-center gap-2">
      {logo ? (
        <img
          src={logo}
          alt="Logo LPPM Asaindo"
          className="h-10 w-10 object-contain" // Sesuaikan ukuran dengan navbar
        />
      ) : (
        <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-10 items-center justify-center rounded-md">
          <AppLogoIcon className="size-[1.375rem] fill-current text-white dark:text-black" />
        </div>
      )}
      <div className="grid flex-1 text-left text-sm">
        <span className="mb-0.5 truncate leading-none font-semibold">
          {appName}
        </span>
        <span className="truncate text-xs text-muted-foreground">
          Lembaga Penelitian dan Pengabdian Masyarakat
        </span>
      </div>
    </div>
  );
}