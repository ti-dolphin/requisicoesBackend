
const fs = require("fs");
const admin = require("firebase-admin");
// const serviceAccount = require("../serviceAccountKey.json");
const { v4: uuidv4 } = require("uuid");
const { create } = require("domain");
const { error } = require("console");

require("dotenv").config();

const serviceAccount = {
  type: process.env.TYPE,
  project_id: process.env.PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
  universe_domain: process.env.UNIVERSE_DOMAIN,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://dolphin-8f800.appspot.com",
});

const fireBaseService = {
  uploadFileToFireBase: async (filePath) => {
    try {
      const bucket = admin.storage().bucket();
      await bucket.upload(filePath, {
        metadata: {
          metadata: { firebaseStorageDownloadTokens: uuidv4() },
        },
      });
      return "file uploaded!";
    } catch (e) {
      console.log("2 - error");
    }
  },
  getFilesFromFirebase: async () => {
    fireBaseService.makeAllFilesPublic();
    const bucket = admin.storage().bucket();
    const bucketFiles = await bucket.getFiles();
    return bucketFiles;
  },

  makeAllFilesPublic: () => {
    const bucket = admin.storage().bucket();
    try {
      const opts = {
        includeFiles: true,
        force: true,
      };
      bucket.makePublic(opts, function (errors, files) {});
    } catch (e) {
      console.log(e);
    }
  },
};
module.exports = fireBaseService;