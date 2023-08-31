import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const firestore = admin.firestore();

// Cloud Function to delete unverified users older than 3 days
exports.deleteUnverifiedUsers = functions.pubsub
  .schedule("every 24 hours")
  .timeZone("America/New_York")
  .onRun(async () => {
    const unverifiedUsersSnapshot = await firestore
      .collection("users")
      .where("emailVerified", "==", false)
      .where("createdAt", "<=", new Date(Date.now() - 3 * 24 * 60 * 60 * 1000))
      .get();

    unverifiedUsersSnapshot.forEach((userDoc) => {
      const userData = userDoc.data();
      if (userData.createdAt && !userData.emailVerified) {
        admin.auth().deleteUser(userData.uid);
        userDoc.ref.delete();
        console.log(`Deleted user: ${userData.uid}`);
      }
    });

    return null;
  });
