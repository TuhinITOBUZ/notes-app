import express from "express"
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";

const taskSchema = new mongoose.Schema({
  heading: {
    type: String,
    // require: true,

  },
  details: {
    type: String,
    // require: true,
  },
});

const taskModel = mongoose.model("task", taskSchema);

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


const username = "tuhin";
const password = "O4E0h0lSaghN0AwG";
const cluster = "notescluster.jwpxl2v";
const dbname = "notes";

mongoose.connect(
  `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${dbname}?retryWrites=true&w=majority`,
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

app.post("form_data", async (request, response) => {
  try {
    console.log(JSON.stringify(request))
  }
  catch (err) {
    console.log(err)
  }
})

//add data to the collection
app.post("/add_task", async (request, response) => {
  const task = new taskModel(request.body);
  try {
    await task.save();
    response.send(task);
  } catch (error) {
    response.status(500).send(error);
  }
});

//update data
app.put("/modify_task", async (request, response) => {
  const task = new taskModel(request.body);
  try {
    const doc = await taskModel.findOneAndUpdate(
      { heading: request.body.heading },
      {
        $set: {
          heading: request.body.newheading,
          details: request.body.newdetails,
        }
      }
    )
    console.log(doc)
    response.send(task);
  } catch (error) {
    response.status(500).send(error);
  }
})

//delete data from database
app.delete("/delete_task", async (request, response) => {
  const task = new taskModel(request.body);
  try {
    await taskModel.findOneAndDelete({ heading: request.body.heading })
    response.send(task);
  }
  catch (error) {
    console.log(error);
  }
})

//read data from the collection
app.get("/tasks", async (request, response) => {
  const tasks = await taskModel.find({});
  try {
    response.send(tasks);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.listen(3000, () => {
  console.log("Server is running at port 3000");
});