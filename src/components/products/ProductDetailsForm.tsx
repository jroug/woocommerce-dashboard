"use client";

import { useEffect, useMemo, useState } from "react";
import type { ProductCategory, ProductDetails } from "@/types/product";
import { ProductHeader } from "./ProductHeader";
import { ProductInformation } from "./ProductInformation";
import { ProductInventory } from "./ProductInventory";
import { ProductMedia } from "./ProductMedia";
import { ProductOrganization } from "./ProductOrganization";
import { ProductPricing } from "./ProductPricing";
import { ProductSeo } from "./ProductSeo";
import { ProductShipping } from "./ProductShipping";
import { ProductStats } from "./ProductStats";
import { ProductStatusCard } from "./ProductStatusCard";
import { ProductVariants } from "./ProductVariants";

type ValidationErrors = { name?: string; price?: string; sku?: string; stock?: string };

export function ProductDetailsForm({
  initialProduct,
  categories,
}: {
  initialProduct: ProductDetails;
  categories: ProductCategory[];
}) {
  const [product, setProduct] = useState(initialProduct);
  // Keep a separate snapshot so nested field edits participate in the unsaved-change check.
  const [savedProduct, setSavedProduct] = useState(initialProduct);
  const [attemptedSave, setAttemptedSave] = useState(false);
  const [saved, setSaved] = useState(false);
  const dirty = JSON.stringify(product) !== JSON.stringify(savedProduct);
  const errors = useMemo<ValidationErrors>(() => {
    const next: ValidationErrors = {};
    if (!product.name.trim()) next.name = "Product title is required.";
    if (
      product.price.trim() === "" ||
      !Number.isFinite(Number(product.price)) ||
      Number(product.price) < 0
    )
      next.price = "Enter a valid price.";
    // SKU and quantity are required only when inventory tracking is enabled.
    if (product.manageStock && !product.sku.trim())
      next.sku = "SKU is required when inventory is tracked.";
    if (product.manageStock && (product.stockQuantity === null || product.stockQuantity < 0))
      next.stock = "Stock must be zero or greater.";
    return next;
  }, [product]);

  // Warn on document unload; this does not intercept Next.js client-side navigation.
  useEffect(() => {
    const warnBeforeLeaving = (event: BeforeUnloadEvent) => {
      if (dirty) event.preventDefault();
    };
    window.addEventListener("beforeunload", warnBeforeLeaving);
    return () => window.removeEventListener("beforeunload", warnBeforeLeaving);
  }, [dirty]);

  const updateProduct = (patch: Partial<ProductDetails>) => {
    setSaved(false);
    setProduct((current) => ({ ...current, ...patch }));
  };
  // Saving advances the local baseline only; no WooCommerce write is made.
  const saveProduct = () => {
    setAttemptedSave(true);
    if (Object.keys(errors).length > 0) return;
    setSavedProduct(product);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  return (
    <main className="mx-auto page-container px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
      <ProductHeader
        title={product.name}
        status={product.status}
        dirty={dirty}
        saved={saved}
        onSave={saveProduct}
      />
      <fieldset className="m-0 grid min-w-0 items-start gap-4 border-0 p-0 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <ProductInformation
            product={product}
            onChange={updateProduct}
            error={attemptedSave ? errors.name : undefined}
          />
          <ProductMedia product={product} onChange={updateProduct} />
          <ProductPricing
            product={product}
            onChange={updateProduct}
            error={attemptedSave ? errors.price : undefined}
          />
          <ProductInventory
            product={product}
            onChange={updateProduct}
            errors={attemptedSave ? { sku: errors.sku, stock: errors.stock } : {}}
          />
          <ProductVariants product={product} onChange={updateProduct} />
          <ProductShipping product={product} onChange={updateProduct} />
          <ProductSeo product={product} onChange={updateProduct} />
        </div>
        <aside className="mt-4 space-y-4 lg:sticky lg:top-[72px] lg:mt-0">
          <ProductStatusCard product={product} onChange={updateProduct} />
          <ProductOrganization product={product} categories={categories} onChange={updateProduct} />
          <ProductStats product={product} />
        </aside>
      </fieldset>
    </main>
  );
}
