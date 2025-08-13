export async function onRequest(context) {
  const { DB } = context.env;

  try {
    const query = `
      SELECT 
        c.id,
        c.name,
        COUNT(pi.id) as itemCount,
        SUM(pi.sellingPrice) as totalSpent
      FROM customers c
      LEFT JOIN purchased_items pi ON c.id = pi.customerId
      GROUP BY c.id, c.name
    `;

    const result = await DB.prepare(query).all();
    return Response.json(result.results);
  } catch (error) {
    return Response.json({ error: "Database error" }, { status: 500 });
  }
}
