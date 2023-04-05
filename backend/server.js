import express from "express"
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";

const taskSchema = new mongoose.Schema({
  heading: {
    type: String,
    require: true,

  },
  details: {
    type: String,
    require: true,
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


//add data to the collection
app.post("/add_task", async (request, response) => {
  const task = new taskModel(request.body);
  try {
    await task.save();
    response.send({
      data: task,
      message: "task added",
      status: 200,
      success: true,
    });
  } catch (error) {
    response.send({
      data: null,
      message: error,
      status: 400,
      success: false
    })
  }
});

//update data
app.put("/modify_task", async (request, response) => {
  const task = new taskModel(request.body);
  try {
    const doc = await taskModel.findOneAndUpdate(
      { _id: request.body._id },
      {
        $set: {
          heading: request.body.heading,
          details: request.body.details,
        }
      }
    )
    response.send({
      data: task,
      message: "task updated",
      status: 200,
      success: true
    });
  } catch (error) {
    response.send({
      data: null,
      message: error,
      status: 400,
      success: false,
    })
  }
})

//delete data from database
app.delete("/delete_task", async (request, response) => {
  const task = new taskModel(request.body);
  try {
    await taskModel.findOneAndDelete({ _id: request.body._id })
    response.send({
      data: task,
      message: "task deleted",
      status: 200,
      success: true,
    });
  }
  catch (error) {
    response.send({
      data: null,
      message: error,
      status: 400,
      success: false,
    })
  }
})

//read data from the collection
app.get("/tasks", async (request, response) => {
  const tasks = await taskModel.find({});
  try {
    response.send({
      data: tasks,
      message: "All tasks",
      status: 200,
      success: true
    });
  } catch (error) {
    response.send({
      data: null,
      message: error,
      status: 400,
      success: false
    })
  }
});

app.listen(3000, () => {
  console.log("Server is running at port 3000");
});