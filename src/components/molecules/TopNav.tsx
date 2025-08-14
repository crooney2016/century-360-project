import { Logo } from "../atoms/Logo";
import NavLink from "@/ui/NavLink";
import { Button } from "@/ui/Button";

export function TopNav() {
  return (
    <header className="border-b bg-white">
      <nav className="container-app flex h-14 items-center justify-between">
        <NavLink href="/" exact className="font-semibold">
          <Logo />
        </NavLink>
        <div className="flex items-center gap-3">
          <NavLink href="/catalog">Catalog</NavLink>
          <NavLink href="/cart">Cart</NavLink>
          <NavLink href="/checkout">Checkout</NavLink>
          <NavLink href="/admin">Admin</NavLink>
          <Button variant="secondary" size="sm">
            New Order
          </Button>
        </div>
      </nav>
    </header>
  );
}
