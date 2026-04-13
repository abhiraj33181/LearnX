import express from 'express';
import { getSessions, createSession, listSession, leaveSession, endSession, joinSession } from '../controllers/session.controller.js';
import { body, validationResult } from 'express-validator';
import { protect } from '../middlewares/auth.middleware.js';



const sessionRouter = express.Router();

sessionRouter.use(protect)

// Validation Middleware
const handleValidationError = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: errors.array()[0].msg
        })
    }

    next();
}

sessionRouter.get("/list", listSession)

sessionRouter.post("/create", createSession)

sessionRouter.post("/join",
    [
        body('roomId')
            .trim()
            .notEmpty()
            .withMessage("Room Id is required")
    ],
    handleValidationError,
    joinSession
)

sessionRouter.get("/:roomId", getSessions)

sessionRouter.post("/end/:sessionId", endSession)


sessionRouter.post("/leave",
    [
        body('roomId')
            .trim()
            .notEmpty()
            .withMessage("Room Id is required")
    ],
    handleValidationError,
    leaveSession
)


export default sessionRouter;