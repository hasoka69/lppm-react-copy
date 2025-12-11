# Phase 8 Testing - Quick Start Guide

**Date:** December 10, 2025  
**Status:** Ready to Execute  
**Files Created:**
- `TESTING_GUIDE_PHASE_8.md` - Comprehensive testing documentation
- `postman_collection_phase_8.json` - Ready-to-import Postman collection

---

## ⚡ Quick Setup (5 minutes)

### **Step 1: Prepare Test Environment**

1. **Create test proposal** (if database is empty):
   ```bash
   php artisan tinker
   > App\Models\UsulanPenelitian::create([
   >   'user_id' => 1,
   >   'judul' => 'Test Proposal',
   >   'tahun_usulan' => 2026,
   >   'status' => 'draft'
   > ])
   > // Note the ID returned (e.g., 1)
   > exit
   ```

2. **Start the application:**
   ```bash
   # In new terminal
   php artisan serve
   # Runs at http://localhost:8000
   ```

### **Step 2: Setup Postman**

1. **Open Postman**
2. **Import Collection:**
   - File → Import → Select `postman_collection_phase_8.json`
3. **Create Environment:**
   - New → Environment → Name: "Pengajuan Testing"
   - Add variables:
     | Variable | Value |
     |---|---|
     | base_url | http://localhost:8000 |
     | usulan_id | 1 |
     | csrf_token | (see Step 3) |

### **Step 3: Get CSRF Token**

1. **Open browser** and go to `http://localhost:8000`
2. **Login** with test account
3. **Open DevTools** (F12)
4. **Go to:** Application → Cookies → Find "XSRF-TOKEN"
5. **Copy the value** and paste into `{{csrf_token}}` variable in Postman

---

## 🧪 Testing Sequence

### **Run Tests in Order:**

**Group 1: Luaran Tests (6 tests)**
```
1. 1.1 GET - List Luaran (empty)
2. 1.2 POST - Create Luaran ✓
3. 1.3 POST - Validation Error
4. 1.4 POST - Invalid tahun Error
5. 1.5 PUT - Update Luaran
6. 1.6 DELETE - Delete Luaran
```

**Group 2: RAB Tests (6 tests)**
```
1. 2.1 GET - List RAB (empty)
2. 2.2 POST - Create RAB + Auto-calc ✓
3. 2.3 POST - Validation Error
4. 2.4 POST - Invalid tipe Error
5. 2.5 PUT - Update + Recalculate ✓
6. 2.6 DELETE - Delete RAB
```

**Group 3: Integration Tests (2 workflows)**
```
1. Workflow A: Luaran complete cycle
2. Workflow B: RAB with total verification
```

**Group 4: Error Cases (3 tests)**
```
1. E1: Non-existent usulan (404)
2. E2: Non-existent Luaran (404)
3. E3: Missing CSRF token
```

---

## 📊 Expected Results

### **Test 1.2 - POST Create Luaran**
```
Status: 201 Created
Response body includes:
- id: 1
- tahun: 1
- kategori: "Artikel di jurnal"
- deskripsi: "Publikasi artikel..."
- status: "Rencana"
```

### **Test 2.2 - POST Create RAB (Auto-calculation)**
```
Status: 201 Created
Key assertion: total = volume × harga_satuan
Request: volume=2, harga_satuan=15000000
Expected: total=30000000 ✓
```

### **Test 2.5 - PUT Update RAB (Recalculation)**
```
Status: 200 OK
Before: volume=2, harga_satuan=15M → total=30M
After:  volume=10, harga_satuan=5M → total=50M ✓
```

### **Test 2.3 - GET RAB Workflow**
```
Status: 200 OK
Response includes:
- data: [{item1}, {item2}]
- total_anggaran: 50000000 ✓
- currency: "IDR"
```

---

## ✅ Success Criteria

All 16+ tests should pass:

| Group | Count | Status |
|---|---|---|
| Luaran CRUD | 6 | ✓ Pass |
| RAB CRUD | 6 | ✓ Pass |
| Integration | 2+ | ✓ Pass |
| Error Cases | 3 | ✓ Pass |
| **TOTAL** | **17+** | **✓ PASS** |

---

## 🐛 Troubleshooting

### **Issue: 422 Validation Error on all POST**
**Solution:** Check field names match exactly:
- Luaran: `tahun, kategori, deskripsi, status, keterangan`
- RAB: `tipe, kategori, item, satuan, volume, harga_satuan, keterangan`

### **Issue: 401 Unauthorized**
**Solution:** 
- Make sure you're logged in
- CSRF token might be expired - get new one
- Check cookies are included in Postman (enable in Postman settings)

### **Issue: 403 Forbidden on DELETE**
**Solution:** Only delete items you created/have access to

### **Issue: CSRF Token Validation Fails**
**Solution:**
1. Clear browser cookies
2. Log out and log in again
3. Get fresh CSRF token
4. Update Postman variable

---

## 📝 Test Checklist

- [ ] Environment variables set in Postman
- [ ] CSRF token copied and valid
- [ ] Connected to database with test data
- [ ] Laravel server running on port 8000
- [ ] Logged in with test user
- [ ] Postman collection imported
- [ ] Test 1.1: GET empty Luaran list - ✓
- [ ] Test 1.2: POST create Luaran - ✓
- [ ] Test 2.1: GET empty RAB list - ✓
- [ ] Test 2.2: POST create RAB with auto-calc - ✓
- [ ] Test 2.5: PUT RAB with recalculation - ✓
- [ ] Workflow A: Complete Luaran cycle - ✓
- [ ] Workflow B: Complete RAB with totals - ✓
- [ ] Error cases tested - ✓
- [ ] All assertions passed - ✓
- [ ] Documentation complete - ✓

---

## 📞 Common API Patterns

### **CREATE (POST)**
```bash
curl -X POST \
  'http://localhost:8000/pengajuan/{usulan_id}/luaran' \
  -H 'Content-Type: application/json' \
  -H 'X-CSRF-TOKEN: {{csrf_token}}' \
  -d '{"tahun": 1, "kategori": "...", "deskripsi": "...", "status": "Rencana"}'
```

### **READ (GET)**
```bash
curl -X GET \
  'http://localhost:8000/pengajuan/{usulan_id}/luaran' \
  -H 'X-CSRF-TOKEN: {{csrf_token}}'
```

### **UPDATE (PUT)**
```bash
curl -X PUT \
  'http://localhost:8000/pengajuan/luaran/{id}' \
  -H 'Content-Type: application/json' \
  -H 'X-CSRF-TOKEN: {{csrf_token}}' \
  -d '{"tahun": 2, "status": "Dalam Proses", ...}'
```

### **DELETE (DELETE)**
```bash
curl -X DELETE \
  'http://localhost:8000/pengajuan/luaran/{id}' \
  -H 'X-CSRF-TOKEN: {{csrf_token}}'
```

---

## 🎯 Next Steps After Testing

1. ✅ **All tests pass:**
   - Document any bugs found
   - Move to Phase 9 (UAT & Bug Fixes)

2. ⚠️ **Some tests fail:**
   - Check error response in Postman
   - Review backend controller logic
   - Check database constraints
   - Fix and re-test

3. ❌ **Critical failures:**
   - Review error logs: `storage/logs/laravel.log`
   - Check database queries: Enable query logging
   - Review controller implementation

---

## 📚 Documentation References

- Full Guide: `TESTING_GUIDE_PHASE_8.md`
- Postman Collection: `postman_collection_phase_8.json`
- Backend Code: `app/Http/Controllers/LuaranPenelitianController.php`
- Backend Code: `app/Http/Controllers/RabItemController.php`
- Frontend Components: `resources/js/pages/pengajuan/components/`

---

**Status:** Phase 8 Ready ✅  
**Start Testing:** Import Postman collection and follow the sequence above!  
**Questions?** Refer to comprehensive `TESTING_GUIDE_PHASE_8.md`
