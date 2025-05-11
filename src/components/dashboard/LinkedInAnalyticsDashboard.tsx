import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ContentCreationHub from "./ContentCreationHub";
import PerformanceMetrics from "./PerformanceMetrics";
import NetworkVisualization from "./NetworkVisualization";
import RelationshipInsights from "./RelationshipInsights";

const LinkedInAnalyticsDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ContentCreationHub />
        <PerformanceMetrics />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NetworkVisualization />
        <RelationshipInsights />
      </div>
    </div>
  );
};

export default LinkedInAnalyticsDashboard;
