// userController.js

const {pool} = require('../models/db'); // 使用你的数据库连接配置

const insertUser = async (req, res) => {
  try {
    console.log(req.body)
    const { email, name, organization, interest } = req.body;

    // 验证邮箱是否存在
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    // process interest from text to text array
    const interestArray = interest.split(',');

    // 在数据库中插入用户数据
    const result = await pool.query(
      'INSERT INTO recipient (email, name, organization, interest, is_recipient) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [email, name, organization, interestArray || null, true]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error inserting user', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

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

module.exports = {
  insertUser,
  fetchUserData,
  deleteUser
};
