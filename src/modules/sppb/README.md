# SPPB Module

## Endpoints

### 1. Get SPPB List
- **Method**: GET
- **Path**: `/sppb/list`
- **Query Parameters**:
  - `page` (optional): Page number
  - `limit` (optional): Number of items per page
  - `month` (optional): Filter by month (1-12)
  - `keyword` (optional): Search keyword

### 2. Get SPPB Detail
- **Method**: GET
- **Path**: `/sppb/:id`
- **Parameters**:
  - `id`: SPPB ID

### 3. Upload Mechanic Photo
- **Method**: POST
- **Path**: `/sppb/upload-photo`
- **Content-Type**: `multipart/form-data`
- **Authentication**: JWT Bearer Token required
- **Body**:
  - `sppb_id` (number): SPPB ID
  - `mechanic_photo` (file): Image file (max 5MB)

#### Request Example:
```bash
curl -X POST http://localhost:9596/api/sppb/upload-photo \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: multipart/form-data" \
  -F "sppb_id=2" \
  -F "mechanic_photo=@/path/to/photo.jpg"
```

#### Swagger Documentation:
- Endpoint tersedia di: `http://localhost:9596/api/docs`
- Kategori: SPPB
- Endpoint: `POST /api/sppb/upload-photo`
- Dokumentasi lengkap dengan schema request dan response

#### Response Example:
```json
{
  "statusCode": 200,
  "message": "Mechanic photo uploaded successfully and SPPB status updated to completed",
  "data": {
    "mechanic_photo": "https://minio-bucket.motorsights.com/bucket/sppb-mechanic-photos/uuid-filename.jpg"
  }
}
```

#### Error Responses:
- **404**: SPPB not found
- **400**: Invalid file format or size
- **401**: Unauthorized (JWT token required)
- **500**: Internal server error

## Features
- Upload foto mekanik untuk SPPB
- Foto akan disimpan di S3 storage dengan folder `sppb-mechanic-photos`
- URL foto akan diupdate di database SPPB kolom `mechanic_photo`
- **Status SPPB akan diupdate menjadi "completed" setelah foto berhasil diupload**
- Validasi SPPB exists sebelum upload
- File size limit: 5MB
- Supported formats: JPG, PNG, GIF, etc.
- JWT authentication required
- Swagger documentation lengkap 