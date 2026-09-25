// src/utils/random.js

/**
 * Shuffles an array using the Fisher-Yates (Durstenfeld) algorithm.
 *
 * @param {Array} array - The source array to shuffle.
 * @returns {Array} A new array containing the shuffled elements.
 */
export const shuffleArray = (array) => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = shuffled[i]
    const selected = shuffled[j]

    if (temp !== undefined && selected !== undefined) {
      shuffled[i] = selected
      shuffled[j] = temp
    }
  }
  return shuffled
}

/**
 * Creates a random bag generator function that yields items without immediate repeats.
 * Automatically refills and reshuffles the bag once exhausted.
 *
 * @param {Array} items - The initial list of items to draw from.
 * @param {Function} getId - Callback function returning a unique identifier for item comparison.
 * @returns {Function} A closure function returning the next non-repeating item.
 * @throws {Error} Throws an error if the initial items array is empty.
 */
export const createRandomBag = (items, getId) => {
  if (items.length === 0) {
    throw new Error('createRandomBag cannot be initialized with an empty array.')
  }

  let bag = []

  return (currentItem) => {
    if (bag.length === 0) {
      bag = shuffleArray(items)

      // Prevent immediate duplicate if the new bag's first item matches the previous item
      const firstItem = bag[0]
      if (
        currentItem !== undefined &&
        firstItem !== undefined &&
        bag.length > 1 &&
        getId(firstItem) === getId(currentItem)
      ) {
        const shiftedItem = bag.shift()
        if (shiftedItem !== undefined) {
          bag.push(shiftedItem)
        }
      }
    }

    const nextItem = bag.pop()
    if (nextItem === undefined) {
      const fallbackItem = items[0]
      if (fallbackItem === undefined) {
        throw new Error('Bag execution failed: Source items array is empty.')
      }
      return fallbackItem
    }

    return nextItem
  }
}