import request from 'supertest';
import app from '../index.js';

describe('Smoke Tests - Core Routes', () => {
  test('GET /snacks returns all snacks', async () => {
    const res = await request(app).get('/snacks');
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(10);
    expect(res.body[0]).toHaveProperty('id');
    expect(res.body[0]).toHaveProperty('name');
    expect(res.body[0]).toHaveProperty('price');
    expect(res.body[0]).toHaveProperty('quantity');
  });

  test('GET /electronics returns all electronics', async () => {
    const res = await request(app).get('/electronics');
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(10);
  });

  test('GET /snacks/1 returns the correct snack', async () => {
    const res = await request(app).get('/snacks/1');
    expect(res.body.id).toBe(1);
    expect(res.body.name).toBe('Chips');
  });

  test('GET /snacks/999 returns 404', async () => {
    const res = await request(app).get('/snacks/999');
    expect(res.body.error).toBe('Item not found');
  });

  test('GET /electronics/1 returns the correct electronic', async () => {
    const res = await request(app).get('/electronics/1');
    expect(res.body.id).toBe(1);
    expect(res.body.name).toBe('Headphones');
  });

  test('GET /electronics/999 returns 404', async () => {
    const res = await request(app).get('/electronics/999');
    expect(res.body.error).toBe('Item not found');
  });

  test('GET / returns both collections', async () => {
    const res = await request(app).get('/');
    expect(res.body).toHaveProperty('snacks');
    expect(res.body).toHaveProperty('electronics');
    expect(res.body.snacks.length).toBe(10);
    expect(res.body.electronics.length).toBe(10);
  });

  test('GET /snacks?maxPrice=3 filters correctly', async () => {
    const res = await request(app).get('/snacks?maxPrice=3');
    res.body.forEach(item => { expect(item.price).toBeLessThanOrEqual(3); });
  });

  test('GET /electronics?maxPrice=20 filters correctly', async () => {
    const res = await request(app).get('/electronics?maxPrice=20');
    res.body.forEach(item => { expect(item.price).toBeLessThanOrEqual(20); });
  });

  test('GET /snacks?sort=asc returns ascending price order', async () => {
    const res = await request(app).get('/snacks?sort=asc');
    for (let i = 1; i < res.body.length; i++) {
      expect(res.body[i].price).toBeGreaterThanOrEqual(res.body[i - 1].price);
    }
  });

  test('GET /snacks?sort=desc returns descending price order', async () => {
    const res = await request(app).get('/snacks?sort=desc');
    for (let i = 1; i < res.body.length; i++) {
      expect(res.body[i].price).toBeLessThanOrEqual(res.body[i - 1].price);
    }
  });

  test('GET /?category=snacks returns only snacks', async () => {
    const res = await request(app).get('/?category=snacks');
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(10);
  });

  test('GET /?category=electronics returns only electronics', async () => {
    const res = await request(app).get('/?category=electronics');
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(10);
  });

  test('GET /snacks?maxPrice=abc returns 400', async () => {
    const res = await request(app).get('/snacks?maxPrice=abc');
    expect(res.body.error).toMatch(/Invalid maxPrice/);
  });

  test('GET /snacks?maxPrice=-5 returns 400', async () => {
    const res = await request(app).get('/snacks?maxPrice=-5');
    expect(res.body.error).toMatch(/Invalid maxPrice/);
  });

  test('GET /snacks?sort=cheapest returns 400', async () => {
    const res = await request(app).get('/snacks?sort=cheapest');
    expect(res.body.error).toMatch(/Invalid sort/);
  });

  test('GET /?category=toys returns 400', async () => {
    const res = await request(app).get('/?category=toys');
    expect(res.body.error).toMatch(/Invalid category/);
  });

  test('GET /snacks?maxPrice=3&sort=asc filters then sorts', async () => {
    const res = await request(app).get('/snacks?maxPrice=3&sort=asc');
    res.body.forEach(item => { expect(item.price).toBeLessThanOrEqual(3); });
    for (let i = 1; i < res.body.length; i++) {
      expect(res.body[i].price).toBeGreaterThanOrEqual(res.body[i - 1].price);
    }
  });
});
