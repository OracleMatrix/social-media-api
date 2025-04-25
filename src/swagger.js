// swagger.js
const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Blog API",
      version: "1.0.0",
      description: "A simple Express Blog API",
    },
    components: {
      securitySchemes: {
        AuthorizationHeader: {
          type: "apiKey",
          in: "header",
          name: "auth",
        },
      },
    },
    security: [
      {
        AuthorizationHeader: [],
      },
    ],
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
