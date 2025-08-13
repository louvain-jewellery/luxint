export async function onRequest(context) {
  const { DB } = context.env;
  const { id } = context.params;

  try {
    const customers = await DB.prepare(
      "SELECT * FROM customers WHERE salesId = ?"
    )
      .bind(id)
      .all();
    return Response.json(customers.results);
  } catch (error) {
    return Response.json({ error: "Database error" }, { status: 500 });
  }
}
