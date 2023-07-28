import express from "express";
const app = express()
import cors from 'cors'
import bodyParser from 'body-parser'
import dbConnection from './config/db.js'
import booksRoutes from './routes/booksRoutes.js'


app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))

app.use('/api',booksRoutes)

dbConnection().then(()=>{
    app.listen(5000,()=>console.log("SERVER STARTED AT PORT:5000"))
})