import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';

// CSRF-enabled axios instance
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

const SearchableMahasiswaSelect = ({
    value,
    onChange,
    placeholder = "Cari NIM atau Nama Mahasiswa...",
    isClearable = true,
    isSearchable = true
}) => {
    const [options, setOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);

    // ✅ FIX: Sync selectedMahasiswa with parent's value prop
    useEffect(() => {
        if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Promise)) {
            setSelectedMahasiswa(value);
        } else {
            setSelectedMahasiswa(null);
        }
    }, [value]);

    // ✅ FIX: Handle search with proper async
    const handleInputChange = async (inputValue) => {
        if (!inputValue || inputValue.length < 2) {
            setOptions([]);
            return;
        }

        setIsLoading(true);
        try {
            const response = await api.get('/api/mahasiswa/search', {
                params: {
                    q: inputValue,
                    limit: 10
                }
            });

            console.log('Mahasiswa search response:', response.data);

            // ✅ FIX: Use NIM as value, not ID (to match parent structure)
            const formatted = (response.data.data || []).map(mhs => ({
                value: mhs.nim,  // ✅ Changed from mhs.id to mhs.nim
                label: `${mhs.nim} - ${mhs.nama} (${mhs.jurusan})`,
                mahasiswa: mhs
            }));

            console.log('Formatted options:', formatted);
            setOptions(formatted);
        } catch (error) {
            console.error('Error searching mahasiswa:', error);
            setOptions([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectChange = (selected) => {
        console.log('Selected mahasiswa:', selected);
        setSelectedMahasiswa(selected);
        if (onChange) {
            onChange(selected);
        }
    };

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
                    backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#e5e7eb' : 'white',
                    color: state.isSelected ? 'white' : 'black',
                    padding: '8px 12px',
                }),
            }}
        />
    );
};

export default SearchableMahasiswaSelect;