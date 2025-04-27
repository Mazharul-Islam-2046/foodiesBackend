import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"

dotenv.config()

const app = express()

app.use(cors({
    // origin: process.env.CORS_ORIGIN
    origin: "http://localhost:5173",
    credentials: true
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())



// Routes Imports
import userRouter from "./routes/user.routes.js"
// import restaurantRouter from "./routes/restaurant.routes.js"
import menuItemRouter from "./routes/menuItem.routes.js"
// import orderRouter from "./routes/order.routes.js"
// import notificationRouter from "./routes/notification.routes.js"
// import favoriteRouter from "./routes/favorite.routes.js"
// import recommendationRouter from "./routes/recommendation.routes.js"
// import inventoryRouter from "./routes/inventory.routes.js"


app.use("/api/v1/users", userRouter);
app.use("/api/v1/menuItems", menuItemRouter);


export default app
