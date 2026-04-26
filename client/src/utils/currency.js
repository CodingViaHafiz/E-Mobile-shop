const createFormatter = (options = {}) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  });

export const formatPKR = (value, options = {}) => {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return createFormatter(options).format(0);
  }

  return createFormatter(options).format(numericValue);
};
