'use client';

import React from 'react';

export default function HomePage() {
  return (
    <div>
      {/* Header */}
      <div style={{ width: '1600px', height: '85px', padding: '9.58px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '450px' }}>
        <div style={{ height: '63px', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '56px' }}>
          <img style={{ width: '63px', height: '63px' }} src="https://placehold.co/63x63" alt="Logo" />
          <div style={{ padding: '8.38px 0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: '101px', color: '#171717', fontSize: '15.56px', fontFamily: 'Actor', fontWeight: 400 }}>Đặt lịch khám</div>
          </div>
          <div style={{ padding: '8.38px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '50px' }}>
            <div style={{ color: '#171717', fontSize: '15.56px', fontFamily: 'Actor', fontWeight: 400 }}>Lịch hẹn</div>
          </div>
          <div style={{ height: '35.76px', padding: '8.38px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ color: '#171717', fontSize: '15.56px', fontFamily: 'Actor', fontWeight: 400 }}>Liên hệ</div>
          </div>
        </div>
        <div style={{ height: '35.76px', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '30px' }}>
          <div style={{ width: '239.44px', height: '33.52px', padding: '11.97px 10.77px 11.97px 14.37px', background: '#272F43', borderRadius: '4.79px', border: '0.24px solid #A3A3A3', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '7.18px' }}>
              <div style={{ width: '193.87px', color: '#C0C3C9', fontSize: '15.56px', fontFamily: 'Actor', fontWeight: 400 }}>Tìm kiếm</div>
              <div style={{ width: '16.84px', height: '17.96px', position: 'relative' }}>
                <div style={{ width: '16.84px', height: '17.96px', position: 'absolute', borderRadius: '3.59px', border: '1.20px solid #515868' }}></div>
                <div style={{ width: '10.12px', height: '0px', position: 'absolute', left: '6.73px', top: '14.59px', transform: 'rotate(-71deg)', transformOrigin: 'top left', border: '1.20px solid #7A7D86' }}></div>
              </div>
            </div>
          </div>
          <div style={{ height: '35.76px', padding: '8.38px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
            <div style={{ color: '#171717', fontSize: '15.56px', fontFamily: 'Actor', fontWeight: 400 }}>Đăng nhập</div>
          </div>
          <div style={{ width: '93px', height: '33px', position: 'relative' }}>
            <div style={{ position: 'absolute', left: '9.58px', top: '7.78px', color: '#171717', fontSize: '15.56px', fontFamily: 'Actor', fontWeight: 400 }}>Đăng ký</div>
            <div style={{ width: '70.63px', height: '33.52px', position: 'absolute', borderRadius: '7.18px', border: '0.60px solid #9E9C9C' }}></div>
          </div>
        </div>
      </div>

      {/* Tiêu đề chính */}
      <div style={{ textAlign: 'center', color: 'black', fontSize: '64px', fontFamily: 'Actor', fontWeight: 400 }}>Hệ thống đặt lịch khám bệnh trực tuyến</div>
      <div style={{ width: '297px', height: '35px', background: 'white' }}></div>

      {/* Mô tả */}
      <div style={{ textAlign: 'center', color: '#171717', fontSize: '25px', fontFamily: 'Montserrat', fontWeight: 400 }}>Chủ động thời gian khám bệnh, đặt lịch trực tuyến nhanh chóng</div>
      <div style={{ width: '297px', height: '61px', background: 'white' }}></div>

      {/* Chuyên khoa */}
      <div style={{ color: 'black', fontSize: '48px', fontFamily: 'Actor', fontWeight: 400, paddingLeft: '10%' }}>Chuyên khoa</div>
      <div style={{ width: '297px', height: '61px', background: 'white' }}></div>

      {/* Danh sách chuyên khoa (lặp lại cho từng chuyên khoa) */}
      {[
        { name: 'Cơ xương khớp', image: 'https://cdn.bookingcare.vn/fo/2023/12/26/101627-co-xuong-khop.png' },
        { name: 'Thần kinh', image: 'https://cdn.bookingcare.vn/fo/w384/2023/12/26/101739-than-kinh.png' },
        { name: 'Tiêu hóa', image: 'https://cdn.bookingcare.vn/fo/w384/2023/12/26/101713-tieu-hoa.png' },
        { name: 'Tim mạch', image: 'https://cdn.bookingcare.vn/fo/w384/2023/12/26/101713-tim-mach.png' },
        { name: 'Tai mũi họng', image: 'https://cdn.bookingcare.vn/fo/w384/2023/12/26/101713-tai-mui-hong.png' },
        { name: 'Cột sống', image: 'https://cdn.bookingcare.vn/fo/w384/2023/12/26/101627-cot-song.png' },
        { name: 'Da liễu', image: 'https://cdn.bookingcare.vn/fo/w384/2023/12/26/101638-da-lieu.png' },
        { name: 'Nha khoa', image: 'https://cdn.bookingcare.vn/fo/2023/12/26/101655-nha-khoa.png' },
        { name: 'Hô hấp - Phổi', image: 'https://cdn.bookingcare.vn/fo/w384/2023/12/26/101638-ho-hap-phoi.png' },
        { name: 'Chuyên khoa mắt', image: 'https://cdn.bookingcare.vn/fo/w384/2023/12/26/101638-mat.png' },
        { name: 'Chấn thương chỉnh hình', image: 'https://cdn.bookingcare.vn/fo/w384/2023/12/26/101627-chan-thuong-chinh-hinh.png' },
        { name: 'Tư vấn, trị liệu Tâm lý', image: 'https://cdn.bookingcare.vn/fo/w384/2023/12/26/101739-tu-van-tam-ly.png' },
      ].map((specialty, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            width: '770px',
            height: '226px',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            gap: '23px',
            marginBottom: index === 0 ? '150px' : index === 1 ? '0' : index === 2 ? '10%' : '0',
            paddingLeft: '10%',
          }}
        >
          <div style={{ display: 'flex', width: '770px', height: '226px', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '23px', paddingLeft: '10%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ color: 'black', fontSize: '40px', fontFamily: 'Montserrat', fontWeight: 400 }}>{specialty.name}</div>
            </div>
            <div>
              <img style={{ width: '400px', height: '200px' }} src={specialty.image} alt={specialty.name} />
            </div>
            <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '10px' }}>
              <div style={{ width: '555px', height: '0px', border: '1px solid #00F0FF' }}></div>
            </div>
            <div style={{ padding: '10px 34px', borderRadius: '23.30px', border: '0.78px solid #00F0FF', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '10px' }}>
              <div style={{ width: '150.66px', height: '24px', position: 'relative' }}>
                <div style={{ position: 'absolute', color: '#171717', fontSize: '19.41px', fontFamily: 'Montserrat', fontWeight: 400 }}>Learn more</div>
                <div style={{ position: 'absolute', left: '132.02px', top: '2.33px' }}>
                  <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.12766 9.64894H15.5532M10.117 4.21277L15.5532 9.64894L10.117 15.0851" stroke="url(#paint0_linear_1_113)" strokeWidth="1.55319" strokeLinecap="round" strokeLinejoin="round"/>
                    <defs>
                      <linearGradient id="paint0_linear_1_113" x1="14.8723" y1="1.57705" x2="0.420244" y2="2.43428" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#00F0FF"/>
                        <stop offset="0.482483" stopColor="#5200FF"/>
                        <stop offset="1" stopColor="#FF2DF7"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Bác sĩ */}
      <div style={{ color: 'black', fontSize: '48px', fontFamily: 'Actor', fontWeight: 400, paddingLeft: '10%', marginTop: '15%' }}>Bác sĩ</div>
      <div style={{ width: '297px', height: '61px', background: 'white' }}></div>

      {/* Danh sách bác sĩ (lặp lại cho từng bác sĩ) */}
      {[
        { name: 'Bác sĩ Chuyên khoa I Võ Thị Thanh Vân', image: 'https://cdn.bookingcare.vn/fo/w256/2021/06/01/143859-bs-van.jpg', description: 'Hơn 35 năm kinh nghiệm trong khám và điều trị các bệnh lý Da liễu, đặc biệt là trị mụn, trị nám, trị sẹo\nTừng công tác nhiều năm tại Bệnh viện Da liễu TP.HCM\nTừng tu nghiệp tại Pháp\nThành phố Hồ Chí Minh' },
        { name: 'PGS. TS. BSCKII. TTUT Vũ Văn Hòe', image: 'https://cdn.bookingcare.vn/fo/w256/2024/02/02/144127-bs-hoe1.jpg', description: 'Bác sĩ có 35 năm kinh nghiệm về vực Cột sống, thần kinh, cơ xương khớp\nPhó chủ tịch hội Phẫu thuật cột sống Việt Nam\nBác sĩ nhận khám từ 7 tuổi trở lên\nThành phố Hà Nội' },
        { name: 'Giáo sư, Tiến sĩ Hà Văn Quyết', image: 'https://cdn.bookingcare.vn/fo/w256/2019/12/31/155650-gs-ha-van-quyet.jpg', description: 'Chuyên gia trên 35 năm kinh nghiệm trong lĩnh vực bệnh lý Tiêu hóa\nChuyên gia đầu ngành trong lĩnh vực bệnh lý Tiêu hóa\nNguyên Giám đốc Bệnh viện Đại học Y Hà Nội\nBác sĩ khám cho người bệnh từ 3 tuổi trở lên\nThành phố Hà Nội' },
        { name: 'Bác sĩ Chuyên khoa I Trần Thị Mỹ Nga', image: 'https://cdn.bookingcare.vn/fo/w256/2022/08/26/110357-bs-ngatrong-rang.jpg', description: 'Bác sĩ có hơn 20 năm kinh nghiệm học tập và làm việc về lĩnh vực Nha khoa, Niềng răng,...\nBác sĩ Răng Hàm Mặt từ Đại học Y Dược TP. HCM\nChuyên gia về: Niềng răng\nThành phố Hồ Chí Minh' },
        { name: 'Phó Giáo sư, Tiến sĩ, Bác sĩ Nguyễn Thị Hoài An', image: 'https://cdn.bookingcare.vn/fo/w256/2024/11/28/162057-pgs-hoai-an11.jpg', description: 'Nguyên Trưởng khoa Tai mũi họng trẻ em, Bệnh viện Tai Mũi Họng Trung ương\nTrên 25 năm công tác tại Bệnh viện Tai mũi họng Trung ương\nChuyên khám và điều trị các bệnh lý Tai Mũi Họng người lớn và trẻ em\nHà Nội' },
        { name: 'Thạc sĩ, Bác sĩ Nguyễn Văn Hiển', image: 'https://cdn.bookingcare.vn/fo/w256/2022/11/29/111302-bs-nguyen-van-hien.jpg', description: 'Hơn 10 năm kinh nghiệm điều trị bệnh lý suy giãn tĩnh mạch\nTốt nghiệp Đại học Y Thái Bình\nTốt nghiệp Thạc sĩ nội khoa Đại học Y Hà Nội\nThành phố Hồ Chí Minh' },
        { name: 'Bác sĩ Nguyễn Ngọc Nguyên', image: 'https://cdn.bookingcare.vn/fo/w256/2024/11/11/144416-anh-bs-nguyen-mat-sg-hn1.jpg', description: 'Bác sĩ có nhiều năm kinh nghiệm về chuyên khoa Mắt, Nhãn Nhi\nGiám đốc Chuyên môn, Bệnh viện Mắt Sài Gòn - Hà Nội\nBác sĩ nhận khám mọi lứa tuổi\nHà Nội' },
        { name: 'Bác sĩ Chuyên khoa II Lê Hồng Anh', image: 'https://cdn.bookingcare.vn/fo/w256/2020/07/16/103447-bs-hong-anh.jpg', description: 'Hơn 20 năm kinh nghiệm trong lĩnh vực Phổi và Lao\nTừng công tác nhiều năm tại Bệnh viện Phạm Ngọc Thạch\nBÁC SĨ NHẬN KHÁM BỆNH NHÂN TỪ 16 TUỔI TRỞ LÊN\nThành phố Hồ Chí Minh' },
        { name: 'Tiến sĩ, Bác sĩ Phạm Chí Lăng', image: 'https://cdn.bookingcare.vn/fo/w256/2021/04/07/174603-ts-bs-pham-chi-lang.jpg', description: 'Hơn 30 năm kinh nghiệm trong lĩnh vực Cơ xương khớp - Chấn thương chỉnh hình\nTừng công tác tại các bệnh viện lớn như: Bệnh viện Chợ Rẫy, Bệnh viện Chấn thương chỉnh hình TP.HCM, Bệnh viện Pháp Việt (FV)\nGiảng viên tại nhiều trường đại học y khoa nổi tiếng như: Đại học Y Dược TP.HCM, Đại học Y Phạm Ngọc Thạch, khoa Y trường Đại học Quốc Gia TP.HCM,...\nThành phố Hồ Chí Minh' },
        { name: 'Thạc sĩ Tâm lý Lê Thị Mỹ Giang', image: 'https://cdn.bookingcare.vn/fo/w256/2024/05/08/142123-anh-man-hinh-2024-05-08-luc-142113.png', description: 'Nhiều năm kinh nghiệm Tham vấn, Trị liệu Tâm lý tại các Trường học, Bệnh viện\nChuyên gia Tâm lý tại Phòng khám Hello Doctor\nChuyên gia có thế mạnh về Tham vấn Tâm lý Học đường\nThành phố Hồ Chí Minh' },
      ].map((doctor, index) => (
        <div key={index} style={{ paddingLeft: '10%' }}>
          <div style={{ width: '297px', height: '40px', background: 'white' }}></div>
          <div style={{ width: '1470px', height: '459px', position: 'relative' }}>
            <div style={{ width: '1470px', height: '459px', position: 'absolute', background: 'rgba(0, 0, 0, 0.20)', borderRadius: '20px' }}></div>
            <img style={{ width: '330px', height: '280px', position: 'absolute', left: '55px', top: '57.60px', boxShadow: '20px 30px 30px rgba(0, 0, 0, 0.25)', borderRadius: '50px' }} src={doctor.image} alt={doctor.name} />
            <div style={{ width: '1470px', height: '459px', padding: '50px 25px 50px 396px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '10px' }}>
              <div style={{ width: '1070px', height: '373px', position: 'relative' }}>
                <div style={{ width: '963px', height: '280px', position: 'absolute', left: '31px', top: '27px' }}>
                  <span style={{ color: 'black', fontSize: '32px', fontFamily: 'Inter', fontWeight: 400, lineHeight: '38.40px' }}>{doctor.name}</span>
                  <br />
                  <span style={{ color: '#7A4949', fontSize: '32px', fontFamily: 'Inter', fontWeight: 400, lineHeight: '38.40px' }}></span>
                  <span style={{ color: 'black', fontSize: '32px', fontFamily: 'Inter', fontWeight: 400, lineHeight: '38.40px' }}>{doctor.description.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Thông tin liên lạc */}
      <div style={{ paddingLeft: '10%' }}>
        <div style={{ width: '1470px', height: '565px', position: 'relative' }}>
          <div style={{ width: '1470px', height: '492.10px', position: 'absolute', left: '0px', top: '36.45px', background: 'rgba(0, 0, 0, 0.20)', borderRadius: '20px' }}></div>
          <div style={{ width: '345px', height: '47px', position: 'absolute', left: '527px', top: '75.78px', color: 'black', fontSize: '40px', fontFamily: 'Montserrat', fontWeight: 400 }}>Thông tin liên lạc</div>
          <div style={{ width: '548px', height: '48.92px', position: 'absolute', left: '460px', top: '249.41px' }}>
            <div style={{ width: '135px', height: '48.92px', position: 'absolute', left: '413px', top: '0px' }}>
              <div style={{ width: '135px', height: '48.92px', position: 'absolute', background: 'black', borderRadius: '50px', border: '1px solid rgba(128, 128, 128, 0.55)' }}></div>
              <div style={{ width: '63px', height: '23.02px', position: 'absolute', left: '26px', top: '13.43px', color: 'white', fontSize: '19.41px', fontFamily: 'Montserrat', fontWeight: 400 }}>Gửi</div>
              <div style={{ position: 'absolute', left: '80px', top: '15.35px' }}>
                <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.10645 9.69318H15.532M10.0958 4.47852L15.532 9.69318L10.0958 14.9078" stroke="#007AFF" strokeWidth="1.55319" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            <div style={{ width: '399px', height: '47.96px', padding: '10px 34px', position: 'absolute', left: '0px', top: '0.96px', background: 'rgba(255, 255, 255, 0.20)', borderRadius: '23.30px', border: '0.78px solid rgba(0, 0, 0, 0.20)', backdropFilter: 'blur(40px)', display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '10px' }}>
              <div style={{ width: '342px', color: 'black', fontSize: '19.41px', fontFamily: 'Montserrat', fontWeight: 400 }}>Nhập email tại đây</div>
            </div>
          </div>
          <div style={{ width: '589px', height: '565px', position: 'absolute', left: '15px', top: '0px', boxShadow: '70px 40px 50px rgba(0, 0, 0, 0.25)' }}></div>
        </div>

        {/* Footer */}
        <div style={{ width: '1470px', height: '35px', position: 'relative' }}>
          <div style={{ width: '1470px', height: '0px', position: 'absolute', border: '1px solid #00F0FF' }}></div>
          <div style={{ position: 'absolute', left: '0px', top: '11px', color: '#171717', fontSize: '19.41px', fontFamily: 'Montserrat', fontWeight: 400 }}>Copyright © 2025 by Username. All rights reserved.</div>
          <div style={{ position: 'absolute', left: '80%', top: '11px', color: '#171717', fontSize: '19.41px', fontFamily: 'Montserrat', fontWeight: 400 }}>Terms of Use & Privacy Policy</div>
        </div>
      </div>
    </div>
  );
}