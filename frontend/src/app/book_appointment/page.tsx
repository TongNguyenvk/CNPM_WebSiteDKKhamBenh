"use client";

import { Suspense } from 'react';
import BookAppointmentPageInner from './BookAppointmentPageInner';

export default function BookAppointmentPage() {
    return (
        <Suspense fallback={<div>Đang tải...</div>}>
            <BookAppointmentPageInner />
        </Suspense>
    );
} 