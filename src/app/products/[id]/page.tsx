import { AppShell } from "@/components/dashboard/AppShell";
import { ProductDetailsForm } from "@/components/products/ProductDetailsForm";
import { ProductNotFound } from "@/components/products/ProductNotFound";
import { getWooCommerceProductDetails } from "@/lib/woocommerce";

export const dynamic = "force-dynamic";

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getWooCommerceProductDetails(id);
  return (
    <AppShell activeSection="products" mobileTitle={result?.product.name ?? "Product"}>
      {result ? (
        <ProductDetailsForm
          key={result.product.id}
          initialProduct={result.product}
          categories={result.categories}
        />
      ) : (
        <ProductNotFound />
      )}
    </AppShell>
  );
}
