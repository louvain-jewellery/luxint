export async function onRequest(context) {
  const { DB } = context.env;

  try {
    const customers = await DB.prepare("SELECT * FROM customers").all();
    return Response.json(customers.results);
  } catch (error) {
    return Response.json({ error: "Database error" }, { status: 500 });
  }
}