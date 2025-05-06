import { redirect } from 'next/navigation';

// Trang landing/home
export default function HomePage() {
    redirect('/auth/login');
    return null;
} 