"use client";

import { useState } from "react";
import Image from "next/image";

export function ImageGallery({ images, title }: { images: string[]; title: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex] ?? images[0];

  return (
    <div className="flex gap-3">
      <div className="hidden flex-col gap-2 sm:flex">
        {images.map((img, i) => (
          <button
            key={img}
            type="button"
            onClick={() => setActiveIndex(i)}
            aria-label={`Show image ${i + 1}`}
            className={`relative h-14 w-14 shrink-0 overflow-hidden rounded border ${i === activeIndex ? "border-az-prime" : "border-neutral-200"}`}
          >
            <Image src={img} alt="" fill sizes="56px" className="object-contain p-1" />
          </button>
        ))}
      </div>
      <div className="relative aspect-square w-80 shrink-0 overflow-hidden rounded bg-neutral-50 sm:w-96">
        {active && <Image src={active} alt={title} fill sizes="(min-width: 640px) 400px, 90vw" className="object-contain p-4" priority />}
      </div>
    </div>
  );
}
