// server.js
import express from 'express';
import multer from 'multer';
import { scrape } from './scrape.js'; // Assuming your provided code is in scraper.js

const app = express();
const port = 3000;

// Multer setup for handling file uploads
const upload = multer({
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Serve the static front-end files (HTML, CSS, client-side JS)
app.use(express.static('public'));

// 🖼️ The Enhancement Endpoint
app.post('/enhance', upload.single('imageFile'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const imageBuffer = req.file.buffer;

    try {
        console.log('Starting image enhancement...');
        // The core logic from your provided code
        const enhancedBuffer = await scrape(imageBuffer);

        // Set headers for the download/display
        res.setHeader('Content-Type', 'image/jpeg');
        res.setHeader('Content-Disposition', 'attachment; filename="enhanced_image.jpg"');

        // Send the enhanced image buffer back to the client
        res.send(enhancedBuffer);
        console.log('Image enhancement complete and sent.');

    } catch (error) {
        console.error('Enhancement error:', error.message);
        res.status(500).send(`Failed to enhance image. Details: ${error.message}`);
    }
});

app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});
