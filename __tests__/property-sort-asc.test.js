import request from 'supertest';
import fc from 'fast-check';
import app from '../index.js';

/**
 * Feature: shopping-server, Property 9: Sort ascending returns items in ascending price order
 *
 * Validates: Requirements 8.1, 8.3, 8.5
 */

const snacks = [
  { id: 1, name: 'Chips', price: 2.99, quantity: 50 },
  { id: 2, name: 'Cookies', price: 3.49, quantity: 30 },
  { id: 3, name: 'Candy Bar', price: 1.25, quantity: 80 },
  { id: 4, name: 'Pretzels', price: 4.49, quantity: 40 },
  { id: 5, name: 'Popcorn', price: 1.99, quantity: 60 },
  { id: 6, name: 'Granola Bar', price: 2.50, quantity: 70 },
  { id: 7, name: 'Trail Mix', price: 5.99, quantity: 25 },
  { id: 8, name: 'Gummy Bears', price: 3.25, quantity: 90 },
  { id: 9, name: 'Beef Jerky', price: 7.99, quantity: 15 },
  { id: 10, name: 'Rice Cakes', price: 3.99, quantity: 35 },
];

const electronics = [
  { id: 1, name: 'Headphones', price: 29.99, quantity: 20 },
  { id: 2, name: 'USB Cable', price: 9.99, quantity: 100 },
  { id: 3, name: 'Mouse', price: 19.99, quantity: 45 },
  { id: 4, name: 'Keyboard', price: 49.99, quantity: 30 },
  { id: 5, name: 'Webcam', price: 39.99, quantity: 25 },
  { id: 6, name: 'USB Hub', price: 14.99, quantity: 60 },
  { id: 7, name: 'Monitor Stand', price: 24.99, quantity: 15 },
  { id: 8, name: 'HDMI Cable', price: 7.99, quantity: 80 },
  { id: 9, name: 'Power Bank', price: 34.99, quantity: 35 },
  { id: 10, name: 'Phone Charger', price: 12.99, quantity: 90 },
];

function assertAscendingSortAndSameItems(sortedItems, sourceItems) {
  for (let i = 0; i < sortedItems.length - 1; i++) {
    expect(sortedItems[i].price).toBeLessThanOrEqual(sortedItems[i + 1].price);
  }
  expect(sortedItems).toHaveLength(sourceItems.length);
  for (const expected of sourceItems) {
    expect(sortedItems.find(item => item.id === expected.id)).toEqual(expected);
  }
}

describe('Property 9: Sort ascending returns items in ascending price order', () => {
  it('GET /snacks?sort=asc', async () => {
    await fc.assert(fc.asyncProperty(fc.constant(null), async () => {
      const res = await request(app).get('/snacks?sort=asc');
      assertAscendingSortAndSameItems(res.body, snacks);
    }), { numRuns: 100 });
  });

  it('GET /electronics?sort=asc', async () => {
    await fc.assert(fc.asyncProperty(fc.constant(null), async () => {
      const res = await request(app).get('/electronics?sort=asc');
      assertAscendingSortAndSameItems(res.body, electronics);
    }), { numRuns: 100 });
  });

  it('GET /?sort=asc returns both sorted ascending', async () => {
    await fc.assert(fc.asyncProperty(fc.constant(null), async () => {
      const res = await request(app).get('/?sort=asc');
      expect(res.body).toHaveProperty('snacks');
      expect(res.body).toHaveProperty('electronics');
      assertAscendingSortAndSameItems(res.body.snacks, snacks);
      assertAscendingSortAndSameItems(res.body.electronics, electronics);
    }), { numRuns: 100 });
  });
});
