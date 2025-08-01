# PDA Outbound Module

Module ini menangani operasi outbound untuk PDA (Personal Digital Assistant).

## Endpoints

### 1. GET /api/pda-outbound
Mengambil data order form berdasarkan picker_id dari token JWT atau semua data jika superadmin.

**Query Parameters:**
- `superadmin` (optional): Jika diisi dengan 'yes', akan menampilkan semua data

**Response:**
```json
{
  "status": "success",
  "message": "Data PDA Outbound berhasil diambil",
  "data": [
    {
      "id": 1,
      "label_wo": "WO-1",
      "vin_number": "ABC123",
      "admin_name": "Admin Name",
      "driver_name": "Driver Name",
      "mechanic_name": "Mechanic Name",
      "request_name": "Request Name",
      "approvalBy_name": "Approval Name",
      "picker_name": "Picker Name"
    }
  ]
}
```

### 2. GET /api/pda-outbound/:orderFormId/batch-outbound
Mengambil data batch outbound berdasarkan order form ID.

**Path Parameters:**
- `orderFormId` (number): ID dari order form

**Response:**
```json
{
  "status": "success",
  "message": "Data Batch Outbound berhasil diambil",
  "data": [
    {
      "id": 1,
      "batch_outbound_id": 1,
      "inventory_id": 1,
      "destination_id": 1,
      "quantity": 5,
      "start_date": "2025-01-01T00:00:00.000Z",
      "part_number": "PART001",
      "part_name_label": "Part Name",
      "remark": "Remark",
      "status": "active",
      "racks_name": "Rack A",
      "label_wo": "WO-1"
    }
  ]
}
```

### 3. POST /api/pda-outbound/relocation
Membuat data relocation berdasarkan barcode inbound dan batch_outbound_id.

**Request Body:**
```json
{
  "barcode_inbound": "f58edb181e97",
  "batch_outbound_id": 1
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Relocation berhasil dibuat",
  "data": {
    "id": 1,
    "batch_in_id": 1,
    "reloc_from": 1,
    "reloc_to": 0,
    "reloc_type": "outbound",
    "quantity": 3,
    "picker_id": 1,
    "reloc_status": false,
    "reloc_date": "2025-01-01T00:00:00.000Z",
    "barcode_inbound": "f58edb181e97"
  }
}
```

**Catatan:** Quantity akan diambil otomatis dari tabel `batch_outbound` berdasarkan `batch_outbound_id` yang diberikan.

### 4. POST /api/pda-outbound/scan-destination
**ENDPOINT BARU** - Scan destination untuk proses outbound dengan quantity yang bisa dicicil.

**Request Body:**
```json
{
  "barcode_inbound": "f58edb181e97",
  "quantity": 1,
  "batch_outbound_id": 1
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Scan destination berhasil diproses",
  "data": {
    "id": 1,
    "barcode_inbound": "f58edb181e97",
    "quantity": 1,
    "total_scanned_quantity": 3,
    "target_quantity": 3,
    "is_completed": true,
    "sppb_id": 1,
    "sppb_number": "WHO001"
  }
}
```

## Contoh Penggunaan

### Relocation dengan Quantity dari Batch Outbound

**Membuat Relocation:**
```bash
curl -X 'POST' \
  'http://localhost:9596/api/pda-outbound/relocation' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
  "barcode_inbound": "f58edb181e97",
  "batch_outbound_id": 1
}'
```

**Response:**
```json
{
  "status": "success",
  "message": "Relocation berhasil dibuat",
  "data": {
    "id": 1,
    "batch_in_id": 1,
    "reloc_from": 1,
    "reloc_to": 0,
    "reloc_type": "outbound",
    "quantity": 3,
    "picker_id": 1,
    "reloc_status": false,
    "reloc_date": "2025-01-01T00:00:00.000Z",
    "barcode_inbound": "f58edb181e97"
  }
}
```

### Scan Destination dengan Quantity Dicicil

**Scan Pertama (qty 1):**
```bash
curl -X 'POST' \
  'http://localhost:9596/api/pda-outbound/scan-destination' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
  "barcode_inbound": "f58edb181e97",
  "quantity": 1,
  "batch_outbound_id": 1
}'
```

**Response Scan Pertama:**
```json
{
  "status": "success",
  "message": "Scan destination berhasil diproses",
  "data": {
    "id": 1,
    "barcode_inbound": "f58edb181e97",
    "quantity": 1,
    "total_scanned_quantity": 1,
    "target_quantity": 3,
    "is_completed": false,
    "sppb_id": null,
    "sppb_number": null
  }
}
```

**Scan Kedua (qty 2):**
```bash
curl -X 'POST' \
  'http://localhost:9596/api/pda-outbound/scan-destination' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
  "barcode_inbound": "f58edb181e97",
  "quantity": 2,
  "batch_outbound_id": 1
}'
```

**Response Scan Kedua (Completed):**
```json
{
  "status": "success",
  "message": "Scan destination berhasil diproses",
  "data": {
    "id": 2,
    "barcode_inbound": "f58edb181e97",
    "quantity": 2,
    "total_scanned_quantity": 3,
    "target_quantity": 3,
    "is_completed": true,
    "sppb_id": 1,
    "sppb_number": "WHO001"
  }
}
```

## Proses Scan Destination

Endpoint `scan-destination` memiliki proses khusus:

1. **Validasi Input**: 
   - Cek barcode_inbound ada di tabel batch_inbound
   - Cek batch_outbound_id ada di tabel batch_outbound

2. **Pembuatan Relocation**: 
   - Membuat data relocation dengan quantity yang di-input
   - Quantity bisa dicicil (contoh: scan pertama qty 1, scan kedua qty 2)

3. **Akumulasi Quantity**: 
   - Menghitung total quantity yang sudah di-scan untuk hari ini
   - Membandingkan dengan target quantity dari batch_outbound

4. **Pembuatan SPPB**: 
   - Jika total quantity sudah mencapai target, otomatis membuat data SPPB
   - SPPB number auto-generate dengan format WHO001, WHO002, dst
   - Status SPPB default "waiting"

## Database Tables

### Tabel SPPB (Baru)
```sql
CREATE TABLE sppb (
  id SERIAL PRIMARY KEY,
  uuid TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(6), 'hex'),
  order_form_id INTEGER DEFAULT 0,
  sppb_number VARCHAR(20) UNIQUE,
  mechanic_photo TEXT,
  status ENUM('waiting', 'completed') DEFAULT 'waiting',
  createdBy INTEGER DEFAULT 0,
  createdAt TIMESTAMPTZ DEFAULT NOW(),
  updatedBy INTEGER DEFAULT 0,
  updatedAt TIMESTAMPTZ,
  deletedBy INTEGER DEFAULT 0,
  deletedAt TIMESTAMPTZ
);
```

## Error Handling

- **404**: Barcode inbound atau batch outbound tidak ditemukan
- **400**: Data input tidak valid
- **401**: Unauthorized (token tidak valid)
- **500**: Internal server error 