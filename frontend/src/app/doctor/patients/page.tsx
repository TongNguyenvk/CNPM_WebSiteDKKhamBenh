try {
    const response = await getDoctorPatients();
    setPatients(response);
} catch (error: unknown) {
    const err = error as Error;
    setError(err.message || 'Lỗi khi tải danh sách bệnh nhân');
} 