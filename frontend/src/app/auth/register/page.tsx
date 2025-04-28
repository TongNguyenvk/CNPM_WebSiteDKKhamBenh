'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/lib/api';

// Trang đăng ký (bệnh nhân, admin)
export default function RegisterPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await registerUser({
                email,
                password,
                firstName,
                lastName,
            });

            // Điều hướng dựa vào role từ backend
            // Giả sử roleId trong database là: R1 (admin), R2 (doctor), R3 (patient)
            switch (response.role) {
                case 'R1': // Admin
                    router.push('/admin/dashboard');
                    break;
                case 'R2': // Doctor
                    router.push('/doctor/dashboard');
                    break;
                case 'R3': // Patient
                    router.push('/patient/dashboard');
                    break;
                default:
                    router.push('/');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="form-container">
                <h1 className="text-2xl font-bold text-center mb-6">Đăng ký</h1>
                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                        {error}
                    </div>
                )}
                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Họ"
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                            required
                            className="form-input"
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder="Tên"
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                            required
                            className="form-input"
                        />
                    </div>
                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            className="form-input"
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Mật khẩu"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            className="form-input"
                        />
                    </div>
                    <button
                        type="submit"
                        className="form-button"
                        disabled={loading}
                    >
                        {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                    </button>
                </form>
                <p className="mt-4 text-center">
                    Đã có tài khoản?{' '}
                    <a href="/auth/login" className="form-link">
                        Đăng nhập
                    </a>
                </p>
            </div>
        </div>
    );
} 