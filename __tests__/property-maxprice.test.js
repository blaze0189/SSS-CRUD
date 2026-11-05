import request from 'supertest';
import fc from 'fast-check';
import app from '../index.js';

/**
 * Feature: shopping-server, Property 7: MaxPrice filter returns correct subset
 *
 * Validates: Requirements 7.1, 7.2, 7.3
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

describe('Property 7: MaxPrice filter returns correct subset', () => {
  it('GET /snacks?maxPrice={value} returns only snacks with price <= maxPrice', async () => {
    await fc.assert(
      fc.asyncProperty(fc.double({ min: 0.01, max: 1000, noNaN: true }), async (maxPrice) => {
        const res = await request(app).get(`/snacks?maxPrice=${maxPrice}`);
        expect(Array.isArray(res.body)).toBe(true);
        for (const item of res.body) { expect(item.price).toBeLessThanOrEqual(maxPrice); }
        const expected = snacks.filter(s => s.price <= maxPrice);
        expect(res.body).toHaveLength(expected.length);
        for (const exp of expected) { expect(res.body.find(i => i.id === exp.id)).toEqual(exp); }
      }),
      { numRuns: 100 }
    );
  });

  it('GET /electronics?maxPrice={value} returns only electronics with price <= maxPrice', async () => {
    await fc.assert(
      fc.asyncProperty(fc.double({ min: 0.01, max: 1000, noNaN: true }), async (maxPrice) => {
        const res = await request(app).get(`/electronics?maxPrice=${maxPrice}`);
        expect(Array.isArray(res.body)).toBe(true);
        for (const item of res.body) { expect(item.price).toBeLessThanOrEqual(maxPrice); }
        const expected = electronics.filter(e => e.price <= maxPrice);
        expect(res.body).toHaveLength(expected.length);
        for (const exp of expected) { expect(res.body.find(i => i.id === exp.id)).toEqual(exp); }
      }),
      { numRuns: 100 }
    );
  });

  it('GET /?maxPrice={value} returns filtered snacks and electronics', async () => {
    await fc.assert(
      fc.asyncProperty(fc.double({ min: 0.01, max: 1000, noNaN: true }), async (maxPrice) => {
        const res = await request(app).get(`/?maxPrice=${maxPrice}`);
        expect(res.body).toHaveProperty('snacks');
        expect(res.body).toHaveProperty('electronics');
        for (const item of res.body.snacks) { expect(item.price).toBeLessThanOrEqual(maxPrice); }
        for (const item of res.body.electronics) { expect(item.price).toBeLessThanOrEqual(maxPrice); }
        const expS = snacks.filter(s => s.price <= maxPrice);
        const expE = electronics.filter(e => e.price <= maxPrice);
        expect(res.body.snacks).toHaveLength(expS.length);
        expect(res.body.electronics).toHaveLength(expE.length);
      }),
      { numRuns: 100 }
    );
  });
});
