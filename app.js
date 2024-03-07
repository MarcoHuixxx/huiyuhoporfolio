const express = require('express')
const app = express()
const port = 1339
const path = require('path')

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html')
// })

app.get('/', (req, res) => {
  return res.redirect('/index.html');
});


app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
