import Link from "next/link";
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
const ACCOUNT_LINKS = ["Account", "Orders", "Recommendations", "Browsing History"];

/**
 * Guest-state account menu for Phase 2 (no auth wired yet - Phase 5 adds real
 * sessions and will swap the trigger text to "Hello, {name}").
 */
export function AccountMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex flex-col px-2 py-1 text-left text-xs leading-tight text-white hover:border hover:border-white">
        <span>Hello, sign in</span>
        <span className="text-sm font-bold">Account &amp; Lists</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="px-2 py-1.5 text-xs text-muted-foreground">
          New customer?{" "}
          <Link href="/signup" className="text-az-link hover:underline">
            Start here.
          </Link>
        </div>
        <DropdownMenuSeparator />
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
          {ACCOUNT_LINKS.map((label) => (
            <DropdownMenuItem key={label} disabled>
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
