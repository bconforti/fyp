import React, { useEffect, useState } from "react";
import './page9.css'
import Homepage from "../homepage/Homepage";

function Page9({currentSprint}) {
    const [currentPage, setCurrentPage] = useState('page9')

    const handleNavigate = (page) => {
        setCurrentPage(page);
    }

    return(
        <div>
            {currentPage === 'page9' && (
                <div className="container9">  
                    <h1 className="header9"> Past Sprint Data</h1>

                    <button
                    className="exitButton9"
                    onClick={() => handleNavigate('homepage')}> 
                    x </button>
            
                </div>
            )}

            {currentPage === 'homepage' && (
                <Homepage/>
            )}
        </div>
    )
}

export default Page9;