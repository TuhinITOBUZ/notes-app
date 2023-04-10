import mongoose from "mongoose";
import { credential } from "./config.js";

mongoose.connect(
  `mongodb+srv://${credential.username}:${credential.password}@${credential.cluster}.mongodb.net/${credential.dbname}?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

export const db = mongoose.connection;

db.on("error", error => {
  console.log('Error in MongoDb connection: ' + error)
});

db.once("open", function () {
  console.log("Connected successfully");
});