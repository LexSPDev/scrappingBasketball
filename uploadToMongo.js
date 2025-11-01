import { MongoClient } from "mongodb";

// 🔹 Configura tu conexión a MongoDB
const MONGO_URI = "";
const DB_NAME = "nbaData";

/**
 * Sube dos colecciones (players y games) a MongoDB
 * @param {Array|Object} playersData - Datos JSON para la colección de jugadores
 * @param {Array|Object} gamesData - Datos JSON para la colección de partidos
 * @param {string} playersCollection - Nombre de la colección de jugadores (default: "players")
 * @param {string} gamesCollection - Nombre de la colección de partidos (default: "games")
 */
export default async function uploadToMongo(
  playersData,
  gamesData,
  playersCollection = "players",
  gamesCollection = "games"
) {
  const client = new MongoClient(MONGO_URI);

  try {
    console.log(`📡 Conectando a MongoDB (${DB_NAME})...`);
    await client.connect();
    const db = client.db(DB_NAME);

    const collections = [
      { name: playersCollection, data: playersData },
      { name: gamesCollection, data: gamesData },
    ];

    for (const { name, data } of collections) {
      if (!data || (Array.isArray(data) && data.length === 0)) {
        console.warn(`⚠️ No hay datos para la colección "${name}". Saltando...`);
        continue;
      }

      const collection = db.collection(name);
      const docs = Array.isArray(data) ? data : [data];

      console.log(`📦 Subiendo ${docs.length} documentos a la colección "${name}"...`);

      // Opcional: limpiar antes de insertar
      // await collection.deleteMany({});

      const result = await collection.insertMany(docs);
      console.log(`✅ Subidos ${result.insertedCount} documentos a "${name}".`);
    }

    console.log("🚀 Carga completada correctamente en MongoDB.");
  } catch (err) {
    console.error("❌ Error al subir colecciones a MongoDB:", err.message);
  } finally {
    await client.close();
  }
}
