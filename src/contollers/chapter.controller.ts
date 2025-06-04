import { Request, Response } from "express";
import { chapterModel } from "../model/chapter.model";

import mongoose from "mongoose";
import redisClient from "../utils/redisClient";
interface GetChapterResponseQueryParams {
  class?: string;
  unit?: string;
  status?: string;
  isWeakChapter?: boolean;
  subject?: string;
  page?: number;
  limit?: number;
}

export const getAllChapters = async (
  req: Request<{}, {}, {}, GetChapterResponseQueryParams>,
  res: Response
): Promise<any> => {
  try {
    const filters: any = {};
    if (req.query.class) filters.class = req.query.class;
    if (req.query.unit) filters.unit = req.query.unit;
    if (req.query.status) filters.status = req.query.status;
    if (req.query.subject) filters.subject = req.query.subject;
    if (req.query.isWeakChapter !== undefined)
      filters.isWeakChapter = req.query.isWeakChapter === true;

    const pageParam = req.query.page;
    const limitParam = req.query.limit;

    const usePagination = pageParam !== undefined && limitParam !== undefined;

    const page = parseInt(pageParam as any) || 1;
    const limit = parseInt(limitParam as any) || 10;
    const skip = (page - 1) * limit;

    const redisKey = usePagination
      ? `chapters:${JSON.stringify({ filters, page, limit })}`
      : `chapters:all:${JSON.stringify(filters)}`;

    const cachedData = await redisClient.get(redisKey);
    if (cachedData) {
      console.log("cached");
      return res.status(200).json(JSON.parse(cachedData));
    }

    let chapters, total;

    if (usePagination) {
      [chapters, total] = await Promise.all([
        chapterModel.find(filters).skip(skip).limit(limit),
        chapterModel.countDocuments(filters),
      ]);
    } else {
      [chapters, total] = await Promise.all([
        chapterModel.find(filters),
        chapterModel.countDocuments(filters),
      ]);
    }

    const response = {
      success: true,
      total,
      ...(usePagination ? { page, limit } : {}),
      chapters,
    };

    await redisClient.setEx(redisKey, 3600, JSON.stringify(response));
await redisClient.sAdd("chapters:cacheKeys", redisKey);
    return res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching chapters:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};



export const getChapterById = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<any> => {
  try {
    const chapterId = req.params.id;

  
    if (!mongoose.Types.ObjectId.isValid(chapterId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid chapter ID format",
      });
    }

    const chapter = await chapterModel.findById(chapterId);

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
  } catch (error) {
    console.error("Error fetching chapter by id:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const postChapters = async (
  req: Request,
  res: Response
): Promise<any> => {
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

    const validChapters: any[] = [];
    const failedChapters: any[] = [];

    for (const chapter of chapters) {
      const newChapter = new chapterModel(chapter);
      try {
        await newChapter.validate();
        validChapters.push(newChapter);
      } catch (err: any) {
        failedChapters.push({
          chapter,
          error: err.errors || err.message,
        });
      }
    }

    if (validChapters.length > 0) {
      await chapterModel.insertMany(validChapters);

      const keys = await redisClient.keys("chapters:*");
      if (keys.length > 0) {
        await redisClient.del(keys);
        await redisClient.del("chapters:cacheKeys"); 
        console.log("✅ Chapter cache invalidated in Upstash");
      }
    }

    return res.status(201).json({
      success: true,
      message: `Uploaded ${validChapters.length} chapters successfully`,
      failedCount: failedChapters.length,
      failedChapters,
    });
  } catch (error) {
    console.error("Error Posting Chapters", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};