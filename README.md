# Frontend - Challenge

This repository contains the frontend for the Angular Academy 2025 challenge. It consumes the backend API to manage users, sessions, and metrics.

## Implemented Features

### Authentication and Security
- User Registration: Reactive form (using ReactiveForms) with validations:
  - Email format.
  - Password complexity (minimum 8 characters and 1 number).
  - Matching password confirmation.
- Login: User authentication and JWT storage in localStorage.
- Route Guards: Route protection (`/dashboard`) that redirects to login if no valid session exists.
- HTTP Interceptor: Automatic injection of the Bearer token in all API requests.

### Dashboard and Data

- Personal Metrics: Visualization of user data (Total logins, Last access) all obtained from the `/me` endpoint.
- Admin Panel: Section displayed only if the user has the admin role, showing global system metrics and personal admin metrics.

## Installation and Execution Guide

1. Prerequisites

- Node.js (v18 or higher)
- Angular CLI installed globally:

```
npm install -g @angular/cli
```
The Backend must be running on port 3000 (see the backend repository).

2. Install Dependencies
Run:
```
npm install
```
3. Environment Configuration
Verify that the `src/environments/environment.ts` file points to the local backend (HTTP, not HTTPS):
```
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```
4. Run the Application
To start the server:
```
ng serve -o
```
The `-o` flag automatically opens the browser.

You can also use `npm start`

The app should run at `http://localhost:4200`