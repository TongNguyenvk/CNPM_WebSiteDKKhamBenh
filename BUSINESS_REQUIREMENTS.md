# Mô Tả Nghiệp Vụ Hệ Thống Đăng Ký Khám Bệnh Trực Tuyến

## 1. Tổng Quan Hệ Thống

Hệ thống Website Đăng Ký Lịch Khám Bệnh là một nền tảng trực tuyến cho phép bệnh nhân đặt lịch hẹn khám bệnh với các bác sĩ tại bệnh viện một cách thuận tiện và nhanh chóng. Hệ thống được thiết kế để giải quyết các vấn đề thường gặp trong quy trình khám bệnh truyền thống như: chờ đợi lâu, không biết lịch làm việc của bác sĩ, khó khăn trong việc chọn chuyên khoa phù hợp.

Hệ thống phục vụ ba nhóm người dùng chính: Bệnh nhân (những người có nhu cầu khám bệnh), Bác sĩ (những người cung cấp dịch vụ khám chữa bệnh), và Quản trị viên (những người quản lý và vận hành hệ thống). Mỗi nhóm người dùng có các chức năng và quyền hạn riêng biệt, được phân định rõ ràng để đảm bảo tính bảo mật và hiệu quả trong vận hành.

Quy trình hoạt động tổng thể của hệ thống diễn ra như sau: Bác sĩ đăng ký lịch làm việc của mình, sau đó Quản trị viên xem xét và phê duyệt các lịch này. Khi lịch được duyệt, bệnh nhân có thể xem và đặt lịch hẹn khám với bác sĩ theo khung giờ phù hợp. Sau khi đặt lịch, bệnh nhân đến khám theo lịch hẹn, và bác sĩ cập nhật trạng thái cuộc hẹn sau khi hoàn thành.

---

## 2. Các Vai Trò Trong Hệ Thống

### 2.1. Bệnh Nhân (Patient - R1)

Bệnh nhân là người sử dụng chính của hệ thống, có nhu cầu tìm kiếm bác sĩ và đặt lịch khám bệnh. Bệnh nhân có thể tự đăng ký tài khoản trên hệ thống mà không cần sự can thiệp của quản trị viên. Sau khi có tài khoản, bệnh nhân có thể duyệt xem danh sách các chuyên khoa, tìm hiểu thông tin về các bác sĩ, xem lịch làm việc còn trống của bác sĩ và tiến hành đặt lịch hẹn.

Bệnh nhân có toàn quyền quản lý các lịch hẹn của mình, bao gồm xem chi tiết lịch hẹn đã đặt, theo dõi trạng thái lịch hẹn (đang chờ xác nhận, đã xác nhận, đã hoàn thành, hoặc đã hủy), và có thể chủ động hủy lịch hẹn nếu có thay đổi kế hoạch. Ngoài ra, bệnh nhân cũng có thể cập nhật thông tin cá nhân như số điện thoại, địa chỉ, và ảnh đại diện.


### 2.2. Bác Sĩ (Doctor - R2)

Bác sĩ là người cung cấp dịch vụ khám chữa bệnh trong hệ thống. Tài khoản bác sĩ được tạo bởi Quản trị viên, đảm bảo rằng chỉ những bác sĩ được xác minh mới có thể hoạt động trên hệ thống. Mỗi bác sĩ thuộc về một chuyên khoa cụ thể và có thông tin chi tiết về trình độ, kinh nghiệm được hiển thị cho bệnh nhân tham khảo.

Bác sĩ có quyền tự chủ trong việc đăng ký lịch làm việc của mình. Họ có thể chọn ngày, khung giờ và số lượng bệnh nhân tối đa có thể tiếp nhận trong mỗi ca khám. Tuy nhiên, lịch làm việc do bác sĩ đăng ký sẽ ở trạng thái "Chờ duyệt" cho đến khi được Quản trị viên phê duyệt. Điều này giúp bệnh viện kiểm soát được lịch làm việc tổng thể và tránh xung đột về phòng khám hoặc tài nguyên.

Bác sĩ có thể xem danh sách các lịch hẹn mà bệnh nhân đã đặt với mình, xem thông tin chi tiết của bệnh nhân, và cập nhật trạng thái của lịch hẹn sau khi khám xong. Bác sĩ cũng có thể quản lý hồ sơ cá nhân và cập nhật thông tin giới thiệu về bản thân.

### 2.3. Quản Trị Viên (Admin - R3)

Quản trị viên là người có quyền cao nhất trong hệ thống, chịu trách nhiệm quản lý và vận hành toàn bộ nền tảng. Quản trị viên có thể tạo tài khoản cho bác sĩ mới, quản lý thông tin của tất cả người dùng trong hệ thống, và có quyền xóa hoặc vô hiệu hóa tài khoản khi cần thiết.

Một trong những nhiệm vụ quan trọng của Quản trị viên là phê duyệt lịch làm việc do bác sĩ đăng ký. Khi bác sĩ tạo lịch mới, Quản trị viên sẽ nhận được thông báo và có thể xem xét, duyệt hoặc từ chối lịch đó. Chỉ những lịch đã được duyệt mới hiển thị cho bệnh nhân đặt khám. Điều này giúp bệnh viện kiểm soát chất lượng dịch vụ và đảm bảo tính nhất quán trong hoạt động.

Quản trị viên cũng quản lý danh mục chuyên khoa của bệnh viện, bao gồm thêm mới, chỉnh sửa hoặc xóa các chuyên khoa. Ngoài ra, Quản trị viên có thể xem tổng quan về tất cả các lịch hẹn trong hệ thống, theo dõi hoạt động của bác sĩ và bệnh nhân, và tạo các báo cáo thống kê khi cần.

---

## 3. Các Nghiệp Vụ Chi Tiết

### 3.1. Nghiệp Vụ Đăng Ký và Đăng Nhập

#### 3.1.1. Đăng Ký Tài Khoản Bệnh Nhân

Quy trình đăng ký tài khoản bệnh nhân được thiết kế đơn giản và nhanh chóng. Người dùng truy cập trang đăng ký, điền các thông tin bắt buộc bao gồm: họ tên, email, mật khẩu, số điện thoại, địa chỉ và giới tính. Hệ thống sẽ kiểm tra tính hợp lệ của email (đảm bảo chưa được sử dụng và đúng định dạng), kiểm tra độ mạnh của mật khẩu (tối thiểu 6 ký tự). Nếu tất cả thông tin hợp lệ, hệ thống tạo tài khoản mới với vai trò Bệnh nhân (R1) và mật khẩu được mã hóa bằng thuật toán bcrypt trước khi lưu vào cơ sở dữ liệu.

#### 3.1.2. Đăng Ký Tài Khoản Bác Sĩ

Khác với bệnh nhân, tài khoản bác sĩ chỉ có thể được tạo bởi Quản trị viên. Quản trị viên đăng nhập vào hệ thống, truy cập chức năng quản lý người dùng, và điền thông tin của bác sĩ mới bao gồm: thông tin cá nhân (họ tên, email, mật khẩu, số điện thoại, địa chỉ, giới tính), thông tin chuyên môn (chuyên khoa, chức vụ/học vị), và thông tin giới thiệu (mô tả về kinh nghiệm, chuyên môn). Hệ thống tạo tài khoản với vai trò Bác sĩ (R2) và đồng thời tạo bản ghi chi tiết bác sĩ (DoctorDetail) để lưu trữ thông tin giới thiệu.

#### 3.1.3. Đăng Nhập Hệ Thống

Người dùng đăng nhập bằng email và mật khẩu. Hệ thống xác thực thông tin bằng cách so sánh mật khẩu đã mã hóa trong cơ sở dữ liệu. Nếu thông tin chính xác, hệ thống tạo một JSON Web Token (JWT) chứa thông tin người dùng và vai trò, token này có thời hạn 7 ngày. Token được trả về cho client và sử dụng cho các request tiếp theo để xác thực người dùng. Dựa vào vai trò trong token, hệ thống sẽ điều hướng người dùng đến giao diện phù hợp: bệnh nhân đến trang đặt lịch, bác sĩ đến trang quản lý lịch hẹn, quản trị viên đến trang quản trị.


### 3.2. Nghiệp Vụ Quản Lý Chuyên Khoa

#### 3.2.1. Thêm Chuyên Khoa Mới

Quản trị viên có thể thêm các chuyên khoa mới vào hệ thống khi bệnh viện mở rộng dịch vụ. Thông tin chuyên khoa bao gồm: tên chuyên khoa (ví dụ: Nội khoa, Ngoại khoa, Tim mạch, Da liễu), hình ảnh đại diện, và mô tả chi tiết về các bệnh lý mà chuyên khoa điều trị. Sau khi thêm, chuyên khoa sẽ xuất hiện trong danh sách để bệnh nhân có thể tìm kiếm và bác sĩ có thể được gán vào.

#### 3.2.2. Cập Nhật Thông Tin Chuyên Khoa

Khi cần thay đổi thông tin chuyên khoa (ví dụ: cập nhật mô tả, thay đổi hình ảnh), Quản trị viên truy cập danh sách chuyên khoa, chọn chuyên khoa cần sửa và cập nhật thông tin. Các thay đổi được lưu ngay lập tức và hiển thị trên giao diện người dùng.

#### 3.2.3. Xóa Chuyên Khoa

Quản trị viên có thể xóa chuyên khoa không còn hoạt động. Tuy nhiên, hệ thống cần kiểm tra xem có bác sĩ nào đang thuộc chuyên khoa đó không. Nếu có, cần chuyển bác sĩ sang chuyên khoa khác trước khi xóa để đảm bảo tính toàn vẹn dữ liệu.

### 3.3. Nghiệp Vụ Quản Lý Lịch Làm Việc

#### 3.3.1. Bác Sĩ Đăng Ký Lịch Làm Việc

Đây là nghiệp vụ quan trọng cho phép bác sĩ chủ động trong việc sắp xếp thời gian làm việc. Bác sĩ đăng nhập vào hệ thống, truy cập trang "Lịch làm việc của tôi", và chọn "Đăng ký lịch làm việc". Bác sĩ cần cung cấp các thông tin sau:

- Ngày làm việc: Chọn ngày cụ thể muốn làm việc
- Khung giờ: Chọn một trong các khung giờ có sẵn (08:00-09:00, 09:00-10:00, 10:00-11:00, 11:00-12:00, 13:00-14:00, 14:00-15:00, 15:00-16:00, 16:00-17:00)
- Số bệnh nhân tối đa: Số lượng bệnh nhân có thể tiếp nhận trong khung giờ đó

Sau khi bác sĩ gửi yêu cầu, hệ thống kiểm tra xem đã có lịch trùng (cùng ngày, cùng khung giờ) chưa. Nếu không trùng, hệ thống tạo lịch mới với trạng thái "Chờ duyệt" (pending). Lịch này sẽ hiển thị trong danh sách của bác sĩ với nhãn trạng thái màu vàng, và bác sĩ được thông báo rằng lịch đang chờ Admin phê duyệt.

#### 3.3.2. Quản Trị Viên Duyệt Lịch Làm Việc

Quản trị viên truy cập trang "Quản lý lịch phân công", nơi hiển thị hai tab: "Tất cả lịch" và "Chờ duyệt". Tab "Chờ duyệt" hiển thị số lượng lịch đang chờ dưới dạng badge màu đỏ để thu hút sự chú ý.

Khi xem danh sách lịch chờ duyệt, Quản trị viên thấy đầy đủ thông tin: ngày, tên bác sĩ, chuyên khoa, khung giờ, số lượng bệnh nhân tối đa. Với mỗi lịch, Quản trị viên có hai lựa chọn:

- Duyệt (Approve): Chuyển trạng thái lịch thành "Đã duyệt" (approved). Lịch này sẽ hiển thị cho bệnh nhân đặt khám.
- Từ chối (Reject): Chuyển trạng thái lịch thành "Từ chối" (rejected). Lịch này không hiển thị cho bệnh nhân và bác sĩ cần đăng ký lại nếu muốn.

#### 3.3.3. Quản Trị Viên Tạo Lịch Trực Tiếp

Ngoài việc duyệt lịch do bác sĩ đăng ký, Quản trị viên cũng có thể tạo lịch làm việc trực tiếp cho bác sĩ. Điều này hữu ích trong trường hợp bệnh viện cần phân công lịch trực hoặc khi bác sĩ mới chưa quen với hệ thống. Lịch do Quản trị viên tạo sẽ có trạng thái "Đã duyệt" ngay lập tức, không cần qua bước phê duyệt.

#### 3.3.4. Chỉnh Sửa và Xóa Lịch Làm Việc

Bác sĩ có thể xóa lịch làm việc của mình nếu lịch đó chưa có bệnh nhân đặt hoặc đang ở trạng thái "Chờ duyệt". Quản trị viên có quyền chỉnh sửa hoặc xóa bất kỳ lịch nào trong hệ thống. Khi chỉnh sửa, có thể thay đổi ngày, khung giờ hoặc số lượng bệnh nhân tối đa.


### 3.4. Nghiệp Vụ Đặt Lịch Khám Bệnh

#### 3.4.1. Tìm Kiếm Bác Sĩ

Bệnh nhân có nhiều cách để tìm kiếm bác sĩ phù hợp với nhu cầu khám bệnh của mình:

- Tìm theo chuyên khoa: Bệnh nhân chọn chuyên khoa từ danh sách (ví dụ: Tim mạch), hệ thống hiển thị tất cả bác sĩ thuộc chuyên khoa đó cùng với thông tin chi tiết.
- Xem danh sách tất cả bác sĩ: Bệnh nhân có thể duyệt qua danh sách toàn bộ bác sĩ, xem thông tin giới thiệu, chuyên khoa, và đánh giá (nếu có).
- Xem chi tiết bác sĩ: Khi chọn một bác sĩ, bệnh nhân thấy thông tin đầy đủ bao gồm: họ tên, chức vụ/học vị, chuyên khoa, mô tả kinh nghiệm, và lịch làm việc còn trống.

#### 3.4.2. Xem Lịch Làm Việc Của Bác Sĩ

Sau khi chọn bác sĩ, bệnh nhân xem lịch làm việc của bác sĩ đó. Hệ thống chỉ hiển thị những lịch đã được duyệt (status = approved) và còn chỗ trống (currentNumber < maxNumber). Lịch được hiển thị theo ngày và khung giờ, giúp bệnh nhân dễ dàng chọn thời gian phù hợp.

Mỗi khung giờ hiển thị thông tin: thời gian (ví dụ: 08:00-09:00), số chỗ còn trống (ví dụ: 3/5 - còn 3 chỗ trong tổng số 5). Những khung giờ đã đầy sẽ được đánh dấu và không cho phép đặt.

#### 3.4.3. Thực Hiện Đặt Lịch

Khi bệnh nhân chọn một khung giờ còn trống và nhấn "Đặt lịch", hệ thống thực hiện các bước sau:

1. Kiểm tra bệnh nhân đã đăng nhập chưa. Nếu chưa, yêu cầu đăng nhập.
2. Kiểm tra lịch còn chỗ trống không (tránh trường hợp nhiều người đặt cùng lúc).
3. Tạo bản ghi Booking mới với các thông tin: ID bác sĩ, ID bệnh nhân, ngày khám, khung giờ, trạng thái "Chờ xác nhận" (S1), và một token duy nhất để xác thực.
4. Cập nhật số lượng đã đặt (currentNumber) trong bảng Schedule.
5. Hiển thị thông báo đặt lịch thành công và thông tin chi tiết lịch hẹn.

#### 3.4.4. Xem Danh Sách Lịch Hẹn Đã Đặt

Bệnh nhân có thể xem tất cả lịch hẹn của mình trong trang "Lịch hẹn của tôi". Danh sách hiển thị các thông tin: ngày khám, khung giờ, tên bác sĩ, chuyên khoa, và trạng thái lịch hẹn. Các trạng thái bao gồm:

- S1 - Chờ xác nhận: Lịch hẹn mới tạo, đang chờ bác sĩ hoặc admin xác nhận
- S2 - Đã xác nhận: Lịch hẹn đã được xác nhận, bệnh nhân có thể đến khám
- S3 - Đã hủy: Lịch hẹn đã bị hủy bởi bệnh nhân hoặc bác sĩ
- S4 - Đã hoàn thành: Bệnh nhân đã đến khám và hoàn tất

#### 3.4.5. Hủy Lịch Hẹn

Bệnh nhân có thể hủy lịch hẹn nếu không thể đến khám. Khi hủy, hệ thống cập nhật trạng thái lịch hẹn thành "Đã hủy" (S3) và giảm số lượng đã đặt (currentNumber) trong bảng Schedule, giải phóng chỗ cho bệnh nhân khác. Bệnh nhân nên hủy lịch sớm để không ảnh hưởng đến lịch làm việc của bác sĩ.


### 3.5. Nghiệp Vụ Quản Lý Lịch Hẹn (Phía Bác Sĩ)

#### 3.5.1. Xem Danh Sách Lịch Hẹn

Bác sĩ đăng nhập và truy cập trang "Lịch hẹn" để xem danh sách các bệnh nhân đã đặt lịch khám với mình. Danh sách có thể lọc theo ngày để bác sĩ dễ dàng xem lịch hẹn của một ngày cụ thể. Mỗi lịch hẹn hiển thị: thông tin bệnh nhân (họ tên, số điện thoại, email), ngày và giờ khám, trạng thái hiện tại.

#### 3.5.2. Xác Nhận Lịch Hẹn

Khi bệnh nhân đặt lịch, lịch hẹn ở trạng thái "Chờ xác nhận". Bác sĩ (hoặc Admin) xem xét và xác nhận lịch hẹn bằng cách chuyển trạng thái sang "Đã xác nhận" (S2). Việc xác nhận giúp bệnh nhân yên tâm rằng lịch hẹn của họ đã được ghi nhận và bác sĩ sẽ sẵn sàng tiếp đón.

#### 3.5.3. Hoàn Thành Lịch Hẹn

Sau khi bệnh nhân đến khám và hoàn tất quá trình khám bệnh, bác sĩ cập nhật trạng thái lịch hẹn thành "Đã hoàn thành" (S4). Điều này giúp theo dõi lịch sử khám bệnh của bệnh nhân và thống kê hoạt động của bác sĩ.

#### 3.5.4. Hủy Lịch Hẹn

Trong trường hợp bác sĩ không thể tiếp nhận bệnh nhân (ví dụ: có việc đột xuất), bác sĩ có thể hủy lịch hẹn. Khi hủy, hệ thống cập nhật trạng thái thành "Đã hủy" và giải phóng chỗ trong lịch làm việc. Lý tưởng nhất là bệnh nhân được thông báo về việc hủy này (tính năng thông báo có thể được bổ sung trong tương lai).

### 3.6. Nghiệp Vụ Quản Lý Người Dùng (Phía Admin)

#### 3.6.1. Xem Danh Sách Người Dùng

Quản trị viên có thể xem danh sách tất cả người dùng trong hệ thống, được phân loại theo vai trò: Bệnh nhân (R1), Bác sĩ (R2), và Admin (R3). Danh sách hiển thị các thông tin cơ bản: họ tên, email, số điện thoại, vai trò, và ngày tạo tài khoản.

#### 3.6.2. Tạo Tài Khoản Mới

Quản trị viên có thể tạo tài khoản cho bác sĩ mới hoặc admin mới. Khi tạo tài khoản bác sĩ, cần cung cấp đầy đủ thông tin bao gồm chuyên khoa và thông tin giới thiệu. Khi tạo tài khoản admin, chỉ cần thông tin cơ bản.

#### 3.6.3. Chỉnh Sửa Thông Tin Người Dùng

Quản trị viên có thể chỉnh sửa thông tin của bất kỳ người dùng nào, bao gồm: cập nhật thông tin cá nhân, thay đổi chuyên khoa của bác sĩ, reset mật khẩu, hoặc thay đổi vai trò (trong trường hợp đặc biệt).

#### 3.6.4. Xóa Tài Khoản

Quản trị viên có quyền xóa tài khoản người dùng. Tuy nhiên, cần cân nhắc kỹ vì việc xóa có thể ảnh hưởng đến dữ liệu liên quan (lịch hẹn, lịch làm việc). Trong thực tế, nên vô hiệu hóa tài khoản thay vì xóa hoàn toàn để bảo toàn lịch sử.

### 3.7. Nghiệp Vụ Quản Lý Hồ Sơ Cá Nhân

#### 3.7.1. Xem và Cập Nhật Thông Tin Cá Nhân

Tất cả người dùng đều có thể xem và cập nhật thông tin cá nhân của mình, bao gồm: họ tên, số điện thoại, địa chỉ, giới tính. Riêng email không được phép thay đổi vì đây là định danh duy nhất của tài khoản.

#### 3.7.2. Thay Đổi Mật Khẩu

Người dùng có thể thay đổi mật khẩu bằng cách cung cấp mật khẩu cũ và mật khẩu mới. Hệ thống xác thực mật khẩu cũ trước khi cho phép thay đổi, và mật khẩu mới được mã hóa trước khi lưu.

#### 3.7.3. Cập Nhật Ảnh Đại Diện

Người dùng có thể tải lên ảnh đại diện mới. Hệ thống lưu trữ ảnh trong thư mục uploads và cập nhật đường dẫn trong cơ sở dữ liệu. Ảnh cũ có thể được giữ lại hoặc xóa tùy theo cấu hình.


---

## 4. Quy Trình Nghiệp Vụ Tổng Thể

### 4.1. Quy Trình Đăng Ký Lịch Làm Việc (Hybrid)

```
Bác sĩ đăng ký lịch → Lịch ở trạng thái "Chờ duyệt" → Admin xem xét
                                                            ↓
                                            ┌───────────────┴───────────────┐
                                            ↓                               ↓
                                    Admin duyệt                      Admin từ chối
                                            ↓                               ↓
                            Lịch chuyển sang "Đã duyệt"      Lịch chuyển sang "Từ chối"
                                            ↓                               ↓
                            Hiển thị cho bệnh nhân đặt       Bác sĩ cần đăng ký lại
```

### 4.2. Quy Trình Đặt Lịch Khám Bệnh

```
Bệnh nhân tìm bác sĩ → Xem lịch làm việc (chỉ lịch đã duyệt) → Chọn khung giờ còn trống
                                                                        ↓
                                                                Đặt lịch hẹn
                                                                        ↓
                                                    Lịch hẹn ở trạng thái "Chờ xác nhận"
                                                                        ↓
                                                    Bác sĩ/Admin xác nhận lịch hẹn
                                                                        ↓
                                                    Lịch hẹn chuyển sang "Đã xác nhận"
                                                                        ↓
                                                    Bệnh nhân đến khám theo lịch
                                                                        ↓
                                                    Bác sĩ cập nhật "Đã hoàn thành"
```

### 4.3. Quy Trình Hủy Lịch Hẹn

```
Bệnh nhân/Bác sĩ yêu cầu hủy → Hệ thống cập nhật trạng thái "Đã hủy"
                                        ↓
                            Giảm số lượng đã đặt trong Schedule
                                        ↓
                            Giải phóng chỗ cho bệnh nhân khác
```

---

## 5. Các Trạng Thái Trong Hệ Thống

### 5.1. Trạng Thái Lịch Làm Việc (Schedule Status)

| Trạng thái | Mã | Mô tả |
|------------|-----|-------|
| Chờ duyệt | pending | Lịch do bác sĩ tạo, đang chờ Admin phê duyệt |
| Đã duyệt | approved | Lịch đã được Admin duyệt, hiển thị cho bệnh nhân |
| Từ chối | rejected | Lịch bị Admin từ chối, không hiển thị cho bệnh nhân |

### 5.2. Trạng Thái Lịch Hẹn (Booking Status)

| Trạng thái | Mã | Mô tả |
|------------|-----|-------|
| Chờ xác nhận | S1 | Lịch hẹn mới tạo, chờ xác nhận |
| Đã xác nhận | S2 | Lịch hẹn đã được xác nhận |
| Đã hủy | S3 | Lịch hẹn đã bị hủy |
| Đã hoàn thành | S4 | Bệnh nhân đã khám xong |

### 5.3. Vai Trò Người Dùng (User Role)

| Vai trò | Mã | Mô tả |
|---------|-----|-------|
| Bệnh nhân | R1 | Người đặt lịch khám bệnh |
| Bác sĩ | R2 | Người cung cấp dịch vụ khám bệnh |
| Quản trị viên | R3 | Người quản lý hệ thống |

---

## 6. Các Khung Giờ Khám Bệnh

Hệ thống định nghĩa 8 khung giờ khám bệnh trong ngày:

| Mã | Khung giờ | Buổi |
|----|-----------|------|
| T1 | 08:00 - 09:00 | Sáng |
| T2 | 09:00 - 10:00 | Sáng |
| T3 | 10:00 - 11:00 | Sáng |
| T4 | 11:00 - 12:00 | Sáng |
| T5 | 13:00 - 14:00 | Chiều |
| T6 | 14:00 - 15:00 | Chiều |
| T7 | 15:00 - 16:00 | Chiều |
| T8 | 16:00 - 17:00 | Chiều |

---

## 7. Bảo Mật và Phân Quyền

### 7.1. Xác Thực (Authentication)

Hệ thống sử dụng JWT (JSON Web Token) để xác thực người dùng. Token được tạo khi đăng nhập thành công và có thời hạn 7 ngày. Mỗi request đến API cần đính kèm token trong header Authorization.

### 7.2. Phân Quyền (Authorization)

Hệ thống áp dụng phân quyền dựa trên vai trò (Role-Based Access Control). Mỗi API endpoint được bảo vệ bởi middleware kiểm tra vai trò của người dùng. Ví dụ:

- API tạo chuyên khoa: Chỉ Admin (R3)
- API duyệt lịch: Chỉ Admin (R3)
- API tạo lịch làm việc: Bác sĩ (R2) và Admin (R3)
- API đặt lịch khám: Chỉ Bệnh nhân (R1)

### 7.3. Bảo Vệ Dữ Liệu Cá Nhân

- Mật khẩu được mã hóa bằng bcrypt trước khi lưu
- Người dùng chỉ có thể xem và sửa thông tin của chính mình (trừ Admin)
- Bác sĩ chỉ có thể quản lý lịch làm việc của chính mình (trừ Admin)

---

## 8. Kết Luận

Hệ thống Đăng Ký Lịch Khám Bệnh Trực Tuyến được thiết kế với mục tiêu đơn giản hóa quy trình đặt lịch khám bệnh, mang lại sự thuận tiện cho bệnh nhân và hiệu quả quản lý cho bệnh viện. Với mô hình phân quyền rõ ràng và quy trình duyệt lịch hybrid, hệ thống đảm bảo tính linh hoạt cho bác sĩ trong việc đăng ký lịch làm việc, đồng thời vẫn duy trì sự kiểm soát của bệnh viện thông qua vai trò Quản trị viên.

Các tính năng chính của hệ thống bao gồm: đăng ký và đăng nhập, quản lý chuyên khoa, quản lý lịch làm việc với quy trình duyệt, đặt lịch khám bệnh, quản lý lịch hẹn, và quản lý người dùng. Hệ thống được xây dựng trên nền tảng công nghệ hiện đại (Next.js, Express.js, MySQL) và có thể dễ dàng mở rộng để bổ sung các tính năng mới trong tương lai như: thông báo qua email/SMS, thanh toán trực tuyến, đánh giá bác sĩ, và tư vấn trực tuyến.
