const express = require('express')
const app = express()
const port = 1343
const path = require('path')
const { pageText } = require('./src/constants/pageText.js');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require("mongoose");
require("dotenv").config();
var geoip = require('geoip-lite');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const bodyParser = require('body-parser');
const fs = require('fs');
const { CronJob } = require('cron');
// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
const mongodb = require('mongodb');

const cors = require("cors")

app.use(cors());
// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html')
// })
mongoose.connect(
  process.env.MONGODB_URI,
  {

  }
);

const job = new CronJob(
  '*/5 * * * *', // cronTime
  async function () {
   const participants = await getParticipants("664b20f7cbd11e4bca2386c8", 1, 10000, false);
   //save participants to a file using fs
   const date= new Date();
    const fileName = `./public/backup/participants_${date.getFullYear()}_${date.getMonth()}_${date.getDate()}_${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}.json`;
    fs.writeFileSync
    (fileName, JSON.stringify(participants));
  }, // onTick
  null, // onComplete
  true, // start
  'America/Los_Angeles' // timeZone
);

const eventSchema = new mongoose.Schema({
  name: String,
  timeBegin: Date,
  timeEnd: Date,
  location: String,
  description: String,
  link: String,
  image: String,
  status: String,
  prize: [
    {
      name: String,
      description: String,
      image: String,
      value: Number,
    },
  ]
});

const voteRecordSchema = new mongoose.Schema({
  participantId: mongoose.Schema.Types.ObjectId,
  eventId: mongoose.Schema.Types.ObjectId,
  roundNumber: Number,
  voteCount: Number,
  voterPhone: String,
  userWWCCode: String,
  votedAt: Date,
});

const errorLogSchema = new mongoose.Schema({
  error: String,
  time: Date,
});



const participantSchema = new mongoose.Schema({
  name: String,
  fullname: String,
  email: String,
  ig: String,
  phone: String,
  institution: String,
  position: String,
  studyingYear: String,

  event: [
    {
      eventId: mongoose.Schema.Types.ObjectId,
      round: [
        {
          participationNo: Number,
          video: String,
          roundNumber: Number,
          voteCount: Number,
          position: Number,
          image: String,
        },
      ]
    },
  ],
  status: String,
});

const voteRecord = mongoose.model("voteRecord", voteRecordSchema);
const event = mongoose.model("event", eventSchema);
const participant = mongoose.model("participant", participantSchema);
const errorLog = mongoose.model("errorLog", errorLogSchema);


// const participantCount = await participant.countDocuments();


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



// app.get('/send-otp/:phone', async (req, res) => {
//   try {
//     console.log("hihihihihihihi")
//     const phone = req.params.phone;
//     console.log("phone:", phone)
//     client.verify.v2.services(process.env.TWILIO_SERVICE_SID)
//       .verifications
//       .create({ to: phone, channel: 'sms' })
//       .then(verification => console.log(verification));
//     res.send('otp sent')
//   } catch (e) {
//     console.log(e)
//   }
// })

const checkIsFromDomain = (req, res) => {
  return (req.rawHeaders.includes
    ("https://icmahk.org/")
  );
}


app.get('/send-otp/:phone', async (req, res, next) => {
  try {
    const isFromDomain = checkIsFromDomain(req, res);
    if (!isFromDomain) {
      return res.status(400).send({ success: false, message: 'Invalid Request' });
    }
    const phone = req.params.phone;
    console.log("phone:", phone)
    console.log("phone.length:", phone.length)
    console.log("phone.startsWith(+852):", phone.startsWith("+852"))

    if (phone.length !== 14 || !phone.startsWith("+852")) {
      return res.status(400).send({ success: false, message: 'Invalid Phone Number' });
    }

    const result = await client.verify.v2.services(process.env.TWILIO_SERVICE_SID)
      .verifications
      .create({
        to: phone, channel: 'sms', codeLength: 4,
        // customFriendlyName: "ICMA Verification"
      });

    res.send({ success: true });
  } catch (error) {
    errorLog.create({ error: error, time: new Date() });
    console.error('Error sending OTP:', error);
    res.status(500).send({ success: false });
  }
});

app.get("/check-vote/:phone/:eventId", async (req, res) => {
  try {
    const isFromDomain = checkIsFromDomain(req, res);
    if (!isFromDomain) {
      return res.status(400).send({ success: false, message: 'Invalid Request' });
    }
    const voterPhone = req.params.phone;
    const eventId = req.params.eventId;

    if (!voterPhone || !eventId) {
      return res.status(400).send({ isVoted: false });
    }

    var dayStart = new Date();
    console.log("dayStart1:", dayStart)
    dayStart.setDate(dayStart.getDate() + 1);
    dayStart.setHours(0, 0, 0, 0);
    dayStart.setHours(dayStart.getHours() - 8);
    let dayEnd = new Date();
    dayEnd.setDate(dayEnd.getDate() + 2);
    console.log("dayEnd1:", dayEnd)
    dayEnd.setHours(0, 0, 0, 0);
    dayEnd.setHours(dayEnd.getHours() - 8);
    console.log("dayStart:", dayStart)
    console.log("dayEnd:", dayEnd)
    const voteRecords = await voteRecord.find({
      voterPhone: voterPhone, votedAt: { $gte: dayStart, $lt: dayEnd },
      eventId: eventId
    });
    console.log("voteRecords:", voteRecords)
    if (voteRecords.length > 0) {
      res.send({ isVoted: true });
      return;
    }
    res.send({ isVoted: false });
  } catch (e) {
    errorLog.create({ error: error, time: new Date() });
    console.log(e)
    res.send({ isVoted: true, error: e });
  }
})

app.get("/check-phone-verified/:phone/:eventId", async (req, res) => {
  try {
    const isFromDomain = checkIsFromDomain(req, res);
    if (!isFromDomain) {
      return res.status(400).send({ success: false, message: 'Invalid Request' });
    }
    const phone = req.params.phone;
    const eventId = req.params.eventId;
    if (!phone || !eventId) {
      return res.status(400).send({ isPhoneVerified: false });
    }


    const voteRecords = await voteRecord.find({
      voterPhone: phone,
      eventId: eventId
    });
    if (voteRecords.length > 0) {
      res.send({ isPhoneVerified: true });
      return;
    }
    res.send({ isPhoneVerified: false });
  } catch (e) {
    errorLog.create({ error: error, time: new Date() });
    console.log(e)
    res.send({ isPhoneVerified: false, error: e });
  }
})




app.post('/vote', async (req, res) => {
  try {
    const isFromDomain = checkIsFromDomain(req, res);
    if (!isFromDomain) {
      return res.status(400).send({ success: false, message: 'Invalid Request' });
    }

    const { participantId, roundNumber, eventId, voterPhone, voteCount, wewaClubId } = req.body;
    if (!participantId || !roundNumber || !eventId || !voterPhone || !voteCount) {
      return res.status(400).send({ success: false, message: 'Missing Parameters' });
    }

    if (voteCount > 2) {
      return res.status(400).send({ success: false, message: 'Vote Count Invalid' });
    }

    console.log({ participantId, roundNumber, eventId, voterPhone, voteCount, wewaClubId })
    //check if the event is still open
    const eventResult = await event.findOne({ _id: new mongodb.ObjectId(eventId) });

    if (!eventResult) {
      console.log("The round is not found")
      return res.status(400).send({ success: false, message: 'The round is not found' });
    }

    if (new Date(eventResult.timeBegin) > new Date() || new Date(eventResult.timeEnd) < new Date()) {
      console.log("The round is not open")
      return res.status(400).send({ success: false, message: 'The round is not open' });
    }

    const updateParticipant = await participant.findOneAndUpdate(
      { _id: participantId, },
      {
        $inc: { [`event.$[event].round.$[round].voteCount`]: voteCount },
      },
      {
        arrayFilters: [{ 'event.eventId': new mongodb.ObjectId(eventId) }, { 'round.roundNumber': parseInt(roundNumber) }],
        new: true
      }
    );

    if (updateParticipant) {
      const newVoteRecord = new voteRecord({
        roundNumber: roundNumber,
        voteCount: voteCount,
        voterPhone: voterPhone,
        votedAt: new Date(),
        eventId: eventId,
        userWWCCode: wewaClubId,
        participantId: participantId
      });
      newVoteRecord.save();
      res.send({ success: true });
    } else {
      console.log("The participant is not found")
      res.send({ success: false });
    }

  } catch (e) {
    errorLog.create({ error: error, time: new Date() });
    console.log(e)
    res.send({ success: false });

  }
})

app.get('/verify-otp/:phone/:otp', async (req, res) => {
  try {
    const isFromDomain = checkIsFromDomain(req, res);
    if (!isFromDomain) {
      return res.status(400).send({ success: false, message: 'Invalid Request' });
    }
    const phone = req.params.phone;
    const otp = req.params.otp;
    if (!phone || !otp) {
      return res.status(400).send({ success: false });
    }

    const result = await client.verify.v2.services(process.env.TWILIO_SERVICE_SID)
      .verificationChecks
      .create({ to: phone, code: otp });

    if (result.status === 'approved') {
      res.send({ success: true });
    } else {
      res.send({ success: false });
    }
  } catch (e) {
    console.error('Error verifying OTP:', e);
    errorLog.create({ error: error, time: new Date() });
    res.status(500).send({ success: false });
  }
})

app.get('/event/:event_id', async (req, res) => {
  try {
    const isFromDomain = checkIsFromDomain(req, res);
    if (!isFromDomain) {
      return res.status(400).send({ success: false, message: 'Invalid Request' });
    }
    const eventId = req.params.event_id;
    const eventResult = await event.findOne({ _id: new mongodb.ObjectId(eventId) });
    res.send(eventResult);
  } catch (e) {
    console.log(e)
  }
})



app.get('/participant/:event_id/:round_number/:limit/:isAdmin', async (req, res) => {
  try {
    console.log("hihihihihihihi")
    const isFromDomain = checkIsFromDomain(req, res);
    if (!isFromDomain) {
      return res.status(400).send({ success: false, message: 'Invalid Request' });
    }
    const eventId = req.params.event_id;
    const limit = req.params.limit;
    const roundNumber = req.params.round_number;
    const isAdmin = req.params.isAdmin === 'true';
    if (!eventId || !limit || !roundNumber) {
      return res.status(400).send({ success: false, message: 'Missing Parameters' });
    }

    let participants = await getParticipants(eventId, roundNumber, limit, true);

    const firstVoteCount = participants[0].votes;
    const secondVoteCountPercent = participants[1].votes / firstVoteCount;
    const thirdVoteCountPercent = participants[2].votes / firstVoteCount;
    const firstThreeRaningPercent = [1, secondVoteCountPercent, thirdVoteCountPercent];

    if (!isAdmin) {
      participants = participants.map((participant) => {
        return {
          ...participant,
          votes: undefined
        }
      }
      )
    }


    res.send({ participants, firstThreeRaningPercent });
  } catch (e) {
    console.log(e)
  }
})

const getParticipants = async (eventId, roundNumber, limit, needPhoto) => {
  const participants = await participant.aggregate(
    [
      {
        '$unwind': {
          'path': '$event',
          'includeArrayIndex': 'string',
          'preserveNullAndEmptyArrays': false
        }
      },
      {
        '$match': {
          'event.eventId': new mongodb.ObjectId(eventId)
        }
      },
      {
        '$unwind': {
          'path': '$event.round',
          'includeArrayIndex': 'string',
          'preserveNullAndEmptyArrays': false
        }
      }, {
        '$match': {
          'event.round.roundNumber': parseInt(roundNumber)
        }
      },
      {
        '$sort': { 'event.round.voteCount': -1 }
      },
      {
        '$project': {
          'id': '$_id',
          'chineseName': '$fullname',
          'name': '$name',
          'participationNo': '$event.round.participationNo',
          'studyingYear': '$studyingYear',
          'university': '$institution',
          'video': '$event.round.video',
          'instagram': '$ig',
          'image': needPhoto ? '$event.round.image' : undefined,
          'votes': '$event.round.voteCount'
        }
      },
      {
        '$limit': parseInt(limit)
      }

    ]
  );
  return participants;
}



app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
