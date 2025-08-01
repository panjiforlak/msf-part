# Relocation History Endpoint

Endpoint ini digunakan untuk mengambil data riwayat relocation dengan reloc_type = 'outbound'.

## Endpoint

**GET** `/api/pda-outbound/relocation-history`

## Deskripsi

Mengambil data riwayat relocation yang memiliki reloc_type = 'outbound' dengan relasi ke berbagai tabel untuk mendapatkan informasi lengkap.

## Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `keyword` | string | No | Keyword untuk filter semua field response |

## Response Fields

| Field | Source | Description |
|-------|--------|-------------|
| `relocation_id` | `relocation.id` | ID dari tabel relocation |
| `tanggal` | `relocation.reloc_date` | Tanggal relocation |
| `part_name` | `inventory.inventory_name` | Nama part dari inventory |
| `part_internal_code_item` | `inventory.inventory_internal_code` | Internal code item dari inventory |
| `quantity` | `relocation.quantity` | Quantity yang direlokasi |
| `uom` | `inventory.uom` | Unit of measurement |
| `picker_name` | `users.name` | Nama picker |
| `rack_name` | `storage_area.storage_code` | Nama rack storage |
| `outbound_area_name` | `inbound_outbound_area.inout_area_code` | Nama area outbound |

## Database Relations

Endpoint ini menggunakan relasi berikut:

1. **relocation** → **batch_inbound** (via `batch_in_id`)
2. **batch_inbound** → **inventory** (via `inventory_id`)
3. **relocation** → **users** (via `picker_id`)
4. **relocation** → **storage_area** (via `reloc_from`)
5. **relocation** → **inbound_outbound_area** (via `reloc_to`)

## Query Logic

```sql
SELECT 
  reloc.id as relocation_id,
  reloc.reloc_date as tanggal,
  inv.inventory_name as part_name,
  inv.inventory_internal_code as part_internal_code_item,
  reloc.quantity as quantity,
  inv.uom as uom,
  picker.name as picker_name,
  rack.storage_code as rack_name,
  outbound.inout_area_code as outbound_area_name
FROM relocation reloc
LEFT JOIN batch_inbound bi ON reloc.batch_in_id = bi.id
LEFT JOIN inventory inv ON bi.inventory_id = inv.id
LEFT JOIN users picker ON reloc.picker_id = picker.id
LEFT JOIN storage_area rack ON reloc.reloc_from = rack.id
LEFT JOIN inbound_outbound_area outbound ON reloc.reloc_to = outbound.id
WHERE reloc.reloc_type = 'outbound'
ORDER BY reloc.reloc_date DESC
```

## Filter Keyword

Jika parameter `keyword` diberikan, akan diterapkan filter ILIKE (case-insensitive) pada field berikut:

- `inventory.inventory_name`
- `inventory.inventory_internal_code`
- `users.name`
- `storage_area.storage_code`
- `inbound_outbound_area.inout_area_code`

## Contoh Request

### Tanpa Filter
```bash
GET /api/pda-outbound/relocation-history
```

### Dengan Filter Keyword
```bash
GET /api/pda-outbound/relocation-history?keyword=engine
```

## Contoh Response

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
    },
    {
      "relocation_id": 2,
      "tanggal": "2024-01-14T14:20:00Z",
      "part_name": "Air Filter",
      "part_internal_code_item": "INT-002",
      "quantity": 5,
      "uom": "PCS",
      "picker_name": "Jane Smith",
      "rack_name": "RACK-B2",
      "outbound_area_name": "OUTBOUND-02"
    }
  ]
}
```

## Error Handling

- **200**: Data berhasil diambil
- **401**: Unauthorized (token tidak valid)
- **500**: Internal server error

## Authentication

Endpoint ini memerlukan JWT token yang valid di header Authorization:

```
Authorization: Bearer <jwt_token>
``` 