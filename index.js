const express = require("express");
const app = express();
const port = 3001;

<<<<<<< HEAD
app.set('view engine','pug')
app.set('views', './views')

app.get('/', (req, res) => {
  res.render('index',{
    name :'khiem'
  })
})
app.get('/users', (req, res) => {
  res.render('users/index',{
    users:[
      {id:1,name:'fadfas',},
      {id:2,name:'adfasd'},
      {id:3,name:'d'},
      {id:4,name:'adsfasdf'},
      {id:5,name:'adsfasdfasd'},
    ]
  })
})

app.get('/user/search')
=======
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
>>>>>>> 901e5201402a8745803c56a9a10f06dffdfb43d3

app.listen(port, () => {
  console.log(`VD tại port : ${port}`);
});
