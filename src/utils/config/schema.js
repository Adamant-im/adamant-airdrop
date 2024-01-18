import { z } from 'zod'
import { logLevelNames } from '../logger/const.js'

export const schema = z
  .object({
    passphrase: z.string(),
    inputFile: z.string(),
    outputPath: z.string().default('output'),
    amount: z.number(),
    nodes: z.string().url().array(),
    logLevel: z.enum(logLevelNames).default('none'),
    skipDuplicates: z.boolean().default(true)
  })
  .strict()
