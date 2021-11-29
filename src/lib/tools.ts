export const formatNumber = (number: number) =>
  (Math.round(number * 100) / 100)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
