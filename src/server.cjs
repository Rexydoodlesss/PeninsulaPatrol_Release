const { Server } = require('socket.io');
const http = require('http');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://peninsulapatrol.vercel.app"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true
  }
});

let matchkey;
let matchcolors = [];
let superQueue = [];
let matchQueue = [];
let currentEventKey;
let currentDataSheet;
let currentPitScout;
let superColors;

app.use(cors({
  origin: ["http://localhost:5173", "https://peninsulapatrol.vercel.app"],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
  credentials: true
}));

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      fontSrc: ["'self'", "https://sveltekit-app-249033178888.us-west2.run.app"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'", "http://localhost:5173", "https://peninsulapatrol.vercel.app"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
}));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

io.on('connection', (socket) => {
  console.log('a user connected');

  if (currentEventKey) {
    socket.emit('eventkey', currentEventKey);
  }
  if (currentDataSheet) {
    socket.emit('datasheet', currentDataSheet);
  }
  if (currentPitScout) {
    socket.emit('pitscout', currentPitScout);
  }

  socket.on('datasheet', (link) => {
    currentDataSheet = link;
    io.emit('datasheet', link); 
  });

  socket.on('pitscout', (link) => {
    currentPitScout = link;
    io.emit('pitscout', link); 
  });

  socket.on('queueinitiate', (teams) => {
    io.emit("restart", "");
    matchkey = teams.matchkey;
    matchQueue=[
      teams.red1,
      teams.red2,
      teams.red3,
      teams.blue1,
      teams.blue2,
      teams.blue3
    ]
    superQueue=[
      teams.red1,
      teams.red2,
      teams.red3,
      teams.blue1,
      teams.blue2,
      teams.blue3
    ]
    matchcolors=[
      "red",
      "red",
      "red",
      "blue",
      "blue",
      "blue"
    ]
    superColors=[
      "red",
      "red",
      "red",
      "blue",
      "blue",
      "blue"
    ]
    setTimeout(() => {
      io.emit("restart", "");
    }, 1000);
  });
 
  socket.on('eventkey', (key) => {
    currentEventKey = key;
    io.emit('eventkey', key);
  });

  socket.on('completedmatch', (scout) => {
    io.emit('compmatch', scout);
  });

  socket.on('completedsuper', (scout) => {
    io.emit('compsuper', scout);
  });

  socket.on('receivedmatch', (scout) => {
    io.emit('receivedmatch', scout);
  });

  socket.on('receivedsuper', (scout) => {
    io.emit('receivedsuper', scout);
  });

  socket.on('queue', (data) => {
    const scouttype = data.scouttype;
    if (scouttype == 0) {
      if (matchQueue.length != 0){
        const team = matchQueue.shift();
        const color = matchcolors.shift();
        socket.emit('matchqueue', { team, matchkey, color });
        io.emit('receivedmatch', data.username);
      } else {
        socket.emit("emptymatch", "");
      }
    }
    else
    {
      if (superQueue.length != 0){
        const team = superQueue.shift();
        const color = superColors.shift();
        socket.emit('superqueue', { team, matchkey, color });
        io.emit('receivedsuper', data.username);
      } else {
        socket.emit("emptysuper", "");
      }
    }
  });

  socket.on('superqueue', (data) => {
    if (superQueue.length != 0){
      const team = superQueue.shift();
      const color = superColors.shift();
      io.emit('receivedsuper', data.username);
      socket.emit('superqueue', { team, matchkey, color });
    } else {
      socket.emit("emptysuper", "");
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
