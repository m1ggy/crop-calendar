// Import Firebase Admin SDK
const admin = require("firebase-admin");
var serviceAccount = require("../firebase.json");
// Initialize Firebase Admin SDK with your credentials (ensure your service account key is set)
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount), // Or use admin.credential.cert() with your service account key
});

// Function to set custom claims for a user
async function setMunicipalityClaim(userId, municipality) {
  try {
    // Add the custom claim "Municipality" to the user
    await admin
      .auth()
      .setCustomUserClaims(userId, { Municipality: municipality });

    console.log(
      `Custom claim "Municipality: ${municipality}" has been set for user ${userId}`,
    );
  } catch (error) {
    console.error("Error setting custom claim:", error);
  }
}

// Get arguments from the command line
const args = process.argv.slice(2);
const userId = args[0]; // First argument is the user ID
const municipality = args[1]; // Second argument is the municipality value

if (!userId || !municipality) {
  console.error("Usage: node setCustomClaim.js <userId> <municipality>");
  process.exit(1);
}

// Call the function to set the custom claim
setMunicipalityClaim(userId, municipality);
