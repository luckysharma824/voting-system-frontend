import { useEffect, useState } from "react";

const Candidates = () => {
  const [stateList, setStateList] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [requestType, setRequestType] = useState("");
  

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

  useEffect(() => {
    var url = "http://localhost:8080/states";
    fetchData(url, getStatesList);
  }, []);

  function getStatesList(states) {
    setStateList(states);
    handleCandidateListChange(states[0]);
  }

  function getCandidateList(resultObj) {
    setCandidates(resultObj.result);
  }

  function handleCandidateListChange(state) {
    let url = "http://localhost:8080/candidate/states/" + state;
    fetchData(url, getCandidateList);
  }

  const setRequiredData = (reqType, candidate) => {
    // if (candidate != null) {
    //   setElectionForm(election); 
    // }
    setRequestType(reqType);
  };

  function deleteCandidateDetail(id) {
    let url = "http://localhost:8080/candidate/" + id;
    restCall(url, "DELETE", null);
    removeItem(id);
  }

  const removeItem = (id) => {
    const updatedList = candidates.filter((item) => item.id !== id);
    setCandidates(updatedList);
  };



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
        alert(data.message);
      })
      .catch((error) => {
        console.error("Error fetching photos:", error);
      });
  }

  return (
  <div className="container">
    <select
        className="list-group"
        id="statelist"
        onChange={(e) => handleCandidateListChange(e.target.value)}
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
      <table className="table table-bordered">
      <thead>
        <tr>
          <td>Candidate Name</td>
          <td>Party Name</td>
          <td>Party Symbol</td>
          <td>Election Type</td>
          <td>Edit</td>
          <td>Delete</td>
          </tr>
        </thead>
        <tbody>
        {candidates.map((cand, index) => (
          <tr id={cand.id} key={cand.id}>
            <td>{cand.name}</td>
            <td>{cand.partyDetail.name}</td>
            <td>{cand.partyDetail.symbol}</td>
            <td>{cand.electionDetail.electionType}</td>
            <td><button
              type="button"
              className="btn btn-primary"
              data-toggle="modal"
              data-target="#addElectionModal"
              onClick={() => setRequiredData("PUT", cand)}
            >
              Edit
            </button>
            </td>
            <td>
            <button type="button"className="btn btn-primary" onClick={()=>deleteCandidateDetail(cand.id)}>delete</button>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
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
            {/* <div className="modal-body">
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
                  defaultValue={electionTypeList[0]}
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
                  defaultValue={stateList[0]}
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
                  defaultValue={false}
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
            </div> */}
          </div>
        </div>
      </div>
  </div>
  );
}

export default Candidates;