"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type AddressData = {
  id: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
};

export function AddressManager({ initialAddresses }: { initialAddresses: AddressData[] }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        line1: formData.get("line1"),
        line2: formData.get("line2"),
        city: formData.get("city"),
        state: formData.get("state"),
        zip: formData.get("zip"),
        country: formData.get("country"),
        isDefault: formData.get("isDefault") === "on",
      }),
    });

    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Could not save address.");
      return;
    }

    setShowForm(false);
    router.refresh();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/addresses/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {initialAddresses.length === 0 && <p className="text-sm text-muted-foreground">No addresses saved yet.</p>}

      <ul className="space-y-3">
        {initialAddresses.map((addr) => (
          <li key={addr.id} className="flex items-start justify-between rounded border p-3 text-sm">
            <div>
              {addr.isDefault && <p className="mb-1 text-xs font-bold text-az-prime">DEFAULT</p>}
              <p>{addr.line1}</p>
              {addr.line2 && <p>{addr.line2}</p>}
              <p>
                {addr.city}, {addr.state} {addr.zip}
              </p>
              <p>{addr.country}</p>
            </div>
            <button type="button" onClick={() => handleDelete(addr.id)} className="text-xs text-az-link hover:underline">
              Remove
            </button>
          </li>
        ))}
      </ul>

      {showForm ? (
        <form onSubmit={handleAdd} className="space-y-3 rounded border p-4">
          {error && <p className="text-sm text-az-price">{error}</p>}
          <input name="line1" placeholder="Address line 1" required className="w-full rounded border border-neutral-300 px-3 py-2 text-sm" />
          <input name="line2" placeholder="Address line 2 (optional)" className="w-full rounded border border-neutral-300 px-3 py-2 text-sm" />
          <div className="flex gap-2">
            <input name="city" placeholder="City" required className="w-full rounded border border-neutral-300 px-3 py-2 text-sm" />
            <input name="state" placeholder="State" required className="w-full rounded border border-neutral-300 px-3 py-2 text-sm" />
            <input name="zip" placeholder="Zip" required className="w-full rounded border border-neutral-300 px-3 py-2 text-sm" />
          </div>
          <input name="country" placeholder="Country" required defaultValue="United States" className="w-full rounded border border-neutral-300 px-3 py-2 text-sm" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="isDefault" />
            Set as default address
          </label>
          <div className="flex gap-2">
            <button type="submit" disabled={submitting} className="rounded-full bg-az-cta-yellow px-4 py-2 text-sm font-medium hover:bg-az-cta-yellow-hover disabled:opacity-50">
              {submitting ? "Saving..." : "Save address"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="rounded-full border px-4 py-2 text-sm hover:bg-muted">
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button type="button" onClick={() => setShowForm(true)} className="rounded-full border px-4 py-2 text-sm hover:bg-muted">
          Add a new address
        </button>
      )}
    </div>
  );
}
