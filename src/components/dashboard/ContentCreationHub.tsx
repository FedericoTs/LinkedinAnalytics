import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Image, MessageSquare, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ContentCreationHub = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [contentType, setContentType] = useState("post");
  const [generatedContent, setGeneratedContent] = useState("");

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      const content = {
        post: "Just published our quarterly industry report on emerging tech trends. The data shows AI adoption has increased 43% YoY across mid-market companies. Key takeaway: companies integrating AI into customer service see 31% higher retention rates. #AITrends #IndustryInsights",
        article:
          "# The Future of AI in Business Operations\n\nIn today's rapidly evolving business landscape, artificial intelligence is no longer just a competitive advantage—it's becoming a necessity for operational efficiency...\n\n## Key Findings from Our Research\n\n1. Companies implementing AI solutions see an average 27% reduction in operational costs\n2. Customer satisfaction scores improve by 31% when AI is used in service interactions\n3. Decision-making speed increases by 41% with AI-powered analytics",
        infographic:
          "[This would contain a visual representation of AI adoption statistics across industries with colorful charts and icons]",
      };
      setGeneratedContent(content[contentType]);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">
            Content Creation Hub
          </CardTitle>
          <FileText className="h-5 w-5 text-gray-500" />
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="post" onValueChange={setContentType}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="post">
              <MessageSquare className="h-4 w-4 mr-2" />
              Post
            </TabsTrigger>
            <TabsTrigger value="article">
              <FileText className="h-4 w-4 mr-2" />
              Article
            </TabsTrigger>
            <TabsTrigger value="infographic">
              <Image className="h-4 w-4 mr-2" />
              Infographic
            </TabsTrigger>
          </TabsList>

          <div className="mt-4 space-y-4">
            <div>
              <label className="text-sm font-medium">Topic</label>
              <Textarea
                placeholder="Enter the topic or key points for your content"
                className="mt-1"
                defaultValue="AI adoption trends in business operations"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Tone</label>
                <Select defaultValue="professional">
                  <SelectTrigger>
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="conversational">
                      Conversational
                    </SelectItem>
                    <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                    <SelectItem value="informative">Informative</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Template</label>
                <Select defaultValue="standard">
                  <SelectTrigger>
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="data-driven">Data-Driven</SelectItem>
                    <SelectItem value="storytelling">Storytelling</SelectItem>
                    <SelectItem value="question">Question-Based</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              className="w-full"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Content"
              )}
            </Button>

            {generatedContent && (
              <div className="mt-4">
                <label className="text-sm font-medium">Generated Content</label>
                <div className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-md">
                  <pre className="whitespace-pre-wrap text-sm">
                    {generatedContent}
                  </pre>
                </div>
                <div className="mt-2 flex justify-end space-x-2">
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button size="sm">Use This</Button>
                </div>
              </div>
            )}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ContentCreationHub;
