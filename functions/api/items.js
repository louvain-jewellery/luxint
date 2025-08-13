export async function onRequest(context) {
  const { DB } = context.env;

  try {
    const items = await DB.prepare("SELECT * FROM purchased_items").all();
    return Response.json(items.results);
  } catch (error) {
    return Response.json({ error: "Database error" }, { status: 500 });
  }
}
