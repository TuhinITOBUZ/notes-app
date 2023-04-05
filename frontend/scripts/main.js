const taskDetails = document.getElementById("task-details")
const taskHeading = document.getElementById("task-heading")
const updateTaskDetails = document.getElementById("update-task-details")
const updateTaskHeading = document.getElementById("update-task-heading")
const taskList = document.getElementById("task-list")
const createTaskDiv = document.getElementById("create-task")
const updateTaskDiv = document.getElementById("update-task")
const colorArray = ['#82CAFF', '#CCFFFF', '#E6E6FA', '#77BFC7', '#3EB489', '#54C571', '#ECC5C0']
let updateId = ""

function createTask() {
  createTaskDiv.style.display = "flex"
}

function closeCreateForm() {
  createTaskDiv.style.display = "none"
  taskHeading.value = "";
  taskDetails.value = "";
}

function closeUpdateForm() {
  updateTaskDiv.style.display = "none"
  updateTaskHeading.value = "";
  updateTaskDetails.value = "";
}

async function handleOnSubmitCreate(event) {
  event.preventDefault()
  if (taskHeading.value != "" && taskDetails.value != "") {
    await fetch("http://localhost:3000/add_task", {
      method: "POST",
      mode: 'cors',
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        heading: taskHeading.value,
        details: taskDetails.value,
      })
    }).then(() => {
      taskDetails.value = null;
      taskHeading.value = null;
    }).catch(error => {
      console.log(error);
    });
    createTaskDiv.style.display = "none"
    getTasks()
  }
  else {
    alert("Heading or details is missing")
  }
}

async function handleOnSubmitUpdate(event) {
  event.preventDefault();
  if (updateTaskHeading.value != "" && updateTaskDetails.value != "") {
    await fetch("http://localhost:3000/modify_task", {
      method: "PUT",
      mode: 'cors',
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        _id: updateId,
        heading: updateTaskHeading.value,
        details: updateTaskDetails.value,
      })
    }).then(() => {
      getTasks()
    }).catch(error => {
      console.log(error);
    });
    updateTaskDiv.style.display = "none"
    getTasks()
  }
  else {
    alert("Heading or details is missing")
  }
}

async function getTasks() {
  const response = await fetch("http://localhost:3000/tasks").then(function (res) {
    return res.json()
  }).catch((err) => {
    console.log(err);
  });
  if (response.error) {
    console.log(response.error.message);
  }
  else {
    taskList.innerHTML = ""
    for (let i = 0; i < response.data.length; i++) {
      let task = `
      <div class="task p-2 position-relative">
      <h2 class="w-75">${response.data[i].heading}</h2>
      <p>${response.data[i].details}</p>
      <div class="position-absolute top-0 end-0">
        <button onclick="deleteTask('${response.data[i]._id}')" class="delete-button p-1 m-1 border-0 bg-transparent"><i class="fa-solid fa-trash"></i></button>
        <button onclick="editTask('${response.data[i]._id}', '${response.data[i].heading}', '${response.data[i].details}')" class="edit-button p-1 m-1 border-0 bg-transparent"><i class="fa-regular fa-pen-to-square"></i></button>
      </div>
      </div>
      `
      taskList.innerHTML += task
    }
    setTaskBackgroundColor()
  }
}
getTasks()

async function deleteTask(id) {
  await fetch("http://localhost:3000/delete_task", {
    method: "DELETE",
    mode: 'cors',
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({
      _id: id
    })
  }).then(() => {
    getTasks()
  }).catch(error => {
    console.log(error);
  });
}

async function editTask(id, heading, details) {
  updateTaskDiv.style.display = "flex"
  updateTaskHeading.value = heading;
  updateTaskDetails.value = details;
  updateId = id
}

function setTaskBackgroundColor() {
  document.querySelectorAll(".task").forEach((task, index) => {
    task.style.backgroundColor = colorArray[index % 7]
  })
}
