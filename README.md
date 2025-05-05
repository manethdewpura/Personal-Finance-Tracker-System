# Personal Finance Tracker System

A robust REST API backend for managing personal finances with advanced features for tracking expenses, income, budgets, and financial goals.

## Features

- **User Management**
  - Secure authentication with JWT
  - Role-based access control (User/Admin)
  - Customizable user profiles with preferred currency

- **Transaction Management**
  - Track income and expenses
  - Categorize transactions
  - Support for recurring transactions
  - Multi-currency support with automatic conversion
  - Attach tags for better organization

- **Budget Management**
  - Create monthly budgets by category
  - Track spending against budgets
  - Receive notifications when approaching budget limits
  - Historical budget tracking

- **Financial Goals**
  - Set savings goals
  - Track progress towards goals
  - Automatic monthly contributions
  - Goal completion notifications

- **Reporting**
  - Generate financial reports
  - Track income, expenses, and savings
  - Historical data analysis

- **Security Features**
  - API rate limiting
  - XSS protection
  - CORS configuration
  - Helmet security headers
  - Input validation

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Winston Logger
- Jest for Testing

## Setup Instructions

1. Clone the repository
2. Run the command `npm install` to install the dependencies
3. Create a `.env` file with the following variables:
   ```
   PORT=3030
   MONGO_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   EXCHANGERATE=https://api.exchangerate-api.com/v4/latest/
   ALLOWED_ORIGINS=http://localhost:3000
   ```
4. Run the command `npm run dev` to start the server
5. The server will start at `http://localhost:3030`

## Testing

- Unit Tests: Run `npm test`

## API Documentation

The API includes the following main endpoints:

- `/api/auth` - Authentication routes (register, login)
- `/api/transactions` - Transaction management
- `/api/budgets` - Budget management
- `/api/goals` - Financial goals
- `/api/categories` - Transaction categories
- `/api/tags` - Transaction tags
- `/api/notifications` - User notifications
- `/api/reports` - Financial reports

All protected routes require a valid JWT token in the Authorization header.

## Error Handling

The system includes comprehensive error handling with:
- Detailed error messages
- Error logging with Winston
- HTTP status codes
- Request validation

## Monitoring

- Daily rotating log files for info, warnings, and errors
- Performance monitoring with Artillery
- Detailed transaction logs