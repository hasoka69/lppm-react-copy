# Bug Fix: No query results for model [UsulanPenelitian] null

**Date:** December 11, 2025  
**Status:** ✅ FIXED  
**Severity:** CRITICAL  
**Root Cause:** usulanId is null when trying to save anggota before creating draft

---

## 🎯 The Problem

### Error Message
```
Gagal menyimpan data anggota dosen: No query results for model [App\Models\UsulanPenelitian] null
```

### What Was Happening
1. User opens pengajuan form (Step 1: Identitas)
2. User fills some basic info but **does NOT click "Simpan Sebagai Draft" or "Selanjutnya"**
3. User scrolls down to "Tambah Anggota" section
4. User tries to click "+ Tambah" to add a dosen member
5. Component sends API request to `/pengajuan/null/anggota-dosen` ← **null ID!**
6. Laravel tries to find UsulanPenelitian with `id=null` → FAILS
7. Error: "No query results for model [UsulanPenelitian] null"

---

## 🔍 Root Cause Analysis

### Data Flow
```
Page Opens
    ↓
currentUsulanId = null (no draft created yet)
    ↓
User fills form but doesn't save
    ↓
User tries to add anggota
    ↓
API Request: POST /pengajuan/null/anggota-dosen
    ↓
Route model binding: { usulan } receives null
    ↓
UsulanPenelitian::findOrFail(null) → ERROR
```

### Why This Happens

**In page-identitas-1.tsx:**
```javascript
const [currentUsulanId, setCurrentUsulanId] = useState<number | null>(usulanId ?? null);
```

- Initially: `currentUsulanId = null`
- Only updated when user successfully submits draft form
- Form fields are just local state, not yet saved to database

**In IdentityAnggota.jsx:**
```javascript
response = await api.post(
    `/pengajuan/${usulanId}/anggota-dosen`,  // usulanId = null!
    formDosenData
);
```

- Component uses `usulanId` prop directly
- If prop is null, the endpoint URL becomes invalid

---

## ✅ The Solution

### Check for null usulanId before API call

**File:** `resources/js/components/Pengajuan/IdentityAnggota.jsx`

**ADDED validation check:**
```javascript
const handleSaveAnggotaDosen = async () => {
    // Check if usulanId is null
    if (!usulanId) {
        alert('Silakan klik "Simpan Sebagai Draft" atau "Selanjutnya" terlebih dahulu untuk membuat usulan!');
        console.warn('usulanId is null, cannot save anggota without usulanId');
        return;
    }
    // ... rest of function
};
```

**ADDED same check for Non-Dosen:**
```javascript
const handleSaveAnggotaNonDosen = async () => {
    if (!usulanId) {
        alert('Silakan klik "Simpan Sebagai Draft" atau "Selanjutnya" terlebih dahulu untuk membuat usulan!');
        return;
    }
    // ... rest of function
};
```

---

## 📊 Fix Details

| Item | Before | After |
|------|--------|-------|
| usulanId check | ❌ None | ✅ Added |
| Error message | "No query results..." | "Silakan klik Simpan..." |
| User Experience | Confusing error | Clear instruction |
| API Request | null/anggota-dosen | Prevented |

---

## 🧪 How to Test

### Test Case 1: Try to add anggota without draft
1. Open new pengajuan form (Step 1: Identitas)
2. **Do NOT click "Simpan Sebagai Draft" or "Selanjutnya"**
3. Scroll to "Tambah Anggota (Dosen)"
4. Click "+ Tambah" button
5. Fill form fields
6. Click "Simpan"

**Expected Result:**
- ✅ Alert appears: "Silakan klik 'Simpan Sebagai Draft' atau 'Selanjutnya' terlebih dahulu untuk membuat usulan!"
- ✅ No API request sent
- ✅ No error in console
- ✅ Form stays on page

### Test Case 2: Correct flow
1. Open new pengajuan form (Step 1: Identitas)
2. Fill basic info (judul, tkt, etc.)
3. **Click "Simpan Sebagai Draft"** → Draft created, currentUsulanId now has value
4. Scroll to "Tambah Anggota (Dosen)"
5. Click "+ Tambah"
6. Fill form
7. Click "Simpan"

**Expected Result:**
- ✅ No alert shown
- ✅ API request sent to `/pengajuan/{actualId}/anggota-dosen`
- ✅ Status 201 response
- ✅ Anggota appears in list

### Test Case 3: Alternative correct flow
1. Open new pengajuan form
2. Fill all required fields
3. **Click "Selanjutnya >"** → Draft created + moves to next step
4. Return to Step 1 (via navigation)
5. Add anggota should work normally

**Expected Result:**
- ✅ Works as expected

---

## 💡 Key Insights

### Why This Matters
- **User can't add anggota until draft is created**
- **Error message now explains WHAT to do, not WHAT went wrong**
- **Prevents confusing Laravel "no query results" error**

### User Journey
```
1. Fill form data
2. Click "Simpan Sebagai Draft" or "Selanjutnya"  ← MUST DO THIS FIRST
3. NOW can add anggota (dosen/non-dosen)
4. Edit/delete anggota
5. Continue with form
```

### Design Principle
- **Fail fast with clear message**
- **Better UX than silent API error**
- **Prevents database queries with null values**

---

## 🔐 Code Changes

### File: `resources/js/components/Pengajuan/IdentityAnggota.jsx`

**Change 1: Component signature**
```javascript
// Before
const IdentitasAnggotaPengajuan = ({ usulanId }) => {

// After
const IdentitasAnggotaPengajuan = ({ usulanId, onCreateDraft }) => {
```

**Change 2: handleSaveAnggotaDosen - Added null check**
```javascript
if (!usulanId) {
    alert('Silakan klik "Simpan Sebagai Draft" atau "Selanjutnya" terlebih dahulu untuk membuat usulan!');
    console.warn('usulanId is null, cannot save anggota without usulanId');
    return;
}
```

**Change 3: handleSaveAnggotaNonDosen - Added null check**
Same as above but for non-dosen function

---

## 📚 Related Documentation

- **Phase 9 UAT:** See `PHASE_9_UAT_EXECUTION_GUIDE.md`
- **Previous fix:** See `BUG_FIX_ANGGOTA_REDIRECT_FINAL.md` (form submit issue)
- **CSRF Token Fix:** See previous session notes

---

## 🎯 Action Required

1. **Test the fix:**
   - Hard refresh browser (Ctrl+Shift+R)
   - Follow test cases above
   - Verify alert appears when trying to add anggota before draft

2. **If still getting error:**
   - Check browser console
   - Verify `currentUsulanId` is being set after "Simpan Sebagai Draft"
   - Check Network tab for POST request (should be prevented)

3. **Next step:**
   - Continue with Phase 9 UAT testing
   - Test other 6 critical test cases

---

## ✨ Summary

| Issue | Solution | Status |
|-------|----------|--------|
| null usulanId | Added null check | ✅ Fixed |
| Confusing error | Clear user message | ✅ Improved |
| API request fails | Request prevented | ✅ Prevented |

---

**Status:** ✅ READY FOR TESTING  
**Next:** Run Phase 9 UAT test cases  
**Expected Outcome:** Clear error message instead of database error
