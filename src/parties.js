import { useEffect, useState } from "react";

const Parties = () => {
  const [partyList, setPartyList] = useState([]);
  
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
      }
      );
  }

  useEffect(() => {
    var url = "http://localhost:8080/partydetail/all";
    fetchData(url);
  }, []);

  
  return (
    <div className="container">
      <button type="button" className="btn btn-primary">Add Party</button>
      <div className="list-group">
        {partyList.map((party) => (
          <div id={party.id} key={party.id}>
            {party.name} - {party.symbol}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Parties;
