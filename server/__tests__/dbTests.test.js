const request = require('supertest');
const app = require('../../server/server');


describe('Test integration of database', () => {
    
    it('should allow a user to log in if they have inputted registered credentials', async() => {
        const response = await request(app)
            .post('/api/login')
            .send({ username: 'testuser1', password: 'testpass1'})

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('message', 'Login successful')
    });

    it('should deny a user who enters incorrect credentials', async () => {
        const response = await request(app)
            .post('/api/login')
            .send({ username: 'incorrectuser', password: 'incorrectpass' });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('success', false);
        expect(response.body).toHaveProperty('message', 'Invalid user');
    })

    it('should not allow user to register with existing credentials', async () => {
        const response = await request(app)
            .post('/api/register')
            .send({ username: 'testuser1', password: 'testpass1', code: 'testcode' });

        expect(response.status).toBe(500); 
        expect(response.body).toHaveProperty('error', 'Internal Server Error');
    });


    it('should start a new sprint', async () => {
        const response = await request(app)
            .post('/api/sprints')
            .send({ sprint_num: 1, start_date: '2024-01-01', end_date: '2024-01-01' })

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('message', 'Sprint added successfully');
        expect(response.body).toHaveProperty('sprintId');
    });

    it('should add a new comment', async () => {
        const response = await request(app)
            .post('/api/comments')
            .send({ comment: 'comment', outcome: 'success', votes: 0, sprint_id: 1 })

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('message', 'Comment added successfully');
        expect(response.body).toHaveProperty('commentId');
    });

    it('should fetch comments for the sprint', async () => {
        const response = await request(app)
            .get('/api/comments')
            .query({ sprint_id: 1 });

        expect(response.status).toBe(200);
    });


    it('should delete a comment', async () => {
        const my_comment = await request(app)
            .post('/api/comments')
            .send({ comment: 'Test comment', outcome: 'Test outcome', votes: 0, sprint_id: 1 });
    
        const commentId = my_comment.body.commentId;
    
        const response = await request(app)
            .delete(`/api/comments`);
    
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('message', 'Comment deleted successfully');
    });
    

    it('should add a new reply to a specific comment', async () => {
        const my_comment = await request(app)
            .post('/api/comments')
            .send({ comment: 'Test comment', outcome: 'Success', votes: 0, sprint_id: 1 });
    
        const commentId = my_comment.body.commentId;
    
        const response = await request(app)
            .post('/api/comments/replies')
            .send({ commentId: commentId, reply: 'Test reply' });
    
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('message', 'Reply added successfully');
    });

    it('should update the vote count for a specific comment', async () => {
        const my_comment = await request(app)
            .post('/api/comments')
            .send({ comment: 'Test comment', outcome: 'Success', votes: 0, sprint_id: 1 });

        const response = await request(app)
            .post('/api/votes')
            .send({ outcome: 'Success', comment: 'Test comment', votes: 1})

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('message', 'Votes updated successfully')
    });

    it('should fetch the correct vote count for a specific comment', async () => {
        await request(app)
            .post('/api/votes')
            .send({ outcome: 'Test outcome', comment: 'Test comment', votes: 1 });
    
        const response = await request(app)
            .get(`/api/votes/Test outcome/Test comment`);
    
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('votes', 1);
    });

    it('should fetch replies for a specific comment', async () => {
        const my_comment = await request(app)
            .post('/api/comments')
            .send({ comment: 'Test comment', outcome: 'Success', votes: 0, sprint_id: 1 });
    
        const commentId = my_comment.body.commentId;
    
        await request(app)
            .post('/api/comments/replies')
            .send({ commentId: commentId, reply: 'Test reply' });
    
        const response = await request(app)
            .get(`/api/comments/${commentId}/replies`);
    
        expect(response.status).toBe(200);
    });

    it('should add a new suggestion', async () => {
        const response = await request(app)
            .post('/api/nextsteps')
            .send({ suggestion: 'suggestion', votes: 0, sprint_id: 1 })

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('message', 'Suggestion added successfully');
        expect(response.body).toHaveProperty('suggestionId');
    });

    it('should fetch suggestions for the sprint', async () => {
        const response = await request(app)
            .get('/api/nextsteps')
            .query({ sprint_id: 1 });

        expect(response.status).toBe(200);
    })

    it('should delete a suggestion', async () => {
        const my_suggestion = await request(app)
            .post('/api/nextsteps')
            .send({ suggestion: 'Test suggestion', votes: 0, sprint_id: 1 });
    
        const suggestionId = my_suggestion.body.suggestionId;
    
        const response = await request(app)
            .delete(`/api/nextsteps/${suggestionId}`);
    
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('message', 'Suggestion deleted successfully');
    });


    it('should update the vote count for a specific suggestion', async () => {
        const my_suggestion = await request(app)
            .post('/api/suggestions')
            .send({ comment: 'Test suggestion',  votes: 0, sprint_id: 1 });

        const response = await request(app)
            .post('/api/sugg_votes')
            .send({suggestion: 'Test suggestion', votes: 1})

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('message', 'Votes updated successfully')
    });


    it('should submit an emotion for the sprint', async() => {
        const response = await request(app)
            .post('/api/emotions')
            .send({ emote: 'b1', sprint_id: 1 });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('message', 'Emotion count updated successfully');
    });

    it('should submit a score for the sprint', async() => {
        const response = await request(app)
            .post('/api/scores')
            .send({ score: '1', sprint_id: 1 });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('message', 'Score submitted successfully');
    });


    it('should fetch emotion count for the sprint', async () => {
        const response = await request(app)
            .get('/api/emotions')
            .query({ sprint_id: 1 });

        expect(response.status).toBe(200);
    })

    it('should fetch score count for the sprint', async () => {
        const response = await request(app)
            .get('/api/scores')
            .query({ sprint_id: 1 });

        expect(response.status).toBe(200);
    })

})