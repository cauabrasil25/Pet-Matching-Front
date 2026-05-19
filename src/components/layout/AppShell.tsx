'use client';

import Link from 'next/link';
import { useEffect, useState, type ReactNode } from 'react';
import { getCurrentUser } from '../../services/authService';
import type { UsuarioResponse } from '../../types/auth';

type ActionLink = {
  label: string;
  href: string;
};

type AppShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  primaryAction?: ActionLink;
  secondaryAction?: ActionLink;
  showNavigation?: boolean;
};

type UserRole = UsuarioResponse['role'];

export function AppShell({
  eyebrow,
  title,
  description,
  children,
  primaryAction,
  secondaryAction,
  showNavigation = true
}: AppShellProps) {
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);
  const [sessionLoaded, setSessionLoaded] = useState(false);

  useEffect(() => {
    const syncCurrentUser = () => {
      setCurrentRole(getCurrentUser()?.role ?? null);
      setSessionLoaded(true);
    };

    syncCurrentUser();
    window.addEventListener('storage', syncCurrentUser);
    window.addEventListener('focus', syncCurrentUser);

    return () => {
      window.removeEventListener('storage', syncCurrentUser);
      window.removeEventListener('focus', syncCurrentUser);
    };
  }, []);

  const showAdotanteLink = sessionLoaded && currentRole !== 'ABRIGO';
  const showAbrigoLink = sessionLoaded && currentRole !== 'ADOTANTE';

  return (
    <div className="app-frame">
      <header className="app-header">
        <div className="app-heading">
          <span className="brand-mark">PM</span>
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h1 className="page-title">{title}</h1>
            <p className="page-description">{description}</p>
          </div>
        </div>
        {primaryAction || secondaryAction ? (
          <div className="app-actions">
            {primaryAction ? (
              <Link className="button" href={primaryAction.href}>
                {primaryAction.label}
              </Link>
            ) : null}
            {secondaryAction ? (
              <Link className="button-secondary" href={secondaryAction.href}>
                {secondaryAction.label}
              </Link>
            ) : null}
          </div>
        ) : null}
      </header>

      {showNavigation ? (
        <nav className="app-nav">
          <div className="nav-group">
            <Link className="nav-link" href="/">Home</Link>
            <Link className="nav-link" href="/animais">Animais</Link>
            {showAdotanteLink ? (
              <Link className="nav-link" href="/adotante/dashboard">Adotante</Link>
            ) : null}
            {showAbrigoLink ? (
              <Link className="nav-link" href="/abrigo/dashboard">Abrigo</Link>
            ) : null}
          </div>
        </nav>
      ) : null}

      <main className="app-main">{children}</main>
    </div>
  );
}
