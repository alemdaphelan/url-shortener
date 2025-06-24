require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});
let urlStorage = [];
const isValidUrl = urlString => {
  try {
    const url = new URL(urlString);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (e) {
    return false;
  }
};
app.post('/api/shorturl', (req,res) =>{
  const originalUrl = req.body.url;
  if(!originalUrl || !isValidUrl(originalUrl)){
    return res.json({error: "invalid url"});
  }
  let index = urlStorage.indexOf(originalUrl);
  if(index === -1){
    urlStorage.push(originalUrl);
    return res.status(201).json({original_url: originalUrl, short_url: urlStorage.length});
  }
  res.status(201).json({original_url: urlStorage[index], short_url: index + 1});
})
app.get('/api/shorturl/:id',(req,res) =>{
  let {id} = req.params;
  res.redirect(301,urlStorage[parseInt(id) - 1]);
})
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
