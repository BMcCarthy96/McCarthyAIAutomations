import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { getServiceBySlug, getAllServiceSlugs } from "@/lib/data";
import { getServiceIcon } from "@/lib/serviceIcons";
import { Button } from "@/components/ui/Button";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllServiceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return { title: "Service not found" };
  return {
    title: service.name,
    description: service.description,
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const Icon = getServiceIcon(service.icon);

  return (
    <div className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/services"
          className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-white"
        >
          <ArrowRight className="h-4 w-4 rotate-180" />
          All services
        </Link>
        <div className="mt-8 flex items-start gap-6">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-400">
            <Icon className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              {service.name}
            </h1>
            <p className="mt-2 text-xl text-zinc-400">{service.tagline}</p>
          </div>
        </div>
        <p className="mt-8 text-lg leading-relaxed text-zinc-300">
          {service.longDescription}
        </p>
        {service.highlights && service.highlights.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {service.highlights.map((h) => (
              <span
                key={h}
                className="rounded-full bg-white/10 px-4 py-1.5 text-sm text-zinc-300"
              >
                {h}
              </span>
            ))}
          </div>
        )}
        <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <h2 className="text-lg font-semibold text-white">
            What&apos;s included
          </h2>
          <ul className="mt-4 space-y-3">
            {service.features.map((f) => (
              <li
                key={f}
                className="flex items-start gap-3 text-zinc-300"
              >
                <Check className="h-5 w-5 shrink-0 text-indigo-400" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-12 flex flex-wrap gap-4">
          <Button href="/contact" variant="primary" size="lg">
            Get a quote
          </Button>
          <Button href="/services" variant="ghost" size="lg">
            View all services
          </Button>
        </div>
      </div>
    </div>
  );
}
