'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

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
    console.log('Đã gửi:', formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '' });

    // Tự động đóng modal sau 1.5s
    setTimeout(() => {
      router.push('/');
    }, 1500);
  };

  const handleClose = () => {
    router.push('/home');
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="relative bg-white shadow-2xl rounded-2xl p-8 w-full max-w-xl mx-4"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        transition={{ duration: 0.3 }}
      >
        {/* Nút đóng */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
          title="Đóng form"
        >
          ✖
        </button>

        <h1 className="text-3xl font-bold text-blue-600 mb-4 text-center">Liên hệ với chúng tôi</h1>
        <p className="text-gray-600 mb-6 text-center">
          Nếu bạn có bất kỳ câu hỏi nào, vui lòng để lại thông tin bên dưới.
        </p>

        {submitted && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4 text-center">
            ✅ Đã gửi thông tin liên hệ thành công! Đang quay về trang chủ...
          </div>
        )}

        {!submitted && (
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
        )}
      </motion.div>
    </motion.div>
  );
};

export default ContactPage;
