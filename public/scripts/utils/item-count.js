export function mapItemCount(itemsData) {
  const itemCountMap = {};
  itemsData.forEach((item) => {
    if (itemCountMap[item.customerId]) {
      itemCountMap[item.customerId]++;
    } else {
      itemCountMap[item.customerId] = 1;
    }
  });
  return itemCountMap;
}
