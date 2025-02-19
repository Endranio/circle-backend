import express from 'express'
import dotenv from 'dotenv'
dotenv.config()

const app=express()
const port = process.env.PORT

app.get("/",(req,res)=>{
    res.send("Welcome to circle API")
})

app.listen(port, ()=>{
    console.info(`server running at port ${port}` )
})