const { MongoClient, ObjectId } = require("mongodb");
const readline = require("readline");

const url =
  "mongodb+srv://vigneshmongo:mongo@vigneshmongo.itudsgr.mongodb.net/?retryWrites=true&w=majority";
const dbName = "store";
const collectionName = "products";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function mainMenu() {
  console.log("\n--- Product Management ---");
  console.log("1. View Products");
  console.log("2. Add Product");
  console.log("3. Update Product");
  console.log("4. Delete Product");
  console.log("5. Exit\n");

  const option = await prompt("Select an option: ");
  switch (option) {
    case "1":
      await getProducts();
      break;
    case "2":
      await createProduct();
      break;
    case "3":
      await updateProduct();
      break;
    case "4":
      await deleteProduct();
      break;
    case "5":
      console.log("Exiting...");
      process.exit(0);
    default:
      console.error("Invalid option. Please try again.");
      await mainMenu();
  }
}

async function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer));
  });
}

async function connectToDb() {
  try {
    const client = await MongoClient.connect(url);
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    return { client, collection };
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

async function createProduct() {
  const { client, collection } = await connectToDb();
  const name = await prompt("Enter product name: ");
  const price = Number(await prompt("Enter product price: "));

  try {
    const result = await collection.insertOne({ name, price });
    console.log("Product created successfully:", result.insertedId);
  } catch (error) {
    console.error("Error creating product:", error);
  } finally {
    client.close();
  }
}

async function getProducts() {
  const { client, collection } = await connectToDb();
  try {
    const products = await collection.find({}).toArray();
    console.log("Products:");
    products.forEach((product) => console.log(product));
  } catch (error) {
    console.error("Error retrieving products:", error);
  } finally {
    client.close();
  }
}

async function updateProduct() {
  const { client, collection } = await connectToDb();
  const productId = await prompt("Enter product ID: ");

  try {
    const updateData = {};
    const name = await prompt("Enter new name (leave blank to skip): ");
    if (name) updateData.name = name;
    const price = await prompt("Enter new price (leave blank to skip): ");
    if (price) updateData.price = Number(price);

    const result = await collection.updateOne(
      { _id: new ObjectId(productId) },
      { $set: updateData }
    );

    console.log("Product updated successfully:", result.matchedCount);
  } catch (error) {
    console.error("Error updating product:", error);
  } finally {
    client.close();
  }
}

async function deleteProduct() {
  const { client, collection } = await connectToDb();
  const productId = await prompt("Enter product ID: ");

  try {
    const result = await collection.deleteOne({
      _id: new ObjectId(productId),
    });
    console.log("Product deleted successfully:", result.deletedCount);
  } catch (error) {
    console.error("Error deleting product:", error);
  } finally {
    client.close();
  }
}

mainMenu();
