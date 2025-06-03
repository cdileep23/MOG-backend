import express from "express"
import { getAllChapters, getChapterById, postChapters } from "../contollers/chapter.controller"
import { isAdmin } from "../middleware/auth";

const router=express.Router()

router.route('/').get(getAllChapters);
router.route('/:id').get(getChapterById)
router.route('/').post(isAdmin,postChapters )
export default router
