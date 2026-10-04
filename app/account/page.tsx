import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { AddressManager } from "@/components/account/AddressManager";

export default async function AccountPage() {
  const user = await requireUser();
  const addresses = await prisma.address.findMany({
    where: { userId: user.id },
    orderBy: { isDefault: "desc" },
  });

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 px-4 py-6">
      <h1 className="text-2xl font-bold">Your Account</h1>

      <section className="rounded border p-5">
        <h2 className="mb-3 text-lg font-bold">Login &amp; Security</h2>
        <p className="text-sm">
          <span className="font-medium">Name:</span> {user.name}
        </p>
        <p className="text-sm">
          <span className="font-medium">Email:</span> {user.email}
        </p>
      </section>

      <section className="rounded border p-5">
        <h2 className="mb-3 text-lg font-bold">Addresses</h2>
        <AddressManager
          initialAddresses={addresses.map((a) => ({
            id: a.id,
            line1: a.line1,
            line2: a.line2,
            city: a.city,
            state: a.state,
            zip: a.zip,
            country: a.country,
            isDefault: a.isDefault,
          }))}
        />
      </section>
    </div>
  );
}
