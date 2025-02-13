import { Counter } from "./types";

const STORAGE_KEY = "tasbih_counters";

// Initialize counters from localStorage or empty array
let counters: Counter[] = (() => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
})();

// Save counters to localStorage
function saveToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(counters));
}

export function getCounters(): Counter[] {
  return counters;
}

export function createCounter(data: { title: string; count: number }): Counter {
  const counter: Counter = {
    id: Math.random().toString(36).substring(7),
    title: data.title,
    count: data.count,
    current: 0,
  };
  counters = [...counters, counter];
  saveToStorage();
  return counter;
}

export function updateCounter(id: string, current: number): Counter {
  const counter = counters.find((c) => c.id === id);
  if (!counter) throw new Error("Counter not found");

  const updated = { ...counter, current };
  counters = counters.map((c) => (c.id === id ? updated : c));
  saveToStorage();
  return updated;
}

export function editCounter(id: string, data: { title: string; count: number }): Counter {
  const counter = counters.find((c) => c.id === id);
  if (!counter) throw new Error("Counter not found");

  const updated = { ...counter, ...data };
  counters = counters.map((c) => (c.id === id ? updated : c));
  saveToStorage();
  return updated;
}

export function deleteCounter(id: string): void {
  counters = counters.filter((c) => c.id !== id);
  saveToStorage();
}