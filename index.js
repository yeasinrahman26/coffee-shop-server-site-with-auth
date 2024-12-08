const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware

app.use(cors());
app.use(express.json());

//coffeeMaster
//Iamsafa007

// console.log(process.env.DB_USER);
// console.log(process.env.DB_PASS);

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}
//   @cluster0.yog8q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// // console.log(uri);
const uri =
  "mongodb+srv://coffeeMaster:Iamsafa007@cluster0.yog8q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const coffeeCollection= client.db("coffeeDB").collection('coffee')

    const userCOllection = client.db("coffeeDB").collection("users");

    app.get('/coffee',async(req,res)=>{
        const cursor= coffeeCollection.find();
        const result=await cursor.toArray();
        res.send(result)
    })


    app.get('/coffee/:id',async(req,res)=>{
        const id=req.params.id;
        const query= {_id: new ObjectId (id)}
        const result=await coffeeCollection.findOne(query)
        res.send(result)
    })

    app.post('/coffee',async(req,res)=>{
        const newCoffee=req.body;
        console.log(newCoffee);
        const result=await coffeeCollection.insertOne(newCoffee)
        res.send(result)
    })
    
    app.put('/coffee/:id',async(req,res)=>{
        const id =req.params.id;
        const filter={_id: new ObjectId(id)};
        const option={upsert: true};
        const  updatedCoffee=req.body
        const coffee = {
          $set: {
            name: updatedCoffee. name,
            quantity: updatedCoffee. quantity,
            supplier: updatedCoffee. supplier,
            taste: updatedCoffee. taste,
            category: updatedCoffee. category,
            details: updatedCoffee.details,
            photo: updatedCoffee.photo,
          },
        };
        const result=await coffeeCollection.updateOne(filter,coffee,option);
        res.send(result)

    })

    app.delete('/coffee/:id',async(req,res)=>{
        const id=req.params.id;
        const query={_id: new ObjectId(id)}
        const result= await coffeeCollection.deleteOne(query);
        res.send(result);
    })


    //users related apis

    app.get('/users',async(req,res)=>{
        const cursor=userCOllection.find();
        const result=await cursor.toArray();
        res.send(result)
    })

    app.post('/users',async(req,res)=>{
        const newUser=req.body;
        console.log('creating new user',newUser);
        const result=await userCOllection.insertOne(newUser);
        res.send(result)
    })


    app.patch('/users',async(req,res)=>{
        const email=req.body.email;
        const filter={email}
        const UpdatedDoc={
            $set:{
                lastSignInTime:req.body?.lastSignInTime
            }

        }
         const result = await userCOllection.updateOne(filter,UpdatedDoc)
         res.send(result)
    })


    app.delete('/users/:id',async(req,res)=>{
        const id=req.params.id;
        const query={_id: new ObjectId(id)}
        const result=await userCOllection.deleteOne(query)
        res.send(result);
    })










    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// mongodb End

app.get("/", (req, res) => {
  res.send("Coffee server is running");
});
app.listen(port, () => {
  console.log(`coffee server is running on port: ${port}`);
});
