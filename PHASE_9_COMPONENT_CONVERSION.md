# Phase 9: IdentityAnggota.jsx Backend Connection Conversion

## Overview
Conversion of `IdentityAnggota.jsx` from **mock frontend** (hardcoded dummy data) to **backend-connected component** with real API calls.

**Status:** ✅ **COMPLETED**
**File:** `resources/js/components/Pengajuan/IdentityAnggota.jsx`
**Lines:** 460 lines
**Date:** December 11, 2025

---

## Changes Summary

### 1. ✅ Imports & Setup (Lines 1-20)
**Before:**
```javascript
import React, { useState } from 'react';
// Mock usePage from Inertia
const usePage = () => ({
    props: { auth: { user: { name: 'User' } } }
});
```

**After:**
```javascript
import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';  // Real Inertia hook
import axios from 'axios';

// CSRF-enabled axios instance
const api = axios.create({
    baseURL: '/',
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
```

### 2. ✅ Component Props (Line 21)
**Before:**
```javascript
const IdentityAnggota = () => {
    // Props not used
}
```

**After:**
```javascript
const IdentityAnggota = ({ usulanId, onCreateDraft }) => {
    const { props } = usePage();
    const userKetua = props.auth.user;  // Real auth user from Inertia
}
```

### 3. ✅ State Management (Lines 25-52)
**Before:**
```javascript
const [anggotaDosen, setAnggotaDosen] = useState([
    {
        id: 1,
        nidn: '082981928',
        nama: 'Alexxxx',
        peran: 'Anggota Pengusul',
        institusi: 'Politeknik Pertanian',
        tugas: 'Analisis Data',
        status: 'Menunggu'
    }
]);
// Similar hardcoded data for anggotaNonDosen
```

**After:**
```javascript
// 3. State untuk Anggota Dosen (dari backend)
const [anggotaDosen, setAnggotaDosen] = useState([]);
const [loadingDosen, setLoadingDosen] = useState(false);
const [formDosenVisible, setFormDosenVisible] = useState(false);
const [editingDosenId, setEditingDosenId] = useState(null);
const [formDosenData, setFormDosenData] = useState({
    nuptik: '',
    nama: '',
    peran: 'anggota',
    institusi: '',
    tugas: '',
});

// 4. State untuk Anggota Non-Dosen (dari backend)
const [anggotaNonDosen, setAnggotaNonDosen] = useState([]);
const [loadingNonDosen, setLoadingNonDosen] = useState(false);
const [formNonDosenVisible, setFormNonDosenVisible] = useState(false);
const [editingNonDosenId, setEditingNonDosenId] = useState(null);
const [formNonDosenData, setFormNonDosenData] = useState({
    jenis_anggota: '',
    no_identitas: '',
    nama: '',
    institusi: '',
    tugas: '',
});
```

### 4. ✅ Data Fetching (Lines 53-87)
**Added:**
```javascript
// Load data dari backend saat usulanId berubah
useEffect(() => {
    if (usulanId) {
        loadAnggotaDosen();
        loadAnggotaNonDosen();
    }
}, [usulanId]);

// Load anggota dosen dari backend
const loadAnggotaDosen = async () => {
    if (!usulanId) return;
    setLoadingDosen(true);
    try {
        const response = await api.get(`/pengajuan/${usulanId}/anggota-dosen`);
        setAnggotaDosen(response.data.data || []);
    } catch (error) {
        console.error('Error loading dosen:', error);
    } finally {
        setLoadingDosen(false);
    }
};

// Load anggota non-dosen dari backend
const loadAnggotaNonDosen = async () => {
    if (!usulanId) return;
    setLoadingNonDosen(true);
    try {
        const response = await api.get(`/pengajuan/${usulanId}/anggota-non-dosen`);
        setAnggotaNonDosen(response.data.data || []);
    } catch (error) {
        console.error('Error loading non-dosen:', error);
    } finally {
        setLoadingNonDosen(false);
    }
};
```

### 5. ✅ Handler Functions (Lines 88-238)

#### Anggota Dosen Handlers:
```javascript
const handleTambahDosen = async () => {
    // Auto-create draft if usulanId is null
    if (!usulanId && !onCreateDraft) {
        alert('Error: Cannot create member');
        return;
    }

    let validUsulanId = usulanId;
    if (!validUsulanId && onCreateDraft) {
        try {
            validUsulanId = await onCreateDraft();
            if (!validUsulanId) {
                alert('Failed to create proposal draft');
                return;
            }
        } catch (error) {
            alert('Error creating draft: ' + error.message);
            return;
        }
    }

    handleShowFormDosen();
};

const handleShowFormDosen = () => {
    setFormDosenData({
        nuptik: '',
        nama: '',
        peran: 'anggota',
        institusi: '',
        tugas: '',
    });
    setEditingDosenId(null);
    setFormDosenVisible(true);
};

const handleEditDosen = (anggota) => {
    setFormDosenData({
        nuptik: anggota.nuptik || '',
        nama: anggota.nama || '',
        peran: anggota.peran || 'anggota',
        institusi: anggota.institusi || '',
        tugas: anggota.tugas || '',
    });
    setEditingDosenId(anggota.id);
    setFormDosenVisible(true);
};

const handleSaveDosenSubmit = async (e) => {
    e?.preventDefault();
    if (!usulanId) {
        alert('Error: No proposal ID');
        return;
    }

    try {
        if (editingDosenId) {
            // Update via PUT
            await api.put(`/pengajuan/anggota-dosen/${editingDosenId}`, formDosenData);
            alert('Dosen updated successfully');
        } else {
            // Create via POST
            await api.post(`/pengajuan/${usulanId}/anggota-dosen`, formDosenData);
            alert('Dosen added successfully');
        }
        setFormDosenVisible(false);
        loadAnggotaDosen();  // Reload data
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        alert('Error: ' + message);
    }
};

const handleDeleteDosen = async (id) => {
    if (!confirm('Delete this member?')) return;
    try {
        // Delete via DELETE
        await api.delete(`/pengajuan/anggota-dosen/${id}`);
        alert('Dosen deleted successfully');
        loadAnggotaDosen();  // Reload data
    } catch (error) {
        const message = error.response?.data?.message || error.message;
        alert('Error: ' + message);
    }
};
```

#### Anggota Non-Dosen Handlers:
```javascript
// Similar pattern for non-dosen:
const handleTambahNonDosen = async () { ... };
const handleShowFormNonDosen = () => { ... };
const handleEditNonDosen = (anggota) => { ... };
const handleSaveNonDosenSubmit = async (e) => { ... };
const handleDeleteNonDosen = async (id) => { ... };
```

### 6. ✅ Button Updates (Lines 309, 395)
**Before:**
```javascript
<button onClick={handleTambahDosen} className="...">
<button className="..." title="Edit">  {/* No handler */}
<button onClick={() => handleHapusDosen(item.id)} className="...">
```

**After:**
```javascript
<button onClick={handleTambahDosen} type="button" className="...">
<button onClick={() => handleEditDosen(item)} type="button" className="...">
<button onClick={() => handleDeleteDosen(item.id)} type="button" className="...">
```

---

## API Endpoints Used

### Anggota Dosen
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/pengajuan/{usulanId}/anggota-dosen` | Load all members |
| POST | `/pengajuan/{usulanId}/anggota-dosen` | Create new member |
| PUT | `/pengajuan/anggota-dosen/{id}` | Update member |
| DELETE | `/pengajuan/anggota-dosen/{id}` | Delete member |

### Anggota Non-Dosen
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/pengajuan/{usulanId}/anggota-non-dosen` | Load all members |
| POST | `/pengajuan/{usulanId}/anggota-non-dosen` | Create new member |
| PUT | `/pengajuan/anggota-non-dosen/{id}` | Update member |
| DELETE | `/pengajuan/anggota-non-dosen/{id}` | Delete member |

---

## Key Features Implemented

✅ **Auto-Draft Creation**: When user clicks "Tambah" without usulanId, component calls `onCreateDraft()` to create draft first  
✅ **CSRF Protection**: All API requests include CSRF token from meta tag  
✅ **Real Data Loading**: Data fetched from backend, not hardcoded  
✅ **Form Management**: Edit/Create forms with clear separation  
✅ **Error Handling**: Try-catch with user-friendly messages  
✅ **Loading States**: Track loading status for dosen/non-dosen separately  
✅ **Confirmation Dialogs**: Confirm before delete  
✅ **Reactive UI**: Reload data after save/delete operations  

---

## Testing Checklist

After deployment, test these scenarios:

### Test Case 1: Add Dosen (No Existing Draft)
- [ ] Click "Tambah" button in Dosen section
- [ ] Should trigger auto-draft creation
- [ ] Form should appear
- [ ] Save form data
- [ ] Verify data appears in table
- [ ] Verify data saved to database

### Test Case 2: Edit Dosen
- [ ] Click edit icon on dosen row
- [ ] Form should populate with existing data
- [ ] Modify form
- [ ] Save changes
- [ ] Verify table updated
- [ ] Verify changes in database

### Test Case 3: Delete Dosen
- [ ] Click delete icon on dosen row
- [ ] Confirm deletion
- [ ] Verify row removed from table
- [ ] Verify data deleted from database

### Test Case 4: Add Non-Dosen
- [ ] Repeat Test Case 1 for non-dosen section
- [ ] Verify separate API endpoints used

### Test Case 5: Form Validation
- [ ] Submit empty form fields
- [ ] Verify error messages appear
- [ ] Verify no invalid data saved

### Test Case 6: Network Errors
- [ ] Disable network
- [ ] Try to save
- [ ] Verify error message appears
- [ ] Verify data not saved

---

## Dependencies

- **React**: 18+
- **@inertiajs/react**: For usePage hook and auth context
- **axios**: For HTTP requests with interceptors
- **Tailwind CSS**: For styling

---

## Related Files

- **Parent Component**: `resources/js/pages/pengajuan/steps/page-identitas-1.tsx`
  - Passes `usulanId` and `onCreateDraft` props
  - Contains `ensureDraftExists()` function

- **Backend Controller**: `app/Http/Controllers/UsulanPenelitianController.php`
  - Implements CRUD endpoints
  - Validation rules updated (nullable judul)

- **Models**: 
  - `app/Models/AnggotaDosen.php`
  - `app/Models/AnggotaNonDosen.php`

---

## Migration from Mock to Real

### What Changed
- **Data Source**: Hardcoded arrays → Backend API
- **State Management**: Simple useState → useState + useEffect
- **Event Handlers**: Dummy functions → Real API calls
- **Error Handling**: None → Try-catch with alerts
- **CSRF**: Missing → Added via axios interceptor

### What Stayed Same
- **UI/UX**: No visual changes
- **Component Structure**: Same layout and styling
- **Props Interface**: Compatible with parent component
- **Field Names**: Match backend model attributes

---

## Status

✅ **COMPLETED**: Component fully backend-connected and ready for Phase 9 UAT

**Next Steps:**
1. Test the 7 test cases above
2. Document any issues found
3. Proceed to Phase 10: Deployment
