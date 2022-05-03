const express = require("express");
const app = express();
const port = 3001;

app.set("view engine", "pug");
app.set("views", "./views");

app.get("/", (req, res) => {
  res.render("index", {
    name: "khiem",
  });
});
app.get("/users", (req, res) => {
  res.render("users/index", {
    users: [
      { id: 1, name: "khieem" },
      { id: 2, name: "luc" },
      { id: 3, name: "hoang " },
      { id: 4, name: "thinh" },
      { id: 5, name: "kien" },
    ],
  });
});

app.listen(port, () => {
  console.log(`VD tại port : ${port}`);
});
