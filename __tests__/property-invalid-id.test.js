import request from 'supertest';
import fc from 'fast-check';
import app from '../index.js';

/**
 * Feature: shopping-server, Property 4: Invalid ID lookup returns error
 *
 * For any collection (snacks or electronics) and any ID that does not exist
 * in that collection, a GET request to /{collection}/:id should return HTTP
 *  and a JSON error message.
 *
 * Validates: Requirements 4.2, 5.2
 */

// Valid IDs in both collections are 1-10
const validIds = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

const collectionArb = fc.constantFrom('snacks', 'electronics');

const invalidIdArb = fc.oneof(
  fc.integer({ min: 11, max: 100000 }),
  fc.integer({ min: -100000, max: 0 })
);

describe('Property 4: Invalid ID lookup returns 404', () => {
  it('GET /{collection}/:id with a non-existent ID returns error with error message', async () => {
    await fc.assert(
      fc.asyncProperty(collectionArb, invalidIdArb, async (collection, id) => {
        const res = await request(app).get(`/${collection}/${id}`);
        expect(res.body).toEqual({ error: 'Item not found' });
      }),
      { numRuns: 100 }
    );
  });
});
