import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Network } from "lucide-react";

const NetworkVisualization = () => {
  // This would be replaced with actual network visualization logic
  // using a library like D3.js or a Neo4j visualization component
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
        <div className="bg-gray-50 border border-gray-200 rounded-md p-4 h-[300px] flex items-center justify-center">
          <div className="relative w-full h-full">
            {/* Simulated network graph */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              You
            </div>

            {/* Connection nodes */}
            <div className="absolute top-1/4 left-1/4 w-12 h-12 rounded-full bg-green-400 flex items-center justify-center text-white text-sm">
              C1
            </div>
            <div className="absolute top-1/3 right-1/4 w-10 h-10 rounded-full bg-purple-400 flex items-center justify-center text-white text-sm">
              C2
            </div>
            <div className="absolute bottom-1/4 left-1/3 w-14 h-14 rounded-full bg-yellow-400 flex items-center justify-center text-white text-sm">
              C3
            </div>
            <div className="absolute bottom-1/3 right-1/3 w-8 h-8 rounded-full bg-red-400 flex items-center justify-center text-white text-sm">
              C4
            </div>

            {/* Connection lines */}
            <svg
              className="absolute inset-0 w-full h-full"
              style={{ zIndex: -1 }}
            >
              <line
                x1="50%"
                y1="50%"
                x2="25%"
                y2="25%"
                stroke="#9CA3AF"
                strokeWidth="2"
              />
              <line
                x1="50%"
                y1="50%"
                x2="75%"
                y2="33%"
                stroke="#9CA3AF"
                strokeWidth="2"
              />
              <line
                x1="50%"
                y1="50%"
                x2="33%"
                y2="75%"
                stroke="#9CA3AF"
                strokeWidth="2"
              />
              <line
                x1="50%"
                y1="50%"
                x2="67%"
                y2="67%"
                stroke="#9CA3AF"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          <p>Your network has 4 main clusters with 24 total connections.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default NetworkVisualization;
