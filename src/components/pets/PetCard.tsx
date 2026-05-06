type PetCardProps = {
  name: string;
  description: string;
};

export function PetCard({ name, description }: PetCardProps) {
  return (
    <article className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)]">
      <div className="flex h-40 items-center justify-center rounded-2xl bg-gradient-to-br from-[rgba(15,118,110,0.12)] to-[rgba(217,119,6,0.12)] text-lg font-semibold text-[var(--primary-strong)]">
        {name}
      </div>
      <h3 className="mt-5 text-xl font-semibold text-[var(--text)]">{name}</h3>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{description}</p>
    </article>
  );
}
