import { ComponentChildren } from "preact";
import { Link } from "@reach/router";

const DrawerIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    class="inline-block w-6 h-6 stroke-current"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);

type LayoutProps = {
  children: ComponentChildren;
};

export const Layout = ({ children }: LayoutProps) => (
  <div class="drawer min-h-screen">
    <input id="navbar-drawer" type="checkbox" class="drawer-toggle" />
    <div class="flex flex-col drawer-content">
      <div class="w-full navbar bg-base-200 shadow-lg">
        <div class="flex-none lg:hidden">
          <label for="navbar-drawer" class="btn btn-square btn-ghost">
            <DrawerIcon />
          </label>
        </div>
        <div class="px-2 mx-2 navbar-start">
          <span>Renter.Cafe</span>
        </div>
        <div class="hidden px-2 mx-2 navbar-center lg:flex">
          <div class="flex items-stretch">
            <Link className="btn btn-ghost rounded-btn" to="/">
              Yield
            </Link>
            <Link className="btn btn-ghost rounded-btn" to="/properties">
              Properties
            </Link>
          </div>
        </div>
        <div class="navbar-end">
          <button class="btn btn-primary">Connect wallet</button>
        </div>
      </div>
      {children}
    </div>
    <div class="drawer-side">
      <label for="navbar-drawer" class="drawer-overlay" />
      <ul class="p-4 overflow-y-auto menu w-80 bg-base-100">
        <li>
          <Link to="/">Yield</Link>
        </li>
        <li>
          <Link to="/properties">Properties</Link>
        </li>
      </ul>
    </div>
  </div>
);
