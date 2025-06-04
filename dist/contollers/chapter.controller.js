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
exports.postChapters = exports.getChapterById = exports.getAllChapters = void 0;
const chapter_model_1 = require("../model/chapter.model");
const mongoose_1 = __importDefault(require("mongoose"));
const redisClient_1 = __importDefault(require("../utils/redisClient"));
const getAllChapters = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filters = {};
        if (req.query.class)
            filters.class = req.query.class;
        if (req.query.unit)
            filters.unit = req.query.unit;
        if (req.query.status)
            filters.status = req.query.status;
        if (req.query.subject)
            filters.subject = req.query.subject;
        if (req.query.isWeakChapter !== undefined)
            filters.isWeakChapter = req.query.isWeakChapter === true;
        const pageParam = req.query.page;
        const limitParam = req.query.limit;
        const usePagination = pageParam !== undefined && limitParam !== undefined;
        const page = parseInt(pageParam) || 1;
        const limit = parseInt(limitParam) || 10;
        const skip = (page - 1) * limit;
        const redisKey = usePagination
            ? `chapters:${JSON.stringify({ filters, page, limit })}`
            : `chapters:all:${JSON.stringify(filters)}`;
        const cachedData = yield redisClient_1.default.get(redisKey);
        if (cachedData) {
            console.log("cached");
            return res.status(200).json(JSON.parse(cachedData));
        }
        let chapters, total;
        if (usePagination) {
            [chapters, total] = yield Promise.all([
                chapter_model_1.chapterModel.find(filters).skip(skip).limit(limit),
                chapter_model_1.chapterModel.countDocuments(filters),
            ]);
        }
        else {
            [chapters, total] = yield Promise.all([
                chapter_model_1.chapterModel.find(filters),
                chapter_model_1.chapterModel.countDocuments(filters),
            ]);
        }
        const response = Object.assign(Object.assign({ success: true, total }, (usePagination ? { page, limit } : {})), { chapters });
        yield redisClient_1.default.setEx(redisKey, 3600, JSON.stringify(response));
        yield redisClient_1.default.sAdd("chapters:cacheKeys", redisKey);
        return res.status(200).json(response);
    }
    catch (error) {
        console.error("Error fetching chapters:", error);
        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
});
exports.getAllChapters = getAllChapters;
const getChapterById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chapterId = req.params.id;
        if (!mongoose_1.default.Types.ObjectId.isValid(chapterId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid chapter ID format",
            });
        }
        const chapter = yield chapter_model_1.chapterModel.findById(chapterId);
        if (!chapter) {
            return res.status(404).json({
                success: false,
                message: "Chapter not found",
            });
        }
        return res.status(200).json({
            message: "Successfully fetched",
            chapter,
            success: true,
        });
    }
    catch (error) {
        console.error("Error fetching chapter by id:", error);
        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
});
exports.getChapterById = getChapterById;
const postChapters = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chapters = req.body.chapters;
        if (!chapters) {
            return res.status(400).json({
                success: false,
                message: "No chapter content provided",
            });
        }
        if (!Array.isArray(chapters)) {
            return res.status(400).json({
                success: false,
                message: "Content must be a JSON array of chapters",
            });
        }
        const validChapters = [];
        const failedChapters = [];
        for (const chapter of chapters) {
            const newChapter = new chapter_model_1.chapterModel(chapter);
            try {
                yield newChapter.validate();
                validChapters.push(newChapter);
            }
            catch (err) {
                failedChapters.push({
                    chapter,
                    error: err.errors || err.message,
                });
            }
        }
        if (validChapters.length > 0) {
            yield chapter_model_1.chapterModel.insertMany(validChapters);
            const keys = yield redisClient_1.default.keys("chapters:*");
            if (keys.length > 0) {
                yield redisClient_1.default.del(keys);
                yield redisClient_1.default.del("chapters:cacheKeys");
                console.log("✅ Chapter cache invalidated in Upstash");
            }
        }
        return res.status(201).json({
            success: true,
            message: `Uploaded ${validChapters.length} chapters successfully`,
            failedCount: failedChapters.length,
            failedChapters,
        });
    }
    catch (error) {
        console.error("Error Posting Chapters", error);
        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
});
exports.postChapters = postChapters;
