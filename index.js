// Ang Rui Yang, P2607876 ,RUIYANG.26@ichat.sp.edu.sg, DAAA/FT/1B/01
// Unit3 Part1 Practical - Simple Shopping Server CRUD

import express from 'express';

const app = express();

// The following 2 lines are app level middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // include this middleware to make it convenient to use form style data when testing

// In-memory data arrays
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

// var lastElectronic

// ============================================================
// TODO: Implement the routes below
// ============================================================

// GET /snacks/:id - return a single snack by ID
// If found: return the snack object as JSON
// If not found: return { "error": "Item not found" }
app.get('/snacks/:id', (req, res) => { // route or path parameter is a variable that can be accessed using req.params.<name>
  // TODO: Implement this route
  // Hint: use req.params.id to get the ID from the URL
  // Hint: use Number() to convert the string ID to a number
  // Hint: use .find() to search the snacks array
  const id = Number(req.params.id);
  // const {id} = req.params; // alternative way to get the id from the URL. Use destructuring assignment if many parameters
  if (snacks[id - 1] === undefined) { // if the id is not found in the array, return error
    return res.status(404).json({ error: 'Item not found' });
  } else {
    return res.status(200).json(snacks[id - 1]); // if found, return the snack object as JSON
  }
});

// GET /snacks - return all snacks as JSON
// Optional query params:
//   ?maxPrice=<number> - filter items where price <= maxPrice (return error JSON if invalid/negative)
//   ?sort=asc|desc     - sort results by price (return error JSON if invalid value)
//   When both are provided, filter first then sort
app.get('/snacks', (req, res) => {
  // TODO: Implement this route
  const { maxPrice, sort } = req.query;
  if (snacks.length === 0) { // in a real database, the "get" (SELECT) returns an array of records
    return res.status(404).json({ error: 'No snacks found' });
  } else {
    const result = filterByMaxPriceThenSort(snacks, maxPrice, sort);

    // If the helper returns an error, send HTTP status 400 (Bad Request).
    if (result.error) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result); // Send the filtered or sorted snacks.
  }
});

// GET /electronics/:id - return a single electronic by ID
// Same behavior as /snacks/:id but searches the electronics array
app.get('/electronics/:id', (req, res) => {
  // TODO: Implement this route
  const id = Number(req.params.id);
  if (electronics[id - 1] === undefined) { // if the id is not found in the array, return error
    return res.status(404).json({ error: 'Item not found' });
  } else {
    return res.status(200).json(electronics[id - 1]); // if found, return the electronic object as JSON
  }
});

// GET /electronics - return all electronics as JSON
// Same query param support as /snacks
app.get('/electronics', (req, res) => {
  // TODO: Implement this route
  const { maxPrice, sort } = req.query;
  if (electronics.length === 0) { // in a real database, the "get" (SELECT) returns an array of records
    return res.status(404).json({ error: 'No electronics found' });
  } else {
    const result = filterByMaxPriceThenSort(electronics, maxPrice, sort);

    // Stop here if maxPrice or sort contains an invalid value.
    if (result.error) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  }
});

// GET / - return all products
// Without query params: return { snacks: [...], electronics: [...] }
// With ?category=snacks: return only the snacks array
// With ?category=electronics: return only the electronics array
// With invalid category: return { "error": "Invalid category. Use 'snacks' or 'electronics'." }
// Also supports ?maxPrice= and ?sort= (same rules as collection endpoints)
app.get('/', (req, res) => {
  // TODO: Implement this route
  // Hint: use req.query to access query parameters (e.g., req.query.category)
  const { category, maxPrice, sort } = req.query;

  // "undefined" means that the user did not provide a category.
  if (category === undefined) {
    const snackResult = filterByMaxPriceThenSort(snacks, maxPrice, sort);
    const electronicsResult = filterByMaxPriceThenSort(electronics, maxPrice, sort);

    // Both collections use the same query options, so return any error first.
    if (snackResult.error) {
      return res.status(400).json(snackResult);
    }
    if (electronicsResult.error) {
      return res.status(400).json(electronicsResult);
    }

    return res.status(200).json({ snacks: snackResult, electronics: electronicsResult });
  } else if (category === 'snacks') {
    const result = filterByMaxPriceThenSort(snacks, maxPrice, sort);
    if (result.error) {
      return res.status(400).json(result);
    }
    return res.status(200).json(result);
  } else if (category === 'electronics') {
    const result = filterByMaxPriceThenSort(electronics, maxPrice, sort);
    if (result.error) {
      return res.status(400).json(result);
    }
    return res.status(200).json(result);
  } else {
    return res.status(400).json({ error: "Invalid category. Use 'snacks' or 'electronics'." });
  }
});

const filterByMaxPriceThenSort = (itemArray, maxPrice, sort) => {
  // Start with a copy so the original snacks/electronics array is not changed.
  let filteredArray = [...itemArray]; // create a copy of the original array to avoid mutating it

  // Only check maxPrice when it was included in the URL.
  if (maxPrice === undefined) {
    // No maxPrice means that all prices are allowed.
  } else if (String(maxPrice).trim() === '' || isNaN(Number(maxPrice)) || Number(maxPrice) <= 0) {
    return { error: 'Invalid maxPrice. Must be a positive number.' };
  } else {
    // Keep only items whose price is less than or equal to maxPrice.
    filteredArray = itemArray.filter(element => element.price <= Number(maxPrice));
  }

  // Only sort when the sort option was included in the URL.
  if (sort === undefined) {
    // No sort option means that the original order is kept.
  } else if (sort === 'asc') {
    // Smallest price first.
    filteredArray.sort((a, b) => a.price - b.price);
  } else if (sort === 'desc') {
    // Largest price first.
    filteredArray.sort((a, b) => b.price - a.price);
  } else {
    return { error: "Invalid sort. Use 'asc' or 'desc'." };
  }

  return filteredArray;
};

// POST /snacks
// Add a new snack to the array. The request body will contain name, price, and quantity.
app.post('/snacks', (req, res) => {
  const { price, name, quantity } = req.body ?? {}; // use an empty object when no request body was sent
  if (!name || !price || !quantity) {
    return res.status(400).json({ "error": "Missing required fields" });
  }
  if (isNaN(price) || isNaN(quantity)) {
    return res.status(400).json({ "error": "Invalid price or quantity value. Use numbers." });
  }
  if (price < 0 || quantity < 0) {
    return res.status(400).json({ "error": "Invalid price or quantity value. Use non-negative numbers." });
  }
  // Generate an ID that is one greater than the current highest snack ID
  const newId = snacks.length > 0 ? Math.max(...snacks.map(snack => snack.id)) + 1 : 1;

  const newSnack = { id: newId, name, price: Number(price), quantity: Number(quantity) };
  snacks.push(newSnack); // add the newly created snack to the snacks array
  res.status(201).json({message: "Snack added successfully", snack: newSnack});
});

// for CA1 and CA2, you might want to do a catch-all route to handle any requests that don't match the above routes. This is a good practice to avoid exposing unnecessary information about your server and to provide a consistent error response for unknown routes. You can add the following code at the end of your route definitions:
// app.all('/.*$/', (req, res) => { // If you like the use of regular expression better
app.all('/*splat', (req, res) => { // use of '*' as a wildcard to match any route that hasn't been defined above. Only for express V4.
  console.log(`Unknown route: ${req.method} ${req.url}`); // log the unknown route to the console for debugging purposes
  res.sendStatus(404);
});

// ============================================================
// Server startup
// ============================================================
const PORT = 3000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, 'localhost', () => { // put localhost to avoid exposing the server to the internet
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

export default app;
