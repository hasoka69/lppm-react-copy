
/**
 * Format Academic Year Code (e.g. 20261) to human readable string (e.g. Semester Ganjil 2025/2026)
 * @param code The 5-digit academic year code
 * @returns Human readable string
 */
export const formatAcademicYear = (code: number | string | null | undefined): string => {
    if (!code) return '-';

    const codeStr = code.toString();
    if (codeStr.length !== 5) return codeStr; // Return as is if not matching expected format

    const year = parseInt(codeStr.substring(0, 4));
    const semester = parseInt(codeStr.substring(4));

    if (semester === 1) {
        // Ganjil: Code 20261 means EndYear 2026, StartYear 2025.
        // Label: Semester Ganjil 2025/2026
        return `Semester Ganjil ${year - 1}/${year}`;
    } else if (semester === 2) {
        // Genap: Code 20262 means EndYear 2026, StartYear 2025.
        // Label: Semester Genap 2025/2026
        return `Semester Genap ${year - 1}/${year}`;
    }

    return codeStr;
};

/**
 * Get current Academic Year Code based on real time
 */
export const getCurrentAcademicYearCode = (): number => {
    const date = new Date();
    const month = date.getMonth() + 1; // 1-12
    const year = date.getFullYear();

    // Logic:
    // Ganjil (Sem 1): Aug (8) - Jan (1). Code: (Year+1)1. e.g. Jan 2026 -> 20261. Aug 2025 -> 20261.
    // Genap (Sem 2): Feb (2) - Jul (7).  Code: (Year)2.   e.g. Feb 2026 -> 20262.

    if (month >= 8 || month === 1) {
        // Ganjil
        // If Jan (1), year is already EndYear, so Code is Year + 1.
        // Wait, Jan 2026 is part of 2025/2026 Ganjil. End Year is 2026. code 20261.
        // If Aug 2025, it is 2025/2026 Ganjil. End Year is 2026. code 20261.

        const endYear = month === 1 ? year : year + 1;
        return parseInt(`${endYear}1`);
    } else {
        // Genap (Feb-Jul)
        // Feb 2026 is 2025/2026 Genap. End Year is 2026. code 20262.
        return parseInt(`${year}2`);
    }
};

/**
 * Generate list of Academic Year Options
 * Default: 1 year future, 5 years past
 */
export const getAcademicYearOptions = () => {
    const current = getCurrentAcademicYearCode();
    // Parse current year/semester from code
    const currentStr = current.toString();
    const currentEndYear = parseInt(currentStr.substring(0, 4));
    const currentSem = parseInt(currentStr.substring(4));

    const options: { value: number, label: string }[] = [];

    // Strategy: Generate codes relative to current.
    // 1 Year Future = 2 semesters ahead? 
    // User says "1 tahun depan". e.g. if current is 20262 (Genap 25/26).
    // Future 1: 20271 (Ganjil 26/27), 20272 (Genap 26/27).

    // Let's generate a range of academic years (EndYears)
    // Current EndYear: 2026.
    // Future: 2027.
    // Past 5: 2025, 2024, 2023, 2022, 2021.

    const startYear = currentEndYear + 1; // Future 1 year
    const endYear = currentEndYear - 5;   // Past 5 years

    for (let y = startYear; y >= endYear; y--) {
        // For each "EndYear", we have Sem 1 (Ganjil) and Sem 2 (Genap)
        // Order: Descending? Usually lists are descending (Newest first).

        // Genap first (Code 2), then Ganjil (Code 1) for same EndYear?
        // 20262 (Genap 25/26), 20261 (Ganjil 25/26).

        // Add Sem 2 (Genap)
        const code2 = parseInt(`${y}2`);
        options.push({ value: code2, label: formatAcademicYear(code2) });

        // Add Sem 1 (Ganjil)
        const code1 = parseInt(`${y}1`);
        options.push({ value: code1, label: formatAcademicYear(code1) });
    }

    return options;
};
