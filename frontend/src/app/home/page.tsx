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


  useEffect(() => {
    fetchData("http://localhost:8080/api/specialties/").then(setSpecialties);
    fetchData("http://localhost:8080/api/doctor").then(setDoctors);
  }, []);

  return (
    <div style={{ fontFamily: "Montserrat, sans-serif", maxWidth: "1600px", margin: "auto", padding: "20px", color: "black" }}>
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

        {/* Menu */}
        <ul style={{ display: "flex", listStyle: "none", gap: "20px", margin: 0, padding: 0 }}>
          <li style={{ marginLeft: "60px" }}><a href="/appointments">Lịch hẹn</a></li>
          <li style={{ marginLeft: "60px" }}><a href="/book-appointment">Đặt lịch khám</a></li>
          <li style={{ marginLeft: "60px" }}><a href="/contact">Liên hệ</a></li>
          <li style={{ marginLeft: "60px", marginRight: "40px" }}><a href="/profile">Tôi</a></li>
        </ul>
      </nav>


      {/* Hero Section */}
      <div style={{ textAlign: "center", margin: "40px 0" }}>
        <h1 style={{ fontSize: "50px" }}>Hệ thống đặt lịch khám bệnh trực tuyến</h1>
        <br></br>
        <p style={{ fontFamily: "revert-layer" }}>Chủ động thời gian khám bệnh, đặt lịch trực tuyến nhanh chóng</p>
      </div>

      {/* Chuyên khoa */}
      <h2 style={{ color: "#000", fontSize: "30px" }}>Chuyên khoa</h2><br></br>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "30px" }}>
        {specialties.map((specialty: any) => (
          <a key={specialty.id} href={`/home/${specialty.id}`}
            style={{
              textDecoration: "none", color: "#000", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 10px rgba(27, 25, 25, 0.1)", textAlign: "center",
              transition: "transform 0.2s",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "#fff"
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <img src={specialty.image} alt={specialty.name} style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "10px" }} />
            <h3 style={{ marginTop: "10px", fontSize: "18px" }}>{specialty.name}</h3><br></br>
            <div style={{ width: "80%", height: "0px", border: "1px solid #00F0FF" }}></div><br></br>
            {<p href={`/home/${specialty.id}`} style={{ alignItems: "center", gap: "8px", padding: "10px 20px", border: "2px solid cyan", borderRadius: "30px", textDecoration: "none", color: "black", fontSize: "16px", transition: "all 0.3s ease", display: "inline-flex" }}>Xem thêm
              <span style={{ color: "blue", fontSize: "20px" }}>→</span>
            </p>}
          </a>
        ))}
      </div>


      {/* Bác sĩ */}
      <h2 style={{ marginTop: "40px", fontSize: "30px", color: "black" }}>Bác sĩ</h2>
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
      <footer style={{ textAlign: "center", marginTop: "40px", padding: "20px", background: "#ccc", color: "#fff", borderRadius: "12px" }}>
        <h2 style={{ fontSize: "30px" }}>Thông tin liên lạc</h2>
        <div style={{ marginTop: "15px", display: "flex", justifyContent: "center", gap: "10px" }}>
          <input type="email" placeholder="Nhập email của bạn" style={{ padding: "10px", width: "300px", borderRadius: "8px", border: "1px solid #ccc", color: "#000" }} />
          <button style={{ padding: "10px", background: "#00bfff", color: "#000", border: "none", borderRadius: "8px", cursor: "pointer" }}>Gửi</button>
        </div><br></br>
        <p style={{ fontSize: "14px", opacity: 0.8 }}>© {new Date().getFullYear()} Website đặt lịch khám bệnh trực tuyến.</p>
      </footer>
    </div>
  );
}


