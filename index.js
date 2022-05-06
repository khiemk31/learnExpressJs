const express = require("express");
const db = require("./db");
userRoute = require("./routers/user.route");

const port = 3000;

const app = express();
app.set("view engine", "pug");
app.set("views", "./views");

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get("/", (req, res) => {
  res.render("index", {
    name: "khiem",
  });
});

app.use("/users", userRoute);

app.listen(port, () => {
  console.log(`khởi tạo cổng : ${port}`);
});
