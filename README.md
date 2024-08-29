# Documentation

## Website Link

[YourHR](https://yourhr-cbvx.onrender.com/)

## API Routes Index

This index provides an overview of the main API routes for managing login, resume uploads, and user operations.


- [Login API](#api-documentation-user-login)
- [Resume Management API](#api-documentation-resume-management)
- [User Management API](#api-documentation-user-management)

---

## API Documentation: User Login

### Endpoint: `/api/login`

**Method:** POST

**Description:**  
This endpoint authenticates a user by verifying their username and password. Upon successful authentication, it generates a JWT token and returns it along with user information.

#### Request Body:
- **username** (string, required): The username of the user attempting to log in.
- **password** (string, required): The user's password.

#### Response:

- **Success Response:**
  - **Status Code:** 200 OK
  - **Body:**
    ```json
    {
      "token": "JWT_TOKEN_HERE",
      "username": "exampleUser",
      "name": "Example Name",
      "id": "USER_ID_HERE"
    }
    ```
  - **Description:** Returns the JWT token along with the user's username, name, and ID.

- **Error Response:**
  - **Status Code:** 401 Unauthorized
  - **Body:**
    ```json
    {
      "error": "invalid username or password"
    }
    ```
  - **Description:** If the username or password is incorrect, the server responds with an error message.

---

## API Documentation: Resume Management

### Base Endpoint: `/api/resume`

This API allows users to upload resumes and retrieve uploaded files.

---

### 1. **Upload Resume**

**Endpoint:** `/api/resume/upload`

**Method:** POST

**Description:**  
Allows users to upload a resume file. The file is stored on the server, and the file details are saved in the database associated with the user.

**Request Headers:**
- **Authorization:** Bearer token (JWT)

**Request Body (Form-Data):**
- **file** (file, required): The resume file to be uploaded.

#### Example Request:
```form-data
file: resume.pdf
```

**Response:**
- **Success Response:**
  - **Status Code:** 201 Created
  - **Body:**
    ```json
    {
      "message": "File uploaded successfully",
      "file": {
        "filename": "generated_filename.pdf",
        "path": "uploads/generated_filename.pdf",
        "user": "USER_ID_HERE"
      }
    }
    ```
  - **Description:** Returns a message indicating a successful upload along with file details.

- **Error Response:**
  - **Status Code:** 404 Not Found
  - **Body:**
    ```json
    {
      "error": "User not found"
    }
    ```
  - **Status Code:** 500 Internal Server Error
  - **Body:**
    ```json
    {
      "error": "File upload failed: error message"
    }
    ```

---

### 2. **Get User's Uploaded Files**

**Endpoint:** `/api/resume/files/:userId`

**Method:** GET

**Description:**  
Fetches all the uploaded files associated with a specific user.

**Request Parameters:**
- **userId** (string, required): The ID of the user whose files you want to retrieve.

**Response:**
- **Success Response:**
  - **Status Code:** 200 OK
  - **Body:**
    ```json
    [
      {
        "_id": "FILE_ID",
        "filename": "generated_filename.pdf",
        "path": "uploads/generated_filename.pdf",
        "user": "USER_ID_HERE"
      },
      ...
    ]
    ```
  - **Description:** Returns a list of files uploaded by the user.

- **Error Response:**
  - **Status Code:** 404 Not Found
  - **Body:**
    ```json
    {
      "error": "No files found for this user"
    }
    ```
  - **Status Code:** 500 Internal Server Error
  - **Body:**
    ```json
    {
      "error": "Failed to fetch file: error message"
    }
    ```

---

## API Documentation: User Management

### Base Endpoint: `/api/users`

This API allows for managing user data, including creating new users and retrieving a list of all users.

---

### 1. **Get All Users**

**Endpoint:** `/api/users`

**Method:** GET

**Description:**  
Fetches a list of all users in the system.

**Response:**
- **Success Response:**
  - **Status Code:** 200 OK
  - **Body:**
    ```json
    [
      {
        "_id": "USER_ID",
        "username": "exampleUser",
        "name": "Example Name",
        "passwordHash": "HASHED_PASSWORD",
        "__v": 0
      },
      ...
    ]
    ```
  - **Description:** Returns an array of user objects.

- **Error Response:**  
  If an error occurs while fetching the users, it would return a status code of 500 with an appropriate error message.

---

### 2. **Create New User**

**Endpoint:** `/api/users`

**Method:** POST

**Description:**  
Creates a new user with the provided username, name, and password. The password is securely hashed before saving the user to the database.

**Request Body:**
- **username** (string, required): The username for the new user.
- **name** (string, optional): The name of the new user.
- **password** (string, required): The password for the new user (must be longer than 3 characters).

#### Example Request:
```json
{
  "username": "exampleUser",
  "name": "Example Name",
  "password": "securePassword"
}
```

**Response:**
- **Success Response:**
  - **Status Code:** 201 Created
  - **Body:**
    ```json
    {
      "_id": "USER_ID",
      "username": "exampleUser",
      "name": "Example Name",
      "passwordHash": "HASHED_PASSWORD",
      "__v": 0
    }
    ```
  - **Description:** Returns the newly created user object (excluding the raw password).

- **Error Response:**
  - **Status Code:** 400 Bad Request
  - **Body:**
    ```json
    {
      "error": "Password is required and its length must be greater than 3" || "username or/and name is reuired" || "Username should be greater than 3 characters" 
    }
    ```
  - **Description:** Returns an error if the password is missing or too short.
