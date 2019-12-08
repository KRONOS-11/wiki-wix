import React, { useState, useEffect, useCallback } from "react";
import { Classes, Card, Icon, Button } from "@blueprintjs/core";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const debounce = (func, delay) => {
    let debounceTimer;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
  };
  const fetchRandomResult = useCallback(
    callback =>
      fetch(
        `https://en.wikipedia.org/w/api.php?action=query&format=json&list=random&rnnamespace=0`
      )
        .then(e => e.json())
        .then(e => callback(e.query.random[0])),
    []
  );
  const fetchSearchResults = useCallback(
    debounce((searchT, callback) => {
      fetch(
        `https://en.wikipedia.org/w/api.php?action=opensearch&origin=*&search=${searchT}`
      )
        .then(e => e.json())
        .then(callback);
    }, 500),
    []
  );
  useEffect(() => {
    searchTerm !== "" && fetchSearchResults(searchTerm, setSearchResults);
  }, [fetchSearchResults, searchTerm]);
  return (
    <div className="bp3-dark">
      <div style={{ width: 400, padding: 20, textAlign: "center" }}>
        <input
          class={Classes.INPUT}
          onChange={e => setSearchTerm(e.target.value)}
          type="text"
          value={searchTerm}
          placeholder="search"
        />
        <Button icon="random" text="Random Article" />
      </div>
      <div>
        {searchResults[1] &&
          searchResults[1].map((e, i) => {
            return (
              <div style={{ transition: "3s" }}>
                <Card style={{ margin: "10px" }} interactive="true">
                  <a target="blank" href={searchResults[3][i]}>
                    {" "}
                    <h2>{e}</h2>{" "}
                  </a>
                  <p>{searchResults[2][i] || "No description...!"}</p>
                </Card>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default App;
