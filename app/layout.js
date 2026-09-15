import './globals.css';

export const metadata = {
  title: 'Blue Range Scalping',
  description: 'Automated NQ trading control cockpit',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
