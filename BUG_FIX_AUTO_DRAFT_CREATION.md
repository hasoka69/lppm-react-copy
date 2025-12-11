# Improvement: Auto-Create Draft When Adding Anggota

**Date:** December 11, 2025  
**Status:** ✅ IMPLEMENTED  
**Type:** UX Improvement  
**Impact:** Users can now add anggota without manually creating draft first

---

## 🎯 What Changed

### Before
User gets an alert:
```
Silakan klik "Simpan Sebagai Draft" atau "Selanjutnya" terlebih dahulu untuk membuat usulan!
```
❌ User must click another button before adding anggota

### After
✅ **Automatic draft creation**
- When user tries to add anggota without an existing draft
- System automatically creates draft in background
- Then allows user to add anggota immediately
- **No extra clicks needed!**

---

## 🔧 How It Works

### New Flow
```
User fills form → User clicks "+ Tambah" (add anggota)
    ↓
System checks: Is there a draft?
    ↓
NO DRAFT → Auto-create draft (POST /pengajuan/draft)
    ↓
DRAFT CREATED → Save anggota (POST /pengajuan/{id}/anggota-dosen)
    ↓
ANGGOTA SAVED ✓
```

### Key Changes

**File 1: `page-identitas-1.tsx`**

Added new function:
```javascript
const ensureDraftExists = async () => {
    return new Promise<number | null>((resolve) => {
        if (currentUsulanId) {
            // Draft already exists, return ID immediately
            resolve(currentUsulanId);
            return;
        }

        // Create new draft with minimal data
        post('/pengajuan/draft', {
            preserveScroll: true,
            onSuccess: (page) => {
                const id = (page.props.flash as Record<string, unknown>)?.usulanId;
                if (id) {
                    const newId = Number(id);
                    setCurrentUsulanId(newId);
                    resolve(newId);
                } else {
                    resolve(null);
                }
            },
            onError: () => {
                resolve(null);
            },
        });
    });
};
```

Pass function to child:
```jsx
<IdentitasAnggotaPengajuan 
    usulanId={currentUsulanId} 
    onCreateDraft={ensureDraftExists}  // ← NEW!
/>
```

**File 2: `IdentityAnggota.jsx`**

In `handleSaveAnggotaDosen`:
```javascript
let validUsulanId = usulanId;
if (!validUsulanId && onCreateDraft) {
    console.log('usulanId is null, creating draft...');
    try {
        validUsulanId = await onCreateDraft();
        console.log('Draft created, new usulanId:', validUsulanId);
        if (!validUsulanId) {
            alert('Gagal membuat usulan. Silakan coba lagi!');
            return;
        }
    } catch (error) {
        console.error('Error creating draft:', error);
        alert('Gagal membuat usulan: ' + error.message);
        return;
    }
}

if (!validUsulanId) {
    alert('Silakan klik "Simpan Sebagai Draft" atau "Selanjutnya" terlebih dahulu untuk membuat usulan!');
    return;
}

// Now safe to use validUsulanId
response = await api.post(
    `/pengajuan/${validUsulanId}/anggota-dosen`,
    formDosenData
);
```

Same logic applied to `handleSaveAnggotaNonDosen`

---

## 📊 Comparison

| Aspect | Before | After |
|--------|--------|-------|
| User Action | Click "Simpan Sebagai Draft" → Click "+ Tambah" | Click "+ Tambah" |
| API Calls | 1 (draft) + 1 (anggota) = 2 | 1 (draft) + 1 (anggota) = 2* |
| User Friction | ❌ High | ✅ Low |
| Clicks Needed | 2 | 1 |
| Experience | "I need to do something first" | "Just works!" |

*Same total, but happens automatically

---

## 🧪 How to Test

### Test Case 1: Auto-create draft when adding dosen
1. Open new pengajuan form (Step 1: Identitas)
2. **Do NOT click "Simpan Sebagai Draft"**
3. Scroll to "Tambah Anggota (Dosen)"
4. Click "+ Tambah" button
5. Fill form (NUPTIK, Nama, Peran, Institusi, Tugas)
6. Click "Simpan"

**Expected Result:**
- ✅ No alert about creating draft first
- ✅ Draft is created automatically in background
- ✅ Anggota is saved successfully
- ✅ Anggota appears in list
- ✅ Console shows: "Draft created, new usulanId: {id}"

### Test Case 2: Auto-create draft for non-dosen
1. Same as above, but for Non-Dosen
2. Click "+ Tambah" in "Tambah Anggota (Non-Dosen)" section

**Expected Result:**
- ✅ Same behavior, works automatically

### Test Case 3: Existing draft (no re-create)
1. Click "Simpan Sebagai Draft" button (creates draft)
2. Scroll to "Tambah Anggota (Dosen)"
3. Click "+ Tambah"
4. Fill and save

**Expected Result:**
- ✅ No new draft created (uses existing one)
- ✅ Console shows: usulanId already set (no "creating draft" message)
- ✅ Anggota saves to existing draft

### Test Case 4: Error handling
1. Open form
2. Try to add anggota
3. If system can't create draft (server error):

**Expected Result:**
- ✅ Alert: "Gagal membuat usulan: {error message}"
- ✅ Can retry by clicking "+ Tambah" again

---

## 🎓 Technical Details

### Promise Pattern Used
```javascript
const ensureDraftExists = async () => {
    return new Promise<number | null>((resolve) => {
        // ...
    });
};
```

**Why?**
- Inertia's `post()` is callback-based, not promise-based
- We wrap it in Promise to make it awaitable
- Allows clean async/await syntax in child component

### Error Handling
```javascript
onSuccess: (page) => { ... resolve(id) ... }
onError: () => { ... resolve(null) ... }
```

Both success and error cases resolve the promise
- Prevents hanging awaits
- Child can check if `validUsulanId` is null

---

## 📝 Files Modified

| File | Change | Lines |
|------|--------|-------|
| `resources/js/pages/pengajuan/steps/page-identitas-1.tsx` | Added `ensureDraftExists()` function, pass to child | 64-116 |
| `resources/js/components/Pengajuan/IdentityAnggota.jsx` | Add `onCreateDraft` parameter, use in both handlers | Multiple |

---

## ✨ Benefits

1. **Better UX** - No confusing alert messages
2. **Less friction** - One less click for users
3. **Smarter flow** - System does what user wants automatically
4. **Same reliability** - Still creates draft properly, just hidden
5. **Backward compatible** - Still works if onCreateDraft not provided

---

## 🚀 Testing Checklist

- [ ] Hard refresh browser (Ctrl+Shift+R)
- [ ] Open new pengajuan form
- [ ] Try to add anggota WITHOUT clicking "Simpan Sebagai Draft"
- [ ] Verify draft is created automatically
- [ ] Verify anggota is saved successfully
- [ ] Check console for debug messages
- [ ] Test both Dosen and Non-Dosen
- [ ] Test with existing draft (should not re-create)

---

## 💡 Next Steps

1. Test the improvement
2. If working, continue with Phase 9 UAT
3. Report any issues or unexpected behavior
4. Ready for production when Phase 9 UAT passes all tests

---

**Status:** ✅ READY FOR TESTING  
**User Experience:** ✅ SIGNIFICANTLY IMPROVED  
**Next Phase:** Phase 9 UAT Testing
