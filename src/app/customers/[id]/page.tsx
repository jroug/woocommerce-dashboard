import { AppShell } from "@/components/dashboard/AppShell";
import { CustomerDetailsPage } from "@/components/customers/CustomerDetailsPage";
import { CustomerNotFound } from "@/components/customers/CustomerNotFound";
import { getWooCommerceCustomerDetails } from "@/lib/woocommerce";

export const dynamic = "force-dynamic";

export default async function CustomerRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getWooCommerceCustomerDetails(id);
  return (
    <AppShell
      activeSection="customers"
      mobileTitle={result ? `${result.customer.firstName} ${result.customer.lastName}` : "Customer"}
    >
      {result ? (
        <CustomerDetailsPage initialCustomer={result.customer} orders={result.orders} />
      ) : (
        <CustomerNotFound />
      )}
    </AppShell>
  );
}
