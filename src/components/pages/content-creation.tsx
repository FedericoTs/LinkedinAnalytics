import React from "react";
import { useAuth } from "../../../supabase/auth";
import Sidebar from "../dashboard/layout/Sidebar";
import TopNavigation from "../dashboard/layout/TopNavigation";
import ContentCreationHub from "../dashboard/ContentCreationHub";

export default function ContentCreation() {
  const { user } = useAuth();

  if (!user) {
    return <div>Please sign in</div>;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeItem="Content Creation" />
      <div className="flex-1 flex flex-col">
        <TopNavigation />
        <main className="flex-1 overflow-auto p-6 pt-20">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Content Creation Hub</h1>
            <p className="text-gray-600 mb-8">
              Create and optimize your LinkedIn content with AI assistance.
              Generate professional posts, articles, and infographics tailored
              to your audience.
            </p>
            <div className="bg-white rounded-lg shadow-md p-6">
              <ContentCreationHub />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
