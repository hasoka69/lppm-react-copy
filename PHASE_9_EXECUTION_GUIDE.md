# Phase 9: UAT & Bug Fixes - Execution Guide

**Date:** December 10, 2025  
**Status:** Ready for Testing ✅  
**Phase:** 9 of 10  
**Previous Phase:** Phase 8 (Testing Infrastructure) ✓ Complete

---

## 🎯 Mission Objective

Execute comprehensive User Acceptance Testing (UAT) to:
1. Verify all Luaran Penelitian (Research Output) features work
2. Verify all RAB (Research Budget) features work  
3. Identify and document all bugs
4. Ensure forms save data persistently
5. Validate auto-calculation for RAB items

---

## ✅ Pre-Test Verification

### Database Status
- ✅ All migrations run successfully
- ✅ Tables created: `luaran_penelitian`, `rab_item`
- ✅ Ready for test data

### Backend Status
- ✅ Controllers: `LuaranPenelitianController`, `RabItemController`
- ✅ Routes: All 8 endpoints configured
- ✅ Validation: In place for forms

### Frontend Status
- ✅ Components: RabForm, LuaranForm, RabList, LuaranList
- ✅ API Service: `pengajuanAPI.ts` with all 8 methods
- ✅ Integration: Both Step 3 (RAB) and Step 4 (Tinjauan) ready

### Documentation
- ✅ PHASE_9_README.md
- ✅ PHASE_9_QUICK_START.md
- ✅ PHASE_9_UAT_PLAN.md (24+ test cases)
- ✅ PHASE_9_TEST_RESULTS_TEMPLATE.md

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Start Backend
```powershell
cd c:\laragon\www\lppm-react
php artisan serve
```
Expected output: `Server running on http://127.0.0.1:8000`

### Step 2: Start Frontend (Optional but recommended)
Open new terminal:
```powershell
npm run dev
```

### Step 3: Open Browser
Navigate to: `http://localhost:8000`

### Step 4: Login
Use test credentials (admin account from seeder)

### Step 5: Navigate to Test Area
1. Dashboard → Pengajuan (Proposals)
2. Create new proposal (or edit existing)
3. Go to Step 3: Rencana Anggaran Belanja (RAB)
4. Go to Step 4: Tinjauan Luaran Penelitian

---

## 🧪 Critical Test Cases (Must Pass)

### TEST 1: Create Luaran (Research Output)
**Location:** Step 4 - Tinjauan Penelitian  
**Steps:**
1. Click "+ Tambah Luaran Penelitian"
2. Fill form:
   - Tahun: 2024
   - Kategori: (select from dropdown)
   - Deskripsi: "Test Output"
   - Status: Select option
3. Click "Simpan"
4. **Expected:** Item appears in list, no errors
5. **Verify:** Refresh page → Data still there ✓

**Result:** _______  PASS / FAIL

---

### TEST 2: Auto-Calculation (RAB Item)
**Location:** Step 3 - Rencana Anggaran Belanja  
**Steps:**
1. Click "+ Tambah Item RAB"
2. Fill form:
   - Tipe: "Bahan"
   - Kategori: "Bahan Kimia"
   - Item: "Etanol 96%"
   - Satuan: "Liter"
   - Volume: 10
   - Harga Satuan: 50000
3. **CRITICAL:** Look for "Total" field
   - Should show: 500000 (10 × 50000)
   - Should calculate automatically
4. Click "Simpan"

**Expected Result:** Total auto-calculated and displayed  
**Result:** _______  PASS / FAIL

---

### TEST 3: Data Persistence
**Steps:**
1. Create RAB item as in TEST 2
2. Open browser DevTools (F12)
3. Refresh page (Ctrl+R)
4. **Expected:** Data still visible after refresh
5. Repeat for Luaran item

**Result:** _______  PASS / FAIL

---

### TEST 4: Edit Functionality
**Luaran Test:**
1. Create Luaran item (TEST 1)
2. Click "Edit" button
3. Change Deskripsi to "Updated Description"
4. Click "Simpan"
5. **Expected:** List updates, old data replaced

**RAB Test:**
1. Create RAB item (TEST 2)
2. Click "Edit" button
3. Change Volume to 20
4. **Expected:** Total auto-recalculates to 1000000
5. Click "Simpan"

**Result:** Luaran: _______  RAB: _______

---

### TEST 5: Delete Functionality
**Luaran Test:**
1. Create Luaran
2. Click "Hapus" (Delete)
3. Confirm deletion
4. **Expected:** Item disappears from list

**RAB Test:**
1. Create RAB item
2. Click "Hapus" (Delete)
3. Confirm deletion
4. **Expected:** Item disappears, total updates

**Result:** Luaran: _______  RAB: _______

---

### TEST 6: Form Validation
**Steps:**
1. Click "+ Tambah Item RAB"
2. Try to submit without filling required fields
3. **Expected:** Error messages appear for each field
4. Repeat for Luaran form

**Critical Validations:**
- Volume must be number > 0
- Harga Satuan must be number > 0
- Kategori must be selected
- Item description must not be empty

**Result:** _______  PASS / FAIL

---

### TEST 7: Navigation Between Steps
**Steps:**
1. Fill in Step 1-2 (Basic & Substansi)
2. Go to Step 3 (RAB) → Add 2-3 RAB items
3. Click "Kembali" (Back) → Then "Lanjut" (Next) again
4. **Expected:** RAB data still there
5. Go to Step 4 (Tinjauan) → Add Luaran
6. Click "Kembali" → Then "Lanjut" again
7. **Expected:** Luaran data still there

**Result:** _______  PASS / FAIL

---

## 🐛 Bug Tracking Format

When you find a bug, document it like this:

```
BUG #1: [Title]
---------
Severity: CRITICAL / HIGH / MEDIUM / LOW
Location: Step 3 / Step 4 / Both
Frequency: Always / Sometimes / Once

Reproduction Steps:
1. Step 1
2. Step 2
3. Result: Expected X but got Y

Expected Behavior:
[What should happen]

Actual Behavior:
[What actually happens]

Error Message:
[If any error shown]

Browser: Chrome / Firefox / Safari
Device: Desktop / Tablet / Mobile
```

---

## 📊 Results Summary Template

Fill this out after testing:

```
PHASE 9 UAT RESULTS
==================

Test Date: ___________
Tester: ___________
Browser: ___________

CRITICAL TESTS:
[ ] TEST 1: Create Luaran - PASS/FAIL
[ ] TEST 2: Auto-Calculation - PASS/FAIL
[ ] TEST 3: Data Persistence - PASS/FAIL
[ ] TEST 4: Edit Functionality - PASS/FAIL
[ ] TEST 5: Delete Functionality - PASS/FAIL
[ ] TEST 6: Form Validation - PASS/FAIL
[ ] TEST 7: Navigation - PASS/FAIL

Bugs Found: _____ CRITICAL, _____ HIGH, _____ MEDIUM, _____ LOW

Status: READY FOR PRODUCTION / NEEDS FIXES

Sign-off: ___________________ Date: ___________
```

---

## 🛠️ Troubleshooting

### Issue: "404 Not Found" on forms
**Solution:** 
- Check Laravel server is running
- Check route configuration
- Verify usulanId is passed correctly

### Issue: "CSRF token mismatch"
**Solution:**
- Hard refresh (Ctrl+Shift+R)
- Clear browser cache
- Check CSRF token in HTML meta tag

### Issue: Auto-calculation not showing
**Solution:**
- Check RabForm.tsx has auto-calculation logic
- Open browser console (F12) for JS errors
- Check if total field is being rendered

### Issue: Data not saving
**Solution:**
- Check network tab (F12 → Network)
- Look for failed API calls
- Check API response for validation errors

### Issue: Buttons not responding
**Solution:**
- Check if JavaScript is enabled
- Look for JavaScript errors in console
- Try different browser

---

## ✨ Success Criteria

Phase 9 is COMPLETE when:
- ✅ All 7 critical tests PASS
- ✅ All CRITICAL bugs fixed
- ✅ All HIGH priority bugs fixed (or documented with workaround)
- ✅ Data persists after page refresh
- ✅ Auto-calculation works correctly
- ✅ Forms validate input properly
- ✅ No console errors when using features

---

## 📝 Next Steps After UAT

### If All Tests Pass ✓
→ Sign off on UAT results  
→ Mark Phase 9 as COMPLETE  
→ Proceed to **Phase 10: Production Deployment**

### If Bugs Found 🐛
1. Document all bugs in detail
2. Report to development team
3. Prioritize by severity (CRITICAL first)
4. Create Phase 9 Bug Fix branch
5. Fix bugs
6. Re-test affected functionality
7. Repeat until all tests pass

---

## 📚 Related Documentation

- **PHASE_9_README.md** - Overview and Phase 9 explanation
- **PHASE_9_QUICK_START.md** - 5-minute quick reference
- **PHASE_9_UAT_PLAN.md** - Detailed 24+ test cases by section
- **PHASE_9_TEST_RESULTS_TEMPLATE.md** - Results tracking template
- **postman_collection_phase_8.json** - API endpoint testing (Phase 8)

---

## 🎓 Component Architecture Reference

### Frontend Structure
```
resources/js/
├── services/
│   └── pengajuanAPI.ts          (8 API methods)
└── pages/pengajuan/
    ├── steps/
    │   ├── page-rab-3.tsx        (Step 3: RAB)
    │   └── page-tinjauan-4.tsx   (Step 4: Luaran)
    └── components/
        ├── RabForm.tsx           (Form for RAB items)
        ├── RabList.tsx           (List of RAB items)
        ├── LuaranForm.tsx        (Form for Luaran)
        └── LuaranList.tsx        (List of Luaran)
```

### Backend Structure
```
app/Http/Controllers/
├── LuaranPenelitianController.php  (Luaran logic)
└── RabItemController.php            (RAB logic)

routes/web.php
└── pengajuan routes (8 endpoints)
```

### Database Tables
```
- luaran_penelitian  (id, usulan_id, tahun, kategori, deskripsi, status)
- rab_item          (id, usulan_id, tipe, kategori, item, satuan, volume, 
                      harga_satuan, total, keterangan)
```

---

## 🚀 Ready to Start?

1. Read this guide completely ✓
2. Start Laravel: `php artisan serve`
3. Open browser: `http://localhost:8000`
4. Login and navigate to pengajuan
5. Start with TEST 1
6. Document results
7. Report findings

**Estimated Duration:** 2-3 hours for complete UAT

**Questions?** Check PHASE_9_QUICK_START.md for quick troubleshooting

---

**Generated:** December 10, 2025  
**Phase:** 9 of 10  
**Status:** Ready for Testing ✅
