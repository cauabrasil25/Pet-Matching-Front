type DashboardCardProps = {
  title: string;
  description: string;
};

export function DashboardCard({ title, description }: DashboardCardProps) {
  return (
    <article className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">{title}</p>
      <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{description}</p>
    </article>
  );
}
