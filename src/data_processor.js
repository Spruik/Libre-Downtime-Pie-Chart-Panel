import * as utils from './utils'

/**
 * Expecting columns names, and rows values
 * Return {col-1 : value-1, col-2 : value-2 .....}
 * @param {*} rowCols
 * @param {*} rows
 */
export function restructuredData (rowCols, rows) {
  const data = []
  const cols = rowCols.reduce((arr, c) => {
    const col = c.text.toLowerCase()
    arr.push(col)
    return arr
  }, [])
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const serise = {}
    for (let k = 0; k < cols.length; k++) {
      const col = cols[k]
      serise[col] = row[k]
    }
    data.push(serise)
  }

  return data
}

/**
 * Expecting the restructured datalist
 * Return an array with distinct categories  --> ['category-1', 'category-2', ...]
 * @param {*} data
 */
export function getCategories (data) {
  const categories = data.reduce((arr, d) => {
    if (d.category !== null && d.category !== undefined) {
      arr.push(d.category)
    }
    return arr
  }, [])

  return Array.from(new Set(categories))
}

/**
 * Expecting categories-legends and the restructured datalist
 * For each legend, filter this legends data from the datalist, and then return an array of obj in this format
 * [{value: categoryData.length, type: 'Category', name: category}, .....]
 *
 * Note: The first item will be set to be selected = true
 *
 * @param {*} categories
 * @param {*} data
 */
export function getCategoriesData (categories, data) {
  const categoriesData = []

  let sum = 0
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i]
    const categoryData = data.filter(d => d.category === category)

    let duration = 0.00
    for (let i = 0; i < categoryData.length; i++) {
      const c = categoryData[i]
      if (c.durationint) {
        duration += c.durationint
      }
    }

    const item = { value: categoryData.length, type: 'Category', name: category, duration: duration, isDurationMode: false }
    sum += item.value

    categoriesData.push(item)
  }

  for (let i = 0; i < categoriesData.length; i++) {
    let percent = (categoriesData[i].value / sum * 100)
    if (hasDecimal(percent)) {
      percent = parseFloat(percent.toFixed(2))
    }
    categoriesData[i].p = percent
  }

  return categoriesData
}

export function getReasonsData (category, data) {
  const reasonsData = []

  const items = takeItems(category, data)

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    const reasonData = data.filter(d => d.category === category && d.parentreason === item)

    let duration = 0.00
    for (let i = 0; i < reasonData.length; i++) {
      const r = reasonData[i]
      if (r.durationint) {
        duration += r.durationint
      }
    }

    const reason = { value: reasonData.length, type: 'Reason', name: item, duration: duration, isDurationMode: false }
    reasonsData.push(reason)
  }

  return reasonsData
}

export function toDuration (data) {
  const d = utils.copyObject(data)
  for (let i = 0; i < d.length; i++) {
    d[i].value = d[i].duration / 1000000
    d[i].isDurationMode = true
  }
  return d
}

/**
 * Expecting a duration int value, return (string) hours and mins like 2:35 meaning 2 hours and 35 mins
 * if val is under 1 hour,  return (string) mins like 55-mins
 * @param {*} val
 */
export function toHrsAndMins (difference) {
  const daysDiff = Math.floor(difference / 1000 / 60 / 60 / 24)
  difference -= daysDiff * 1000 * 60 * 60 * 24

  let hrsDiff = Math.floor(difference / 1000 / 60 / 60)
  difference -= hrsDiff * 1000 * 60 * 60

  const minsDiff = Math.floor(difference / 1000 / 60)
  difference -= minsDiff * 1000 * 60

  const secsDiff = Math.floor(difference / 1000)
  difference -= minsDiff * 1000

  const timeToAdd = daysDiff * 24
  hrsDiff = hrsDiff + timeToAdd

  if (hrsDiff === 0 && minsDiff === 0) {
    return secsDiff + ' Seconds'
  } else if (hrsDiff === 0 && minsDiff !== 0) {
    return minsDiff + ' Minutes'
  }

  return hrsDiff + ' Hrs & ' + minsDiff + ' Mins'
}

// look for the distinct items that this category has
function takeItems (category, data) {
  return Array.from(new Set(data.reduce((arr, d) => {
    if (d.reason !== null && d.reason !== undefined) {
      // because the reasons in the influxdb is stored like 'root reason | sub reason'
      // reasons.length === 1 meaning that there is no sub reasons for this item
      // because this chart only display categories and reasons up to reason level - 1
      if (d.category === category && d.parentreason !== null && d.parentreason !== undefined) {
        arr.push(d.parentreason)
      }
    }
    return arr
  }, [])))
}

function hasDecimal (n) {
  return (n - Math.floor(n)) !== 0
}
