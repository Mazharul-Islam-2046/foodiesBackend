import app from "./app.js"
import dotenv from "dotenv"


dotenv.config({
    path: './.env'
})

const port = process.env.PORT



app.get('/', (req, res) => {
    res.send("Alhamdulillah")
})



  
  app.listen(port, () => {
    console.log(`app listening on port ${port}`)
  })
