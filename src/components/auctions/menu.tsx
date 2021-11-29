export const AuctionMenu = () => (
  <div class="flex justify-center mb-4 flex-col sm:flex-row xs:w-auto w-full">
    <select class="select select-bordered m-2">
      <option disabled selected>
        Availability
      </option>
      <option>All</option>
      <option>Available</option>
      <option>Locked</option>
    </select>
    <select class="select select-bordered m-2">
      <option disabled selected>
        Bonus type
      </option>
      <option>All</option>
      <option>Ratio increase</option>
      <option>LP increase</option>
    </select>
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
  </div>
);
