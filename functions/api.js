const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose');
const serverless = require('serverless-http')
require('dotenv').config()

const app = express();
const router = express.Router();

app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use(cors());

const teamSchema = mongoose.Schema({
  id: Number,
  rank: Number,
  team_name: String,
  matches: Number,
  wins: Number,
  losses: Number,
  points: Number,
  run_rate: String,
  recent_form: String,
  team_image: String
});

const TeamsList = mongoose.model('teams', teamSchema);

router.get('/', async(req, res) => {
  try {
    const allTeams = await TeamsList.find();
    res.status(200).json(allTeams[0]);
} catch (error) {
    res.status(404).json({ message: error.message})
}
});

const PORT= process.env.PORT || 3001;

mongoose.connect("mongodb+srv://shafiadam18:BCsDoUYhJIR1JCPK@cluster0.qzr2iuu.mongodb.net/cricket_league?retryWrites=true&w=majority", 
{useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
    .catch((error) => console.log(error.message));

mongoose.set('strictQuery', true);
app.use('/.netlify/functions/api', router);
module.exports.handler = serverless(app);