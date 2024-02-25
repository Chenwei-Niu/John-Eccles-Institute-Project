// presenterController.
const { spawn } = require('child_process');
const {pool} = require('../models/db'); // 使用你的数据库连接配置
const path = require('path');

const insertPresenter = async (req, res) => {
  try {
    console.log(req.body)
    const { name, organization, google_scholar_id, interest } = req.body;

    // process interest from text to text array
    var interestArray = []
    if (interest.length != 0){
        interestArray = interest.split(',');
    } else {
        interestArray = '{}';
    }

    // 在数据库中插入用户数据
    const result = await pool.query(
      'INSERT INTO scholar ( name, organization, google_scholar_id, interest) VALUES ($1, $2, $3, $4) RETURNING *',
      [ name, organization, google_scholar_id, interestArray]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error inserting presenter, please check the details again', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updatePresenter = async (req, res) => {
    try {
        console.log(req.body)
        const { name, organization, google_scholar_id, interest } = req.body.formData;
        const id = req.body.id;
        // process interest from text to text array
        var interestArray = []
        if (interest.length != 0 && typeof interest === 'string'){
            interestArray = interest.split(',');
        }else {
            interestArray = '{}';
        }
    
        // update user information in database
        const result = await pool.query(
            'UPDATE scholar SET name = $2, organization = $3, google_scholar_id = $4, interest = $5 WHERE id = $1 RETURNING *',
            [id, name, organization, google_scholar_id, interestArray]
        );
    
        res.json(result.rows[0]);
      } catch (error) {
        console.error('Error inserting user, please check the details again', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}

const fetchPresenterData = async (req, res) => {
    {
        try {
          const result = await pool.query('SELECT * FROM scholar');
          res.json(result.rows);
        } catch (error) {
          console.error('Error querying database', error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

const deletePresenter = async (req, res) => {
    {
        const id = req.body.id;
        try {
          const result = await pool.query('DELETE FROM scholar WHERE id = $1 RETURNING *',[id]);
          res.json(result.rows[0]);
        } catch (error) {
          console.error('Error querying database', error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}
  

module.exports = {
  fetchPresenterData,
  deletePresenter,
  updatePresenter,
  insertPresenter
};
