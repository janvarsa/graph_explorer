import React from "react";
import "../css/Search.css";
import ClipLoader from "react-spinners/ClipLoader";

const Search = ({
  searchString,
  setSearchString,
  handleSearch,
  results,
  getId,
  loading,
}) => {
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div style={{ width: "475" }}>
      <div id="search">
        <input
          style={{
            backgroundColor: "transparent",
            border: "none",
            outline: "none",
            width: "100%",
            margin: "1em 0 1em 2em",
            padding: "0",
          }}
          value={searchString || ""}
          placeholder={"search paper titles and abstracts"}
          onChange={(e) => {
            setSearchString(e.target.value);
          }}
          onKeyDown={handleKeyDown}
        />
        <div
          style={{ margin: "auto 1em", cursor: "pointer" }}
          onClick={handleSearch}
        >
          <span
            style={{
              lineHeight: "24px",
              display: "inline-block",
              marginTop: "3px",
            }}
          >
            <svg
              focusable="false"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#9aa0a6"
              height="20px"
            >
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
            </svg>
          </span>
        </div>
      </div>
      <div id="searchresults">
        <span style={{ marginLeft: "4em" }}>
          <ClipLoader color={"grey"} loading={loading} size={30} />
        </span>
        <div style={{ padding: "1em 1em 1em 2em" }}>
          {results ? (
            results.map((d, i) => {
              return (
                <div
                  key={d._id}
                  id={d._id}
                  style={{ marginBottom: "1rem", cursor: "pointer" }}
                  onClick={getId}
                >
                  {d.year + " " + d.title}
                </div>
              );
            })
          ) : (
            <div>no results</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
