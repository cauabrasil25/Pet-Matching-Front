type SectionTitleProps = {
  title: string;
  subtitle?: string;
};

export function SectionTitle({ title, subtitle }: SectionTitleProps) {
  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight text-[var(--text)]">{title}</h2>
      {subtitle ? <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{subtitle}</p> : null}
    </div>
  );
}
