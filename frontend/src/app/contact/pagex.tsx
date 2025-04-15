'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const ContactPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ở đây có thể gọi API nếu muốn
    console.log('Đã gửi:', formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '' });

    // Ví dụ chuyển trang sau khi gửi
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-white p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-xl w-full">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">Liên hệ với chúng tôi</h1>
        <p className="text-gray-600 mb-6">
          Nếu bạn có bất kỳ câu hỏi nào, vui lòng để lại thông tin bên dưới.
        </p>

        {submitted && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4">
            ✅ Đã gửi thông tin liên hệ thành công!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung</label>
            <textarea
              name="message"
              rows={4}
              required
              value={formData.message}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition-all duration-200"
          >
            Gửi liên hệ
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
