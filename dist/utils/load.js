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
exports.loadData = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const chapter_model_1 = require("../model/chapter.model");
const filePath = path_1.default.join(__dirname, "../all_subjects_chapter_data.json");
const fileContent = fs_1.default.readFileSync(filePath, "utf-8");
const parsed = JSON.parse(fileContent);
const chapters = parsed.flat();
const loadData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield chapter_model_1.chapterModel.insertMany(parsed);
        console.log("loaded successful");
    }
    catch (error) {
        console.log(error);
    }
});
exports.loadData = loadData;
