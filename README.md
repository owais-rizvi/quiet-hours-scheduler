# Quiet Hours Scheduler

A web application for scheduling and managing quiet hours with user authentication and overlap prevention.

## Features

- **User Authentication**: Sign up and login with Supabase Auth
- **Quiet Hours Management**: Create, view, and delete quiet hour schedules
- **Overlap Prevention**: Prevents conflicting quiet hours from being created
- **Time Validation**: Ensures end time is after start time
- **Personalized Dashboard**: Displays user-specific quiet hours

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Authentication**: Supabase Auth
- **Database**: MongoDB
- **Backend**: Next.js API Routes

## Setup

1. **Clone the repository**
   ```bash
   git clone <https://github.com/owais-rizvi/quiet-hours-scheduler>
   cd quiet-hours-scheduler
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env.local` file with:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   MONGO_URI=your-mongodb-connection-string
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

## Usage

1. **Sign Up/Login**: Create an account or login with existing credentials
2. **Dashboard**: View personalized greeting and manage quiet hours
3. **Create Quiet Hours**: Set start and end times for your quiet periods
4. **Delete Quiet Hours**: Remove unwanted schedules with the delete button

## API Endpoints

- `POST /api/signup` - User registration
- `POST /api/login` - User authentication
- `GET /api/quiet-hours` - Fetch user's quiet hours
- `POST /api/quiet-hours` - Create new quiet hours
- `DELETE /api/quiet-hours?id={id}` - Delete quiet hours



