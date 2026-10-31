import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://lnmiitplacementintelligence.vercel.app'),
  title: 'LNMIIT Placement Intelligence',
  description:
    'Explore LNMIIT Jaipur placement outcomes, batch-wise analytics, recruiter records, and historical trends with source-linked data.',
  openGraph: {
    title: 'LNMIIT Placement Intelligence',
    description:
      'Explore LNMIIT Jaipur placement outcomes, recruiter records, and historical placement trends.',
    url: 'https://lnmiitplacementintelligence.vercel.app',
    siteName: 'LNMIIT Placement Intelligence',
    locale: 'en_IN',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LNMIIT Placement Intelligence',
    description:
      'Explore LNMIIT Jaipur placement outcomes, recruiter records, and historical placement trends.'
  },
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
