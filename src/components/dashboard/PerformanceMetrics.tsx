import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, TrendingUp, Users, Clock } from "lucide-react";

const PerformanceMetrics = () => {
  // This would be replaced with actual chart data
  const metrics = [
    {
      name: "Post Reach",
      value: "2,453",
      change: "+12%",
      icon: <BarChart2 className="h-5 w-5 text-blue-500" />,
    },
    {
      name: "Engagement Rate",
      value: "4.7%",
      change: "+0.8%",
      icon: <TrendingUp className="h-5 w-5 text-green-500" />,
    },
    {
      name: "Profile Views",
      value: "342",
      change: "+24%",
      icon: <Users className="h-5 w-5 text-purple-500" />,
    },
    {
      name: "Best Posting Time",
      value: "Tue, 9AM",
      change: "",
      icon: <Clock className="h-5 w-5 text-orange-500" />,
    },
  ];

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">
            Performance Metrics
          </CardTitle>
          <BarChart2 className="h-5 w-5 text-gray-500" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="bg-gray-50 p-4 rounded-lg border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {metric.icon}
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    {metric.name}
                  </span>
                </div>
                {metric.change && (
                  <span
                    className={`text-xs font-medium ${metric.change.startsWith("+") ? "text-green-600" : "text-red-600"}`}
                  >
                    {metric.change}
                  </span>
                )}
              </div>
              <div className="mt-2">
                <span className="text-2xl font-bold">{metric.value}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <h4 className="text-sm font-medium mb-2">Engagement Over Time</h4>
          <div className="bg-gray-50 border border-gray-200 rounded-md p-4 h-[150px] relative">
            {/* Simulated chart */}
            <div className="absolute bottom-4 left-0 right-0 h-[100px]">
              <div className="relative h-full">
                <div
                  className="absolute bottom-0 left-[10%] w-[5%] bg-blue-500 rounded-t-sm"
                  style={{ height: "40%" }}
                ></div>
                <div
                  className="absolute bottom-0 left-[20%] w-[5%] bg-blue-500 rounded-t-sm"
                  style={{ height: "65%" }}
                ></div>
                <div
                  className="absolute bottom-0 left-[30%] w-[5%] bg-blue-500 rounded-t-sm"
                  style={{ height: "45%" }}
                ></div>
                <div
                  className="absolute bottom-0 left-[40%] w-[5%] bg-blue-500 rounded-t-sm"
                  style={{ height: "70%" }}
                ></div>
                <div
                  className="absolute bottom-0 left-[50%] w-[5%] bg-blue-500 rounded-t-sm"
                  style={{ height: "90%" }}
                ></div>
                <div
                  className="absolute bottom-0 left-[60%] w-[5%] bg-blue-500 rounded-t-sm"
                  style={{ height: "75%" }}
                ></div>
                <div
                  className="absolute bottom-0 left-[70%] w-[5%] bg-blue-500 rounded-t-sm"
                  style={{ height: "60%" }}
                ></div>
                <div
                  className="absolute bottom-0 left-[80%] w-[5%] bg-blue-500 rounded-t-sm"
                  style={{ height: "80%" }}
                ></div>
              </div>
              <div className="absolute bottom-[-20px] left-0 right-0 flex justify-between text-xs text-gray-500">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceMetrics;
