import dotenv from "dotenv";
import { MongoClient, ServerApiVersion } from "mongodb";

dotenv.config();

const URI = process.env.ATLAS_URI;
if (!URI) {
  throw new Error("❌ ATLAS_URI n'est pas défini dans ton .env");
}

const client = new MongoClient(URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db;

async function connectDB() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Connecté à MongoDB avec succès !");
    db = client.db("employees"); // <-- ta base
  } catch (err) {
    console.error("❌ Erreur de connexion MongoDB :", err);
    process.exit(1); // Arrête le serveur si Mongo échoue
  }
}

await connectDB();

export default db;
