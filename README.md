# Weather Notifier 🌤️

A Node.js application that fetches real-time weather data and sends automated notifications via email and SMS.

## Features

- 🌍 Fetches current weather data from WeatherAPI
- 📧 Sends email notifications using Nodemailer (Mailtrap)
- 📱 Sends SMS notifications using Twilio
- 📝 Logs all activities with timestamps
- 🔐 Secure credential management with environment variables

## Tech Stack

- **Runtime:** Node.js
- **Weather Data:** WeatherAPI
- **Email Service:** Nodemailer + Mailtrap
- **SMS Service:** Twilio
- **Environment Management:** dotenv

## Prerequisites

- Node.js (v12 or higher)
- npm or yarn
- Accounts for:
  - [WeatherAPI](https://www.weatherapi.com/)
  - [Mailtrap](https://mailtrap.io/)
  - [Twilio](https://www.twilio.com/)

## Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd weather-notifier
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```
   
   Fill in your credentials:
   ```env
   WEATHER_API_KEY=your_weather_api_key_here
   LOCATION=your_city_here
   
   MAILTRAP_HOST=smtp.mailtrap.io
   MAILTRAP_PORT=2525
   MAILTRAP_USER=your_mailtrap_user
   MAILTRAP_PASS=your_mailtrap_pass
   
   SENDER_EMAIL=your_sender_email@example.com
   RECIPIENT_EMAIL=recipient_email@example.com
   
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE=+1234567890
   MY_PHONE=+923000000000
   ```

## Usage

Run the application:
```bash
node script.js
```

The app will:
1. Fetch current weather data for your specified location
2. Parse temperature and weather conditions
3. Send an email notification
4. Send an SMS notification
5. Log all activities to `log.txt`

## Project Structure

```
weather-notifier/
├── .env.example       # Environment variables template
├── .gitignore         # Git ignore rules
├── script.js          # Main application code
├── package.json       # Dependencies and scripts
├── package-lock.json  # Dependency lock file
└── log.txt           # Activity logs (auto-generated)
```

## How It Works

1. **Weather Data Fetching:** Uses HTTPS to call WeatherAPI and retrieve current weather data
2. **Email Notifications:** Sends formatted weather updates via Mailtrap SMTP
3. **SMS Notifications:** Sends weather alerts using Twilio's messaging API
4. **Logging:** All activities are logged with timestamps to `log.txt`


