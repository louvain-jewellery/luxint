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

  return Response.json({ error: "Method not allowed" }, { status: 405 });
}
