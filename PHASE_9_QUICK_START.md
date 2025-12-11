# Phase 9: UAT Quick Start

**Date:** December 10, 2025  
**Duration:** 2-4 hours  
**Status:** Ready to Begin

---

## 🚀 5-Minute Setup

### **Step 1: Ensure Laravel Running**
```bash
# Terminal 1 - If not already running
cd c:\laragon\www\lppm-react
php artisan serve
# Should output: Laravel development server started on [http://127.0.0.1:8000]
```

### **Step 2: Build Frontend (if needed)**
```bash
# Terminal 2 - If using Vite/esbuild
npm run build
# or
npm run dev  # For development with watch mode
```

### **Step 3: Open Browser**
```
http://localhost:8000
```

### **Step 4: Login**
- Create test user or login with existing credentials
- Make note of the test user details

### **Step 5: Create Test Proposal**
- Navigate to: Pengajuan Penelitian → Buat Usulan Baru
- Fill in basic info (Judul, Tahun, Skema, etc.)
- Save (don't need to go through all steps)
- Note the Proposal ID created

---

## 🧪 Testing Workflow

### **Flow 1: Test Luaran (Research Outputs)**

```
1. Navigate to: Pengajuan Penelitian
2. Click on your test proposal
3. Go to Step 4: Tinjauan/Luaran
4. Click "+ Tambah Luaran"
5. Fill form with:
   - Tahun: 1
   - Kategori: Artikel di jurnal
   - Deskripsi: Publikasi artikel internasional
   - Status: Rencana
6. Click "Simpan"
7. Verify:
   - ✓ Item appears in list
   - ✓ Status badge is yellow
   - ✓ Edit/Delete buttons visible
8. Try Edit:
   - ✓ Form pre-fills
   - ✓ Can update status
9. Try Delete:
   - ✓ Confirmation appears
   - ✓ Item removed from list
```

### **Flow 2: Test RAB (Budget Items)**

```
1. Navigate to: Pengajuan Penelitian → Your Proposal
2. Go to Step 3: RAB
3. Click "+ Tambah RAB"
4. Fill form:
   - Tipe: bahan
   - Kategori: Peralatan
   - Item: Laptop
   - Satuan: unit
   - Volume: 2
   - Harga Satuan: 15000000
5. Watch auto-total:
   - ✓ Should calculate: 30.000.000
6. Click "Simpan"
7. Verify in list:
   - ✓ Item appears in table
   - ✓ Total column shows 30.000.000
   - ✓ Total Anggaran header shows sum
8. Try Edit:
   - ✓ Change volume to 10
   - ✓ Total recalculates to 50.000.000
9. Try Delete:
   - ✓ Total Anggaran recalculated
```

---

## ✅ Quick Checklist

### **Before Testing:**
- [ ] Laravel server running
- [ ] Browser open at http://localhost:8000
- [ ] Logged in
- [ ] Test proposal created
- [ ] DevTools open (F12) for debugging

### **During Testing:**
- [ ] Check console for errors
- [ ] Verify each form submits
- [ ] Check auto-calculations
- [ ] Test edit functionality
- [ ] Test delete functionality
- [ ] Note any issues found

### **After Each Test:**
- [ ] Document result (PASS/FAIL)
- [ ] If FAIL, check console errors
- [ ] If FAIL, verify via Postman
- [ ] Note bug for fixing

---

## 🐛 When Something Breaks

### **Error: Form doesn't submit**
1. Open DevTools (F12)
2. Go to Console tab
3. Look for red error messages
4. Copy error text
5. Check if CSRF token present

**Or use Postman:**
- Test same endpoint via Postman
- Does API work? Then frontend bug
- Does API fail? Then backend bug

### **Error: Auto-total not updating**
1. Check browser console for errors
2. Try typing in volume field
3. Does value appear? (Input working?)
4. Does calculation happen?
5. If no, check RabForm.tsx

### **Error: Data not persisting**
1. Create item via form
2. F5 refresh page
3. Does item still exist?
4. If no: Check API response
5. Might be 201 but not returning full data

---

## 📝 Issue Logging Template

For each issue found, create a note:

```
ISSUE: [Title of problem]
SEVERITY: High / Medium / Low
COMPONENT: RabForm / LuaranList / etc.

WHAT HAPPENED:
[Describe what you did and what happened]

EXPECTED:
[What should have happened]

CONSOLE ERROR:
[Copy from F12 Console if any]

FIX ATTEMPT:
[What did you try to fix it]
```

---

## 🎯 Testing Priority

**HIGH PRIORITY (Test First):**
1. ✅ Can create Luaran?
2. ✅ Can create RAB?
3. ✅ Auto-total calculating?
4. ✅ Data persists on refresh?
5. ✅ Can edit items?
6. ✅ Can delete items?

**MEDIUM PRIORITY (Test Second):**
1. ✅ Error messages display?
2. ✅ Validation errors show?
3. ✅ Loading state visible?
4. ✅ Navigation works?

**LOW PRIORITY (Nice to Have):**
1. ✅ Styling looks good?
2. ✅ Responsive on mobile?
3. ✅ Colors correct?

---

## 📊 Expected Results

### **Luaran Testing**
- Create Luaran ✅ SHOULD WORK
- Edit Luaran ✅ SHOULD WORK
- Delete Luaran ✅ SHOULD WORK
- Status badges ✅ SHOULD DISPLAY

### **RAB Testing**
- Create RAB ✅ SHOULD WORK
- Auto-total calc ✅ SHOULD WORK
- Edit RAB ✅ SHOULD WORK
- Delete RAB ✅ SHOULD WORK
- Total Anggaran ✅ SHOULD UPDATE

### **Common Issues You Might Find**
- ❌ Form doesn't submit
- ❌ Auto-total not calculating
- ❌ Error messages not showing
- ❌ Data not persisting
- ❌ Styling issues

---

## 🔗 File References

If you need to fix something:

**Luaran Components:**
- Form: `resources/js/pages/pengajuan/components/LuaranForm.tsx`
- List: `resources/js/pages/pengajuan/components/LuaranList.tsx`
- Page: `resources/js/pages/pengajuan/steps/page-tinjauan-4.tsx`

**RAB Components:**
- Form: `resources/js/pages/pengajuan/components/RabForm.tsx`
- List: `resources/js/pages/pengajuan/components/RabList.tsx`
- Page: `resources/js/pages/pengajuan/steps/page-rab-3.tsx`

**API Service:**
- `resources/js/services/pengajuanAPI.ts`

---

## 💡 Tips

1. **Keep console open** while testing (F12)
2. **Use Network tab** to see API calls
3. **Test in Postman first** if API seems broken
4. **Refresh browser** if stuck
5. **Check backend logs**: `storage/logs/laravel.log`
6. **Document everything** - even small issues help

---

## ✨ Success Indicators

After Phase 9, you should see:

✅ Can create Luaran via form  
✅ Can create RAB via form  
✅ Auto-calculations work in UI  
✅ Items persist in database  
✅ Can edit items  
✅ Can delete items  
✅ No console errors  
✅ Forms validate input  
✅ Loading states display  
✅ Error messages clear  

---

## 📋 Full Checklist

See `PHASE_9_UAT_PLAN.md` for comprehensive testing checklist with 24+ test cases.

---

**Ready to test?** Open `http://localhost:8000` and start! 🚀
