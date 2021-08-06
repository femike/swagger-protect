/**
 * @see https://flut1.medium.com/deep-flatten-typescript-types-with-finite-recursion-cb79233d93ca
 * @see https://www.typescriptlang.org/play?ssl=28&ssc=47&pln=1&pc=1#code/C4TwDgpgBAqgdgSwPZwCpIJJ2BATgZwgGNhk4AeVAPigF4oAoKKAClSggA8c4ATfKAFc4AazhIA7nEbNmAflacAXFFQBKOjWFjJ0prJVwIANzwauPfopUI4AMzxQAShtpbR4qTNkKn35oYmeAwMoJBQAMIoRACGwADKwLi2AObkTkhIwADSECAANFC5IDT0+swZWcUc3BB8AvhJqf6y8kV5NZYNTXApLa2tClAABgAkAN6VOXkAvgB0E8Uzw+UDrYGmuKvrUEabIWHQACIIjckARoKkpsX46ZnAhVO3nXVWInlIds4PdFAfIC+PyypRazzyAgsbwEe0c2x8uyCWzWAWBwAA2uCQPgALqverOYhIXC8chnVKFbSeOBUeFtVC4GJwfB2YkAW2K5BO5Mu1wgt3uWUxD1uOMKAKBU2FVQhOKoTxFENpKKgKgACggiCJBY80bdaaFwNAGUyWezOQB5c4AK2IuqxoPGq3R1Vs-0+3yttpIUBiAiicFiCR6aSxhWKVBxKi9dpdeRxDBmByNUAAsngUhAdaD4GR0FgcAQ7WQuacmryEDcIdmDYcoEcIBAwAAxAA2cR45BjJFBEu+6dwma7NrtBqIKEaUCQNr+4xaKAgKjndKgwAkSCX-RRwAAFrhGyoAOTGGKtwQQQ8rpOtGaFVaswS4TcruyVxdQY+n8+Hlq31b4BBlA-E8zwvRgk0NcJUAgSd6AbJs2w7OpyEOIFp2tKggA
 */
type UnionToIntersection<T> = (
  T extends unknown ? (x: T) => unknown : never
) extends (x: infer R) => unknown
  ? R
  : never

type ConcatString<RootKey, Key> = RootKey extends string
  ? Key extends string
    ? `${RootKey}.${Key}`
    : never
  : never

type DistributiveKeys<
  Root,
  RootKeys extends keyof Root = keyof Root,
> = RootKeys extends never
  ? never
  : Root[RootKeys] extends Record<string, unknown>
  ? TransformKey<
      DistributiveKeys<Root[RootKeys], keyof Root[RootKeys]>,
      RootKeys
    >
  : Pick<Root, RootKeys>

type TransformKey<Object, RootKey> = {
  [Key in keyof Object as ConcatString<RootKey, Key>]: Object[Key]
}

type Merge<Root> = UnionToIntersection<DistributiveKeys<Root>>

export type DeepFlatten<Object> = keyof Merge<Object>
