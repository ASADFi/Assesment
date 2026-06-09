export const cn = (...classes: (string | undefined | false | null)[]): string =>
  classes.filter(Boolean).join(" ");

export const formatPrice = (price: number): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);

export const formatDate = (date: string): string =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
