# PDA Outbound Module

Module ini menangani operasi untuk mengambil data order form yang akan ditampilkan di PDA (Personal Digital Assistant) untuk proses outbound.

## Fitur

- Mengambil data order form berdasarkan picker_id dari token JWT
- Dukungan untuk superadmin untuk melihat semua data
- Menambahkan label_wo dengan format WO-{id}

## Endpoint

### GET /pda-outbound

Mengambil data order form untuk PDA outbound.

**Headers:**
- `Authorization: Bearer <token>` - JWT token untuk autentikasi

**Query Parameters:**
- `superadmin` (optional) - Jika bernilai "yes" maka menampilkan semua data, jika tidak maka hanya data sesuai picker_id

**Response:**
```json
{
  "success": true,
  "message": "Data PDA Outbound berhasil diambil",
  "data": [
    {
      "id": 1,
      "vehicle_id": 1,
      "admin_id": 1,
      "driver_id": 1,
      "mechanic_id": 1,
      "picker_id": 123,
      "request_id": 1,
      "departement": "IT",
      "remark": "Test remark",
      "order_type": "sparepart",
      "start_date": "2024-01-01T00:00:00.000Z",
      "end_date": "2024-01-01T00:00:00.000Z",
      "status": "pending",
      "createdBy": 1,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedBy": 1,
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "deletedBy": 0,
      "deletedAt": null,
      "approvalBy": null,
      "approvalAt": null,
      "label_wo": "WO-1"
    }
  ]
}
```

## Logika Bisnis

1. **Filter berdasarkan picker_id**: Jika parameter `superadmin` tidak bernilai "yes", maka data yang ditampilkan hanya yang sesuai dengan `picker_id` yang sama dengan user ID dari token JWT.

2. **Superadmin access**: Jika parameter `superadmin` bernilai "yes", maka semua data order form akan ditampilkan.

3. **Label WO**: Setiap data akan ditambahkan field `label_wo` dengan format `WO-{id}`.

4. **Ordering**: Data diurutkan berdasarkan `createdAt` secara descending (terbaru di atas).

## Struktur File

```
src/modules/pda_outbound/
├── __test__/
│   ├── pda_outbound.controller.spec.ts
│   └── pda_outbound.service.spec.ts
├── dto/
│   ├── query.dto.ts
│   └── response.dto.ts
├── pda_outbound.controller.ts
├── pda_outbound.module.ts
├── pda_outbound.service.ts
└── README.md
```

## Testing

Jalankan test dengan perintah:

```bash
npm run test src/modules/pda_outbound
``` 