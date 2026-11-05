import request from 'supertest';
import app from '../index.js';

/**
 * Unit tests for GET /snacks/:id and GET /electronics/:id endpoints.
 * Validates behavior without overfitting to full object equality.
 */

describe('GET /snacks/:id', () => {
  test('returns a snack for valid IDs', async () => {
    for (const id of [1, 2, 7, 10]) {
      const res = await request(app).get(`/snacks/${id}`);
      expect(res.body).toMatchObject({ id });
      expect(res.body).toHaveProperty('name');
      expect(typeof res.body.name).toBe('string');
      expect(typeof res.body.price).toBe('number');
      expect(typeof res.body.quantity).toBe('number');
    }
  });

  test('returns not found payload for missing snack IDs', async () => {
    for (const id of [0, 999]) {
      const res = await request(app).get(`/snacks/${id}`);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toMatch(/Item not found/i);
    }
  });
});

describe('GET /electronics/:id', () => {
  test('returns an electronic item for valid IDs', async () => {
    for (const id of [1, 2, 8, 10]) {
      const res = await request(app).get(`/electronics/${id}`);
      expect(res.body).toMatchObject({ id });
      expect(res.body).toHaveProperty('name');
      expect(typeof res.body.name).toBe('string');
      expect(typeof res.body.price).toBe('number');
      expect(typeof res.body.quantity).toBe('number');
    }
  });

  test('returns not found payload for missing electronics IDs', async () => {
    for (const id of [0, 999]) {
      const res = await request(app).get(`/electronics/${id}`);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toMatch(/Item not found/i);
    }
  });
});
