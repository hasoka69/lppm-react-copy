# Phase 9: UAT & Bug Fixes - Testing Plan

**Date:** December 10, 2025  
**Status:** In Progress  
**Phase:** 9 of 10  
**Duration:** 2-4 hours estimated

---

## 📋 UAT Testing Overview

This phase focuses on **User Acceptance Testing (UAT)** - testing the application from a user's perspective in the browser, verifying all features work correctly, and fixing any bugs found.

### **Objectives:**

✅ Verify all UI components render correctly  
✅ Test form validation and error messages  
✅ Check auto-calculations work in UI  
✅ Verify data persistence  
✅ Test navigation flows  
✅ Check loading/error states  
✅ Verify styling and responsiveness  
✅ Document and fix any bugs  

---

## 🧪 UAT Test Scenarios

### **Section A: Luaran Form Testing**

#### **A.1: Create New Luaran - Valid Data**

**Prerequisites:**
- Application running at http://localhost:8000
- Logged in as test user
- Proposal/Usulan created in database
- Navigate to: Pengajuan Penelitian → Step 4 (Tinjauan)

**Test Steps:**

1. Click "+ Tambah Luaran" button
   - ✓ Form should appear
   - ✓ Fields: tahun (dropdown 1-5), kategori, deskripsi (textarea), status (dropdown), keterangan
   - ✓ Form title: "Tambah Luaran Baru"

2. Fill in form:
   ```
   Tahun: 1
   Kategori: Artikel di jurnal
   Deskripsi: Publikasi di jurnal internasional bereputasi
   Status: Rencana
   Keterangan: Target Q4 2026
   ```

3. Click "Simpan" button
   - ✓ Form should submit
   - ✓ Loading state visible (disabled inputs, loading spinner)
   - ✓ After 1-2 seconds: Success message appears
   - ✓ Form closes
   - ✓ New item appears in list below

4. Verify new item in list:
   - ✓ Tahun: 1
   - ✓ Kategori: Artikel di jurnal
   - ✓ Status badge: Yellow (Rencana)
   - ✓ Deskripsi displayed
   - ✓ Edit & Delete buttons available

**Expected Result:** ✅ PASS
- Item created successfully
- Appears in list immediately
- All data correct

**If FAIL:**
- [ ] Check console errors (F12)
- [ ] Check network tab for 422/500 errors
- [ ] Verify API response in Postman
- [ ] Document error in Issues section

---

#### **A.2: Form Validation - Missing Required Fields**

**Test Steps:**

1. Click "+ Tambah Luaran"
2. Leave "Deskripsi" field empty
3. Fill other required fields
4. Click "Simpan"

**Expected Result:**
- ✅ Form does NOT submit
- ✅ Error message appears: "Deskripsi is required"
- ✅ Error message in red below field
- ✅ Form stays open for correction

**If FAIL:**
- [ ] Check if validation working in component
- [ ] Verify error handling in LuaranForm.tsx
- [ ] Document issue

---

#### **A.3: Form Validation - Invalid Tahun**

**Test Steps:**

1. Click "+ Tambah Luaran"
2. Select invalid tahun (if available)
3. Fill other fields
4. Click "Simpan"

**Expected Result:**
- ✅ Error message: "Tahun must be between 1 and 5"
- ✅ Form does not submit

---

#### **A.4: Edit Existing Luaran**

**Test Steps:**

1. Click Edit button on existing Luaran item
   - ✓ Form should appear with "Edit Luaran" title
   - ✓ Form fields pre-filled with current values

2. Change status: Rencana → Dalam Proses
3. Add keterangan: "Sedang ditulis"
4. Click "Simpan"

**Expected Result:**
- ✅ Item updates successfully
- ✅ Status badge changes color (blue for "Dalam Proses")
- ✅ Keterangan displayed

---

#### **A.5: Delete Luaran**

**Test Steps:**

1. Click Delete button on Luaran item
2. Confirmation dialog appears: "Apakah Anda yakin?"
3. Click "Hapus"

**Expected Result:**
- ✅ Item deleted from list
- ✅ Success message appears
- ✅ List updates immediately

---

### **Section B: RAB Form Testing**

#### **B.1: Create New RAB - Valid Data**

**Prerequisites:**
- Navigate to: Pengajuan Penelitian → Step 3 (RAB)

**Test Steps:**

1. Click "+ Tambah RAB" button
   - ✓ Form appears
   - ✓ Fields: tipe (dropdown), kategori, item, satuan, volume, harga_satuan, keterangan
   - ✓ Auto-total display visible (should show 0 initially)

2. Fill in form:
   ```
   Tipe: bahan
   Kategori: Peralatan
   Item: Laptop
   Satuan: unit
   Volume: 2
   Harga Satuan: 15000000
   Keterangan: Untuk penelitian
   ```

3. Watch auto-total update:
   - ✓ As you type volume and price, auto-total should calculate
   - ✓ Display: "Total: Rp 30.000.000"

4. Click "Simpan"
   - ✓ Form submits
   - ✓ Loading state visible
   - ✓ Success message
   - ✓ Form closes

5. Verify in RAB List:
   - ✓ Item appears in table
   - ✓ Total column shows: 30.000.000 or 30000000
   - ✓ Total Anggaran header updated
   - ✓ Format shows: Rp [amount]

**Expected Result:** ✅ PASS
- Item created with correct auto-calculated total
- Total Anggaran updated in header

**Critical Test:** Auto-calculation
```
Input: volume=2, harga_satuan=15000000
Expected: total = 30000000
Verify: In form display AND in list table
```

---

#### **B.2: Auto-Total Display While Typing**

**Test Steps:**

1. Open RAB form
2. Fill volume: 5
3. Check auto-total updates
4. Fill harga_satuan: 200000
5. Watch auto-total recalculate

**Expected Result:**
- ✅ Auto-total updates in real-time
- ✓ After: volume=5, price=200k → Display: "Rp 1.000.000"

---

#### **B.3: Edit RAB - Recalculation**

**Test Steps:**

1. Click Edit on RAB item (e.g., current: 2 units × 15M = 30M)
2. Change: volume=10, harga_satuan=5000000
3. Check auto-total updates in form
4. Click "Simpan"
5. Verify in list:
   - ✓ Total changed to 50.000.000
   - ✓ Total Anggaran header recalculated

**Expected Result:**
- ✅ Auto-recalculation works
- ✅ Before: 30M → After: 50M
- ✅ Total Anggaran updated correctly

---

#### **B.4: RAB List - Total Anggaran Calculation**

**Test Steps:**

1. Go to RAB Step 3
2. View the blue header box showing "Total Anggaran"
3. If multiple items exist, verify total:
   - ✓ Item 1 total: 30M
   - ✓ Item 2 total: 20M
   - ✓ Header should show: 50M

**Calculation:**
- Sum all item totals
- Verify matches header display

**Expected Result:**
- ✅ Total Anggaran = Sum of all items
- ✅ Formatted with Rp prefix
- ✅ Matches manual calculation

---

#### **B.5: Delete RAB**

**Test Steps:**

1. Note current Total Anggaran (e.g., 50M)
2. Click Delete on one item (e.g., 20M item)
3. Confirm deletion
4. Verify Total Anggaran updated to 30M

**Expected Result:**
- ✅ Item deleted
- ✅ Total Anggaran recalculated (50M → 30M)

---

### **Section C: List Display Testing**

#### **C.1: Luaran List Display**

**Test Steps:**

1. Navigate to Step 4 (Tinjauan)
2. View Luaran list

**Verify:**
- ✓ Each item displayed as card
- ✓ Status badges visible with colors:
  - Yellow: Rencana
  - Blue: Dalam Proses
  - Green: Selesai
- ✓ Deskripsi shows
- ✓ Keterangan shows (if exists)
- ✓ Edit & Delete buttons available
- ✓ Total count shown: "Total: X items"

**If empty:**
- ✓ "Belum ada data" message displayed

---

#### **C.2: RAB List Display**

**Test Steps:**

1. Navigate to Step 3 (RAB)
2. View RAB table

**Verify:**
- ✓ Table has columns: Tipe, Kategori, Item, Volume, Harga/Unit, Total, Aksi
- ✓ All items displayed correctly
- ✓ Total Anggaran in blue header box
- ✓ Currency formatting: Rp [amount] or [amount] with separators
- ✓ Edit & Delete buttons in Aksi column
- ✓ Total count shown

---

### **Section D: Error Handling Testing**

#### **D.1: Network Error Handling**

**Test Steps:**

1. Stop Laravel server (php artisan serve - Ctrl+C)
2. Try to create Luaran or RAB
3. Observe error handling

**Expected Result:**
- ✅ Error message displayed to user
- ✅ Not a cryptic server error
- ✅ User-friendly message: "Failed to save, please try again"
- ✓ Retry button available

**If FAIL:**
- [ ] Check error handling in component
- [ ] Verify error message display
- [ ] Document issue

---

#### **D.2: Invalid Data Error**

**Test Steps:**

1. Try to submit form with empty required field
2. Or submit with negative number for volume

**Expected Result:**
- ✅ 422 error from backend
- ✅ Validation errors displayed in form
- ✅ User can correct and resubmit

---

### **Section E: Data Persistence Testing**

#### **E.1: Data Survives Page Refresh**

**Test Steps:**

1. Create a new Luaran item
2. Verify it appears in list
3. Refresh page (F5)
4. Verify item still appears

**Expected Result:**
- ✅ Data persists after page refresh
- ✅ Item still in list

---

#### **E.2: Navigation Between Steps**

**Test Steps:**

1. Go to Step 3 (RAB)
2. Create an item
3. Navigate to Step 4 (Tinjauan)
4. Go back to Step 3

**Expected Result:**
- ✅ RAB item still there
- ✅ No data loss on navigation

---

### **Section F: UI/UX Testing**

#### **F.1: Form Usability**

**Test Steps:**

1. Open form
2. Check:
   - ✓ Labels clear and readable
   - ✓ Input fields adequate size
   - ✓ Buttons easy to click
   - ✓ Error messages visible
   - ✓ Loading state obvious

---

#### **F.2: Responsive Design**

**Test Steps:**

1. Open in desktop (1920x1080)
   - ✓ Table/cards display correctly
2. Resize to tablet size (768px)
   - ✓ Still usable
3. Check mobile size (375px)
   - ✓ Stack vertically, readable

---

#### **F.3: Color & Styling**

**Test Steps:**

1. Status badges:
   - ✓ Yellow for Rencana
   - ✓ Blue for Dalam Proses
   - ✓ Green for Selesai

2. Buttons:
   - ✓ Primary button: Blue
   - ✓ Danger button: Red
   - ✓ Secondary button: Gray

3. Text:
   - ✓ Readable font size
   - ✓ Good contrast
   - ✓ Proper spacing

---

## 📝 UAT Test Checklist

### **Luaran Tests**
- [ ] A.1: Create Luaran - Valid ✓
- [ ] A.2: Form Validation - Missing Fields ✓
- [ ] A.3: Form Validation - Invalid Tahun ✓
- [ ] A.4: Edit Luaran ✓
- [ ] A.5: Delete Luaran ✓

### **RAB Tests**
- [ ] B.1: Create RAB - Valid ✓
- [ ] B.2: Auto-Total Display ✓
- [ ] B.3: Edit RAB - Recalculation ✓
- [ ] B.4: Total Anggaran Calculation ✓
- [ ] B.5: Delete RAB ✓

### **List Display**
- [ ] C.1: Luaran List Display ✓
- [ ] C.2: RAB List Display ✓

### **Error Handling**
- [ ] D.1: Network Error Handling ✓
- [ ] D.2: Invalid Data Error ✓

### **Data Persistence**
- [ ] E.1: Data Survives Refresh ✓
- [ ] E.2: Navigation Persistence ✓

### **UI/UX**
- [ ] F.1: Form Usability ✓
- [ ] F.2: Responsive Design ✓
- [ ] F.3: Color & Styling ✓

**Total Tests: 24** | **Target: 100% PASS**

---

## 🐛 Issue Documentation Template

When you find a bug, document it like this:

```
### Issue #X: [Title]

**Severity:** Critical | High | Medium | Low

**Description:**
What happened? What was expected?

**Steps to Reproduce:**
1. Do this
2. Then this
3. Result: This should happen but didn't

**Actual Result:**
What actually happened?

**Expected Result:**
What should have happened?

**Environment:**
- Browser: Chrome, Firefox, etc.
- Screen Size: 1920x1080 or responsive
- User Role: Admin, Peneliti, etc.

**Screenshots:**
[Paste screenshot if applicable]

**Console Errors:**
[F12 → Console tab → Copy any errors]

**Postman Result:**
[If API test passed but UI failed, note that]

**Recommended Fix:**
[Your suggestion if applicable]

**Status:** Open | In Progress | Fixed | Verified
```

---

## 🔧 Common Issues to Check

### **Issue: Auto-total not calculating**
- [ ] Check that onChange handlers are attached to inputs
- [ ] Verify useEffect listens to volume & harga_satuan
- [ ] Check browser console for errors

### **Issue: Form doesn't submit**
- [ ] Check console for errors
- [ ] Verify API endpoint in Network tab
- [ ] Check CSRF token validity

### **Issue: List doesn't update after create**
- [ ] Check if refresh trigger is working
- [ ] Verify setRefreshTrigger is called
- [ ] Check useEffect dependencies

### **Issue: Validation errors not displaying**
- [ ] Verify error state management
- [ ] Check if error response is 422
- [ ] Verify error rendering in JSX

### **Issue: Loading state stuck**
- [ ] Check if setLoading(false) is called on error
- [ ] Verify promise chain completion
- [ ] Check for missing catch() block

---

## 📞 Quick Debug Checklist

When something doesn't work:

1. **Open DevTools (F12)**
   - [ ] Check Console tab for errors
   - [ ] Check Network tab for failed requests
   - [ ] Note any 4xx or 5xx status codes

2. **Check Component Props**
   - [ ] usulanId passed correctly?
   - [ ] Callbacks (onSubmitSuccess, onCancel) defined?

3. **Verify Backend**
   - [ ] Test endpoint in Postman
   - [ ] Does same operation work via API?

4. **Check Data**
   - [ ] Is test data in database?
   - [ ] Are permissions correct?

5. **Browser Issues**
   - [ ] Clear cache: Ctrl+Shift+Delete
   - [ ] Try different browser
   - [ ] Check browser console for warnings

---

## ✅ UAT Sign-Off Criteria

**Phase 9 is complete when:**

✅ All 24 test cases pass  
✅ No critical bugs remaining  
✅ Data persists correctly  
✅ Auto-calculations work  
✅ Error messages display  
✅ UI is responsive  
✅ Navigation works  
✅ All issues documented  
✅ High & medium bugs fixed  

---

## 📈 Progress Tracking

| Test Section | Status | Notes |
|---|---|---|
| Luaran Form | [ ] | - |
| RAB Form | [ ] | - |
| List Display | [ ] | - |
| Error Handling | [ ] | - |
| Data Persistence | [ ] | - |
| UI/UX | [ ] | - |
| **Overall** | [ ] | - |

---

## 🎯 Next Steps

After UAT complete:

1. ✅ Document all issues found
2. ✅ Fix critical & high severity bugs
3. ✅ Re-test fixed issues
4. ✅ Final verification
5. ➡️ Move to Phase 10: Production Deployment

---

**Phase 9 Start:** December 10, 2025  
**Estimated Duration:** 2-4 hours  
**Status:** In Progress  

Ready to start testing? Open browser and navigate to the Pengajuan Penelitian form! 🚀
