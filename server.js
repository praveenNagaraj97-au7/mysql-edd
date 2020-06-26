import { app } from "./app";

import { connection } from "./dBConfig";

connection.authenticate().then((err) => {
  if (err) console.log(err);
  console.log("DataBase Connected");
});

connection.sync({ force: false });

const server = app.listen(process.env.PORT, process.env.HOST, () => {
  console.log(`Listening on ${process.env.HOST}:${process.env.PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log("Closing Server");
  console.log(`Reason : ${err}`);
  server.close();
});
