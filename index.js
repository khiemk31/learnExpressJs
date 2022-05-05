const express = require('express');
const app = express();

const port = 3001;

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


var users = [
  { id: 1, name: 'khiem1' },
  { id: 2, name: 'khiem2' },
  { id: 3, name: 'luc3' },
  { id: 4, name: 'tri4' },
  { id: 5, name: 'cuong5' },
  { id: 6, name: 'cuong5' },
];
app.get('/', (req, res) => {
  res.render('index', {
    name: 'khiem',
  });
});

app.get('/users', (req, res) => {
  res.render('users/index', {
    users: users,
  });
});

app.get('/users/search', (req, res) => {
  var q = req.query.q;
  var matchedUsers = users.filter((user) => {
    return user.name.toLowerCase.indexOf(q.toLowerCase) != -1;
  });
  res.render('users/index', {
    users: matchedUsers,
  });
});

app.get('/users/create', (req, res) => {
  res.render('users/create');
});

app.post('/users/create' ,(req,res)=>{
  users.push(req.body);
  res.redirect('/users');
});

app.listen(port, () => {
  console.log(`khởi tạo cổng : ${port}`);
});
