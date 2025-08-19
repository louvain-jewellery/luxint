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

      console.log("Name:", name); // Add this
      console.log("Image file:", imageFile); // Add this
      console.log("Image file size:", imageFile ? imageFile.size : "no file"); // Add this

      let imageUrl = null;

      if (imageFile && imageFile.size > 0) {
        // Upload to Cloudinary
        const uploadFormData = new FormData();
        uploadFormData.append("file", imageFile);
        uploadFormData.append("upload_preset", "sales_images");

        console.log("Uploading to Cloudinary..."); // Add this

        const cloudinaryResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${context.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: uploadFormData,
          }
        );

        console.log("Uploading to Cloudinary..."); // Add this

        if (cloudinaryResponse.ok) {
          const result = await cloudinaryResponse.json();
          console.log("Cloudinary result:", result); // Add this
          imageUrl = result.secure_url;
        } else {
          const error = await cloudinaryResponse.text();
          console.log("Cloudinary error:", error); // Add this
        }
      }

      console.log("Final imageUrl:", imageUrl); // Add this

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

  return Response.json({ error: "Method not allowed" }, { status: 405 });
}
