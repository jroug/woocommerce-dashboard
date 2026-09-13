import { AppShell } from "@/components/dashboard/AppShell";
import { OrderDetailsPage } from "@/components/orders/OrderDetailsPage";
import { OrderNotFound } from "@/components/orders/OrderNotFound";
import { getWooCommerceOrderDetails } from "@/lib/woocommerce";

export const dynamic = "force-dynamic";

export default async function OrderDetailsRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getWooCommerceOrderDetails(id);
  return (
    <AppShell activeSection="orders" mobileTitle={order ? `Order #${order.number}` : "Order"}>
      {order ? <OrderDetailsPage order={order} /> : <OrderNotFound />}
    </AppShell>
  );
}
