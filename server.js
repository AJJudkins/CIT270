import { createHash } from 'node:crypto';

const express = require('express');

const bodyParser = require('body-parser');

const Redis = require('redis');

const app = express();

const port = 3000;

const redisClient = Redis.createClient({url:'redis://127.0.0.1:6379'});

// This allows json (JavaScript object notation) requests.
app.use(bodyParser.json());

app.listen(port, ()=> {
    redisClient.connect();
    console.log("Listening on port: " + port)
});

app.get('/', (req, res) => {
    res.send("Welcome to my server.")
});

app.post('/login',async (req, res) => {
    const loginBody = req.body;
    const userName = loginBody.userName;
    const password = loginBody.password;
    const hashedPassword = createHash('sha3-256').update(password).digest('hex');
    const redisPassword = await redisClient.hGet('hashedpasswords',userName);
    console.log("Password for "+ userName +" "+ redisPassword);
    if (hashedPassword === redisPassword){
       res.send("Welcome " + userName); 
    } else {
        res.status(401); // This means you are unauthorized.
        res.send("Your password is incorrect.");
    }
});