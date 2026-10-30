import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LNMIIT Placement Intelligence — Official Audited Records & Analytics',
  description:
    'Comprehensive historical and real-time placement analytics for The LNM Institute of Information Technology (LNMIIT), Jaipur. Verified records from 2007 to present.',
  keywords: [
    'LNMIIT',
    'LNMIIT Placements',
    'Jaipur',
    'Placement Statistics',
    'Highest Package',
    'Average Package',
    'CSE Placements',
    'Recruiting Companies'
  ]
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
