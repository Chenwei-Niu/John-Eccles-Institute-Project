const path = require('path');
const { spawn } = require('child_process');
const __script_dir = "python_scripts";

const generateEmail = async (req, res) => {
    try {
      // Call Python script to query
      const pythonProcess = spawn('python', [path.join(__dirname,__script_dir,'email_verify.py')]);
  
      pythonProcess.stdout.on('data', (data) => {
        const result = data.toString().trim();
        // Process query results, which can be returned to the front end or perform other operations
        res.json({ message: 'Email generates successfully', result });
      });
  
      pythonProcess.stderr.on('data', (data) => {
        console.error(`Error in Python script: ${data}`);
        res.status(500).json({ error: 'Internal Server Error' });
      });
  
      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          res.status(500).json({ error: 'Internal Server Error' });
        }
      });
    } catch (error) {
      console.error('Error fetching interests', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
};

const sendEmail = async (req, res) => {
  try {
    // Call Python script to query
    const pythonProcess = spawn('python', [path.join(__dirname,__script_dir,'send_emails.py')]);

    pythonProcess.stdout.on('data', (data) => {
      const result = data.toString().trim();
      // Process query results, which can be returned to the front end or perform other operations
      res.json({ message: 'Send Emails', result });
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Error in Python script: ${data}`);
      res.status(500).json({ error: 'Internal Server Error' });
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });
  } catch (error) {
    console.error('Error fetching interests', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  generateEmail,
  sendEmail
}