import { MongoClient } from "mongodb";

let mongoClients: {
  mongoose?: MongoClient,
  prisma?: MongoClient
} = {}


const getDbUri = (dbToUse: "prisma" | "mongoose"): string => dbToUse == "prisma" ? process.env.PRISMA_DATABASE_URL as string : process.env.MONGOOSE_DATABASE_URL as string


export const getOrCreateClient = async (dbToUse: "prisma" | "mongoose"): Promise<MongoClient> => {
  if (mongoClients[dbToUse]) return mongoClients[dbToUse] as MongoClient

  mongoClients[dbToUse] = new MongoClient(getDbUri(dbToUse));
  await mongoClients[dbToUse]?.connect()

  return mongoClients[dbToUse] as MongoClient
}

export const disconnectNativeMongoClient = async ()=>{
  for (const client of Object.values(mongoClients)) {
    await client.close()
  }
}

