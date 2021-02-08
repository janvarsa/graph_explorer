import React, { useMemo, useState, useRef, useEffect } from "react";
import findMinimumCut from "minimum-cut";
import { ForceGraph2D } from "react-force-graph";
import "./css/App.css";
import "react-toggle/style.css";
import Toggle from "react-toggle";
import Search from "./components/Search";
import PaperDetails from "./components/PaperDetails";

// sharing a domain from a prior project
// (point this to the host of the database API if it changes)
// const hostname = "http://localhost:3000";
const host = "https://www.artfulreporting.com";

function App() {
  console.log("render App");

  const [data, setData] = useState([]);
  const [graphData, setGraphData] = useState();
  const [searchString, setSearchString] = useState("");
  const [results, setResults] = useState([]);
  const [minCut, setMinCut] = useState(false);
  const [particles, setParticles] = useState(1);
  const [activeNode, setActiveNode] = useState();
  const [loading, setLoading] = useState(false);
  const graphRef = useRef();

  const myData = useMemo(() => {
    console.log("useMemo myData");
    console.log("data", data);

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

    if (minCut && data.length > 0 && links.length > 0) {
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

    return {
      nodes: data,
      links: links.map((d) => {
        return { source: d[0], target: d[1] };
      }),
    };
  }, [minCut, data]);

  useEffect(() => {
    console.log("useEffect setGraphData");
    console.log("myData", myData);
    setGraphData(myData);
  }, [myData]);

  // useEffect(() => {
  //   graphRef.current.d3Force("link").distance((link) => 240);
  //   // .strength(link => ...)
  // }, []);

  // const postRender = () => {
  //   console.log("graphRef.current", graphRef.current);
  //   if (graphRef.current) {
  //     graphRef.current.zoomToFit(0, 50, (node) => true);
  //   }
  // };

  useEffect(() => {
    if (graphRef.current) {
      if (minCut) {
        graphRef.current.zoom(3, 0);
      } else graphRef.current.zoom(7, 0);
      graphRef.current.centerAt(0, 0);
    }
  }, [graphData, minCut]);

  const onNodeClick = (node) => {
    console.log("NODE", node);
    setActiveNode(node);
  };

  const toggleMinCut = () => {
    setMinCut(!minCut);
  };

  const toggleParticles = () => {
    if (particles === 1) setParticles(0);
    else setParticles(1);
  };

  const handleSearch = async () => {
    console.log("searchstring", searchString);
    setResults([]);
    setLoading(true);
    try {
      let res = await fetch(`${host}/search?text=${searchString}`);
      res = await res.json();
      setResults(res.results);
      console.log(res.results);
    } catch (err) {
      console.log(`no response for ${searchString}`, err);
    }
    setLoading(false);
  };

  const getId = async (e) => {
    if (activeNode && parseInt(e.target.id) !== activeNode._id) {
      console.log(e.target.id, activeNode._id);
      console.log("not equal");
    }
    let res = await fetch(`${host}/getid?id=${e.target.id}`);
    res = await res.json();
    console.log("res", res);
    setActiveNode(res.results.find((d) => d._id === parseInt(e.target.id)));
    setData(res.results);
  };

  return (
    <div className="App">
      <div style={{ margin: "5em 0 3em 0" }}>
        <h1>Graph Explorer</h1>
      </div>
      <div style={{ display: "flex", width: "1100px", position: "relative" }}>
        <Search
          searchString={searchString}
          setSearchString={setSearchString}
          handleSearch={handleSearch}
          results={results}
          getId={getId}
          loading={loading}
        ></Search>

        <div style={{ marginLeft: "3em", color: "rgba(0,0,0,0.7)" }}>
          <div style={{ fontWeight: 700 }}>Search Tips</div>
          <ol style={{ padding: "0 1em" }}>
            <li style={{ marginBottom: "1em" }}>
              Use the {"<Enter>"} key or click the search icon to initiate
              search. "Live search" while typing is not enabled.
            </li>
            <li style={{ marginBottom: "1em" }}>
              The default search behavior is a "quick search" that returns the
              first 5 similar results.
            </li>
            <li style={{ marginBottom: "1em" }}>
              Use quotes to search for an exact sequence of words. This is much
              slower and will timeout after 2 minutes if nothing is found. A
              short string of 2-3 unique words works best. For example:
              "generative adversarial nets".
            </li>
          </ol>
        </div>
      </div>
      {activeNode ? (
        <PaperDetails activeNode={activeNode} getId={getId}></PaperDetails>
      ) : null}
      <div className="controls">
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
            <span>Minimum Cut {minCut === true ? "Enabled" : "Disabled"}</span>
          </div>
        </div>

        <div
          style={{
            marginRight: "2em",
            height: "24px",
            display: "flex",
          }}
        >
          <Toggle
            className="custom-toggle"
            checked={particles === 1 ? true : false}
            icons={false}
            onChange={toggleParticles}
          />
          <div
            style={{
              marginLeft: "1em",
            }}
          >
            <span>
              Particle animation {particles === 1 ? "Enabled" : "Disabled"}
            </span>
          </div>
        </div>
      </div>
      <div className="graphContainer">
        {myData ? (
          <ForceGraph2D
            ref={graphRef}
            graphData={graphData}
            nodeId="_id"
            width={1100}
            height={1100}
            onNodeClick={onNodeClick}
            nodeRelSize={0.05}
            nodeColor={(d) =>
              activeNode && d._id === activeNode._id ? "rgb(255, 0, 0)" : null
            }
            nodeCanvasObjectMode={() => "replace"}
            nodeLabel="title"
            nodeVal="n_citation"
            linkDirectionalParticles={particles}
            linkDirectionalParticleWidth={3}
            // onRenderFramePost={postRender}
            // linkWidth={1}
          />
        ) : null}
      </div>
    </div>
  );
}

export default App;
