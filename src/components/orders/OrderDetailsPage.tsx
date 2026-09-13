import type { OrderDetails } from "@/types/order";
import { OrderAddress } from "./OrderAddress";
import { OrderCustomer } from "./OrderCustomer";
import { OrderFulfillment } from "./OrderFulfillment";
import { OrderHeader } from "./OrderHeader";
import { OrderItems } from "./OrderItems";
import { OrderMetadata } from "./OrderMetadata";
import { OrderPayment } from "./OrderPayment";
import { OrderTimeline } from "./OrderTimeline";
import { OrderTotals } from "./OrderTotals";

export function OrderDetailsPage({ order }: { order: OrderDetails }) {
  return (
    <main className="mx-auto max-w-[1240px] px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
      <OrderHeader order={order} />
      <div className="grid items-start gap-3 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-3">
          <OrderItems items={order.lineItems} currency={order.currency} />
          <OrderTotals order={order} />
          <OrderPayment order={order} />
          <OrderFulfillment order={order} />
          <OrderTimeline order={order} />
        </div>
        <aside className="space-y-3">
          <OrderCustomer order={order} />
          <OrderAddress
            title="Shipping address"
            address={order.shipping}
            readOnly={order.readOnly}
          />
          <OrderAddress
            title="Billing address"
            address={order.billing}
            readOnly={order.readOnly}
            sameAsShipping={order.billingSameAsShipping}
          />
          <OrderMetadata order={order} />
        </aside>
      </div>
    </main>
  );
}
