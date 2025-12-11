import axios, { AxiosInstance } from 'axios';

// Create axios instance dengan default config
const api: AxiosInstance = axios.create({
    baseURL: '/pengajuan',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Add request interceptor untuk tambah CSRF token
api.interceptors.request.use((config) => {
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (token) {
        config.headers['X-CSRF-TOKEN'] = token;
    }
    return config;
});

// ====================================================================
// LUARAN PENELITIAN ENDPOINTS
// ====================================================================

export const LuaranAPI = {
    /**
     * GET - Ambil daftar luaran untuk usulan tertentu
     * @param usulanId - ID usulan penelitian
     * @returns Array of luaran items
     */
    getList: async (usulanId: number) => {
        try {
            const response = await api.get(`/${usulanId}/luaran`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * POST - Tambah luaran baru
     * @param usulanId - ID usulan penelitian
     * @param data - Form data luaran
     * @returns Created luaran object
     */
    create: async (usulanId: number, data: {
        tahun: number;
        kategori: string;
        deskripsi: string;
        status?: string;
        keterangan?: string;
    }) => {
        try {
            const response = await api.post(`/${usulanId}/luaran`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * PUT - Update luaran existing
     * @param luaranId - ID luaran
     * @param data - Updated data
     * @returns Updated luaran object
     */
    update: async (luaranId: number, data: {
        tahun: number;
        kategori: string;
        deskripsi: string;
        status?: string;
        keterangan?: string;
    }) => {
        try {
            const response = await api.put(`/luaran/${luaranId}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * DELETE - Hapus luaran
     * @param luaranId - ID luaran
     * @returns Success message
     */
    delete: async (luaranId: number) => {
        try {
            const response = await api.delete(`/luaran/${luaranId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

// ====================================================================
// RAB ITEMS ENDPOINTS
// ====================================================================

export const RabAPI = {
    /**
     * GET - Ambil daftar RAB items dengan total anggaran
     * @param usulanId - ID usulan penelitian
     * @returns Object dengan items array dan total_anggaran
     */
    getList: async (usulanId: number) => {
        try {
            const response = await api.get(`/${usulanId}/rab`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * POST - Tambah RAB item baru
     * @param usulanId - ID usulan penelitian
     * @param data - Form data RAB item
     * @returns Created RAB item object dengan total (auto-calculated)
     */
    create: async (usulanId: number, data: {
        tipe: 'bahan' | 'pengumpulan_data';
        kategori: string;
        item: string;
        satuan: string;
        volume: number;
        harga_satuan: number;
        keterangan?: string;
    }) => {
        try {
            const response = await api.post(`/${usulanId}/rab`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * PUT - Update RAB item existing
     * @param rabItemId - ID RAB item
     * @param data - Updated data
     * @returns Updated RAB item object dengan total (auto-calculated)
     */
    update: async (rabItemId: number, data: {
        tipe: 'bahan' | 'pengumpulan_data';
        kategori: string;
        item: string;
        satuan: string;
        volume: number;
        harga_satuan: number;
        keterangan?: string;
    }) => {
        try {
            const response = await api.put(`/rab/${rabItemId}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    /**
     * DELETE - Hapus RAB item
     * @param rabItemId - ID RAB item
     * @returns Success message
     */
    delete: async (rabItemId: number) => {
        try {
            const response = await api.delete(`/rab/${rabItemId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

// ====================================================================
// ERROR HANDLING UTILITIES
// ====================================================================

export const isValidationError = (error: any): boolean => {
    return error?.response?.status === 422;
};

export const getValidationErrors = (error: any): Record<string, string[]> => {
    if (error?.response?.data?.errors) {
        return error.response.data.errors;
    }
    return {};
};

export const getErrorMessage = (error: any): string => {
    if (error?.response?.data?.message) {
        return error.response.data.message;
    }
    if (error?.message) {
        return error.message;
    }
    return 'Terjadi kesalahan. Silakan coba lagi.';
};

export const isAuthorizationError = (error: any): boolean => {
    return error?.response?.status === 403;
};

export const isNotFoundError = (error: any): boolean => {
    return error?.response?.status === 404;
};

// ====================================================================
// EXPORT DEFAULT
// ====================================================================

export default {
    LuaranAPI,
    RabAPI,
    isValidationError,
    getValidationErrors,
    getErrorMessage,
    isAuthorizationError,
    isNotFoundError,
};
