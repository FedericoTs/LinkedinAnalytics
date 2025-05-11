import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MessageSquare, FileText } from "lucide-react";

export type ContentType = "post" | "article";

interface ContentTypeSelectorProps {
  value: ContentType;
  onChange: (value: ContentType) => void;
}

const ContentTypeSelector = ({ value, onChange }: ContentTypeSelectorProps) => {
  return (
    <Tabs
      defaultValue={value}
      onValueChange={(value) => onChange(value as ContentType)}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="post">
          <MessageSquare className="h-4 w-4 mr-2" />
          Post
        </TabsTrigger>
        <TabsTrigger value="article">
          <FileText className="h-4 w-4 mr-2" />
          Article
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default ContentTypeSelector;
