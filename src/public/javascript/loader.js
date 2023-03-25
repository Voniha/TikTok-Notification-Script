window.onload = () => {
  const url = ""; // Put your hosting url here, example: http://localhost:3000 or your configurated domain name for api.
  if (!url) return alert("No url provided");
  fetch(`${url}/api/v1/getAll`)
    .then((res) => res.json())
    .then((data) => {
      let list = document.getElementById("table-body");
      for (let i = 0; i < data.data.length; i++) {
        let tr = document.createElement("tr");
        let th = document.createElement("th");
        tr.style = "background-color: #2f3136;";
        th.setAttribute("scope", "row");
        th.style = "color: #fff";
        th.innerHTML = i + 1;
        let td = document.createElement("td");
        td.style = "color: #fff";
        td.innerHTML = data.data[i].username;
        let statusTd = document.createElement("td");
        statusTd.style = "color: #fff";
        statusTd.innerHTML = data.data[i].status;
        let actionTd = document.createElement("td");
        actionTd.style = "color: #fff";
        let button = document.createElement("button");
        button.setAttribute("id", data.data[i].username);
        button.setAttribute("class", "btn btn-danger");
        button.setAttribute("onclick", "remove(this.id)");
        button.innerHTML = "Remove";
        let statusButton = document.createElement("button");
        statusButton.setAttribute("name", data.data[i].username);
        statusButton.style = "margin: 0 0 0 10px";
        actionTd.appendChild(button);
        tr.appendChild(th);
        tr.appendChild(td);
        tr.appendChild(statusTd);
        tr.appendChild(actionTd);
        list.appendChild(tr);
        if (!data.data[i].enabled) {
          statusButton.innerHTML = "Enable";
          statusButton.setAttribute("class", "btn btn-success");
          statusButton.setAttribute("onclick", "status(this.name)");
        }

        if (data.data[i].enabled) {
          statusButton.innerHTML = "Disable";
          statusButton.setAttribute("class", "btn btn-danger");
          statusButton.setAttribute("onclick", "status(this.name)");
        }
        actionTd.appendChild(statusButton);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
