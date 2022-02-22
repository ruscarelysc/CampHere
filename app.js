const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');


mongoose.connect('mongodb://localhost:27017/camp-here')
  .then(() => {
    console.log("CONNECTION OPEN!!!")
  })
  .catch(err => {
    console.log("ERROR!!!")
    console.log(err)
  })



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
  res.render('home')
})



app.listen(3000, () => {
  console.log("APP IS LITENING ON PORT 3000!")
})
