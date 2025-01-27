# Shiksha Dost Backend

This is the backend repository for **Shiksha Dost**, a scalable, secure, and modular backend designed to support educational platforms. It provides APIs for user authentication, blog management, mentorship, materials, and more.

---

## Table of Contents

1. [Features](#features)
2. [Directory Structure](#directory-structure)
3. [Installation](#installation)
4. [Running the Application](#running-the-application)
5. [Configuration](#configuration)
6. [Docker Support](#docker-support)
7. [Deployment](#deployment)
8. [API Documentation](#api-documentation)
9. [Contributing](#contributing)
10. [License](#license)

---

## Features

- **User Authentication**: Secure user registration, login, and password management.
- **Blog Management**: Create, read, update, and delete blogs.
- **Mentorship**: Manage mentorship programs and mentor profiles.
- **Materials**: Upload and manage educational materials.
- **Rate Limiting**: Protect APIs from abuse.
- **Security**: Helmet, HPP, XSS protection, and MongoDB sanitization.
- **File Uploads**: Support for file uploads using AWS S3.
- **Email Notifications**: Send emails for verification, password reset, and more.
- **Docker Support**: Easily containerize and deploy the application.
- **Modular Design**: Clean and maintainable codebase.

---

## Directory Structure

```
└── harmeet10000-shiksha-dost-backend.git/
    ├── README.md
    ├── Dockerfile
    ├── package.json
    ├── webpack.config.js
    ├── .babelrc
    ├── .dockerignore
    ├── scripts/
    │   ├── _Docker.sh
    │   └── _ECS.sh
    ├── src/
    │   ├── app.js
    │   ├── index.js
    │   ├── config/
    │   │   ├── config.json
    │   │   ├── dotenvConfig.js
    │   │   ├── forgotPassword-template.json
    │   │   ├── resetPassword-template.json
    │   │   ├── verification-template.js
    │   │   ├── welcome-mentor-template.js
    │   │   └── welcome-template.js
    │   ├── controllers/
    │   │   ├── authController.js
    │   │   ├── blogController.js
    │   │   ├── commentController.js
    │   │   ├── dppController.js
    │   │   ├── handlerFactory.js
    │   │   ├── materialController.js
    │   │   ├── mentorController.js
    │   │   ├── mentorshipController.js
    │   │   └── userController.js
    │   ├── db/
    │   │   └── connect.js
    │   ├── helpers/
    │   │   ├── email.js
    │   │   ├── razorpay.js
    │   │   └── s3.js
    │   ├── middlewares/
    │   │   ├── authMiddleware.js
    │   │   ├── errorMiddleware.js
    │   │   └── increaseVisits.js
    │   ├── models/
    │   │   ├── blogModel.js
    │   │   ├── commentModel.js
    │   │   ├── dppModel.js
    │   │   ├── materialModel.js
    │   │   ├── mentorModel.js
    │   │   ├── mentorshipModel.js
    │   │   └── userModel.js
    │   ├── routes/
    │   │   ├── authRoutes.js
    │   │   ├── blogRoutes.js
    │   │   ├── commentRoutes.js
    │   │   ├── dppRoutes.js
    │   │   ├── materialRoutes.js
    │   │   ├── mentorRoutes.js
    │   │   ├── mentorshipRoutes.js
    │   │   ├── paymentRoutes.js
    │   │   └── userRoutes.js
    │   └── utils/
    │       ├── apiFeatures.js
    │       ├── appError.js
    │       └── catchAsync.js
    └── .github/
        └── workflows/
            └── Deploy-Backend.yml
```

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Harmeet10000/Shiksha-Dost-Backend.git
   cd Shiksha-Dost-Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add the required environment variables (e.g., `MONGO_URI`, `JWT_SECRET`, `AWS_ACCESS_KEY`, etc.).

---

## Running the Application

- **Development Mode**:
  ```bash
  npm run dev
  ```

- **Production Build**:
  ```bash
  npm run build
  npm start
  ```

---

## Configuration

- **Environment Variables**:
  - `MONGO_URI`: MongoDB connection string.
  - `JWT_SECRET`: Secret key for JWT token generation.
  - `AWS_ACCESS_KEY`, `AWS_SECRET_KEY`: AWS credentials for S3 and SES.
  - `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`: Razorpay API keys.

- **Templates**:
  - Email templates are located in `src/config/`.

---

## Docker Support

1. Build the Docker image:
   ```bash
   docker build -t shiksha-dost-backend .
   ```

2. Run the Docker container:
   ```bash
   docker run -p 3000:3000 shiksha-dost-backend
   ```

---

## Deployment

The application is configured for deployment using GitHub Actions. The workflow file is located at `.github/workflows/Deploy-Backend.yml`.

---

## API Documentation

API documentation is available at [API Docs](#) (link to be added).

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeatureName`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeatureName`).
5. Open a pull request.

---

## License

This project is licensed under the **ISC License**. See the [LICENSE](LICENSE) file for details.

---

**Author**: Harmeet Singh  
**GitHub**: [Harmeet10000](https://github.com/Harmeet10000)  
**Issues**: [Report an Issue](https://github.com/Harmeet10000/Shiksha-Dost-Backend/issues)  
**Homepage**: [Shiksha Dost Backend](https://github.com/Harmeet10000/Shiksha-Dost-Backend)