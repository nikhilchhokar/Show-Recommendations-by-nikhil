# Show Recommendations App

A web application for managing and recommending TV shows and movies.

## Features

- Add and manage shows
- Add recommendations
- View show details
- Filter shows by genre

## Tech Stack

- Frontend: React, Material-UI
- Backend: Node.js, Express, PostgreSQL
- Deployment: Vercel (Frontend), Railway (Backend)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/show-recommendations-app.git
cd show-recommendations-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```
REACT_APP_API_URL=http://localhost:5001/api
```

4. Start the development server:
```bash
npm start
```

## Deployment

### Frontend (Vercel)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your GitHub repository
4. Add environment variable:
   ```
   REACT_APP_API_URL=https://your-railway-backend-url.railway.app/api
   ```
5. Deploy

### Backend (Railway)

1. Push your code to GitHub
2. Go to [Railway](https://railway.app)
3. Create a new project
4. Add PostgreSQL database
5. Add environment variables:
   ```
   DATABASE_URL=postgresql://postgres:your_password@containers-us-west-XX.railway.app:XXXX/railway
   PORT=5001
   ```
6. Deploy

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
