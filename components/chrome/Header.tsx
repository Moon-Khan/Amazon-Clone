"use client";

import { MapPin, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Logo } from "./Logo";
import { SearchBar } from "./SearchBar";
import { LanguagePopover } from "./LanguagePopover";
import { AccountMenu } from "./AccountMenu";
import { LocationPickerModal } from "./LocationPickerModal";
import { CartBadge } from "./CartBadge";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export function Header() {
  const { t } = useLocale();

  return (
    <header className="flex items-center gap-2 bg-az-header px-2 py-2 sm:gap-4 sm:px-4">
      <Logo className="shrink-0" />

      <LocationPickerModal>
        <div className="hidden flex-col px-2 py-1 text-xs leading-tight text-white hover:border hover:border-white md:flex">
          <span className="flex items-center gap-1 text-neutral-300">
            <MapPin className="h-3.5 w-3.5" />
            {t("deliveringToAccount")}
          </span>
          <span className="flex items-center gap-1 text-sm font-bold">
            <span className="invisible h-3.5 w-3.5" />
            {t("updateLocation")}
          </span>
        </div>
      </LocationPickerModal>

      <div className="min-w-0 flex-1">
        <SearchBar />
      </div>

      <div className="hidden lg:block">
        <LanguagePopover />
      </div>

      <AccountMenu />

      <Link
        href="/orders"
        className="hidden flex-col px-2 py-1 text-xs leading-tight text-white hover:border hover:border-white sm:flex"
      >
        <span>{t("returns")}</span>
        <span className="text-sm font-bold">{t("andOrders")}</span>
      </Link>

      <Link href="/cart" className="flex items-end gap-1 px-2 py-1 text-white hover:border hover:border-white">
        <span className="relative">
          <ShoppingCart className="h-7 w-7" />
          <CartBadge />
        </span>
        <span className="hidden text-sm font-bold sm:inline">{t("cart")}</span>
      </Link>
    </header>
  );
}
