# Birthday app (Sinh Nhật Âm/Dương)

Xem thêm AGENTS.md (quy tắc Expo). Plan đầy đủ: `plan/birthday-app-plan.md` trong project Claude.

## Luật cố định
- Lịch âm luôn tính theo **UTC+7** (thuật toán Hồ Ngọc Đức, timeZone = 7.0), không phụ thuộc múi giờ máy. Không dùng thư viện lịch Trung Quốc.
- Sinh tháng nhuận: năm có tháng nhuận trùng thì tổ chức tháng nhuận, năm không có thì tháng thường.
- Sinh ngày 30 âm mà tháng đó chỉ có 29 ngày: dùng ngày 29. 29/2 dương năm không nhuận: 28/2 (cài đặt có thể đổi 1/3).
- Thông báo: local notification, nhắc trước N ngày (mặc định 7) và đúng ngày lúc **00:00**. iOS tối đa 64 thông báo chờ, app chỉ hẹn tối đa 60.
- Không lưu ngày dương đã quy đổi vào DB; luôn tính trên máy.
- `src/core/` là TypeScript thuần: không import `react-native` hay `expo`, mọi thay đổi phải kèm test.
- Dữ liệu offline-first: SQLite trên máy là nguồn chính, đồng bộ Supabase ở nền. Mọi bảng Supabase bật RLS; không bao giờ dùng service role key trong app.
- Đăng nhập: Google (kèm Sign in with Apple trên iOS). Không email OTP.
- Toàn bộ chữ trên UI bằng tiếng Việt.

## Lệnh
- `npm run check`: typecheck + lint + test. Chạy trước khi xong mọi việc.
- Migration SQL nằm ở `supabase/migrations/`; schema chỉ thay đổi bằng migration mới, không sửa file cũ đã chạy.
