const express = require('express')
const { MongoClient } = require('mongodb');
require("dotenv").config();
const ObjectId = require('mongodb').ObjectId

const cors = require("cors")

const app = express()
const port = process.env.PORT || 5000;

// middlewaer
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yz6m3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {

    try {



        await client.connect();
        const database = client.db('travelWorld')
        const placesCollection = database.collection('place')
        const ordersCollection = database.collection('orders')

        // GET API 
        app.get('/places', async (req, res) => {
            const cursor = placesCollection.find({})
            const places = await cursor.toArray()
            res.send(places)
        })

        // GET SINGLE API
        app.get('/places/:id', async (req, res) => {
            const id = req.params.id;
            console.log("Geting specific service", id);
            const query = { _id: ObjectId(id) }
            const place = await placesCollection.findOne(query)
            res.json(place);
        })

        // POST API 
        app.post('/place', async (req, res) => {
            const service = req.body;
            console.log("Hit the post api", service);
            const result = await placesCollection.insertOne(service);
            console.log(result);
            res.json(result)
        })


        // ADD order API
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order)
            res.json(result)
        })

        // GET orders API
        app.get('/orders', async (req, res) => {
            const cursor = ordersCollection.find({})
            const services = await cursor.toArray();
            res.json(services);
        })
        // DELETE my order API
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            // console.log('Delate id', result);
            res.json(result);

        })

    }

    finally {
        // await client.close();
    }

}
run().catch(console.dir)



app.get('/', (req, res) => {
    res.send("Running Travel Agency")
})

app.listen(port, () => {
    console.log("Running Travel agency on port", port);
})