import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Network, Filter, ZoomIn, ZoomOut, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useAuth } from "../../../supabase/auth";
import { getNetworkData, initNeo4j } from "@/lib/neo4j";
import * as d3 from "d3";

interface Node {
  id: string;
  label: string;
  group: string;
  size: number;
}

interface Link {
  source: string;
  target: string;
  value: number;
}

interface NetworkData {
  nodes: Node[];
  links: Link[];
}

const NetworkVisualization = () => {
  const { user } = useAuth();
  const svgRef = useRef<SVGSVGElement>(null);
  const [networkData, setNetworkData] = useState<NetworkData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [zoomLevel, setZoomLevel] = useState<number[]>([100]);

  // Initialize Neo4j when component mounts
  useEffect(() => {
    initNeo4j();
  }, []);

  // Fetch network data
  const fetchNetworkData = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getNetworkData(user.id);
      setNetworkData(data);
    } catch (err) {
      console.error("Error fetching network data:", err);
      setError("Failed to load network data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchNetworkData();
  }, [user]);

  // Create or update visualization when data changes
  useEffect(() => {
    if (!networkData || !svgRef.current) return;

    // Clear previous visualization
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Apply zoom level
    const zoomFactor = zoomLevel[0] / 100;

    // Filter nodes based on selected filter
    let filteredNodes = [...networkData.nodes];
    let filteredLinks = [...networkData.links];

    if (filter !== "all") {
      filteredNodes = networkData.nodes.filter(
        (node) => node.group === filter || node.id === "you",
      );
      const nodeIds = new Set(filteredNodes.map((node) => node.id));
      filteredLinks = networkData.links.filter(
        (link) =>
          nodeIds.has(link.source as string) &&
          nodeIds.has(link.target as string),
      );
    }

    // Create force simulation
    const simulation = d3
      .forceSimulation(filteredNodes as any)
      .force(
        "link",
        d3
          .forceLink(filteredLinks)
          .id((d: any) => d.id)
          .distance(100),
      )
      .force("charge", d3.forceManyBody().strength(-300 * zoomFactor))
      .force("center", d3.forceCenter(width / 2, height / 2));

    // Create links
    const link = svg
      .append("g")
      .selectAll("line")
      .data(filteredLinks)
      .enter()
      .append("line")
      .attr("stroke", "#9CA3AF")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", (d: any) => Math.sqrt(d.value));

    // Create node groups
    const node = svg
      .append("g")
      .selectAll(".node")
      .data(filteredNodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .call(
        d3
          .drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended) as any,
      );

    // Add circles to nodes
    node
      .append("circle")
      .attr("r", (d: any) => d.size * zoomFactor)
      .attr("fill", (d: any) => {
        switch (d.group) {
          case "central":
            return "#3B82F6"; // blue
          case "first":
            return "#10B981"; // green
          case "second":
            return "#8B5CF6"; // purple
          case "third":
            return "#F59E0B"; // amber
          default:
            return "#6B7280"; // gray
        }
      })
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 1.5);

    // Add labels to nodes
    node
      .append("text")
      .attr("dx", (d: any) => d.size * zoomFactor + 5)
      .attr("dy", ".35em")
      .attr("font-size", 10 * zoomFactor)
      .text((d: any) => d.label);

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [networkData, filter, zoomLevel]);

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">
            Network Visualization
          </CardTitle>
          <Network className="h-5 w-5 text-gray-500" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter connections" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Connections</SelectItem>
                <SelectItem value="first">First Degree</SelectItem>
                <SelectItem value="second">Second Degree</SelectItem>
                <SelectItem value="third">Third Degree</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={fetchNetworkData}
              disabled={loading}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <ZoomOut className="h-4 w-4 text-gray-500" />
            <Slider
              value={zoomLevel}
              onValueChange={setZoomLevel}
              min={50}
              max={150}
              step={10}
              className="w-24"
            />
            <ZoomIn className="h-4 w-4 text-gray-500" />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md mb-4">
            {error}
          </div>
        )}

        <div className="bg-gray-50 border border-gray-200 rounded-md overflow-hidden">
          {loading ? (
            <div className="h-[300px] flex items-center justify-center">
              <div className="flex flex-col items-center">
                <RefreshCw className="h-8 w-8 text-gray-400 animate-spin" />
                <p className="mt-2 text-gray-500">Loading network data...</p>
              </div>
            </div>
          ) : (
            <svg
              ref={svgRef}
              className="w-full h-[300px]"
              style={{ minHeight: "300px" }}
            />
          )}
        </div>

        <div className="mt-4 text-sm text-gray-600">
          <p>
            {networkData
              ? `Your network has ${networkData.nodes.length - 1} connections across ${new Set(networkData.nodes.filter((n) => n.id !== "you").map((n) => n.group)).size} degrees.`
              : "Connect your LinkedIn account to visualize your professional network."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default NetworkVisualization;
