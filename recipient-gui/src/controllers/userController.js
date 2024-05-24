// userController.
const { spawn } = require('child_process');
const {pool} = require('../models/db');
const path = require('path');
const multer = require('multer');
const xlsx = require('xlsx');
const __script_dir = "python_scripts";

const insertUser = async (req, res) => {
  try {
    console.log(req.body)
    const { email, name, organization, interest } = req.body;

    // Verify that the email address exists
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    // process interest from text to text array
    var interestArray = []
    if (interest.length != 0){
        interestArray = interest.split(',');
    } else {
        interestArray = '{}';
    }

    // Insert user data into database
    const result = await pool.query(
      'INSERT INTO recipient (email, name, organization, interest, is_recipient) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [email, name, organization, interestArray , true]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error inserting user, please check the details again', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateUser = async (req, res) => {
    try {
        console.log(req.body)
        const { email, name, organization, interest } = req.body;

        // process interest from text to text array
        var interestArray = []
        if (interest.length != 0 && typeof interest === 'string'){
            interestArray = interest.split(',');
        }else {
            interestArray = '{}';
        }
    
        // update user information in database
        const result = await pool.query(
            'UPDATE recipient SET email = $2, name = $3, organization = $4, interest = $5, is_recipient = $6 WHERE email = $1 RETURNING *',
            [email, email, name, organization, interestArray, true]
        );
    
        res.json(result.rows[0]);
      } catch (error) {
        console.error('Error inserting user, please check the details again', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}

const fetchUserData = async (req, res) => {
    {
        try {
          const result = await pool.query('SELECT * FROM recipient ORDER BY recipient.id');
          res.json(result.rows);
        } catch (error) {
          console.error('Error querying database', error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

const deleteUser = async (req, res) => {
    {
        const id = req.body.id;
        try {
          const result = await pool.query('DELETE FROM recipient WHERE id = $1 RETURNING *',[id]);
          res.json(result.rows[0]);
        } catch (error) {
          console.error('Error querying database', error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

const fetchInterets = async (req, res) => {
    try {
      // Call Python script to query
      const pythonProcess = spawn('python', [path.join(__dirname,__script_dir,'interests_lookup.py'), "recipient"]);
  
      pythonProcess.stdout.on('data', (data) => {
        const result = data.toString().trim();
        // Process query results, which can be returned to the front end or perform other operations
        res.json({ message: 'Interests fetched successfully', result });
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

// Define the uploading directory and filename
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname,'../../../static/recipient_list')); // set the storage directory
  },
  filename: function (req, file, cb) {
    cb(null, 'uploaded_recipients_info.xlsx'); // set the filename
  }
});
const upload = multer({ storage: storage });

// helper function: insert multiple recipients into database from a JSON file
async function insertRecipientFromJSON(data){
  const client = await pool.connect(); // keep the connection to avoid wastage of computational resources
  const failedRecords = [];
  try {
    for (const record of data) {
      const { name, email, organization, interest } = record;

      // check if email exists in this JSON record
      if (!email || !email.toString().includes("@")) {
        let errorMessage = `This record's Email is missing or invalid，gonna skip this record`;
        console.log(errorMessage);
        failedRecords.push({...record, msg:errorMessage});
        continue;
      }
      // check if name exists in this JSON record
      if (!name) {
        let errorMessage = `This record's Name is missing，gonna skip this record`;
        console.log(errorMessage);
        failedRecords.push({...record, msg:errorMessage});
        continue;
      }
      // check if organization exists in this JSON record
      if (!organization) {
        let errorMessage = `This record's Organization is missing，gonna skip this record`;
        console.log(errorMessage);
        failedRecords.push({...record, msg:errorMessage});
        continue;
      }
      // check if email exists in the database
      const emailExists = await isEmailExists(email);
      if (emailExists) {
        let errorMessage = `Email ${email} is already in the database，gonna skip this record`;
        console.log(errorMessage);
        failedRecords.push({...record, msg:errorMessage})
        continue;
      }

      // process interest from text to text array
      var interestArray = []
      if (interest && interest.length != 0){
          interestArray = interest.split(',');
      } else {
          interestArray = '{}';
      }

      // Insert data
      const query = 'INSERT INTO recipient (name, email, organization, interest, is_recipient) VALUES ($1, $2, $3, $4, $5)';
      const values = [name, email, organization, interestArray, true];
      await client.query(query, values);
      console.log(`Inserted：${name}, ${email}, ${organization}, ${interest}`);
    }
  } finally {
    client.release();
  }
  return failedRecords;
}

// Helper Function: Check if Email already exists in Database
async function isEmailExists(email) {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM recipient WHERE email = $1', [email]);
    return result.rows[0].count > 0;
  } catch (error) {
    console.error('Error querying database', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const insertUserInBulk = (req, res) => {
  upload.single('file')(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      // Multer error
      res.status(400).send({ message: 'Multer error' });
    } else if (err) {
      // other error
      res.status(500).send({ message: 'other error' });
    } else if (req.file == null){
      res.status(500).send({ message: 'No file was selected' });
    } else {
      // Read from the uploaded file
      const workbook = xlsx.readFile(req.file.path);
      const sheetName = workbook.SheetNames[0]; // Select the first worksheet in Excel
      const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

      // Deposit of data in databases
      const failedRecords = await insertRecipientFromJSON(data).catch(err => console.error('Database operation failed:', err));

      // Return response
      res.send({ message: 'Bulk Insertion finished', data, failedRecords });
    }
  });
};

module.exports = {
  insertUser,
  fetchUserData,
  deleteUser,
  fetchInterets,
  updateUser,
  insertUserInBulk,
};
