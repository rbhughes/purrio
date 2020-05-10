/*
let a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]

let chunks = []
let chunk = 8

const arrayChunks = (a, size) => {
  var chunks = []
  for (var i = 0; i < a.length; i += size) {
    chunks.push(a.slice(i, i + size))
  }
  return chunks
}
//console.log(chunkArrayInGroups(["a", "b", "c", "d"], 2));
//
let c = arrayChunks(a, 3)
console.log(c)
*/
/*
let notes = [{a: 1, b: 2}, {a: 4, b: 4}, {a: 9, b: 3}, {a: 5, b: 4}]

let cn = {a: 8, b: 8}

const f = b => {
  let a = [...notes, b]
  console.log(a)
}

f(cn)
*/

const batchSelector = (opts) => {
  let { count, chunk = 1, selector } = opts
  console.log(`count=${count}`)
  console.log(`chunk=${chunk}`)
  console.log(selector)
  const selectors = []
  const start = 1
  let x = 0
  x = start
  while ((count - x) * chunk >= 0) {
    chunk = x + chunk > count ? count - x + start : chunk
    const sql =
      `SELECT TOP ${chunk} START AT ${x} ` +
      `${selector.select.substring(7)} ` + // remove the 'SELECT'
      `${selector.where} ${selector.order};`
    selectors.push(sql)
    x += chunk
  }
  return selectors
}

const opts = {
  selector: {
    select: 'select blah from well',
    where: '',
    order: 'order by blah'
  },
  count: 147,
  chunk: '10'
}

let bs = batchSelector(opts)
console.log(bs)
