// imports
require('dotenv').config();

const express = require("express")
const app = express();
const PORT = 3000;
const pg = require("pg");
const client = new pg.Client(process.env.DATABASE_URL);

app.use(express.json());
app.use(require("morgan")("dev"));

// app routes
app.get("/", (req, res) => {
  res.status(200).json({ 
    status: 200,
    message: "API is working" 
  });
});

app.get('/api/flavors', async (req ,res, next) => {
  try {
    const SQL = `
    SELECT * FROM flavors;
    `

    const response = await client.query(SQL);

    res.status(200).json({
      status: 200,
      data: response.rows
    })
  } catch (error) {
    next(error);
  }
});

app.get('/api/flavors/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    
    const SQL = `
    SELECT * FROM flavors 
    WHERE id = $1;
    `

    const response = await client.query(SQL, [id]);
    
    res.status(200).json({
      status: 200,
      data: response.rows[0]
    })
  } catch (error) {
    next(error);
  }
});

app.post('/api/flavors', async (req, res, next) => {
  try {
    const name = req.body.name
    const is_favorite = req.body.is_favorite
    
    const SQL = `
      INSERT INTO flavors(name, is_favorite) 
      VALUES($1, $2)
      RETURNING *;
    `
    const response = await client.query(SQL, [name, is_favorite]);

    res.status(201).json({
      status: 201,
      data: response.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

app.delete('/api/flavors/:id', async (req, res, next) => {
  try {
    const id = req.params.id;

    const SQL = `
      DELETE from flavors WHERE id = $1;
    `
    const response = await client.query(SQL, [id])
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

app.put('/api/flavors/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const name = req.body.name;
    const is_favorite = req.body.is_favorite;
    
    const SQL = `
      UPDATE flavors 
      SET is_favorite = COALESCE($3, is_favorite),
        name = COALESCE($2, name), 
        updated_at = now()
      WHERE id = $1;
    `
    
    const response = await client.query(SQL, [id, name, is_favorite]);
    res.status(201).json({
      status: 201,
      message: `succesfully updated flavor #${id}`
    });
  } catch (error) {
    next(error);
  }
});

// init function
const init = async () => {
  await client.connect();
  console.log('connected to database', process.env.DATABASE_URL);
  app.listen(PORT, () => console.log(`listening on port ${PORT}`));
}

// init function call
init();