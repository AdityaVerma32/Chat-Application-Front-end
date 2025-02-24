# How to Compile and Run the Application

## Prerequisites
1. **Download and Install Java 17**
2. **Set up MySQL Database**
   - Database name: `chatapplication`
   - MySQL port: `3307`  
   - If using a different port, update `application.properties` in the Spring Boot application.
3. **Install Node.js**
4. **Install npm**
5. **Use React with Vite**

## Configuration
### React Application
- Default port: `5173`
- If running on a different port, update `application.properties` in the Spring Boot backend.

### Spring Boot Backend
- Default port: `8080`
- If running on a different port, update the `.env` file in the React frontend.


### ENV for front end:

VITE_API_URL = http://localhost:8080