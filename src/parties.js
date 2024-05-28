import { useEffect, useState } from "react";

const Parties = () => {
  const [partyList, setPartyList] = useState([]);
  const [partyForm, setPartyForm] = useState({
    id: "",
    name: "",
    symbol: "",
    status: false,
  });
  const [requestType, setRequestType] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPartyForm((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const setRequiredData = (reqType, party) => {
    if (party != null) {
      setPartyForm(party);
    }
    setRequestType(reqType);
  };

  function fetchData(url) {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setPartyList(data);
      })
      .catch((error) => {
        console.error("Error fetching photos:", error);
        setPartyList([]);
      });
  }

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

  async function handleAddParty(e) {
    e.preventDefault();
    let url = "http://localhost:8080/partydetail";
    console.log("Payload:", partyForm);
    console.log("requestType: ", requestType);
    const response = await restCall(url, requestType, partyForm);
    if (response.isSuccess) {
      if (requestType === "POST") {
        console.log(response.result);
        setPartyList((parties) => [...parties, response.result]);
      } else {
        updateItem(response.result);
      }
    }
    document.getElementById("add-party-form").reset();
  }

  const updateItem = (party) => {
    const updatedList = partyList.map((item) => {
      if (item.id === party.id) {
        item = party;
      }
      return item;
    });
    setPartyList(updatedList);
  };

  async function deleteParty(id) {
    let url = "http://localhost:8080/partydetail?id=" + id;
    const response = await restCall(url, "DELETE", null);
    if (response.isSuccess) {
      removeItem(id);
    }
  }

  const removeItem = (id) => {
    const updatedList = partyList.filter((item) => item.id !== id);
    setPartyList(updatedList);
  };

  useEffect(() => {
    var url = "http://localhost:8080/partydetail/all";
    fetchData(url);
  }, []);

  return (
    <div className="container">
      <button
        type="button"
        className="btn btn-primary"
        data-toggle="modal"
        data-target="#exampleModal"
        onClick={() => setRequiredData("POST", null)}
      >
        Add Party
      </button>
      <table className="table table-bordered">
        <thead>
          <tr>
            <td>Party Name</td>
            <td>Symbol</td>
            <td>Active</td>
            <td>Edit</td>
            <td>Delete</td>
          </tr>
        </thead>
        <tbody>
          {partyList.map((party) => (
            <tr id={party.id} key={party.id}>
              <td>{party.name}</td>
              <td>{party.symbol}</td>
              <td> {String(party.status)}</td>
              <td>
                <button
                  type="button"
                  className="btn btn-primary"
                  data-toggle="modal"
                  data-target="#exampleModal"
                  onClick={() => setRequiredData("PUT", party)}
                >
                  Edit
                </button>
              </td>
              <td>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => deleteParty(party.id)}
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
        id="exampleModal"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="exampleModalLabel"
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
              <form id="add-party-form" onSubmit={(e) => handleAddParty(e)}>
                {/* <label for="party-name" class="form-label">Party Name</label> */}
                <input
                  className="form-control"
                  type="hidden"
                  id="id"
                  name="id"
                  value={partyForm.id}
                  onChange={handleChange}
                />
                <input
                  className="form-control"
                  type="text"
                  id="name"
                  name="name"
                  value={partyForm.name}
                  placeholder="Party Name"
                  onChange={handleChange}
                />
                <input
                  className="form-control"
                  type="text"
                  id="symbol"
                  name="symbol"
                  value={partyForm.symbol}
                  placeholder="Party Symbol"
                  onChange={handleChange}
                />
                <select
                  className="form-control"
                  id="status"
                  name="status"
                  value={partyForm.status}
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

export default Parties;
