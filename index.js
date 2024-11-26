require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser')

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended: false}))

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
const urlDatabase = new Map()
let counter = 1

app.post('/api/shorturl', (req, res) => {
  try {
    const { url } = req.body

    const pattern = /^(https?:\/\/)/i
    if (!url || !pattern.test(url)) {
      console.log("Chạy nè")
      return res.json({error: 'invalid url'})
    }
    
    const urlObj = new URL(url)
    const originURL = urlObj.href
    console.log(originURL)

    for (let [shortUrl, url] of urlDatabase.entries()) {
      if (url === originURL) {
        return res.json({ original_url: url, short_url: shortUrl })
      }
    }

    const shortUrl = counter++
    urlDatabase.set(shortUrl, originURL)
    res.json({ original_url: originURL, short_url: shortUrl })
  }
  catch (err) {
    console.log(err)
    res.json({error: 'invalid url'})
  }
})

app.get('/api/shorturl/:short_url', function(req, res) {
  const shortUrl = Number(req.params.short_url)

  if (urlDatabase.has(shortUrl)) {
    const origin = urlDatabase.get(shortUrl)
    res.redirect(origin)
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
