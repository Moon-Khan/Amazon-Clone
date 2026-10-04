function formatPrice(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function PriceBlock({ basePrice, listPrice }: { basePrice: number; listPrice?: number | null }) {
  const hasDiscount = !!listPrice && listPrice > basePrice;
  const discountPercent = hasDiscount ? Math.round((1 - basePrice / listPrice!) * 100) : 0;
  const [dollars, cents] = formatPrice(basePrice).split(".");

  return (
    <div className="flex items-baseline gap-2">
      {hasDiscount && (
        <span className="rounded bg-az-price px-1 py-0.5 text-xs font-bold text-white">-{discountPercent}%</span>
      )}
      <span className="text-az-price">
        <span className="align-top text-xs">$</span>
        <span className="text-xl font-medium">{dollars}</span>
        <span className="align-top text-xs">{cents}</span>
      </span>
      {hasDiscount && <span className="text-sm text-muted-foreground line-through">${formatPrice(listPrice!)}</span>}
    </div>
  );
}
