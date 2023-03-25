const url = "";

function add() {
  if (!url) return alert("No url provided");
  let input = document.getElementById("text-box");
  let webhook = document.getElementById("webhook");
  if (input.value.length < 1) return alert("Please enter a value");
  if (webhook.value.length < 1) return alert("No url provided");
  if (!webhook.value.includes("https://discord.com/api/webhooks/"))
    return alert("Please enter a valid webhook URL");
  fetch(`${url}/api/v1/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: input.value,
      webhook: webhook.value,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status === 400) return alert(`${input.value} already exists`);
      let list = document.getElementById("table-body");
      let tr = document.createElement("tr");
      tr.style = "background-color: #2f3136;";
      let th = document.createElement("th");
      th.setAttribute("scope", "row");
      th.innerHTML = list.children.length + 1;
      th.style = "color: #fff";
      let td = document.createElement("td");
      td.style = "color: #fff;";
      td.innerHTML = input.value;
      let statusTd = document.createElement("td");
      statusTd.style = "color: #fff";
      statusTd.innerHTML = data.data.status;
      let actionTd = document.createElement("td");
      actionTd.style = "color: #fff";
      let button = document.createElement("button");
      button.setAttribute("id", input.value);
      button.setAttribute("class", "btn btn-danger");
      button.setAttribute("onclick", "remove(this.id)");
      button.innerHTML = "Remove";
      actionTd.appendChild(button);
      let statusButton = document.createElement("button");
      statusButton.setAttribute("name", input.value);
      statusButton.style = "margin: 0 0 0 10px";
      if (data.data.enabled) {
        statusButton.innerHTML = "Disable";
        statusButton.setAttribute("class", "btn btn-danger");
        statusButton.setAttribute("onclick", "status(this.name)");
      }
      if (!data.data.enabled) {
        statusButton.innerHTML = "Enable";
        statusButton.setAttribute("class", "btn btn-success");
        statusButton.setAttribute("onclick", "status(this.name)");
      }
      actionTd.appendChild(statusButton);
      tr.appendChild(th);
      tr.appendChild(td);
      tr.appendChild(statusTd);
      tr.appendChild(actionTd);
      list.appendChild(tr);
    })
    .catch((err) => {
      console.log(err);
    });
}

function remove(buttonId) {
  if (!url) return alert("No url provided");
  let user = buttonId;
  console.log(user);
  fetch(`${url}/api/v1/remove`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: user,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status === 400) return alert(`${username} does not exist`);
      let list = document.getElementById("table-body");
      for (let i = 0; i < list.children.length; i++) {
        list.children[i].children[0].innerHTML = i + 1;
      }
    })
    .catch((err) => {
      console.log(err);
    });

  setTimeout(() => {
    location.reload();
  }, 3000);
}

function status(username) {
  if (!url) return alert("No url provided");
  fetch(`${url}/api/v1/get`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status === 400) return alert(`${username} does not exist`);
      let status = data.data.enabled;
      let button = document.querySelector(`button[name="${username}"]`);
      if (!status) {
        data.data.enabled = true;
        button.innerHTML = "Disable";
        button.setAttribute("class", "btn btn-danger");
        button.setAttribute("onclick", "status(this.name)");
        fetch(`${url}/api/v1/save`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            roomId: data.data.roomId,
            data: data.data,
          }),
        });
      }
      if (status) {
        data.data.enabled = false;
        button.innerHTML = "Enable";
        button.setAttribute("class", "btn btn-success");
        button.setAttribute("onclick", "status(this.name)");
        fetch(`${url}/api/v1/save`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            roomId: data.data.roomId,
            data: data.data,
          }),
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function clearTable() {
  if (!url) return alert("No url provided");
  let list = document.getElementById("table-body");
  if (list.children.length < 1) return alert("There are no users to clear");
  fetch(`${url}/api/v1/clear`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((data) => {
    let clearbtn = document.getElementById("clear-btn");
    clearbtn.setAttribute("class", "btn btn-success");
    clearbtn.innerHTML = "Cleared";
    setTimeout(() => {
      clearbtn.setAttribute("class", "btn btn-primary");
      clearbtn.innerHTML = "Clear";
      location.reload();
    }, 3000);
  });
}

function stopAll() {
  if (!url) return alert("No url provided");
  let list = document.getElementById("table-body");
  if (list.children.length < 1) return alert("There are no users to stop");
  for (let child of list.children) {
    fetch(`${url}/api/v1/get`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: child.children[1].innerHTML,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 400) return alert(`${username} does not exist`);
        let status = data.data.enabled;
        let button = document.querySelector(
          `button[name="${data.data.username}"]`
        );
        console.log(status);
        if (status) {
          data.data.enabled = false;
          button.innerHTML = "Enable";
          button.setAttribute("class", "btn btn-success");
          button.setAttribute("onclick", "status(this.name)");
          fetch(`${url}/api/v1/save`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              roomId: data.data.roomId,
              data: data.data,
            }),
          });
        }
      });
  }
}

function startAll() {
  if (!url) return alert("No url provided");
  let list = document.getElementById("table-body");
  if (list.children.length < 1) return alert("There are no users to start");
  for (let child of list.children) {
    fetch(`${url}/api/v1/get`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: child.children[1].innerHTML,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 400) return alert(`${username} does not exist`);
        let status = data.data.enabled;
        let button = document.querySelector(
          `button[name="${data.data.username}"]`
        );
        console.log(status);
        if (!status) {
          data.data.enabled = true;
          button.innerHTML = "Disable";
          button.setAttribute("class", "btn btn-danger");
          button.setAttribute("onclick", "status(this.name)");
          fetch(`${url}/api/v1/save`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              roomId: data.data.roomId,
              data: data.data,
            }),
          });
        }
      });
  }
}
