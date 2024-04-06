import React from 'react';
import './header.css';

/* Header for the top of every page to display the sprint number */
const Header = ( {currentSprint}) => {
  return (
    <header className="header">
      <div className="headerh1">you<strong>retro</strong></div>
      {currentSprint && (
        <p className='sprintnum'> Sprint Number: <strong> {currentSprint.sprint_num}</strong></p>
      )}
    </header>
  );
};

export default Header;
