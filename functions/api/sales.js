export async function onRequest(context) {
  console.log("Sales API called");

  try {
    const { DB } = context.env;
    console.log("DB object:", !!DB);

    if (!DB) {
      console.log("No DB found in context.env");
      return Response.json({ error: "Database not found" }, { status: 500 });
    }

    console.log("Attempting database query...");
    const sales = await DB.prepare("SELECT * FROM sales").all();
    console.log("Query successful, results:", sales);

    return Response.json(sales.results);
  } catch (error) {
    console.log("Database error:", error.message);
    return Response.json(
      {
        error: "Database error",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
