const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const sqlite3 = require('sqlite3').verbose();

// Using middleware since using different port for frontend & backend
app.use(cors());
app.use(bodyParser.json());

/* Connecting to the database */
const db = new sqlite3.Database("./database.db", sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error(err.message);
        process.exit(1);
        
    } 
    console.log('Connected to the database');

    /* Username table for login/registration */
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            username TEXT UNIQUE,
            password TEXT
        )
    `, (err) => {
        if (err) {
            console.error('Error creating user table:', err.message);
            process.exit(1);
        }
    });

    /* Table to log what sprint the team is in */
    db.run(`
    CREATE TABLE IF NOT EXISTS sprints (
        id INTEGER PRIMARY KEY,
        sprint_num INTEGER,
        start_date DATE,
        end_date DATE
    )
`, (err) => {
    if (err) {
        console.error('Error creating sprints table:', err.message);
        process.exit(1);
    }
});


    /* Creating  table (success/challenge) if it does not already exist */
    db.run(`
        CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY,
            comment TEXT,
            outcome TEXT,
            votes INTEGER DEFAULT 0,
            replies TEXT, 
            sprint_id INTEGER REFERENCES sprints(id)
        )
    `, (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
            process.exit(1);
        }
    });

    /* Creating emotion tracking table if it does not already exist */
    db.run(`
        CREATE TABLE IF NOT EXISTS emotion_counts (
            id INTEGER PRIMARY KEY,
            emote TEXT UNIQUE,
            count INTEGER DEFAULT 0,
            sprint_id INTEGER REFERENCES sprints(id)
        )
    `, (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
            process.exit(1);
        }
    });

    /* Creating score count table for the p4 emotion tracking (if it does not already exist) */
    db.run(`
        CREATE TABLE IF NOT EXISTS score_counts (
            score INTEGER PRIMARY KEY,
            count INTEGER DEFAULT 0,
            sprint_id INTEGER REFERENCES sprints(id)
        )
    `, (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
            process.exit(1);
        }
    });

    /* Creating suggestion (next steps) table if it does not already exist */
    db.run(`
        CREATE TABLE IF NOT EXISTS suggestions (
            id INTEGER PRIMARY KEY,
            suggestion TEXT,
            votes INTEGER DEFAULT 0,
            sprint_id INTEGER REFERENCES sprints(id)
        )
    `, (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
            process.exit(1);
        }
    });
});


/* START OF USER TABLE HANDLING */

/* Inserting user+pass to table when user registers*/

app.post('/api/register', (req, res) => {
    const { username, password } = req.body;

    db.run(
        'INSERT INTO users (username, password) VALUES (?,?)',
        [username, password],
        function (err) {
            if(err) {
                console.error('Error adding user:', err.message);
                return res.status(500).json({ error: 'Internal Server Error'});
            }
            res.json({
                success:true,
                message: 'User added successfully',
                userId: this.lastID,
            });
        }
    );
})

/* Validating username + pass for login */
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
        if (err) {
            console.error('Login error:', err.message);
            return res.status(500).json({
                success: false,
                message: 'Login failed',
            });
        }
        // Checking if user exists in table
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid user',
            });
        }
        // Checking if password is correct
        if (password !== user.password) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials',
            });
        }
   
        res.json({
            success: true,
            message: 'Login successful',
        });
    });
});


/* START OF SPRINT LOGGING HANDLING */
app.post('/api/sprints', (req, res) => {
    const { sprint_num, start_date, end_date } = req.body;
  
    // Insert the sprint into the table
    db.run(
      'INSERT INTO sprints (sprint_num, start_date, end_date) VALUES (?, ?, ?)',
      [sprint_num, start_date, end_date], 
      function (err) {
        if (err) {
          console.error('Error adding sprint:', err.message);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
  
        res.json({
          success: true,
          message: 'sprint added successfully',
          commentId: this.lastID,
        });
      }
    );
});

/* Fetches sprints */
app.get('/api/sprints', (req, res) => {
    db.all('SELECT * FROM sprints', (err, sprints) => {
        if (err) {
            console.error('Error fetching sprints:', err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json(sprints);
    });
});


/* START OF COMMENT TABLE HANDLING */

/* Fetches inputted comments from Page1 to add to the table */
app.post('/api/comments', (req, res) => {
    const { comment, outcome, votes, reply, sprint_id } = req.body;
  
    // Insert the comment into the comments table
    db.run(
      'INSERT INTO comments (comment, outcome, votes, replies, sprint_id) VALUES (?, ?, ?, ?, ?)',
      [comment, outcome, votes, reply, sprint_id],
      function (err) {
        if (err) {
          console.error('Error adding comment:', err.message);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
  
        res.json({
          success: true,
          message: 'Comment added successfully',
          commentId: this.lastID,
        });
      }
    );
  });
  



app.get('/api/comments', (req, res) => {
    // Fetch the most recent sprint
    db.get('SELECT * FROM sprints ORDER BY sprint_num DESC LIMIT 1', (err, currentSprint) => {
        if (err) {
            console.error('Error fetching most recent sprint:', err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        // Fetch comments for the most recent sprint
        db.all('SELECT * FROM comments WHERE sprint_id = ?', [currentSprint.id], (err, comments) => {
            if (err) {
                console.error('Error fetching comments:', err.message);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            res.json(comments);
        });
    });
}); 


/* To update vote count when a user votes */
app.post('/api/votes', (req, res) => {
    const { outcome, comment, votes } = req.body;
  
    if (!comment || !outcome || votes === undefined) {
        return res.status(400).json({ error: 'Comment, outcome & votes required' });
    }
   
    const key = `${outcome}_${comment}`;
    db.run('UPDATE comments SET votes = ? WHERE outcome = ? AND comment = ?',
      [votes, outcome, comment], function (err) {
        if (err) {
          console.error('Error updating votes', err.message);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
  
        res.json({
          success: true,
          message: 'Votes updated successfully',
        });
      });
});


/* Gets the correct count for each comment so that it can be displayed */
app.get('/api/votes/:outcome/:comment', (req, res) => {
    const { outcome, comment } = req.params;

    if (!comment || !outcome) {
        return res.status(400).json({ error: 'Comment and outcome are required' });
    }

    const key = `${outcome}_${comment}`;
    
    // Fetch votes from the database
    db.get('SELECT votes FROM comments WHERE outcome = ? AND comment = ?', [outcome, comment], (err, row) => {
        if (err) {
            console.error('Error fetching votes', err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (!row) {
            return res.status(404).json({ error: 'Votes not found' });
        }
        res.json({ votes: row.votes });
    });
});
 
app.post('/api/comments/replies', (req, res) => {
    const { comment, outcome, reply } = req.body;
    
    if (!comment || !outcome || !reply) {
        return res.status(400).json({ error: 'Comment, outcome, and reply are required' });
    }
    const key = `${outcome}_${comment}`;
    db.run(
        `
        INSERT INTO comments (comment, outcome, replies) VALUES (?, ?, ?)
        ON CONFLICT(comment, outcome) DO UPDATE SET replies = ?
        `,
        [comment, outcome, reply, reply],
        function (err) {
            if (err) {
                console.error('Error adding or updating reply:', err.message);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            res.json({
                success: true,
                message: 'Reply added successfully',
            });
        }
    );
});



/* START OF EMOTION TRACKING HANDLING */
/* Fetches and handles the emotion submissions */
app.post('/api/emotions', (req, res) => {
    const { emote } = req.body;
  
    db.run(
      `
      INSERT INTO emotion_counts (emote, count)
      VALUES (?, 1)
      `,
      [emote],
      function (err) {
        if (err) {
          console.error('Error updating emotion count:', err.message);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
  
        res.json({
          success: true,
          message: 'Emotion count updated successfully',
        });
      }
    );
  });
  
  

/* Gets all emotion counts from the  table */
app.get('/api/emotions', (req, res) => {
    db.all('SELECT * FROM emotion_counts', (err,emotions) => {
        if (err) {
            console.error('Error fetching emotions, err.message');
            res.status(500).json({ error: 'Internal Sever Error' });
        } else {
            res.json(emotions);
        }
    });
});

/* Fetches and handles the score submissions */
app.post('/api/scores', (req, res) => {
    const { score } = req.body;

    db.run(`
        INSERT INTO score_counts (score, count)
        VALUES (?, 1)
        ON CONFLICT(score) DO UPDATE SET count = count + 1
    `, [score], function (err) {
        if (err) {
            console.error('Error updating score count:', err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        
        res.json({
            success: true,
            message: 'Score submitted successfully',
        });
    });
});

/* Gets all the score counts from the score table*/
app.get('/api/scores', (req, res) => {
    db.all('SELECT * FROM score_counts', (err,scores) => {
        if (err) {
            console.error('Error fetching scores:', err.message);
            res.status(500).json({ error: 'Internal Sever Error' });
        } else {
            res.json(scores);
        }
    });
});

/* START OF SUGGESTION HANDLING */
/* Insert suggestion into table */
app.post("/api/nextsteps", (req, res) => {
    const { suggestion, votes, sprint_id } = req.body;

    db.run(
        'INSERT INTO suggestions (suggestion, votes, sprint_id) VALUES (?, ?, ?)',
        [suggestion, votes, sprint_id],
        function (err) {
            if (err) {
                console.error('Error adding suggestion', err.message);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            res.json({
                success: true,
                message: 'Suggestion added successfully',
                suggestionId: this.lastID,
            });
        }
    );
});


/* Fetching all suggestions */
app.get('/api/nextsteps', (req, res) => {
    db.get('SELECT * from sprints ORDER BY sprint_num DESC LIMIT 1', (err, currentSprint) => {
        if (err) {
            console.error('Error fetching most recent sprint', err.message);
            return res.status(500).json({ error: 'Internal Server Error'})
        }
    db.all('SELECT * FROM suggestions WHERE sprint_id =?', [currentSprint.id], (err,suggestions) => {
        if (err) {
            console.error('Error fetching suggestions', err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } 
        res.json(suggestions);
        });
    });
});

/* Update vote count of suggestions */
app.post('/api/sugg_votes', (req, res) => {
    const { suggestion, votes } = req.body;
  
    if (!suggestion || votes === undefined) {
        return res.status(400).json({ error: 'Suggestion & votes required' });
    }
  
    db.run('UPDATE suggestions SET votes = ? WHERE suggestion = ?',
      [votes, suggestion], function (err) {
        if (err) {
          console.error('Error updating votes', err.message);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json({
          success: true,
          message: 'Votes updated successfully',
        });
      });
});

/* Gets the correct vote count for each suggestion*/
app.get('/api/sugg_votes/:suggestion', (req, res) => {
    const { suggestion } = req.params;

    if (!suggestion) {
        return res.status(400).json({ error: 'Suggestion required' });
    }

    // Fetch votes from the database
    db.get('SELECT votes FROM suggestions WHERE suggestion = ?', [suggestion], (err, row) => {
        if (err) {
            console.error('Error fetching votes', err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (!row) {
            return res.status(404).json({ error: 'Votes not found' });
        }
        res.json({ votes: row.votes });
    });
});

/* To delete suggestions from display page */
app.delete('/api/nextsteps/:suggestion', (req, res) => {
    const { suggestion } = req.params;
  
    if (!suggestion) {
        return res.status(400).json({ error: 'Suggestion required' });
    }
    
    db.run('DELETE FROM suggestions WHERE suggestion = ?', [suggestion], function (err) {
        if (err) {
            console.error('Error deleting suggestion', err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
  
        res.json({ success: true, message: 'Suggestion deleted successfully' });
    });
});

  

// Root path route handler
app.get('/', (req, res) => {
    res.send('Hello, World!');
});


app.listen(4000, () => {
    console.log('Server started on port 4000');
});