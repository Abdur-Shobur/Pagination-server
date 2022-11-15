// Pagination-server
// product-data

require('dotenv').config()
const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb')
const cors = require('cors')
const color = require('colors')
const PORT = process.env.PORT || 5000
const app = express()

app.use(cors())
app.use(express.json())

// const uri = process.env.MongoDb
// // const uri = 'mongodb://localhost:27017'
// const client = new MongoClient(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   serverApi: ServerApiVersion.v1,
// })

const uri = process.env.MongoDb
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
})

const run = async () => {
  try {
    // database create

    const database = client.db('Pagination-server')
    const Product_Data = database.collection('product-data2')

    app.get('/alls', async (req, res) => {
      const query = {}
      const products = await Product_Data.find(query).toArray()
      res.send(products)
    })
    // get data
    app.get('/product-data', async (req, res) => {
      const currentPage = parseInt(req.query.page)
      const size = parseInt(req.query.size)
      const search = req.query.search
      const sortby = req.query.sortby

      let sort_by_value = 1

      let sort_by_from = 0
      let sort_by_to = 0

      let query = {}

      if (sortby == 1 || sortby == -1) {
        sort_by_value = parseInt(sortby)
      } else {
        const trims = sortby.split('-')
        sort_by_from = parseInt(trims[0])
        sort_by_to = parseInt(trims[1])
        query = { price: { $gte: sort_by_from, $lte: sort_by_to } }
      }

      const find = Product_Data.find(query).sort({ price: sort_by_value })
      const products = await find
        .skip(currentPage * size)
        .limit(size)
        .toArray()
      const count = await Product_Data.countDocuments()
      res.send({ count, products })
    })
  } finally {
  }
}

run().catch((err) => console.log(err))

//   start
app.get('/', (req, res) => {
  res.send('<h1>Server is Runing</h1>')
})

app.listen(PORT, () => {
  console.log('Server Is Runing'.bgBlue)
})
