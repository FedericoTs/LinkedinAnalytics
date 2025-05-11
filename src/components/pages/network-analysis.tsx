import React from "react";
import { useAuth } from "../../../supabase/auth";
import Sidebar from "../dashboard/layout/Sidebar";
import TopNavigation from "../dashboard/layout/TopNavigation";
import NetworkVisualization from "../dashboard/NetworkVisualization";
import RelationshipInsights from "../dashboard/RelationshipInsights";

export default function NetworkAnalysis() {
  const { user } = useAuth();

  if (!user) {
    return <div>Please sign in</div>;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeItem="Network Analysis" />
      <div className="flex-1 flex flex-col">
        <TopNavigation />
        <main className="flex-1 overflow-auto p-6 pt-20">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Network Analysis</h1>
            <p className="text-gray-600 mb-8">
              Visualize and analyze your professional network to identify
              strategic connections and growth opportunities.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow-md">
                <NetworkVisualization />
              </div>
              <div className="bg-white rounded-lg shadow-md">
                <RelationshipInsights />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
