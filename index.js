const express= require('express')
require ('dotenv').config()

const app=express()
const port = process.env.PORT

app.get("/",(req,res)=>{
    res.send("Welcome ti circle API")
})

app.listen(port, ()=>{
    console.info(`server running at port ${port}` )
})