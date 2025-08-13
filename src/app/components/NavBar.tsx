// app/components/Nav.tsx
"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';

const navLinks = [
  { href: '/', label: 'Fetch' },
  { href: '/helper', label: 'FAQ' },
  { href: '/about', label: 'chatAI' },
  { href: '/contact', label: 'plugin' },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav style={{ display: 'flex', gap: '30px' }}>
      {navLinks.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className="nav-link"
          style={{
            color: pathname === href ? '#ffd700' : '#eaeaea',
            fontWeight: pathname === href ? 'bold' : 'normal',
            textDecoration: 'none',
          }}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}