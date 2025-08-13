export async function onRequest(context) {
  const { DB } = context.env;

  try {
    const query = `
      SELECT 
        s.id as salesId,
        s.name as salesName,
        s.custCount,
        s.image as salesImage,
        c.id as customerId,
        c.name as customerName
      FROM sales s 
      LEFT JOIN customers c ON s.id = c.salesId
    `;

    const result = await DB.prepare(query).all();
    return Response.json(result.results);
  } catch (error) {
    return Response.json({ error: "Database error" }, { status: 500 });
  }
}
