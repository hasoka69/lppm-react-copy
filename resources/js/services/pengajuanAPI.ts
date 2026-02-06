// resources/js/services/pengajuanAPI.ts

import axios, { AxiosError } from 'axios';

// ========================================
// TYPE DEFINITIONS
// ========================================

interface LuaranData {
    // tahun: number; // REMOVED
    kategori: string;
    deskripsi: string;
    is_wajib: boolean;
    status?: string;
    keterangan?: string;
}

interface RabData {
    tipe: string; // Dynamic for each type
    kategori: string;
    item: string;
    satuan: string;
    volume: number;
    harga_satuan: number;
    keterangan?: string;
}

interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
    total_anggaran?: number;
}

interface ValidationError {
    message?: string;
    errors?: Record<string, string[]>;
}

// ========================================
// LUARAN API
// ========================================

export const LuaranAPI = {
    /**
     * GET: Fetch semua luaran untuk usulan
     */
    async getList(usulanId: number, prefix: string = '/dosen/penelitian') {
        const response = await axios.get<ApiResponse<any[]>>(
            `${prefix}/${usulanId}/luaran`
        );
        return response.data;
    },

    /**
     * POST: Tambah luaran baru
     */
    async create(usulanId: number, data: LuaranData, prefix: string = '/dosen/penelitian') {
        const response = await axios.post<ApiResponse<any>>(
            `${prefix}/${usulanId}/luaran`,
            data
        );
        return response.data;
    },

    /**
     * PUT: Update luaran existing
     */
    async update(luaranId: number, data: Partial<LuaranData>, prefix: string = '/dosen/penelitian') {
        const response = await axios.put<ApiResponse<any>>(
            `${prefix}/luaran/${luaranId}`,
            data
        );
        return response.data;
    },

    /**
     * DELETE: Hapus luaran
     */
    async delete(luaranId: number, prefix: string = '/dosen/penelitian') {
        const response = await axios.delete<ApiResponse<any>>(
            `${prefix}/luaran/${luaranId}`
        );
        return response.data;
    },
};

// ========================================
// RAB API
// ========================================

export const RabAPI = {
    /**
     * GET: Fetch semua RAB items untuk usulan
     */
    async getList(usulanId: number, prefix: string = '/dosen/penelitian') {
        const response = await axios.get<ApiResponse<any[]>>(
            `${prefix}/${usulanId}/rab`
        );
        return response.data;
    },

    /**
     * POST: Tambah RAB item baru
     */
    async create(usulanId: number, data: RabData, prefix: string = '/dosen/penelitian') {
        const response = await axios.post<ApiResponse<any>>(
            `${prefix}/${usulanId}/rab`,
            data
        );
        return response.data;
    },

    /**
     * PUT: Update RAB item existing
     */
    async update(rabItemId: number, data: Partial<RabData>, prefix: string = '/dosen/penelitian') {
        const response = await axios.put<ApiResponse<any>>(
            `${prefix}/rab/${rabItemId}`,
            data
        );
        return response.data;
    },

    /**
     * DELETE: Hapus RAB item
     */
    async delete(rabItemId: number, prefix: string = '/dosen/penelitian') {
        const response = await axios.delete<ApiResponse<any>>(
            `${prefix}/rab/${rabItemId}`
        );
        return response.data;
    },
};

// ========================================
// ERROR HANDLING HELPERS
// ========================================

/**
 * Check if error is validation error
 */
export function isValidationError(error: unknown): error is AxiosError<ValidationError> {
    return (
        axios.isAxiosError(error) &&
        error.response?.status === 422 &&
        !!error.response?.data?.errors
    );
}

/**
 * Get validation errors from response
 */
export function getValidationErrors(error: AxiosError<ValidationError>): Record<string, string[]> {
    return error.response?.data?.errors || {};
}

/**
 * Get error message from response
 */
export function getErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
        return error.response?.data?.message || error.message || 'Terjadi kesalahan';
    }
    return 'Terjadi kesalahan tidak terduga';
}