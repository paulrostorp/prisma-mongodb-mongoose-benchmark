import { randFullName } from "@ngneat/falso"
import { getOrCreateClient } from "./mongo"
import { prismaClient } from "./prisma"
import { ObjectId } from "mongodb"
import { User } from "./mongoose"

type TPromise = () => Promise<void>

const deleteUsers = async (db: "prisma" | "mongoose") => {
  // have to use mongo client, deleting more than a few hundred thousands docs fails with prisma client
  const client = await getOrCreateClient(db)
  await client.db().collection("users").deleteMany({})
}

const seedUsers = async (seedSize: number, db: "prisma" | "mongoose") => {
  const client = await getOrCreateClient(db)

  const toSeed = seedSize - await client.db().collection("users").countDocuments();
  if (toSeed > 0) {

    const userIds = [...new Array(toSeed)].map(() => new ObjectId().toString())

    await client.db().collection("users").insertMany(userIds.map((id) => ({
      _id: new ObjectId(id),
      email: new ObjectId().toString(),
      name: randFullName(),
    })))
  }
}

interface IOp {
  reset: TPromise
  execute: TPromise
  seed: (seedSize: number) => Promise<void>
}

interface IOps {
  [key: string]: {
    description: string
    prisma: IOp
    mongoose: IOp
  }
}

export const allOperations: IOps = {
  user_by_id: {
    description: "Fetch a single user by ID if exists",
    prisma: {
      reset: () => deleteUsers("prisma"),
      seed: (seedSize) => seedUsers(seedSize, "prisma"),
      execute: async () => {

        await prismaClient.user.findFirst({
          where: {
            id: new ObjectId().toString()
          }
        })
      }
    },
    mongoose: {
      reset: () => deleteUsers("mongoose"),
      seed: (seedSize) => seedUsers(seedSize, "mongoose"),
      execute: async () => {
        await User.find({
          _id: new ObjectId().toString()
        })
      }
    }
  },
  user_in: {
    description: "Fetch a list user from an array of IDs",
    prisma: {
      reset: () => deleteUsers("prisma"),
      seed: (seedSize) => seedUsers(seedSize, "prisma"),
      execute: async () => {

        await prismaClient.user.findMany({
          where: {
            id: {
              in: [new ObjectId().toString()]
            }
          }
        })
      }
    },
    mongoose: {
      reset: () => deleteUsers("mongoose"),
      seed: (seedSize) => seedUsers(seedSize, "mongoose"),
      execute: async () => {
        await User.find({
          _id: { $in: [new ObjectId().toString()] }
        })
      }
    }
  },
  user_find_non_indexed: {
    description: "Fetch user(s) by filtering on a non-indexed field",
    prisma: {
      reset: () => deleteUsers("prisma"),
      seed: (seedSize) => seedUsers(seedSize, "prisma"),
      execute: async () => {

        await prismaClient.user.findMany({
          where: {
            name: new ObjectId().toString()
          }
        })
      }
    },
    mongoose: {
      reset: () => deleteUsers("mongoose"),
      seed: (seedSize) => seedUsers(seedSize, "mongoose"),
      execute: async () => {
        await User.find({
          name: new ObjectId().toString()
        })
      }
    }
  },
  upsert_user: {
    description: "Upsert a single user",
    prisma: {
      reset: () => deleteUsers("prisma"),
      seed: (seedSize) => seedUsers(seedSize, "prisma"),
      execute: async () => {

        await prismaClient.user.upsert({
          where: {
            id: new ObjectId().toString(),
          },
          create: {
            email: new ObjectId().toString(),
            name: randFullName(),
          },
          update: {
            name: randFullName(),
          }
        })

      }
    },
    mongoose: {
      reset: () => deleteUsers("mongoose"),
      seed: (seedSize) => seedUsers(seedSize, "mongoose"),
      execute: async () => {
        await User.updateOne({ _id: new ObjectId().toString() },
          { $set: { email: new ObjectId().toString(), name: randFullName(), } },
          { upsert: true }
        )
      }
    }
  }
}