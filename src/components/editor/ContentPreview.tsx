import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, ThumbsUp, Repeat, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../../supabase/auth";

interface ContentPreviewProps {
  content: string;
  contentType: "post" | "article" | "infographic";
}

const ContentPreview = ({ content, contentType }: ContentPreviewProps) => {
  const { user } = useAuth();
  const userEmail = user?.email || "user@example.com";
  const userName = user?.user_metadata?.full_name || "User";

  const formatDate = () => {
    const now = new Date();
    return now.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <Avatar>
            <AvatarImage
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userEmail}`}
            />
            <AvatarFallback>{userName[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{userName}</p>
                <p className="text-sm text-gray-500">{formatDate()}</p>
              </div>
            </div>

            <div className="mt-3">
              {contentType === "post" && (
                <div className="text-sm">{content}</div>
              )}

              {contentType === "article" && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    {content.split("\n")[0].replace("# ", "")}
                  </h3>
                  <div className="text-sm text-gray-700">
                    {content
                      .split("\n")
                      .slice(1, 3)
                      .join(" ")
                      .substring(0, 150)}
                    ...
                  </div>
                  <Button variant="link" className="px-0 mt-1 text-blue-600">
                    Read article
                  </Button>
                </div>
              )}

              {contentType === "infographic" && (
                <div>
                  <div className="bg-gray-100 rounded-md p-4 flex items-center justify-center h-[200px] mb-2">
                    <p className="text-gray-500 text-center">
                      [Infographic Preview]
                    </p>
                  </div>
                  <p className="text-sm">{content}</p>
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center space-x-4 text-gray-500 text-sm">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1"
              >
                <ThumbsUp className="h-4 w-4" />
                <span>Like</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Comment</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1"
              >
                <Repeat className="h-4 w-4" />
                <span>Repost</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1"
              >
                <Send className="h-4 w-4" />
                <span>Send</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentPreview;
