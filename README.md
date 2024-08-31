
# FSO Phonebook Project - Backend
  
- Front-end repo: https://github.com/eduvergara/FullStackOpen/tree/main/part2/phonebook
- Live app: https://fso-part3-phonebook-backend-e0so.onrender.com/

Note: When first accessing the Live app, you may experience a delay of approximately 50 seconds for the initial data requests. This delay occurs because free web services instances hosted on Render.com’s free tier,  will spin down with inactivity. As a result, the first request to the server after it has been inactive triggers a "cold start," causing the slow response time.

# Phonebook Backend

This project is the backend for a phonebook application built using Node.js, Express, and MongoDB.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Folder Structure](#folder-structure)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Error Handling](#error-handling)

## Overview

The Phonebook Backend manages a database of contacts with their names and phone numbers. It provides an API to interact with the data, including adding, updating, retrieving, and deleting contacts.

## Features

- CRUD operations for contacts.
- Validation to ensure unique names and phone numbers.
- Custom error handling for different error cases.
- Middleware for logging requests.
- MongoDB integration using Mongoose.

## Installation

1. Clone the repository:

```
git clone https://github.com/eduvergara/FSO-part3-phonebook-backend.git
cd FSO-part3-phonebook-backend
```
  
2. Install dependencies:

```
npm install

```

## Folder Structure

```
── project-root/
   ├── dist/
   │   └── ...                 # Frontend build files
   ├── models/
   │   └── person.js           # Mongoose schema for the Person model
   ├── index.js                # Main entry point of the backend application
   ├── .env                    # Environment variables (MongoDB URI)
   ├── package.json            # Project metadata and dependencies
   └── ...                     # Other folders/files specific to the backend project
```

## Usage

1. Create a .env file in the root directory with the following content:

```  
PORT=3001
MONGO_URI=your_mongo_db_uri_here
```

 2. Start the development server:
 
```
 npm run dev
```

  3. Start the production server:

```
npm start
```
  
## API Endpoints

- GET /api/persons          Fetch all contacts.
- GET /api/persons/:id      Fetch a contact by ID.
- POST /api/persons         Add a new contact.
- PUT /api/persons/:id      Update a contact.
- DELETE /api/persons/:id   Delete a contact.

## Environment Variables

- PORT: The port on which the server runs. Defaults to 3001.
- MONGO_URI: The connection string for MongoDB.

## Scripts

- start: Runs the server in production mode.
- dev: Runs the server in development mode with nodemon.
- build:ui: Builds the frontend UI and copies it to the backend.
- deploy:full: Builds the UI and pushes the latest commit to the main branch.
- lint: Runs ESLint to check for linting errors.

## Error Handling

The application uses custom error handling middleware to manage different errors:

- Validation Errors: When data doesn't meet the required schema.
- Duplicate Phone Number: When trying to add a contact with an existing phone number.
- Person Not Found: When trying to update or delete a non-existent contact.
- Person Already Deleted: When trying to delete an already deleted contact.
- Unknown Endpoint: For requests made to non-existent routes.