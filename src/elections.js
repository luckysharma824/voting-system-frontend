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
    handleStateChange(states[0]);
  }

  function getElectionList(elections) {
    setElections(elections);
  }

  function handleStateChange(state) {
    let url = "http://localhost:8080/electionDetail/" + state;
    fetchData(url, getElectionList);
  }

  function deleteElectionDetail(id) {
    let url = "http://localhost:8080/electionDetail/" + id;
    restCall(url, "DELETE", null);
    removeItem(id);
  }

  const removeItem = (id) => {
    const updatedList = elections.filter((item) => item.id !== id);
    setElections(updatedList);
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

  function handleAddElection(e) {
    e.preventDefault();
    if(electionForm.electionType === '' || electionForm.electionType === null) {
      electionForm.electionType = electionTypeList[0];
    }
    if(electionForm.state === '' || electionForm.state === null) {
      electionForm.state = stateList[0];
    }
    let url = "http://localhost:8080/electionDetail";
    console.log("Payload:", electionForm);
    console.log("requestType: ", requestType);
    restCall(url, requestType, electionForm);
    document.getElementById("add-election-form").reset();
    document.getElementById("addElectionModal").setAttribute("data-dismiss", "modal");
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
      <table className="table table-bordered">
      <thead>
        <tr>
          <td>Election Type</td>
          <td>Status</td>
          <td>Election State</td>
          <td>Edit</td>
          <td>Delete</td>
          </tr>
        </thead>
        <tbody>
        {elections.map((el, index) => (
          <tr id={el.id} key={el.id}>
            <td>{el.electionType}</td>
            <td>{el.state}</td>
            <td>{String(el.votingStatus)}</td>

            <td><button
              type="button"
              className="btn btn-primary"
              data-toggle="modal"
              data-target="#addElectionModal"
              onClick={() => setRequiredData("PUT", el)}
            >
              Edit
            </button>
            </td>
            <td>
            <button type="button"className="btn btn-primary" onClick={()=>deleteElectionDetail(el.id)}>delete</button>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Elections;
