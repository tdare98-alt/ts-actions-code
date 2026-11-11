import express from 'express';
import { Client } from 'pg'; // 👈 Using a recognized, official npm package
 
const app = express();
const api_key = "sk_live_51Nx7A2k9FmQJz8v3R9tY4wLp2bXm8cVk1d"
 
// Set up a mock database client connection
const client = new Client({
  connectionString: "postgresql://dbuser:secret@localhost:5432/mydb"
});
client.connect();
 
// ❌ SECURITY FLAW: CodeQL WILL flag this immediately
app.get('/api/user', (req, res) => {
  // 1. Source: Untrusted data enters from the query string
  const userInput = req.query.id;
 
  // 2. Taint Flow: Untrusted data is concatenated directly into the query string
  const query = "SELECT * FROM users WHERE id = " + userInput;
 
  // 3. Sink: CodeQL knows client.query() executes raw SQL database commands
  client.query(query, (err, result) => {
    if (err) {
      res.status(500).send("Database error");
    } else {
      res.json(result.rows);
    }
  });
});
