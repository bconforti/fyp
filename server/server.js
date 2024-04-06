const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const sqlite3 = require('sqlite3').verbose();
const axios = require('axios');

const jiraCred = 'bcconforti@gmail.com:ATATT3xFfGF0Imb0Xrdcf8tzI0FOHpY8-MHGhmdVnRQrdmvDy7SOKGFmX30mslMhovwlozAbsoRVsq0aYkbiPN6NnOT-vHjN4oRM3oEDYF9qVe0XYvCt-5Lhk6shZX_g06ZdqPdRFVj4Z22Svt8ANXYg_qB-x3pwMVHhFcDReJdDYeOMar5WoVM=D29B4589'
const jiraURL = 'https://bcconforti.atlassian.net/'
const jiraURLS = {};


// Using middleware since using different port for frontend & backend

app.use(cors());
{/*
const corsOptions = {
    origin: 'https://youretro.netlify.app',
    optionsSuccessStatus: 200 
}
app.use(cors(corsOptions)); */}
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
            password TEXT,
            code TEXT
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


    db.run(`
        CREATE TABLE IF NOT EXISTS replies (
            id INTEGER PRIMARY KEY,
            comment_id INTEGER,
            reply TEXT,
            FOREIGN KEY (comment_id) REFERENCES comments(id)
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
            emote TEXT,
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
            id INTEGER PRIMARY KEY,
            score INTEGER ,
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

    db.run(`
        CREATE TABLE IF NOT EXISTS comment_answers (
            id INTEGER PRIMARY KEY,
            answer TEXT,
            topcomment INTEGER, 
            FOREIGN KEY (topcomment) REFERENCES comments(id) ON DELETE CASCADE
        )
    `, (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
            process.exit(1);
        }
    });

    db.run(`
        CREATE TABLE IF NOT EXISTS suggestion_answers (
            id INTEGER PRIMARY KEY,
            answer TEXT,
            topsuggestion INTEGER, 
            FOREIGN KEY (topsuggestion) REFERENCES comments(id) ON DELETE CASCADE
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
    const { username, password, code } = req.body;

    db.run(
        'INSERT INTO users (username, password, code) VALUES (?,?, ?)',
        [username, password, code],
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
          message: 'Sprint added successfully',
          sprintId: this.lastID,
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



/* Deletes comment if resolved */
app.delete('/api/comments', (req, res) => {
    const { comment, outcome } = req.body;

    db.run(
        'DELETE FROM comments WHERE comment = ? AND outcome = ?',
        [comment, outcome],
        function (err) {
            if (err) {
                console.error('Error deleting comment:', err.message);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            res.json({
                success: true,
                message: 'Comment deleted successfully',
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
    const { commentId, reply } = req.body;

    if (!commentId || !reply) {
        return res.status(400).json({ error: 'Comment ID and reply are required' });
    }

    // Insert the reply into the replies table
    db.run(
        'INSERT INTO replies (comment_id, reply) VALUES (?, ?)',
        [commentId, reply],
        function (err) {
            if (err) {
                console.error('Error adding reply:', err.message);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            res.json({
                success: true,
                message: 'Reply added successfully',
            });
        }
    );
});


app.get('/api/comments/:commentId/replies', (req, res) => {
    const { commentId } = req.params;

    // Fetches replies for the specified comment 
    db.all('SELECT * FROM replies WHERE comment_id = ?', [commentId], (err, replies) => {
        if (err) {
            console.error('Error fetching replies:', err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json(replies);
    });
});




/* START OF EMOTION TRACKING HANDLING */
/* Fetches and handles the emotion submissions */
app.post('/api/emotions', (req, res) => {
    const { emote, sprint_id } = req.body;
  
    db.run(
      `
      INSERT INTO emotion_counts (emote, count, sprint_id)
      VALUES (?, 1, ?)
      `,
      [emote, sprint_id],
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
  
  
app.get('/api/emotions', (req, res) => {
    db.get('SELECT * FROM sprints ORDER BY sprint_num DESC LIMIT 1', (err, currentSprint) => {
        if (err) {
            console.error('Error fetching most recent sprint', err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        db.all('SELECT emote, SUM(count) as total_count FROM emotion_counts WHERE sprint_id = ? GROUP BY emote'
        ,[currentSprint.id], (err, emotions) => {
            if (err) {
                console.error('Error fetching emotions:', err.message);
                return res.status(500).json({ error: 'Internal Server Error' });
            } else {
                res.json(emotions);
            }
        });
    });
});



/* Fetches and handles the score submissions */
app.post('/api/scores', (req, res) => {
    const { score, sprint_id } = req.body;

    db.run(`
        INSERT INTO score_counts (score, count, sprint_id)
        VALUES (?, 1, ?)
    `, [score, sprint_id], function (err) {
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
    db.get('SELECT * FROM sprints ORDER BY sprint_num DESC LIMIT 1', (err, currentSprint) => {
        if (err) {
            console.error('Error fetching most recent sprint', err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        db.all('SELECT score, SUM(count) as total_count FROM score_counts WHERE sprint_id = ? GROUP BY score'
        , [currentSprint.id], (err, scores) => {
            if (err) {
                console.error('Error fetching scores:', err.message);
                return res.status(500).json({ error: 'Internal Server Error' });
            } else {
                res.json(scores);
            }
        });
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
    db.get('SELECT * FROM sprints ORDER BY sprint_num DESC LIMIT 1', (err, currentSprint) => {
        if (err) {
            console.error('Error fetching most recent sprint', err.message);
            return res.status(500).json({ error: 'Internal Server Error'})
        }
    db.all('SELECT * FROM suggestions WHERE sprint_id =? ', [currentSprint.id], (err,suggestions) => {
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


app.get('/api/top_score', (req, res) => {
    db.get('SELECT * FROM sprints ORDER BY sprint_num DESC LIMIT 1', (err, currentSprint) => {
        if (err) {
            console.error('Error fetching most recent sprint:', err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        db.all('SELECT * FROM score_counts WHERE sprint_id = ?', [currentSprint.id], (err, scorecounts) => {
            if (err) {
                console.error('Error fetching scores:', err.message);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            const topScore = scorecounts.reduce((maxScore, currentScore) => {
                return currentScore.count > maxScore.count ? currentScore : maxScore;
            }, scorecounts[0]);

            res.json(topScore);
        });
    });
});

app.get('/api/top_emotion', (req, res) => {
    db.get('SELECT * FROM sprints ORDER BY sprint_num DESC LIMIT 1', (err, currentSprint) => {
        if (err) {
            console.error('Error fetching most recent sprint:', err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        db.get(
            'SELECT emote, COUNT(emote) AS count FROM emotion_counts WHERE sprint_id = ? GROUP BY emote ORDER BY count DESC LIMIT 1',
            [currentSprint.id],
            (err, topEmotion) => {
                if (err) {
                    console.error('Error fetching emotions:', err.message);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }

                res.json([topEmotion]);
            }
        );
    });
});



app.get('/api/top_comments', (req, res) => {
    db.get('SELECT * FROM sprints ORDER BY sprint_num DESC LIMIT 1', (err, currentSprint) => {
      if (err) {
        console.error('Error fetching most recent sprint:', err.message);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
  
      db.all(`
      SELECT id, comment, outcome, votes, replies, sprint_id
      FROM comments
      WHERE sprint_id = ?
      ORDER BY votes DESC
      LIMIT 3;`, [currentSprint.id], (err, comments) => {
        if (err) {
          console.error('Error fetching top comments:', err.message);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
  
        res.json(comments);
      });
    });
});

app.get('/api/top_suggestions', (req, res) => {
    db.get('SELECT * FROM sprints ORDER BY sprint_num DESC LIMIT 1', (err, currentSprint) => {
      if (err) {
        console.error('Error fetching most recent sprint:', err.message);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
  
      db.all(`
      SELECT id, suggestion, votes, sprint_id
      FROM suggestions
      WHERE sprint_id = ?
      ORDER BY votes DESC
      LIMIT 3;`, [currentSprint.id], (err, suggestions) => {
        if (err) {
          console.error('Error fetching top suggestions:', err.message);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
  
        res.json(suggestions);
      });
    });
});

app.post('/api/commentanswers', (req, res) => {
    const { answer, topcomment } = req.body;

    if(!answer) {
        return res.status(400).json({ error: 'Answer is required'})
    }

    db.run(`INSERT INTO comment_answers (answer, topcomment) VALUES (?, ?)`, [answer, topcomment], function(err) {
        if (err) {
            console.error('Error inserting answer:', err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.json({
            success: true,
            message: 'Answer added successfully',
            id: this.lastID,
        });    
    });
})

app.get('/api/commentanswers/:commentId', (req, res) => {
    const { commentId } = req.params;

    db.all('SELECT * FROM comment_answers WHERE topcomment = ?', [commentId], (err, commentAnswers) => {
        if (err) {
            console.error('Error fetching comment answers:', err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.json(commentAnswers);
    });

})


app.delete('/api/commentanswers/:answerId', (req,res) => {
    const { answerId } = req.params;

    if (!answerId) {
        return res.status(400).json({ error: 'Answer required' });
    }

    db.run('DELETE FROM comment_answers WHERE id = ?', [answerId], function (err) {
        if (err) {
            console.error('Error deleting answer', err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
  
        res.json({ success: true, message: 'Answer deleted successfully' });
    });
})


app.post('/api/suggestionanswers', (req, res) => {
    const { answer, topsuggestion } = req.body;

    if(!answer) {
        return res.status(400).json({ error: 'Answer is required'})
    }

    db.run(`INSERT INTO suggestion_answers (answer, topsuggestion) VALUES (?, ?)`, [answer, topsuggestion], function(err) {
        if (err) {
            console.error('Error inserting answer:', err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.json({
            success: true,
            message: 'Answer added successfully',
            id: this.lastID,
        });    
    });
})

app.get('/api/suggestionanswers/:suggestionId', (req, res) => {
    const { suggestionId } = req.params;

    db.all('SELECT * FROM suggestion_answers WHERE topsuggestion = ?', [suggestionId], (err, suggestionAnswers) => {
        if (err) {
            console.error('Error fetching suggestion answers:', err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.json(suggestionAnswers);
    });

})

app.delete('/api/suggestionanswers/:answerId', (req,res) => {
    const { answerId } = req.params;

    if (!answerId) {
        return res.status(400).json({ error: 'Answer required' });
    }

    db.run('DELETE FROM suggestion_answers WHERE id = ?', [answerId], function (err) {
        if (err) {
            console.error('Error deleting answer', err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
  
        res.json({ success: true, message: 'Answer deleted successfully' });
    });
})

/* JIRA INTEGRATION HANDLING STARTS HERE */
// For making Jira API requests

/*
app.get('/api/jira/board/:instance/:boardId', async (req, res) => {
    const { instance, boardId } = req.params;
    const accessToken = req.headers.authorization; 


    try {
        const response = await axios.get(`https://${instance}.atlassian.net/rest/agile/1.0/board/${boardId}/issue`, {
            params: {
                startAt: 0,
                maxResults: 50,
            },
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching board issues:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
*/


app.get('/api/jira/board/:instance/:boardId', async (req, res) => {
    const { instance, boardId } = req.params;

    try {
        const response = await axios.get(`https://${instance}.atlassian.net/rest/agile/1.0/board/${boardId}/issue`, {
            params: {
                startAt: 0,
                maxResults: 50,
            },
            headers: {
                Authorization: `Basic ${Buffer.from(jiraCred).toString('base64')}`,
            }
        });
        
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching board issues:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




app.get('/api/jira/boards/:instance', async (req, res) => {
    const { instance } = req.params;

    try {
        const response = await axios.get(`https://${instance}.atlassian.net/rest/agile/1.0/board`, {
            headers: {
                Authorization: `Basic ${Buffer.from(jiraCred).toString('base64')}`,
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching boards:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}); 

app.post('/api/jira/addIssue', async(req, res) => {
    const {instance, suggestion, projectKey} = req.body;

    try {
        const response = await axios.post(`https://${instance}.atlassian.net/rest/api/2/issue`, {
            fields: {
                project: {
                    key: projectKey
                },
                summary: suggestion,
                issuetype: {
                    name: 'Task'}
                }
        }, {
            headers: {
                Authorization: `Basic ${Buffer.from(jiraCred).toString('base64')}`,
                'Content-Type': 'application/json'
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error posting issue', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

{/*
app.get('/api/jira/boards/:instance', async (req, res) => {
    const { instance } = req.params;
    const accessToken = req.headers.authorization.split(' ')[1]; 

    try {
        const response = await axios.get(`https://${instance}.atlassian.net/rest/agile/1.0/board`, {
            headers: {
                Authorization: `Bearer ${accessToken}`, 
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching boards:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
*/}


/*
app.get('/api/jira/board/:boardId', async (req, res) => {
    const { boardId } = req.params;
    const { username, password } = req.query;

    const response = await axios.get(`${jiraURL}rest/agile/1.0/board/${boardId}/issue`, {
        params: {
            startAt: 0,
            maxResults: 50,
        },
        auth: {
           username,
           password
        },
    });

    if (response instanceof Error) {
        console.error('Error fetching board issues:', response.message);
        res.status(500).json({ error: 'Internal Server Error' });
    } else {
        res.json(response.data);
    }
});

// To get completed issues to create burnout chart
app.get('/api/jira/board/:boardId/complete-issues', async (req, res) => {
    const { boardId } = req.params;

    const response = await axios.get(`${jiraURL}rest/agile/1.0/board/${boardId}/issue`, {
        params: {
            jql: 'status = "Done"'
        },
        headers: {
            Authorization: `Basic ${Buffer.from(jiraCred).toString('base64')}`,
        },
    });

    // Check for axios request error and handle it
    if (response instanceof Error) {
        console.error('Error fetching board issues:', response.message);
        res.status(500).json({ error: 'Internal Server Error' });
    } else {
        res.json(response.data);
    }
});


app.get('/api/jira/board/:boardId/planned-issues', async (req, res) => {
    const { boardId } = req.params;

    const response = await axios.get(`${jiraURL}rest/agile/1.0/board/${boardId}/issue`, {
        params: {
            jql: 'status = "To Do"'
        },
        headers: {
            Authorization: `Basic ${Buffer.from(jiraCred).toString('base64')}`,
        },
    });

    // Check for axios request error and handle it
    if (response instanceof Error) {
        console.error('Error fetching board issues:', response.message);
        res.status(500).json({ error: 'Internal Server Error' });
    } else {
        res.json(response.data);
    }
});




*/

// Root path route handler
app.get('/', (req, res) => {
    res.send('Hello, World!');
});


app.listen(4000, () => {
    console.log('Server started on port 4000');
});

module.exports = app;