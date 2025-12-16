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
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (token) {
        config.headers['X-CSRF-TOKEN'] = token;
    }
    return config;
});

const TambahAnggotaDosen = ({ usulanId }) => {
    const [selectedDosen, setSelectedDosen] = useState(null);

    const handleAddDosen = async () => {
        if (!selectedDosen) return;

        try {
            const response = await api.post(`/pengajuan/${usulanId}/anggota-penelitian`, {
                nidn: selectedDosen.value, // ✅ Hanya nidn
            });
            alert(response.data.message);
            setSelectedDosen(null); // reset select
        } catch (error) {
            console.error(error.response?.data);
            alert(error.response?.data?.message || 'Terjadi kesalahan');
        }
    };

    return (
        <div>
            <SearchableDosenSelect
                value={selectedDosen}
                onChange={setSelectedDosen}
            />
            <button
                type="button"
                onClick={handleAddDosen}
                disabled={!selectedDosen}
                style={{ marginTop: '10px' }}
            >
                Tambah Anggota
            </button>
        </div>
    );
};

/* =======================
   COMPONENT
======================= */
const SearchableDosenSelect = ({
    value,
    onChange,
    placeholder = "Cari NIDN atau Nama Dosen...",
    isClearable = true,
    isSearchable = true,
}) => {
    const [options, setOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDosen, setSelectedDosen] = useState(null);

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
            setSelectedDosen(value);
        } else {
            setSelectedDosen(null);
        }
    }, [value]);

    /* =======================
       SEARCH (DEBOUNCE + CANCEL)
    ======================= */
    const searchDosen = (keyword) => {
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
                const response = await api.get('/api/dosen/search', {
                    params: {
                        q: keyword,
                        limit: 10,
                    },
                    signal: abortRef.current.signal,
                });

                const formatted = (response.data.data || []).map((dosen) => ({
                    value: dosen.nidn, // 🔥 PAKAI NIDN
                    label: `${dosen.nidn} - ${dosen.nama}`,
                    dosen: dosen,
                }));

                setOptions(formatted);
            } catch (error) {
                if (error.name !== 'CanceledError') {
                    console.error('Error searching dosen:', error);
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
        searchDosen(inputValue);
        return inputValue; // 🔥 WAJIB
    };

    /* =======================
       SELECT CHANGE
    ======================= */
    const handleSelectChange = (selected) => {
        setSelectedDosen(selected);
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
            inputId="dosen-select"
            options={options}
            value={selectedDosen}
            onChange={handleSelectChange}
            onInputChange={handleInputChange}
            isLoading={isLoading}
            placeholder={placeholder}
            isClearable={isClearable}
            isSearchable={isSearchable}
            noOptionsMessage={({ inputValue }) => {
                if (!inputValue) return 'Ketik untuk mencari...';
                if (inputValue.length < 2) return 'Ketik minimal 2 karakter';
                return 'Tidak ada dosen ditemukan';
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
                        ? '#3b82f6'
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

export default SearchableDosenSelect;
