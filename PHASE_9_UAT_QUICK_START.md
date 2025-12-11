# Phase 9 UAT: Quick Start Guide

## 🚀 What's New in Phase 9

### ✅ 4 Critical Bugs Fixed
1. **Nested Form HTML Error** - Removed nested `<form>` tags
2. **CSRF Token Undefined** - Added axios interceptor with DOM meta tag
3. **Null usulanId Error** - Implemented auto-draft creation feature
4. **Draft Validation Error** - Changed 'judul' to nullable

### ✅ Full Member Management
- Add Dosen/Non-Dosen members
- Edit existing members
- Delete members
- Auto-save with confirmation
- Real-time table updates

### ✅ Backend Integration
- All CRUD operations call backend APIs
- CSRF token protection enabled
- Auto-draft when needed
- Error handling with user messages

---

## 📋 Pre-UAT Checklist

Before testing, verify these are working:

- [ ] `npm run dev` starts dev server
- [ ] `php artisan serve` starts Laravel
- [ ] Database migrations complete
- [ ] CSRF token in HTML head
- [ ] Auth user logged in

---

## 🧪 Phase 9 Test Cases

### Test Case 1: Add Dosen (Auto-Draft)
**Objective:** Verify auto-draft creation when adding member without existing draft

**Steps:**
1. Open proposal form Step 1
2. In "Anggota Penelitian (Dosen)" section, click "+ Tambah" button
3. Should auto-create draft (no visible to user)
4. Form should appear for new member
5. Fill in fields:
   - NIDN/NIDK: `082981928`
   - Nama: `Dr. John Doe`
   - Peran: `Anggota`
   - Institusi: `Politeknik Pertanian`
   - Tugas: `Data Analysis`
6. Click save button
7. Should show alert "Dosen added successfully"

**Expected Result:**
- ✅ Form closes
- ✅ Table shows new member
- ✅ Data persisted to database
- ✅ No error messages

**Fail Criteria:**
- ❌ Form doesn't appear
- ❌ Error message about missing usulanId
- ❌ Data not visible in table
- ❌ Data not in database

---

### Test Case 2: Add Non-Dosen
**Objective:** Verify add operation for non-dosen members

**Steps:**
1. In "Anggota Penelitian Non Dosen" section, click "+ Tambah"
2. Form should appear
3. Fill in fields:
   - Jenis Anggota: `Mahasiswa`
   - No Identitas: `01363726816`
   - Nama: `Ahmad Rizki`
   - Instansi: `Politeknik Pertanian`
   - Tugas: `Survey Lapangan`
4. Click save
5. Should show alert "Non-dosen member added successfully"

**Expected Result:**
- ✅ Member appears in non-dosen table
- ✅ Data correct in all fields
- ✅ Separate from dosen members

---

### Test Case 3: View Members in Table
**Objective:** Verify data displays correctly after adding

**Steps:**
1. Add 2 dosen members (from Test Case 1 & previous data)
2. Add 2 non-dosen members
3. Verify all show in respective tables
4. Check column order:
   - No | NIDN/NIDK | Nama | Peran | Institusi | Tugas | Status | Aksi

**Expected Result:**
- ✅ All members visible
- ✅ Correct data in each column
- ✅ Edit and delete buttons present
- ✅ Status badges show (if applicable)

---

### Test Case 4: Edit Dosen Member
**Objective:** Verify edit operation updates data

**Steps:**
1. In dosen table, click edit icon (pencil) on first row
2. Form should populate with existing data
3. Modify one field:
   - Tugas: Change to `Data Analysis & Reporting`
4. Click save
5. Should show alert "Dosen updated successfully"
6. Form should close
7. Check table - tugas should be updated

**Expected Result:**
- ✅ Form pre-populated with correct data
- ✅ Changes saved to database
- ✅ Table reflects updated data
- ✅ No duplicate rows created

---

### Test Case 5: Delete Dosen Member
**Objective:** Verify delete removes member correctly

**Steps:**
1. In dosen table, click delete icon (trash) on a row
2. Should show confirmation dialog: "Delete this member?"
3. Click OK
4. Should show alert "Dosen deleted successfully"
5. Row should disappear from table

**Expected Result:**
- ✅ Confirmation dialog appears
- ✅ Row removed from table after delete
- ✅ Data removed from database
- ✅ Other rows unaffected

**Fail Criteria:**
- ❌ No confirmation dialog
- ❌ Row still visible after delete
- ❌ Data still in database

---

### Test Case 6: Form Validation & Error Handling
**Objective:** Verify error messages for invalid data

**Steps:**
1. Click "+ Tambah" in dosen section
2. Leave all fields empty
3. Try to save

**Expected Result:**
- ✅ Error message appears (from backend validation)
- ✅ Form doesn't close
- ✅ Data not saved to database
- ✅ Error is clear and helpful

**OR:** 
Try submitting with invalid data:
- NIDN: `abc123` (not numeric)
- Institusi: (empty field)

**Expected Result:**
- ✅ Backend validation catches errors
- ✅ User-friendly error messages
- ✅ Form retains entered data

---

### Test Case 7: Network Error Handling
**Objective:** Verify graceful handling of network failures

**Steps:**
1. Open browser dev tools (F12)
2. Go to Network tab
3. Click "+ Tambah" and try to add member
4. In Network tab, look for API request and right-click → "Block request"
5. Try to save form

**Expected Result:**
- ✅ Error message appears (network timeout)
- ✅ App doesn't crash
- ✅ User can retry
- ✅ No data corrupted

---

## 🔍 Test Data Examples

### Dosen Data
```
NIDN: 082981928
Nama: Dr. Bambang Suwarno
Peran: Anggota
Institusi: Politeknik Pertanian
Tugas: Project Lead & Methodology Design
```

### Non-Dosen Data
```
Jenis Anggota: Mahasiswa
No Identitas: 20220001
Nama: Sinta Permata
Instansi: Politeknik Pertanian
Tugas: Field Research & Data Collection
```

---

## 🐛 Known Issues & Workarounds

### Issue: Browser Cache
**Problem:** Old data showing after edit

**Workaround:** 
- Clear browser cache (Ctrl+Shift+Del)
- Hard refresh (Ctrl+F5)

### Issue: CSRF Token Missing
**Problem:** "CSRF token error" on save

**Workaround:**
- Check meta tag in HTML: `<meta name="csrf-token" content="..."`
- Clear browser cookies
- Log out and back in

### Issue: Auto-Draft Not Creating
**Problem:** "Failed to create proposal draft" error

**Workaround:**
- Verify `/pengajuan/draft` endpoint in routes/api.php
- Check controller validation in UsulanPenelitianController
- Check Laravel logs: `storage/logs/laravel.log`

---

## 📊 Test Results Template

| Test Case | Status | Duration | Issues |
|-----------|--------|----------|--------|
| 1. Add Dosen (Auto-Draft) | ☐ Pass ☐ Fail | ____ min | ____________ |
| 2. Add Non-Dosen | ☐ Pass ☐ Fail | ____ min | ____________ |
| 3. View Members | ☐ Pass ☐ Fail | ____ min | ____________ |
| 4. Edit Member | ☐ Pass ☐ Fail | ____ min | ____________ |
| 5. Delete Member | ☐ Pass ☐ Fail | ____ min | ____________ |
| 6. Form Validation | ☐ Pass ☐ Fail | ____ min | ____________ |
| 7. Network Errors | ☐ Pass ☐ Fail | ____ min | ____________ |

**Total:** ____ / 7 Passed

---

## 🔧 Troubleshooting Commands

### View API Calls
```javascript
// In browser console:
// Watch API calls in Network tab (F12 → Network)
// All requests to /pengajuan/* will appear there
```

### Check Database
```bash
# SSH into server
php artisan tinker

# Check anggota dosen
>>> App\Models\AnggotaDosen::where('usulan_id', 1)->get()

# Check anggota non-dosen
>>> App\Models\AnggotaNonDosen::where('usulan_id', 1)->get()
```

### Check Laravel Logs
```bash
# In laragon/www/lppm-react
tail -f storage/logs/laravel.log

# Or view in file explorer
storage/logs/laravel.log
```

---

## 📝 Sign-Off

After all tests pass:

```
Date: ______________
Tester: _____________
Status: ☐ All Pass ☐ Some Issues ☐ Critical Issues
Issues Found: ____________________________
Ready for Phase 10: ☐ Yes ☐ No
```

---

## 📞 Support

If issues found:
1. Document exact steps to reproduce
2. Note error messages (copy from browser console)
3. Check browser console (F12 → Console tab)
4. Check Laravel logs (storage/logs/laravel.log)
5. Report with test case number

---

**Phase 9 UAT is GO! 🚀**

Start testing and report results in this format.
