import { cn } from "@/lib/utils";

interface PageHeroProps {
  label?: string;
  title: string;
  titleAccent?: string;
  subtitle?: string;
  className?: string;
}

/**
 * Consistent hero header for inner marketing pages (about, pricing, services, contact).
 * The marketing layout provides pt-24 for the floating navbar; this adds its own vertical padding.
 */
export function PageHero({ label, title, titleAccent, subtitle, className }: PageHeroProps) {
  return (
    <div className={cn("relative overflow-hidden border-b border-white/[0.06] pb-16 pt-4", className)}>
      {/* Ambient radial glow */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_0%,rgba(37,99,235,0.11),transparent)]"
        aria-hidden
      />
      {/* Top accent line */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-500/15 to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto max-w-4xl px-4 py-12 text-center sm:px-6 lg:px-8">
        {label && (
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
            {label}
          </p>
        )}
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
          {title}
          {titleAccent && (
            <>
              {" "}
              <em
                className="font-drama italic"
                style={{
                  backgroundImage: "linear-gradient(135deg, #60a5fa 0%, #38bdf8 60%, #a5f3fc 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {titleAccent}
              </em>
            </>
          )}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
