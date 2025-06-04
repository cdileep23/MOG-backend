"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chapter_controller_1 = require("../contollers/chapter.controller");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.route('/').get(chapter_controller_1.getAllChapters);
router.route('/:id').get(chapter_controller_1.getChapterById);
router.route('/').post(auth_1.isAdmin, chapter_controller_1.postChapters);
exports.default = router;
