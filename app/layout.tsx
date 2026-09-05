import type { Metadata } from 'next';
import './globals.css';
import '@/components/site-shell.css';
import { Header, Footer } from '@/components/site-shell';
export const metadata: Metadata = {metadataBase:new URL('https://irrivo.com'),title:{default:'IRRIVO — Real-Time Workforce Operating System',template:'%s | IRRIVO'},description:'IRRIVO connects scheduling, attendance, geofencing, workforce analytics and AI to help organizations understand and manage their workforce in real time.',alternates:{canonical:'/'},openGraph:{type:'website',siteName:'IRRIVO',title:'IRRIVO — Real-Time Workforce Operating System',description:'Run your workforce in real time.',url:'https://irrivo.com'},twitter:{card:'summary',title:'IRRIVO — Real-Time Workforce Operating System',description:'Run your workforce in real time.'}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body><a className="skip-link" href="#main">Skip to content</a><Header/>{children}<Footer/></body></html>}
