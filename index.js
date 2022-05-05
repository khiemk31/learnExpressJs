const express = require("express");
const app = express();

const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("db.json");
db = low(adapter);

const port = 3001;

app.set("view engine", "pug");
app.set("views", "./views");

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

db.defaults({ users: [] }).write();

app.get("/", (req, res) => {
  res.render("index", {
    name: "khiem",
  });
});

app.get("/users", (req, res) => {
  res.render("users/index", {
    users: db.get("users").value(),
  });
});

app.get("/users/search", (req, res) => {
  var q = req.query.q;
  var matchedUsers = db
    .get("users")
    .value()
    .filter((user) => {
      return user.name.toLowerCase().indexOf(q.toLowerCase()) != -1;
    });
  console.log("111", matchedUsers);
  res.render("users/index", {
    users: matchedUsers,
  });
});

app.get("/users/create", (req, res) => {
  res.render("users/create");
});

app.post("/users/create", (req, res) => {
  db.get("users").push(req.body).write();
  res.redirect("/users");
});

app.get("/users/:id", (req, res) => {
  var id = parseInt(req.params.id);
  var user = db.get("users").find({ id: id }).value();

  res.render("users/view", {
    user: user,
  });
});

app.listen(port, () => {
  console.log(`khởi tạo cổng : ${port}`);
});
