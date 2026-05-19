type DashboardCardProps = {
  title: string;
  description: string;
};

export function DashboardCard({ title, description }: DashboardCardProps) {
  return (
    <article className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
      <p className="text-sm font-bold uppercase tracking-[0.12em] text-[var(--primary-strong)]">{title}</p>
      <p className="mt-3 text-base leading-7 text-[var(--muted)]">{description}</p>
    </article>
  );
}
