export function formatSalesId(id) {
  return `Luxint-${id.toString().padStart(3, "0")}`;
}

export function formatCustomerId(id) {
  return `Cust-${id.toString().padStart(3, "0")}`;
}
