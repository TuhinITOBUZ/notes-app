import express from "express"
import { taskModel } from "./models.js";

export const app = express();

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
      message: error.message,
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
      message: error.message,
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
      message: error.message,
      status: 400,
      success: false,
    })
  }
})

//read data from the collection
app.get("/tasks", async (request, response) => {
  const tasks = await taskModel.find();
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
      message: error.message,
      status: 400,
      success: false
    })
  }
});
