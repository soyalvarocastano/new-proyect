import dotenv from "dotenv";
if (process.env.NODE_ENV === "production") {
	dotenv.config({ path: ".production.env" });
} else {
	dotenv.config({ path: ".development.env" });
}

import compression from "compression";
import cors from "cors";
import bodyParser from "body-parser";
import helmet from "helmet";
import express from "express";
import expressSession from "express-session";
import winston from "winston";
import expressWiston from "express-winston";

//RUTAS
import users from "./users/users.routes";

const sess: expressSession.SessionOptions = {
	secret: "keyboard cat",
	cookie: {},
};

console.log(process.env.TEST);

const app = express();
const port = 3030;

if (app.get("env") === "production") {
	app.set("trust proxy", 1); // trust first proxy
	sess.cookie.secure = true; // serve secure cookies
}

app.use(
	cors({
		origin: "*",
	})
);

app.use(helmet());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json);
app.use(expressSession(sess));

app.use("/", (req, res) => {
	res.send("ok");
});
app.use("./users", users);

app.use(
	expressWiston.logger({
		transports: [
			new winston.transports.File({
				level: "error",
				filename: "error.log",
				format: winston.format.json(),
			}),
			new winston.transports.File({
				level: "info",
				filename: "combined.log",
				format: winston.format.json(),
			}),
		],
		format: winston.format.combine(winston.format.json()),
	})
);

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
