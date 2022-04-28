const express = require('express')
const app = express()
const port = 3001

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
      {id:1,name:'fadfas'},
      {id:2,name:'adfasd'},
      {id:3,name:'d'},
      {id:4,name:'adsfasdf'},
      {id:5,name:'adsfasdfasd'},
    ]
  })
})


app.listen(port, () => {
  console.log(`VD tại port : ${port}`)
})
