/* Sample usage do not modify */
class FetchWrapper {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  get(endpoint) {
    return fetch(this.baseURL + endpoint).then((response) => response.json());
  }

  put(endpoint, body) {
    return this._send("put", endpoint, body);
  }

  post(endpoint, body) {
    return this._send("post", endpoint, body);
  }

  delete(endpoint, body) {
    return this._send("delete", endpoint, body);
  }

  _send(method, endpoint, body) {
    return fetch(this.baseURL + endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }).then((response) => response.json());
  }
}

const startLoader = (element) => {
  element.innerHTML = `<div class="loading-spinner"></div>`;
};

const stopLoader = (element, value) => {
  element.textContent = value;
};

const API = new FetchWrapper(
  "https://firestore.googleapis.com/v1/projects/programmingjs-90a13/databases/(default)/documents/"
);
const endpppoint = "shah";

const formm = document.getElementById("form");
const button = document.getElementById("button");
const formData = (e) => {
  e.preventDefault();
  let data = new FormData(formm);
  // console.log(typeof data.get("protein"));
  API.post(endpppoint, {
    fields: {
      name: { stringValue: data.get("food").toString() },
      carbs: {
        integerValue:
          data.get("carbs") === "" ? "0" : data.get("carbs").toString(),
      },
      protein: {
        integerValue:
          data.get("protein") === "" ? "0" : data.get("protein").toString(),
      },
      fat: {
        integerValue: data.get("fat") === "" ? "0" : data.get("fat").toString(),
      },
      minerals: {
        integerValue:
          data.get("minerals") === "" ? "0" : data.get("minerals").toString(),
      },
    },
  });
  formm.reset();

  Snackbar.show({
    width: "220px",
    text: `Details of ${data.get("food").toString()} added successfully`,
  });

  let canvasDiv = document.getElementById("canvasDiv");
  canvasDiv.innerHTML = "";
  canvasDiv.innerHTML = `<canvas id="myChart"></canvas>`;
  ctx = document.getElementById("myChart");

  let myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["carbs", "protein", "fat", "minerals"],
      datasets: [
        {
          label: `nutrition charts for ${data.get("food").toString()}`,
          data: [
            data.get("carbs"),
            data.get("protein"),
            data.get("fat"),
            data.get("minerals"),
          ],
          backgroundColor: [
            "rgba(255, 99, 132, 0.8)",
            "rgba(54, 162, 235, 0.8)",
            "rgba(255, 206, 86, 0.8)",
            "rgba(75, 192, 192, 0.8)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 0.8)",
            "rgba(54, 162, 235, 0.8)",
            "rgba(255, 206, 86, 0.8)",
            "rgba(75, 192, 192, 0.8)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
  let card = document.getElementById("card");
  let total = 0;
  let total2 = 0;
  API.get(endpppoint).then((repos) => {
    let liist = repos.documents;
    if (typeof liist !== "undefined") {
      let allFields = liist.map((i) => i.fields);
      console.log(allFields);
      allFields.map((i) => {
        const todoDiv = document.createElement("div");
        todoDiv.classList.add("todo");
        const h2 = document.createElement("h2");
        h2.classList.add("h2_class");
        h2.innerText = `name of the food is ${Object.values(i.name)}`;
        todoDiv.appendChild(h2);
        const para_title = document.createElement("h2");
        para_title.classList.add("para_title");
        para_title.innerText = ` total calories is ${
          (Number(Object.values(i.carbs)) + Number(Object.values(i.protein))) *
            4 +
          Number(Object.values(i.fat)) * 9
        }`;
        todoDiv.appendChild(para_title);
        const final_todo = document.createElement("div");
        final_todo.classList.add("final_todo");
        let p_fat = document.createElement("p");
        p_fat.classList.add("p_fat");
        p_fat.innerText = `fat: ${Object.values(i.fat)} `;
        final_todo.appendChild(p_fat);

        let p_protein = document.createElement("p");
        p_protein.classList.add("p_protein");
        p_protein.innerText = ` protein: ${Object.values(i.protein)} `;
        final_todo.appendChild(p_protein);

        let p_carbs = document.createElement("p");
        p_carbs.classList.add("p_carbs");
        p_carbs.innerText = ` carbs: ${Object.values(i.carbs)}`;
        final_todo.appendChild(p_carbs);

        todoDiv.appendChild(final_todo);

        card.appendChild(todoDiv);
      });

      allFields.map((i) => {
        total +=
          (Number(Object.values(i.carbs)) + Number(Object.values(i.protein))) *
            4 +
          Number(Object.values(i.fat)) * 9;
      });
    }
    total2 =
      (Number(data.get("carbs")) + Number(data.get("protein"))) * 4 +
      Number(data.get("fat")) * 9;
    //calories calculations
    let log = document.getElementById("log");
    log.innerHTML = `<p id="logValue"></p>`;
    let logValue = document.getElementById("logValue");
    let calc = total + total2;
    logValue.innerText = `Total calories logged: ${calc} cal`;
  });
};

button.addEventListener("click", formData);
