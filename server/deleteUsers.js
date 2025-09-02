require("dotenv").config();
const mongoose = require("mongoose");

async function deleteAllUsers() {
  try {
    // connect to DB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // delete all users from users collection
    const result = await mongoose.connection.db.collection("users").deleteMany({});
    console.log(`${result.deletedCount} users deleted`);

    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  } catch (err) {
    console.error("Error deleting users:", err);
  }
}

deleteAllUsers();
