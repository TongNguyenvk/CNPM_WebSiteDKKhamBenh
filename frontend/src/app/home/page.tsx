"use client";
import { useEffect, useState } from "react";

async function fetchData(url: string) {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch");
    return await res.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

export default function Home() {
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState(""); // State cho tìm kiếm

  useEffect(() => {
    fetchData("http://localhost:8080/api/specialties/").then(setSpecialties);
    fetchData("http://localhost:8080/api/doctor").then(setDoctors);
  }, []);

  // Lọc chuyên khoa theo từ khóa
  const filteredSpecialties = search
    ? specialties.filter((specialty: any) =>
        specialty.name.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", maxWidth: "1600px", margin: "auto", padding: "20px", color:"black" }}>
      {/* Navbar */}
      <nav style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 20px",
          backgroundColor: "#fff",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Logo */}
        <img style={{ width: "80px" }} src="https://phuongnamvina.com/img_data/images/logo-benh-vien.jpg" alt="Logo" />

        {/* Thanh tìm kiếm - căn giữa */}
        <div style={{ flex: 1, display: "flex", justifyContent:"flex-end" }}>
          <input type="text" placeholder="Tìm kiếm..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              width: "250px",
            }}
          />
        </div>

        {/* Menu */}
        <ul style={{ display: "flex", listStyle: "none", gap: "20px", margin: 0, padding: 0 }}>
          <li style={{marginLeft:"60px"}}><a href="/appointments">Lịch hẹn</a></li>
          <li style={{marginLeft:"60px"}}><a href="/book-appointment">Đặt lịch khám</a></li>
          <li style={{marginLeft:"60px"}}><a href="/contact">Liên hệ</a></li>
          <li style={{marginLeft:"60px", marginRight:"40px"}}><a href="#">Tôi</a></li>
        </ul>
      </nav>


      {/* Hero Section */}
      <div style={{ textAlign: "center", margin: "40px 0" }}>
        <h1 style={{fontSize:"50px"}}>Hệ thống đặt lịch khám bệnh trực tuyến</h1>
        <br></br>
        <p style={{fontFamily:"revert-layer"}}>Chủ động thời gian khám bệnh, đặt lịch trực tuyến nhanh chóng</p>
      </div>

      {/* Chuyên khoa (Chỉ hiển thị khi có tìm kiếm) */}
      {search && (
        <>
          <h2 style={{fontSize:"30px"}}>Kết quả tìm kiếm</h2><br></br>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
            {filteredSpecialties.map((specialty: any) => (
              <a
                key={specialty.id}
                href={`/home/${specialty.id}`}
                style={{
                  textAlign: "center",
                  padding: "20px",
                  borderRadius: "10px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  textDecoration: "none",
                  color: "black",
                }}
              >
                <img src={specialty.image} alt={specialty.name} style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "10px" }} />
                <h3>{specialty.name}</h3><br></br>
                {<p href={`/home/${specialty.id}`} style={{ alignItems: "center", gap: "8px", padding: "10px 20px", border: "2px solid cyan", borderRadius: "30px", textDecoration: "none", color: "black", fontSize: "16px", transition: "all 0.3s ease", display: "inline-flex" }}>Nhấn để xem
                 <span style={{ color: "blue", fontSize: "20px" }}>→</span>
               </p>}
              </a>
            ))}
          </div>
          <br></br><br></br>
        </>
      )}


            {/* Chuyên khoa */}
            <h2 style={{ color: "#000", fontSize:"30px" }}>Chuyên khoa</h2><br></br>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "30px" }}>
        {specialties.map((specialty: any) => (
          <a 
            key={specialty.id} 
            href={`/home/${specialty.id}`} 
            style={{
              textDecoration: "none",
              color: "#000",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 2px 10px rgba(27, 25, 25, 0.1)",
              textAlign: "center",
              transition: "transform 0.2s",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "#fff"
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <img  src={specialty.image} alt={specialty.name} style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "10px" }} />
            <h3 style={{ marginTop: "10px", fontSize: "18px" }}>{specialty.name}</h3><br></br>
            <div style={{ width: "80%", height: "0px", border: "1px solid #00F0FF" }}></div><br></br>
            {<p href={`/home/${specialty.id}`} style={{ alignItems: "center", gap: "8px", padding: "10px 20px", border: "2px solid cyan", borderRadius: "30px", textDecoration: "none", color: "black", fontSize: "16px", transition: "all 0.3s ease", display: "inline-flex" }}>Xem thêm
                 <span style={{ color: "blue", fontSize: "20px" }}>→</span>
               </p>}
          </a>
        ))}
      </div>


      {/* Bác sĩ */}
      <h2 style={{ marginTop: "40px", fontSize:"30px" }}>Bác sĩ</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
        {doctors.map((doctor: any) => (
          <div key={doctor.id} style={{ display: "flex", alignItems: "center", background: "#f0f0f0", padding: "15px", borderRadius: "8px" }}>
            <img src={doctor.image} alt={doctor.name} style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover" }} />
            <div style={{ marginLeft: "15px" }}>
              <h3>{doctor.name}</h3>
              <p style={{ fontSize: "14px", color: "#555" }}>{doctor.specialty}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer style={{ textAlign: "center", marginTop: "40px", padding: "20px", background: "#222", color: "#fff", borderRadius: "12px" }}>
        <h2>Thông tin liên lạc</h2>
        <div style={{ marginTop: "15px", display: "flex", justifyContent: "center", gap: "10px" }}>
          <input type="email" placeholder="Nhập email của bạn" style={{ padding: "10px", width: "250px", borderRadius: "8px", border: "1px solid #ccc" }} />
          <button style={{ padding: "10px", background: "#00bfff", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" }}>Gửi</button>
        </div>
        <p style={{ fontSize: "14px", opacity: 0.8 }}>© {new Date().getFullYear()} Website đặt lịch khám bệnh trực tuyến.</p>
      </footer>
    </div>
  );
}










// 'use client';
// import Image from 'next/image';
// //import { useState } from "react";
// import React from "react";


// async function getSpecialties() {
//   const res = await fetch("http://localhost:8080/api/specialties/", { cache: "no-store" });
//   if (!res.ok) throw new Error("Failed to fetch");
//   return res.json();
// }

// async function getDoctors() {
//   const res = await fetch("http://localhost:8080/api/doctor", { cache: "no-store" });
//   if (!res.ok) throw new Error("Failed to fetch");
//   return res.json();
// }

// export default async function Home() {
//   const specialties = await getSpecialties();
//   const doctors = await getDoctors();

//   return (
//     <div style={{ fontFamily: "Montserrat, sans-serif", maxWidth: "1500px", margin: "auto", padding: "20px" }}>
//       {/* Header */}
//       <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 20px", backgroundColor: "#fff", boxShadow: "0 4px 6px rgba(41, 40, 40, 0.1)" }}>
//         <img style={{ width: "80px" }} src="https://phuongnamvina.com/img_data/images/logo-benh-vien.jpg" alt="Logo" />
//         <ul style={{ display: "flex", listStyle: "none", gap: "100px", margin: 0, padding: 0, paddingRight: "50px" }}>
//           <li><a href="/book-appointment" style={{ textDecoration: "none", color: "#171717", fontFamily: "unset" }}>Đặt lịch khám</a></li>
//           <li><a href="/appointments" style={{ textDecoration: "none", color: "#171717", fontFamily: "unset" }}>Lịch hẹn</a></li>
//           <li><a href="/contact" style={{ textDecoration: "none", color: "#171717", fontFamily: "unset" }}>Liên hệ</a></li>
//           <li><a href="#" style={{ textDecoration: "none", color: "#171717", fontFamily: "unset", gap: "50px" }}>Tôi</a></li>
//         </ul>
//       </nav>

//       {/* Hero Section */}
//       <div style={{ textAlign: "center", margin: "40px 0" }}>
//         <h1 style={{ fontSize: "40px", fontFamily: "unset", color: "#000" }}>Hệ thống đặt lịch khám bệnh trực tuyến</h1>
//         <p style={{ fontSize: "18px", fontFamily: "unset", color: "#000" }}>Chủ động thời gian khám bệnh, đặt lịch trực tuyến nhanh chóng</p>
//       </div>

//       {/* Chuyên khoa */}
//       <h2 style={{ fontSize: "28px", marginBottom: "20px", color: "#000" }}>Chuyên khoa</h2>
//       <a href="#">

//         <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
//           {specialties.map((specialty) => (
//             <div key={specialty.id} style={{ padding: "20px", borderRadius: "20px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
//               <img src={specialty.image} alt={specialty.name} style={{ width: "300px", height: "300px", objectFit: "cover" }} />
//               <h3 style={{ fontSize: "20px", marginTop: "10px", color: "#000" }}>{specialty.name}</h3>
//               <div style={{ height: "1px", backgroundColor: "cyan", width: "100%", margin: "20px auto" }}></div>
//               {<a href={`/home/${specialty.id}`} style={{ alignItems: "center", gap: "8px", padding: "10px 20px", border: "2px solid cyan", borderRadius: "30px", textDecoration: "none", color: "black", fontSize: "16px", transition: "all 0.3s ease", display: "inline-flex" }}>Xem thêm
//                 <span style={{ color: "blue", fontSize: "20px" }}>→</span>
//               </a>}

//             </div>
//           ))}
//         </div>
//       </a>


//       {/* Bác sĩ */}
//       <h2 style={{ fontSize: "28px", marginTop: "40px", marginBottom: "20px", color: "#000" }}>Bác sĩ</h2>
//       <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
//         {doctors.map((doctor) => (
//           <div key={doctor.id} style={{ display: "flex", background: "#f0f0f0", padding: "20px", borderRadius: "8px" }}>
//             <img src={doctor.image} alt={doctor.name} style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover" }} />
//             <div style={{ marginLeft: "20px" }}>
//               <h3 style={{ fontSize: "20px" }}>{doctor.name}</h3>
//               <p style={{ fontSize: "16px", color: "#555" }}>{doctor.specialty}</p>
//               <p style={{ fontSize: "14px", color: "#777" }}>{doctor.description}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Thông tin liên lạc */}
      

        
//           {/* Footer */}
//         <footer style={{ 
//           textAlign: "center", 
//           marginTop: "40px", 
//           padding: "30px", 
//           background: "#222", 
//           color: "#fff", 
//           borderRadius: "12px",
//           boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
//           maxWidth: "600px",
//           marginLeft: "auto",
//           marginRight: "auto"
//         }}>
//           <h2 style={{ fontSize: "22px", color: "#f8f8f8", fontWeight: "bold" }}>
//             Thông tin liên lạc
//           </h2>
          
//           <div style={{ marginTop: "15px", display: "flex", justifyContent: "center", gap: "10px" }}>
//             <input 
//               type="email" 
//               placeholder="Nhập email của bạn" 
//               style={{ 
//                 padding: "12px", 
//                 width: "250px", 
//                 borderRadius: "8px", 
//                 border: "1px solid #ccc", 
//                 outline: "none",
//                 fontSize: "14px",
//                 color:"darkred"
//               }} 
//             />
//             <button 
//               style={{ 
//                 padding: "12px 18px", 
//                 background: "#00bfff", 
//                 color: "#fff", 
//                 border: "none", 
//                 borderRadius: "8px", 
//                 fontSize: "14px",
//                 fontWeight: "bold",
//                 cursor: "pointer",
//                 transition: "0.3s"
//               }}
//               onMouseOver={(e) => e.currentTarget.style.background = "#0099cc"}
//               onMouseOut={(e) => e.currentTarget.style.background = "#00bfff"}
//             >
//               Gửi
//             </button>
//           </div>

//           <hr style={{ margin: "20px 0", borderColor: "#444" }} />

//           <p style={{ fontSize: "14px", opacity: 0.8 }}>
//             © {new Date().getFullYear()}  Website đặt lịch khám bệnh trực tuyến.
//           </p>
//         </footer>

      
//       </div>
      
//   );
// }





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
