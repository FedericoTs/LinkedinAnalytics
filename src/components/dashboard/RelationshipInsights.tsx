import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Users, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const RelationshipInsights = () => {
  const recommendedConnections = [
    {
      name: "Sarah Johnson",
      role: "Marketing Director",
      company: "TechFlow",
      value: "High",
      avatar: "sarah",
    },
    {
      name: "Michael Chen",
      role: "Product Manager",
      company: "InnovateCorp",
      value: "Medium",
      avatar: "michael",
    },
    {
      name: "Aisha Patel",
      role: "Data Scientist",
      company: "AnalyticsPro",
      value: "High",
      avatar: "aisha",
    },
  ];

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">
            Relationship Insights
          </CardTitle>
          <Users className="h-5 w-5 text-gray-500" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Network Growth</h4>
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold">+12%</span>
                  <p className="text-xs text-gray-500 mt-1">
                    Growth this month
                  </p>
                </div>
                <div>
                  <span className="text-lg font-semibold">342</span>
                  <p className="text-xs text-gray-500 mt-1">
                    Total connections
                  </p>
                </div>
                <div>
                  <span className="text-lg font-semibold">24</span>
                  <p className="text-xs text-gray-500 mt-1">New this month</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">
              Strategic Connection Opportunities
            </h4>
            <div className="space-y-3">
              {recommendedConnections.map((connection, index) => (
                <div
                  key={index}
                  className="bg-gray-50 border border-gray-200 rounded-md p-3 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${connection.avatar}`}
                        alt={connection.name}
                      />
                      <AvatarFallback>{connection.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="ml-3">
                      <p className="text-sm font-medium">{connection.name}</p>
                      <p className="text-xs text-gray-500">
                        {connection.role} at {connection.company}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span
                      className={`text-xs font-medium mr-3 ${connection.value === "High" ? "text-green-600" : "text-blue-600"}`}
                    >
                      {connection.value === "High" && (
                        <BadgeCheck className="h-3 w-3 inline mr-1" />
                      )}
                      {connection.value}
                    </span>
                    <Button size="sm" variant="outline">
                      <UserPlus className="h-3 w-3 mr-1" />
                      Connect
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <Button variant="link" size="sm" className="text-gray-500">
              View all recommendations
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RelationshipInsights;
