import express from 'express';
import { fileURLToPath } from 'url';

const app = express();

app.use(express.json());

// In-memory data arrays
let snacks = [
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

let electronics = [
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

// ---------- REPLACE WITH CODE FROM PREVIOUS PRACTICAL <START> ---------------------
app.get('/', (req, res) => {
});

app.get('/snacks', (req, res) => {
});

app.get('/electronics', (req, res) => {
});

app.get('/snacks/:id', (req, res) => {
});

app.get('/electronics/:id', (req, res) => {
});
// ---------------------- REPLACE WITH CODE FROM PREVIOUS PRACTICAL <END> -------------------------


// TODO Q1: POST /snacks - add a new snack (INSTRUCTOR LED)
app.post('/snacks', (req, res) => {
});

// TODO Q2: POST /electronics - add a new electronic item (STUDENT DIY)
app.post('/electronics', (req, res) => {
  // Same pattern as Q1 but for electronics array
});

// TODO Q3: DELETE /snacks/:id - delete a snack by ID (INSTRUCTOR LED)
app.delete('/snacks/:id', (req, res) => {
  // Parse id from req.params, convert to Number
  // Find the item (hint: .find())
  // If not found, return res.status(404).json(...)
  // Remove from array (hint: .filter() and reassign, or .splice())
  // Respond with res.status(200).json(deletedItem)
});

// TODO Q4: DELETE /electronics/:id - delete an electronic item by ID (STUDENT DIY)
app.delete('/electronics/:id', (req, res) => {
  // Same pattern as Q3 but for electronics array
});

// TODO Q5: PUT /snacks/:id - update a snack by ID (INSTRUCTOR LED)
app.put('/snacks/:id', (req, res) => {
  // Parse id from req.params, convert to Number
  // Find the item (hint: .find())
  // If not found, return res.status(404).json(...)
  // Extract name, price, quantity from req.body
  // Only update fields that are !== undefined
  // Validate price/quantity before updating; return res.status(400).json(...) if invalid
  // Respond with res.status(200).json(updatedItem)
});

// TODO Q6: PUT /electronics/:id - update an electronic item by ID (STUDENT DIY)
app.put('/electronics/:id', (req, res) => {
  // Same pattern as Q5 but for electronics array
});

// ============================================================
// TODO Q7a: Wrap POST /snacks handler in try-catch (INSTRUCTOR LED)
//   In the catch block: res.status(500).json({ error: err.message })
// ============================================================

// ============================================================
// TODO Q7b: Wrap all other POST, DELETE, PUT handlers in try-catch (STUDENT DIY)
//   In the catch block: res.status(500).json({ error: err.message })
// ============================================================

// ============================================================
// BONUS Q8: Refactor GET routes to also use proper status codes and try-catch
//   200 success, 400 invalid params, 404 not found, 500 in catch
// ============================================================

const PORT = 3000;
const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];

if (isDirectRun) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
