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


/**
 * @swagger
 * tags:
 *   name: Session Summary
 *   description: Interview session analytics APIs
 */

/**
 * @swagger
 * /api/session-summary/interview/{sessionId}/complete:
 *   post:
 *     summary: Complete interview and generate session summary
 *     tags: [Session Summary]
 *     parameters:
 *       - name: sessionId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Interview session ID
 *     responses:
 *       200:
 *         description: Session summary generated successfully
 *         content:
 *           application/json:
 *             example:
 *               status: SUCCESS
 *               data:
 *                 sessionId: c6ca3f19-6692-4395-ae9c-f47ee7f25630
 *                 technicalAvg: 7.4
 *                 depthAvg: 6.8
 *                 communicationAvg: 8.1
 *                 codingAvg: 7.0
 *                 relevanceAvg: 7.9
 *                 topicCoverageScore: 0.82
 *                 consistencyScore: 7.1
 *                 confidenceScore: 0.77
 *                 overallScore: 74.5
 *                 strongSkillTags:
 *                   - Node.js
 *                   - MongoDB
 *                 weakSkillTags:
 *                   - System Design
 *                   - Security
 *       404:
 *         description: Interview session not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/session-summary:
 *   get:
 *     summary: Get all sessions
 *     tags: [Session Summary]
 *     responses:
 *       200:
 *         description: List of Sessions
 */




/**
 * @swagger
 * tags:
 *   name: Final Report
 *   description: AI generated interview report APIs
 */

/**
 * @swagger
 * /api/report/{sessionId}/final-report:
 *   post:
 *     summary: Generate final AI interview report
 *     tags: [Final Report]
 *     parameters:
 *       - name: sessionId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Interview session ID
 *     responses:
 *       200:
 *         description: Final interview report generated successfully
 *         content:
 *           application/json:
 *             example:
 *               status: SUCCESS
 *               data:
 *                 hiring_recommendation: Lean Hire
 *                 candidate_summary: The candidate demonstrated strong backend knowledge but needs improvement in system design and cloud architecture.
 *                 strengths:
 *                   - Node.js
 *                   - REST API design
 *                 weaknesses:
 *                   - System design
 *                   - Security
 *                 technical_depth_feedback: Candidate has good backend fundamentals but lacks deep architectural knowledge.
 *                 communication_feedback: Communication was clear but explanations lacked deeper reasoning.
 *                 improvement_plan:
 *                   - Study AWS services
 *                   - Practice system design questions
 *                   - Improve security knowledge
 *       404:
 *         description: Session summary not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/report/{sessionId}/final-report/pdf:
 *   get:
 *     summary: Download interview report as PDF
 *     tags: [Final Report]
 *     parameters:
 *       - name: sessionId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Interview session ID
 *     responses:
 *       200:
 *         description: Interview report PDF downloaded successfully
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Report not found
 *       500:
 *         description: Internal server error
 */