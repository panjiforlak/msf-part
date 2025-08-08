# PDA Outbound Module

Module ini menangani operasi PDA Outbound untuk sistem warehouse management.

## Endpoints

### 1. GET /api/pda-outbound
Mengambil data order form berdasarkan picker_id dari token JWT atau semua data jika superadmin.

**Query Parameters:**
- `superadmin` (optional): Jika bernilai 'yes', akan menampilkan semua data

**Response:**
```json
{
  "status": "success",
  "message": "Data PDA Outbound berhasil diambil",
  "data": [
    {
      "id": 1,
      "label_wo": "WO-1",
      "picker_name": "John Doe",
      // ... other fields
    }
  ]
}
```

### 2. GET /api/pda-outbound/:orderFormId/batch-outbound
Mengambil data batch outbound berdasarkan order form ID.

**Path Parameters:**
- `orderFormId`: ID dari order form

**Response:**
```json
{
  "status": "success",
  "message": "Data Batch Outbound berhasil diambil",
  "data": [
    {
      "id": 1,
      "inventory_name": "Engine Oil Filter",
      "quantity": 10,
      // ... other fields
    }
  ]
}
```

### 3. POST /api/pda-outbound/relocation
Membuat data relocation berdasarkan barcode inbound.

**Body Request:**
```json
{
  "barcode_inbound": "abc123def456",
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
    "quantity": 10,
    // ... other fields
  }
}
```

### 4. POST /api/pda-outbound/scan-destination
Scan destination untuk proses outbound dengan quantity yang bisa dicicil.

**Body Request:**
```json
{
  "batch_in_barcode": "abc123def456",
  "inbound_outbound_area_id": 1,
  "quantity": 1,
  "batch_outbound_id": 18
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Scan destination berhasil diproses",
  "data": {
    "id": 1,
    "quantity_temp_outbound": 5,
    "target_quantity": 10,
    "is_completed": false,
    // ... other fields
  }
}
```

### 5. GET /api/pda-outbound/get-area-outbound
Mengambil data area outbound berdasarkan barcode area.

**Query Parameters:**
- `barcode_area`: Barcode dari area outbound

**Response:**
```json
{
  "status": "success",
  "message": "Data area outbound berhasil diambil",
  "data": [
    {
      "id": 1,
      "barcode": "AREA001",
      "inout_area_code": "OUTBOUND-01",
      // ... other fields
    }
  ]
}
```

### 6. GET /api/pda-outbound/relocation-history
Mengambil data riwayat relocation dengan reloc_type = outbound.

**Query Parameters:**
- `keyword` (optional): Keyword untuk filter semua field (part_name, part_internal_code_item, picker_name, rack_name, outbound_area_name)

**Response:**
```json
{
  "status": "success",
  "message": "Data relocation history berhasil diambil",
  "data": [
    {
      "relocation_id": 1,
      "tanggal": "2024-01-15T10:30:00Z",
      "part_name": "Engine Oil Filter",
      "part_internal_code_item": "INT-001",
      "quantity": 10,
      "uom": "PCS",
      "picker_name": "John Doe",
      "rack_name": "RACK-A1",
      "outbound_area_name": "OUTBOUND-01"
    }
  ]
}
```

## Database Relations

Endpoint relocation-history menggunakan relasi berikut:
1. `relocation` → `batch_inbound` (via batch_in_id)
2. `batch_inbound` → `inventory` (via inventory_id)
3. `relocation` → `users` (via picker_id)
4. `relocation` → `storage_area` (via reloc_from)
5. `relocation` → `inbound_outbound_area` (via reloc_to)

## Filter

Endpoint relocation-history mendukung filter keyword yang akan mencari di semua field response:
- part_name
- part_internal_code_item
- picker_name
- rack_name
- outbound_area_name

Filter menggunakan ILIKE untuk pencarian case-insensitive. 