const express = require('express')
const app = express()
const port = 1340
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

app.get('/:language', (req, res) => {
  const language = req.params.language||"hk";
  res.render('pages/index', {
    pageText: pageText[language],
    language: language
  }
  );

});

app.get('/:language/about-us', (req, res) => {
  const language = req.params.language||"hk";
  res.render('pages/about-us', {
    pageText: pageText[language],
    language: language
  }
  );
}
);

app.get('/:language/services', (req, res) => {
  const language = req.params.language||"hk";
  res.render('pages/service', {
    pageText: pageText[language],
    language: language
  }
  );
}
);

app.get('/:language/voucher', (req, res) => {
  const language = req.params.language||"hk";
  res.render('pages/voucher', {
    pageText: pageText[language],
    language: language
  }
  );
}
);

app.get('/:language/contact-us', (req, res) => {
  const language = req.params.language||"hk";
  res.render('pages/contact-us', {
    pageText: pageText[language],
    language: language
  }
  );
}
);

app.get('/:language/blog-details/:blogId', async(req, res) => {
  const language = req.params.language||"hk";
  const blogId = req.params.blogId;
  // const getBlogViewById=await ejs.renderFile(path.join(__dirname, 'views',  `blogs/${blogId}.ejs`), {blogId:blogId});
  res.render('pages/blog-details', {
    pageText: pageText[language],
    language: language,
    blogId: blogId
    // blogView: getBlogViewById

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



  


app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
