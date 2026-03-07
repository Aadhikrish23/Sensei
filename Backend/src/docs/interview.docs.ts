/**
 * @swagger
 * tags:
 *   name: Interview
 *   description: AI Interview session management
 */
/**
 * @swagger
 * /api/interview/start-interview:
 *   post:
 *     summary: Start a new AI interview session
 *     description: Creates a new interview session and generates the first AI interview question
 *     tags: [Interview]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - resumeId
 *               - jdId
 *               - difficulty
 *             properties:
 *               resumeId:
 *                 type: string
 *                 example: "resume_uuid"
 *               jdId:
 *                 type: string
 *                 example: "jd_uuid"
 *               difficulty:
 *                 type: string
 *                 enum: [BEGINNER, INTERMEDIATE, ADVANCED]
 *                 example: "INTERMEDIATE"
 *     responses:
 *       201:
 *         description: Interview session started successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sessionId:
 *                   type: string
 *                   example: "b2b4e9f4-6d6f-4c4c-92f1-4e4c5e6a3e1a"
 *                 questionNumber:
 *                   type: number
 *                   example: 1
 *                 questionText:
 *                   type: string
 *                   example: "Explain the Node.js event loop."
 *                 questionType:
 *                   type: string
 *                   example: "THEORY"
 *                 difficulty:
 *                   type: string
 *                   example: "INTERMEDIATE"
 *                 skillTags:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Node.js"]
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/interview/answer:
 *   post:
 *     summary: Submit answer for an interview question
 *     tags: [Interview]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sessionId
 *               - questionNumber
 *               - answerText
 *             properties:
 *               sessionId:
 *                 type: string
 *                 example: "uuid"
 *               questionNumber:
 *                 type: number
 *                 example: 1
 *               answerText:
 *                 type: string
 *                 example: "The Node.js event loop handles asynchronous callbacks..."
 *     responses:
 *       200:
 *         description: Answer evaluated successfully
 */
