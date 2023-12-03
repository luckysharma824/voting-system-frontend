import { useEffect, useState } from "react";

const Elections = () => {
  const [stateList, setStateList] = useState([]);
  const [elections, setElections] = useState([]);

  function fetchData(url, callback) {
    let states = [];
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log("fetchData: ", data);
        callback(data);
      })
      .catch((error) => {
        console.error("Error fetching photos:", error);
        callback([]);
      });
  }

  function getStatesList(states) {
    setStateList(states);
  }

  function getElectionList(elections) {
    setElections(elections);
  }

  function handleStateChange(state) {
    let url = "http://localhost:8080/electionDetail/" + state;
    fetchData(url, getElectionList);
  }

  useEffect(() => {
    var url = "http://localhost:8080/states";
    fetchData(url, getStatesList);
  }, []);

  return (
    <div className="container">
      <select className="form-select" aria-level="Default select example" onChange={(e) => handleStateChange(e.target.value)}>
        {stateList.map((st, index) => (
          <option key={index} value={st} defaultValue ={index == 0 ? true : false}>
            {st}
          </option>
        ))}
      </select>
      <div className="list-group">
        {elections.map((el, index) => 
          <div id={el.id} key={el.id}>
            Election Type: {el.electionType}, Election State : {el.state}, Status: {String(el.votingStatus)} 
            <a className=".btn disabled" href="#" > view </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Elections;
