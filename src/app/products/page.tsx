import { AppShell } from "@/components/dashboard/AppShell";
import { ProductsPage } from "@/components/products/ProductsPage";
import { getWooCommerceProducts } from "@/lib/woocommerce";

export const dynamic = "force-dynamic";

export default async function ProductsRoute() {
  const { products, categories, currency } = await getWooCommerceProducts();
  return (
    <AppShell activeSection="products" mobileTitle="Products">
      <ProductsPage initialProducts={products} categories={categories} currency={currency} />
    </AppShell>
  );
}
