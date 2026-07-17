# Postbook

Postbook is a full-stack social posting application where users can register, log in, create posts, edit posts, like or unlike posts, and upload a profile image.

The project uses server-side rendering with EJS, authentication with JWT cookies, and MongoDB for data persistence.

## Features

- User registration with hashed passwords (bcrypt)
- User login and logout
- JWT-based authentication using cookies
- Create, edit, and view posts
- Like and unlike posts
- Profile page with user details and post history
- Profile image upload with Multer
- Public feed page to browse all posts
- Modern UI built with EJS templates and Tailwind-based styling

## Tech Stack

- Backend: Node.js, Express.js
- View Engine: EJS
- Database: MongoDB with Mongoose
- Authentication: JWT, cookie-parser
- File Uploads: Multer
- Password Security: bcrypt
- Frontend Styling: Tailwind CSS + custom CSS

## Project Structure

.
|- app.js
|- package.json
|- config/
|  |- configmulter.js
|- models/
|  |- user.js
|  |- post.js
|- public/
|  |- images/uploads/
|  |- stylesheet/
|- views/
|  |- index.ejs
|  |- login.ejs
|  |- profile.ejs
|  |- profileupload.ejs
|  |- edit.ejs
|  |- allpost.ejs

## Prerequisites

- Node.js 18+
- npm
- MongoDB running locally on default port

## Getting Started

1. Clone the repository.
2. Install dependencies:

	npm install

3. Ensure MongoDB is running locally.
4. Start the server:

	node app.js

5. Open your browser and visit:

	http://localhost:3000

## Available Routes

### Public Routes

| Method | Route | Description |
|---|---|---|
| GET | / | Registration page |
| POST | /register | Register a new user |
| GET | /login | Login page |
| POST | /login | Authenticate user |
| GET | /allpost | View all posts |

### Authenticated Routes

| Method | Route | Description |
|---|---|---|
| GET | /profile | User profile page |
| GET | /logout | Log out current user |
| POST | /post | Create a new post |
| GET | /like/:id | Like or unlike a post |
| GET | /edit/:id | Edit post page |
| POST | /edit/:id | Update post content |
| GET | /upload | Profile image upload page |
| POST | /upload | Upload profile image |

## Data Models

### User

- username
- name
- age
- email
- password (hashed)
- profileImage (default: default.jpeg)
- posts (array of post references)

### Post

- user (reference to user)
- date
- content
- likes (array of user references)

## Security Notes

- Passwords are hashed with bcrypt before storage.
- Auth is handled using JWT stored in cookies.
- Current JWT secret is hardcoded for development.
- For production, move secrets and database connection values to environment variables.

## Current Limitations

- No centralized error handling middleware yet
- No rate limiting or brute-force protection on auth endpoints
- No automated test suite yet
- Database connection is currently hardcoded to local MongoDB

## Suggested Improvements

- Add environment variable support with dotenv
- Add validation and sanitization for all inputs
- Add unit and integration tests
- Improve API response handling for registration/login success and errors
- Add pagination for public feed and user posts

## License

This project is licensed under the ISC License.