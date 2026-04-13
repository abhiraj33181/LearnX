import sessionModel from "../models/session.model.js";
import userModel from "../models/user.model.js";

export const listSession = async (req, res, next) => {
    try {
        const userId = req.user
        const { status } = req.query;

        const statusFilter = status && status !== 'all' ? { status } : {};

        const session = await sessionModel.find({
            $and: [
                statusFilter, {
                    $or: [
                        { host: userId },
                        { 'participants.userId': userId }
                    ]
                }
            ]
        }).sort({ createdAt: -1 }).populate("host", "name")

        const result = session.map((s) => ({
            id: s._id,
            roomId: s.roomId,
            hostName: s.host.name,
            status: s.status,
            participantCount: s.participants.length || 0,
            startedAt: s.startedAt,
            endedAt: s.endedAt,
            isHost: s.host._id.toString() === userId
        }))

        res.json({
            success: true,
            data: {
                session: result
            }
        });
    } catch (error) {
        next(error)
    }
}


export const createSession = async (req, res, next) => {
    try {
        const userId = req.user

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        // generate unique roomId
        let roomId;
        let attempts = 0;
        const maxAttempts = 5;

        do {
            roomId = sessionModel.generateRoomId();
            const exits = await sessionModel.roomIdExists(roomId);

            if (!exits) break;
            attempts++;
        } while (attempts < maxAttempts);

        if (attempts >= maxAttempts) {
            return res.status(500).json({
                success: false,
                error: "Failed to generate unique room ID. Please try again"
            })
        }


        const session = await sessionModel.create({
            roomId,
            host: userId,
            participants: [{
                userId: userId,
                userName: user.name
            }]
        })

        res.status(201).json({
            success: true,
            data: {
                session: {
                    id: session._id,
                    roomId: session.roomId,
                    status: session.status,
                    participantCount: session.participants.length,
                    startedAt: session.startedAt,
                    participants: session.participants
                }
            }
        })
    } catch (error) {
        next(error)
    }
}


export const joinSession = async (req, res, next) => {
    try {
        const { roomId } = req.body;
        const userId = req.user

        if (!roomId) {
            return res.status(400).json({
                success: false,
                message: "Room Id is required"
            })
        }

        const session = await sessionModel.findOne({ roomId }).populate("host", "name")

        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Session not found. Please check the room ID"
            })
        }

        if (session.status !== 'active') {
            return res.status(400).json({
                success: false,
                message: "This session has ended."
            })
        }

        // if user is already joined
        const alreadyJoined = session.participants.some(
            p => p.userId.toString() === userId.toString()
        )

        if (alreadyJoined) {
            return res.json({
                success: true,
                data: {
                    session: {
                        id: session._id,
                        roomId: session.roomId,
                        hostName: session.host?.name || '',
                        status: session.status,
                        participantCount: session.participants.length,
                        isHost: session.host?._id?.toString() === userId.toString(),
                        participants: session.participants
                    }
                }
            })
        }

        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }


        session.participants.push({
            userId: userId,
            userName: user.name
        })

        await session.save();

        res.json({
            success: true,
            data: {
                session: {
                    id: session._id,
                    roomId: session.roomId,
                    hostName: session.host?.name || user.name,
                    status: session.status,
                    participantCount: session.participants.length,
                    isHost: session.host?._id?.toString() === userId.toString(),
                    participants: session.participants
                }
            }
        })



    } catch (error) {
        next(error)
    }
}

export const getSessions = async (req, res, next) => {
    try {
        const { roomId } = req.params;
        const userId = req.user

        const session = await sessionModel.findOne({ roomId }).populate("host", "name")

        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Session not found. Please check the room ID"
            })
        }

        // if user is already joined
        const isParticipant = session.participants.some(
            p => p.userId.toString() === userId.toString()
        )


        res.json({
            success: true,
            data: {
                session: {
                    id: session._id,
                    roomId: session.roomId,
                    hostName: session.host.name,
                    status: session.status,
                    participantCount: session.participants.length,
                    isHost: session.host._id.toString() === userId.toString(),
                    participants: session.participants,
                    isParticipant
                }
            }
        })

    } catch (error) {
        next(error)
    }
}

export const endSession = async (req, res, next) => {
    try {
        const { sessionId } = req.params;
        const userId = req.user

        const session = await sessionModel.findById(sessionId)

        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Session not found."
            })
        }

        // Verify user is host or not 
        if (session.host.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Only host can end the session."
            })
        }

        if (session.status === 'ended') {
            return res.status(400).json({
                success: false,
                message: "Session has already ended."
            })
        }

        session.status = 'ended';
        session.endedAt = new Date();
        await session.save();

        res.json({
            success: true,
            data: {
                session: {
                    id: session._id,
                    roomId: session.roomId,
                    status: session.status,
                    endedAt: session.endedAt
                }
            }
        })
    } catch (error) {
        next(error)
    }
}


export const leaveSession = async (req, res, next) => {
    try {
        const { roomId } = req.body;
        const userId = req.user

        if (!roomId) {
            return res.status(400).json({
                success: false,
                message: "Room Id is required"
            })
        }

        const session = await sessionModel.findOne({ roomId })

        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Session not found. Please check the room ID"
            })
        }


        session.participants = session.participants.filter(
            p => p.userId.toString() !== userId.toString()
        )

        await session.save();

        res.json({
            success: true,
            message: "Left session successfully"
        })
    } catch (error) {
        next(error)
    }
}