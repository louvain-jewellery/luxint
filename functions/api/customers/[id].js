export async function onRequest(context) {
  const { DB } = context.env;
  const { id } = context.params;

  try {
    const customer = await DB.prepare("SELECT * FROM customers WHERE id = ?")
      .bind(id)
      .first();

    if (!customer) {
      return Response.json({ error: "Customer not found" }, { status: 404 });
    }

    return Response.json(customer);
  } catch (error) {
    return Response.json({ error: "Database error" }, { status: 500 });
  }
}
