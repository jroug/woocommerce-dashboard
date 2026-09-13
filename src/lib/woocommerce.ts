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

async function wooRequest<T>(path: string): Promise<{ data: T; totalPages: number }> {
  const {
    WOOCOMMERCE_URL: base,
    WOOCOMMERCE_CONSUMER_KEY: key,
    WOOCOMMERCE_CONSUMER_SECRET: secret,
  } = process.env;
  if (!base || !key || !secret) throw new Error("WooCommerce configuration is missing.");
  const url = new URL(`wp-json/wc/v3/${path}`, `${base.replace(/\/$/, "")}/`);
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
    return {
      id: item.id,
      name: item.name,
      slug: item.slug,
      sku: item.sku,
      status: item.status,
      type: item.type === "variable" ? "variable" : "simple",
      price: item.price,
      regularPrice: item.regular_price,
      salePrice: item.sale_price,
      currency: currencySetting.data.value,
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
  });
  return {
    products,
    categories: [...categories.values()].sort((a, b) => a.name.localeCompare(b.name)),
    currency: currencySetting.data.value,
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
