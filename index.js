const express = require("express");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");

const connectDB = require("./config/config");
const app = express();

const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", productRoutes);

connectDB();

app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`)
);
