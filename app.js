const express = require('express')
const app = express()
const port = 1340
const path = require('path')
const { pageText } = require('./src/constants/pageText.js');
const expressLayouts = require('express-ejs-layouts');

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html')
// })

// set the view engine to ejs
app.use(expressLayouts)
app.set('layout', './layouts/layout')
app.set('view engine', 'ejs');

app.get('/:language', (req, res) => {
  const language = req.params.language||"hk";
  res.render('pages/index', {
    pageText: pageText[language],
    language: language
  }
  );
  // return res.redirect('/index.html');
});

app.get('/:language/about-us', (req, res) => {
  const language = req.params.language||"hk";
  res.render('pages/about-us', {
    pageText: pageText[language],
    language: language
  }
  );
  // return res.redirect('/index.html');
}
);

app.get('/', (req, res) => {
  const language = "hk";
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
