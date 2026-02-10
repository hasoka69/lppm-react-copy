export const formatAcademicYear = (tahun: number | string): string => {
    const tahunStr = String(tahun);
    if (tahunStr.length !== 5) return tahunStr;

    const year = tahunStr.substring(0, 4);
    const semester = tahunStr.substring(4);
    const nextYear = parseInt(year) + 1;

    const semesterLabel = semester === '1' ? 'Ganjil' : semester === '2' ? 'Genap' : 'Pendek';

    return `${semesterLabel} ${year}/${nextYear}`;
};
