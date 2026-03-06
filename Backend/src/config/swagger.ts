import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Sensei API",
      version: "1.0.0",
      description: "API documentation for Sensei platform"
    },
    servers: [
      {
        url: "http://localhost:5000"
      }
    ]
  },
  apis: ["./src/controllers/*.ts"]
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;