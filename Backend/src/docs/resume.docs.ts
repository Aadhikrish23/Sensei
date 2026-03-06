/**
 * @swagger
 * tags:
 *   name: Resume
 *   description: Resume management APIs
 */

/**
 * @swagger
 * /api/resumes/upload:
 *   post:
 *     summary: Upload resume
 *     tags: [Resume]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               Resume:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Resume uploaded successfully
 */

/**
 * @swagger
 * /api/resumes:
 *   get:
 *     summary: Get all resumes
 *     tags: [Resume]
 *     responses:
 *       200:
 *         description: List of resumes
 */

/**
 * @swagger
 * /api/resumes/{id}:
 *   get:
 *     summary: Get resume by ID
 *     tags: [Resume]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Resume details
 */

/**
 * @swagger
 * /api/resumes/{id}:
 *   patch:
 *     summary: Update resume title
 *     tags: [Resume]
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
 *               title:
 *                 type: string
 *                 example: Backend Developer Resume
 *     responses:
 *       200:
 *         description: Resume updated
 */

/**
 * @swagger
 * /api/resumes/{id}:
 *   delete:
 *     summary: Delete resume
 *     tags: [Resume]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Resume deleted
 */