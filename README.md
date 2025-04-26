# 🚀 Social Media API

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)

</div>

## 📝 Description

A robust and scalable RESTful API for a social media platform, built with Node.js and Express. This API provides endpoints for user authentication, post management, and social interactions. It's designed to work seamlessly with the [Flutter frontend application](https://github.com/OracleMatrix/my_socialmedia_app).

## ✨ Features

- 🔐 **Authentication & Authorization**

  - JWT-based authentication
  - Role-based access control
  - Secure password hashing

- 👥 **User Management**

  - User registration and login
  - Profile management
  - User search and follow system

- 📱 **Post Management**

  - Create, read, update, and delete posts
  - Like and comment functionality
  - Media upload support

- 🔍 **Search & Discovery**

  - Advanced search capabilities
  - Trending posts
  - User recommendations

- 📊 **API Documentation**
  - Swagger/OpenAPI documentation
  - Detailed endpoint descriptions
  - Interactive API testing

## 🛠️ Technologies

- **Runtime Environment:** Node.js
- **Framework:** Express.js
- **Database:** MySQL
- **ORM:** Sequelize
- **Authentication:** JWT, bcrypt
- **Documentation:** Swagger
- **Security:** Helmet, CORS
- **Validation:** Joi
- **Logging:** Morgan

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MySQL (v8 or higher)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/oraclematrix/social-media-api.git
cd social-media-api
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file in the root directory and add your environment variables

```env
DB_HOST=localhost
DB_USER=your_username
DB_PASS=your_password
DB_NAME=social_media_db
JWT_SECRET=your_jwt_secret
PORT=3000
```

4. Run the development server

```bash
npm run dev
```

## 📚 API Documentation

This project includes comprehensive API documentation powered by **Swagger (OpenAPI)**. When the server is running, you can access the interactive Swagger UI at the `/api-docs` endpoint. This documentation provides detailed information about all available endpoints, request and response formats, authentication requirements, and allows you to test the API directly from the browser.

Swagger support ensures that the API is well-documented, easy to understand, and simple to integrate with other services or frontend applications.

## 🔗 Related Projects

- [Flutter Frontend Application](https://github.com/OracleMatrix/my_socialmedia_app) - The mobile application built with Flutter that consumes this API.

## 📫 Contact

Ehsan Mohammadipoor - [ehsanmohamadipoor@gmail.com](mailto:ehsanmohamadipoor@gmail.com)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
Made with ❤️ by Ehsan Mohammadipoor
</div>
