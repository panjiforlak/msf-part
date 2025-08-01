# SPPB Module

Module ini menangani manajemen SPPB (Surat Perintah Pengeluaran Barang) yang berisi informasi tentang pengeluaran barang dari gudang.

## Authentication

Semua endpoint dalam module ini memerlukan JWT token yang valid. Token harus disertakan dalam header request:

```
Authorization: Bearer <jwt_token>
```

## Struktur Database

### Tabel `sppb`
- `id` - Primary key
- `order_form_id` - ID dari tabel order_form
- `sppb_number` - Nomor SPPB (unique)
- `mechanic_photo` - Foto mekanik (nullable)
- `status` - Status SPPB (enum: waiting, completed)
- `author` - ID author dari tabel users
- `start_date` - Tanggal mulai
- `end_date` - Tanggal selesai
- Audit fields (createdBy, createdAt, updatedBy, updatedAt, deletedBy, deletedAt)

## API Endpoints

### 1. GET /api/sppb/list
**Deskripsi**: Mendapatkan daftar SPPB dengan filter

**Headers**:
```
Authorization: Bearer <jwt_token>
```

**Query Parameters**:
- `page` (optional): Nomor halaman (default: 1)
- `limit` (optional): Jumlah data per halaman (default: 10)
- `month` (optional): Filter berdasarkan bulan (1-12)
  - 1 = Januari
  - 2 = Februari
  - 3 = Maret
  - 4 = April
  - 5 = Mei
  - 6 = Juni
  - 7 = Juli
  - 8 = Agustus
  - 9 = September
  - 10 = Oktober
  - 11 = November
  - 12 = Desember
  - **Note**: Filter menggunakan `start_date` jika ada, jika tidak akan menggunakan `createdAt` sebagai fallback
- `keyword` (optional): Filter berdasarkan keyword (mencari di sppb_number, department_name, author, picker)

**Contoh Request**:
```bash
# Tanpa filter dengan pagination
curl -X 'GET' 'http://localhost:9596/api/sppb/list?page=1&limit=10' \
  -H 'Authorization: Bearer <jwt_token>'

# Filter berdasarkan bulan Januari
curl -X 'GET' 'http://localhost:9596/api/sppb/list?month=1&page=1&limit=10' \
  -H 'Authorization: Bearer <jwt_token>'

# Filter berdasarkan keyword
curl -X 'GET' 'http://localhost:9596/api/sppb/list?keyword=WHO001&page=1&limit=10' \
  -H 'Authorization: Bearer <jwt_token>'

# Filter kombinasi bulan dan keyword
curl -X 'GET' 'http://localhost:9596/api/sppb/list?month=1&keyword=Maintenance&page=1&limit=10' \
  -H 'Authorization: Bearer <jwt_token>'
```

**Response**:
```json
{
  "statusCode": 200,
  "message": "Get SPPB list successfully",
  "data": [
    {
      "sppb_id": 1,
      "sppb_number": "WHO001",
      "sppb_date": "2024-01-15T10:30:00.000Z",
      "department_name": "Maintenance",
      "author": "John Doe",
      "picker": "Jane Smith",
      "start_date": "2024-01-15T08:00:00.000Z",
      "end_date": "2024-01-15T17:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "lastPage": 1
  }
}
```

**Relasi Database**:
- `sppb_id` - dari tabel `sppb` kolom `id`
- `sppb_number` - dari tabel `sppb` kolom `sppb_number`
- `sppb_date` - dari tabel `sppb` kolom `createdAt`
- `department_name` - dari tabel `order_form` kolom `departement`
- `author` - dari tabel `sppb` kolom `author` di-join ke tabel `users` kolom `name`
- `picker` - dari tabel `sppb` kolom `order_form_id` → tabel `order_form` kolom `picker_id` → tabel `users` kolom `name`
- `start_date` - dari tabel `sppb` kolom `start_date`
- `end_date` - dari tabel `sppb` kolom `end_date`

## Struktur File

```
src/modules/sppb/
├── sppb.module.ts          # Module definition
├── sppb.controller.ts      # Controller dengan endpoint
├── sppb.service.ts         # Business logic
├── entities/
│   └── sppb.entity.ts      # Entity definition
└── dto/
    ├── response.dto.ts     # Response DTO
    └── query.dto.ts        # Query parameters DTO
```

## Cara Penggunaan

1. Module sudah terdaftar di `app.module.ts`
2. Endpoint dapat diakses di `GET /api/sppb/list`
3. **Authentication**: Endpoint memerlukan JWT token di header `Authorization: Bearer <token>`
4. **Pagination**: 
   - Menggunakan parameter `page` dan `limit`
   - Default: page=1, limit=10
5. **Filter Options**:
   - Filter berdasarkan bulan menggunakan parameter `month` (1-12)
   - Filter berdasarkan keyword menggunakan parameter `keyword`
   - Kedua filter dapat dikombinasikan
6. Response akan menampilkan data SPPB dengan relasi ke tabel `order_form` dan `users` dalam format yang konsisten dengan module lainnya 