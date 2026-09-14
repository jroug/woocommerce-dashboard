import "server-only";
import { readFile } from "node:fs/promises";
import { X509Certificate } from "node:crypto";
import { request } from "node:https";
import { checkServerIdentity } from "node:tls";
import type {
  Product,
  ProductCategory,
  ProductImage,
  ProductStatus,
  StockStatus,
} from "@/types/product";
import type {
  DashboardData,
  DashboardOrderStatus,
  DashboardLivePeriod,
  DateRange,
  InventorySummary,
  OrderStatusSummary,
  RevenuePoint,
  Stat,
  TopProduct,
} from "@/types/dashboard";

interface WooProduct {
  id: number;
  name: string;
  slug: string;
  sku: string;
  status: ProductStatus;
  type: string;
  price: string;
  regular_price: string;
  sale_price: string;
  stock_quantity: number | null;
  stock_status: StockStatus;
  manage_stock: boolean;
  low_stock_amount: number | null;
  categories: ProductCategory[];
  images: ProductImage[];
  tags: { name: string }[];
  brands?: { name: string }[];
  total_sales: number;
  date_created: string;
  date_created_gmt: string;
  date_modified: string;
  date_modified_gmt: string;
}

class WooCommerceError extends Error {
  constructor(public status: number) {
    super(`WooCommerce request failed (${status}).`);
  }
}

async function wooRequest<T>(
  path: string,
  namespace = "wc/v3",
): Promise<{ data: T; totalPages: number }> {
  const {
    WOOCOMMERCE_URL: base,
    WOOCOMMERCE_CONSUMER_KEY: key,
    WOOCOMMERCE_CONSUMER_SECRET: secret,
  } = process.env;
  if (!base || !key || !secret) throw new Error("WooCommerce configuration is missing.");
  const url = new URL(`wp-json/${namespace}/${path}`, `${base.replace(/\/$/, "")}/`);
  const headers = { Authorization: `Basic ${Buffer.from(`${key}:${secret}`).toString("base64")}` };
  const certPath = process.env.WOOCOMMERCE_LOCAL_CERT_PATH;
  if (certPath) {
    if (url.protocol !== "https:" || url.hostname !== "localhost") {
      throw new Error("The local WooCommerce certificate is only supported for HTTPS localhost.");
    }
    const ca = await readFile(certPath);
    const pinned = new X509Certificate(ca);
    // MAMP's local certificate has no SAN. Trust only this exact certificate,
    // scoped to localhost; never disable TLS verification globally.
    return new Promise((resolve, reject) => {
      const req = request(
        url,
        {
          headers,
          ca,
          checkServerIdentity: (host, cert) =>
            cert.raw.equals(pinned.raw) ? undefined : checkServerIdentity(host, cert),
          signal: AbortSignal.timeout(30000),
        },
        (res) => {
          if (res.statusCode !== 200) {
            res.resume();
            reject(new WooCommerceError(res.statusCode ?? 502));
            return;
          }
          let body = "";
          res.setEncoding("utf8");
          res.on("data", (chunk) => {
            body += chunk;
          });
          res.on("error", reject);
          res.on("end", () => {
            try {
              resolve({
                data: JSON.parse(body) as T,
                totalPages: Number(res.headers["x-wp-totalpages"] ?? 1),
              });
            } catch {
              reject(new Error("WooCommerce returned an invalid response."));
            }
          });
        },
      );
      req.on("error", reject);
      req.end();
    });
  }
  const response = await fetch(url, {
    headers,
    cache: "no-store",
    redirect: "error",
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) throw new WooCommerceError(response.status);
  return {
    data: (await response.json()) as T,
    totalPages: Number(response.headers.get("x-wp-totalpages") ?? 1),
  };
}

export async function getWooCommerceProducts() {
  const [first, currencySetting] = await Promise.all([
    wooRequest<WooProduct[]>("products?per_page=100&page=1&orderby=id&order=asc"),
    wooRequest<{ value: string }>("settings/general/woocommerce_currency"),
  ]);
  const all = [...first.data];
  // Follow every API page so the existing client filters search the whole catalog.
  for (let page = 2; page <= first.totalPages; page++) {
    const result = await wooRequest<WooProduct[]>(
      `products?per_page=100&page=${page}&orderby=id&order=asc`,
    );
    all.push(...result.data);
  }
  const categories = new Map<number, ProductCategory>();
  const products: Product[] = all.map((item) => {
    const itemCategories = item.categories.length
      ? item.categories
      : [{ id: 0, name: "Uncategorized", slug: "uncategorized" }];
    itemCategories.forEach((category) => categories.set(category.id, category));
    return mapWooProduct(item, currencySetting.data.value);
  });
  return {
    products,
    categories: [...categories.values()].sort((a, b) => a.name.localeCompare(b.name)),
    currency: currencySetting.data.value,
  };
}

function mapWooProduct(item: WooProduct, currency: string): Product {
  const itemCategories = item.categories.length
    ? item.categories
    : [{ id: 0, name: "Uncategorized", slug: "uncategorized" }];
  return {
    id: item.id,
    name: item.name,
    slug: item.slug,
    sku: item.sku,
    status: item.status,
    type: item.type as Product["type"],
    price: item.price,
    regularPrice: item.regular_price,
    salePrice: item.sale_price,
    currency,
    stockQuantity: item.stock_quantity,
    stockStatus: item.stock_status,
    manageStock: item.manage_stock,
    lowStockThreshold: item.low_stock_amount ?? 2,
    category: itemCategories[0],
    categories: itemCategories,
    image: item.images[0] ?? { id: 0, src: "/products/placeholder.svg", alt: "No product image" },
    totalSales: item.total_sales,
    tags: item.tags.map((tag) => tag.name),
    brands: (item.brands ?? []).map((brand) => brand.name),
    dateModified: item.date_modified_gmt
      ? `${item.date_modified_gmt}Z`
      : item.date_modified || null,
    datePublished: ["publish", "private"].includes(item.status)
      ? item.date_created_gmt
        ? `${item.date_created_gmt}Z`
        : item.date_created
      : null,
    dateCreated: item.date_created_gmt ? `${item.date_created_gmt}Z` : item.date_created,
  };
}

interface WooOrder {
  id: number;
  number: string;
  date_created: string;
  date_created_gmt: string;
  date_paid: string | null;
  status: import("@/types/order").OrderStatus;
  currency: string;
  total: string;
  customer_id: number;
  billing: { first_name: string; last_name: string; email: string };
  payment_method: string;
  payment_method_title: string;
  line_items: { id: number; product_id: number; name: string; quantity: number; total: string }[];
}

export async function getWooCommerceOrders(): Promise<import("@/types/order").Order[]> {
  const first = await wooRequest<WooOrder[]>(
    "orders?per_page=100&page=1&orderby=id&order=desc&status=any",
  );
  const orders = [...first.data];
  for (let page = 2; page <= first.totalPages; page++) {
    const result = await wooRequest<WooOrder[]>(
      `orders?per_page=100&page=${page}&orderby=id&order=desc&status=any`,
    );
    orders.push(...result.data);
  }
  return orders.map(mapWooOrder);
}

function mapWooOrder(order: WooOrder): import("@/types/order").Order {
  return {
    id: order.id,
    number: order.number,
    dateCreated: order.date_created_gmt ? `${order.date_created_gmt}Z` : order.date_created,
    status: order.status,
    currency: order.currency,
    total: order.total,
    customer: {
      id: order.customer_id,
      firstName: order.billing.first_name,
      lastName: order.billing.last_name,
      email: order.billing.email,
    },
    paymentStatus:
      order.status === "refunded"
        ? "refunded"
        : order.date_paid
          ? "paid"
          : order.status === "failed"
            ? "failed"
            : "pending",
    paymentMethod: order.payment_method_title || order.payment_method,
    itemsCount: order.line_items.reduce((sum, item) => sum + item.quantity, 0),
    lineItems: order.line_items.map((item) => ({
      id: item.id,
      productId: item.product_id,
      name: item.name,
      quantity: item.quantity,
      total: item.total,
    })),
  };
}

interface WooAddress {
  first_name: string;
  last_name: string;
  company: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email?: string;
  phone?: string;
}
interface WooOrderDetails extends WooOrder {
  billing: WooAddress & { email: string };
  shipping: WooAddress;
  discount_total: string;
  shipping_total: string;
  total_tax: string;
  transaction_id: string;
  date_paid_gmt: string | null;
  date_completed_gmt: string | null;
  customer_note: string;
  created_via: string;
  shipping_lines: { method_title: string }[];
  fee_lines: { name: string; total: string }[];
  refunds: { id: number; reason: string; total: string }[];
  line_items: (WooOrder["line_items"][number] & {
    sku: string;
    subtotal: string;
    image?: { src: string };
    meta_data: { key: string; display_key?: string; display_value?: unknown; value: unknown }[];
  })[];
}
interface WooOrderNote {
  id: number;
  author: string;
  note: string;
  date_created: string;
  date_created_gmt: string;
  customer_note: boolean;
}

function mapAddress(address: WooAddress): import("@/types/order").OrderAddress {
  return {
    firstName: address.first_name,
    lastName: address.last_name,
    company: address.company,
    address1: address.address_1,
    address2: address.address_2,
    city: address.city,
    state: address.state,
    postcode: address.postcode,
    country: address.country,
    email: address.email,
    phone: address.phone,
  };
}

export async function getWooCommerceOrderDetails(
  id: string,
): Promise<import("@/types/order").OrderDetails | null> {
  if (!/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(Number(id))) return null;
  let order: WooOrderDetails;
  try {
    order = (await wooRequest<WooOrderDetails>(`orders/${id}`)).data;
  } catch (error) {
    if (error instanceof WooCommerceError && error.status === 404) return null;
    throw error;
  }
  const firstNotes = await wooRequest<WooOrderNote[]>(`orders/${id}/notes?per_page=100&page=1`);
  const notes = [...firstNotes.data];
  for (let page = 2; page <= firstNotes.totalPages; page++) {
    notes.push(
      ...(await wooRequest<WooOrderNote[]>(`orders/${id}/notes?per_page=100&page=${page}`)).data,
    );
  }
  const base = mapWooOrder(order);
  const billing = mapAddress(order.billing);
  const shipping = mapAddress(order.shipping);
  const datePaid = order.date_paid_gmt ? `${order.date_paid_gmt}Z` : order.date_paid;
  const timeline = [{ id: 1, title: "Order created", date: base.dateCreated }];
  if (datePaid) timeline.push({ id: 2, title: "Payment recorded", date: datePaid });
  if (order.date_completed_gmt)
    timeline.push({ id: 3, title: "Order completed", date: `${order.date_completed_gmt}Z` });
  return {
    ...base,
    readOnly: true,
    source: order.created_via || "—",
    lineItems: order.line_items.map((item) => ({
      id: item.id,
      productId: item.product_id,
      name: item.name,
      quantity: item.quantity,
      total: item.total,
      sku: item.sku || "—",
      unitPrice: item.quantity ? String(Number(item.total) / item.quantity) : "0",
      image: item.image?.src || "/products/placeholder.svg",
      variation: item.meta_data
        .filter(
          (meta) =>
            !meta.key.startsWith("_") &&
            ["string", "number"].includes(typeof (meta.display_value ?? meta.value)),
        )
        .map((meta) => `${meta.display_key ?? meta.key}: ${meta.display_value ?? meta.value}`)
        .join(" / "),
    })),
    subtotal: String(order.line_items.reduce((sum, item) => sum + Number(item.subtotal), 0)),
    discountTotal: order.discount_total,
    shippingTotal: order.shipping_total,
    taxTotal: order.total_tax,
    fees: order.fee_lines.map((fee) => ({ name: fee.name, total: fee.total })),
    refundedTotal: String(
      order.refunds.reduce((sum, refund) => sum + Math.abs(Number(refund.total)), 0),
    ),
    amountPaid: datePaid ? order.total : order.status === "refunded" ? null : "0",
    paymentMethodTitle: order.payment_method_title || order.payment_method || "—",
    transactionId: order.transaction_id || "—",
    datePaid,
    billing,
    shipping,
    billingSameAsShipping: [
      "first_name",
      "last_name",
      "company",
      "address_1",
      "address_2",
      "city",
      "state",
      "postcode",
      "country",
    ].every(
      (key) => order.billing[key as keyof WooAddress] === order.shipping[key as keyof WooAddress],
    ),
    shippingMethod:
      order.shipping_lines.map((line) => line.method_title).join(", ") || "Not specified",
    fulfillmentStatus: "unknown",
    trackingNumber: null,
    carrier: null,
    dateFulfilled: null,
    customerPhone: order.billing.phone || "",
    customerOrdersCount: null,
    customerTotalSpent: null,
    customerNote: order.customer_note,
    notes: notes
      .map((note) => ({
        id: note.id,
        author: note.author || "WooCommerce",
        content: note.note,
        date: note.date_created_gmt ? `${note.date_created_gmt}Z` : note.date_created,
        customerVisible: note.customer_note,
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    timeline: timeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  };
}

interface WooCustomerReport {
  id: number;
  user_id: number | null;
  name: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  date_registered: string | null;
  date_registered_gmt: string | null;
  date_last_active: string | null;
  date_last_active_gmt: string | null;
  date_last_order?: string | null;
  orders_count: number;
  total_spend: number | null;
  avg_order_value: number | null;
  country: string;
  city: string;
  state: string;
  postcode: string;
}

async function getAllWooPages<T>(resource: string, namespace = "wc/v3"): Promise<T[]> {
  const first = await wooRequest<T[]>(`${resource}&per_page=100&page=1`, namespace);
  const records = [...first.data];
  for (let page = 2; page <= first.totalPages; page++) {
    records.push(
      ...(await wooRequest<T[]>(`${resource}&per_page=100&page=${page}`, namespace)).data,
    );
  }
  return records;
}

export async function getWooCommerceCustomers() {
  const [customers, setting] = await Promise.all([
    getAllWooPages<WooCustomerReport>(
      "reports/customers?orderby=date_last_active&order=desc",
      "wc-analytics",
    ),
    wooRequest<{ value: string }>("settings/general/woocommerce_currency"),
  ]);
  const currency = setting.data.value;
  const records: import("@/types/customer").Customer[] = customers.map((customer) => {
    const address = {
      address1: "",
      address2: "",
      city: customer.city || "",
      state: customer.state || "",
      postcode: customer.postcode || "",
      countryCode: customer.country || "",
      country: customer.country || "",
    };
    return {
      id: customer.id,
      userId: customer.user_id,
      firstName: customer.first_name || customer.name || customer.username || "Guest",
      lastName: customer.first_name ? customer.last_name : "",
      username: customer.username || "",
      dateRegisteredLocal: customer.date_registered,
      lastActiveDateLocal: customer.date_last_active,
      email: customer.email,
      phone: "",
      avatar: null,
      dateCreated: customer.date_registered_gmt
        ? `${customer.date_registered_gmt}Z`
        : customer.date_registered || "",
      lastActiveDate: customer.date_last_active_gmt
        ? `${customer.date_last_active_gmt}Z`
        : customer.date_last_active,
      billing: address,
      shipping: address,
      ordersCount: customer.orders_count,
      totalSpent: String(customer.total_spend ?? 0),
      averageOrderValue: String(customer.avg_order_value ?? 0),
      hasAverageOrderValue: customer.avg_order_value !== null,
      lastOrderDate: customer.date_last_order ?? null,
      tags: [],
      currency,
    };
  });
  return { customers: records, currency };
}

const dashboardStatusOrder: DashboardOrderStatus[] = [
  "processing",
  "pending",
  "on-hold",
  "completed",
  "cancelled",
  "refunded",
  "failed",
];

const dashboardStatusLabels: Record<DashboardOrderStatus, string> = {
  processing: "Processing",
  pending: "Pending payment",
  "on-hold": "On hold",
  completed: "Completed",
  cancelled: "Cancelled",
  refunded: "Refunded",
  failed: "Failed",
};

const productColors = ["#cf7443", "#426b57", "#637995", "#a98451", "#736a8d"];

function periodBounds(range: DateRange, now: Date) {
  const end = new Date(now);
  const start = new Date(now);
  const previousStart = new Date(now);
  if (range === "7d") {
    start.setUTCDate(start.getUTCDate() - 6);
    previousStart.setUTCDate(previousStart.getUTCDate() - 13);
  } else if (range === "30d") {
    start.setUTCDate(start.getUTCDate() - 29);
    previousStart.setUTCDate(previousStart.getUTCDate() - 59);
  } else {
    start.setUTCMonth(start.getUTCMonth() - 11, 1);
    start.setUTCHours(0, 0, 0, 0);
    previousStart.setUTCMonth(previousStart.getUTCMonth() - 23, 1);
    previousStart.setUTCHours(0, 0, 0, 0);
  }
  if (range !== "12m") {
    start.setUTCHours(0, 0, 0, 0);
    previousStart.setUTCHours(0, 0, 0, 0);
  }
  return { start, end, previousStart };
}

function isBetween(value: string, start: Date, end: Date) {
  const date = new Date(value).getTime();
  return date >= start.getTime() && date <= end.getTime();
}

function change(current: number, previous: number) {
  if (previous === 0) return { change: 0, direction: "up" as const };
  const amount = ((current - previous) / previous) * 100;
  return {
    change: Math.abs(Number(amount.toFixed(1))),
    direction: amount >= 0 ? ("up" as const) : ("down" as const),
  };
}

function revenueBuckets(
  range: DateRange,
  now: Date,
  orders: import("@/types/order").Order[],
): RevenuePoint[] {
  const { start, end } = periodBounds(range, now);
  const bucketCount = range === "7d" ? 7 : range === "30d" ? 6 : 12;
  const bucketDays = range === "7d" ? 1 : range === "30d" ? 5 : 0;
  const formatter = new Intl.DateTimeFormat(
    "en-US",
    range === "12m"
      ? { month: "short", timeZone: "UTC" }
      : { month: "short", day: "numeric", timeZone: "UTC" },
  );
  return Array.from({ length: bucketCount }, (_, index) => {
    const bucketStart = new Date(start);
    if (range === "12m") bucketStart.setUTCMonth(bucketStart.getUTCMonth() + index);
    else bucketStart.setUTCDate(bucketStart.getUTCDate() + index * bucketDays);
    const bucketEnd = new Date(bucketStart);
    if (range === "12m") bucketEnd.setUTCMonth(bucketEnd.getUTCMonth() + 1);
    else bucketEnd.setUTCDate(bucketEnd.getUTCDate() + bucketDays);
    bucketEnd.setTime(Math.min(bucketEnd.getTime() - 1, end.getTime()));
    const revenue = orders
      .filter(
        (order) =>
          ["processing", "completed"].includes(order.status) &&
          isBetween(order.dateCreated, bucketStart, bucketEnd),
      )
      .reduce((sum, order) => sum + Number(order.total), 0);
    return { label: formatter.format(bucketStart), revenue };
  });
}

export async function getWooCommerceDashboard(): Promise<DashboardData> {
  const [{ products, currency }, orders, { customers }] = await Promise.all([
    getWooCommerceProducts(),
    getWooCommerceOrders(),
    getWooCommerceCustomers(),
  ]);
  const now = new Date();
  const inventorySummary: InventorySummary = products.reduce(
    (summary, product) => {
      if (product.stockStatus === "outofstock" || product.stockQuantity === 0)
        summary.outOfStock += 1;
      else if (
        product.manageStock &&
        product.stockQuantity !== null &&
        product.stockQuantity <= product.lowStockThreshold
      )
        summary.lowStock += 1;
      return summary;
    },
    { lowStock: 0, outOfStock: 0 },
  );
  const periods = (Object.keys({ "7d": true, "30d": true, "12m": true }) as DateRange[]).reduce(
    (all, range) => {
      const { start, end, previousStart } = periodBounds(range, now);
      const currentOrders = orders.filter((order) => isBetween(order.dateCreated, start, end));
      const previousOrders = orders.filter((order) =>
        isBetween(order.dateCreated, previousStart, new Date(start.getTime() - 1)),
      );
      const paid = currentOrders.filter((order) =>
        ["processing", "completed"].includes(order.status),
      );
      const previousPaid = previousOrders.filter((order) =>
        ["processing", "completed"].includes(order.status),
      );
      const revenue = paid.reduce((sum, order) => sum + Number(order.total), 0);
      const previousRevenue = previousPaid.reduce((sum, order) => sum + Number(order.total), 0);
      const currentCustomers = customers.filter(
        (customer) => customer.dateCreated && isBetween(customer.dateCreated, start, end),
      ).length;
      const previousCustomers = customers.filter(
        (customer) =>
          customer.dateCreated &&
          isBetween(customer.dateCreated, previousStart, new Date(start.getTime() - 1)),
      ).length;
      const averageOrderValue = paid.length ? revenue / paid.length : 0;
      const previousAov = previousPaid.length ? previousRevenue / previousPaid.length : 0;
      const money = new Intl.NumberFormat("en-IE", {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
      });
      const stats: Stat[] = [
        {
          id: "revenue",
          label: "Revenue",
          value: money.format(revenue),
          ...change(revenue, previousRevenue),
        },
        {
          id: "orders",
          label: "Orders",
          value: currentOrders.length.toLocaleString(),
          ...change(currentOrders.length, previousOrders.length),
        },
        {
          id: "average-order-value",
          label: "Average order value",
          value: money.format(averageOrderValue),
          ...change(averageOrderValue, previousAov),
        },
        {
          id: "customers",
          label: "New customers",
          value: currentCustomers.toLocaleString(),
          ...change(currentCustomers, previousCustomers),
        },
      ];
      const orderStatuses: OrderStatusSummary[] = dashboardStatusOrder.map((status) => ({
        status,
        label: dashboardStatusLabels[status],
        count: currentOrders.filter((order) => order.status === status).length,
      }));
      const byProduct = new Map<number, { name: string; unitsSold: number; revenue: number }>();
      paid.forEach((order) =>
        order.lineItems.forEach((item) => {
          const current = byProduct.get(item.productId) ?? {
            name: item.name,
            unitsSold: 0,
            revenue: 0,
          };
          current.unitsSold += item.quantity;
          current.revenue += Number(item.total);
          byProduct.set(item.productId, current);
        }),
      );
      const topProducts: TopProduct[] = [...byProduct.entries()]
        .map(([id, item], index) => {
          const product = products.find((candidate) => candidate.id === id);
          return {
            id: String(id),
            name: item.name,
            category: product?.category.name ?? "Uncategorized",
            unitsSold: item.unitsSold,
            revenue: item.revenue,
            color: productColors[index % productColors.length],
          };
        })
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);
      all[range] = {
        stats,
        revenue: revenueBuckets(range, now, orders),
        orderStatuses,
        topProducts,
      };
      return all;
    },
    {} as Record<DateRange, DashboardLivePeriod>,
  );
  return {
    periods,
    recentOrders: [...orders]
      .sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime())
      .slice(0, 5),
    inventorySummary,
    currency,
  };
}

interface WooCustomerProfile {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  avatar_url: string;
  billing: WooAddress;
  shipping: WooAddress;
}

export async function getWooCommerceCustomerDetails(id: string) {
  const guest = id.startsWith("guest-");
  const numericId = guest ? id.slice(6) : id;
  if (!/^[1-9]\d*$/.test(numericId) || !Number.isSafeInteger(Number(numericId))) return null;
  const report = await getWooCommerceCustomers();
  const customer = report.customers.find((item) =>
    guest ? !item.userId && item.id === Number(numericId) : item.userId === Number(numericId),
  );
  if (!customer) return null;
  let profile: WooCustomerProfile | null = null;
  if (customer.userId) {
    try {
      profile = (await wooRequest<WooCustomerProfile>(`customers/${customer.userId}`)).data;
    } catch (error) {
      if (error instanceof WooCommerceError && error.status === 404) return null;
      throw error;
    }
  }
  const rawOrders = (
    await getAllWooPages<WooOrderDetails>(
      `orders?customer=${customer.userId || 0}&status=any&orderby=date&order=desc`,
    )
  ).filter(
    (order) =>
      !["trash", "checkout-draft", "auto-draft"].includes(order.status) &&
      (customer.userId ||
        (customer.email && order.billing.email.toLowerCase() === customer.email.toLowerCase())),
  );
  const orders = rawOrders.map(mapWooOrder);
  const address = (value: WooAddress | undefined): import("@/types/customer").CustomerAddress => ({
    firstName: value?.first_name || "",
    lastName: value?.last_name || "",
    company: value?.company || "",
    address1: value?.address_1 || "",
    address2: value?.address_2 || "",
    city: value?.city || "",
    state: value?.state || "",
    postcode: value?.postcode || "",
    country: value?.country || "",
    countryCode: value?.country || "",
  });
  const billing = profile?.billing ?? rawOrders[0]?.billing;
  const shipping = profile?.shipping ?? rawOrders[0]?.shipping;
  const timeline = orders.map((order) => ({
    id: order.id,
    title: `Order #${order.number} placed`,
    description: `${order.itemsCount} items · ${order.currency} ${order.total}`,
    date: order.dateCreated,
  }));
  if (customer.dateCreated)
    timeline.push({
      id: -1,
      title: "Customer registered",
      description: "Store account created",
      date: customer.dateCreated,
    });
  const details: import("@/types/customer").CustomerDetails = {
    ...customer,
    readOnly: true,
    firstName: profile?.first_name || customer.firstName,
    lastName: profile?.last_name || customer.lastName,
    email: profile?.email || customer.email,
    phone: billing?.phone || "",
    avatar: profile?.avatar_url || null,
    billing: address(billing),
    shipping: address(shipping),
    daysSinceLastOrder: orders[0]
      ? Math.max(
          0,
          Math.floor((Date.now() - new Date(orders[0].dateCreated).getTime()) / 86_400_000),
        )
      : null,
    firstOrderDate: orders.at(-1)?.dateCreated ?? null,
    lastOrderDate: orders[0]?.dateCreated ?? null,
    refundsCount: rawOrders.reduce((sum, order) => sum + order.refunds.length, 0),
    favoriteCategory: "—",
    notes: rawOrders
      .filter((order) => order.customer_note)
      .map((order) => ({
        id: order.id,
        text: order.customer_note,
        date: order.date_created_gmt ? `${order.date_created_gmt}Z` : order.date_created,
        author: `Customer at checkout · Order #${order.number}`,
      })),
    timeline: timeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  };
  return { customer: details, orders };
}

interface WooProductDetails extends WooProduct {
  description: string;
  short_description: string;
  permalink: string;
  global_unique_id?: string;
  backorders: import("@/types/product").Backorders;
  virtual: boolean;
  weight: string;
  dimensions: import("@/types/product").ProductDimensions;
  shipping_class: string;
  shipping_class_id: number;
  attributes: { id: number; name: string; options: string[]; variation: boolean }[];
  meta_data: { key: string; value: unknown }[];
  cogs_value?: number | null;
}
interface WooVariation {
  id: number;
  sku: string;
  price: string;
  stock_quantity: number | null;
  stock_status: StockStatus;
  attributes: { name: string; option: string }[];
}

export async function getWooCommerceProductDetails(id: string) {
  if (!/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(Number(id))) return null;
  let item: WooProductDetails;
  try {
    item = (await wooRequest<WooProductDetails>(`products/${id}`)).data;
  } catch (error) {
    if (error instanceof WooCommerceError && error.status === 404) return null;
    throw error;
  }
  const [currency, categories, variants, weightUnit, dimensionUnit, shippingClass] =
    await Promise.all([
      wooRequest<{ value: string }>("settings/general/woocommerce_currency"),
      getAllWooPages<ProductCategory>(
        "products/categories?hide_empty=false&orderby=name&order=asc",
      ),
      item.type === "variable"
        ? getAllWooPages<WooVariation>(`products/${id}/variations?orderby=id&order=asc`)
        : Promise.resolve([]),
      wooRequest<{ value: string }>("settings/products/woocommerce_weight_unit"),
      wooRequest<{ value: string }>("settings/products/woocommerce_dimension_unit"),
      item.shipping_class_id
        ? wooRequest<{ name: string }>(`products/shipping_classes/${item.shipping_class_id}`).then(
            (result) => result.data.name,
          )
        : Promise.resolve("No shipping class"),
    ]);
  const metaText = (...keys: string[]) => {
    for (const key of keys) {
      const value = item.meta_data.find((meta) => meta.key === key)?.value;
      if (typeof value === "string" || typeof value === "number") return String(value);
    }
    return "";
  };
  const product: import("@/types/product").ProductDetails = {
    ...mapWooProduct(item, currency.data.value),
    readOnly: true,
    permalink: item.permalink,
    description: item.description || "",
    shortDescription: item.short_description || "",
    images: item.images,
    cost:
      item.cogs_value != null
        ? String(item.cogs_value)
        : metaText("_wc_cog_cost", "_alg_wc_cog_cost"),
    barcode: item.global_unique_id || metaText("_global_unique_id"),
    backorders: item.backorders,
    physicalProduct: !item.virtual,
    weight: item.weight,
    weightUnit: weightUnit.data.value,
    dimensionUnit: dimensionUnit.data.value,
    dimensions: item.dimensions,
    shippingClass,
    categories: item.categories,
    tags: item.tags.map((tag) => tag.name),
    brand: (item.brands ?? []).map((brand) => brand.name).join(", "),
    productTypeLabel: item.type,
    options: item.attributes
      .filter((attribute) => attribute.variation)
      .map((attribute, index) => ({
        id: attribute.id || -(index + 1),
        name: attribute.name,
        values: attribute.options,
      })),
    variants: variants.map((variant) => ({
      id: variant.id,
      name:
        variant.attributes
          .map((attribute) => `${attribute.name}: ${attribute.option || "Any"}`)
          .join(" / ") || `Variation #${variant.id}`,
      sku: variant.sku,
      price: variant.price,
      stockQuantity: variant.stock_quantity,
      stockStatus: variant.stock_status,
    })),
    seo: {
      title: metaText("_yoast_wpseo_title", "rank_math_title"),
      description: metaText("_yoast_wpseo_metadesc", "rank_math_description"),
    },
    revenue: null,
    ordersCount: null,
  };
  return { product, categories };
}
