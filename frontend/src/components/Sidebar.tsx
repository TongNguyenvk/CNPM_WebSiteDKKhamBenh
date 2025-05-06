import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MenuItem {
    title: string;
    path: string;
    icon: string;
}

interface SidebarProps {
    menuItems: MenuItem[];
}

export function Sidebar({ menuItems }: SidebarProps) {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-white shadow-md">
            <div className="p-4">
                <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
                <nav>
                    <ul className="space-y-2">
                        {menuItems.map((item) => (
                            <li key={item.path}>
                                <Link
                                    href={item.path}
                                    className={`flex items-center p-2 rounded hover:bg-gray-100 ${pathname === item.path ? 'bg-gray-100' : ''
                                        }`}
                                >
                                    <span className="mr-2">{item.icon}</span>
                                    {item.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </aside>
    );
} 