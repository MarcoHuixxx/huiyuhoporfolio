const express = require("express");
const app = express();
const port = 1343;
const path = require("path");
const axios = require("axios");
const crypto = require("crypto");
const { pageText } = require("./src/constants/pageText.js");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
require("dotenv").config();
var geoip = require("geoip-lite");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);
// InfoBip configuration (used instead of Twilio)
// Updated to use the new account/hostname/token and sender per provided snippet
const INFOBIP_AUTH =
  process.env.INFOBIP_AUTH ;
const INFOBIP_URL =
  process.env.INFOBIP_URL ;
// Optional: set a sender name/number via env `INFOBIP_SENDER`
const INFOBIP_SENDER = process.env.INFOBIP_SENDER || "ICMA";
const HSTONG_SANDBOX_URL =
  process.env.HSTONG_SANDBOX_URL || "http://mp-open.hstong.com";
const HSTONG_APP_ID = process.env.HSTONG_APP_ID || "50000";
const HSTONG_APP_SECRET =
  process.env.HSTONG_APP_SECRET;
const OTP_IP_LIMIT_WINDOW_MS = 30 * 60 * 1000;
const OTP_IP_LIMIT_MAX_ATTEMPTS = 5;

// Initialise the client SDK once (ESM via dynamic import).
// Node 16 has no built-in fetch, so we patch the client's post() to use axios.
const hsClientPromise =
  import("./React/src/nodejs-client/HsOpenApiClient.js").then(
    ({ HsOpenApiClient }) => {
      const client = new HsOpenApiClient({
        baseUrl: HSTONG_SANDBOX_URL,
        clientKey: HSTONG_APP_ID,
        appSecret: HSTONG_APP_SECRET,
      });

      // Patch post() to use axios (fetch not available in Node 16)
      client.post = async function (uri, params) {
        const fullParams = this.buildParams(params);
        const url = `${this.baseUrl}${uri}`;
        console.log(`\n========== HS Request ==========`);
        console.log(`URL: ${url}`);
        console.log(`Params:`, JSON.stringify(fullParams, null, 2));
        console.log(`================================\n`);
        const response = await axios.post(
          url,
          new URLSearchParams(fullParams).toString(),
          {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            timeout: this.timeout,
          },
        );
        console.log(`\n========== HS Response =========`);
        console.log(`Status: ${response.status}`);
        console.log(`Body:`, JSON.stringify(response.data));
        console.log(`================================\n`);
        return response.data;
      };

      return client;
    },
  );
const bodyParser = require("body-parser");
const fs = require("fs");
const { https } = require("follow-redirects");
const cors = require("cors");
app.set("trust proxy", true);
const corsOptions = {
  origin: [
    "http://icmahk.org",
    "https://icmahk.org",
    "http://www.icmahk.org",
    "https://www.icmahk.org",
    "http://localhost:5173",
    "https://localhost:5173",
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders: ["Content-Type", "Authorization"],
};

// app.use(cors(corsOptions));
app.use(cors());
const { CronJob } = require("cron");
// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
const mongodb = require("mongodb");

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html')
// })
mongoose.connect(process.env.MONGODB_URI, {});

const job = new CronJob(
  "*/59 * * * *", // cronTime
  async function () {
    const date = new Date();
    const voteRecords = await getVoteRecords(
      "664b20f7cbd11e4bca2386c8",
      1,
      10000,
      { votedAt: -1 },
    );
    const voteRedcordFileName = `./public/voteRecordBackup/voteRecords_${date.getFullYear()}_${date.getMonth()}_${date.getDate()}_${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}.json`;
    fs.writeFileSync(voteRedcordFileName, JSON.stringify(voteRecords));

    const participants = await getParticipants(
      "664b20f7cbd11e4bca2386c8",
      1,
      10000,
      { "event.round.participationNo": 1 },
      false,
    );
    //save participants to a file using fs

    const fileName = `./public/backup/participants_${date.getFullYear()}_${date.getMonth()}_${date.getDate()}_${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}.json`;
    fs.writeFileSync(fileName, JSON.stringify(participants));
  }, // onTick
  null, // onComplete
  process.env.BACKUP_CRON === "true", // start
  "America/Los_Angeles", // timeZone
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
  ],
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
      ],
    },
  ],
  status: String,
});

const optVerifySchema = new mongoose.Schema({
  phone: String,
  otp: String,
  senderIp: String,
  status: String,
  time: Date,
  twilioSendCount: {
    type: Number,
    default: 0,
  },
  infobipSendCount: {
    type: Number,
    default: 0,
  },
  provider: String,
});

const otpIpThrottleSchema = new mongoose.Schema({
  ip: {
    type: String,
    unique: true,
  },
  attemptCount: {
    type: Number,
    default: 0,
  },
  firstAttemptAt: Date,
  lastAttemptAt: Date,
  blockedUntil: Date,
});

const voteRecord = mongoose.model("voteRecord", voteRecordSchema);
const event = mongoose.model("event", eventSchema);
const participant = mongoose.model("participant", participantSchema);
const errorLog = mongoose.model("errorLog", errorLogSchema);
const optVerify = mongoose.model("optVerify", optVerifySchema);
const otpIpThrottle = mongoose.model("otpIpThrottle", otpIpThrottleSchema);

// const participantCount = await participant.countDocuments();

// set the view engine to ejs
app.use(expressLayouts);
app.set("layout", "./layouts/layout");
app.set("view engine", "ejs");

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

  const isAllow = [
    "icmahk.org",
    "https://icmahk.org",
    "https://icmahk.org/",
    "https://www.icmahk.org",
    "https://www.icmahk.org/",
  ];
  if (process.env.NODE_ENV === "development") {
    isAllow.push("http://localhost:5173");
    isAllow.push("http://localhost:5173/");
    isAllow.push("https://localhost:5173");
    isAllow.push("https://localhost:5173/");
    isAllow.push("Postman-Token");
  }
  return isAllow.some((domain) => {
    return req.rawHeaders.includes(domain);
  });
};

const buildOtpMessagePayload = (phone, otp) => {
  // InfoBip expects numbers without a leading '+' — normalize the phone
  const to = phone && phone.startsWith("+") ? phone.slice(1) : phone;
  return {
    messages: [
      {
        destinations: [{ to }],
        sender: INFOBIP_SENDER,
        content: {
          text: `ICMA2026 Verification Code: ${otp}`,
        },
      },
    ],
  };
};

const getSenderIp = (req) => {
  const forwardedFor = req.headers["x-forwarded-for"];
  const forwardedIp = Array.isArray(forwardedFor)
    ? forwardedFor[0]
    : forwardedFor?.split(",")[0]?.trim();

  return (forwardedIp || req.ip || req.socket?.remoteAddress || "").replace(
    "::ffff:",
    "",
  );
};

const registerOtpAttemptByIp = async (ip) => {
  const now = new Date();
  const windowStart = new Date(now.getTime() - OTP_IP_LIMIT_WINDOW_MS);
  let ipThrottleRecord = await otpIpThrottle.findOne({ ip });

  if (!ipThrottleRecord) {
    await otpIpThrottle.create({
      ip,
      attemptCount: 1,
      firstAttemptAt: now,
      lastAttemptAt: now,
    });

    return { blocked: false, attemptCount: 1 };
  }

  if (ipThrottleRecord.blockedUntil && ipThrottleRecord.blockedUntil > now) {
    return {
      blocked: true,
      blockedUntil: ipThrottleRecord.blockedUntil,
      attemptCount: ipThrottleRecord.attemptCount,
    };
  }

  const shouldResetWindow =
    !ipThrottleRecord.firstAttemptAt ||
    ipThrottleRecord.firstAttemptAt < windowStart ||
    (ipThrottleRecord.blockedUntil && ipThrottleRecord.blockedUntil <= now);

  if (shouldResetWindow) {
    ipThrottleRecord.attemptCount = 1;
    ipThrottleRecord.firstAttemptAt = now;
    ipThrottleRecord.lastAttemptAt = now;
    ipThrottleRecord.blockedUntil = undefined;
    await ipThrottleRecord.save();

    return { blocked: false, attemptCount: 1 };
  }

  ipThrottleRecord.attemptCount += 1;
  ipThrottleRecord.lastAttemptAt = now;

  if (ipThrottleRecord.attemptCount > OTP_IP_LIMIT_MAX_ATTEMPTS) {
    ipThrottleRecord.blockedUntil = new Date(
      now.getTime() + OTP_IP_LIMIT_WINDOW_MS,
    );
    await ipThrottleRecord.save();

    return {
      blocked: true,
      blockedUntil: ipThrottleRecord.blockedUntil,
      attemptCount: ipThrottleRecord.attemptCount,
    };
  }

  ipThrottleRecord.blockedUntil = undefined;
  await ipThrottleRecord.save();

  return { blocked: false, attemptCount: ipThrottleRecord.attemptCount };
};

const upsertOptVerifyRecord = async ({
  phone,
  otp,
  senderIp,
  twilioSendCount,
  infobipSendCount,
  provider,
}) => {
  return optVerify.findOneAndUpdate(
    { phone },
    {
      phone,
      otp,
      senderIp,
      provider,
      status: "pending",
      time: new Date(),
      twilioSendCount,
      infobipSendCount,
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    },
  );
};

const sendOtpViaInfoBip = async (phone, otp) => {
  const messagePayload = buildOtpMessagePayload(phone, otp);

  // send via InfoBip HTTP API using follow-redirects `https`
  const postData = JSON.stringify(messagePayload);
  const urlObj = new URL(INFOBIP_URL);
  const httpsOptions = {
    method: "POST",
    hostname: urlObj.hostname,
    path: urlObj.pathname + (urlObj.search || ""),
    headers: {
      Authorization: INFOBIP_AUTH,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    maxRedirects: 20,
  };

  const result = await new Promise((resolve, reject) => {
    const reqInfobip = https.request(httpsOptions, (resp) => {
      const chunks = [];
      resp.on("data", (chunk) => chunks.push(chunk));
      resp.on("end", () => {
        const body = Buffer.concat(chunks).toString();
        let parsed;
        try {
          parsed = JSON.parse(body);
        } catch (e) {
          parsed = body;
        }
        if (resp.statusCode >= 200 && resp.statusCode < 300) {
          resolve(parsed);
        } else {
          reject(
            new Error(
              `InfoBip error: ${resp.statusCode} ${JSON.stringify(parsed)}`,
            ),
          );
        }
      });
    });
    reqInfobip.on("error", (err) => reject(err));
    reqInfobip.write(postData);
    reqInfobip.end();
  });

  return { result, messagePayload };
};

app.get("/api/send-otp/:phone", async (req, res, next) => {
  const phone = req.params.phone;
  const senderIp = getSenderIp(req);
  const random6Digits = Math.floor(100000 + Math.random() * 900000);
  console.log("random6Digits:", random6Digits);
  console.log("sender ip:", senderIp);

  try {
    const isFromDomain = checkIsFromDomain(req, res);
    if (!isFromDomain) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid Request" });
    }

    // ── reCAPTCHA verification ──────────────────────────────────────────────
    const captchaToken = req.query.captchaToken;
    if (!captchaToken) {
      return res.status(400).send({ success: false, message: "reCAPTCHA token is required" });
    }
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
    if (!recaptchaSecret) {
      console.error("RECAPTCHA_SECRET_KEY is not set in environment variables");
      return res.status(500).send({ success: false, message: "Server reCAPTCHA config error" });
    }
    const captchaVerifyRes = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      { params: { secret: recaptchaSecret, response: captchaToken } }
    );
    if (!captchaVerifyRes.data?.success) {
      console.warn("reCAPTCHA verification failed:", captchaVerifyRes.data);
      return res.status(400).send({ success: false, message: "reCAPTCHA verification failed. Please try again." });
    }
    console.log("reCAPTCHA verification passed");
    // ───────────────────────────────────────────────────────────────────────

    const ipThrottleStatus = await registerOtpAttemptByIp(senderIp);
    if (ipThrottleStatus.blocked) {
      console.warn(
        `Blocked OTP request from IP ${senderIp}. Attempts: ${ipThrottleStatus.attemptCount}, Blocked Until: ${ipThrottleStatus.blockedUntil}`,
      );
      errorLog.create({
        error: `Blocked OTP request from IP ${senderIp}. Attempts: ${ipThrottleStatus.attemptCount}, Blocked Until: ${ipThrottleStatus.blockedUntil}`,
        time: new Date(),
      });
       return res.status(429).send({
         success: false,
         message: "Too many OTP requests from this IP. Try again in 30 minutes.",
         senderIp,
         blockedUntil: ipThrottleStatus.blockedUntil,
       });
    }

    //console.log("phone:", phone)
    //console.log("phone.length:", phone.length)
    //console.log("phone.startsWith(+852):", phone.startsWith("+852"))

    if (phone.length !== 14 || !phone.startsWith("+852")) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid Phone Number" });
    }

    const existingOptVerify = await optVerify.findOne({ phone });
    const twilioSendCount = existingOptVerify?.twilioSendCount || 0;
    const infobipSendCount = existingOptVerify?.infobipSendCount || 0;
    const shouldSkipTwilio = twilioSendCount >= 1;

    if (!shouldSkipTwilio) {
      await upsertOptVerifyRecord({
        phone,
        otp: random6Digits,
        senderIp,
        twilioSendCount: twilioSendCount + 1,
        provider: "twilio",
      });
      try {
        const twillioResult = await client.messages.create({
          body: "ICMA2026 Verification Code: " + random6Digits,
          from: "+12073092281",
          to: phone,
        });

        console.log("twillioResult:", twillioResult);

        if (twillioResult.errorMessage !== null) {
          throw new Error(`Twilio error: ${twillioResult.errorMessage}`);
        }

        console.log("sender phone:", phone);

        return res.send({ success: true, provider: "twilio" });
      } catch (error) {
        console.error("Error sending OTP with Twilio:", error);
        errorLog.create({
          error: error?.toString() || "Error sending OTP",
          time: new Date(),
        });
      }
    } else {
      console.log(
        `Phone ${phone} has reached Twilio send limit, switching to InfoBip for OTP delivery.`,
      );
    }

    const { result, messagePayload } = await sendOtpViaInfoBip(
      phone,
      random6Digits,
    );
    await upsertOptVerifyRecord({
      phone,
      otp: random6Digits,
      senderIp,
      twilioSendCount,
      infobipSendCount: infobipSendCount + 1,
      provider: "infobip",
    });

    console.log("sender phone:", phone);
    console.log("message payload:", JSON.stringify(messagePayload));
    console.log("auth id:", INFOBIP_AUTH);
    console.log("url:", INFOBIP_URL);
    console.log("result:", JSON.stringify(result));

    return res.send({ success: true, provider: "infobip" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    errorLog.create({
      error: error?.toString() || "Error sending OTP",
      time: new Date(),
    });
    return res
      .status(500)
      .send({ success: false, message: "Failed to send OTP" });
  }
});

app.post("/api/check-member-number", async (req, res) => {
  try {
    const isFromDomain = checkIsFromDomain(req, res);
    if (!isFromDomain) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid Request" });
    }

    const phone =
      req.body?.phone ||
      req.body?.mobile ||
      req.query?.phone ||
      req.query?.mobile;
    if (!phone) {
      return res
        .status(400)
        .send({ success: false, message: "Phone number is required" });
    }

    if (phone.length !== 14 || !phone.startsWith("+852")) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid Phone Number" });
    }

    //replace +852 with "" and trim the phone
    const formattedPhone = phone.replace("+852", "").replace(/\s/g, "");
    //why 9595 9502.trim() fdoes not work

    console.log("Checking member status via SDK for phoneXX:", formattedPhone);

    const hsClient = await hsClientPromise;
    const sdkResult = await hsClient.checkMobileExists(formattedPhone);
    console.log("sdkResult:", sdkResult);
    res.send({
      success: sdkResult.success === true,
      phone,
      code: sdkResult.raw?.code,
    });
  } catch (error) {
    errorLog.create({
      error: error?.stack || error?.toString() || "Member check failed",
      time: new Date(),
    });
    res.status(500).send({
      success: false,
      message: error?.message || "Member check failed",
    });
  }
});

app.get("/api/check-vote/:phone/:eventId", async (req, res) => {
  try {
    const isFromDomain = checkIsFromDomain(req, res);
    if (!isFromDomain) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid Request" });
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
      voterPhone: voterPhone,
      votedAt: { $gte: dayStart, $lt: dayEnd },
      eventId: eventId,
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
});

app.get("/api/check-wewa-club-id-used/:wewaId/:eventId", async (req, res) => {
  try {
    const isFromDomain = checkIsFromDomain(req, res);
    if (!isFromDomain) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid Request" });
    }
    const voterWewaId = req.params.wewaId;
    const eventId = req.params.eventId;

    console.log("voterWewaId:", voterWewaId);
    console.log("voterWewaId.trim().length:", voterWewaId.trim().length);
    if (voterWewaId === "ILOVEWEWACLUB") {
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
      userWWCCode: voterWewaId,
      votedAt: { $gte: dayStart, $lt: dayEnd },
      eventId: eventId,
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
});

app.get("/api/check-phone-verified/:phone/:eventId", async (req, res) => {
  try {
    const isFromDomain = checkIsFromDomain(req, res);
    if (!isFromDomain) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid Request" });
    }
    const phone = req.params.phone;
    const eventId = req.params.eventId;
    if (!phone || !eventId) {
      return res.status(400).send({ isPhoneVerified: false });
    }

    const voteRecords = await optVerify.findOne({
      phone: phone,
      status: "verified",
    });

    if (voteRecords) {
      res.send({ isPhoneVerified: true });
      return;
    }
    res.send({ isPhoneVerified: false });
  } catch (e) {
    errorLog.create({ error: error, time: new Date() });
    //console.log(e)
    res.send({ isPhoneVerified: false, error: e });
  }
});

app.post("/api/vote", async (req, res) => {
  try {
    const isFromDomain = checkIsFromDomain(req, res);
    if (!isFromDomain) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid Request" });
    }
    console.log("body:", req.body);

    const needOptVerifyEventIds = ["664b20f7cbd11e4bca2386c8"];
    const needUpDateParticipantEventIds = [
      "664b20f7cbd11e4bca2386c8",
      "668deded51930e822903d37c",
    ];

    const {
      participantId,
      roundNumber,
      eventId,
      voterPhone,
      voteCount,
      wewaClubId,
    } = req.body;
    if (
      !participantId ||
      !roundNumber ||
      !eventId ||
      !voterPhone ||
      !voteCount
    ) {
      return res
        .status(400)
        .send({ success: false, message: "Missing Parameters" });
    }

    if (needOptVerifyEventIds.includes(eventId)) {
      const optVerifyRecord = await optVerify.findOne({
        phone: voterPhone,
        status: "verified",
      });

      if (!optVerifyRecord) {
        return res
          .status(400)
          .send({ success: false, message: "Phone not verified" });
      }
    } else {
      if (voterPhone.length !== 64) {
        console.log("not 64!!!");
        return res
          .status(400)
          .send({ success: false, message: "Phone not verified" });
      }
    }

    if (voteCount > 2) {
      return res
        .status(400)
        .send({ success: false, message: "Vote Count Invalid" });
    }

    console.log("voteCount:", voteCount);
    // If claiming 2 votes, verify the phone is actually a member via the SDK
    if (Number(voteCount) === 2) {
      console.log("Checking member status via SDK for phone:", voterPhone);
      const hsClient = await hsClientPromise;
      const trimmedPhone = voterPhone.replace("+852", "").replace(/\s/g, "");
      const memberCheck = await hsClient.checkMobileExists(trimmedPhone);
      if (!memberCheck.success) {
        return res.status(400).send({
          success: false,
          message: "Not a member, only 1 vote allowed",
        });
      }
    }

    //console.log({ participantId, roundNumber, eventId, voterPhone, voteCount, wewaClubId })
    //check if the event is still open
    const eventResult = await event.findOne({
      _id: new mongodb.ObjectId(eventId),
    });

    if (!eventResult) {
      //console.log("The round is not found")
      return res
        .status(400)
        .send({ success: false, message: "The round is not found" });
    }

    if (
      new Date(eventResult.timeBegin) > new Date() ||
      new Date(eventResult.timeEnd) < new Date()
    ) {
      //console.log("The round is not open")
      return res
        .status(400)
        .send({ success: false, message: "The round is not open" });
    }
    let updateParticipant;
    if (needUpDateParticipantEventIds.includes(eventId)) {
      updateParticipant = await participant.findOneAndUpdate(
        { _id: participantId },
        {
          $inc: { [`event.$[event].round.$[round].voteCount`]: voteCount },
        },
        {
          arrayFilters: [
            { "event.eventId": eventId },
            { "round.roundNumber": parseInt(roundNumber) },
          ],
          new: true,
        },
      );
    } else {
      updateParticipant = await participant.findOne({ _id: participantId });
    }

    const participantVoteCount = updateParticipant.event
      .find((event) => event.eventId.toString() === eventId)
      .round.find(
        (round) => round.roundNumber === parseInt(roundNumber),
      ).voteCount;

    console.log("updateParticipant:", updateParticipant);

    if (updateParticipant) {
      const newVoteRecord = new voteRecord({
        roundNumber: roundNumber,
        voteCount: voteCount,
        participantVoteBofore: needUpDateParticipantEventIds.includes(eventId)
          ? participantVoteCount - voteCount
          : 0,
        participantVoteAfter: needUpDateParticipantEventIds.includes(eventId)
          ? participantVoteCount
          : 0,
        voterPhone: voterPhone,
        votedAt: new Date(),
        eventId: eventId,
        userWWCCode: wewaClubId,
        participantId: participantId,
      });
      newVoteRecord.save();
      res.send({ success: true });
    } else {
      //console.log("The participant is not found")
      res.send({ success: false });
    }
  } catch (e) {
    console.log(e);
    errorLog.create({ error: e, time: new Date() });

    res.send({ success: false });
  }
});

app.get("/api/verify-otp/:phone/:otp", cors(corsOptions), async (req, res) => {
  try {
    const isFromDomain = checkIsFromDomain(req, res);
    if (!isFromDomain) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid Request" });
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
        time: new Date(),
      },
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
    console.error("Error verifying OTP:", error);
    errorLog.create({
      error: error || "Error verifying OTP",
      time: new Date(),
    });
    res.status(500).send({ success: false });
  }
});

app.get("/api/event/:event_id", async (req, res) => {
  try {
    const isFromDomain = checkIsFromDomain(req, res);
    if (!isFromDomain) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid Request" });
    }
    console.log("get event");
    let eventResult;
    const eventId = req.params.event_id.split(",");
    console.log("eventId:", eventId);
    if (eventId.length === 1) {
      eventResult = await event.findOne({
        _id: new mongodb.ObjectId(eventId[0]),
      });
    } else {
      eventResult = await event.find({
        _id: { $in: eventId.map((id) => new mongodb.ObjectId(id)) },
      });
    }
    if (Array.isArray(eventResult)) {
      //check if the event is still open
      eventResult = eventResult.map((event) => {
        if (
          new Date(event.timeBegin) > new Date() ||
          new Date(event.timeEnd) < new Date()
        ) {
          event.status = "closed";
        }
        return event;
      });
    }

    res.send(eventResult);
  } catch (e) {
    console.log(e);
  }
});

app.get(
  "/api/participant/:event_id/:round_number/:limit/:isAdmin",
  cors(corsOptions),
  async (req, res) => {
    try {
      console.log("get list");
      const isFromDomain = checkIsFromDomain(req, res);
      if (!isFromDomain) {
        return res
          .status(400)
          .send({ success: false, message: "Invalid Request" });
      }
      const eventId = req.params.event_id?.split(",");
      if (!eventId || eventId.length === 0) {
        return res
          .status(400)
          .send({ success: false, message: "Missing Parameters" });
      }
      const showVoteCountEvents = ["668deded51930e822903d37c"];
      const countVoteByRecordEvent = [
        "668decd851930e822903d375",
        "668decef51930e822903d376",
        "668decf551930e822903d377",
        "668decfd51930e822903d378",
        "668ded0351930e822903d379",
        "668ded0e51930e822903d37a",
        "668deda751930e822903d37b",
      ];
      const limit = req.params.limit;
      const roundNumber = req.params.round_number;
      const isAdmin =
        req.params.isAdmin === "true" && req.query.pw === process.env.ADMIN_PW;
      if (!eventId[0] || !limit || !roundNumber) {
        return res
          .status(400)
          .send({ success: false, message: "Missing Parameters" });
      }

      let participants;

      if (eventId.length === 1) {
        participants = await getParticipants(
          eventId[0],
          roundNumber,
          limit,
          !showVoteCountEvents.includes(eventId[0])
            ? { "event.round.participationNo": 1 }
            : { "event.round.voteCount": -1 },
          true,
        );
        let firstThree = await getParticipants(
          eventId[0],
          roundNumber,
          3,
          { "event.round.voteCount": -1 },
          true,
        );

        const firstVoteCount = firstThree[0]?.votes || 1;
        const secondVoteCountPercent =
          firstThree[1]?.votes / firstVoteCount || 1;
        const thirdVoteCountPercent =
          firstThree[2]?.votes / firstVoteCount || 1;
        const firstThreeRaningPercent = [
          1,
          secondVoteCountPercent,
          thirdVoteCountPercent,
        ];

        if (!isAdmin && !showVoteCountEvents.includes(eventId[0])) {
          participants = participants.map((participant) => {
            return {
              ...participant,
              votes: undefined,
            };
          });

          firstThree = firstThree.map((participant) => {
            return {
              ...participant,
              votes: undefined,
            };
          });
        } else if (isAdmin && countVoteByRecordEvent.includes(eventId[0])) {
          participants = await Promise.all(
            participants.map(async (participant) => {
              //get totole voteRecord for the participant for the event
              const totalVoteRecord = await voteRecord.find({
                participantId: participant.id,
                eventId: eventId[0],
              });
              return {
                ...participant,
                votes: totalVoteRecord.length,
              };
            }),
          );
        }

        return res.send({ participants, firstThreeRaningPercent, firstThree });
      }

      participants = await Promise.all(
        eventId.map(async (id) => {
          const participant = await getParticipants(
            id,
            roundNumber,
            limit,
            !showVoteCountEvents.includes(id)
              ? { "event.round.participationNo": 1 }
              : { "event.round.voteCount": -1 },
            true,
          );
          return participant;
        }),
      );

      if (isAdmin && countVoteByRecordEvent.includes(eventId[0])) {
        participants = await Promise.all(
          participants.map(async (participantGroup, index) => {
            const participant = await Promise.all(
              participantGroup.map(async (participant) => {
                const totalVoteRecord = await voteRecord.find({
                  participantId: participant.id,
                  eventId: eventId[index],
                });
                return {
                  ...participant,
                  votes: totalVoteRecord.length,
                };
              }),
            );
            return participant;
          }),
        );
      }

      console.log("participants:", participants);

      return res.send({ participants });
    } catch (e) {
      //console.log(e)
    }
  },
);
const getParticipants = async (
  eventId,
  roundNumber,
  limit,
  sortBy,
  needPhoto,
) => {
  const participants = await participant.aggregate([
    {
      $unwind: {
        path: "$event",
        includeArrayIndex: "string",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $match: {
        "event.eventId": new mongodb.ObjectId(eventId),
      },
    },
    {
      $unwind: {
        path: "$event.round",
        includeArrayIndex: "string",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $match: {
        "event.round.roundNumber": parseInt(roundNumber),
      },
    },
    {
      $sort: sortBy,
    },
    {
      $project: {
        id: "$_id",
        chineseName: "$fullname",
        name: "$name",
        participationNo: "$event.round.participationNo",
        studyingYear: "$studyingYear",
        university: "$institution",
        video: "$event.round.video",
        instagram: "$ig",
        // 'image': needPhoto ? '$event.round.image' : undefined,
        votes: "$event.round.voteCount",
      },
    },
    {
      $limit: parseInt(limit),
    },
  ]);
  return participants;
};

app.get(
  "/api/vote-record/:event_id/:round_number/:limit/",
  cors(corsOptions),
  async (req, res) => {
    try {
      if (req.query.pw !== process.env.ADMIN_PW) {
        return res
          .status(400)
          .send({ success: false, message: "Invalid Request" });
      }
      const isFromDomain = checkIsFromDomain(req, res);
      if (!isFromDomain) {
        return res
          .status(400)
          .send({ success: false, message: "Invalid Request" });
      }
      const eventId = req.params.event_id;
      const limit = req.params.limit;
      const roundNumber = req.params.round_number;
      const sortBy = {
        votedAt: -1,
      };
      if (!eventId || !limit || !roundNumber) {
        return res
          .status(400)
          .send({ success: false, message: "Missing Parameters" });
      }

      const voteRecords = await getVoteRecords(
        eventId,
        roundNumber,
        limit,
        sortBy,
      );
      res.send(voteRecords);
    } catch (e) {
      //console.log(e)
    }
  },
);

app.post("/api/admin/edit/:eventId/:roundNumber", async (req, res) => {
  try {
    if (req.query.pw !== process.env.ADMIN_PW) {
      return res
        .status(401)
        .send({ success: false, message: "Authorization Failed" });
    }
    const isFromDomain = checkIsFromDomain(req, res);
    if (!isFromDomain) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid Request" });
    }
    const { participantId, voteItem, voteCount } = req.body;
    const eventId = req.params.eventId;
    const roundNumber = req.params.roundNumber;
    if (!participantId || !voteItem || !voteCount || !eventId || !roundNumber) {
      return res
        .status(400)
        .send({ success: false, message: "Missing Parameters" });
    }

    const updateParticipant = await participant.findOneAndUpdate(
      { _id: participantId },
      {
        $inc: { [`event.$[event].round.$[round].voteCount`]: voteCount },
      },
      {
        arrayFilters: [
          { "event.eventId": new mongodb.ObjectId(eventId) },
          { "round.roundNumber": parseInt(roundNumber) },
        ],
        new: true,
      },
    );

    //insert vote record
    if (updateParticipant) {
      const newVoteRecord = new voteRecord({
        roundNumber: roundNumber,
        voteCount: voteCount,
        participantVoteBofore:
          updateParticipant.event[0].round[0].voteCount - voteCount,
        participantVoteAfter: updateParticipant.event[0].round[0].voteCount,
        voterPhone: voteItem,
        votedAt: new Date(),
        eventId: eventId,
        participantId: participantId,
      });
      newVoteRecord.save();
      res.send({ success: true });
    } else {
      res.send({ success: false });
    }
  } catch (e) {
    errorLog.create({ error: e, time: new Date() });
  }
});

app.post("/api/admin/voteChannel", async (req, res) => {
  try {
    const isFromDomain = checkIsFromDomain(req, res);
    if (!isFromDomain) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid Request" });
    }
    const { eventId, pw, action, roundNumber } = req.body;

    if (!eventId || !pw || !action) {
      return res
        .status(400)
        .send({ success: false, message: "Missing Parameters" });
    }

    if (pw !== process.env.ADMIN_PW) {
      return res
        .status(401)
        .send({ success: false, message: "Authorization Failed" });
    }

    const eventToUpdate = await event.findOneAndUpdate(
      { _id: new mongodb.ObjectId(eventId) },
      {
        $set: {
          timeBegin:
            action === "open"
              ? new Date()
              : new Date().setDate(new Date().getDate() + 30),
          timeEnd:
            action === "open"
              ? new Date().setDate(new Date().getDate() + 30)
              : new Date().setDate(new Date().getDate() - 30),
        },
      },
    );

    if (eventToUpdate) {
      res.send({ success: true });
    } else {
      res.send({ success: false });
    }
  } catch (e) {
    errorLog.create({ error: e, time: new Date() });
  }
});

app.post("/api/admin/edit/event-participant", async (req, res) => {
  try {
    const isFromDomain = checkIsFromDomain(req, res);
    if (!isFromDomain) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid Request" });
    }
    const { eventId, pw, participantIds, roundNumber } = req.body;

    if (!eventId || !pw || !participantIds) {
      return res
        .status(400)
        .send({ success: false, message: "Missing Parameters" });
    }

    if (pw !== process.env.ADMIN_PW) {
      return res
        .status(401)
        .send({ success: false, message: "Authorization Failed" });
    }

    //get participants with this event id and delete the records
    const participants = await participant.find({ "event.eventId": eventId });

    await Promise.all(
      participants.map(async (participant) => {
        await participant.updateOne({ $pull: { event: { eventId: eventId } } });
      }),
    );

    //insert event id to the selected participants
    const result = await Promise.all(
      participantIds.map(async (participantId) => {
        await participant.findOneAndUpdate(
          { _id: participantId },
          {
            $push: {
              event: {
                eventId: eventId,
                round: [
                  {
                    roundNumber: roundNumber || 1,
                    participationNo: 0,
                    video: "",
                    voteCount: 0,
                    position: 0,
                    image: "",
                  },
                ],
              },
            },
          },
        );
      }),
    );

    if (result) {
      return res.send({ success: true });
    } else {
      return res.send({ success: false });
    }
  } catch (e) {
    errorLog.create({ error: e, time: new Date() });
  }
});

const getVoteRecords = async (eventId, roundNumber, limit, sortBy) => {
  const voteRecords = await voteRecord.aggregate([
    {
      $match: {
        roundNumber: parseInt(roundNumber),
      },
    },
    {
      $lookup: {
        from: "participants",
        localField: "participantId",
        foreignField: "_id",
        as: "participant",
      },
    },
    {
      $unwind: {
        path: "$participant",
        includeArrayIndex: "string",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $unwind: {
        path: "$participant.event",
        includeArrayIndex: "string",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $unwind: {
        path: "$participant.event.round",
        includeArrayIndex: "string",
        preserveNullAndEmptyArrays: false,
      },
    },
    {
      $match: {
        "participant.event.round.roundNumber": parseInt(roundNumber),
        "participant.event.eventId": new mongodb.ObjectId(eventId),
      },
    },
    {
      $project: {
        id: "$_id",
        voterPhone: "$voterPhone",
        voteCount: "$voteCount",
        votedAt: "$votedAt",
        userWWCCode: "$userWWCCode",
        participantName: "$participant.fullname",
        participantId: "$participant._id",
        participantParticipationNo: "$participant.event.round.participationNo",
        participantVoteBofore: "$participantVoteBofore",
        participantVoteAfter: "$participantVoteAfter",
      },
    },
    {
      $sort: sortBy,
    },
    {
      $limit: parseInt(limit),
    },
  ]);
  return voteRecords;
};

app.use(express.static("public"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
  console.log(`Example app is running on ${process.env.NODE_ENV} mode`);
});

