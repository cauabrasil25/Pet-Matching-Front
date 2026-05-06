import Link from 'next/link';
import type { ReactNode } from 'react';

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

export function AppShell({
  eyebrow,
  title,
  description,
  children,
  primaryAction,
  secondaryAction,
  showNavigation = true
}: AppShellProps) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-6 md:px-8 lg:px-10">
      <header className="flex flex-col gap-5 rounded-[32px] border border-[var(--border)] bg-[rgba(255,250,242,0.78)] p-6 shadow-[var(--shadow)] backdrop-blur md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">{eyebrow}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--text)] md:text-5xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)] md:text-base">{description}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {primaryAction ? (
            <Link className="rounded-full bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--primary-strong)]" href={primaryAction.href}>
              {primaryAction.label}
            </Link>
          ) : null}
          {secondaryAction ? (
            <Link className="rounded-full border border-[var(--border)] bg-white px-5 py-3 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surface-2)]" href={secondaryAction.href}>
              {secondaryAction.label}
            </Link>
          ) : null}
        </div>
      </header>

      {showNavigation ? (
        <nav className="mt-5 flex flex-wrap gap-3 text-sm text-[var(--muted)]">
          <Link className="rounded-full border border-[var(--border)] bg-white px-4 py-2 transition hover:bg-[var(--surface-2)]" href="/">Home</Link>
          <Link className="rounded-full border border-[var(--border)] bg-white px-4 py-2 transition hover:bg-[var(--surface-2)]" href="/animais">Animais</Link>
          <Link className="rounded-full border border-[var(--border)] bg-white px-4 py-2 transition hover:bg-[var(--surface-2)]" href="/login">Login</Link>
          <Link className="rounded-full border border-[var(--border)] bg-white px-4 py-2 transition hover:bg-[var(--surface-2)]" href="/adotante/dashboard">Adotante</Link>
          <Link className="rounded-full border border-[var(--border)] bg-white px-4 py-2 transition hover:bg-[var(--surface-2)]" href="/abrigo/dashboard">Abrigo</Link>
        </nav>
      ) : null}

      <main className="flex-1 py-8 md:py-10">{children}</main>
    </div>
  );
}
