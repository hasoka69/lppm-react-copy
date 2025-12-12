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

const SearchableDosenSelect = ({
    value,
    onChange,
    placeholder = "Cari NIDN atau Nama Dosen...",
    isClearable = true,
    isSearchable = true
}) => {
    const [options, setOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDosen, setSelectedDosen] = useState(null);

    // Sync selectedDosen with parent's value prop
    useEffect(() => {
        // Ensure value is not a Promise
        if (value && value instanceof Promise) {
            console.warn('SearchableDosenSelect received a Promise as value:', value);
            setSelectedDosen(null);
        } else {
            setSelectedDosen(value || null);
        }
    }, [value]);

    // Handle search
    const handleInputChange = async (inputValue) => {
        if (!inputValue || inputValue.length < 2) {
            setOptions([]);
            return;
        }

        setIsLoading(true);
        try {
            const response = await api.get('/api/dosen/search', {
                params: {
                    q: inputValue,
                    limit: 10
                }
            });

            const formatted = response.data.data.map(dosen => ({
                value: dosen.id,
                label: `${dosen.nidn} - ${dosen.nama}`,
                dosen: dosen // Store full dosen object
            }));

            setOptions(formatted);
        } catch (error) {
            console.error('Error searching dosen:', error);
            setOptions([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectChange = (selected) => {
        setSelectedDosen(selected);
        if (onChange) {
            onChange(selected);
        }
    };

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
            noOptionsMessage={() => 'Tidak ada dosen ditemukan'}
            classNamePrefix="react-select"
            styles={{
                control: (base) => ({
                    ...base,
                    minHeight: '38px',
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

export default SearchableDosenSelect;
