/**
 * @param {Object} obj - The object to flatten
 * @param {String} prefix - (Optional) The prefix to add before each key, also used for recursion
 **/
export default function flattenObject<
  T extends Record<string, { [x: string]: string } | string>,
>(obj: T, prefix: string | boolean = false, result: string[] = []) {
  for (const key in obj) {
    if (typeof obj[key] === 'object') {
      flattenObject(
        obj[key] as unknown as Record<string, { [x: string]: string }>,
        key,
      ).forEach(int => {
        result.push(key + '.' + int)
      })
    } else {
      result.push(key)
    }
  }

  return result
}

// const flattenObjectKeys = <T>(obj: T, prefix = '') =>
//   Object.keys(obj).reduce((acc, k) => {
//     const pre = prefix.length ? prefix + '.' : ''
//     if (typeof obj[k] === 'object')
//       Object.assign(acc, flattenObject(obj[k], pre + k))
//     else acc[pre + k] = obj[k]
//     return acc
//   }, {})
