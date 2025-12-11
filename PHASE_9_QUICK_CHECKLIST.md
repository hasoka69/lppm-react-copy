# Phase 9: Quick Testing Checklist

**Start Time:** ___________  
**Tester:** ___________

---

## Pre-Test Checklist
- [ ] Laravel running: `php artisan serve`
- [ ] Browser open: http://localhost:8000
- [ ] Logged in successfully
- [ ] In Pengajuan (Proposals) section

---

## Critical Tests

### 1️⃣ Create Luaran
- [ ] Step 4: Tinjauan Penelitian
- [ ] Click "+ Tambah Luaran Penelitian"
- [ ] Fill: Tahun 2024, Category, Description, Status
- [ ] Click Simpan
- [ ] Item appears in list ✓
- [ ] Refresh page → Still there ✓
- **Status:** ☐ PASS ☐ FAIL

### 2️⃣ Auto-Calculation
- [ ] Step 3: Rencana Anggaran Belanja
- [ ] Click "+ Tambah Item RAB"
- [ ] Fill: Volume=10, Harga Satuan=50000
- [ ] **CRITICAL:** Total field shows 500000? ☐ YES ☐ NO
- [ ] Auto-calculated (not manual)? ☐ YES ☐ NO
- [ ] Click Simpan
- **Status:** ☐ PASS ☐ FAIL

### 3️⃣ Data Persistence
- [ ] Create RAB item (Test 2)
- [ ] Open DevTools (F12)
- [ ] Refresh page (Ctrl+R)
- [ ] Luaran still visible? ☐ YES ☐ NO
- [ ] RAB still visible? ☐ YES ☐ NO
- **Status:** ☐ PASS ☐ FAIL

### 4️⃣ Edit Functionality
**Luaran:**
- [ ] Click "Edit" on Luaran
- [ ] Change Description
- [ ] Simpan
- [ ] Changes visible? ☐ YES ☐ NO

**RAB:**
- [ ] Click "Edit" on RAB item
- [ ] Change Volume to 20
- [ ] Total auto-updates to 1000000? ☐ YES ☐ NO
- [ ] Simpan
- [ ] Changes visible? ☐ YES ☐ NO

- **Status:** ☐ PASS ☐ FAIL

### 5️⃣ Delete Functionality
**Luaran:**
- [ ] Click "Hapus" on Luaran
- [ ] Confirm delete
- [ ] Item removed? ☐ YES ☐ NO

**RAB:**
- [ ] Click "Hapus" on RAB
- [ ] Confirm delete
- [ ] Item removed? ☐ YES ☐ NO

- **Status:** ☐ PASS ☐ FAIL

### 6️⃣ Form Validation
- [ ] Try submit RAB form empty
- [ ] Error messages appear? ☐ YES ☐ NO
- [ ] For each required field? ☐ YES ☐ NO
- [ ] Try submit Luaran form empty
- [ ] Error messages appear? ☐ YES ☐ NO

- **Status:** ☐ PASS ☐ FAIL

### 7️⃣ Navigation
- [ ] Add RAB items in Step 3
- [ ] Click "Kembali" then "Lanjut"
- [ ] RAB data still there? ☐ YES ☐ NO
- [ ] Add Luaran in Step 4
- [ ] Click "Kembali" then "Lanjut"
- [ ] Luaran data still there? ☐ YES ☐ NO

- **Status:** ☐ PASS ☐ FAIL

---

## Bugs Found

### Bug #1
**Severity:** ☐ CRITICAL ☐ HIGH ☐ MEDIUM ☐ LOW  
**Location:** ________________  
**Issue:** ________________________________________  
**Steps to Reproduce:** ________________________________________  
**Expected:** ________________________________________  
**Actual:** ________________________________________  

### Bug #2
**Severity:** ☐ CRITICAL ☐ HIGH ☐ MEDIUM ☐ LOW  
**Location:** ________________  
**Issue:** ________________________________________  
**Steps to Reproduce:** ________________________________________  
**Expected:** ________________________________________  
**Actual:** ________________________________________  

### Bug #3
**Severity:** ☐ CRITICAL ☐ HIGH ☐ MEDIUM ☐ LOW  
**Location:** ________________  
**Issue:** ________________________________________  
**Steps to Reproduce:** ________________________________________  
**Expected:** ________________________________________  
**Actual:** ________________________________________  

---

## Results Summary

| Test | Status | Issues |
|------|--------|--------|
| 1. Create Luaran | ☐ PASS ☐ FAIL | _____________ |
| 2. Auto-Calc | ☐ PASS ☐ FAIL | _____________ |
| 3. Persistence | ☐ PASS ☐ FAIL | _____________ |
| 4. Edit | ☐ PASS ☐ FAIL | _____________ |
| 5. Delete | ☐ PASS ☐ FAIL | _____________ |
| 6. Validation | ☐ PASS ☐ FAIL | _____________ |
| 7. Navigation | ☐ PASS ☐ FAIL | _____________ |

**Total Bugs:** CRITICAL __ HIGH __ MEDIUM __ LOW __

---

## Overall Status

☐ READY FOR PRODUCTION (All tests pass, no critical bugs)  
☐ NEEDS FIXES (Bugs found, need fixing)  
☐ MAJOR ISSUES (Multiple critical bugs)

---

## Sign-off

**Tester:** ________________________  
**Date:** ________________________  
**Time Spent:** ________________________  

---

**Next Step:** 
- If READY: Proceed to Phase 10
- If NEEDS FIXES: Submit this checklist + PHASE_9_EXECUTION_GUIDE.md bug section
