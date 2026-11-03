# Đóng góp

1. Tạo nhánh từ main, ví dụ fix/difficulty-selector.
2. Giữ thay đổi tập trung; thêm regression test cho lỗi DOM.
3. Chạy npm ci, npm run check và npm test bằng Node.js 24+.
4. Kiểm tra extension trong Chrome; test jsdom không kiểm tra bố cục thực tế.
5. Commit theo Conventional Commits: feat, fix, test, docs, ci hoặc chore; scope ví dụ content, popup, settings.
6. Mở PR mô tả vấn đề, thay đổi, cách kiểm tra và giới hạn. Không commit node_modules, file ZIP hay bí mật.

Khi sửa selector, giữ phạm vi quanh tiêu đề/metadata; tránh ẩn mọi từ Easy/Medium/Hard trên trang. Khi tăng phiên bản, cập nhật manifest.json, package.json, package-lock.json, phiên bản trong popup và CHANGELOG.md.
