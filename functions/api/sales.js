export async function onRequest(context) {
  const { DB } = context.env;

  try {
    const sales = await DB.prepare("SELECT * FROM sales").all();
    return Response.json(sales.result);
  } catch (error) {
    return Response.json({ error: "Database error" }, { status: 500 });
  }
}
