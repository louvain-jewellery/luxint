export async function onRequest(context) {
  const { DB } = context.env;
  const { request } = context;

  // GET - Read all sales
  if (request.method === "GET") {
    try {
      const sales = await DB.prepare("SELECT * FROM sales").all();
      return Response.json(sales.results);
    } catch (error) {
      return Response.json({ error: "Database error" }, { status: 500 });
    }
  }

  // POST - Create new sales person
  if (request.method === "POST") {
    try {
      const { name, custCount, image } = await request.json();

      const result = await DB.prepare(
        "INSERT INTO sales (name, custCount, image) VALUES (?, ?, ?)"
      )
        .bind(name, custCount, image)
        .run();

      return Response.json({
        success: true,
        id: result.meta.last_row_id,
      });
    } catch (error) {
      return Response.json(
        { error: "Failed to create sales person" },
        { status: 500 }
      );
    }
  }

  return Response.json({ error: "Method not allowed" }, { status: 405 });
}
