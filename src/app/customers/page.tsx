import { AppShell } from "@/components/dashboard/AppShell";
import { CustomersPage } from "@/components/customers/CustomersPage";
import { getWooCommerceCustomers } from "@/lib/woocommerce";

export const dynamic = "force-dynamic";
export default async function CustomersRoute() {
  const { customers, currency } = await getWooCommerceCustomers();
  return (
    <AppShell activeSection="customers" mobileTitle="Customers">
      <CustomersPage initialCustomers={customers} currency={currency} />
    </AppShell>
  );
}
