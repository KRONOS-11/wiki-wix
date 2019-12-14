import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  Button,
  InputGroup,
  Classes,
  NonIdealState,
  Spinner
} from "@blueprintjs/core";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "./App.css";
function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounce = (func, delay) => {
    let debounceTimer;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
  };
  const fetchSearchResults = useCallback(
    debounce((searchT, callback) => {
      fetch(
        `https://en.wikipedia.org/w/api.php?action=opensearch&origin=*&search=${searchT}`
      )
        .then(e => e.json())
        .then(res => {
          callback(res);
          setLoading(false);
        });
    }, 1000),
    []
  );
  useEffect(() => {
    setLoading(true);
    searchTerm !== "" && fetchSearchResults(searchTerm, setSearchResults);
  }, [fetchSearchResults, searchTerm]);
  return (
    <div
      className="bp3-dark"
      style={{
        background: "#394b59",
        minHeight: "100vh",
        paddingBottom: "2em"
      }}
    >
      <div className="searchbar">
        <InputGroup
          large="true"
          leftIcon="search"
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search here...."
          value={searchTerm}
          rightElement={
            <a
              href="https://en.wikipedia.org/wiki/Special:Random"
              target="_blank"
              rel="noopener noreferrer"
            >
              {" "}
              <Button icon="random" text="Random" />
            </a>
          }
        />
      </div>
      <div className="results">
        {searchResults[1] && searchResults[1].length > 0 ? (
          searchResults[1].map((e, i) => {
            return (
              <div style={{ transition: "3s" }}>
                <Card style={{ margin: "10px" }} interactive="true">
                  <a target="blank" href={searchResults[3][i]}>
                    {" "}
                    <h2 className={loading && Classes.SKELETON}>{e}</h2>{" "}
                  </a>
                  <p className={loading && Classes.SKELETON}>
                    {searchResults[2][i] || "No description...!"}
                  </p>
                </Card>
              </div>
            );
          })
        ) : searchTerm !== "" ? (
          !loading ? (
            <NonIdealState
              icon="search"
              title="No search results.."
              description="Your search didn't match anything. Try searching for other related keywords"
            />
          ) : (
            <Spinner size="100" />
          )
        ) : (
          <h1 class="bp3-heading" style={{ textAlign: "center" }}>
            Go Ahead and search for something!..
          </h1>
        )}
      </div>
    </div>
  );
}

export default App;
