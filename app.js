const express = require('express')
const app = express()
const port = 1339
const path = require('path')

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html')
// })

// set the view engine to ejs
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('pages/index');
  // return res.redirect('/index.html');
});


app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
