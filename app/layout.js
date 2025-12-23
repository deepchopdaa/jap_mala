import "./globals.css";

export const metadata = {
  title: "Mantra Japa Counter",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}