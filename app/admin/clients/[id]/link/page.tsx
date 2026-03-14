import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getClientById } from "@/lib/admin-data";
import { LinkClerkForm } from "@/components/admin/LinkClerkForm";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Link Clerk user | Admin",
  description: "Set or update the Clerk user ID for this client.",
};

export default async function AdminClientLinkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await getClientById(id);
  if (!client) notFound();

  return (
    <div className="space-y-6">
      <Link
        href="/admin/clients"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to clients
      </Link>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Link Clerk user
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          {client.name}
        </p>
        <p className="mt-1 text-sm text-zinc-500">
          {client.clerkUserId
            ? `Current: ${client.clerkUserId}`
            : "Not linked"}
        </p>
      </div>
      <div className="max-w-xl rounded-xl border border-white/10 bg-white/5 p-6">
        <LinkClerkForm clientId={client.id} currentClerkUserId={client.clerkUserId} />
      </div>
    </div>
  );
}
