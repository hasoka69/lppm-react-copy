import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatAcademicYear(code: string | number) {
    const s = String(code);
    if (s.length !== 5) return s;
    const year = parseInt(s.substring(0, 4));
    const semester = s.substring(4);
    const semText = semester === '1' ? 'Ganjil' : (semester === '2' ? 'Genap' : 'Pendek');
    return `${year}/${year + 1} ${semText}`;
}
