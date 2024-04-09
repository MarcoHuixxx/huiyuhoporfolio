const express = require('express')
const app = express()
const port = 1342
const path = require('path')
const { pageText } = require('./src/constants/pageText.js');
const expressLayouts = require('express-ejs-layouts');
const ejs = require('ejs');
const fs = require('fs');
// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html')
// })

// set the view engine to ejs
app.use(expressLayouts)
app.set('layout', './layouts/layout')
app.set('view engine', 'ejs');



//return not found page
// app.use((req, res, next) => {
//   console.log('404')
//   const language = req.params.language || "hk";
//   console.log(" pageText[language]:", pageText[language])
//   res.render('pages/404', {
//     pageText: pageText[language],
//     language: language
//   }
//   )
// })

app.get('/:language', (req, res) => {
  const language = req.params.language || "hk";
  if (!['hk', 'en'].includes(language)) {
    console.log("xqd1d11")
    res.render('pages/404', {
      pageText: pageText['hk'],
      language: 'hk'
    })
  }
  res.render('pages/index', {
    pageText: pageText[language],
    language: language
  }
  );

});

app.get('/:language/contact-us', (req, res) => {
  const language = req.params.language || "hk";
  res.render('pages/contact-us', {
    pageText: pageText[language],
    language: language
  }
  );
}
);

app.get('/:language/price-list', (req, res) => {
  const language = req.params.language || "hk";
  res.render('pages/price-list', {
    pageText: pageText[language],
    language: language
  }
  );
}
);

app.get('/', (req, res) => {
  const language = "hk";
  res.render('pages/index', {
    pageText: pageText[language],
    language: language
  }
  );

});

app.get('/:language/contact/open-whatsapp-api/:link', (req, res) => {
  const link = req.params.link;
  const language = req.params.language || "hk";
  return res.redirect(pageText[language][link]);
});





app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
