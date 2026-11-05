import request from 'supertest';
import fc from 'fast-check';
import app from '../index.js';

/**
 * Feature: shopping-server, Property 12: Invalid sort value returns 400
 *
 * For any string that is not "asc" or "desc", a GET request with
 * ?sort={value} should return a JSON error response and a JSON error message
 * indicating the sort value is invalid.
 *
 * Validates: Requirements 8.8
 */

const validSortValues = ['asc', 'desc'];

describe('Property 12: Invalid sort value returns 400', () => {
  // **Validates: Requirements 8.8**
  it('GET /snacks?sort={invalidValue} returns error with error message for any non-valid sort string', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string().filter(s => s !== 'asc' && s !== 'desc'),
        async (invalidSort) => {
          const res = await request(app)
            .get('/snacks')
            .query({ sort: invalidSort });

          expect(res.body).toEqual({
            error: "Invalid sort. Use 'asc' or 'desc'.",
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  // **Validates: Requirements 8.8**
  it('GET /electronics?sort={invalidValue} returns error with error message for any non-valid sort string', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string().filter(s => s !== 'asc' && s !== 'desc'),
        async (invalidSort) => {
          const res = await request(app)
            .get('/electronics')
            .query({ sort: invalidSort });

          expect(res.body).toEqual({
            error: "Invalid sort. Use 'asc' or 'desc'.",
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  // **Validates: Requirements 8.8**
  it('GET /?sort={invalidValue} returns error with error message for any non-valid sort string', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string().filter(s => s !== 'asc' && s !== 'desc'),
        async (invalidSort) => {
          const res = await request(app)
            .get('/')
            .query({ sort: invalidSort });

          expect(res.body).toEqual({
            error: "Invalid sort. Use 'asc' or 'desc'.",
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});
