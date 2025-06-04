import mongoose, { Schema, Document } from "mongoose";

interface YearWiseQuestionCount {
  [year: string]: number;
}

export interface IChapter extends Document {
  subject: string;
  chapter: string;
  class: string;
  unit: string;
  yearWiseQuestionCount: YearWiseQuestionCount;
  questionSolved: number;
  status: "Not Started" | "In Progress" | "Completed";
  isWeakChapter: boolean;
}

const yearWiseQuestionCountSchema = new Schema<YearWiseQuestionCount>(
  {
    "2019": { type: Number, default: 0 },
    "2020": { type: Number, default: 0 },
    "2021": { type: Number, default: 0 },
    "2022": { type: Number, default: 0 },
    "2023": { type: Number, default: 0 },
    "2024": { type: Number, default: 0 },
    "2025": { type: Number, default: 0 },
  },
  { _id: false }
);

const ChapterSchema: Schema<IChapter> = new Schema({
  subject: { type: String, required: true },
  chapter: { type: String, required: true },
  class: { type: String, required: true },
  unit: { type: String, required: true },
  yearWiseQuestionCount:{ type: yearWiseQuestionCountSchema, required: true },
  questionSolved: { type: Number, required:true},
  status: {
    type: String,
    enum: ["Not Started", "In Progress", "Completed"],
   required:true
  },
  isWeakChapter: { type: Boolean, default: false },
});

export const chapterModel=mongoose.model<IChapter>("Chapter", ChapterSchema);
