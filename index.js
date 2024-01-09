const express =require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();


const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9fxhf2q.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const coffeesCollection = client.db('coffeesDB').collection('coffees');

    // Read a specific element
    app.get('/coffees/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await coffeesCollection.findOne(query);
      res.send(result);
    })

    // 2. Read all the elements
    app.get('/coffees', async(req, res) => {
      const cursor = coffeesCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    // 1. Create <---> post
    app.post('/coffees', async(req, res) =>{
      const newCoffee = req.body;
      console.log(newCoffee)
      const result = await coffeesCollection.insertOne(newCoffee);
      res.send(result);
    })

    // update <--> Put an element
    app.put('/coffees/:id', async(req, res) => {
      const id = req.params.id;
      const coffee = req.body;
      const filter = {_id: new ObjectId(id)};
      const options = { upsert: true};
      const updateCoffee = {
        $set: {
          name: coffee.name,
          supplier: coffee.supplier,
          quantity: coffee.quantity,
          taste: coffee.taste, 
          category: coffee.category, 
          details: coffee.details, 
          photo: coffee.photo,
        }
      }
      
      const result = await coffeesCollection.updateOne(filter, updateCoffee, options);
      res.send(result);
    })

    // 4. Delete
    app.delete('/coffees/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await coffeesCollection.deleteOne(query);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.log);



app.get('/', (req, res) => {
    res.send("coffee store practice server is running")
});

app.listen(port, () => {
    console.log(`coffee store data is cunning on port ${port}`)
});