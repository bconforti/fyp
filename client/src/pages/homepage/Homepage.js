import React, { useState} from "react";
import './homepage.css';
import Page1 from '../page1/Page1';
import Page2 from '../page2/Page2';
import Page3 from '../page3/Page3';
import Page4 from '../page4/Page4';
import Page5 from '../page5/Page5';
import Page6 from "../page6/Page6";
import Page7 from "../page7/Page7";
import Page8 from "../page8/Page8";
import Page9 from "../page9/Page9";
import FinalPage1 from "./finalpage/FinalPage1";

function Homepage({ currentSprint }) {
    const [currentPage, setCurrentPage] = useState('homepage');

    const handleNavigate = (page) => {
        setCurrentPage(page);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    return (
        <div>
            {currentPage === 'homepage' && (
                <form className="form0" onSubmit={handleSubmit}>
                    <h2 className="homeh2">Begin your retrospective</h2>
                    <div>
                        <button className="hbutton1" onClick={() => handleNavigate('page3')}>
                            Set the Stage
                        </button>
                        <input type="checkbox" className="check1"></input>
                    </div>

                    <p className="arr1">&#8680;</p>

                    <div>
                        <button className="hbutton2" onClick={() => handleNavigate('page9')}>
                            Gather Data
                        </button>
                        <input type="checkbox" className="check2"></input>
                    </div>

                    <p className="arr2">&#8681;</p>

                    <div>
                        <button className="hbutton3" onClick={() => handleNavigate('page1')}>
                            Gather Insights
                        </button>
                        <input type="checkbox" className="check3"></input>
                    </div>

                    <p className="arr3">&#8680;</p>

                    <div>
                        <button className="hbutton4" onClick={() => handleNavigate('page6')}>
                            Next Steps
                        </button>
                        <input type="checkbox" className="check4"></input>
                    </div>
                    <p className="arr4">&#8680;</p>

                    <div>
                        <button className="hbutton5" onClick={() => handleNavigate('finalpage1')}>
                            Close the Retrospective
                        </button>
                        <input type="checkbox" className="check5"></input>
                    </div>
                </form>
            )}

          {currentPage === 'page1' && (
                <div>
                    <Page1 currentSprint={currentSprint} />
                </div>
            )}
            {currentPage === 'page2' && (
                <div>
                    <Page2 currentSprint={currentSprint} />
                </div>
            )}
            {currentPage === 'page3' && (
                <div>
                    <Page3 currentSprint={currentSprint}/>
                </div>
            )}
            {currentPage === 'page4' && (
                <div>
                    <Page4 currentSprint={currentSprint}/>
                </div>
            )}
            {currentPage === 'page5' && (
                <div>
                    <Page5 currentSprint={currentSprint}/>
                </div>
            )}
            {currentPage === 'page6' && (
                <div>
                    <Page6 currentSprint={currentSprint}/>
                </div>
            )}
            {currentPage === 'page7' && (
                <div>
                    <Page7 currentSprint={currentSprint}/>
                </div>
            )}
            {currentPage === 'page8' && (
                <div>
                    <Page8 currentSprint={currentSprint}/>
                </div>
            )}
            {currentPage === 'page9' && (
                <div>
                    <Page9 currentSprint={currentSprint}/>
                </div>
            )}

            {currentPage === 'finalpage1' && (
                <div>
                    <FinalPage1 currentSprint={currentSprint}/>
                </div>
            )}
  
        </div>
    )
}

export default Homepage;
