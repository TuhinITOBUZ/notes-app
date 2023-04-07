import express from "express"
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import * as routers from "./routes.js";
import { credential } from "./config.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

mongoose.connect(
  `mongodb+srv://${credential.username}:${credential.password}@${credential.cluster}.mongodb.net/${credential.dbname}?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

const db = mongoose.connection;

db.on("error", error => {
  console.log('Error in MongoDb connection: ' + error)
});
db.once("open", function () {
  console.log("Connected successfully");
});

app.use(routers.app);

app.listen(3000, () => {
  console.log("Server is running at port 3000");
});