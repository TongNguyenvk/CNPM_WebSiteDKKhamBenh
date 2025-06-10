import './globals.css';

export const metadata = {
    title: 'Phòng Khám - Hệ thống đặt lịch khám bệnh',
    description: 'Hệ thống đặt lịch khám bệnh trực tuyến hiện đại và tiện lợi',
    keywords: 'phòng khám, đặt lịch khám, bác sĩ, chuyên khoa, sức khỏe',
    authors: [{ name: 'Phòng Khám Team' }],
    viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="vi" className="scroll-smooth">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </head>
            <body className="min-h-screen bg-neutral-50 font-sans antialiased">
                <div id="root">
                    {children}
                </div>
                <div id="modal-root"></div>
                <div id="toast-root"></div>
            </body>
        </html>
    );
}