export function formatSalesId(id) {
  return `Luxint-${id.toString().padStart(3, "0")}`;
}
