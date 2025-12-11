# API Testing Guide - Pengajuan Penelitian System
## Phase 8: Complete Endpoint Testing

**Created:** December 10, 2025  
**Last Updated:** December 10, 2025  
**Status:** In Progress

---

## 1. Overview

This testing guide covers **8 API endpoints** for the Research Proposal (Pengajuan Penelitian) system:

### **Luaran Research Outputs (4 endpoints)**
- GET `/pengajuan/{usulan_id}/luaran` - List all Luaran items
- POST `/pengajuan/{usulan_id}/luaran` - Create new Luaran
- PUT `/pengajuan/luaran/{luaran_id}` - Update existing Luaran
- DELETE `/pengajuan/luaran/{luaran_id}` - Delete Luaran

### **RAB Budget Items (4 endpoints)**
- GET `/pengajuan/{usulan_id}/rab` - List all RAB items with total budget
- POST `/pengajuan/{usulan_id}/rab` - Create new RAB item
- PUT `/pengajuan/rab/{rab_item_id}` - Update existing RAB item
- DELETE `/pengajuan/rab/{rab_item_id}` - Delete RAB item

---

## 2. Environment Setup

### **Base URL**
```
Local: http://localhost:8000/api (if using API prefix)
Or direct: http://localhost:8000/pengajuan
```

### **Headers Required**
```
Content-Type: application/json
Accept: application/json
X-CSRF-TOKEN: [from <meta name="csrf-token">]
Cookie: XSRF-TOKEN and other session cookies (auto-managed by browser)
```

### **Authentication**
- All endpoints require authenticated user (logged in)
- CSRF token from meta tag or cookie is required
- Test data: Use usulan_id from existing proposals

---

## 3. Test Prerequisites

### **Required Test Data**
1. **Find an existing Usulan (Proposal)**
   - Execute: `SELECT id FROM usulan_penelitian ORDER BY id DESC LIMIT 1;`
   - Note the `usulan_id` (e.g., ID = 1)

2. **Ensure user has access to usulan**
   - Login as a user who created/can access the proposal

### **Sample IDs for Testing**
```
usulan_id = 1          (Primary test proposal)
usulan_id = 2          (Secondary test proposal - if available)
```

---

## 4. Test Cases - LUARAN ENDPOINTS

### **Test 4.1: GET /pengajuan/{usulan_id}/luaran**

**Purpose:** Retrieve all Luaran items for a proposal

**Request:**
```bash
curl -X GET \
  'http://localhost:8000/pengajuan/1/luaran' \
  -H 'Accept: application/json' \
  -H 'X-CSRF-TOKEN: [token]' \
  --cookie 'XSRF-TOKEN=[token]'
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "usulan_id": 1,
      "tahun": 1,
      "kategori": "Artikel di jurnal",
      "deskripsi": "Publikasi artikel di jurnal internasional bereputasi",
      "status": "Rencana",
      "keterangan": "Target Q4 2026",
      "created_at": "2025-12-10T10:00:00Z",
      "updated_at": "2025-12-10T10:00:00Z"
    }
  ],
  "total": 1
}
```

**Edge Cases:**
- ✅ Empty list (no Luaran items yet) - Should return `data: []`
- ✅ Multiple items - Should return all items
- ❌ Non-existent usulan_id - Should return 404
- ❌ Unauthorized usulan - Should return 403

---

### **Test 4.2: POST /pengajuan/{usulan_id}/luaran**

**Purpose:** Create a new Luaran item

**Request:**
```bash
curl -X POST \
  'http://localhost:8000/pengajuan/1/luaran' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'X-CSRF-TOKEN: [token]' \
  --cookie 'XSRF-TOKEN=[token]' \
  -d '{
    "tahun": 1,
    "kategori": "Artikel di jurnal",
    "deskripsi": "Publikasi artikel di jurnal internasional bereputasi",
    "status": "Rencana",
    "keterangan": "Target Q4 2026"
  }'
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "message": "Luaran berhasil ditambahkan",
  "data": {
    "id": 2,
    "usulan_id": 1,
    "tahun": 1,
    "kategori": "Artikel di jurnal",
    "deskripsi": "Publikasi artikel di jurnal internasional bereputasi",
    "status": "Rencana",
    "keterangan": "Target Q4 2026",
    "created_at": "2025-12-10T11:00:00Z",
    "updated_at": "2025-12-10T11:00:00Z"
  }
}
```

**Validation Test Cases:**

1. **Missing Required Fields:**
```bash
# Missing 'deskripsi'
-d '{
  "tahun": 1,
  "kategori": "Artikel di jurnal",
  "status": "Rencana"
}'
# Expected: 422 Unprocessable Entity
# Response: { "message": "...", "errors": { "deskripsi": ["The deskripsi field is required"] } }
```

2. **Invalid tahun (not 1-5):**
```bash
-d '{
  "tahun": 6,  # Invalid
  "kategori": "Artikel di jurnal",
  "deskripsi": "...",
  "status": "Rencana"
}'
# Expected: 422 with error message
```

3. **Invalid status (not in enum):**
```bash
-d '{
  "tahun": 1,
  "kategori": "Artikel di jurnal",
  "deskripsi": "...",
  "status": "Approved"  # Invalid - should be Rencana|Dalam Proses|Selesai
}'
# Expected: 422 with error message
```

4. **Non-existent usulan_id:**
```bash
curl -X POST 'http://localhost:8000/pengajuan/99999/luaran' ...
# Expected: 404 Not Found
```

---

### **Test 4.3: PUT /pengajuan/luaran/{luaran_id}**

**Purpose:** Update an existing Luaran item

**Request:**
```bash
curl -X PUT \
  'http://localhost:8000/pengajuan/luaran/1' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'X-CSRF-TOKEN: [token]' \
  --cookie 'XSRF-TOKEN=[token]' \
  -d '{
    "tahun": 2,
    "kategori": "Produk Terkomersial",
    "deskripsi": "Produk teknologi yang sudah diregistrasi",
    "status": "Dalam Proses",
    "keterangan": "Sedang dalam proses registrasi paten"
  }'
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Luaran berhasil diperbarui",
  "data": {
    "id": 1,
    "usulan_id": 1,
    "tahun": 2,
    "kategori": "Produk Terkomersial",
    "deskripsi": "Produk teknologi yang sudah diregistrasi",
    "status": "Dalam Proses",
    "keterangan": "Sedang dalam proses registrasi paten",
    "created_at": "2025-12-10T10:00:00Z",
    "updated_at": "2025-12-10T11:30:00Z"
  }
}
```

**Test Cases:**
- ✅ Update single field
- ✅ Update multiple fields
- ✅ Update status (Rencana → Dalam Proses → Selesai)
- ❌ Non-existent luaran_id - Should return 404
- ❌ Invalid validation data - Should return 422

---

### **Test 4.4: DELETE /pengajuan/luaran/{luaran_id}**

**Purpose:** Delete a Luaran item

**Request:**
```bash
curl -X DELETE \
  'http://localhost:8000/pengajuan/luaran/1' \
  -H 'Accept: application/json' \
  -H 'X-CSRF-TOKEN: [token]' \
  --cookie 'XSRF-TOKEN=[token]'
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Luaran berhasil dihapus"
}
```

**Test Cases:**
- ✅ Delete existing Luaran
- ✅ Verify GET returns empty/reduced list
- ❌ Delete non-existent Luaran - Should return 404
- ❌ Delete Luaran from unauthorized proposal - Should return 403

---

## 5. Test Cases - RAB ENDPOINTS

### **Test 5.1: GET /pengajuan/{usulan_id}/rab**

**Purpose:** Retrieve all RAB items with total budget calculation

**Request:**
```bash
curl -X GET \
  'http://localhost:8000/pengajuan/1/rab' \
  -H 'Accept: application/json' \
  -H 'X-CSRF-TOKEN: [token]' \
  --cookie 'XSRF-TOKEN=[token]'
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "usulan_id": 1,
      "tipe": "bahan",
      "kategori": "ATK",
      "item": "Tinta Printer",
      "satuan": "Paket",
      "volume": 5,
      "harga_satuan": 200000,
      "total": 1000000,
      "keterangan": "Tinta printer warna",
      "created_at": "2025-12-10T10:00:00Z",
      "updated_at": "2025-12-10T10:00:00Z"
    },
    {
      "id": 2,
      "usulan_id": 1,
      "tipe": "pengumpulan_data",
      "kategori": "Survey",
      "item": "Konsultasi dengan ahli",
      "satuan": "jam",
      "volume": 40,
      "harga_satuan": 500000,
      "total": 20000000,
      "keterangan": "Biaya konsultasi dengan expert domain",
      "created_at": "2025-12-10T10:30:00Z",
      "updated_at": "2025-12-10T10:30:00Z"
    }
  ],
  "total_anggaran": 21000000,
  "currency": "IDR"
}
```

**Key Validations:**
- ✅ `total` field = `volume × harga_satuan` (auto-calculated on server)
- ✅ `total_anggaran` = sum of all totals
- ✅ Currency formatting (IDR)
- ✅ Empty list handling

---

### **Test 5.2: POST /pengajuan/{usulan_id}/rab**

**Purpose:** Create new RAB item (with server-side auto-calculation)

**Request:**
```bash
curl -X POST \
  'http://localhost:8000/pengajuan/1/rab' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'X-CSRF-TOKEN: [token]' \
  --cookie 'XSRF-TOKEN=[token]' \
  -d '{
    "tipe": "bahan",
    "kategori": "Peralatan",
    "item": "Laptop",
    "satuan": "unit",
    "volume": 2,
    "harga_satuan": 15000000,
    "keterangan": "Untuk penelitian data processing"
  }'
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "message": "RAB item berhasil ditambahkan",
  "data": {
    "id": 3,
    "usulan_id": 1,
    "tipe": "bahan",
    "kategori": "Peralatan",
    "item": "Laptop",
    "satuan": "unit",
    "volume": 2,
    "harga_satuan": 15000000,
    "total": 30000000,
    "keterangan": "Untuk penelitian data processing",
    "created_at": "2025-12-10T11:00:00Z",
    "updated_at": "2025-12-10T11:00:00Z"
  },
  "total_anggaran": 51000000
}
```

**Validation Test Cases:**

1. **Missing Required Fields:**
```bash
# Missing 'volume'
-d '{
  "tipe": "bahan",
  "kategori": "Peralatan",
  "item": "Laptop",
  "satuan": "unit",
  "harga_satuan": 15000000
}'
# Expected: 422 Unprocessable Entity
```

2. **Invalid tipe:**
```bash
-d '{
  "tipe": "invalid_type",  # Should be 'bahan' or 'pengumpulan_data'
  "kategori": "...",
  ...
}'
# Expected: 422
```

3. **Zero or negative volume:**
```bash
-d '{
  "tipe": "bahan",
  "volume": 0,  # Invalid
  ...
}'
# Expected: 422
```

4. **Non-numeric harga_satuan:**
```bash
-d '{
  ...
  "harga_satuan": "not_a_number"
}'
# Expected: 422
```

5. **Auto-calculation verification:**
```
Input: volume=5, harga_satuan=200000
Expected response: "total": 1000000 (5 * 200000)
```

---

### **Test 5.3: PUT /pengajuan/rab/{rab_item_id}**

**Purpose:** Update RAB item (with auto-recalculation of total)

**Request:**
```bash
curl -X PUT \
  'http://localhost:8000/pengajuan/rab/1' \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -H 'X-CSRF-TOKEN: [token]' \
  --cookie 'XSRF-TOKEN=[token]' \
  -d '{
    "tipe": "pengumpulan_data",
    "kategori": "Survey Lapangan",
    "item": "Honorarium Enumerator",
    "satuan": "orang",
    "volume": 10,
    "harga_satuan": 1000000,
    "keterangan": "Pembayaran enumerator survei lapangan"
  }'
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "RAB item berhasil diperbarui",
  "data": {
    "id": 1,
    "usulan_id": 1,
    "tipe": "pengumpulan_data",
    "kategori": "Survey Lapangan",
    "item": "Honorarium Enumerator",
    "satuan": "orang",
    "volume": 10,
    "harga_satuan": 1000000,
    "total": 10000000,
    "keterangan": "Pembayaran enumerator survei lapangan",
    "created_at": "2025-12-10T10:00:00Z",
    "updated_at": "2025-12-10T11:45:00Z"
  },
  "total_anggaran": 50000000
}
```

**Critical Test Case - Auto-calculation on Update:**
```
Before update:
  volume: 5, harga_satuan: 200000, total: 1000000

Update request:
  volume: 10, harga_satuan: 300000

Expected after update:
  total: 3000000 (10 * 300000) - AUTO-CALCULATED
```

---

### **Test 5.4: DELETE /pengajuan/rab/{rab_item_id}**

**Purpose:** Delete RAB item (total anggaran should update)

**Request:**
```bash
curl -X DELETE \
  'http://localhost:8000/pengajuan/rab/1' \
  -H 'Accept: application/json' \
  -H 'X-CSRF-TOKEN: [token]' \
  --cookie 'XSRF-TOKEN=[token]'
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "RAB item berhasil dihapus",
  "total_anggaran": 20000000
}
```

**Test Cases:**
- ✅ Delete item and verify total_anggaran updates
- ✅ After deletion, GET should not return deleted item
- ❌ Non-existent rab_item_id - Should return 404

---

## 6. Integration Test Scenarios

### **Scenario A: Complete Luaran Workflow**

**Steps:**
1. ✅ GET empty Luaran list (create new proposal first)
2. ✅ POST create 3 Luaran items
3. ✅ PUT update status: Rencana → Dalam Proses
4. ✅ GET verify all 3 items exist
5. ✅ DELETE one item
6. ✅ GET verify 2 items remain

### **Scenario B: Complete RAB Workflow**

**Steps:**
1. ✅ GET empty RAB list (total_anggaran = 0)
2. ✅ POST create RAB item 1: vol=5, harga=200k → total=1M
3. ✅ POST create RAB item 2: vol=10, harga=500k → total=5M
4. ✅ GET verify total_anggaran = 6M
5. ✅ PUT update item 1: vol=10, harga=300k → total=3M
6. ✅ GET verify total_anggaran = 8M
7. ✅ DELETE item 1
8. ✅ GET verify total_anggaran = 5M, only item 2 remains

### **Scenario C: Authorization & Security**

**Steps:**
1. ✅ Login as User A, create Luaran in Proposal 1
2. ❌ Login as User B, try to GET Luaran from Proposal 1 (should be 403 if not authorized)
3. ✅ Login as User A, verify can GET own Luaran
4. ❌ Anonymous request (no auth) to any endpoint (should be 401)

---

## 7. Error Response Testing

### **Expected Error Responses:**

**400 Bad Request - Invalid JSON:**
```json
{
  "message": "Invalid JSON payload"
}
```

**401 Unauthorized:**
```json
{
  "message": "Unauthenticated"
}
```

**403 Forbidden - Authorization Error:**
```json
{
  "message": "This action is unauthorized.",
  "success": false
}
```

**404 Not Found:**
```json
{
  "message": "Not Found",
  "success": false
}
```

**422 Unprocessable Entity - Validation Error:**
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "kategori": ["The kategori field is required"],
    "volume": ["The volume must be a number"]
  }
}
```

**500 Server Error:**
```json
{
  "message": "Server Error",
  "error": "Internal Server Error"
}
```

---

## 8. Performance & Load Testing

### **Response Time Benchmarks:**
- ✅ GET endpoint: < 200ms
- ✅ POST endpoint: < 500ms
- ✅ PUT endpoint: < 500ms
- ✅ DELETE endpoint: < 500ms

### **Bulk Operations:**
- ✅ GET with 100+ items: Should still complete < 1s
- ✅ Create 50 items sequentially: Monitor for timeouts

---

## 9. Test Execution Checklist

- [ ] Environment setup complete
- [ ] Test data prepared
- [ ] CSRF token obtained
- [ ] Test 4.1 GET Luaran - PASSED
- [ ] Test 4.2 POST Luaran - PASSED (valid + validation)
- [ ] Test 4.3 PUT Luaran - PASSED
- [ ] Test 4.4 DELETE Luaran - PASSED
- [ ] Test 5.1 GET RAB - PASSED
- [ ] Test 5.2 POST RAB - PASSED (valid + validation + auto-calc)
- [ ] Test 5.3 PUT RAB - PASSED (auto-calc on update)
- [ ] Test 5.4 DELETE RAB - PASSED
- [ ] Scenario A (Luaran workflow) - PASSED
- [ ] Scenario B (RAB workflow + totals) - PASSED
- [ ] Scenario C (Authorization) - PASSED
- [ ] Error responses verified
- [ ] Performance benchmarks met

---

## 10. Known Issues & Notes

### **Pending Fixes:**
(Add any known issues discovered during testing)

### **Documentation Links:**
- Backend Controllers: `app/Http/Controllers/LuaranPenelitianController.php`
- Backend Controllers: `app/Http/Controllers/RabItemController.php`
- Routes: `routes/api.php`
- Frontend Components: `resources/js/pages/pengajuan/components/`

---

## 11. Next Steps

After testing completed:
1. ✅ Document any bugs found
2. ✅ Create fixes in separate branch
3. ✅ Re-test after fixes
4. → Phase 9: UAT & Bug Fixes
5. → Phase 10: Production Deployment

---

**Test Status:** Starting Phase 8  
**Last Updated:** December 10, 2025  
**Tested By:** [Your Name]  
**Date Completed:** [Fill in]
