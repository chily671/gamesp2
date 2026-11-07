# Báo cáo kiểm thử và đánh giá Không gian 2

**Ngày kiểm thử:** 07/11/2026  
**Môi trường:** bản production build chạy local, MongoDB đã cấu hình  
**Đối tượng:** 10 hồ sơ QA giả lập; không dùng người tham gia thật

## Kết quả kiểm thử

| Chỉ số | Kết quả |
|---|---:|
| Hồ sơ giả lập đã đăng ký | 10 |
| Phiên hoàn thành | 10/10 (100%) |
| Nhiệm vụ/câu hỏi mỗi ván | 4 |
| Lượt trả lời đã lưu | 40 |
| Nhiệm vụ đúng hoàn toàn | 8/40 (20%) |
| Điểm trung bình | 186/400 |
| Phạm vi điểm | 26–258 |
| Thời gian trung bình ghi nhận | 4 giây mỗi ván |

Các lựa chọn được tạo ngẫu nhiên qua API đăng ký, bắt đầu game, tải nhiệm vụ,
gửi đáp án và lấy kết quả. Bộ kiểm thử xác nhận đáp án không xuất hiện trong
nội dung nhiệm vụ trước khi gửi lựa chọn. Cả 10 hồ sơ đều hoàn thành đủ bốn
nhiệm vụ và xuất hiện đúng trong thống kê admin.

**Lưu ý về diễn giải:** thời gian 4 giây là thời gian của lượt chạy tự động,
có chèn khoảng chờ ngẫu nhiên 0,5–1 giây trước mỗi câu; không đại diện cho
thời gian chơi của người thật. Tỷ lệ đúng là tỷ lệ câu mà toàn bộ lựa chọn
trùng chính xác với đáp án mong đợi, không phải tỷ lệ đúng của từng lựa chọn.
Vì người chơi QA chọn ngẫu nhiên, điểm và độ chính xác này không đo hiệu quả
học tập hoặc mức độ khó cảm nhận.

## Kiểm tra trang quản trị và giao diện

Dashboard hiển thị được số người chơi/phiên, tỷ lệ hoàn tất, điểm và độ chính
xác trung bình, thời gian trung bình, số câu hỏi/nhiệm vụ, tổng lượt trả lời,
và trạng thái rà soát pháp lý. Trong lượt thử, dashboard hiển thị 10 người
chơi, 10 phiên, hoàn tất 100%, độ chính xác 20%, thời gian `0:04`, 4 nhiệm vụ
và 40 lượt trả lời.

Đã mở dashboard trên trình duyệt ở chiều rộng 375 px; không có tràn ngang và
các chỉ số cùng cảnh báo pháp lý vẫn hiển thị. `npm run lint`,
`npm run build` và `git diff --check` đều thành công.

## Đánh giá nội dung và mức độ đối chiếu luật

Trò chơi gồm bốn tình huống: quyền ứng dụng; yêu cầu thu thập dữ liệu vượt quá
mục đích đã nêu; tin nhắn giả mạo yêu cầu mật khẩu/mã xác thực; và kế hoạch
bảo vệ danh tính. Đây là các chủ đề giáo dục quyền riêng tư và an toàn tài
khoản.

Không thể gán một tỷ lệ “tuân thủ luật” đáng tin cậy ở thời điểm này. Cả **4/4
nhiệm vụ đều được đánh dấu cần chuyên gia rà soát**; phần căn cứ hiện dẫn Luật
Bảo vệ dữ liệu cá nhân số 91/2025/QH15 ở mức khái quát, chưa ánh xạ từng đáp án
và lời giải tới điều khoản cụ thể. Nguồn Chính phủ xác nhận văn bản và metadata,
nhưng nội dung điều khoản chưa được đối chiếu độc lập trong lần kiểm thử này.
Do đó, dashboard chủ động ghi “Chưa được thẩm định” thay vì đưa ra điểm pháp
lý giả định. Nội dung hiện phù hợp làm mô phỏng nhận thức quyền riêng tư, chưa
nên được trình bày như tư vấn hoặc chứng nhận tuân thủ pháp luật.

## Kết luận và đề xuất

- **Kỹ thuật:** đạt kiểm thử luồng API end-to-end cho 10 phiên, lưu kết quả và
  tổng hợp admin; đáp án được giữ kín trước khi gửi.
- **Khả năng hoàn tất:** 10/10 lượt tự động hoàn tất; cần kiểm thử với người
  thật để đánh giá khả năng hiểu hướng dẫn, độ khó và thời lượng thực tế.
- **Hiệu quả học tập:** chưa được đo. Nên dùng bài kiểm tra ngắn trước/sau
  chơi hoặc phỏng vấn quan sát; không suy luận hiệu quả từ lượt chọn ngẫu nhiên.
- **Pháp lý:** cần chuyên gia rà soát từng tình huống, đáp án, giải thích và
  căn cứ điều khoản trước khi công bố như nội dung bám sát luật.
- **Dữ liệu:** 10 hồ sơ và phiên QA đã được xóa khỏi MongoDB sau kiểm thử;
  báo cáo này lưu lại số liệu tổng hợp, không chứa dữ liệu định danh người chơi.
