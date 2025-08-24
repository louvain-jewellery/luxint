export async function onRequest(context) {
  const { DB } = context.env;
  const { request } = context;

  if (request.method === "GET") {
    try {
      const items = await DB.prepare("SELECT * FROM purchased_items").all();
      return Response.json(items.results);
    } catch (error) {
      return Response.json({ error: "Database error" }, { status: 500 });
    }
  }

  if (request.method === "POST") {
    try {
      const formData = await request.formData();
      const customerId = formData.get("customerId");
      const type = formData.get("type");
      const itemName = formData.get("itemName");
      const weight = formData.get("weight");
      const date = formData.get("date");
      const goldPurity = formData.get("goldPurity");
      const sellingPrice = formData.get("sellingPrice");
      const imageFile = formData.get("productImage");

      let imageUrl = null;

      if (imageFile && imageFile.size > 0) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", imageFile);
        uploadFormData.append("upload_preset", "item_images");

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
        "INSERT INTO purchased_items (customerId, type, itemName, weight, date, goldPurity, sellingPrice, productImage) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
      )
        .bind(
          customerId,
          type,
          itemName,
          weight,
          date,
          goldPurity,
          sellingPrice,
          imageUrl
        )
        .run();

      return Response.json({
        success: true,
        id: result.meta.last_row_id,
      });
    } catch (error) {
      return Response.json({ error: "Failed to create item" }, { status: 500 });
    }
  }

  if (request.method === "PUT") {
    try {
      const formData = await request.formData();
      const id = formData.get("id");
      const customerId = formData.get("customerId");
      const type = formData.get("type");
      const itemName = formData.get("itemName");
      const weight = formData.get("weight");
      const date = formData.get("date");
      const goldPurity = formData.get("goldPurity");
      const sellingPrice = formData.get("sellingPrice");
      const imageFile = formData.get("productImage");

      if (!id) {
        return Response.json(
          { error: "Item ID is required for update" },
          { status: 400 }
        );
      }

      const existingItem = await DB.prepare(
        "SELECT * FROM purchased_items WHERE id = ?"
      )
        .bind(id)
        .first();

      if (!existingItem) {
        return Response.json({ error: "Item not found" }, { status: 404 });
      }

      const finalCustomerId = customerId || existingItem.customerId;
      const finalType = type || existingItem.type;
      const finalItemName = itemName || existingItem.itemName;
      const finalWeight = weight || existingItem.weight;
      const finalDate = date || existingItem.date;
      const finalGoldPurity = goldPurity || existingItem.goldPurity;
      const finalSellingPrice = sellingPrice || existingItem.sellingPrice;
      let finalImageUrl = existingItem.productImage;

      if (imageFile && imageFile.size > 0) {
        const uploadFormData = new FormData();
        uploadFormData.append("file", imageFile);
        uploadFormData.append("upload_preset", "item_images");

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
        "UPDATE purchased_items SET customerId = ?, type = ?, itemName = ?, weight = ?, date = ?, goldPurity = ?, sellingPrice = ?, productImage = ? WHERE id = ?"
      )
        .bind(
          finalCustomerId,
          finalType,
          finalItemName,
          finalWeight,
          finalDate,
          finalGoldPurity,
          finalSellingPrice,
          finalImageUrl,
          id
        )
        .run();

      if (result.meta.changes === 0) {
        return Response.json({ error: "No changes made" }, { status: 400 });
      }

      return Response.json({
        success: true,
        message: "Item updated successfully",
      });
    } catch (error) {
      return Response.json({ error: "Failed to update item" }, { status: 500 });
    }
  }

  if (request.method === "DELETE") {
    try {
      const formData = await request.formData();
      const id = formData.get("id");

      if (!id) {
        return Response.json(
          { error: "Item ID is required for deletion" },
          { status: 400 }
        );
      }

      const existingItem = await DB.prepare(
        "SELECT * FROM purchased_items WHERE id = ?"
      )
        .bind(id)
        .first();

      if (!existingItem) {
        return Response.json({ error: "Item not found" }, { status: 404 });
      }

      const result = await DB.prepare(
        "DELETE FROM purchased_items WHERE id = ?"
      )
        .bind(id)
        .run();

      if (result.meta.changes === 0) {
        return Response.json(
          { error: "Failed to delete item" },
          { status: 400 }
        );
      }

      return Response.json({
        success: true,
        message: "Item deleted successfully",
      });
    } catch (error) {
      return Response.json({ error: "Failed to delete item" }, { status: 500 });
    }
  }

  return Response.json({ error: "Method not allowed" }, { status: 405 });
}
