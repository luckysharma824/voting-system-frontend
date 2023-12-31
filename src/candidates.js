import { useEffect, useState } from "react";

const Candidates = () => {
  const [stateList, setStateList] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [elections, setElections] = useState([]);
  const [partyList, setPartyList] = useState([]);
  const [requestType, setRequestType] = useState("");

  const [candidateForm, setCandidateForm] = useState({
    id: "",
    name: "",
    partyDetail: {
      id: "",
      name: "",
      symbol: "",
      status: false,
    },
    electionDetail: {
      id: "",
      electionType: null,
      state: null,
      votingStatus: "",
    },
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    console.log("name: " + name + ", value: " + value);
    if ("partyDetail.id" === name) {
      let newPartyDetail = candidateForm.partyDetail;
      newPartyDetail["id"] = value;
      candidateForm.partyDetail = newPartyDetail;
    } else if ("electionDetail.id" === name) {
      let newElectionDetail = candidateForm.electionDetail;
      newElectionDetail["id"] = value;
      candidateForm.electionDetail = newElectionDetail;
    } else {
      setCandidateForm((prevFormData) => ({ ...prevFormData, [name]: value }));
    }
    console.log(candidateForm);
  };

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
    //handleCandidateListChange(states[0]);
  }

  function getCandidateList(resultObj) {
    setCandidates(resultObj.result);
  }

  function handleCandidateListChange(state) {
    if (state === "") {
      setCandidates([]);
    } else {
      let url = "http://localhost:8080/candidate/states/" + state;
      fetchData(url, getCandidateList);
    }
  }

  const setRequiredData = (reqType, candidate, actionType) => {
    console.log("on click of add and edit form: ", candidate);
    if (candidate != null) {
      setCandidateForm(candidate);
    }
    setRequestType(reqType);
    var url = "http://localhost:8080/partydetail/all";
    fetchData(url, setPartyList);
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
      body: data === null ? null : JSON.stringify(data),
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

  function handleAddCandidate(e) {
    e.preventDefault();
    let url = "http://localhost:8080/candidate";
    console.log("Payload:", candidateForm);
    console.log("requestType: ", requestType);
    restCall(url, requestType, candidateForm);
    document.getElementById("add-candidate-form").reset();
  }

  function callElectionListApi(event) {
    let state = event.target.value;
    if (state !== "") {
      let url = "http://localhost:8080/electionDetail/" + state;
      fetchData(url, setElections);
    }
  }

  return (
    <div className="container">
      <button
        type="button"
        className="btn btn-primary"
        data-toggle="modal"
        data-target="#addCandidateModal"
        onClick={() => setRequiredData("POST", null, "ADD")}
      >
        Add Candidate
      </button>
      <select
        className="list-group"
        id="statelist"
        onChange={(e) => handleCandidateListChange(e.target.value)}
      >
        <option key="-1" value="">
          --Please Choose State--
        </option>
        {stateList.map((st, index) => (
          <option key={index} value={st}>
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
              <td>
                <button
                  type="button"
                  className="btn btn-primary"
                  data-toggle="modal"
                  data-target="#addCandidateModal"
                  disabled={false}
                  onClick={() => setRequiredData("PUT", cand)}
                >
                  Edit
                </button>
              </td>
              <td>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => deleteCandidateDetail(cand.id)}
                >
                  delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div
        className="modal fade"
        id="addCandidateModal"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="addCandidateModalLabel"
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
              <form id="add-candidate-form" onSubmit={handleAddCandidate}>
                <input
                  className="form-control"
                  type="hidden"
                  id="id"
                  name="id"
                  value={candidateForm.id}
                  onChange={handleChange}
                />

                <input
                  className="form-control"
                  id="candidate_name"
                  name="name"
                  value={candidateForm.name}
                  placeholder="Candidate Name"
                  onChange={handleChange}
                />

                <select
                  className="form-control"
                  id="partyDetail_id"
                  name="partyDetail.id"
                  //value={candidateForm.partyDetail.id}
                  onChange={handleChange}
                >
                  <option value={""}>--Please Choose Party Detail--</option>
                  {partyList.map((party) => (
                    <option key={party.id} value={party.id}>
                      {party.name}: {party.symbol}
                    </option>
                  ))}
                </select>
                <select
                  className="form-control"
                  id="state-list"
                  name="states"
                  onChange={callElectionListApi}
                >
                  <option value={""}>--Please Choose State--</option>
                  {stateList.map((st, index) => (
                    <option key={index} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
                <select
                  className="form-control"
                  id="electionDetail_id"
                  name="electionDetail.id"
                  //value={candidateForm.electionDetail.id}
                  onChange={handleChange}
                >
                  <option value={""}>--Please Choose Election Detail--</option>
                  {elections.map((elec) => (
                    <option key={elec.id} value={elec.id}>
                      {elec.electionType}: {elec.state}
                    </option>
                  ))}
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

export default Candidates;
