import { useEffect, useState } from "react";

const Elections = () => {
  const [stateList, setStateList] = useState([]);
  const [elections, setElections] = useState([]);

  const [electionForm, setElectionForm] = useState({
    id: "",
    electionType: "",
    state: "",
    votingStatus: false,
  });

  const [requestType, setRequestType] = useState("");
  
  const handleChange = (event) => {
    const { name, value } = event.target;
    setElectionForm((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const setRequiredData = (reqType, election) => {
    if (election != null) {
      setElectionForm(election); 
    }
    setRequestType(reqType);
  };

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
    //e.preventDefault();
    let url = "http://localhost:8080/electionDetail";
    console.log("Payload:", electionForm);
    console.log("requestType: ", requestType);
    restCall(url, requestType, electionForm);
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
        onClick={() => setRequiredData("POST", null)}
      >
        Add Election
      </button>
      <select
        className="list-group"
        id="statelist"
        onChange={(e) => handleStateChange(e.target.value)}
      >
        {stateList.map((st, index) => (
          <option
            key={index}
            value={st}
          >
            {st}
          </option>
        ))}
      </select>
      <div className="list-group">
        {elections.map((el, index) => (
          <div id={el.id} key={el.id}>
            Election Type: {el.electionType}, Election State : {el.state},
            Status: {String(el.votingStatus)}
            <button
              type="button"
              className="btn btn-primary"
              data-toggle="modal"
              data-target="#addElectionModal"
              onClick={() => setRequiredData("PUT", el)}
            >
              Edit
            </button>
          </div>
        ))}
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
              <form id="add-election-form" onSubmit={handleAddElection}>
                <input
                  className="form-control"
                  type="hidden"
                  id="id"
                  name="id"
                  value={electionForm.id}
                  onChange={handleChange}
                />
                <select
                  className="form-control"
                  id="electionType"
                  name="electionType"
                  value={electionForm.electionType}
                  onChange={handleChange}
                >
                  {electionTypeList.map((el, index) => (
                    <option
                      key={index}
                      value={el}
                      defaultValue={index === 0 ? "selected" : null}
                    >
                      {el}
                    </option>
                  ))}
                </select>
                <select
                  className="form-control"
                  id="state"
                  name="state"
                  value={electionForm.state}
                  onChange={handleChange}
                >
                  {stateList.map((st, index) => (
                    <option key={index} value={st}>
                      {st}
                    </option>
                  ))}
                </select>

                <select
                  className="form-control"
                  id="votingStatus"
                  name="votingStatus"
                  value={electionForm.votingStatus}
                  onChange={handleChange}
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
