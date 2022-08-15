var dotenv = require('dotenv')
var dotenvExpand = require('dotenv-expand')
var myEnv = dotenv.config()
dotenvExpand.expand(myEnv)

import { Table } from 'console-table-printer'
import { getAvg, getBenchmark, getPercentageDifference } from './utils'
import { allOperations } from './ops'
import { prismaClient } from './prisma'
import { disconnectNativeMongoClient } from './mongo'
import { connect, disconnect } from 'mongoose'
import signale, { Signale } from "signale";


const persistConsole = () => console.log()

const ITERATION_SIZE = 100000
const main = async () => {
  console.debug("Starting...")
  // Connect the clients
  await prismaClient.$connect()
  await connect(process.env.MONGOOSE_DATABASE_URL as string);

  for (const [opName, { prisma, mongoose, description }] of Object.entries(allOperations)) {
    console.log("\n")
    signale.start({ message: `${description} (${opName})` })

    const s = new Signale({ interactive: true, scope: opName })
    // clean DBs
    s.await("PRISMA: Clean data")
    await prisma.reset();
    s.success("PRISMA: Clean data")

    persistConsole()

    s.await("MONGOOSE: Clean data")
    await mongoose.reset();
    s.success("MONGOOSE: Clean data")

    persistConsole()

    let size = ITERATION_SIZE;

    const results = new Table({
      title: `${description} (${opName})`,
      columns: [
        { name: "size", title: "Collection size" },
        { name: "prismaAvg", title: "Prisma average (ms)" },
        { name: "mongooseAvg", title: "Mongoose average (ms)" },
        { name: "pDiff", title: "% difference" }
      ]
    });

    while (size <= 1000000) {
      const ss = new Signale({ interactive: true, scope: [opName, String(size)] as any })
      // seed
      ss.await("PRISMA: Seed")
      await prisma.seed(size)
      ss.success("PRISMA: Seed")

      ss.await("MONGOOSE: Seed")
      await mongoose.seed(size)
      ss.success("MONGOOSE: Seed")


      // run benchmark
      ss.await("PRISMA: Execute benchmark")
      const prismaTimings = await getBenchmark(opName, prisma.execute)
      ss.success("PRISMA: Execute benchmark")

      ss.await("MONGOOSE: Execute benchmark")
      const mongooseTimings = await getBenchmark(opName, mongoose.execute)
      ss.success("MONGOOSE: Execute benchmark")

      const prismaAvg = getAvg(prismaTimings)
      const mongooseAvg = getAvg(mongooseTimings)

      results.addRow({
        size,
        prismaAvg: prismaAvg.toFixed(1),
        mongooseAvg: mongooseAvg.toFixed(1),
        pDiff: getPercentageDifference(prismaAvg, mongooseAvg).toFixed(1) + "%"
      })
      ss.success(`Executed benchmark for size #${size}`)
      persistConsole()
      size = size + ITERATION_SIZE

    }
    console.log("\n")
    results.printTable()
  }

  console.log("Done with benchmarks")
}

main()
  .then(async () => {
    await prismaClient.$disconnect()
    await disconnectNativeMongoClient()
    await disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prismaClient.$disconnect()
    process.exit(1)
  })