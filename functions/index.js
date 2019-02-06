const express = require('express');
const firebase = require('firebase-admin');
const functions = require('firebase-functions');

const firebaseApp = firebase.initializeApp(
  functions.config().firebase
);

function getUser(userId) {
  const ref = firebaseApp.database().ref('users/'+ userId);
  return ref.once('value').then(snapshot => snapshot.val())
}

const app = express();

app.get('/user/:id', (req, res) => {
  return getUser(parseInt(req.params.id))
  .then(data => {
    return res.json(data);
  })
});

app.post('/workout/:date.:duration.:exercise', (req, res) => {
  firebaseApp.database().ref('users/0/workouts').push({
    date: req.params.date,
    duration: parseInt(req.params.duration),
    exerciseType: req.params.exercise
  });
  res.status(200).end();
})

exports.app = functions.https.onRequest(app);
