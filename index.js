require("dotenv").config(); // Load environment variables locally

const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

const app = express();
const PORT = process.env.PORT || 3000;

// Setup Firebase Admin
const serviceAccount = {
  type: "service_account",
  project_id: "catbell-c7768",
  private_key_id: "8380e7a72aff8eb9de1b29a9c811f9e21b1f6bb8",
  private_key: `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDDSxO6ucc/85w6
6a/M/9jl54CE6saZ4f+HMuUZACCHXbETkP4HYrHKS3+at7KvLGuoEgPwCD9g99iU
m83NDqN09vTGvebPq03pUouW2t83KAWlymF/sIbu/kYSjK0rS9wGV2zaFLaMt8iQ
MJcMMYQ1HFMlTaRDMavFArbsBAjyDrBhwKvap7WinRg3HcmHfmAGlzp3lG48F3yH
6BX8Kz6i/WbZglc8W8tdA+H511mPq8IFeMayoFJ/0ZTIm4dSJj6KE7nPHoXvD/Nm
RegqBLfkcZXfYgYomLhJtnzwRiReLNxYLn47qcvNQrHEpMi9jdAY75+grbVQVRWd
TN2WdaBhAgMBAAECggEABDyFsgruUpR98sfiThJ4FGIAPLc8awF8YeTDFCwXiI2K
FiroB9BRRlp66yf0Uq57q2AGAS1R9VA1vODgXFlmnFabGrtAiDK8Hu/xIpWe5VBo
nEnBRwbU9oGXkuFwWZHCCnUtDFIKCmVrjrfZyaRCrPBEsXjMs78ebciln9sP4p2l
5mYqq1E2unpCwlN9k3gUbGALnNM+ihxzieYzbOElGabDWxahRXlMB0uSdO65Zj1X
KzVNB/4RyBeYSj4UmOaGpmgGNOETAJzNMvDSfSS+ErsPPXwMwTfp+7aOpsmJUo4b
E8oXrk1uoJQuW64JUtAlvl07a8dg2rg4/kT9OTPZkQKBgQDvvxRqC1tLJHuywB/U
GC08oBt4nYFw0XdkZnIDozdRErxRH5bEzKegzb07KfBaOzxk+oUPYMHE1DLAD8iD
PkVcQlbE4YqX787CJmF6CdsqmADbuYD2rG5dpRadOGmDkw0ZxhwuSNY6PXvZav3R
Ntn8IAQKiHjUWdXGDou3cLxxvQKBgQDQiH2bRxD8C4wyCgEoV4yzb0hRwFmSZAZB
2AoXUKB/wdu0NwL59UYNhZBnslaUy3LFcd4f40m8Zkkb0arUPg2AkwGSvz/MUgCU
wT0wAe3KIx7M5bjNOxmC3atkjE+c/tjg5rvp9SWiIEmlxoYSzc4yt559rvYpCIzt
gsDCmA4JdQKBgQDe0As88wkJsQJ1gjESgNWp/nMJifh+zW3UlZFo6AvFAVCbZGxO
wpUX0Z4ImlWSxnK+tkVroVT0hPIVpZWIxBraP508pRCVXH4f2mPFc9uInnRNwP2m
Q2LfDUsTGxaU/dmzFneiXHcc8X9k9Ranlf7JX0fiMit5z3Pp+iLHfbLlUQKBgQC+
8yzpQfL4iO5wZ57VvQ12xUDYsySSGwtrwZLD9K1zLyWqaPFNx13FRfeMLM6BY6aN
zA3U70B2xsbNNXmS7dtZT8OSB5Q42SH1FNmdmzaN8QjkILrPGv3qSmcGJEFGhko7
7qxFuJgkVCJ8LURZ9aCJ6n+zoMGBo3XAiwlNZwT7fQKBgF0a2auhREdpSabbSKET
eiQIEAeBcuCtLeIaKGIQSzTF9GmbRQ7tuw1FGzPerb3EnPiLLQldvlo3vUSts7rl
JLcTx8x7v3V2AQf/x/obR6eJ5ky+/ZT72zZM5F29lrxCVOK27H454nv/ofpxD0PJ
QwWY1lOIlGN3H93fqx/TxhRW
-----END PRIVATE KEY-----`,
  client_email: "firebase-adminsdk-fbsvc@catbell-c7768.iam.gserviceaccount.com",
  client_id: "102536046882719257943",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40catbell-c7768.iam.gserviceaccount.com",
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.post("/send-notification", async (req, res) => {
  const { tokens, data } = req.body;

  if (!tokens || !Array.isArray(tokens) || tokens.length === 0) {
    return res.status(400).json({ error: "No tokens provided" });
  }

  try {
    // const message = {
    //   tokens,
    //   data: data || {},
    //   android: {
    //     priority: "high",
    //   },
    //   apns: {
    //     headers: {
    //       "apns-priority": "10",
    //     },
    //     payload: {
    //       aps: {
    //         "content-available": 1,
    //       },
    //     },
    //   },
    // };
    const message = {
      tokens,
      notification: {
        title: data?.title || "Incoming Call",
        body: data?.message || "Someone is calling you",
      },
      data: data || {},
      android: {
        priority: "high",
        notification: {
          sound: "ringtone", // Custom sound
          channelId: "incoming_call", // Custom channel needed on client
        },
      },
      apns: {
        headers: {
          "apns-priority": "10",
        },
        payload: {
          aps: {
            alert: {
              title: data?.title || "Incoming Call",
              body: data?.message || "Someone is calling you",
            },
            sound: "ringtone.caf", // Use your uploaded sound
            "content-available": 1,
          },
        },
      },
    };

    const response = await admin.messaging().sendEachForMulticast(message);
    return res.json({ success: true, response });
  } catch (error) {
    console.error("Error sending notification:", error);
    return res.status(500).json({ error: "Failed to send notification" });
  }
});

// Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
