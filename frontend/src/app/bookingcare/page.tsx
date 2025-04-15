import { Suspense } from "react";
import BookingCarePage from "./BookingCarePage";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Đang tải trang đặt lịch...</div>}>
      <BookingCarePage />
    </Suspense>
  );
}
