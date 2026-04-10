/**
 * Mapping of Luaran (Output) Categories to their reward/bonus costs
 */
export const LUARAN_COSTS: Record<string, number> = {
    // Exact name matches
    'Jurnal Internasional Bereputasi Scopus': 2000000,
    'Jurnal Terakreditasi SINTA 1': 2000000,
    'Jurnal Terakreditasi SINTA 2': 2000000,
    'Jurnal Terakreditasi SINTA 1 - 2': 2000000,
    'Jurnal Internasional': 1000000,
    'Jurnal Terakreditasi SINTA 3': 1000000,
    'Jurnal Nasional Terakreditasi SINTA 3': 1000000,
    
    // Reviewer ID matches (from ReviewScoringForm.tsx)
    'scopus': 2000000,
    'sinta12': 2000000,
    'internasional': 1000000,
    'sinta3': 1000000,
};

/**
 * Helper to calculate total reward for a list of luaran items
 */
export const calculateTotalLuaranCost = (items: any[]): number => {
    if (!items || !Array.isArray(items)) return 0;
    
    return items.reduce((total, item) => {
        const kategori = (item.kategori || '').trim();
        // Case-insensitive matching
        const costKey = Object.keys(LUARAN_COSTS).find(
            key => key.toLowerCase() === kategori.toLowerCase()
        );
        
        return total + (costKey ? LUARAN_COSTS[costKey] : 0);
    }, 0);
};
