import React, { useMemo, useState, useRef, useEffect } from "react";
import findMinimumCut from "minimum-cut";
import { ForceGraph2D } from "react-force-graph";
import "./css/App.css";
import "react-toggle/style.css";
import Toggle from "react-toggle";
import data from "./data.json";
import PaperDetails from "./components/PaperDetails";

console.log("data", data);

let origin = 4919037;
let origin_refs = data.find((d) => d._id === origin).references;

function App() {
  console.log("render App");

  const [graphData, setGraphData] = useState();
  const [minCut, setMinCut] = useState(true);
  const [originRefs, setOriginRefs] = useState(false); // toggle to include all origin connections regardless of mincut
  const [highlight, setHighlight] = useState(4919037);
  const [activeNode, setActiveNode] = useState(
    data.find((d) => d._id === 4919037)
  );
  const graphRef = useRef();

  const myData = useMemo(() => {
    console.log("useMemo myData");

    let nodes = data.map((d) => d._id);
    let links = [];

    // set up links
    data.forEach((d) => {
      if ("references" in d) {
        d.references.forEach((ref) => {
          if (nodes.includes(ref)) {
            links.push([ref, d._id]);
          }
        });
      }
    });

    if (minCut) {
      let citation_threshold = 0;
      findMinimumCut(
        [
          ...data
            .filter((d) => d.n_citation >= citation_threshold)
            .map((d) => d._id),
        ],
        links
      );
    }

    if (originRefs) {
      origin_refs.forEach((ref) => {
        links.push([ref, origin]);
      });
    }

    return {
      nodes: data,
      links: links.map((d) => {
        return { source: d[0], target: d[1] };
      }),
    };
  }, [minCut, originRefs]);

  useEffect(() => {
    console.log("useEffect setGraphData");
    console.log("myData", myData);
    setGraphData(myData);
  }, [myData]);

  // useEffect(() => {
  //   graphRef.current.d3Force("link").distance((link) => 240);
  //   // .strength(link => ...)
  // }, []);

  const onNodeClick = (node) => {
    console.log(node);
    setActiveNode(node);
    setHighlight(node._id);
  };

  const test = () => {
    let temp = data.filter((d) => d.n_citation > 200).map((d) => d._id);
    console.log("temp", temp);

    let nodes = graphData.nodes.filter((d) => temp.includes(d._id));
    let links = graphData.links.filter(
      (d) => temp.includes(d.source._id) && temp.includes(d.target._id)
    );

    setGraphData({ nodes: nodes, links: links });
  };

  const toggleMinCut = () => {
    setMinCut(!minCut);
  };

  const toggleOriginRefs = () => {
    setOriginRefs(!originRefs);
  };

  return (
    <div className="App">
      <div>
        <h1>Graph Explorer</h1>
      </div>
      <div className="controls">
        {/* <button onClick={test}>test()</button> */}
        <div
          style={{
            marginRight: "2em",
            height: "24px",
            display: "flex",
          }}
        >
          <Toggle
            className="custom-toggle"
            checked={minCut}
            icons={false}
            onChange={toggleMinCut}
          />
          <div
            style={{
              marginLeft: "1em",
            }}
          >
            <span>
              Minimum Cut Algorithm {minCut === true ? "Enabled" : "Disabled"}
            </span>
          </div>
        </div>
        {minCut ? (
          <div
            style={{
              marginRight: "2em",
              height: "24px",
              display: "flex",
            }}
          >
            <Toggle
              className="custom-toggle"
              checked={originRefs}
              icons={false}
              onChange={toggleOriginRefs}
            />
            <div
              style={{
                marginLeft: "1em",
              }}
            >
              <span>
                Connect All Origin References{" "}
                {originRefs === true ? "Enabled" : "Disabled"}
              </span>
            </div>
          </div>
        ) : null}
      </div>
      <div className="graphContainer">
        {activeNode ? (
          <PaperDetails activeNode={activeNode}></PaperDetails>
        ) : null}
        {myData ? (
          <ForceGraph2D
            ref={graphRef}
            graphData={graphData}
            nodeId="_id"
            width={1100}
            height={1100}
            onNodeClick={onNodeClick}
            nodeRelSize={0.2}
            nodeColor={(d) =>
              d._id === activeNode._id
                ? "rgb(255, 0, 0)"
                : d._id === origin
                ? "rgb(0, 0, 0)"
                : null
            }
            nodeCanvasObjectMode={() => "replace"}
            nodeLabel="title"
            nodeVal="n_citation"
            // linkWidth={1}
          />
        ) : null}
      </div>
    </div>
  );
}

export default App;
