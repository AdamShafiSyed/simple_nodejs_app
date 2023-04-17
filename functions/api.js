const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const fs = require("fs");
const serverless = require("serverless-http");
const app = express();

// Create a router to handle routes
const router = express.Router();

app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use(cors());

let rawdata = fs.readFileSync('public/db.json');
let teamsList = JSON.parse(rawdata);


router.get('/', (req, res) => {
    fs.readFile("public/index.html", function (error, pgResp) {
        if (error) {
            res.writeHead(404);
            res.write('Contents you are looking are Not Found');
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(pgResp);
        }
         
        res.end();
    });
});

router.get('/api', (req, res) => {
    try {
        res.status(200).json(teamsList);
    } catch (error) {
        res.status(404).json({ message: error.message})
    }
});


// Export the app and the serverless function
app.use('/.netlify/functions/api', router);
module.exports.handler = serverless(app);

const PORT= process.env.PORT || 3000;
app.listen(PORT,()=> console.log(`Great our server is running on port ${PORT} `));