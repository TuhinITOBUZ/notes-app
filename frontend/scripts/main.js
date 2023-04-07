const taskDetails = document.getElementById("taskDetails")
const taskHeading = document.getElementById("taskHeading")
const updateTaskDetails = document.getElementById("updateTaskDetails")
const updateTaskHeading = document.getElementById("updateTaskHeading")
const taskList = document.getElementById("taskList")
const createTaskDiv = document.getElementById("createTask")
const updateTaskDiv = document.getElementById("update-task-id")
const colorArray = ['#ccd5ae', '#e9edc9', '#faedcd', '#d4a373']
const closeBtns = document.querySelectorAll(".close");
let updateId = ""
let deleteId = ""

closeBtns.forEach(button => {
  button.addEventListener("click", () => {
    document.getElementById("addNoteToastMessage").style.display = "none"
    document.getElementById("updateNoteToastMessage").style.display = "none"
    document.getElementById("deleteNoteToastMessage").style.display = "none"
  })
})

document.querySelectorAll(".clear-note-button").forEach(button => {
  button.addEventListener("click", () => {
    updateTaskHeading.value = ""
    taskHeading.value = ""
    updateTaskDetails.value = ""
    taskDetails.value = ""
  })
})

function setTaskBackgroundColor() {
  document.querySelectorAll(".task").forEach((task, index) => {
    task.style.backgroundColor = colorArray[index % 4]
  })
}

function createTask() {
  createTaskDiv.style.display = "flex"
}

function closeView() {
  document.getElementById("viewTask").style.display = "none"
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

function confirmDeleteTask(id) {
  deleteId = id
  document.getElementById("checkBox").style.display = "flex"
}

function yesDeleteTask() {
  deleteTask(deleteId)
}

function notDeleteTask() {
  deleteId = ""
  document.getElementById("checkBox").style.display = "none"
}

async function editTask(id, heading, details) {
  updateTaskDiv.style.display = "flex"
  updateTaskHeading.value = heading;
  updateTaskDetails.value = details;
  updateId = id
}

function viewTask(heading, details) {
  document.getElementById("viewTask").style.display = "flex"
  document.getElementById("viewTaskHeading").innerHTML = heading
  document.getElementById("viewTaskDetails").innerHTML = details
}

async function performBackendOperation(path, method, bodyDetails) {
  let url = `http://localhost:3000/${path}`
  if (method === "GET") {
    const response = await fetch(url, {
      method: "GET",
      mode: 'cors',
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }).then(function (res) {
      return res.json()
    }).catch((err) => {
      console.log(err);
    });
    return response
  }
  else {
    const response = await fetch(url, {
      method: method,
      mode: 'cors',
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(bodyDetails)
    }).then(function (res) {
      return res.json()
    }).catch((err) => {
      console.log(err);
    });
    return response
  }
}

async function handleOnSubmitCreate(event) {
  event.preventDefault()
  if (taskHeading.value != "" && taskDetails.value != "") {
    const bodyDetails = {
      heading: taskHeading.value,
      details: taskDetails.value,
    }
    await performBackendOperation("add_task", "POST", bodyDetails).then(() => {
      taskDetails.value = null;
      taskHeading.value = null;
      createTaskDiv.style.display = "none"
      document.getElementById("addNoteToastMessage").style.display = "flex"
      setTimeout(() => {
        document.getElementById("addNoteToastMessage").style.display = "none"
      }, 4000)
      getTasks()
    })
  }
}

async function handleOnSubmitUpdate(event) {
  event.preventDefault();
  if (updateTaskHeading.value != "" && updateTaskDetails.value != "") {
    const bodyDetails = {
      _id: updateId,
      heading: updateTaskHeading.value,
      details: updateTaskDetails.value,
    }
    await performBackendOperation("modify_task", "PUT", bodyDetails).then(() => {
      document.getElementById("updateNoteToastMessage").style.display = "flex"
      setTimeout(() => {
        document.getElementById("updateNoteToastMessage").style.display = "none"
      }, 4000)
    })
    updateTaskDiv.style.display = "none"
    getTasks()
  }
  else {
    alert("Heading or details is missing")
  }
}

async function getTasks() {
  const response = await performBackendOperation("tasks", "GET", {})
  if (response.error) {
    console.log(response.error.message);
  }
  else {
    if (response.data.length > 0) {
      document.getElementById("notesSubHeading").display = "block"
      document.getElementById("notesSubHeading").innerHTML = `${response.data.length} Notes`
    }
    else {
      document.getElementById("notesSubHeading").display = "none"
      document.getElementById("notesSubHeading").innerHTML = ""
    }
    taskList.innerHTML = ""
    for (let i = 0; i < response.data.length; i++) {
      let task = `
      <div class="task p-2 position-relative">
      <h2 class="w-75 overflow-auto">${response.data[i].heading}</h2>
      <p class="width-85">${response.data[i].details}</p>
      <div class="position-absolute top-0 end-0 d-flex flex-column gap-2 p-1">
        <button onclick="viewTask('${response.data[i].heading}', '${response.data[i].details}')" class="view-button border-0 bg-transparent"><i class="fa-regular fa-eye"></i></button>
        <button onclick="editTask('${response.data[i]._id}', '${response.data[i].heading}', '${response.data[i].details}')" class="edit-button border-0 bg-transparent"><i class="fa-regular fa-pen-to-square"></i></button>
        <button onclick="confirmDeleteTask('${response.data[i]._id}')" class="delete-button border-0 bg-transparent"><i class="fa-solid fa-trash"></i></button>
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
  document.getElementById("checkBox").style.display = "none"
  const bodyDetails = { _id: id }
  await performBackendOperation("delete_task", "DELETE", bodyDetails).then(() => {
    document.getElementById("deleteNoteToastMessage").style.display = "flex"
    setTimeout(() => {
      document.getElementById("deleteNoteToastMessage").style.display = "none"
    }, 4000)
  })
  getTasks()
}