import dotenv from "dotenv";
dotenv.config({ path: __dirname + '/.env'});

import app from './app';
import messages from './lib/messages.json';

const PORT = process.env.PORT || 4000;  

app.listen(PORT, () => {
  console.log(messages.success.servercon, PORT);
});
