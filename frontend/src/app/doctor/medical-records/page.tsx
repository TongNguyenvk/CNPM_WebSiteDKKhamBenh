'use client';

import React, { useEffect, useState } from 'react';
import { getMedicalRecords } from '../../lib/api';

interface MedicalRecord {
  id: number;
  patientName: string;
  diagnosis: string;
  // thêm các trường khác nếu cần
}

export default function MedicalRecordsPage() {
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await getMedicalRecords();
        setMedicalRecords(response);
      } catch (error: unknown) {
        const err = error as Error;
        setError(err.message || 'Lỗi khi tải hồ sơ bệnh án');
      }
    };

    fetchRecords();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Hồ sơ bệnh án</h1>

      {error && <div className="text-red-500">{error}</div>}

      <ul className="space-y-2">
        {medicalRecords.map((record) => (
          <li key={record.id} className="border p-2 rounded shadow">
            <p><strong>Bệnh nhân:</strong> {record.patientName}</p>
            <p><strong>Chẩn đoán:</strong> {record.diagnosis}</p>
            {/* Hiển thị các trường khác nếu cần */}
          </li>
        ))}
      </ul>
    </div>
  );
}
