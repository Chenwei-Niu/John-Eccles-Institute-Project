// userController.
const { spawn } = require('child_process');
const {pool} = require('../models/db'); // 使用你的数据库连接配置
const path = require('path');

const insertUser = async (req, res) => {
  try {
    console.log(req.body)
    const { email, name, organization, interest } = req.body;

    // 验证邮箱是否存在
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

    // 在数据库中插入用户数据
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
          const result = await pool.query('SELECT * FROM recipient');
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
      // 调用 Python 脚本进行查询
      const pythonProcess = spawn('python', [path.join(__dirname,'interests_lookup.py')]);
  
      pythonProcess.stdout.on('data', (data) => {
        const result = data.toString().trim();
        // 处理查询结果，可以返回给前端或执行其他操作
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
  

module.exports = {
  insertUser,
  fetchUserData,
  deleteUser,
  fetchInterets,
  updateUser
};
