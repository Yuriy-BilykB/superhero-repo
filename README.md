# Superhero App
A full-stack superhero catalog web application with a React frontend and Node.js/Express backend using MySQL and Sequelize ORM.  
The app allows users to perform full CRUD operations on a **Superhero** entity, including image upload and cloud storage.

## Objective
Create a superhero database accessible through a web interface that supports:

- Creating, editing, and deleting superheroes
- Assigning and removing multiple images per superhero
- Listing superheroes with pagination (5 per page)
- Viewing full details of each superhero

## The Superhero Model

Each superhero contains:

- `nickname`: e.g., *Superman*
- `real_name`: e.g., *Clark Kent*
- `origin_description`: a detailed origin story
- `superpowers`: comma-separated list of powers
- `catch_phrase`: a unique quote
- `images`: multiple image files stored in Cloudinary, with URLs saved in the database

## Tech Stack

### Frontend
- React
- TypeScript
- TailwindCSS
- Vite

### Backend
- Node.js
- Express.js
- TypeScript
- MySQL
- Sequelize
- Multer (image upload)
- Cloudinary (image hosting)

  
----

## How to Run the Project
> Requires **Node.js**, **npm**, and a **MySQL database**. Ensure `.env` files are configured in `backend/`.

### 1. Clone the repository
```bash```
git clone https://github.com/Yuriy-BilykB/superhero-repo.git
cd superhero-repo

###Install dependencies

cd frontend
npm install
npm run dev -- --port 3000 

cd ../backend
npm install
npm run dev -- --port 5000

### Project Structure
│
├── frontend/        
├── backend/        
├── .gitignore
└── README.md

Assumptions
The backend runs on port 5000
The frontend runs on port 3000 
.env files are excluded from version control and contain DB credentials, Cloudinary keys, and other secrets
MySQL is used as the database with Sequelize ORM
Image uploads are handled via multer and stored on Cloudinary
Cloudinary URLs are stored in the database
The project is in development mode and is not yet optimized for production

###Testing
Unit tests are written using Jest (configured in the frontend and backend folders).
To run the tests:
cd frontend
npm test

cd backend
npm test
