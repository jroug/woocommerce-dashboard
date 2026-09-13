export type OrderStatus =
  | "pending"
  | "processing"
  | "on-hold"
  | "completed"
  | "cancelled"
  | "refunded"
  | "failed"
  | (string & {});

export type PaymentStatus = "paid" | "pending" | "refunded" | "failed";
export type OrderSort = "newest" | "oldest" | "highest" | "lowest";
export type OrderDateFilter = "all" | "today" | "7d" | "30d";

export interface OrderCustomer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface OrderLineItem {
  id: number;
  productId: number;
  name: string;
  quantity: number;
  total: string;
}

export interface OrderDetailLineItem extends OrderLineItem {
  sku: string;
  unitPrice: string;
  image: string;
  variation?: string;
}

export interface OrderAddress {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email?: string;
  phone?: string;
}

export type FulfillmentStatus = "unfulfilled" | "fulfilled" | "shipped" | "unknown";
export interface OrderTimelineEvent {
  id: number;
  title: string;
  description?: string;
  date: string;
}
export interface OrderNote {
  id: number;
  author: string;
  content: string;
  date: string;
  customerVisible: boolean;
}

export interface OrderDetails extends Omit<Order, "lineItems"> {
  lineItems: OrderDetailLineItem[];
  subtotal: string;
  discountTotal: string;
  shippingTotal: string;
  taxTotal: string;
  amountPaid: string | null;
  readOnly?: boolean;
  source?: string;
  fees?: { name: string; total: string }[];
  refundedTotal?: string;
  paymentMethodTitle: string;
  transactionId: string;
  datePaid: string | null;
  billing: OrderAddress;
  shipping: OrderAddress;
  billingSameAsShipping: boolean;
  shippingMethod: string;
  fulfillmentStatus: FulfillmentStatus;
  trackingNumber: string | null;
  carrier: string | null;
  dateFulfilled: string | null;
  customerPhone: string;
  customerOrdersCount: number | null;
  customerTotalSpent: string | null;
  customerNote: string;
  notes: OrderNote[];
  timeline: OrderTimelineEvent[];
}

/** Normalized WooCommerce order fields used by the list. */
export interface Order {
  id: number;
  number: string;
  dateCreated: string;
  status: OrderStatus;
  currency: string;
  total: string;
  customer: OrderCustomer;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  itemsCount: number;
  lineItems: OrderLineItem[];
}
