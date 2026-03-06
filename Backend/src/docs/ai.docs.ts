/**
 * @swagger
 * tags:
 *   name: AI Matching
 *   description: Resume and Job Description AI analysis
 */

/**
 * @swagger
 * /api/ai/parse-resume:
 *   post:
 *     summary: Parse resume using AI
 *     tags: [AI Matching]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               resumeId:
 *                 type: string
 *                 example: resume_uuid
 *     responses:
 *       200:
 *         description: Resume parsed successfully
 */

/**
 * @swagger
 * /api/ai/parse-jd:
 *   post:
 *     summary: Parse job description using AI
 *     tags: [AI Matching]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jdId:
 *                 type: string
 *                 example: jd_uuid
 *     responses:
 *       200:
 *         description: Job description parsed successfully
 */

/**
 * @swagger
 * /api/ai/match-resume-jd:
 *   post:
 *     summary: Match resume with job description
 *     tags: [AI Matching]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               resumeId:
 *                 type: string
 *               jdId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Matching completed
 */