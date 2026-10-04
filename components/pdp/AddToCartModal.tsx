"use client";

import Link from "next/link";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export function AddToCartModal({
  open,
  onOpenChange,
  item,
  subtotal,
  itemCount,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: { title: string; image?: string; price: number; quantity: number };
  subtotal: number;
  itemCount: number;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle className="sr-only">Added to cart</DialogTitle>
        <div className="flex gap-3 rounded bg-green-50 p-3">
          {item.image && (
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded bg-white">
              <Image src={item.image} alt="" fill sizes="64px" className="object-contain p-1" />
            </div>
          )}
          <div className="flex-1 text-sm">
            <p className="font-medium text-green-800">✔ Added to cart</p>
            <p className="line-clamp-2">{item.title}</p>
            <p className="text-muted-foreground">
              ${item.price.toFixed(2)} &times; {item.quantity}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between border-t pt-3 text-sm">
          <span>
            Subtotal ({itemCount} item{itemCount === 1 ? "" : "s"}):
          </span>
          <span className="font-bold">${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="flex-1 rounded-full border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Continue shopping
          </button>
          <Link
            href="/cart"
            className="flex-1 rounded-full bg-az-cta-yellow px-4 py-2 text-center text-sm font-medium hover:bg-az-cta-yellow-hover"
          >
            Go to cart
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
