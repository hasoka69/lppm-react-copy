# API Reference - Luaran & RAB Items

## Base URL
```
http://localhost/pengajuan
```

## Authentication
Semua requests memerlukan header:
```
Authorization: Bearer {jwt_token}
```

---

## 📋 Luaran Penelitian Endpoints

### 1. GET List Luaran
Retrieve all luaran for a specific usulan.

**Request:**
```http
GET /pengajuan/{usulan_id}/luaran
Headers: Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "usulan_id": 5,
      "tahun": 1,
      "kategori": "Publikasi Jurnal",
      "deskripsi": "Publikasi di jurnal internasional tier Q2",
      "status": "Rencana",
      "keterangan": "Target semester 1",
      "created_at": "2025-12-09T10:30:00Z",
      "updated_at": "2025-12-09T10:30:00Z"
    },
    {
      "id": 2,
      "usulan_id": 5,
      "tahun": 2,
      "kategori": "Seminar Internasional",
      "deskripsi": "Presentasi di konferensi teknologi global",
      "status": "Dalam Proses",
      "keterangan": null,
      "created_at": "2025-12-09T11:15:00Z",
      "updated_at": "2025-12-09T11:15:00Z"
    }
  ]
}
```

**Response Error (404):**
```json
{
  "message": "No query results for model [App\\Models\\UsulanPenelitian]"
}
```

**Response Error (403):**
```
Unauthorized access (user_id mismatch)
```

---

### 2. POST Create Luaran
Create new luaran for a usulan.

**Request:**
```http
POST /pengajuan/{usulan_id}/luaran
Headers: 
  Authorization: Bearer {token}
  Content-Type: application/json

Body:
{
  "tahun": 2,
  "kategori": "Publikasi Jurnal",
  "deskripsi": "Publikasi di jurnal internasional tier Q1",
  "status": "Rencana",
  "keterangan": "Target semester 2"
}
```

**Required Fields:**
| Field | Type | Rules | Example |
|-------|------|-------|---------|
| tahun | integer | required, between 1-5 | 2 |
| kategori | string | required, max 100 | "Publikasi Jurnal" |
| deskripsi | string | required, min 10 | "Publikasi di jurnal..." |
| status | enum | nullable, in: Rencana/Dalam Proses/Selesai | "Rencana" |
| keterangan | string | nullable | "Target semester 2" |

**Response Success (201):**
```json
{
  "success": true,
  "message": "Luaran penelitian berhasil ditambahkan",
  "data": {
    "id": 3,
    "usulan_id": 5,
    "tahun": 2,
    "kategori": "Publikasi Jurnal",
    "deskripsi": "Publikasi di jurnal internasional tier Q1",
    "status": "Rencana",
    "keterangan": "Target semester 2",
    "created_at": "2025-12-09T12:00:00Z",
    "updated_at": "2025-12-09T12:00:00Z"
  }
}
```

**Response Error - Validation (422):**
```json
{
  "message": "The tahun field must be at least 1. (and 1 more error)",
  "errors": {
    "tahun": ["The tahun field must be at least 1."],
    "deskripsi": ["The deskripsi field must be at least 10 characters."]
  }
}
```

**Response Error (403):**
```
Unauthorized access
```

---

### 3. PUT Update Luaran
Update existing luaran.

**Request:**
```http
PUT /pengajuan/luaran/{luaran_id}
Headers:
  Authorization: Bearer {token}
  Content-Type: application/json

Body:
{
  "tahun": 3,
  "kategori": "Publikasi Seminar",
  "deskripsi": "Presentasi di seminar internasional berskala regional",
  "status": "Dalam Proses",
  "keterangan": "Sudah accepted"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Luaran penelitian berhasil diperbarui",
  "data": {
    "id": 1,
    "usulan_id": 5,
    "tahun": 3,
    "kategori": "Publikasi Seminar",
    "deskripsi": "Presentasi di seminar internasional berskala regional",
    "status": "Dalam Proses",
    "keterangan": "Sudah accepted",
    "created_at": "2025-12-09T10:30:00Z",
    "updated_at": "2025-12-09T13:45:00Z"
  }
}
```

---

### 4. DELETE Luaran
Delete a luaran.

**Request:**
```http
DELETE /pengajuan/luaran/{luaran_id}
Headers: Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Luaran penelitian berhasil dihapus"
}
```

---

## 💰 RAB Items Endpoints

### 1. GET List RAB Items
Retrieve all RAB items with total anggaran.

**Request:**
```http
GET /pengajuan/{usulan_id}/rab
Headers: Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "success": true,
  "total_anggaran": 50000000,
  "data": [
    {
      "id": 1,
      "usulan_id": 5,
      "tipe": "bahan",
      "kategori": "Reagent",
      "item": "Chemical X",
      "satuan": "botol",
      "volume": 5,
      "harga_satuan": 500000,
      "total": 2500000,
      "keterangan": "Import dari Sigma-Aldrich",
      "created_at": "2025-12-09T14:00:00Z",
      "updated_at": "2025-12-09T14:00:00Z"
    },
    {
      "id": 2,
      "usulan_id": 5,
      "tipe": "pengumpulan_data",
      "kategori": "Survei",
      "item": "Kuisioner Penelitian",
      "satuan": "set",
      "volume": 200,
      "harga_satuan": 225000,
      "total": 45000000,
      "keterangan": "Untuk 200 responden di 5 lokasi",
      "created_at": "2025-12-09T14:15:00Z",
      "updated_at": "2025-12-09T14:15:00Z"
    }
  ]
}
```

---

### 2. POST Create RAB Item
Create new RAB item with auto-calculation.

**Request:**
```http
POST /pengajuan/{usulan_id}/rab
Headers:
  Authorization: Bearer {token}
  Content-Type: application/json

Body:
{
  "tipe": "bahan",
  "kategori": "Reagent",
  "item": "Chemical Y",
  "satuan": "liter",
  "volume": 10,
  "harga_satuan": 750000,
  "keterangan": "Storage untuk lab"
}
```

**Required Fields:**
| Field | Type | Rules | Example |
|-------|------|-------|---------|
| tipe | enum | required, in: bahan/pengumpulan_data | "bahan" |
| kategori | string | required, max 100 | "Reagent" |
| item | string | required, max 255 | "Chemical Y" |
| satuan | string | required, max 50 | "liter" |
| volume | integer | required, min 1 | 10 |
| harga_satuan | integer | required, min 0 | 750000 |
| keterangan | string | nullable | "Storage untuk lab" |

**Response Success (201):**
```json
{
  "success": true,
  "message": "Item RAB berhasil ditambahkan",
  "data": {
    "id": 3,
    "usulan_id": 5,
    "tipe": "bahan",
    "kategori": "Reagent",
    "item": "Chemical Y",
    "satuan": "liter",
    "volume": 10,
    "harga_satuan": 750000,
    "total": 7500000,
    "keterangan": "Storage untuk lab",
    "created_at": "2025-12-09T15:00:00Z",
    "updated_at": "2025-12-09T15:00:00Z"
  }
}
```

**Note:** `total` is auto-calculated as `volume × harga_satuan`

---

### 3. PUT Update RAB Item
Update existing RAB item with auto-recalculation.

**Request:**
```http
PUT /pengajuan/rab/{rab_item_id}
Headers:
  Authorization: Bearer {token}
  Content-Type: application/json

Body:
{
  "tipe": "pengumpulan_data",
  "kategori": "Wawancara",
  "item": "Jasa Enumerator",
  "satuan": "orang.hari",
  "volume": 50,
  "harga_satuan": 200000,
  "keterangan": "5 enumerator × 10 hari"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Item RAB berhasil diperbarui",
  "data": {
    "id": 1,
    "usulan_id": 5,
    "tipe": "pengumpulan_data",
    "kategori": "Wawancara",
    "item": "Jasa Enumerator",
    "satuan": "orang.hari",
    "volume": 50,
    "harga_satuan": 200000,
    "total": 10000000,
    "keterangan": "5 enumerator × 10 hari",
    "created_at": "2025-12-09T14:00:00Z",
    "updated_at": "2025-12-09T16:30:00Z"
  }
}
```

**Note:** When total changes, parent `usulan_penelitian.total_anggaran` is automatically recalculated.

---

### 4. DELETE RAB Item
Delete a RAB item.

**Request:**
```http
DELETE /pengajuan/rab/{rab_item_id}
Headers: Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Item RAB berhasil dihapus"
}
```

**Note:** Parent `usulan_penelitian.total_anggaran` is automatically recalculated.

---

## 🔍 Enum Values Reference

### RAB Tipe Enum
```
- "bahan"              // Bahan/Material
- "pengumpulan_data"   // Pengumpulan Data
```

### Luaran Status Enum
```
- "Rencana"        // Rencana/Planning
- "Dalam Proses"   // In Progress
- "Selesai"        // Completed
```

---

## ⚠️ Error Responses

### 401 Unauthorized
```json
{
  "message": "Unauthenticated."
}
```

### 403 Forbidden (User ID Mismatch)
```
Status 403
(No JSON response body)
```

### 404 Not Found
```json
{
  "message": "No query results for model [App\\Models\\LuaranPenelitian]"
}
```

### 422 Validation Error
```json
{
  "message": "The tahun field is required.",
  "errors": {
    "tahun": ["The tahun field is required."],
    "kategori": ["The kategori field is required."]
  }
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Error message here"
}
```

---

## 💡 Common Usage Patterns

### Pattern 1: Create Usulan → Add Luaran & RAB
```javascript
// 1. Create usulan (existing endpoint)
POST /pengajuan/draft

// 2. Add luaran for substansi tahap
POST /pengajuan/{usulan_id}/luaran
POST /pengajuan/{usulan_id}/luaran
POST /pengajuan/{usulan_id}/luaran

// 3. Add RAB items for rab tahap
POST /pengajuan/{usulan_id}/rab
POST /pengajuan/{usulan_id}/rab
POST /pengajuan/{usulan_id}/rab

// 4. Get total anggaran (includes in GET /pengajuan/{usulan_id}/rab response)
GET /pengajuan/{usulan_id}/rab
```

### Pattern 2: Edit Multiple Items
```javascript
// Get current items
GET /pengajuan/{usulan_id}/luaran

// Update changed items
items.forEach(item => {
  PUT /pengajuan/luaran/{item.id}
})

// Delete removed items
removed_items.forEach(item => {
  DELETE /pengajuan/luaran/{item.id}
})

// Add new items
new_items.forEach(item => {
  POST /pengajuan/{usulan_id}/luaran
})
```

### Pattern 3: Calculate Budget Summary
```javascript
// Get all RAB items with total
GET /pengajuan/{usulan_id}/rab

// Response includes:
// - data: array of rab items
// - total_anggaran: sum of all items' total field
// Frontend can use total_anggaran directly (no need to calculate)
```

---

## 🚀 Frontend Implementation Example (React/Axios)

```javascript
import axios from 'axios';

const API_BASE = 'http://localhost/pengajuan';
const token = localStorage.getItem('token');

// Get Luaran List
async function getLuaran(usulanId) {
  try {
    const response = await axios.get(
      `${API_BASE}/${usulanId}/luaran`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch luaran:', error);
  }
}

// Add Luaran
async function addLuaran(usulanId, formData) {
  try {
    const response = await axios.post(
      `${API_BASE}/${usulanId}/luaran`,
      formData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.data;
  } catch (error) {
    console.error('Failed to add luaran:', error.response.data);
  }
}

// Get RAB Items with Total
async function getRabItems(usulanId) {
  try {
    const response = await axios.get(
      `${API_BASE}/${usulanId}/rab`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return {
      items: response.data.data,
      totalAnggaran: response.data.total_anggaran
    };
  } catch (error) {
    console.error('Failed to fetch RAB items:', error);
  }
}

// Add RAB Item
async function addRabItem(usulanId, formData) {
  try {
    const response = await axios.post(
      `${API_BASE}/${usulanId}/rab`,
      formData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.data;
  } catch (error) {
    console.error('Failed to add RAB item:', error.response.data);
  }
}

// Update RAB Item
async function updateRabItem(rabItemId, formData) {
  try {
    const response = await axios.put(
      `${API_BASE}/rab/${rabItemId}`,
      formData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.data;
  } catch (error) {
    console.error('Failed to update RAB item:', error.response.data);
  }
}

// Delete RAB Item
async function deleteRabItem(rabItemId) {
  try {
    await axios.delete(
      `${API_BASE}/rab/${rabItemId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return true;
  } catch (error) {
    console.error('Failed to delete RAB item:', error);
    return false;
  }
}

export {
  getLuaran, addLuaran,
  getRabItems, addRabItem, updateRabItem, deleteRabItem
};
```

---

## 📚 Status Code Reference

| Code | Meaning | Use Case |
|------|---------|----------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST |
| 400 | Bad Request | Invalid request format |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | User doesn't own the resource |
| 404 | Not Found | Resource doesn't exist |
| 422 | Unprocessable Entity | Validation failed |
| 500 | Server Error | Internal server error |

---

**Last Updated:** December 9, 2025
**API Version:** 1.0
**Framework:** Laravel 10.x
