import "@testing-library/jest-dom";

// --- Mock localStorage ---
Object.defineProperty(window, "localStorage", {
  value: {
    store: {},
    getItem(key) {
      return this.store[key] || null;
    },
    setItem(key, value) {
      this.store[key] = value;
    },
    removeItem(key) {
      delete this.store[key];
    },
    clear() {
      this.store = {};
    },
  },
  writable: true,
});

// --- Default fetch mock (can be overridden in individual tests) ---
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
);
