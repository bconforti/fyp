import React, { useState, useEffect } from 'react';
import './page8.css'


function Page8() {
    const [comments, setComments] = useState([]);
    const [commentVotes, setCommentVotes] = useState({});
    const [suggestions, setSuggestions] = useState([]);
    const [suggestionVotes, setSuggestionVotes] = useState({});
    const [currentPage, setCurrentPage] = useState('page8')

    
    

    // Fetching comments (and their votes)
    useEffect(() => {
        // Fetch comments from the backend
        fetch('http://localhost:4000/api/comments')
          .then((response) => response.json())
          .then((data) => {
            setComments(data);
    
            // Fetch votes for each comment
            data.forEach((comment) => {
              fetch(`http://localhost:4000/api/votes/${comment.outcome}/${comment.comment}`)
                .then((response) => response.json())
                .then((voteData) => {
                  setSuggestionVotes((prevVotes) => ({
                    ...prevVotes,
                    [`${comment.outcome}_${comment.comment}`]: voteData.votes,
                  }));
                })
                .catch((error) => console.error('Error fetching votes:', error));
            });
          })
          .catch((error) => console.error('Error fetching comments', error));
    }, []);

    useEffect(() => {
    fetch('http://localhost:4000/api/nextsteps')
        .then((response) => response.json())
        .then((data) => {
        setSuggestions(data);

        data.forEach((suggestion) => {
            const encodedSuggestion = encodeURIComponent(suggestion.suggestion);
            fetch(`http://localhost:4000/api/sugg_votes/${encodedSuggestion}`)
            .then((response) => response.json())
                .then((voteData) => {
                setSuggestionVotes((prevVotes) => ({
                    ...prevVotes,
                    [`${suggestion.suggestion}`]: voteData.votes,
                }));
                })
                .catch((error) => console.error('Error fetching votes:', error));
            });
        })
        .catch((error) => console.error('Error fetching suggestions:', error));
    }, []);

    /* Want to display 3 of the highest comments and suggestions on the page */
    const setTopComments = ({ comments, commentVotes }) => {
        // First we need to order the comments 
        const sortedComments = comments.sort((commentA, commentB) => {
            const keyA = `${commentA.outcome}_${commentA.comment}`;
            const keyB = `${commentB.outcome}_${commentB.comment}`;
            return commentVotes[keyB] - commentVotes[keyA];
          });      
        // Now that the comments are in descending order we can get the comments with the 3 highest votes
        const topComments = sortedComments.slice(0, 3).map((comment, index) => (
          <div key={index}>
            {comment.comment} - Votes: {commentVotes[comment.outcome + '_' + comment.comment] || 0}
          </div>
        ));
        return topComments;
    };

    // Same concept for the suggestions
    const setTopSuggestions = ({ suggestions, suggestionVotes }) => {
        // First we need to order the suggestions
        const sortedSuggestions = suggestions.sort((suggestionA, suggestionB) => {
          const keyA = `${suggestionA.suggestion}`;
          const keyB = `${suggestionB.suggestion}`;
          return suggestionVotes[keyB] - suggestionVotes[keyA];
        });
      
        // Extract the top 3 suggestions
        const topSuggestions = sortedSuggestions.slice(0, 3).map((suggestion, index) => (
          <div key={index}>
            {suggestion.suggestion} - Votes: {suggestionVotes[suggestion.suggestion] || 0}
          </div>
        ));
      
        return topSuggestions;
      };

    return(
        <div> 
            {currentPage === 'page8' && (
                <div className='container8'> 

                <div className='left8'>
                <ul> <setTopComments comments={comments} commentVotes={commentVotes} />
 </ul>
                </div>

                <div className='right8'>
                <setTopSuggestions suggestions={suggestions} suggestionVotes={suggestionVotes} />
                </div>

                </div>
                
            )}
                
        </div>
    )

}

export default Page8;
