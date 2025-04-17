// imports
require('dotenv').config();

const pg = require("pg");
const client = new pg.Client(process.env.DATABASE_URL);

// create your init function
const init = async () => {
  await client.connect();
  const SQL = `
  DROP TABLE IF EXISTS flavors;
  CREATE TABLE flavors(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
  );
  INSERT INTO flavors(name) VALUES('Chocolate');
  INSERT INTO flavors(name, is_favorite) VALUES('Vanilla', true);
  `

  await client.query(SQL);
  console.log("database seeded succesfully");
}

// init function call
init();