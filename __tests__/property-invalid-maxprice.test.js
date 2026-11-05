import request from 'supertest';
import fc from 'fast-check';
import app from '../index.js';

/**
 * Feature: shopping-server, Property 8: Invalid maxPrice returns 400
 *
 * For any non-numeric or non-positive maxPrice value, a GET request with
 * ?maxPrice={value} should return a JSON error response and a JSON error message
 * indicating the maxPrice is invalid.
 *
 * Validates: Requirements 7.4
 */

const endpoints = ['/snacks', '/electronics', '/'];

describe('Property 8: Invalid maxPrice returns 400', () => {
  // **Validates: Requirements 7.4**
  it('non-numeric string maxPrice returns error on all endpoints', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string().filter(s => isNaN(Number(s)) || s.trim() === ''),
        fc.constantFrom(...endpoints),
        async (invalidMaxPrice, endpoint) => {
          const res = await request(app)
            .get(endpoint)
            .query({ maxPrice: invalidMaxPrice });

          expect(res.body).toEqual({
            error: 'Invalid maxPrice. Must be a positive number.',
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  // **Validates: Requirements 7.4**
  it('negative number or zero maxPrice returns error on all endpoints', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.double({ min: -1000, max: 0, noNaN: true }),
        fc.constantFrom(...endpoints),
        async (invalidMaxPrice, endpoint) => {
          const res = await request(app)
            .get(endpoint)
            .query({ maxPrice: String(invalidMaxPrice) });

          expect(res.body).toEqual({
            error: 'Invalid maxPrice. Must be a positive number.',
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});
