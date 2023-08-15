const express=reqwuire("express")
const app=express()
const cors=require("cors")
const port=3000;

app.use(cors())
app.use(express.static())


// port runner
app.listen(port,(err)=>{
    if(err) throw new Error("server aspleep..")
    console.log(`server is up on port :${port}`)
})