import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link as PaginationLink } from '@/types';

interface PaginationProps {
    links: PaginationLink[];
    className?: string;
}

export default function Pagination({ links, className }: PaginationProps) {
    if (!links || links.length === 0) return null;

    return (
        <nav className={cn("flex items-center justify-center gap-2 py-4", className)} aria-label="Pagination">
            {links.map((link, key) => {
                const isPrevious = link.label.includes('&laquo;') || link.label.includes('Previous');
                const isNext = link.label.includes('&raquo;') || link.label.includes('Next');
                const isDots = link.label === '...';

                const label = isPrevious ? (
                    <div className="flex items-center gap-1">
                        <ChevronLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">Sebelumnya</span>
                    </div>
                ) : isNext ? (
                    <div className="flex items-center gap-1">
                        <span className="hidden sm:inline">Berikutnya</span>
                        <ChevronRight className="w-4 h-4" />
                    </div>
                ) : (
                    link.label
                );

                if (isDots) {
                    return (
                        <div
                            key={key}
                            className="w-10 h-10 flex items-center justify-center text-slate-400 text-sm font-medium"
                        >
                            ...
                        </div>
                    );
                }

                if (!link.url) {
                    return (
                        <div
                            key={key}
                            className={cn(
                                "h-10 px-4 flex items-center justify-center rounded-xl text-sm font-semibold border border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed transition-all",
                                (isPrevious || isNext) && "px-3"
                            )}
                        >
                            {label}
                        </div>
                    );
                }

                return (
                    <Link
                        key={key}
                        href={link.url}
                        preserveScroll
                        className={cn(
                            "h-10 px-4 flex items-center justify-center rounded-xl text-sm font-bold transition-all duration-200 border shadow-sm",
                            link.active
                                ? "bg-blue-600 border-blue-600 text-white shadow-blue-100 -translate-y-0.5"
                                : "bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/50 hover:shadow-md active:scale-95",
                            (isPrevious || isNext) && "px-3"
                        )}
                    >
                        {label}
                    </Link>
                );
            })}
        </nav>
    );
}
