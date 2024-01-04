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
    if (value === "") {
      setElectionForm([]);
    } else {
      setElectionForm((prevFormData) => ({ ...prevFormData, [name]: value }));
    }
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
    //handleStateChange(states[0]);
  }

  function getElectionList(elections) {
    setElections(elections);
  }

  function handleStateChange(state) {
    if (state === "") {
      setElections([]);
    } else {
      let url = "http://localhost:8080/electionDetail/" + state;
      fetchData(url, getElectionList);
    }
  }

  async function deleteElectionDetail(id) {
    let url = "http://localhost:8080/electionDetail/" + id;
    const res = await restCall(url, "DELETE", null);
    if (res.isSuccess) {
      removeItem(id);
    }
  }

  const removeItem = (id) => {
    const updatedList = elections.filter((item) => item.id !== id);
    setElections(updatedList);
  };

  async function restCall(url, httpMethod, data) {
    const requestOptions = {
      method: httpMethod,
      headers: { "Content-Type": "application/json" },
      body: data == null ? null : JSON.stringify(data),
    };
    try {
      const response = await fetch(url, requestOptions);
      const data_1 = await response.json();
      console.log(data_1);
      alert(data_1.message);
      return data_1;
    } catch (error) {
      console.error("Error fetching party list:", error);
    }
    return null;
  }

  async function handleAddElection(e) {
    e.preventDefault();
    if (
      electionForm.electionType === "" ||
      electionForm.electionType === null
    ) {
      electionForm.electionType = electionTypeList[0];
    }
    if (electionForm.state === "" || electionForm.state === null) {
      electionForm.state = stateList[0];
    }
    let url = "http://localhost:8080/electionDetail";
    console.log("Payload:", electionForm);
    console.log("requestType: ", requestType);
    const response = await restCall(url, requestType, electionForm);
    document.getElementById("add-election-form").reset();
    if (response.isSuccess) {
      if (requestType === "POST") {
        console.log(response.result);
        setElections((prev) => [...prev, response.result]);
      } else {
        console.log("updating the record: ", response.result);
        updateItem(response.result);
      }
    }
  }

  const updateItem = (el) => {
    const updatedList = elections.map((item) => {
      if (item.id === el.id) {
        item = el;
      }
      return item;
    });
    setElections(updatedList);
  };

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
        <option key="-1" value="">
          --Please choose state--
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
            <td>Election Type</td>
            <td>Election State</td>
            <td>Status</td>
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

              <td>
                <button
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
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => deleteElectionDetail(el.id)}
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
                  //defaultValue={electionTypeList[0]}
                  onChange={handleChange}
                >
                  <option key="-1" value="">
                    --Please Choose ElectionType--
                  </option>
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
                  <option key="-1" value="">
                    --Please Choose State--
                  </option>
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
