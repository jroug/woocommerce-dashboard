"use client";
import { useState } from "react";
import type { CustomerDetails } from "@/types/customer";
import type { Order } from "@/types/order";
import { CustomerAddressCard } from "./CustomerAddressCard";
import { CustomerBehavior } from "./CustomerBehavior";
import { CustomerContact } from "./CustomerContact";
import { CustomerHeader } from "./CustomerHeader";
import { CustomerNotes } from "./CustomerNotes";
import { CustomerOrders } from "./CustomerOrders";
import { CustomerProfile } from "./CustomerProfile";
import { CustomerSummary } from "./CustomerSummary";
import { CustomerTags } from "./CustomerTags";
import { CustomerTimeline } from "./CustomerTimeline";

export function CustomerDetailsPage({
  initialCustomer,
  orders,
}: {
  initialCustomer: CustomerDetails;
  orders: Order[];
}) {
  // Live profiles are read-only until write operations are connected.
  const [localCustomer, setCustomer] = useState(initialCustomer);
  const customer = initialCustomer.readOnly ? initialCustomer : localCustomer;
  const [editing, setEditing] = useState(false);
  const update = (patch: Partial<CustomerDetails>) =>
    setCustomer((current) => ({ ...current, ...patch }));
  const addNote = (text: string) => {
    const note = { id: Date.now(), text, date: new Date().toISOString(), author: "Admin" };
    update({
      notes: [note, ...customer.notes],
      timeline: [
        { id: Date.now() + 1, title: "Note added", description: text, date: note.date },
        ...customer.timeline,
      ],
    });
  };
  const sameAddress = JSON.stringify(customer.billing) === JSON.stringify(customer.shipping);
  return (
    <main className="mx-auto max-w-[1240px] px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
      <CustomerHeader
        customer={customer}
        editing={editing}
        onEdit={customer.readOnly ? undefined : () => setEditing((value) => !value)}
      />
      <div className="grid items-start gap-3 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-3">
          <CustomerSummary customer={customer} />
          <CustomerProfile customer={customer} editing={editing} onChange={update} />
          <CustomerOrders orders={orders} />
          <CustomerBehavior customer={customer} />
          <CustomerNotes notes={customer.notes} onAdd={customer.readOnly ? undefined : addNote} />
          <CustomerTimeline events={customer.timeline} />
        </div>
        <aside className="space-y-3">
          <CustomerContact
            customer={customer}
            onEdit={customer.readOnly ? undefined : () => setEditing(true)}
          />
          <CustomerAddressCard
            title="Default shipping address"
            name={`${customer.firstName} ${customer.lastName}`}
            address={customer.shipping}
            onEdit={customer.readOnly ? undefined : () => setEditing(true)}
          />
          <CustomerAddressCard
            title="Billing address"
            name={`${customer.firstName} ${customer.lastName}`}
            address={customer.billing}
            sameAsShipping={sameAddress}
            onEdit={customer.readOnly ? undefined : () => setEditing(true)}
          />
          {!customer.readOnly && (
            <CustomerTags tags={customer.tags} onChange={(tags) => update({ tags })} />
          )}
          <section className="admin-card">
            <header className="border-b px-4 py-3.5">
              <h2 className="text-[15px] font-semibold">Customer metadata</h2>
            </header>
            <dl className="space-y-3 p-4 text-[12px]">
              <div className="flex justify-between gap-3">
                <dt className="text-[var(--color-text-muted)]">Customer ID</dt>
                <dd className="font-medium">#{customer.userId || customer.id}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-[var(--color-text-muted)]">Currency</dt>
                <dd className="font-medium">{customer.currency}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-[var(--color-text-muted)]">Country</dt>
                <dd className="font-medium">{customer.billing.countryCode}</dd>
              </div>
            </dl>
          </section>
        </aside>
      </div>
    </main>
  );
}
