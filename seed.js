import { MongoClient } from 'mongodb'

console.log('🏁 seed.js ----------------->')

// del archivo .env
const USER_DB = process.env.USER_DB;
const PASS = process.env.PASS;

const url = `mongodb://${USER_DB}:${PASS}@localhost:27017`;
const client = new MongoClient(url);

// Database Name
const dbName = 'tienda';

// función asíncrona
async function Inserta_datos_en_colección(colección, url) {
  try {
    // Conectar al cliente
    await client.connect();
    console.log('Conectado a MongoDB para insertar');

    const datos = await fetch(url).then(res => res.json());
    //console.log(datos);

    // Insertar datos en la BD aquí
    const database = client.db(dbName);
    const collection = database.collection(colección);

    // Insertar los datos en la colección
    for (const dato of datos ){
      const existe = await collection.findOne({ id: dato.id });
     
      if(!existe){
        await collection.insertOne(dato);
      }
    }
    
    return `${datos.length} datos traídos para ${colección}`;
  } catch (err) {
    console.error(`Error en la inserción de la colección ${colección}:`, err.message);
    throw err;
  } finally {
    // Cerrar la conexión
    await client.close();
    console.log('Conexión cerrada');
  }
}

// Inserción consecutiva
Inserta_datos_en_colección('productos', 'https://fakestoreapi.com/products')
  .then((r) => console.log(`Todo bien: ${r}`))                                 // OK
  .then(() => Inserta_datos_en_colección('usuarios', 'https://fakestoreapi.com/users'))
  .then((r) => console.log(`Todo bien: ${r}`))                                // OK
  .catch((err) => console.error('Algo mal: ', err));

/**
 * MONGODUMP
 * mongodump --uri="mongodb://root:example@localhost:27017/tienda?authSource=admin"
 * 
 * 
 */

  
