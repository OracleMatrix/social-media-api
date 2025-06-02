const express = require("express");
const app = express();
require("dotenv").config();
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");

app.use(
  cors({
    origin: "*",
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(helmet());
const port = process.env.PORT || 3000;

const usersRoute = require("./routes/users.route");
app.use("/api/users", usersRoute);

const authRoute = require("./routes/auth.route");
app.use("/api/auth", authRoute);

const commentsRoute = require("./routes/comments.route");
app.use("/api/comments", commentsRoute);

const postsRoute = require("./routes/posts.route");
app.use("/api/posts", postsRoute);

const likesRoute = require("./routes/likes.route");
app.use("/api/likes", likesRoute);

const followRoute = require("./routes/follow.route");
app.use("/api/follow", followRoute);

app.get("/", (req, res) => res.send("Hello World!"));

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const db = require("./models");

db.sequelize
  .sync({alter: true})
  .then((req) => {
    console.log("Database connected...");
    app.listen(port, () => console.log(`Server listening on port ${port}`));
  })
  .catch((err) => {
    console.log("Error connecting to database: ", err);
  });
