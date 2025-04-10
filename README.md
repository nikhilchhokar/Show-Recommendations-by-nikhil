# Show Recommendations App

A web application for managing and recommending TV shows and movies.

## Features

- Add and manage shows
- Add recommendations
- View show details including ratings and genres
- Delete shows and recommendations
- Responsive design

## Tech Stack

- Frontend: React, Material-UI
- Backend: Node.js, Express
- Database: PostgreSQL

## Getting Started

### Prerequisites

- Node.js
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/show-recommendations-app.git
cd show-recommendations-app
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
cd backend
npm install
```

4. Create a `.env` file in the backend directory:
```
DB_USER=your_db_user
DB_HOST=localhost
DB_NAME=show_recommendations
DB_PASSWORD=your_db_password
DB_PORT=5432
```

5. Start the development servers:
```bash
# Start backend (from backend directory)
npm run dev

# Start frontend (from root directory)
npm start
```

## Deployment

The application can be deployed using:
- Frontend: Vercel
- Backend: Railway
- Database: Railway PostgreSQL

## License

This project is licensed under the MIT License.
