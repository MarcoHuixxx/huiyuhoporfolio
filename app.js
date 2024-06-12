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
const cors = require("cors")
const corsOptions = {
  origin: [
    'http://icmahk.org',
    'https://icmahk.org',
    'http://www.icmahk.org',
    'https://www.icmahk.org',
    'http://localhost:5173',
    'https://localhost:5173',

  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization'],
};




app.use(cors(corsOptions));
const { CronJob } = require('cron');
// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
const mongodb = require('mongodb');


// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html')
// })
mongoose.connect(
  process.env.MONGODB_URI,
  {

  }
);

const job = new CronJob(
  '*/30 * * * *', // cronTime
  async function () {
    const date = new Date();
    const voteRecords = await getVoteRecords("664b20f7cbd11e4bca2386c8", 1, 10000, { 'votedAt': -1 });
    const voteRedcordFileName = `./public/voteRecordBackup/voteRecords_${date.getFullYear()}_${date.getMonth()}_${date.getDate()}_${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}.json`;
    fs.writeFileSync
      (voteRedcordFileName, JSON.stringify(voteRecords));


    const participants = await getParticipants("664b20f7cbd11e4bca2386c8", 1, 10000, { 'event.round.participationNo': 1 }, false);
    //save participants to a file using fs

    const fileName = `./public/backup/participants_${date.getFullYear()}_${date.getMonth()}_${date.getDate()}_${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}.json`;
    fs.writeFileSync
      (fileName, JSON.stringify(participants));
  }, // onTick
  null, // onComplete
  process.env.BACKUP_CRON === 'true', // start
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
  participantVoteBofore: Number,
  participantVoteAfter: Number,
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

const optVerifySchema = new mongoose.Schema({
  phone: String,
  otp: String,
  status: String,
  time: Date,
});

const voteRecord = mongoose.model("voteRecord", voteRecordSchema);
const event = mongoose.model("event", eventSchema);
const participant = mongoose.model("participant", participantSchema);
const errorLog = mongoose.model("errorLog", errorLogSchema);
const optVerify = mongoose.model("optVerify", optVerifySchema);


// const participantCount = await participant.countDocuments();


// set the view engine to ejs
app.use(expressLayouts)
app.set('layout', './layouts/layout')
app.set('view engine', 'ejs');



//return not found page
// app.use((req, res, next) => {
//   //console.log('404')
//   const language = req.params.language || "hk";
//   //console.log(" pageText[language]:", pageText[language])
//   res.render('pages/404', {
//     pageText: pageText[language],
//     language: language
//   }
//   )
// })



// app.get('/send-otp/:phone', async (req, res) => {
//   try {
//     //console.log("hihihihihihihi")
//     const phone = req.params.phone;
//     //console.log("phone:", phone)
//     client.verify.v2.services(process.env.TWILIO_SERVICE_SID)
//       .verifications
//       .create({ to: phone, channel: 'sms' })
//       .then(verification => //console.log(verification));
//     res.send('otp sent')
//   } catch (e) {
//     //console.log(e)
//   }
// })

const checkIsFromDomain = (req, res) => {
  //console.log("req.rawHeaders:", req.rawHeaders)
  const isAllow = ["https://icmahk.org", "https://icmahk.org/", "https://www.icmahk.org", "https://www.icmahk.org/"]
  if (process.env.NODE_ENV === "development") {
    isAllow.push("http://localhost:5173")
    isAllow.push("http://localhost:5173/")
    isAllow.push("https://localhost:5173")
    isAllow.push("https://localhost:5173/")
    isAllow.push("Postman-Token")
  }
  return isAllow.some((domain) => {
    return req.rawHeaders.includes(domain)
  }
  );
}


app.get('/send-otp/:phone', async (req, res, next) => {
  try {
    const isFromDomain = checkIsFromDomain(req, res);
    if (!isFromDomain) {
      return res.status(400).send({ success: false, message: 'Invalid Request' });
    }
    const phone = req.params.phone;
    //console.log("phone:", phone)
    //console.log("phone.length:", phone.length)
    //console.log("phone.startsWith(+852):", phone.startsWith("+852"))

    if (phone.length !== 14 || !phone.startsWith("+852")) {
      return res.status(400).send({ success: false, message: 'Invalid Phone Number' });
    }

    // const result = await client.verify.v2.services(process.env.TWILIO_SERVICE_SID)
    //   .verifications
    //   .create({
    //     to: phone, channel: 'sms', codeLength: 4,
    //     // customFriendlyName: "ICMA Verification"
    //   });
    const random6Digits = Math.floor(100000 + Math.random() * 900000);
    console.log("random6Digits:", random6Digits)

    const result = await client.messages
      .create({
        body: 'ICMA2024 Verification Code: ' + random6Digits,
        from: '+12073092281',
        to: phone
      });

    //find if the phone is already in the database, if yes, update the otp, if not, create a new record

    const optVerifyRecord = await optVerify.findOneAndUpdate(
      {
        phone
      },
      {
        phone: phone,
        otp: random6Digits,
        status: "pending",
        time: new Date()
      }
    );

    if (!optVerifyRecord) {
      const newOptVerify = new optVerify({
        phone: phone,
        otp: random6Digits,
        status: "pending",
        time: new Date()
      });
      newOptVerify.save();
    }

    console.log("result:", result)



    res.send({ success: true });
  } catch (error) {
    errorLog.create({ error: error || "Error sending OTP", time: new Date() });
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

    if (dayStart.getHours() < 16) {
      dayStart.setDate(dayStart.getDate() - 1);
      dayStart.setHours(16, 0, 0, 0);
    } else {
      dayStart.setHours(16, 0, 0, 0);
    }

    let dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);




    const voteRecords = await voteRecord.find({
      voterPhone: voterPhone, votedAt: { $gte: dayStart, $lt: dayEnd },
      eventId: eventId
    });
    // //console.log("voteRecords:", voteRecords)
    if (voteRecords.length > 0) {
      res.send({ isVoted: true });
      return;
    }
    res.send({ isVoted: false });
  } catch (e) {
    errorLog.create({ error: error, time: new Date() });
    //console.log(e)
    res.send({ isVoted: true, error: e });
  }
})

app.get("/check-wewa-club-id-used/:wewaId/:eventId", async (req, res) => {
  try {
    const isFromDomain = checkIsFromDomain(req, res);
    if (!isFromDomain) {
      return res.status(400).send({ success: false, message: 'Invalid Request' });
    }
    const voterWewaId = req.params.wewaId;
    const eventId = req.params.eventId;

    console.log("voterWewaId:", voterWewaId)
    console.log("voterWewaId.trim().length:", voterWewaId.trim().length)
    if (voterWewaId === 'ILOVEWEWACLUB') {
      return res.send({ isWewaClubIdUsed: false });
    }

    if (!voterWewaId || !eventId) {
      return res.status(400).send({ isVoted: false });
    }

    var dayStart = new Date();

    if (dayStart.getHours() < 16) {
      dayStart.setDate(dayStart.getDate() - 1);
      dayStart.setHours(16, 0, 0, 0);
    } else {
      dayStart.setHours(16, 0, 0, 0);
    }

    let dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);


    const voteRecords = await voteRecord.find({
      userWWCCode: voterWewaId, votedAt: { $gte: dayStart, $lt: dayEnd },
      eventId: eventId
    });
    // //console.log("voteRecords:", voteRecords)
    if (voteRecords.length > 0) {
      res.send({ isWewaClubIdUsed: true });
      return;
    }
    res.send({ isWewaClubIdUsed: false });
  } catch (e) {
    errorLog.create({ error: error, time: new Date() });
    //console.log(e)
    res.send({ isWewaClubIdUsed: true, error: e });
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
    //console.log(e)
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

    //console.log({ participantId, roundNumber, eventId, voterPhone, voteCount, wewaClubId })
    //check if the event is still open
    const eventResult = await event.findOne({ _id: new mongodb.ObjectId(eventId) });

    if (!eventResult) {
      //console.log("The round is not found")
      return res.status(400).send({ success: false, message: 'The round is not found' });
    }

    if (new Date(eventResult.timeBegin) > new Date() || new Date(eventResult.timeEnd) < new Date()) {
      //console.log("The round is not open")
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

    //console.log("updateParticipant:", updateParticipant)

    if (updateParticipant) {
      const newVoteRecord = new voteRecord({
        roundNumber: roundNumber,
        voteCount: voteCount,
        participantVoteBofore: updateParticipant.event[0].round[0].voteCount - voteCount,
        participantVoteAfter: updateParticipant.event[0].round[0].voteCount,
        voterPhone: voterPhone,
        votedAt: new Date(),
        eventId: eventId,
        userWWCCode: wewaClubId,
        participantId: participantId
      });
      newVoteRecord.save();
      res.send({ success: true });
    } else {
      //console.log("The participant is not found")
      res.send({ success: false });
    }

  } catch (e) {
    errorLog.create({ error: error, time: new Date() });
    //console.log(e)
    res.send({ success: false });

  }
})

app.get('/verify-otp/:phone/:otp', cors(corsOptions), async (req, res) => {
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

    const result = await optVerify.findOneAndUpdate(
      { phone, otp, status: "pending" },
      {
        status: "verified",
        time: new Date()
      }
    );

    if (result) {
      res.send({ success: true });
    } else {
      res.send({ success: false });
    }

    // const result = await client.verify.v2.services(process.env.TWILIO_SERVICE_SID)
    //   .verificationChecks
    //   .create({ to: phone, code: otp });

    // if (result.status === 'approved') {
    //   res.send({ success: true });
    // } else {
    //   res.send({ success: false });
    // }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    errorLog.create({ error: error || "Error verifying OTP", time: new Date() });
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
    //console.log(e)
  }
})



app.get('/participant/:event_id/:round_number/:limit/:isAdmin', cors(corsOptions), async (req, res) => {
  try {
    console.log("get list")
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

    let participants = await getParticipants(eventId, roundNumber, limit, { 'event.round.participationNo': 1 }, true);
    let firstThree = await getParticipants(eventId, roundNumber, 3, { 'event.round.voteCount': -1 }, true);

    const firstVoteCount = firstThree[0]?.votes || 1;
    const secondVoteCountPercent = firstThree[1]?.votes / firstVoteCount || 1;
    const thirdVoteCountPercent = firstThree[2]?.votes / firstVoteCount || 1;
    const firstThreeRaningPercent = [1, secondVoteCountPercent, thirdVoteCountPercent];

    if (!isAdmin) {
      participants = participants.map((participant) => {
        return {
          ...participant,
          votes: undefined
        }
      }
      )

      firstThree = firstThree.map((participant) => {
        return {
          ...participant,
          votes: undefined
        }
      }
      )
    }


    res.send({ participants, firstThreeRaningPercent, firstThree });
  } catch (e) {
    //console.log(e)
  }
})

const getParticipants = async (eventId, roundNumber, limit, sortBy, needPhoto) => {
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
        '$sort': sortBy
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
          // 'image': needPhoto ? '$event.round.image' : undefined,
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

app.get('/vote-record/:event_id/:round_number/:limit/', cors(corsOptions), async (req, res) => {
  try {
    const isFromDomain = checkIsFromDomain(req, res);
    if (!isFromDomain) {
      return res.status(400).send({ success: false, message: 'Invalid Request' });
    }
    const eventId = req.params.event_id;
    const limit = req.params.limit;
    const roundNumber = req.params.round_number;
    const sortBy = {
      'votedAt': -1
    }
    if (!eventId || !limit || !roundNumber) {
      return res.status(400).send({ success: false, message: 'Missing Parameters' });
    }

    const voteRecords = await getVoteRecords(eventId, roundNumber, limit, sortBy);
    res.send(voteRecords);
  } catch (e) {
    //console.log(e)
  }
}
)

const getVoteRecords = async (eventId, roundNumber, limit, sortBy) => {
  const voteRecords = await voteRecord.aggregate(
    [
      {
        '$match': {
          'roundNumber': parseInt(roundNumber)
        }
      },
      {
        '$lookup': {
          'from': 'participants',
          'localField': 'participantId',
          'foreignField': '_id',
          'as': 'participant'
        }
      },
      {
        '$unwind': {
          'path': '$participant',
          'includeArrayIndex': 'string',
          'preserveNullAndEmptyArrays': false
        }
      },
      {
        '$unwind': {
          'path': '$participant.event',
          'includeArrayIndex': 'string',
          'preserveNullAndEmptyArrays': false
        }
      },
      {
        '$unwind': {
          'path': '$participant.event.round',
          'includeArrayIndex': 'string',
          'preserveNullAndEmptyArrays': false
        }
      },
      {
        '$match': {
          'participant.event.round.roundNumber': parseInt(roundNumber),
          'participant.event.eventId': new mongodb.ObjectId(eventId)
        }
      },
      {
        '$project': {
          'id': '$_id',
          'voterPhone': '$voterPhone',
          'voteCount': '$voteCount',
          'votedAt': '$votedAt',
          'userWWCCode': '$userWWCCode',
          'participantName': '$participant.fullname',
          'participantId': '$participant._id',
          'participantParticipationNo': '$participant.event.round.participationNo',
          'participantVoteBofore': '$participantVoteBofore',
          'participantVoteAfter': '$participantVoteAfter',
        }
      },
      {
        '$sort': sortBy
      },
      {
        '$limit': parseInt(limit)
      }
    ]
  );
  return voteRecords;
}



app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
  console.log(`Example app is running on ${process.env.NODE_ENV} mode`)
})
