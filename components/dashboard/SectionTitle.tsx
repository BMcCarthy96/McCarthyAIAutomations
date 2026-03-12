import Link from "next/link";

interface SectionTitleProps {
  children: React.ReactNode;
  action?: { label: string; href: string };
}

export function SectionTitle({ children, action }: SectionTitleProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
        {children}
      </h2>
      {action && (
        <Link
          href={action.href}
          className="text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
