const express = require('express');
var cors = require('cors')
const connectToMongo = require('./db');
connectToMongo();

const app = express();
const port = 5000;

app.use(cors())

app.use(express.json())
// app.get('/', (req, res) => {
//   res.send('Hello my dear Ayushi, keep it up!')
// })

//available routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.listen(port, () => {
  console.log(`notesOncloud backend listening on port http://localhost:${port}`)
})