require("dotenv").config({ override: true });
const cors = require("cors");
const express = require("express");
const connectDB = require("./db");
const expressAsyncHandler = require("express-async-handler");
const path = require("path");

const controllers = require("./controllers");
const app = express();
// enabling cors for client requests to server endpoint
connectDB();
app.use(cors());

// parsing content as json
app.use(express.json());
// setup endpoint
app.post("/setup", expressAsyncHandler(controllers.setupHandler));
// transact wallet endpoint
app.post(
  "/transact/:walletid",
  expressAsyncHandler(controllers.transactHandler)
);
// fetch transactions for walletId end point
app.get(
  "/transactions",
  expressAsyncHandler(controllers.getTransactionsHandler)
);
// get wallet details
app.get("/wallet/:id", expressAsyncHandler(controllers.getWalletHandler));

/// exposing contents of client build folder to allow us to send the index.html file via a get request
if(process.env.ENV === "production"){
  const buildPath = path.join(__dirname, "..", "client", "build");
  app.use(express.static(buildPath));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000
app.listen(PORT , () => {
  console.log("listening on port "+PORT);
});
