# 🚀 Quick Start Guide - Luaran & RAB Implementation

## Status: ✅ LIVE

Backend untuk Luaran Penelitian dan RAB Items sudah siap digunakan.

---

## What's New?

### New Database Tables
- `makro_riset` - Master reference data (5 default records)
- `luaran_penelitian` - Research output tracking
- `rab_item` - Budget line items with auto-calculation
- `anggota_penelitian` - Modified with new `prodi` column

### New Models
- `MakroRiset` - Master data model
- `LuaranPenelitian` - Output tracking model
- `RabItem` - Budget item model with auto-total calculation

### New Controllers
- `LuaranPenelitianController` - 4 CRUD endpoints
- `RabItemController` - 4 CRUD endpoints with transaction handling

### New Routes (8 total)
```
GET    /pengajuan/{usulan}/luaran      → pengajuan.luaran.show
POST   /pengajuan/{usulan}/luaran      → pengajuan.luaran.store
PUT    /pengajuan/luaran/{luaran}      → pengajuan.luaran.update
DELETE /pengajuan/luaran/{luaran}      → pengajuan.luaran.destroy

GET    /pengajuan/{usulan}/rab         → pengajuan.rab.show
POST   /pengajuan/{usulan}/rab         → pengajuan.rab.store
PUT    /pengajuan/rab/{rabItem}        → pengajuan.rab.update
DELETE /pengajuan/rab/{rabItem}        → pengajuan.rab.destroy
```

---

## 🔧 Setup & Configuration

### Already Done ✅
- [x] Database migrations executed
- [x] All tables created with correct schema
- [x] Foreign keys and indexes configured
- [x] Models and relationships defined
- [x] Controllers implemented with validation
- [x] Routes registered
- [x] Seeder data populated (5 makro_riset records)
- [x] Database transactions for data integrity

### No Additional Setup Needed!
Everything is ready to use. Just integrate with your frontend.

---

## 📖 Documentation

Two comprehensive guides have been created:

### 1. **IMPLEMENTATION_SUMMARY.md**
- Complete overview of database schema
- Model and controller documentation
- Security features and best practices
- Testing checklist
- Execution report

### 2. **API_REFERENCE.md**
- Detailed API endpoint documentation
- Request/response examples
- Error handling guide
- Common usage patterns
- React/Axios implementation examples

---

## ⚡ Quick Integration Steps (Frontend)

### Step 1: Install Dependencies
```bash
npm install axios
```

### Step 2: Create API Service
Create `src/services/pengajuanAPI.js`:
```javascript
import axios from 'axios';

const API_BASE = '/pengajuan';
const token = localStorage.getItem('token');

export const pengajuanAPI = {
  // Luaran
  getLuaran: (usulanId) => 
    axios.get(`${API_BASE}/${usulanId}/luaran`, {
      headers: { Authorization: `Bearer ${token}` }
    }),
  
  addLuaran: (usulanId, data) =>
    axios.post(`${API_BASE}/${usulanId}/luaran`, data, {
      headers: { Authorization: `Bearer ${token}` }
    }),
  
  updateLuaran: (luaranId, data) =>
    axios.put(`${API_BASE}/luaran/${luaranId}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    }),
  
  deleteLuaran: (luaranId) =>
    axios.delete(`${API_BASE}/luaran/${luaranId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }),
  
  // RAB
  getRabItems: (usulanId) =>
    axios.get(`${API_BASE}/${usulanId}/rab`, {
      headers: { Authorization: `Bearer ${token}` }
    }),
  
  addRabItem: (usulanId, data) =>
    axios.post(`${API_BASE}/${usulanId}/rab`, data, {
      headers: { Authorization: `Bearer ${token}` }
    }),
  
  updateRabItem: (rabItemId, data) =>
    axios.put(`${API_BASE}/rab/${rabItemId}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    }),
  
  deleteRabItem: (rabItemId) =>
    axios.delete(`${API_BASE}/rab/${rabItemId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
};
```

### Step 3: Use in Components
```javascript
import { pengajuanAPI } from '@/services/pengajuanAPI';

// In your React component
const [luaranList, setLuaranList] = useState([]);
const [totalAnggaran, setTotalAnggaran] = useState(0);

// Load data
useEffect(() => {
  pengajuanAPI.getLuaran(usulanId)
    .then(res => setLuaranList(res.data.data))
    .catch(err => console.error(err));
  
  pengajuanAPI.getRabItems(usulanId)
    .then(res => {
      setRabItems(res.data.data);
      setTotalAnggaran(res.data.total_anggaran);
    })
    .catch(err => console.error(err));
}, [usulanId]);

// Add luaran
const handleAddLuaran = (formData) => {
  pengajuanAPI.addLuaran(usulanId, formData)
    .then(res => {
      setLuaranList([...luaranList, res.data.data]);
    })
    .catch(err => alert(err.response.data.message));
};

// Delete RAB item
const handleDeleteRab = (rabItemId) => {
  pengajuanAPI.deleteRabItem(rabItemId)
    .then(() => {
      setRabItems(rabItems.filter(item => item.id !== rabItemId));
      // Re-fetch total (will be updated)
      pengajuanAPI.getRabItems(usulanId)
        .then(res => setTotalAnggaran(res.data.total_anggaran));
    });
};
```

---

## 🎯 Key Features to Remember

### ✨ Auto-Calculation
RAB items automatically calculate `total = volume × harga_satuan`
- No need to calculate in frontend
- Happens in database at save time
- Always accurate

### 🔄 Auto-Recalculation
When you add/update/delete RAB item, parent `usulan_penelitian.total_anggaran` is automatically updated
- Get total anggaran from RAB GET response
- Use `total_anggaran` field directly

### 🔒 Authorization
All endpoints check if resource belongs to current user
- Returns 403 if user doesn't own it
- Prevents unauthorized access

### 📋 Validation
All inputs are validated server-side
- Handle 422 validation errors gracefully
- Show error messages to user

### 🗑️ Cascade Delete
Deleting usulan deletes all its luaran & RAB items
- No orphaned records
- Data integrity maintained

---

## 🧪 Testing with Postman

### Environment Variables
```
{
  "base_url": "http://localhost",
  "token": "your-jwt-token-here",
  "usulan_id": 5
}
```

### Test Collection
```
Collection: Pengajuan Usulan

1. GET Luaran
   GET {{base_url}}/pengajuan/{{usulan_id}}/luaran
   
2. Create Luaran
   POST {{base_url}}/pengajuan/{{usulan_id}}/luaran
   Body: {
     "tahun": 1,
     "kategori": "Publikasi Jurnal",
     "deskripsi": "Publikasi di jurnal internasional tier Q2",
     "status": "Rencana"
   }
   
3. Update Luaran
   PUT {{base_url}}/pengajuan/luaran/1
   Body: { ... updated data ... }
   
4. Delete Luaran
   DELETE {{base_url}}/pengajuan/luaran/1
   
5. GET RAB Items
   GET {{base_url}}/pengajuan/{{usulan_id}}/rab
   
6. Create RAB Item
   POST {{base_url}}/pengajuan/{{usulan_id}}/rab
   Body: {
     "tipe": "bahan",
     "kategori": "Reagent",
     "item": "Chemical X",
     "satuan": "botol",
     "volume": 5,
     "harga_satuan": 500000
   }
   
7. Update RAB Item
   PUT {{base_url}}/pengajuan/rab/1
   Body: { ... updated data ... }
   
8. Delete RAB Item
   DELETE {{base_url}}/pengajuan/rab/1
```

---

## 🐛 Common Issues & Solutions

### Issue: 403 Forbidden Error
**Cause:** You're trying to access someone else's usulan
**Solution:** Verify you're using your own usulan_id

### Issue: 422 Validation Error
**Cause:** Invalid input data
**Solution:** Check error messages, review API_REFERENCE.md for valid values

### Issue: 404 Not Found
**Cause:** Resource doesn't exist
**Solution:** Verify usulan_id, luaran_id, or rabItem_id is correct

### Issue: Empty total_anggaran
**Cause:** No RAB items added yet
**Solution:** Add RAB items, total will be calculated automatically

### Issue: Total not updating after delete
**Cause:** You're using old data
**Solution:** Call GET RAB endpoint again to get updated total

---

## 📞 Database Connection Check

If you need to verify the database directly:

```bash
# Check migration status
php artisan migrate:status

# View makro_riset table
php artisan db:table makro_riset

# View rab_item table
php artisan db:table rab_item

# View luaran_penelitian table
php artisan db:table luaran_penelitian
```

---

## 🔍 Debugging

### Enable Request Logging
In your frontend, log all requests:
```javascript
axios.interceptors.request.use(config => {
  console.log('Request:', config.method.toUpperCase(), config.url);
  return config;
});

axios.interceptors.response.use(
  response => {
    console.log('Response:', response.status, response.data);
    return response;
  },
  error => {
    console.error('Error:', error.response.status, error.response.data);
    return Promise.reject(error);
  }
);
```

### Check Browser Network Tab
- Look for request/response details
- Verify Authorization header is present
- Check response status and body

### Laravel Logs
```bash
tail -f storage/logs/laravel.log
```

---

## 📚 Related Documentation

- **IMPLEMENTATION_SUMMARY.md** - Comprehensive implementation details
- **API_REFERENCE.md** - Complete API documentation with examples
- **database/migrations/** - View migration files for schema details
- **app/Models/** - View model relationships and attributes
- **app/Http/Controllers/** - View controller implementations

---

## 🎓 Learn More

### Database Design Pattern
- Master table (makro_riset) for dropdowns
- Transactional tables (luaran_penelitian, rab_item) linked to usulan
- Foreign keys for referential integrity
- Auto-calculation in models (boot method)

### API Design Pattern
- RESTful endpoints (GET/POST/PUT/DELETE)
- Consistent JSON responses
- Validation error responses (422)
- Authorization checks (403)
- Transaction handling for related updates

### Security Pattern
- JWT token authentication
- User ID verification on all endpoints
- Validation rules on all inputs
- Cascade delete for data cleanup
- Database transactions for atomic operations

---

## ✅ Checklist Before Going Live

- [ ] IMPLEMENTATION_SUMMARY.md reviewed
- [ ] API_REFERENCE.md reviewed
- [ ] Frontend service created with axios
- [ ] React components using pengajuanAPI service
- [ ] Error handling implemented in UI
- [ ] Loading states implemented
- [ ] Form validation on frontend
- [ ] Tested all 8 endpoints with Postman
- [ ] Tested auto-calculation (RAB total)
- [ ] Tested authorization (403 when invalid user)
- [ ] Tested cascade delete (delete usulan → no orphans)
- [ ] User accepts data loss on refresh (or implement persistence)

---

## 🚀 Ready?

Everything is set up and ready to use. Start integrating with your frontend components!

For detailed API documentation, see **API_REFERENCE.md**

For implementation details, see **IMPLEMENTATION_SUMMARY.md**

**Questions?** Check the documentation files or review the controller implementations.

---

**Version:** 1.0
**Status:** Production Ready
**Last Updated:** December 9, 2025
