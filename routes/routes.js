import express from "express"
import {getIndex} from "../controllers/controller.js"
const router = express.Router()

router.get("/",getIndex)


export const exportRouter = router