import { useEffect, useState } from "react";

const Elections = () => {
  const [stateList, setStateList] = useState([]);
  const [elections, setElections] = useState([]);
  const [electionType, setElectionType] = useState("");
  const [state, setState] = useState("");
  const [votingStatus, setVotingStatus] = useState(false);

  const electionTypeList = ["STATE", "CENTRAL"];
  function fetchData(url, callback) {
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


  function restCall(url, httpMethod, data) {
    const requestOptions = {
      method: httpMethod,
      headers: { "Content-Type": "application/json" },
      body: data == null ? null : JSON.stringify(data),
    };
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching photos:", error);
      });
  }

  function handleAddElection(e) {
    e.preventDefault();
    let url = "http://localhost:8080/electionDetail";
    let obj = {
      electionType: electionType,
      state: state,
      votingStatus: votingStatus,
    };
    restCall(url, "POST", obj);
    document.getElementById("add-election-form").reset();
  }

  useEffect(() => {
    var url = "http://localhost:8080/states";
    fetchData(url, getStatesList);
  }, []);

  return (
    <div className="container">
       <button
        type="button"
        className="btn btn-primary"
        data-toggle="modal"
        data-target="#addElectionModal"
      >
        Add Election
      </button>
      <select className="list-group" onChange={(e) => handleStateChange(e.target.value)}>
        {stateList.map((st, index) => (
          <option key={index} value={st} selected ={index === 0 ? "selected" : null}>
            {st}
          </option>
        ))}
      </select>
      <div className="list-group">
        {elections.map((el, index) => 
          <div id={el.id} key={el.id}>
            Election Type: {el.electionType}, Election State : {el.state}, Status: {String(el.votingStatus)} 
            <button className=".btn" href="#" > view </button>
          </div>
        )}
      </div>
      <div
        className="modal fade"
        id="addElectionModal"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="addElectionModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true"></span>
              </button>
            </div>
            <div className="modal-body">
              <form
                id="add-election-form"
                onSubmit={(event) => handleAddElection(event)}
              >
                <select
                  className="form-control"
                  onChange={(e) => setElectionType(e.target.value)}
                >
                  {electionTypeList.map((el, index) => (
                    <option key={index} value={el} selected={index === 0 ? "selected" : null} >{el}</option>
                  ))}
                </select>
                <select
                  className="form-control"
                  onChange={(e) => setState(e.target.value)}
                >
                  {stateList.map((st, index) => (
                    <option key={index} value={st}>{st}</option>
                  ))}
                </select>

                <select
                  className="form-control"
                  onChange={(e) => setVotingStatus(e.target.value)}
                >
                  <option value={false}>false</option>
                  <option value={true}>true</option>
                </select>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-dismiss="modal"
                  >
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Elections;
