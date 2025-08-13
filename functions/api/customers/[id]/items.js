export async function onRequest(context) {
  const { DB } = context.env;
  const { id } = context.params;

  try {
    const items = await DB.prepare(
      "SELECT * FROM purchased_items WHERE customerId = ?"
    )
      .bind(id)
      .all();
    return Response.json(items.results);
  } catch (error) {
    return Response.json({ error: "Database error" }, { status: 500 });
  }
}
