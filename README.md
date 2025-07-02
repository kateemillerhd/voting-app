# voting-app

A full-stack web app that allows users to create, share, vote on, and view results of polls - built with Node.js, Express, MongoDB, and vanilla HTML/CSS/JS.

## Features

- Register / Login  system (local authentication)
- Create polls with any number of options
- Share poll links with friends
- Vote on public polls (without needing to log in)
- View real-time results in chart form
- Add a new option if you don't like existing ones (authenticated users)
- See and delete your own polls
- Responsive design and clear UI

## Technologies Used

- Backend: Node.js, Express.js
- Authentication: Passport.js (LocalStrategy)
- Database: MongoDB (via mongoose)
- Frontend: Vanilla HTML/CSS/JS
- Charts: [Chart.js](https://www.chartjs.org/)

## Environment Variables

Create a `.env`   file in the root of the project with the following:

```env
SESSION_SECRET=your_secret_key
MONGO_URI=your_mongo_connection_key
