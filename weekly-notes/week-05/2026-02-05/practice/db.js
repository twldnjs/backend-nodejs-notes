// Get the client
import mysql from 'mysql2/promise';

// Create the connection to database
const connection = await mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'Youtube',
  dateStrings: true,
});

// A simple SELECT query
try {
  const [results, fields] = await connection.query('SELECT * FROM `users`');

  const { id, email, name, created_at } = results[0];

  console.log(id, email, name);
} catch (err) {
  console.log(err);
}

module.exports = connection;
