"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LISTS_LINKS = ["Create a List", "Find a List or Registry"];

export function AccountMenu() {
  const { data: session } = useSession();
  const user = session?.user ?? null;
  const { t } = useLocale();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex flex-col px-2 py-1 text-left text-xs leading-tight text-white hover:border hover:border-white">
        <span>{user ? t("helloName", { name: user.name ?? "" }) : t("helloSignIn")}</span>
        <span className="text-sm font-bold">{t("accountAndLists")}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        {!user && (
          <>
            <div className="px-2 py-1.5 text-xs text-muted-foreground">
              New customer?{" "}
              <Link href="/signup" className="text-az-link hover:underline">
                Start here.
              </Link>
            </div>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuGroup>
          <DropdownMenuLabel>Your Lists</DropdownMenuLabel>
          {LISTS_LINKS.map((label) => (
            <DropdownMenuItem key={label} disabled>
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Your Account</DropdownMenuLabel>
          {user ? (
            <>
              <DropdownMenuItem>
                <Link href="/account" className="flex w-full">
                  Account
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/orders" className="flex w-full">
                  Orders
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>Sign Out</DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem disabled>Account</DropdownMenuItem>
              <DropdownMenuItem disabled>Orders</DropdownMenuItem>
            </>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
