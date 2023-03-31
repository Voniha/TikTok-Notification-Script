window.onload = () => {
  const url = "http://localhost:3000"; // Put your hosting url here, example: http://localhost:3000 or your configurated domain name for api.
  if (!url) return alert("No url provided");
  fetch(`${url}/api/v1/getAll`)
    .then((res) => res.json())
    .then((data) => {
      let list = document.getElementById("table-body");
      for (let i = 0; i < data.data.length; i++) {
        if (data.status === 400) return alert(`${data.data[i].username} already exists`);
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
        status.className = "status";
        status.innerHTML = data.data[i].status ? "Live" : "Offline";
        let rmbtn = document.createElement("div");
        rmbtn.className = "rm-btn";
        let rmbtnTag = document.createElement("button");
        rmbtnTag.setAttribute("class", "btn btn-danger");
        rmbtnTag.setAttribute("onclick", "remove(this.name)");
        rmbtnTag.setAttribute("name", data.data[i].username);
        rmbtnTag.innerHTML = "Remove";
        rmbtn.appendChild(rmbtnTag);
        img.appendChild(imgTag);
        li.appendChild(name);
        li.appendChild(img);
        li.appendChild(status);
        li.appendChild(rmbtn);
        list.appendChild(li);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
