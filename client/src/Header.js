import React from 'react';
import './header.css';

const Header = ( {currentSprint}) => {
  return (
    <header className="header">
      <h1>myRetro</h1>
      {currentSprint && (
        <p className='sprintnum'> Sprint Number: <strong> {currentSprint.sprint_num}</strong></p>
      )}
    </header>
  );
};

export default Header;
