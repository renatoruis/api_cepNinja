const { makeIndex, indexBulk } = require('../../src/connection/elasticsearch')

module.exports = async (list) => {
  let arr = []

  const total = list.length

  for (const cepIndex in list) {
    const cep = list[cepIndex]
    cep.id = cep.cep
    arr.push(cep)

    if (cepIndex % 100 === 0) {
      await indexBulk({
        index: makeIndex(),
        type: 'cep',
        list: arr
      })

      console.log(`${cepIndex}/${total} ${(((100 * cepIndex) / total)).toFixed(2)}%`)
      arr = []
    }
  }
}
