import React from "react";
import { useAuth } from "../../../supabase/auth";
import Sidebar from "../dashboard/layout/Sidebar";
import TopNavigation from "../dashboard/layout/TopNavigation";
import LinkedInAnalyticsDashboard from "../dashboard/LinkedInAnalyticsDashboard";

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    return <div>Please sign in</div>;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopNavigation />
        <main className="flex-1 overflow-auto p-6 pt-20">
          <LinkedInAnalyticsDashboard />
        </main>
      </div>
    </div>
  );
}
