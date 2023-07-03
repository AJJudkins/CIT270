const { createHash } = require('node:crypto');

const express = require('express');

const bodyParser = require('body-parser');

const Redis = require('redis');

const app = express();

const port = 3000;

const https = require('https')
const fs = require('fs')

const redisClient = Redis.createClient({url:'redis://default:redis-stedi-austin:6379'});

// This allows json (JavaScript object notation) requests.
app.use(bodyParser.json());

app.listen(port, ()=> {
   redisClient.connect();
   console.log("Listening on port: " + port)
});

app.get('/', (req, res) => {
  res.send('Hello HTTPS!')
})

/* https.createServer({
  key: fs.readFileSync('/etc/letsencrypt/archive/austinjudkins.cit270.com/privkey1.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/archive/austinjudkins.cit270.com/cert1.pem'),
  ca: fs.readFileSync('/etc/letsencrypt/archive/austinjudkins.cit270.com/chain1.pem')
}, app).listen(port, () => {
  redisClient.connect();
  console.log('Listening...')
}) */

app.get('/', (req, res) => {
    res.send("Welcome to my server.")
});

app.post('/login',async (req, res) => {
    const loginBody = req.body;
    const userName = loginBody.userName;
    const password = loginBody.password;
    const hashedPassword = password == null ? null : createHash('sha3-256').update(password).digest('hex');
    const redisPassword = password == null ? null : await redisClient.hGet('hashedpasswords',userName);
    // console.log("Password for "+ userName +" "+ redisPassword);
    
    if (password != null && hashedPassword === redisPassword){
       res.send("Welcome " + userName); 
    } else {
        res.status(401); // This means you are unauthorized.
        res.send("Your password is incorrect.");
    }
});