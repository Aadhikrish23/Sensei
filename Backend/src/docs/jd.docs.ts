/**
 * @swagger
 * tags:
 *   name: JobDescription
 *   description: Job description APIs
 */

/**
 * @swagger
 * /api/jd/upload:
 *   post:
 *     summary: Upload job description
 *     tags: [JobDescription]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Backend Developer
 *               rawText:
 *                 type: string
 *                 example: Looking for a Node.js developer with PostgreSQL experience
 *     responses:
 *       200:
 *         description: Job description uploaded
 */

/**
 * @swagger
 * /api/jd:
 *   get:
 *     summary: Get all job descriptions
 *     tags: [JobDescription]
 *     responses:
 *       200:
 *         description: List of job descriptions
 */

/**
 * @swagger
 * /api/jd/{id}:
 *   get:
 *     summary: Get job description by ID
 *     tags: [JobDescription]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job description details
 */

/**
 * @swagger
 * /api/jd/{id}:
 *   patch:
 *     summary: Update job description
 *     tags: [JobDescription]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rawText:
 *                 type: string
 *                 example: Updated job description text
 *     responses:
 *       200:
 *         description: Job description updated
 */

/**
 * @swagger
 * /api/jd/{id}:
 *   delete:
 *     summary: Delete job description
 *     tags: [JobDescription]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job description deleted
 */