# About
Runs benchmarks of prisma vs. mongoose for mongoDB.

Operations to be tested are defined in `src/ops.ts`, each operation is run 10 times and the average is used.

Prisma tests and mongoose tests are run against their own databases (see `.env` file to get local address)

# Usage

```sh
docker-compose up -d
```

```sh
yarn install
```

```sh
npx prisma generate
```

```sh
npx prisma db push
```

```sh
yarn benchmark
```

# Results
Run on MBP 14" 2021, Apple M1 Pro, 32GB RAM

With Prisma `v4.2.1`

```
                Fetch a single user by ID if exists (user_by_id)
┌─────────────────┬─────────────────────┬───────────────────────┬──────────────┐
│ Collection size │ Prisma average (ms) │ Mongoose average (ms) │ % difference │
├─────────────────┼─────────────────────┼───────────────────────┼──────────────┤
│          100000 │                 3.7 │                   1.6 │       131.3% │
│          200000 │                 3.0 │                   1.6 │        87.5% │
│          300000 │                 2.5 │                   1.4 │        78.6% │
│          400000 │                 2.8 │                   1.4 │       100.0% │
│          500000 │                 3.2 │                   1.3 │       146.2% │
│          600000 │                 3.3 │                   1.7 │        94.1% │
│          700000 │                 2.4 │                   1.3 │        84.6% │
│          800000 │                 3.7 │                   1.1 │       236.4% │
│          900000 │                 1.8 │                   1.4 │        28.6% │
│         1000000 │                 2.4 │                   1.9 │        26.3% │
└─────────────────┴─────────────────────┴───────────────────────┴──────────────┘
```

```
                Fetch a list user from an array of IDs (user_in)
┌─────────────────┬─────────────────────┬───────────────────────┬──────────────┐
│ Collection size │ Prisma average (ms) │ Mongoose average (ms) │ % difference │
├─────────────────┼─────────────────────┼───────────────────────┼──────────────┤
│          100000 │                31.3 │                   2.5 │      1152.0% │
│          200000 │                54.7 │                   2.7 │      1925.9% │
│          300000 │                83.1 │                   2.4 │      3362.5% │
│          400000 │               103.5 │                   2.6 │      3880.8% │
│          500000 │               129.8 │                   2.5 │      5092.0% │
│          600000 │               155.5 │                   2.0 │      7675.0% │
│          700000 │               177.6 │                   2.1 │      8357.1% │
│          800000 │               200.5 │                   2.6 │      7611.5% │
│          900000 │               225.8 │                   1.8 │     12444.4% │
│         1000000 │               251.6 │                   1.7 │     14700.0% │
└─────────────────┴─────────────────────┴───────────────────────┴──────────────┘
```

```
   Fetch user(s) by filtering on a non-indexed field (user_find_non_indexed)
┌─────────────────┬─────────────────────┬───────────────────────┬──────────────┐
│ Collection size │ Prisma average (ms) │ Mongoose average (ms) │ % difference │
├─────────────────┼─────────────────────┼───────────────────────┼──────────────┤
│          100000 │                34.3 │                  22.7 │        51.1% │
│          200000 │                63.3 │                  43.0 │        47.2% │
│          300000 │                92.1 │                  60.0 │        53.5% │
│          400000 │               118.6 │                  78.6 │        50.9% │
│          500000 │               150.2 │                  98.3 │        52.8% │
│          600000 │               172.2 │                 117.2 │        46.9% │
│          700000 │               201.0 │                 140.9 │        42.7% │
│          800000 │               231.2 │                 153.4 │        50.7% │
│          900000 │               257.6 │                 173.9 │        48.1% │
│         1000000 │               287.1 │                 194.8 │        47.4% │
└─────────────────┴─────────────────────┴───────────────────────┴──────────────┘
```

```
                       Upsert a single user (upsert_user)
┌─────────────────┬─────────────────────┬───────────────────────┬──────────────┐
│ Collection size │ Prisma average (ms) │ Mongoose average (ms) │ % difference │
├─────────────────┼─────────────────────┼───────────────────────┼──────────────┤
│          100000 │                 9.4 │                   2.4 │       291.7% │
│          200000 │                 6.5 │                   3.8 │        71.1% │
│          300000 │                 9.3 │                   3.0 │       210.0% │
│          400000 │                 4.7 │                   1.9 │       147.4% │
│          500000 │                 5.8 │                   2.8 │       107.1% │
│          600000 │                 7.8 │                   2.5 │       212.0% │
│          700000 │                 6.8 │                   3.4 │       100.0% │
│          800000 │                 6.0 │                   2.9 │       106.9% │
│          900000 │                 6.6 │                   1.9 │       247.4% │
│         1000000 │                 5.9 │                   3.4 │        73.5% │
└─────────────────┴─────────────────────┴───────────────────────┴──────────────┘
```