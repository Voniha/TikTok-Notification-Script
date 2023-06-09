const url = "http://localhost:3000"; // Put your hosting url here, example: http://localhost:3000 or your configurated domain name for api.

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
      let list = document.getElementById("streamers");
      let li = document.createElement("li");
      let name = document.createElement("div");
      name.className = "name";
      name.innerHTML = input.value;
      let img = document.createElement("div");
      img.className = "img";
      let imgTag = document.createElement("img");
      imgTag.setAttribute("src", data.data.avatar);
      let status = document.createElement("div");
      let statusBtn = document.createElement("div");
      statusBtn.className = "status-btn";
      let enabledBtn = document.createElement("button");
      if (data.data.enabled) {
        enabledBtn.setAttribute("class", "btn btn-danger");
        enabledBtn.setAttribute("onclick", "status(this.name)");
        enabledBtn.setAttribute("name", input.value);
        enabledBtn.innerHTML = "Disable";
      }
      if (!data.data.enabled) {
        enabledBtn.setAttribute("class", "btn btn-success");
        enabledBtn.setAttribute("onclick", "status(this.name)");
        enabledBtn.setAttribute("name", input.value);
        enabledBtn.innerHTML = "Enable";
      }
      status.className = "status";
      status.innerHTML = data.data.status === "Offline" ? "Offline" : "Live";
      let rmbtn = document.createElement("div");
      rmbtn.className = "rm-btn";
      let rmbtnTag = document.createElement("button");
      rmbtnTag.setAttribute("class", "btn btn-danger");
      rmbtnTag.setAttribute("value", input.value);
      rmbtnTag.setAttribute("onclick", `remove(this.value)`);
      rmbtnTag.innerHTML = "Remove";
      rmbtn.appendChild(rmbtnTag);
      statusBtn.appendChild(enabledBtn);
      img.appendChild(imgTag);
      li.appendChild(name);
      li.appendChild(img);
      li.appendChild(status);
      li.appendChild(rmbtn);
      li.appendChild(statusBtn);
      list.appendChild(li);
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
      if (data.status === 400) return alert(`${user} does not exist`);
      let list = document.getElementById("streamers");
      let li = document.querySelector(`button[name="${user}"]`);
      console.log(li);
      list.removeChild(li);
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

      setTimeout(() => {
        location.reload();
      }, 3000);
    })
    .catch((err) => {
      console.log(err);
    });
}

function clearTable() {
  if (!url) return alert("No url provided");
  let list = document.getElementById("streamers");
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
  let list = document.getElementById("streamers");
  if (list.children.length < 1) return alert("There are no users to stop");
  for (let child of list.children) {
    fetch(`${url}/api/v1/get`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: child.children[0].innerHTML,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 400)
          return alert(`${data.data.username} does not exist`);
        let status = data.data.enabled;
        let button = document.querySelector(
          `button[name="${data.data.username}"]`
        );
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
  let list = document.getElementById("streamers");
  if (list.children.length < 1) return alert("There are no users to start");
  for (let child of list.children) {
    fetch(`${url}/api/v1/get`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: child.children[0].innerHTML,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 400)
          return alert(`${data.data.username} does not exist`);
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
