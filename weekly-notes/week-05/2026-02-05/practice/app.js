import express from 'express';
import userRouter from './routes/users.js';
import channelRouter from './routes/channels.js'; // channel-demo 소환

const app = express();

app.listen(7777);

app.use('/', userRouter);
app.use('/channels', channelRouter);
