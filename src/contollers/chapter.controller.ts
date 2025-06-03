import { Request, Response } from "express";
import { chapterModel } from "../model/chapter.model";
import { redisClient } from "../utils/redisClient";
import mongoose from "mongoose";
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
) :Promise<any>=> {
  try {
    
    const filters: any = {};
    if (req.query.class) filters.class = req.query.class;
    if (req.query.unit) filters.unit = req.query.unit;
    if (req.query.status) filters.status = req.query.status;
    if (req.query.subject) filters.subject = req.query.subject;
    if (req.query.isWeakChapter !== undefined)
      filters.isWeakChapter =
        req.query.isWeakChapter === true 

  
    const page = parseInt((req.query.page as any) || "1");
    const limit = parseInt((req.query.limit as any) || "10");
    const skip = (page - 1) * limit;

   
 
    const [chapters, total] = await Promise.all([
      chapterModel.find(filters).skip(skip).limit(limit),
      chapterModel.countDocuments(filters),
    ]);

    const response = {
      success: true,
      total,
      page,
      limit,
      chapters,
    };

    
   

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
export const postChapters=async(req:Request,res:Response):Promise<any>=>{
  try {
  const allchapters=req.body.chapters;
            await chapterModel.insertMany(allchapters);
            console.log("loaded successful")
            return res.status(201).json({
              message:"Succesfully Added Chapters",
            success:true
            })
       
  } catch (error) {
     console.error("Error Posting Chater", error);
     return res.status(500).json({
       success: false,
       message: "Server Error",
     });
  }
}
