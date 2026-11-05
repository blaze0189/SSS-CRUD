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

describe('GET /', () => {
  test('returns both collections', async () => {
    const res = await request(app).get('/');
    expect(res.body).toHaveProperty('snacks');
    expect(res.body).toHaveProperty('electronics');
    expect(Array.isArray(res.body.snacks)).toBe(true);
    expect(Array.isArray(res.body.electronics)).toBe(true);
    expect(res.body.snacks.length).toBe(10);
    expect(res.body.electronics.length).toBe(10);
  });

  test('category filter returns one collection array', async () => {
    const snacks = await request(app).get('/?category=snacks');
    const electronics = await request(app).get('/?category=electronics');
    expect(Array.isArray(snacks.body)).toBe(true);
    expect(Array.isArray(electronics.body)).toBe(true);
    expect(snacks.body.length).toBe(10);
    expect(electronics.body.length).toBe(10);
  });

  test('invalid category returns validation error payload', async () => {
    const res = await request(app).get('/?category=toys');
    expect(res.body.error).toMatch(/Invalid category/);
  });

  test('maxPrice filters results', async () => {
    const res = await request(app).get('/?maxPrice=20');
    res.body.snacks.forEach(item => expect(item.price).toBeLessThanOrEqual(20));
    res.body.electronics.forEach(item => expect(item.price).toBeLessThanOrEqual(20));
  });

  test('sort applies ascending and descending order', async () => {
    const asc = await request(app).get('/?sort=asc');
    const desc = await request(app).get('/?sort=desc');
    expectSortedByPrice(asc.body.snacks, 'asc');
    expectSortedByPrice(asc.body.electronics, 'asc');
    expectSortedByPrice(desc.body.snacks, 'desc');
    expectSortedByPrice(desc.body.electronics, 'desc');
  });

  test('combined maxPrice and sort applies both', async () => {
    const res = await request(app).get('/?maxPrice=20&sort=asc');
    res.body.snacks.forEach(item => expect(item.price).toBeLessThanOrEqual(20));
    res.body.electronics.forEach(item => expect(item.price).toBeLessThanOrEqual(20));
    expectSortedByPrice(res.body.snacks, 'asc');
    expectSortedByPrice(res.body.electronics, 'asc');
  });

  test('invalid sort returns validation error payload', async () => {
    const res = await request(app).get('/?sort=invalid');
    expect(res.body.error).toMatch(/Invalid sort/);
  });
});
