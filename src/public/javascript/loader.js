window.onload = () => {
  const url = "http://localhost:3000"; // Put your hosting url here, example: http://localhost:3000 or your configurated domain name for api.
  if (!url) return alert("No url provided");
  fetch(`${url}/api/v1/getAll`)
    .then((res) => res.json())
    .then((data) => {
      for (let i = 0; i < data.data.length; i++) {
        if (data.status === 400)
          return alert(`${data.data[i].username} already exists`);
        let list = document.getElementById("streamers");
        let li = document.createElement("li");
        let name = document.createElement("div");
        name.className = "name";
        name.innerHTML = data.data[i].username;
        let img = document.createElement("div");
        img.className = "img";
        let imgTag = document.createElement("img");
        imgTag.setAttribute("src", data.data[i].avatar);
        let status = document.createElement("div");
        let statusBtn = document.createElement("div");
        statusBtn.className = "status-btn";
        let enabledBtn = document.createElement("button");
        if (data.data[i].enabled) {
          enabledBtn.setAttribute("class", "btn btn-danger");
          enabledBtn.setAttribute("onclick", "status(this.name)");
          enabledBtn.setAttribute("name", data.data[i].username);
          enabledBtn.innerHTML = "Disable";
        }
        if (!data.data[i].enabled) {
          enabledBtn.setAttribute("class", "btn btn-success");
          enabledBtn.setAttribute("onclick", "status(this.name)");
          enabledBtn.setAttribute("name", data.data[i].username);
          enabledBtn.innerHTML = "Enable";
        }
        status.className = "status";
        status.innerHTML = data.data[i].status === "Offline" ? "Offline" : "Live";
        let rmbtn = document.createElement("div");
        rmbtn.className = "rm-btn";
        let rmbtnTag = document.createElement("button");
        rmbtnTag.setAttribute("class", "btn btn-danger");
        rmbtnTag.setAttribute("onclick", "remove(this.value)");
        rmbtnTag.setAttribute("value", data.data[i].username)
        rmbtnTag.innerHTML = "Remove";
        statusBtn.appendChild(enabledBtn);
        rmbtn.appendChild(rmbtnTag);
        img.appendChild(imgTag);
        li.appendChild(name);
        li.appendChild(img);
        li.appendChild(status);
        li.appendChild(rmbtn);
        li.appendChild(statusBtn);
        list.appendChild(li);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
