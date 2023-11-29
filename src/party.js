import { useEffect, useState } from "react";

const Party = () => {
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
          <a href="#" id={party.id}>
            {party.name} - {party.symbol}
          </a>
        ))}
      </div>
    </div>
  );
};

export default Party;
