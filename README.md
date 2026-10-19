# Sinh Nhật Âm/Dương

App React Native (Expo SDK 58, TypeScript, expo-router) nhắc sinh nhật theo cả lịch dương và âm. Dữ liệu đồng bộ qua Supabase.

## Chạy thử trên iPhone (từ Windows)

1. Cài Node.js 22 trở lên.
2. Trong thư mục này:
   ```bash
   npm install
   copy .env.example .env
   ```
   Mở `.env`, điền `EXPO_PUBLIC_SUPABASE_ANON_KEY` (Supabase → Project Settings → API Keys → Publishable key).
3. `npx expo start`, mở app **Expo Go** trên iPhone (cùng Wi-Fi với máy tính) và quét QR. Nếu không quét được do mạng thì dùng `npx expo start --tunnel`.
4. Trong app bấm **Kiểm tra kết nối Supabase**. Hiện "Kết nối Supabase thành công ✓" là xong.

## Tạo bảng trên Supabase

Chọn một trong hai cách:

- **Dán SQL (dễ nhất):** Supabase dashboard → SQL Editor → New query, dán toàn bộ `supabase/migrations/20261017000000_init.sql` và bấm Run.
- **Supabase CLI:** điền `SUPABASE_ACCESS_TOKEN` và `SUPABASE_DB_PASSWORD` trong `.env`, rồi:
  ```bash
  npx supabase login --token <SUPABASE_ACCESS_TOKEN>
  npx supabase link --project-ref izjbakjadlhhfgnatozx
  npx supabase db push
  ```

Sau khi chạy, vào Table Editor sẽ thấy 2 bảng `people` và `user_settings`, cả hai đều có RLS bật.

## Lệnh

| Lệnh | Việc |
|---|---|
| `npm start` | Chạy dev server |
| `npm run check` | Typecheck + lint + test |
| `npm test` | Chỉ chạy test |

## Đẩy lên GitHub

```bash
git remote add origin https://github.com/<tài-khoản>/birthday-app.git
git push -u origin main
```
CI (GitHub Actions) sẽ tự chạy typecheck, lint và test trên mỗi PR.
# birthday-app
