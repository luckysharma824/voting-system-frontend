import { useEffect, useState } from "react";

const Parties = () => {
  const [partyList, setPartyList] = useState([]);
  const [partyName, setPartyName] = useState("");
  const [partySymbol, setPartySymbol] = useState("");
  const [partyStatus, setPartyStatus] = useState(false);

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

  function handleAddParty(e) {
    e.preventDefault();
    let url = "http://localhost:8080/partydetail";
    let obj = {
      name: partyName,
      symbol: partySymbol,
      status: partyStatus,
    };
    restCall(url, "POST", obj);
    document.getElementById("add-party-form").reset();
  }

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
      >
        Add Party
      </button>
      <div className="list-group">
        {partyList.map((party) => (
          <div id={party.id} key={party.id}>
            Party: {party.name}, Symbol: {party.symbol}, Status: {String(party.status)}
            {/* <button
              type="button"
              className="btn btn-primary"
              data-toggle="modal"
              data-target="#exampleModal"
            >
              Edit
            </button> */}
          </div>
        ))}
      </div>
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
              <form
                id="add-party-form"
                onSubmit={(event) => handleAddParty(event)}
              >
                {/* <label for="party-name" class="form-label">Party Name</label> */}
                <input
                  className="form-control"
                  type="text"
                  value={partyName}
                  placeholder="partyName"
                  onChange={(e) => setPartyName(e.target.value)}
                />
                <input
                  className="form-control"
                  type="text"
                  value={partySymbol}
                  placeholder="partySymbol"
                  onChange={(e) => setPartySymbol(e.target.value)}
                />
                <select
                  className="form-control"
                  onChange={(e) => setPartyStatus(e.target.value)}
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
