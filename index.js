require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

app.use(express.json());
app.use(express.urlencoded({extended:true}));
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
function isValidUrl(url){
  try{
    new URL(url);
    return true;
  }
  catch{
    return false;
  }
}
app.post('/api/shorturl', (req,res) =>{
  const originalUrl = req.body.url?.trim();
  if(!originalUrl){
    return res.json({error: "invalid url"});
  }
  if(!isNaN(originalUrl)){
    let index = Number(originalUrl);
    if(index < 1 || index > urlStorage.length){
      return res.json({error:"invalid url"});
    }
    return res.json({original_url: urlStorage[originalUrl - 1],short_url:originalUrl})
  }
  if(!isValidUrl(originalUrl)){
    return res.json({error:"invalid url"});
  }
  let index = urlStorage.indexOf(originalUrl);
  if(index === -1){
    urlStorage.push(originalUrl);
    return res.json({original_url: originalUrl, short_url:urlStorage.length});
  }
  res.json({original_url:originalUrl, short_url:index + 1});
})
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
