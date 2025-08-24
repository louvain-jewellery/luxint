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
      const formData = await request.formData();
      const name = formData.get("name");
      const imageFile = formData.get("image");

      let imageUrl = null;

      if (imageFile && imageFile.size > 0) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", imageFile);
        uploadFormData.append("upload_preset", "sales_images");

        const cloudinaryResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${context.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: uploadFormData,
          }
        );

        if (cloudinaryResponse.ok) {
          const result = await cloudinaryResponse.json();
          imageUrl = result.secure_url;
        }
      }

      const result = await DB.prepare(
        "INSERT INTO sales (name, image) VALUES (?, ?)"
      )
        .bind(name, imageUrl)
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

  if (request.method === "PUT") {
    try {
      const formData = await request.formData();
      const id = formData.get("id");
      const name = formData.get("name");
      const imageFile = formData.get("image");

      if (!id) {
        return Response.json(
          { error: "Sales ID is required for update" },
          { status: 400 }
        );
      }

      const existingSales = await DB.prepare("SELECT * FROM sales WHERE id = ?")
        .bind(id)
        .first();

      if (!existingSales) {
        return Response.json(
          { error: "Sales person not found" },
          { status: 404 }
        );
      }

      let finalName = name || existingSales.name;
      let finalImageUrl = existingSales.image;

      if (imageFile && imageFile.size > 0) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", imageFile);
        uploadFormData.append("upload_preset", "sales_images");

        const cloudinaryResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${context.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: uploadFormData,
          }
        );

        if (cloudinaryResponse.ok) {
          const result = await cloudinaryResponse.json();
          finalImageUrl = result.secure_url;
        }
      }

      const result = await DB.prepare(
        "UPDATE sales SET name = ?, image = ? WHERE id = ?"
      )
        .bind(finalName, finalImageUrl, id)
        .run();

      if (result.meta.changes === 0) {
        return Response.json({ error: "No changes made" }, { status: 400 });
      }

      return Response.json({
        success: true,
        message: "Sales person updated successfully",
      });
    } catch (error) {
      return Response.json(
        { error: "Failed to update sales person" },
        { status: 500 }
      );
    }
  }

  if (request.method === "DELETE") {
    try {
      const formData = await request.formData();
      const id = formData.get("id");

      if (!id) {
        return Response.json(
          { error: "Sales ID is required for deletion" },
          { status: 400 }
        );
      }

      const existingSales = await DB.prepare("SELECT * FROM sales WHERE id = ?")
        .bind(id)
        .first();

      if (!existingSales) {
        return Response.json(
          { error: "Sales person not found" },
          { status: 404 }
        );
      }

      const result = await DB.prepare("DELETE FROM sales WHERE id = ?")
        .bind(id)
        .run();

      if (result.meta.changes === 0) {
        return Response.json(
          { error: "Failed to delete sales person" },
          { status: 400 }
        );
      }

      return Response.json({
        success: true,
        message: "Sales person deleted successfully",
      });
    } catch (error) {
      return Response.json(
        { error: "Failed to delete sales person" },
        { status: 500 }
      );
    }
  }

  return Response.json({ error: "Method not allowed" }, { status: 405 });
}
