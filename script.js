require("dotenv").config();
const https = require("https");
const nodemailer = require("nodemailer");
const twilio = require("twilio");
const fs = require("fs");

// API URL for current weather
const weatherApiKey = process.env.WEATHER_API_KEY;
const location = process.env.LOCATION;
const weatherUrl = `https://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${encodeURIComponent(
  location
)}`;

// Mailtrap setup
const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: process.env.MAILTRAP_PORT,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

// Twilio setup
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Log messages with timestamps
function logMessage(message) {
  const timestamp = new Date().toISOString();
  const fullMessage = `[${timestamp}] ${message}\n`;
  console.log(fullMessage);
  fs.appendFile("log.txt", fullMessage, (err) => {
    if (err) console.error("Error writing log:", err);
  });
}

// Fetch weather data using HTTPS
function getWeatherData() {
  return new Promise((resolve, reject) => {
    https
      .get(weatherUrl, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (error) {
            reject(new Error("Error parsing weather data: " + error.message));
          }
        });
      })
      .on("error", (error) =>
        reject(new Error("HTTPS request failed: " + error.message))
      );
  });
}

// Extract useful weather info
function parseWeatherData(data) {
  if (!data || !data.current)
    return { temperature: "N/A", condition: "Unknown" };
  const temperature = data.current.temp_c;
  const condition = data.current.condition?.text || "Unknown";
  return { temperature, condition };
}

// Send email notification
async function sendEmail(temperature, condition) {
  const subject = `Weather Update for ${location}`;
  const textBody = `Hello!

Current weather in ${location}:
- Temperature: ${temperature}°C
- Condition: ${condition}

Have a great day!`;

  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: process.env.RECIPIENT_EMAIL,
    subject,
    text: textBody,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logMessage(`Email sent: ${info.messageId}`);
  } catch (error) {
    logMessage(`Error sending email: ${error.message}`);
  }
}

// Send SMS notification
async function sendSms(temperature, condition) {
  const messageBody = `Weather Update 🌤️
Location: ${location}
Temp: ${temperature}°C
Condition: ${condition}`;

  try {
    const message = await twilioClient.messages.create({
      body: messageBody,
      from: process.env.TWILIO_PHONE,
      to: process.env.MY_PHONE,
    });
    logMessage(`SMS sent: SID ${message.sid}`);
  } catch (error) {
    logMessage(`Error sending SMS: ${error.message}`);
  }
}

// Run notification routine
async function runNotifier() {
  logMessage("Starting weather notifier...");
  try {
    const weatherData = await getWeatherData();
    const { temperature, condition } = parseWeatherData(weatherData);
    logMessage(`Weather: ${temperature}°C, Condition: ${condition}`);

    await sendEmail(temperature, condition);
    await sendSms(temperature, condition);
  } catch (error) {
    logMessage(`Error: ${error.message}`);
  }
}

runNotifier();
