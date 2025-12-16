import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import axios from 'axios';

/* =======================
   AXIOS INSTANCE (CSRF)
======================= */
const api = axios.create({
    baseURL: '/',
    withCredentials: true,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
});

api.interceptors.request.use((config) => {
    const token = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute('content');

    if (token) {
        config.headers['X-CSRF-TOKEN'] = token;
    }
    return config;
});

/* =======================
   COMPONENT
======================= */
const SearchableMahasiswaSelect = ({
    value,
    onChange,
    placeholder = "Cari NIM atau Nama Mahasiswa...",
    isClearable = true,
    isSearchable = true,
}) => {
    const [options, setOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);

    const debounceRef = useRef(null);
    const abortRef = useRef(null);

    /* =======================
       SYNC VALUE FROM PARENT
    ======================= */
    useEffect(() => {
        if (
            value &&
            typeof value === 'object' &&
            !Array.isArray(value) &&
            !(value instanceof Promise)
        ) {
            setSelectedMahasiswa(value);
        } else {
            setSelectedMahasiswa(null);
        }
    }, [value]);

    /* =======================
       SEARCH WITH DEBOUNCE
    ======================= */
    const searchMahasiswa = (keyword) => {
        if (!keyword || keyword.length < 2) {
            setOptions([]);
            return;
        }

        // debounce
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(async () => {
            // cancel previous request
            if (abortRef.current) {
                abortRef.current.abort();
            }

            abortRef.current = new AbortController();
            setIsLoading(true);

            try {
                const response = await api.get('/api/mahasiswa/search', {
                    params: {
                        q: keyword,
                        limit: 10,
                    },
                    signal: abortRef.current.signal,
                });

                const formatted = (response.data.data || []).map((mhs) => ({
                    value: mhs.nim,
                    label: `${mhs.nim} - ${mhs.nama} (${mhs.jurusan})`,
                    mahasiswa: mhs,
                }));

                setOptions(formatted);
            } catch (error) {
                if (error.name !== 'CanceledError') {
                    console.error('Error searching mahasiswa:', error);
                }
                setOptions([]);
            } finally {
                setIsLoading(false);
            }
        }, 300);
    };

    /* =======================
       INPUT CHANGE (SYNC)
    ======================= */
    const handleInputChange = (inputValue) => {
        searchMahasiswa(inputValue);
        return inputValue; // 🔥 WAJIB
    };

    /* =======================
       SELECT CHANGE
    ======================= */
    const handleSelectChange = (selected) => {
        setSelectedMahasiswa(selected);
        if (onChange) {
            onChange(selected);
        }
    };

    /* =======================
       CLEANUP
    ======================= */
    useEffect(() => {
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
            if (abortRef.current) abortRef.current.abort();
        };
    }, []);

    /* =======================
       RENDER
    ======================= */
    return (
        <Select
            inputId="mahasiswa-select"
            options={options}
            value={selectedMahasiswa}
            onChange={handleSelectChange}
            onInputChange={handleInputChange}
            isLoading={isLoading}
            placeholder={placeholder}
            isClearable={isClearable}
            isSearchable={isSearchable}
            noOptionsMessage={({ inputValue }) => {
                if (!inputValue) return 'Ketik untuk mencari...';
                if (inputValue.length < 2) return 'Ketik minimal 2 karakter';
                return 'Tidak ada mahasiswa ditemukan';
            }}
            classNamePrefix="react-select"
            styles={{
                control: (base) => ({
                    ...base,
                    minHeight: '38px',
                    borderColor: '#d1d5db',
                }),
                option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isSelected
                        ? '#2563eb'
                        : state.isFocused
                            ? '#e5e7eb'
                            : 'white',
                    color: state.isSelected ? 'white' : 'black',
                    padding: '8px 12px',
                }),
            }}
        />
    );
};

export default SearchableMahasiswaSelect;
