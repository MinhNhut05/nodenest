/**
 * FAKE DATABASE
 * (File này đã cho sẵn - không cần sửa)
 */

export const products = [
  { id: 1, name: "iPhone 15", price: 999, category: "phone", stock: 50 },
  { id: 2, name: "Samsung Galaxy S24", price: 899, category: "phone", stock: 30 },
  { id: 3, name: "MacBook Pro", price: 1999, category: "laptop", stock: 20 },
  { id: 4, name: "Dell XPS 15", price: 1599, category: "laptop", stock: 15 },
  { id: 5, name: "AirPods Pro", price: 249, category: "accessory", stock: 100 },
];

let nextId = 6;

export function getNextId() {
  return nextId++;
}
