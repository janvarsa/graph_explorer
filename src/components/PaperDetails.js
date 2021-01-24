import React from "react";
import "../css/PaperDetails.css";

const PaperDetails = (props) => {
  let { activeNode } = props;

  return activeNode ? (
    <div className="paperDetails">
      <div className="col1">
        <div style={{ fontWeight: 700 }}>{activeNode.title}</div>
        <div>Published {activeNode.year}</div>
        <div>Citations {activeNode.n_citation}</div>
        {"references" in activeNode ? (
          <div>References {activeNode.references.length}</div>
        ) : null}
      </div>
      <div className="fos">
        <div style={{ fontWeight: 700 }}>Top 3 Fields of Study</div>
        <div>
          {activeNode.fos
            .sort((a, b) => {
              return b.w - a.w;
            })
            .slice(0, 3)
            .map((k) => {
              return (
                <div key={k.name}>
                  {k.w.toFixed(2)} {k.name}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  ) : null;
};

export default PaperDetails;
