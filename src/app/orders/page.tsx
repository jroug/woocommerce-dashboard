import { AppShell } from "@/components/dashboard/AppShell";
import { OrdersPage } from "@/components/orders/OrdersPage";
import { getWooCommerceOrders } from "@/lib/woocommerce";

export const dynamic = "force-dynamic";

export default async function OrdersRoute() {
  const orders = await getWooCommerceOrders();
  return (
    <AppShell activeSection="orders" mobileTitle="Orders">
      <OrdersPage initialOrders={orders} />
    </AppShell>
  );
}
