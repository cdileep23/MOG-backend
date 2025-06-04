"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./db"));
const chapter_route_1 = __importDefault(require("../src/route/chapter.route"));
const rateLimit_1 = require("./utils/rateLimit");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(rateLimit_1.limiter);
app.use("/api/v1/chapters", chapter_route_1.default);
app.get("/", (req, response) => {
    response.send("Hello from MathonGo Backend");
});
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, db_1.default)();
        app.listen(4545, () => {
            console.log("✅ Server Started At 4545");
        });
    }
    catch (error) {
        console.log(error);
    }
});
startServer();
