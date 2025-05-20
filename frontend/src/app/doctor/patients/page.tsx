'use client';

import { useEffect, useState } from 'react';
import { getDoctorPatients } from '../../lib/api';  

interface Patient {
  id: number;
  name: string;
  // thêm các field cần thiết nếu có
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await getDoctorPatients();
        setPatients(response);
      } catch (error: unknown) {
        const err = error as Error;
        setError(err.message || 'Lỗi khi tải danh sách bệnh nhân');
      }
    };

    fetchPatients();
  }, []);

  return (
    <div>
      <h1>Danh sách bệnh nhân</h1>
      {error && <p>{error}</p>}
      <ul>
        {patients.map((patient) => (
          <li key={patient.id}>{patient.name}</li>
        ))}
      </ul>
    </div>
  );
}
