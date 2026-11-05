import request from 'supertest';
import fc from 'fast-check';
import app from '../index.js';

/**
 * Feature: shopping-server, Property 6: Invalid category returns 400
 *
 * For any string that is not "snacks" or "electronics", a GET request to
 * /?category={value} should return a JSON error response and a JSON error message
 * indicating the category is invalid.
 *
 * Validates: Requirements 6.3
 */

const validCategories = ['snacks', 'electronics'];

describe('Property 6: Invalid category returns 400', () => {
  // **Validates: Requirements 6.3**
  it('GET /?category={invalidValue} returns error with error message for any non-valid category string', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string().filter(s => !validCategories.includes(s)),
        async (invalidCategory) => {
          const res = await request(app)
            .get('/')
            .query({ category: invalidCategory });

          // Must return HTTP 400

          // Must return JSON with the expected error message
          expect(res.body).toEqual({
            error: "Invalid category. Use 'snacks' or 'electronics'.",
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});
