export async function onRequest(context) {
  const { DB } = context.env;

  try {
    const query = `
      SELECT 
        s.id,
        s.name,
        COUNT(DISTINCT c.id) as totalCustomers,
        COUNT(pi.id) as totalItems,
        SUM(pi.sellingPrice) as totalRevenue
      FROM sales s
      LEFT JOIN customers c ON s.id = c.salesId
      LEFT JOIN purchased_items pi ON c.id = pi.customerId
      GROUP BY s.id, s.name
    `;
    
    const result = await DB.prepare(query).all();
    return Response.json(result.results);
  } catch (error) {
    return Response.json({ error: "Database error" }, { status: 500 });
  }
}