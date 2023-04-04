const taskDetails = document.getElementById("taskDetails")

function handleOnSubmit(event) {
  event.preventDefault()
  fetch("http://localhost:3000/form_data", {
    method: "POST",
    mode: 'cors',
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(`${taskDetails}`),
    // body: "testing",
  }).then(() => {
    taskDetails.value = null;
    alert("Form submitted successfully!");
  }).catch(error => {
    console.log(error);
  });
}