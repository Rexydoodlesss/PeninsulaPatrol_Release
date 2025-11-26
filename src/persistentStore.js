import { writable } from 'svelte/store';

export function persistentStore(key, initialValue) {
  let data = initialValue;

  if (typeof localStorage !== 'undefined') {
    const storedValue = localStorage.getItem(key);
    data = storedValue ? JSON.parse(storedValue) : initialValue;
  }

  const store = writable(data);

  if (typeof localStorage !== 'undefined') {
    store.subscribe(value => {
      localStorage.setItem(key, JSON.stringify(value));
    });
  }

  return store;
}