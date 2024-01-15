const path = require('path');
const { spawn } = require('child_process');

const generateEmail = async (req, res) => {
    try {
      // 调用 Python 脚本进行查询
      const pythonProcess = spawn('python', [path.join(__dirname,'email_verify.py')]);
  
      pythonProcess.stdout.on('data', (data) => {
        const result = data.toString().trim();
        // 处理查询结果，可以返回给前端或执行其他操作
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
    // 调用 Python 脚本进行查询
    const pythonProcess = spawn('python', [path.join(__dirname,'send_emails.py')]);

    pythonProcess.stdout.on('data', (data) => {
      const result = data.toString().trim();
      // 处理查询结果，可以返回给前端或执行其他操作
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