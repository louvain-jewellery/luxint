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

  if (request.method === "PUT") {
    try {
      const formData = await request.formData();
      const id = formData.get("id");
      const salesId = formData.get("salesId");
      const name = formData.get("name");
      const phone = formData.get("phone");
      const ringSize = formData.get("ringSize");
      const braceletSize = formData.get("braceletSize");
      const address = formData.get("address");
      const job = formData.get("job");
      const favorite = formData.get("favorite");

      if (!id) {
        return (
          Response.json({ error: "Customer ID is required for update" }),
          { status: 400 }
        );
      }

      const existingCustomer = await DB.prepare(
        "SELECT * FROM customers WHERE id = ?"
      )
        .bind(id)
        .first();

      if (!existingCustomer) {
        return Response.json({ error: "Customer not found" }, { status: 400 });
      }

      const finalSalesId = salesId || existingCustomer.salesId;
      const finalName = name || existingCustomer.name;
      const finalPhone = phone || existingCustomer.phone;
      const finalRingSize = ringSize || existingCustomer.ringSize;
      const finalBraceletSize = braceletSize || existingCustomer.braceletSize;
      const finalAddress = address || existingCustomer.address;
      const finalJob = job || existingCustomer.job;
      const finalFavorite = favorite || existingCustomer.favorite;

      const result = await DB.prepare(
        "UPDATE customers SET salesId = ?, name = ?, phone = ?, ringSize = ?, braceletSize = ?, address = ?, job = ?, favorite = ? WHERE id = ?"
      )
        .bind(
          finalSalesId,
          finalName,
          finalPhone,
          finalRingSize,
          finalBraceletSize,
          finalAddress,
          finalJob,
          finalFavorite,
          id
        )
        .run();

      if (result.meta.changes === 0) {
        return Response.json({ error: "No changes made" }, { status: 400 });
      }

      return Response.json({
        success: true,
        message: "Customer update successfully",
      });
    } catch (error) {
      return Response.json(
        { error: "Failed to update customer" },
        { status: 500 }
      );
    }
  }

  if (request.method === "DELETE") {
    try {
      const formData = await request.formData();
      const id = formData.get("id");

      const existingCustomer = await DB.prepare(
        "SELECT * FROM customers WHERE id = ?"
      )
        .bind(id)
        .first();

      if (!existingCustomer) {
        return Response.json({ error: "Customer not found" }, { status: 404 });
      }

      const result = await DB.prepare("DELETE FROM customers WHERE id = ?")
        .bind(id)
        .run();

      if (result.meta.changes === 0) {
        return Response.json(
          { error: "Failed to delete customer" },
          { status: 400 }
        );
      }

      return Response.json({
        success: true,
        message: "Customer deleted successfully",
      });
    } catch (error) {
      return Response.json(
        { error: "Failed to delete customer" },
        { status: 500 }
      );
    }
  }

  return Response.json({ error: "Method not allowed" }, { status: 405 });
}
