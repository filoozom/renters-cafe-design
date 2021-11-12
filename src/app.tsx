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

const Hero = () => (
  <div class="hero min-h-screen bg-gradient-to-br from-primary to-accent">
    <div class="text-center hero-content">
      <div class="max-w-lg">
        <h1 class="mb-8 text-5xl font-bold">
          Create, sell and collect digital items
        </h1>
        <p class="mb-8">
          Unit of data stored on a digital ledger, called a blockchain, that
          certifies a digital asset to be unique and therefore not
          interchangeable
        </p>
        <button class="btn btn-primary">Get Started</button>
      </div>
    </div>
  </div>
);

const Card = () => (
  <div class="card bordered">
    <button class="btn absolute top-4 right-4 indicator">
      locked
      <div class="badge badge-secondary ml-2">
        <span class="font-mono countdown">
          <span style="--value:10;"></span>:<span style="--value:24;"></span>:
          <span style="--value:59;"></span>
        </span>
      </div>
    </button>
    <figure>
      <img src="https://picsum.photos/id/1005/400/250" />
    </figure>
    <div class="card-body text-left">
      <h2 class="card-title">
        Top image
        <div class="badge mx-2 badge-secondary">NEW</div>
      </h2>
      <p>
        Rerum reiciendis beatae tenetur excepturi aut pariatur est eos. Sit sit
        necessitatibus veritatis sed molestiae voluptates incidunt iure
        sapiente.
      </p>
      <div class="justify-end card-actions">
        <button class="btn btn-secondary">More info</button>
      </div>
    </div>
  </div>
);

const Cards = () => (
  <div class="hero min-h-screen">
    <div class="max-w-5xl mx-auto text-center hero-content">
      <div>
        <CardMenu />
        <div class="grid grid-cols-3 gap-5">
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
        </div>
      </div>
    </div>
  </div>
);

const CardMenu = () => (
  <div class="flex justify-center mb-4">
    <div class="relative m-2">
      <input
        type="text"
        placeholder="Search"
        class="w-full pr-16 input input-primary input-bordered"
      />
      <button class="absolute top-0 right-0 rounded-l-none btn btn-primary">
        go
      </button>
    </div>
    <select class="select select-bordered w-full max-w-xs m-2">
      <option disabled selected>
        Choose your superpower
      </option>
      <option>telekinesis</option>
      <option>time travel</option>
      <option>invisibility</option>
    </select>
  </div>
);

const Content = () => (
  <>
    <Hero />
    <Cards />
  </>
);

const Layout = () => (
  <div class="drawer min-h-screen">
    <input id="navbar-drawer" type="checkbox" class="drawer-toggle" />
    <div class="flex flex-col drawer-content">
      <div class="w-full navbar bg-neutral shadow-lg">
        <div class="flex-none lg:hidden">
          <label for="navbar-drawer" class="btn btn-square btn-ghost">
            <DrawerIcon />
          </label>
        </div>
        <div class="px-2 mx-2 navbar-start">
          <span>Renter.Cafe</span>
        </div>
        {/*
        <div class="flex-none hidden lg:block">
          <ul class="menu horizontal">
            <li>
              <a class="rounded-btn">Yield</a>
            </li>
            <li>
              <a class="rounded-btn">Properties</a>
            </li>
          </ul>
        </div>
        */}
        <div class="hidden px-2 mx-2 navbar-center lg:flex">
          <div class="flex items-stretch">
            <a class="btn btn-ghost rounded-btn">Yield</a>
            <a class="btn btn-ghost rounded-btn">Properties</a>
          </div>
        </div>
        <div class="navbar-end">
          <button class="btn btn-primary">Connect wallet</button>
        </div>
      </div>
      <Content />
    </div>
    <div class="drawer-side">
      <label for="navbar-drawer" class="drawer-overlay" />
      <ul class="p-4 overflow-y-auto menu w-80 bg-base-100">
        <li>
          <a>Yield</a>
        </li>
        <li>
          <a>Properties</a>
        </li>
      </ul>
    </div>
  </div>
);

export function App() {
  return (
    <>
      <Layout />
    </>
  );
}
