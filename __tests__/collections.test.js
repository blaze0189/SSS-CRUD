import request from 'supertest';
import app from '../index.js';

function expectSortedByPrice(items, direction) {
  for (let i = 1; i < items.length; i++) {
    if (direction === 'asc') {
      expect(items[i].price).toBeGreaterThanOrEqual(items[i - 1].price);
    } else {
      expect(items[i].price).toBeLessThanOrEqual(items[i - 1].price);
    }
  }
}

describe('GET /snacks', () => {
  test('returns snack collection shape', async () => {
    const res = await request(app).get('/snacks');
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(10);
    expect(res.body[0]).toEqual(expect.objectContaining({ id: expect.any(Number), name: expect.any(String) }));
  });

  test('maxPrice filters by price threshold', async () => {
    const res = await request(app).get('/snacks?maxPrice=3');
    expect(res.body.length).toBeGreaterThan(0);
    res.body.forEach(item => expect(item.price).toBeLessThanOrEqual(3));
  });

  test('invalid maxPrice returns validation error payload', async () => {
    const res = await request(app).get('/snacks?maxPrice=abc');
    expect(res.body.error).toMatch(/Invalid maxPrice/);
  });

  test('sort supports asc and desc', async () => {
    const asc = await request(app).get('/snacks?sort=asc');
    const desc = await request(app).get('/snacks?sort=desc');
    expectSortedByPrice(asc.body, 'asc');
    expectSortedByPrice(desc.body, 'desc');
  });

  test('combined maxPrice and sort applies both operations', async () => {
    const res = await request(app).get('/snacks?maxPrice=3&sort=asc');
    res.body.forEach(item => expect(item.price).toBeLessThanOrEqual(3));
    expectSortedByPrice(res.body, 'asc');
  });
});

describe('GET /electronics', () => {
  test('returns electronics collection shape', async () => {
    const res = await request(app).get('/electronics');
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(10);
    expect(res.body[0]).toEqual(expect.objectContaining({ id: expect.any(Number), name: expect.any(String) }));
  });

  test('maxPrice filters by price threshold', async () => {
    const res = await request(app).get('/electronics?maxPrice=20');
    expect(res.body.length).toBeGreaterThan(0);
    res.body.forEach(item => expect(item.price).toBeLessThanOrEqual(20));
  });

  test('invalid maxPrice returns validation error payload', async () => {
    const res = await request(app).get('/electronics?maxPrice=-10');
    expect(res.body.error).toMatch(/Invalid maxPrice/);
  });

  test('sort supports asc and desc', async () => {
    const asc = await request(app).get('/electronics?sort=asc');
    const desc = await request(app).get('/electronics?sort=desc');
    expectSortedByPrice(asc.body, 'asc');
    expectSortedByPrice(desc.body, 'desc');
  });

  test('combined maxPrice and sort applies both operations', async () => {
    const res = await request(app).get('/electronics?maxPrice=25&sort=desc');
    res.body.forEach(item => expect(item.price).toBeLessThanOrEqual(25));
    expectSortedByPrice(res.body, 'desc');
  });
});
