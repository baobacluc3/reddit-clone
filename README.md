# Reddit Clone (ReactJS + NestJS)

Dự án portfolio Reddit Clone gồm:
- **Frontend**: ReactJS + Vite
- **Backend**: NestJS REST API

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

## 7) Nếu lỗi npm 403
```bash
npm config set registry https://registry.npmjs.org/
```
Sau đó chạy lại `npm install`.
