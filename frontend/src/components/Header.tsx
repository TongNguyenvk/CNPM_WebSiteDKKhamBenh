import { useAuth } from '@/hooks/useAuth';

export function Header() {
    const { user } = useAuth();

    return (
        <header className="bg-white shadow-sm">
            <div className="px-6 py-4 flex justify-between items-center">
                <h1 className="text-xl font-semibold">Hệ thống quản lý khám bệnh</h1>
                <div className="flex items-center space-x-4">
                    <span>{user?.firstName} {user?.lastName}</span>
                </div>
            </div>
        </header>
    );
} 