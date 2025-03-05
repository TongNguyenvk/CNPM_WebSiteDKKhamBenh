import Image from 'next/image';
async function getSpecialties() {
  const res = await fetch("http://localhost:8080/api/specialties/", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

async function getDoctors() {
  const res = await fetch("http://localhost:8080/api/doctor", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

export default async function Home() {
  const specialties = await getSpecialties();
  const doctors = await getDoctors();

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", maxWidth: "1200px", margin: "auto", padding: "20px" }}>
      {/* Header */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 20px", backgroundColor: "#fff", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}>
        <img style={{ width: "50px" }} src="https://placehold.co/50x50" alt="Logo" />
        <ul style={{ display: "flex", listStyle: "none", gap: "20px", margin: 0, padding: 0 }}>
          <li><a href="/book-appointment" style={{ textDecoration: "none", color: "#171717" }}>Đặt lịch khám</a></li>
          <li><a href="/appointments" style={{ textDecoration: "none", color: "#171717" }}>Lịch hẹn</a></li>
          <li><a href="/contact" style={{ textDecoration: "none", color: "#171717" }}>Liên hệ</a></li>
        </ul>
      </nav>

      {/* Hero Section */}
      <div style={{ textAlign: "center", margin: "40px 0" }}>
        <h1 style={{ fontSize: "40px", fontFamily: "-moz-initial", color: "#000" }}>Hệ thống đặt lịch khám bệnh trực tuyến</h1>
        <p style={{ fontSize: "18px", fontFamily: "-moz-initial", color: "#000" }}>Chủ động thời gian khám bệnh, đặt lịch trực tuyến nhanh chóng</p>
      </div>

      {/* Chuyên khoa */}
      <h2 style={{ fontSize: "28px", marginBottom: "20px",color: "#000" }}>Chuyên khoa</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
        {specialties.map((specialty) => (
          <div key={specialty.id} style={{ background: "#f9f9f9", padding: "20px", borderRadius: "8px", textAlign: "center" }}>
            <img src= {specialty.image} alt={specialty.name} style={{ width: "300px", height: "300px", alignItems:"center" }} />
            <h3 style={{ fontSize: "20px", marginTop: "10px" , color:"#000"}}>{specialty.name}</h3>
            <a href="#" style={{ color: "#007BFF", textDecoration: "none" }}>Learn more →</a>
          </div>
        ))}
      </div>

      {/* Bác sĩ */}
      <h2 style={{ fontSize: "28px", marginTop: "40px", marginBottom: "20px",color: "#000" }}>Bác sĩ</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {doctors.map((doctor) => (
          <div key={doctor.id} style={{ display: "flex", background: "#f0f0f0", padding: "20px", borderRadius: "8px" }}>
            <img src={doctor.image} alt={doctor.name} style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover" }} />
            <div style={{ marginLeft: "20px" }}>
              <h3 style={{ fontSize: "20px" }}>{doctor.name}</h3>
              <p style={{ fontSize: "16px", color: "#555" }}>{doctor.specialty}</p>
              <p style={{ fontSize: "14px", color: "#777" }}>abc{doctor.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Thông tin liên lạc */}
      <div style={{ textAlign: "center", marginTop: "40px", padding: "20px", background: "#f9f9f9", borderRadius: "8px" }}>
        <h2 style={{ fontSize: "24px",color: "#000" }}>Thông tin liên lạc</h2>
        <input type="email" placeholder="Nhập email của bạn" style={{ padding: "10px", width: "250px", borderRadius: "5px", border: "1px solid #ccc" }} />
        <button style={{ padding: "10px 20px", marginLeft: "10px", background: "black", color: "white", border: "none", borderRadius: "5px" }}>Gửi</button>
      </div>
    </div>
  );
}





// async function getSpecialties() {
//   const res = await fetch("http://localhost:8080/api/specialties/", { cache: "no-store" }); // Thay API thật
//   if (!res.ok) throw new Error("Failed to fetch");
//   return res.json();
// }
// async function getdoctor() {
//   const res = await fetch("http://localhost:8080/api/doctor", { cache: "no-store" }); // Thay API thật
//   if (!res.ok) throw new Error("Failed to fetch");
//   return res.json();
// }
// export default async function Home() {
//   const specialties = await getSpecialties();
//   const doctor = await getdoctor();

//   return (
//     <div>
//       {/* Header */}
//       <nav style={{ width: "1850px", height: "85px", padding: "9.58px", display: "flex", justifyContent: "center", alignItems: "center", gap: "450px", backgroundColor: "#fff", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}>
//         <div style={{ height: "63px", display: "flex", justifyContent: "flex-start", alignItems: "center", gap: "56px" }}>
//           {/* Logo */}
//           <img style={{ width: "63px", height: "63px" }} src="https://placehold.co/63x63" alt="Logo" />

//           {/* Danh sách menu */}
//           <ul style={{ display: "flex", listStyle: "none", gap: "50px", margin: 0, padding: 0 }}>
//             <li><a href="/book-appointment" style={{ textDecoration: "none", color: "#171717", fontSize: "15.56px", fontFamily: "Actor", fontWeight: 400 }}>Đặt lịch khám</a></li>
//             <li><a href="/appointments" style={{ textDecoration: "none", color: "#171717", fontSize: "15.56px", fontFamily: "Actor", fontWeight: 400 }}>Lịch hẹn</a></li>
//             <li><a href="/contact" style={{ textDecoration: "none", color: "#171717", fontSize: "15.56px", fontFamily: "Actor", fontWeight: 400 }}>Liên hệ</a></li>
//           </ul>
//         </div>
//       </nav>


//       {/* Tiêu đề chính */}
//       <div style={{ textAlign: "center", color: "black", fontSize: "64px", fontFamily: "Actor", fontWeight: 400 }}>Hệ thống đặt lịch khám bệnh trực tuyến</div>

//       {/* Mô tả */}
//       <div style={{ textAlign: "center", color: "#171717", fontSize: "25px", fontFamily: "Montserrat", fontWeight: 400 }}>Chủ động thời gian khám bệnh, đặt lịch trực tuyến nhanh chóng</div>

//       {/* Chuyên khoa */}
//       <div style={{ color: "black", fontSize: "48px", fontFamily: "Actor", fontWeight: 400, paddingLeft: "10%" }}>Chuyên khoa</div>

//       {/* Danh sách chuyên khoa từ API */}
//       {specialties.map((specialty: { id: number; name: string; image: string }) => (
//         <div
//           key={specialty.id}
//           style={{
//             display: "flex",
//             width: "500px",
//             height: "226px",
//             flexDirection: "column",
//             //justifyContent: "center",
//             alignItems: "flex-start",
//             gap: "23px",
//             marginBottom: "50px",
//             paddingLeft: "10%",
//           }}
//         >
//           <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "12px" }}>
//             <div style={{ color: "black", fontSize: "40px", fontFamily: "Montserrat", fontWeight: 400 }}>{specialty.name}</div>
//           </div>
//           <div>
//             <img style={{ width: "400px", height: "200px" }} src={specialty.image} alt={specialty.name} />
//           </div>
//           <div style={{ padding: "10px", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "10px" }}>
//             <div style={{ width: "555px", height: "0px", border: "1px solid #00F0FF" }}></div>
//           </div>
//           <div style={{ padding: "10px 34px", borderRadius: "23.30px", border: "0.78px solid #00F0FF", display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: "10px" }}>
//             <div style={{ width: "150.66px", height: "24px", position: "relative" }}>
//               <div style={{ position: "absolute", color: "#171717", fontSize: "19.41px", fontFamily: "Montserrat", fontWeight: 400 }}>Learn more</div>
//               <div style={{ position: "absolute", left: "132.02px", top: "2.33px" }}>
//                 <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
//                   <path d="M3.12766 9.64894H15.5532M10.117 4.21277L15.5532 9.64894L10.117 15.0851" stroke="url(#paint0_linear_1_113)" strokeWidth="1.55319" strokeLinecap="round" strokeLinejoin="round" />
//                   <defs>
//                     <linearGradient id="paint0_linear_1_113" x1="14.8723" y1="1.57705" x2="0.420244" y2="2.43428" gradientUnits="userSpaceOnUse">
//                       <stop stopColor="#00F0FF" />
//                       <stop offset="0.482483" stopColor="#5200FF" />
//                       <stop offset="1" stopColor="#FF2DF7" />
//                     </linearGradient>
//                   </defs>
//                 </svg>
//               </div>
//             </div>
//           </div>

//         </div>
//       ))}
//     </div>


//   );
// }
