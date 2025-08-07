# Work Order Module

Module ini menangani manajemen work order (perintah kerja) yang berisi informasi kendaraan, driver, mechanic, request, dan daftar sparepart yang diperlukan.

## Struktur Database

### Tabel `order_form`
- `id` - Primary key
- `uuid` - Unique identifier
- `vehicle_id` - ID dari tabel vehicle (vin_number)
- `admin_id` - ID admin yang membuat work order (dari auth token)
- `driver_id` - ID dari tabel employee (driver)
- `mechanic_id` - ID dari tabel employee (mechanic)
- `request_id` - ID dari tabel employee (request)
- `departement` - Departemen (text input)
- `remark` - Catatan (text input)
- `start_date` - Tanggal mulai (date input)
- `end_date` - Tanggal selesai (date input)
- `status` - Status work order (enum: pending, in_progress, completed, cancelled)
- `createdBy`, `createdAt`, `updatedBy`, `updatedAt`, `deletedBy`, `deletedAt` - Audit fields

### Tabel `batch_outbound`
- `id` - Primary key
- `barcode` - Barcode unik
- `inventory_id` - ID dari tabel inventory (part_name)
- `quantity` - Jumlah sparepart
- `status` - Status (enum: outbound, others)
- Audit fields

### Tabel `reloc_outbound`
- `id` - Primary key
- `uuid` - Unique identifier
- `batch_out_id` - ID dari tabel batch_outbound
- `reloc_from` - ID dari tabel inventory racks_id
- `reloc_to` - ID dari tabel inbound_outbound_area (destination)
- `quantity` - Jumlah sparepart
- `reloc_date` - Tanggal relokasi (start_date)
- Audit fields

## API Endpoints

### 1. GET /work-order
**Deskripsi**: Mendapatkan daftar semua work order dengan pagination dan search

**Query Parameters**:
- `page` (optional): Halaman yang ingin ditampilkan (default: 1)
- `limit` (optional): Jumlah data per halaman (default: 10)
- `search` (optional): Pencarian berdasarkan vin_number

**Response**:
```json
{
  "data": [
    {
      "id": 1,
      "uuid": "abc123",
      "vin_number": "VIN123456",
      "driver": "John Doe",
      "mechanic": "Jane Smith",
      "request": "Bob Johnson",
      "departement": "Maintenance",
      "remark": "Regular maintenance",
      "start_date": "2024-01-01T00:00:00Z",
      "end_date": "2024-01-02T00:00:00Z",
      "status": "pending"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10,
  "message": "Get all work orders successfully"
}
```

### 2. GET /work-order/:id
**Deskripsi**: Mendapatkan detail work order berdasarkan ID

**Path Parameters**:
- `id`: ID work order

**Response**:
```json
{
  "data": {
    "id": 1,
    "uuid": "abc123",
    "vin_number": "VIN123456",
    "driver": "John Doe",
    "mechanic": "Jane Smith",
    "request": "Bob Johnson",
    "departement": "Maintenance",
    "remark": "Regular maintenance",
    "start_date": "2024-01-01T00:00:00Z",
    "end_date": "2024-01-02T00:00:00Z",
    "status": "pending",
    "sparepart_list": [
      {
        "id": 1,
        "part_name": 1,
        "destination": 1,
        "quantity": 2
      }
    ]
  },
  "message": "Get work order successfully"
}
```

### 3. POST /work-order
**Deskripsi**: Membuat work order baru

**Request Body**:
```json
{
  "vin_number": 1,
  "driver": 1,
  "mechanic": 1,
  "request": 1,
  "departement": "Maintenance",
  "remark": "Regular maintenance",
  "start_date": "2024-01-01",
  "end_date": "2024-01-02",
  "status": "pending",
  "sparepart_list": [
    {
      "part_name": 1,
      "destination": 1,
      "quantity": 2
    },
    {
      "part_name": 2,
      "destination": 1,
      "quantity": 1
    }
  ]
}
```

**Response**:
```json
{
  "data": null,
  "message": "Work order created successfully"
}
```

### 4. PUT /work-order/:id
**Deskripsi**: Mengupdate work order berdasarkan ID

**Path Parameters**:
- `id`: ID work order

**Request Body**: Sama dengan POST (semua field optional)

**Response**:
```json
{
  "data": null,
  "message": "Work order updated successfully"
}
```

### 5. DELETE /work-order/:id
**Deskripsi**: Menghapus work order berdasarkan ID

**Path Parameters**:
- `id`: ID work order

**Response**:
```json
{
  "data": null,
  "message": "Work order deleted successfully"
}
```

### 6. PUT /work-order/:id/finishing
**Deskripsi**: Menyelesaikan work order dengan mengupdate status menjadi completed dan menambahkan end_date

**Path Parameters**:
- `id`: ID work order

**Request Body**:
```json
{
  "end_date": "2024-01-15T10:30:00Z"
}
```

**Response**:
```json
{
  "data": null,
  "message": "Work order berhasil diselesaikan"
}
```

**Error Responses**:
- `404`: Work order tidak ditemukan
- `400`: Work order sudah selesai (status sudah completed)
- `400`: Work order tidak dapat diselesaikan karena belum memiliki data SPPB dengan status completed

**Validasi**:
- Work order harus memiliki data di tabel `sppb` dengan `order_form_id` yang sesuai
- Data SPPB harus memiliki `status` = `completed`
- Jika tidak memenuhi syarat di atas, akan mengembalikan error 400

## Alur Proses

### Saat Create Work Order:
1. Data work order disimpan ke tabel `order_form`
2. Untuk setiap sparepart di `sparepart_list`:
   - Data disimpan ke tabel `batch_outbound` dengan status "outbound"
   - Ambil `racks_id` dari tabel `inventory` berdasarkan `part_name`
   - Data disimpan ke tabel `reloc_outbound` dengan `reloc_from` = `racks_id` dan `reloc_to` = `destination`

### Saat Update Work Order:
1. Update data di tabel `order_form`
2. Jika ada `sparepart_list`:
   - Hapus semua data terkait di `reloc_outbound` dan `batch_outbound`
   - Buat data baru sesuai `sparepart_list`

### Saat Delete Work Order:
1. Hapus semua data terkait di `reloc_outbound` dan `batch_outbound`
2. Soft delete data di `order_form`

## Authentication

Semua endpoint memerlukan JWT authentication. Token harus disertakan di header:
```
Authorization: Bearer <jwt_token>
```

## Validation

- Semua field required kecuali yang ditandai optional
- `status` harus salah satu dari: pending, in_progress, completed, cancelled
- `start_date` dan `end_date` harus dalam format date
- `sparepart_list` harus array dengan minimal 1 item
- Setiap item di `sparepart_list` harus memiliki `part_name`, `destination`, dan `quantity` 