const express = require('express')
const app = express()
const port = 1340
const path = require('path')
const { pageText } = require('./src/constants/pageText.js');

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html')
// })

// set the view engine to ejs
app.set('view engine', 'ejs');

app.get('/:language', (req, res) => {
  const language = req.params.language;
  res.render('pages/index', {
    pageText: pageText[language],
    language: language
  }
  );
  // return res.redirect('/index.html');
});


app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
