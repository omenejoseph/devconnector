const express = require('express');
const mongoose = require('mongoose');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app = express();
// DB CONFIG
const db = require('./config/keys').mongoURI;
// Connect to Database
mongoose
    .connect(db)
    .then(() => console.log("MongoDB connected"))
    .catch(ex => console.log(ex));

app.get("/", (req, res) => res.send('hello world'));
// Use routes
app.use('/api/users/', users);
app.use('/api/profile/', profile);
app.use('/api/posts/', posts);

//Serve application
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${ port }`));