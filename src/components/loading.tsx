import { LoadingIcon } from "./icons/loading";

export const Loading = () => (
  <div class="hero">
    <div class="text-center hero-content">
      <div class="text-center bg-base-200 p-8 rounded-3xl sm:w-96 w-full">
        <div class="mx-auto mb-8">
          <LoadingIcon />
        </div>
        <p>Loading...</p>
      </div>
    </div>
  </div>
);
