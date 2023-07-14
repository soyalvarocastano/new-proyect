"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
if (process.env.NODE_ENV === "production") {
    dotenv_1.default.config({ path: ".production.env" });
}
else {
    dotenv_1.default.config({ path: ".development.env" });
}
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const helmet_1 = __importDefault(require("helmet"));
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const winston_1 = __importDefault(require("winston"));
const express_winston_1 = __importDefault(require("express-winston"));
const users_routes_1 = __importDefault(require("./users/users.routes"));
const sess = {
    secret: "keyboard cat",
    cookie: {},
};
console.log(process.env.TEST);
const app = (0, express_1.default)();
const port = 3000;
if (app.get("env") === "production") {
    app.set("trust proxy", 1);
    sess.cookie.secure = true;
}
app.use((0, cors_1.default)({
    origin: "*",
}));
app.use((0, helmet_1.default)());
app.use((0, compression_1.default)());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json);
app.use((0, express_session_1.default)(sess));
app.use("/", (req, res) => {
    res.send("ok");
});
app.use("./users", users_routes_1.default);
app.use(express_winston_1.default.logger({
    transports: [
        new winston_1.default.transports.File({
            level: "error",
            filename: "error.log",
            format: winston_1.default.format.json(),
        }),
        new winston_1.default.transports.File({
            level: "info",
            filename: "combined.log",
            format: winston_1.default.format.json(),
        }),
    ],
    format: winston_1.default.format.combine(winston_1.default.format.json()),
}));
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
//# sourceMappingURL=index.js.map