import React from "react";
import "../css/PaperDetails.css";

const PaperDetails = (props) => {
  let { activeNode, getId } = props;

  return activeNode ? (
    <div className="paperDetails">
      <div className="col1">
        <div
          style={{ fontWeight: 700, cursor: "pointer" }}
          id={activeNode._id}
          onClick={getId}
        >
          {activeNode.title}
        </div>
        <div>{activeNode.abstract}</div>
        <div style={{ display: "flex" }}>
          <div style={{ marginRight: "1em", fontWeight: 700 }}>
            Published:{" "}
            <span style={{ fontWeight: 400 }}>{activeNode.year}</span>
          </div>
          <div style={{ marginRight: "1em", fontWeight: 700 }}>
            Citations:{" "}
            <span style={{ fontWeight: 400 }}>{activeNode.n_citation}</span>
          </div>
          {"references" in activeNode ? (
            <div style={{ marginRight: "1em", fontWeight: 700 }}>
              References:{" "}
              <span style={{ fontWeight: 400 }}>
                {activeNode.references.length}
              </span>
            </div>
          ) : null}
        </div>

        <div style={{ display: "flex" }}>
          <div style={{ marginRight: "1em", fontWeight: 700 }}>
            Fields of Study:{" "}
            {activeNode.fos
              .sort((a, b) => {
                return b.w - a.w;
              })
              .slice(0, 3)
              .map((k) => {
                return (
                  <span
                    key={k.name}
                    style={{ fontWeight: 400, margin: "0 1em" }}
                  >
                    {k.w.toFixed(2)} {k.name}
                  </span>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default PaperDetails;
