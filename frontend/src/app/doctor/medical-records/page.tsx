try {
    const response = await getMedicalRecords();
    setMedicalRecords(response);
} catch (error: unknown) {
    const err = error as Error;
    setError(err.message || 'Lỗi khi tải hồ sơ bệnh án');
} 