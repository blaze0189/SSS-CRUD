import request from 'supertest';
import fc from 'fast-check';
import app from '../index.js';

/**
 * Feature: shopping-server, Property 5: Category filter returns correct subset
 *
 * Validates: Requirements 6.1, 6.2
 */

const expectedSnacks = [
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

const expectedElectronics = [
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

const expectedData = { snacks: expectedSnacks, electronics: expectedElectronics };

describe('Property 5: Category filter returns correct subset', () => {
  it('GET /?category={value} returns exactly the matching collection', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.oneof(fc.constant('snacks'), fc.constant('electronics')),
        async (category) => {
          const res = await request(app).get(`/?category=${category}`);
          expect(Array.isArray(res.body)).toBe(true);
          const expected = expectedData[category];
          const other = category === 'snacks' ? expectedElectronics : expectedSnacks;
          expect(res.body).toEqual(expected);
          for (const otherItem of other) {
            const found = res.body.find(item => item.name === otherItem.name && item.price === otherItem.price);
            expect(found).toBeUndefined();
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
