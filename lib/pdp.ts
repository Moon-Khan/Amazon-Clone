export type VariantOption = {
  id: string;
  value: string;
  priceDelta: number;
  stock: number;
};

export type ResolvedPricing = {
  price: number;
  listPrice: number | null;
  stock: number;
};

/**
 * Pure: resolves the displayed price/listPrice/stock for a product given an
 * optional selected variant. Falls back to the base product figures when
 * there's no selection or no matching variant (e.g. the product has none).
 */
export function resolveVariantPricing(
  product: { basePrice: number; listPrice: number | null; stock: number },
  variants: VariantOption[],
  selectedVariantId: string | null,
): ResolvedPricing {
  const selected = selectedVariantId ? variants.find((v) => v.id === selectedVariantId) : undefined;

  if (!selected) {
    return { price: product.basePrice, listPrice: product.listPrice, stock: product.stock };
  }

  return {
    price: product.basePrice + selected.priceDelta,
    listPrice: product.listPrice !== null ? product.listPrice + selected.priceDelta : null,
    stock: selected.stock,
  };
}
