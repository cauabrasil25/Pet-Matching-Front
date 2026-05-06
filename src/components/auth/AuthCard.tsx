type AuthCardProps = {
  title: string;
  subtitle: string;
};

export function AuthCard({ title, subtitle }: AuthCardProps) {
  return (
    <section className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[var(--shadow)]">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">{title}</p>
      <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--muted)]">{subtitle}</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-dashed border-[var(--border)] bg-white p-5 text-sm text-[var(--muted)]">
          Formulário de email e senha
        </div>
        <div className="rounded-2xl border border-dashed border-[var(--border)] bg-white p-5 text-sm text-[var(--muted)]">
          Integração com /auth/login e armazenamento do JWT
        </div>
      </div>
    </section>
  );
}
