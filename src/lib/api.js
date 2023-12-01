import { AdamantApi } from 'adamant-api'
import { config } from '../config/index.js'

const api = new AdamantApi({
  nodes: config.nodes,
  logLevel: 'error',
  checkHealthAtStartup: false
})

export { api }
