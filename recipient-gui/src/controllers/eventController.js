// eventController.
const { spawn } = require('child_process');
const {pool} = require('../models/db'); // 使用你的数据库连接配置
const path = require('path');
const __script_dir = "python_scripts";

const insertEvent = async (req, res) => {
  try {
    console.log(req.body)
    const { title, speaker, date, venue, description, keywords, url } = req.body;

    // verify whether or not the presenter id is valid
    try {
        const result = await pool.query('SELECT * FROM event WHERE speaker = $1', [speaker]);
        res.json(result.rows);
      } catch (error) {
        console.error('Error querying database', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }

    // get the standard format datetime from date
    const pythonProcess = spawn('python', [path.join(__dirname,__script_dir,'format_datetime.py'), date]);

    // Monitor and listen the standard ouput of Python Script
    pythonProcess.stdout.on('data', async (standard_datetime) => {
      console.log(`Output is：${standard_datetime}`);
      // insert
      const result = await pool.query(
        'INSERT INTO event ( title, speaker, date, venue, description, keywords, url, is_seminar, standard_datetime) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
        [ title, speaker, date, venue, description, keywords, url, true, standard_datetime.toString()]
      );

      res.json(result.rows[0]);
    });
    

  } catch (error) {
    console.error('Error inserting Event, please check the details again', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateEvent = async (req, res) => {
    try {
        console.log(req.body)
        const { title, speaker, date, venue, description, keywords, url, is_seminar } = req.body.formData;
        const id = req.body.id;
        // // verify the existence of speaker
        // try {
        //     const result = await pool.query('SELECT * FROM scholar WHERE id = $1', [speaker]);
        //   } catch (error) {
        //     console.error('Error querying database', error);
        //     res.status(500).json({ error: 'Internal Server Error' });
        // }

        // get the standard format datetime from date
        const pythonProcess = spawn('python', [path.join(__dirname,__script_dir,'format_datetime.py'), date]);

        // Monitor and listen the standard ouput of Python Script
        pythonProcess.stdout.on('data', async (standard_datetime) => {
          console.log(`Output is：${standard_datetime}`);
          standard_datetime = standard_datetime.toString();
          // update event information in database
          const result = await pool.query(
            'UPDATE event SET title = $2, speaker = $3, date = $4, venue = $5,description = $6, keywords = $7, url = $8, is_seminar = $9, standard_datetime = $10 WHERE id = $1 RETURNING *',
            [id, title, speaker, date, venue, description, keywords, url, is_seminar.toString(), standard_datetime]
        );

        res.json(result.rows[0]);
        });
        
      } catch (error) {
        console.error('Error inserting event, please check the details again', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}

const fetchEventData = async (req, res) => {
    {
        try {
          const result = await pool.query('SELECT event.id,event.title,scholar.name,event.speaker,event.date,event.venue,event.description,event.keywords,event.url,event.is_seminar FROM event JOIN scholar ON event.speaker = scholar.id ORDER BY event.id');
          res.json(result.rows);
        } catch (error) {
          console.error('Error querying database', error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

const deleteEvent = async (req, res) => {
    {
        const id = req.body.id;
        try {
          const result = await pool.query('DELETE FROM event WHERE id = $1 RETURNING *',[id]);
          res.json(result.rows[0]);
        } catch (error) {
          console.error('Error querying database', error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}
  

module.exports = {
  fetchEventData,
  deleteEvent,
  updateEvent,
  insertEvent
};
