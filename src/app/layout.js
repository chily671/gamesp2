import "./globals.css";

export const metadata = {
  title: "DATA TRAP — The Digital Identity RPG",
  description:
    "Bước vào thế giới dữ liệu, khám phá những chiếc bẫy kỹ thuật số và bảo vệ danh tính số của bạn.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="vi"
      className="h-full antialiased"
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
