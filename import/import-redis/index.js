const { getClient, makeKey } = require('../../src/connection/redis')
const { promisify } = require('util')
/**
 * Deprecated
 */
module.exports = async (list) => {
  const client = await getClient()

  const set = promisify(client.set).bind(client)

  const total = list.length

  for (const cepIndex in list) {
    const cep = list[cepIndex]
    await set(makeKey(cep.cep), JSON.stringify(cep))
    if (cepIndex % 1000 === 0) {
      console.log(`${cepIndex}/${total} ${(((100 * cepIndex) / total)).toFixed(2)}%`)
    }
  }
}
