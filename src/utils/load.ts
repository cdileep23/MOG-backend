import path from "path";
import fs from 'fs'
import { chapterModel } from "../model/chapter.model";
 const filePath = path.join(__dirname, "../all_subjects_chapter_data.json");
 const fileContent = fs.readFileSync(filePath, "utf-8");

 const parsed = JSON.parse(fileContent);

 const chapters = parsed.flat(); 
export const loadData=async()=>{
    try {
        await chapterModel.insertMany(parsed);
        console.log("loaded successful")
    } catch (error) {
        console.log(error)
    }
}