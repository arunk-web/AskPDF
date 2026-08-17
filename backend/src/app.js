
//step 2
const express = require('express')
const cors = require('cors')
const uploadRoutes = require('./routes/uploadRoutes');
const chatRoutes = require('./routes/chatRoutes')
const statusRoutes = require('./routes/statusRoutes');
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api',uploadRoutes);
app.use('/api',chatRoutes)
app.use('/api',statusRoutes);


app.get('/', (req,res) => {
    res.send('AskPDF backend is running');
});


module.exports = app;

