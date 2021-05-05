const maxSize = 3000;
const store = new Map();

/**
 * Add new entry
 */
const set = (key: string, value: any) => {
  store.set(key, value);

  // Remove some items if store size is full
  if (store.size >= maxSize) {
    const maxDelete = Math.floor(maxSize / 10); // Purge 300 items
    let deleteCount = 0;

    // Do not delete all items
    for (const key of store.keys()) {
      deleteCount++;
      if (deleteCount < maxDelete) {
        store.delete(key);
      }
    }
  }
};

/**
 * Get entry
 */
const get = (key: string) => store.get(key);

export default {set, get};
