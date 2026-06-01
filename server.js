const app = require("./app");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const { startCron } = require("./cronjob");

const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    // Start the scheduler when the server starts so cron works even if only server is running.
    startCron();
  })
  .catch((err) => console.error("Failed to connect to MongoDB", err));

const port = process.env.PORT;
app.listen(port, () => console.log(`Server is running on port ${port}`));

