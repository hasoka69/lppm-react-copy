export const formatTahun = (tahun: string | number): string => {
    const str = String(tahun);
    if (str.length === 5) {
        const year = parseInt(str.substring(0, 4));
        const semester = str.substring(4);
        const nextYear = year + 1;
        const semLabel = semester === '1' ? 'Ganjil' : 'Genap';
        return `Semester ${semLabel} ${year}/${nextYear}`;
    }
    return str;
};
