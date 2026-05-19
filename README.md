# Reddit Clone (ReactJS + NestJS + SQLite)

Dự án portfolio Reddit Clone gồm:
- **Frontend**: ReactJS + Vite
- **Backend**: NestJS REST API
- **Database**: SQLite (`backend/data.sqlite`)

## 1) Yêu cầu môi trường
- Node.js >= 18
- npm >= 9

## 2) Cài dependencies
### Frontend
```bash
npm install
```
### Backend
```bash
cd backend
npm install
cd ..
```

## 3) Chạy backend
```bash
cd backend
npm run start:dev
```
Backend chạy tại: `http://localhost:3001`

> Lần đầu chạy, backend sẽ tự tạo file SQLite: `backend/data.sqlite` và seed dữ liệu demo.

## 4) Chạy frontend
Mở terminal khác tại thư mục gốc:
```bash
npm run dev
```
Frontend chạy tại: `http://localhost:5173`

## 5) Tài khoản demo
- username: `demo`
- password: `123456`

## 6) Luồng chạy đúng
1. Start backend trước.
2. Start frontend sau.
3. Mở trình duyệt vào `http://localhost:5173`.
4. Tạo post/comment/community trên frontend sẽ ghi xuống SQLite qua API backend.

## 7) Reset database (nếu muốn làm mới dữ liệu)
```bash
rm backend/data.sqlite
```
Sau đó chạy lại backend để tự tạo DB mới + seed dữ liệu.

## 8) Nếu lỗi npm 403
```bash
npm config set registry https://registry.npmjs.org/
```
Sau đó chạy lại `npm install`.
