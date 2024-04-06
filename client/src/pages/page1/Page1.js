import React, { useState } from 'react';
import './page1.css';
import Homepage from '../homepage/Homepage';
import Page2 from '../page2/Page2';

/* User can enter comment about this sprint 
They can select whether it was a success or challgenge for that sprint*/
function Page1({currentSprint}) {
  const [comment, setComment] = useState('');
  const [outcome, setOutcome] = useState('success');
  const [currentPage, setCurrentPage] = useState('page1');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:4000/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comment, outcome, sprint_id: currentSprint.sprint_num }),
      });

      if (response.ok) {
        console.log('Comment was successfully added')
        console.log({ comment, outcome, sprint_id: currentSprint.sprint_num })
      } else {
        console.error('Error adding comment:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding comment:', error.message);
    }
  };

  const handleNavigate = () => {
    setCurrentPage(currentPage === 'page1' ? 'page2' : 'page1');
  };

  const handleExit = () => {
    setCurrentPage(currentPage === 'page1' ? 'Homepage' : 'page1');
  };

  return (
    <div>
      {currentPage === 'page1' && (
        <form
          className='form1'
          onSubmit={handleSubmit}
        >
          <h1 className='header1'> Gather Insights </h1>
          <label>Enter Success or Challenge:</label>
          <textarea
            required
            data-testid="comment-input"
            id="commentInput"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>

          <label>Success or Challenge?</label>
          <select
            value={outcome}
            onChange={(e) => setOutcome(e.target.value)}
          >
            <option value="success">Success</option>
            <option value="challenge">Challenge</option>
          </select>

          <button
            className="submitButton"
          > Submit </button>

          <button
            className="pageButton"
            onClick={handleNavigate}
          >
            {currentPage === 'page1' ? 'See comments' : 'Add another comment'}
          </button>

          <button className="infoButton">
            i
            <div className="infoPopup">
              Add any comments you have about this sprint. <br />
              If it is something that went well, mark it as a success. <br />
              If it is something that you think was a problem, mark it as a challenge.<br />
            </div>
          </button>

          <button
            className="exitButton1"
            onClick={handleExit}>
            {currentPage === 'page1' ? 'x' : ''}
          </button>
        </form>
      )}

      {currentPage === 'page2' && (
        <div>
          <Page2 currentSprint={currentSprint}/>
        </div>
      )}

      {currentPage === 'Homepage' && (
        <div>
          <Homepage currentSprint={currentSprint} />
        </div>
      )}
    </div>
  );
}

export default Page1;