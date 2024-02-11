const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const util = require('util');
const fs = require('fs').promises;
const multer = require('multer');
const app = express();
const port = 3000;
const cors = require('cors');
const execAsync = util.promisify(exec);
app.use(cors());  

const corsOptions = {
  origin: 'http://localhost:5173', // Replace with your React application's origin
  methods: 'POST',
};

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/encode', cors(corsOptions), upload.single('file'), async (req, res) => {
    try {
        // Save the provided file data to a temporary file
        const tempFilePath = path.join(__dirname, 'tempFile.txt');
        await fs.writeFile(tempFilePath, req.file.buffer);

        const executablePath = path.join(__dirname, 'encode'); // Assuming 'encode' is in the same directory as this script
        const { stdout, stderr } = await execAsync(`"${executablePath}" "${tempFilePath}" compressed.txt`);

        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);

        // Send the compressed file as a response
        const compressedFilePath = path.join(__dirname, 'compressed.txt');
        const compressedFileData = await fs.readFile(compressedFilePath);
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', 'attachment; filename=compressed.txt');
        res.send(compressedFileData);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/decode', cors(corsOptions), upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            throw new Error('No file provided');
        }
        // Save the provided file data to a temporary file
        const tempFilePath = path.join(__dirname, 'tempFile.txt');
        await fs.writeFile(tempFilePath, req.file.buffer);

        const executablePath = path.join(__dirname, 'decode'); // Assuming 'decode' is in the same directory as this script
        const { stdout, stderr } = await execAsync(`"${executablePath}" "${tempFilePath}" output.txt`);

        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);

        // Send the decoded file as a response
        const decodedFilePath = path.join(__dirname, 'output.txt');
        const decodedFileData = await fs.readFile(decodedFilePath);
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', 'attachment; filename=output.txt');
        res.send(decodedFileData);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
