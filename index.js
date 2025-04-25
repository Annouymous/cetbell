require("dotenv").config(); // Load environment variables locally

const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

const app = express();
const PORT = process.env.PORT || 3000;

// Setup Firebase Admin
const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
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
    const message = {
      tokens,
      data: data || {},
      android: {
        priority: "high",
      },
      apns: {
        headers: {
          "apns-priority": "10",
        },
        payload: {
          aps: {
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
