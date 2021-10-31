const express =require('express');
const {MongoClient}=require('mongodb');
const ObjectId=require('mongodb').ObjectId
require('dotenv').config();
const cors=require('cors');

const app=express();
const port=process.env.PORT || 5000;

// middlewre
app.use(cors());
app.use(express.json());

const uri=`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bstay.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;



const client=new MongoClient(uri,{useNewURlParser:true,useUnifiedTopology:true});

async function run(){
try{
 await client.connect();
 const database=client.db('manirFoods');
 const foodsColection=database.collection('foods');
 const ordersCollection=database.collection('orders');



//  GET Single service
app.get('/foods/:id',async(req,res)=>{
    const id=req.params.id;
    const query={_id:ObjectId(id)};
    const service=await foodsColection.findOne(query);
    res.json(service);
})

//  get api
 app.get('/foods',async(req,res)=>{
    const cursor=foodsColection.find({});
    const foods=await cursor.toArray();
    res.send(foods);
 })
 


// post api
 app.post('/foods',async(req,res)=>{
    const food=req.body;
    console.log('hit the post api',food);
    const result=await foodsColection.insertOne(food);
    console.log(result);
    res.json('post hitted')
    
});

// orders get api
app.get('/orders',async(req,res)=>{
    const cursor=ordersCollection.find({});
    const orders=await cursor.toArray();
    res.send(orders);

});


// add orders api
app.post('/orders',async(req,res)=>{
    const order =req.body;
    const result=await ordersCollection.insertOne(order);
    res.json(result);
});

// delete api
app.delete('/orders/:id',async(req,res)=>{
    const id= req.params.id;
    const query={_id:ObjectId(id)};
    const result=await ordersCollection.deleteOne(query)
    
    console.log('deleting user with id',result);
    res.json(result);
})

}
finally{
    // await client.close();
}
}

run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send('runnine manir-app server');
})

app.listen(port,()=>{
    console.log('running server on port',port)
})