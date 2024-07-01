// server.js
const express = require('express');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use(cors());

// Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Endpoint for sending email after successful registration
app.post('/send-email', async (req, res) => {
    try {
        const { email, name } = req.body;

        // Generate unique ID (SHMS + 4 digits)
        const uniqueId = 'SHMS' + uuidv4().substr(0, 4);

        // HTML formatted email content
        const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
        <h2 style="color: coral; font-weight: bold;">Welcome to SIJGERIA HMS</h2>
        <p>Dear ${name},</p>
        <p>Thank you for registering with SIJGERIA HMS. Your unique ID is: <strong style="color: blue; font-weight: bold;">${uniqueId}</strong></p>
        <p>Please keep this ID safe for future reference.</p>
        <p>Best regards,<br/>${process.env.HOSPITAL_NAME}</p>
      </div>
    `;

        // Send email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Welcome to SHMS',
            html: htmlContent,
        });

        res.status(200).send({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send({ error: 'Failed to send email' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
