export async function onRequest(context) {
  const { DB } = context.env;
  const { request } = context;

  if (request.method === "GET") {
    try {
      const customers = await DB.prepare("SELECT * FROM customers").all();
      return Response.json(customers.results);
    } catch (error) {
      return Response.json({ error: "Database error" }, { status: 500 });
    }
  }

  if (request.method === "POST") {
    try {
      const formData = await request.formData();
      const salesId = formData.get("salesId");
      const name = formData.get("name");
      const phone = formData.get("phone");
      const ringSize = formData.get("ringSize");
      const braceletSize = formData.get("braceletSize");
      const address = formData.get("address");
      const job = formData.get("job");
      const favorite = formData.get("favorite");

      const result = await DB.prepare(
        "INSERT INTO customers (salesId, name, phone, ringSize, braceletSize, address, job, favorite) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
      )
        .bind(
          salesId,
          name,
          phone,
          ringSize,
          braceletSize,
          address,
          job,
          favorite
        )
        .run();

      return Response.json({
        success: true,
        id: result.meta.last_row_id,
      });
    } catch (error) {
      return Response.json(
        { error: "Failed to create customer" },
        { status: 500 }
      );
    }
  }

  return Response.json({ error: "Method not allowed" }, { status: 405 });
}
