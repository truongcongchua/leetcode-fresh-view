# LeetCode Fresh View

Luyện lại bài cũ với một góc nhìn mới. Extension Chrome Manifest V3 giúp che những nhãn có thể tạo định kiến trước khi bắt đầu giải bài.

## Tính năng

- Hai công tắc độc lập: **ẩn Solved và dấu tích**, **ẩn Easy / Medium / Hard** cạnh tiêu đề đề bài.
- Lưu cài đặt cục bộ, áp dụng thay đổi cho các tab đã kết nối.
- Theo dõi DOM khi LeetCode render lại hoặc chuyển bài.
- Popup tiếng Việt, hỗ trợ sáng/tối, bàn phím và reduced motion.
- Chỉ thay đổi hiển thị; tiến độ tài khoản, code và kết quả submit được giữ nguyên.

## Cài đặt trên Chrome

1. Clone repo này hoặc tải **Code → Download ZIP** và giải nén.
2. Mở `chrome://extensions`.
3. Bật **Developer mode**.
4. Chọn **Load unpacked**, chọn thư mục có `manifest.json`.
5. Refresh tab LeetCode đang mở.
6. Mở Fresh View từ menu Extensions để bật/tắt từng tùy chọn.

Không cần Node.js hoặc build để sử dụng. Node.js chỉ dùng khi phát triển và chạy test. Chưa phát hành trên Chrome Web Store.

## Cách dùng và cập nhật

Mở một trang `https://leetcode.com/problems/<slug>/description/`. Hai tùy chọn mặc định bật ở lần cài mới. Bạn có thể tắt riêng từng tùy chọn; cài đặt được lưu tự động.

Sau khi cập nhật mã: bấm **Reload ↻** ở Fresh View trên `chrome://extensions`, rồi **refresh tab LeetCode**. Reload extension không tự thay content script của tab đã mở. Nếu chuyển thư mục, hãy kiểm tra đường dẫn trong Details hoặc tải lại bằng Load unpacked.

## Quyền truy cập và riêng tư

| Quyền / phạm vi | Mục đích |
| --- | --- |
| `storage` | Lưu hai lựa chọn trong `chrome.storage.local` |
| Content script trên `https://leetcode.com/*` | Nhận diện và che nhãn trên trang đề bài, kể cả điều hướng nội bộ |

Không có backend, analytics, mã tải từ xa hay thao tác gửi dữ liệu. Không đọc cookies hoặc lịch sử trình duyệt. Popup dùng tab đang hoạt động để gửi thông báo áp dụng cài đặt; không yêu cầu quyền `tabs`. Tính năng che nhãn chỉ chạy trên đường dẫn `/problems/...`.

## Phạm vi và giới hạn

- Hỗ trợ nhãn tiếng Anh của trang đề bài trên leetcode.com.
- Chưa hỗ trợ danh sách bài, leetcode.cn, che submissions hoặc code đã lưu.
- JavaScript nhận diện DOM nên có thể thấy nhãn lóe lên trước khi bị che.
- LeetCode có thể đổi DOM; selector cần được kiểm tra lại khi giao diện thay đổi.
- DOM quanh nhãn Easy đã được đối chiếu trên trang LeetCode thực tế. Kiểm thử tự động dùng jsdom; không thay thế kiểm thử trình duyệt, layout và tài khoản đăng nhập.
- Thông báo popup xác nhận kết nối với content script; không bảo đảm mọi selector đều khớp khi LeetCode đổi giao diện.

## Phát triển

Yêu cầu Node.js 24 trở lên và npm.

```sh
npm ci
npm run check
npm test
```

Không có dependency runtime. jsdom chỉ dùng trong kiểm thử.

| File | Vai trò |
| --- | --- |
| `manifest.json` | Phiên bản, URL và quyền |
| `content.js` / `content.css` | Nhận diện DOM, áp dụng/gỡ hiệu ứng che |
| `popup.html` / `popup.css` / `popup.js` | Giao diện, lưu cài đặt và thông báo kết nối |
| `tests/extension.cjs` | Kiểm thử hành vi với DOM và Chrome API mô phỏng |
| `.github/workflows/ci.yml` | Kiểm tra cú pháp và chạy test trên push/PR |

### Kiểm thử

Test bao gồm bốn tổ hợp bật/tắt, chuyển cấu hình cũ, phục hồi nhãn, không che nhầm nội dung bài, cả ba độ khó, tiêu đề lồng nhiều cấp và hồi quy khi vùng đề có ô bình luận. Popup được kiểm tra lưu lựa chọn và cảnh báo khi tab chưa kết nối.

Kiểm tra thủ công trước khi phát hành:

- Bài đã giải/chưa giải; Easy, Medium và Hard.
- Bật/tắt từng tùy chọn, refresh, Next/Previous, Back/Forward.
- Light/dark mode, Tab/Space trong popup.
- Run/Submit, nhập code và bình luận vẫn hoạt động.

## Đóng góp

Mở issue với URL bài, phiên bản extension/Chrome, các bước tái hiện và ảnh hoặc HTML tối thiểu của nhãn. Không gửi cookies, token, thông tin tài khoản hay code riêng tư.

Tạo nhánh riêng, thay đổi theo mục đích và dùng Conventional Commits, ví dụ `fix(content): detect difficulty beside discussion editor`. Chạy check/test trước khi mở PR. Chi tiết ở [CONTRIBUTING.md](CONTRIBUTING.md).

## Ghi chú

Dự án độc lập, không liên kết với LeetCode. Tên và thương hiệu LeetCode thuộc chủ sở hữu tương ứng. Xem [CHANGELOG.md](CHANGELOG.md) để biết thay đổi của bản hiện tại.
