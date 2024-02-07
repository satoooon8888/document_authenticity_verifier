import { useEffect, useRef } from "react";

import * as d3 from "d3";
import * as d3dag from "d3-dag";


const transformMapToGraphConnect = (claimMap) => {
  return Object.entries(claimMap).flatMap(([id, claim]) =>
    claim.premises.map((premiseId) =>
      id !== premiseId
        ? [id, premiseId]
        : undefined
    )
  ).filter(link => link !== undefined);
}

export default function GraphView({ walkResult }) {
  const { claimMap, authenticated, errors } = walkResult;
  const d3Container = useRef(null);

  const getNodeColor = (id) => {
    if (!claimMap[id].authenticity) return "red";
    if (!authenticated[id]) return "orange";
    return "green"
  }

  const extractDisplayPartFromId = (id) => {

    // return new URL(id).host + new URL(id).pathname
    // return (new URL(id).pathname).split("/").slice(-1)[0];
    return (new URL(claimMap[id].subject).pathname).split("/").slice(-1)[0];
  }

  const getErrorMessage = (err) => {
    if (err.message === "Circular reference is detected") {
      return `Circular reference is detected between ${err.circle.join(", ")}`;
    }
    if (err.message === "Claim is not found") {
      return `Claim is not found: ${err.claimId}`;
    }
    if (err.message === "Invalid claim is found") {
      return `Invalid claim is found: ${err.claimId}`;
    }
    if (err.message === "Failed to fetch claim") {
      return `Failed to fetch claim: ${err.claimId} (${err.errorMessage})`;
    }
    return err.message;
  }

  useEffect(() => {

    if (!claimMap || !d3Container.current) return;

    const svg = d3.select(d3Container.current);

    const fontSize = 16;
    const padding = 4;

    // ----- //
    // Setup //
    // ----- //

    /**
     * get transform for arrow rendering
     *
     * This transform takes anything with points (a graph link) and returns a
     * transform that puts an arrow on the last point, aligned based off of the
     * second to last.
     */
    function arrowTransform({
      points
    }) {
      const [[x1, y1], [x2, y2]] = points.slice(0, 2).toReversed().map(point => [point[0], point[1]+padding+fontSize/2]);
      const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI + 90;
      const [x, y] = [x1 + (x2 - x1) * 0.8, y1 + (y2 - y1) * 0.8];
      console.log(x, y);
      return `translate(${x}, ${y}) rotate(${angle})`;
    }

    // our raw data to render
    const data = transformMapToGraphConnect(claimMap);
    console.log(data);
    if (data.length === 0) {
      svg
      .select(".nodes")
      .selectAll("g")
        .data([{
          x: Math.max(1, extractDisplayPartFromId(Object.keys(claimMap)[0]).length) * fontSize / 2 + padding,
          y: (fontSize + padding * 2)/2,
          data: Object.keys(claimMap)[0]
        }])
      .join((enter) =>
        enter
          .append("g")
          .attr("transform", ({ x, y }) => `translate(${x}, ${y})`)
          .attr("opacity", 1)
          .call((enter) => {
            enter
              .append("ellipse")
              .attr("rx", (d) => {
                return Math.max(1, extractDisplayPartFromId(d.data).length) * fontSize / 2 + padding;
              })
              .attr("ry", (fontSize + padding * 2)/2)
              .attr("fill", (n) => getNodeColor(n.data));
            enter
              .append("a")
              .attr("href", (d) => claimMap[d.data].subject)
              .attr("target", "_blank")
              .append("text")
              .text((d) => extractDisplayPartFromId(d.data))
              .attr("font-weight", "bold")
              .attr("font-family", "sans-serif")
              .attr("text-anchor", "middle")
              .attr("alignment-baseline", "middle")
              .attr("fill", "white")
              .attr("font-size", `${fontSize}px`);
          })
      );
      return;
    }
    
    // create our builder and turn the raw data into a graph
    
    const builder = d3dag.graphConnect();
    const graph = builder(data);

    // -------------- //
    // Compute Layout //
    // -------------- //

    // set the layout functions
    const nodeSize = [[...graph.nodes()].reduce((cur, n) => Math.max(cur, extractDisplayPartFromId(n.data).length), 1) * fontSize + padding * 2, fontSize + padding * 2];
    // this truncates the edges so we can render arrows nicely
    // const shape = d3dag.tweakShape(nodeSize, d3dag.shapeEllipse);
    // use this to render our edges
    const line = d3.line().curve(d3.curveBasis);
    // here's the layout operator, uncomment some of the settings
    const layout = d3dag
      .sugiyama()
      // .lane(d3dag.laneOpt())
      // .lane(d3dag.laneGreedy().topDown(false).compressed(true).bidirectional(false))
      .nodeSize((n) => [extractDisplayPartFromId(n.data).length * fontSize + padding * 8, fontSize + padding * 8])
      // .gap([nodeSize[0], nodeSize[1]/2.0])
      // .tweaks([shape]);

    // actually perform the layout and get the final size
    const { width, height } = layout(graph);

    // --------- //
    // Rendering //
    // --------- //

    // colors
    const steps = graph.nnodes() - 1;
    const interp = d3.interpolateRainbow;
    const colorMap = new Map(
      [...graph.nodes()]
        .sort((a, b) => a.y - b.y)
        .map((node, i) => [node.data, interp(i / steps)])
    );

    // global
    svg
      // pad a little for link thickness
      .style("width", width + padding)
      .style("height", height + padding);
    const trans = svg.transition().duration(750);

    svg
      .select(".links")
      .selectAll("path")
      .remove();
    
    svg
      .select(".nodes")
      .selectAll("g")
      .remove();
    
    svg
      .select(".arrows")
      .selectAll("path")
      .remove();
    
    debugger;


    // nodes
    svg
      .select(".nodes")
      .selectAll("g")
      .data(graph.nodes())
      .join((enter) =>
        enter
          .append("g")
          .attr("transform", ({ x, y }) => `translate(${x}, ${y})`)
          .attr("opacity", 0)
          .call((enter) => {
            enter
              .append("ellipse")
              .attr("rx", (d) => {
                return Math.max(1, extractDisplayPartFromId(d.data).length) * fontSize / 2 + padding;
              })
              .attr("ry", (fontSize + padding * 2)/2)
              .attr("fill", (n) => getNodeColor(n.data));
            enter
              .append("a")
              .attr("href", (d) => claimMap[d.data].subject)
              .attr("target", "_blank")
              .append("text")
              .text((d) => extractDisplayPartFromId(d.data))
              .attr("font-weight", "bold")
              .attr("font-family", "sans-serif")
              .attr("text-anchor", "middle")
              .attr("alignment-baseline", "middle")
              .attr("fill", "white")
              .attr("font-size", `${fontSize}px`);
            enter.transition(trans).attr("opacity", 1);
          })
      );

    // link paths      
    svg
      .select(".links")
      .selectAll("path")
      .data(graph.links())
      .join((enter) =>
        enter
          .append("path")
          .attr("d", ({ points }) => line(points.map(point => [point[0], point[1]+padding+fontSize/2])))
          .attr("fill", "none")
          .attr("stroke-width", 3)
          .attr("stroke", ({ target }) => getNodeColor(target.data))
          .attr("opacity", 0)
          .call((enter) => enter.transition(trans).attr("opacity", 0.5))
      );

    // Arrows
    const arrowSize = 100;
    const arrowLen = Math.sqrt((4 * arrowSize) / Math.sqrt(3));
    const arrow = d3.symbol().type(d3.symbolTriangle).size(arrowSize);
    svg
      .select(".arrows")
      .selectAll("path")
      .data(graph.links())
      .join((enter) =>
        enter
          .append("path")
          .attr("d", arrow)
          .attr("fill", ({ target }) => getNodeColor(target.data))
          .attr("transform", arrowTransform)
          .attr("opacity", 0)
          .attr("stroke", "white")
          .attr("stroke-width", 2)
          // use this to put a white boundary on the tip of the arrow
          .attr("stroke-dasharray", `${arrowLen},${arrowLen}`)
          .call((enter) => enter.transition(trans).attr("opacity", 0.5))
    );

    // svg.style("overflow", "auto");
    
  }, [d3Container.current, walkResult]);
  return (
    <div class="w-full p-16">
      <div class="flex justify-center p-4">
        {errors && errors.map(err => (
          <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
            <p>{getErrorMessage(err)}</p>
          </div>
        ))}
      </div>
      <div class="flex justify-center bg-white rounded p-8 overflow-scroll">
        <div>
          <svg ref={d3Container}>
            <g transform="translate(2, 2)">
              {/* <defs className="defs" /> */}
              <g className="links" />
              <g className="arrows" />
              <g className="nodes" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
