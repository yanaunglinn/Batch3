import './globals.css';

export const metadata = {
  title: 'Booking Management',
  description: 'Manage Level Placement Test bookings',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
