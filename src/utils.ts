type TFunc = () => Promise<void>

const measurePerformance = async (func: TFunc) => {
  const start = Date.now()
  await func()
  return Date.now() - start
}

export const getBenchmark = async (name: string, func: TFunc, numRuns = 10) => {
  let index = 0
  const timings: number[] = [];

  while (index < numRuns) {
    const timing = await measurePerformance(func);
    timings.push(timing)
    index++;
  }
  return timings
}

export const getAvg = (arr: number[]): number => {
  const sum = arr.reduce<number>((sum, curr) => sum + curr, 0)
  return sum / arr.length
}


export const getPercentageDifference = (numA: number, numB: number): number => {
  return ((numA - numB) / numB) * 100
}
