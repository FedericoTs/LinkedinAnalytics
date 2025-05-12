import React, { useState, useEffect } from "react";
import { supabase } from "../../../supabase/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Image as ImageIcon,
  MessageSquare,
  Loader2,
  Save,
  Eye,
  Calendar,
  Upload,
  Layers,
  Palette,
  Sliders,
  PenTool,
  BarChart,
  Clock,
  Target,
  Sparkles,
  Trash2,
  Edit,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  Download,
  Share2,
} from "lucide-react";
import ContentEditor from "../editor/ContentEditor";
import ContentTypeSelector, {
  ContentType,
} from "../editor/ContentTypeSelector";
import ContentSettings from "../editor/ContentSettings";
import ContentPreview from "../editor/ContentPreview";
import HashtagRecommendations from "../editor/HashtagRecommendations";
import PublishOptions from "../editor/PublishOptions";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VisualContent {
  type: "single" | "carousel" | "infographic";
  images: Array<{
    url: string;
    caption?: string;
    alt?: string;
  }>;
  layout?: string;
}

interface ContentPurpose {
  type:
    | "informational"
    | "promotional"
    | "thought-leadership"
    | "engagement"
    | "other";
  description?: string;
}

interface AISettings {
  length: number; // 0-100 scale
  formality: number; // 0-100 scale
  creativity: number; // 0-100 scale
  includeHashtags: boolean;
  includeCTA: boolean;
}

interface TargetAudience {
  industries?: string[];
  jobTitles?: string[];
  interests?: string[];
  customDescription?: string;
}

const ContentCreationHub = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [contentType, setContentType] = useState<ContentType>("post");
  const [generatedContent, setGeneratedContent] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [topic, setTopic] = useState(
    "AI adoption trends in business operations",
  );
  // Tone is now extracted from template
  const [template, setTemplate] = useState("standard");
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [plainTextContent, setPlainTextContent] = useState("");
  const [scheduledPosts, setScheduledPosts] = useState<
    Array<{ date: Date; time: string; content: string; type: ContentType }>
  >([]);

  // New state variables for enhanced functionality
  const [activeTab, setActiveTab] = useState<"content" | "visual" | "optimize">(
    "content",
  );
  const [contentPurpose, setContentPurpose] = useState<ContentPurpose>({
    type: "informational",
  });
  const [description, setDescription] = useState("");
  const [targetAudience, setTargetAudience] = useState<TargetAudience>({});
  const [keyPoints, setKeyPoints] = useState<string[]>([]);
  const [newKeyPoint, setNewKeyPoint] = useState("");
  const [aiSettings, setAiSettings] = useState<AISettings>({
    length: 50,
    formality: 70,
    creativity: 50,
    includeHashtags: true,
    includeCTA: true,
  });
  const [visualContent, setVisualContent] = useState<VisualContent>({
    type: "single",
    images: [],
  });

  // Image classification state
  const [imageClassifications, setImageClassifications] = useState<
    Record<number, string>
  >({});
  const [isUploading, setIsUploading] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [bestTimeToPost, setBestTimeToPost] = useState<{
    day: string;
    time: string;
  } | null>(null);
  const [writingMode, setWritingMode] = useState<"manual" | "ai">("ai");

  // Load saved draft from local storage on component mount
  useEffect(() => {
    const savedDraft = localStorage.getItem("content-draft");
    if (savedDraft) {
      setEditorContent(savedDraft);
      // Extract plain text from HTML for preview
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = savedDraft;
      setPlainTextContent(tempDiv.textContent || tempDiv.innerText || "");
    }

    const savedSettings = localStorage.getItem("content-settings");
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setContentType(settings.contentType || "post");
        setTopic(settings.topic || "");
        // Tone is now extracted from template
        setTemplate(settings.template || "standard");

        // Load extended settings if available
        if (settings.contentPurpose) setContentPurpose(settings.contentPurpose);
        if (settings.description) setDescription(settings.description);
        if (settings.targetAudience) setTargetAudience(settings.targetAudience);
        if (settings.keyPoints) setKeyPoints(settings.keyPoints);
        if (settings.aiSettings) setAiSettings(settings.aiSettings);
        if (settings.visualContent) setVisualContent(settings.visualContent);
        if (settings.writingMode) setWritingMode(settings.writingMode);
      } catch (e) {
        console.error("Error parsing saved settings", e);
      }
    }

    const savedScheduled = localStorage.getItem("scheduled-posts");
    if (savedScheduled) {
      try {
        const scheduled = JSON.parse(savedScheduled);
        // Convert string dates back to Date objects
        const parsedScheduled = scheduled.map((post: any) => ({
          ...post,
          date: new Date(post.date),
        }));
        setScheduledPosts(parsedScheduled);
      } catch (e) {
        console.error("Error parsing saved scheduled posts", e);
      }
    }

    // Simulate fetching best time to post
    setTimeout(() => {
      setBestTimeToPost({ day: "Tuesday", time: "9:00 AM" });
    }, 1000);
  }, []);

  // Save settings to local storage when they change
  useEffect(() => {
    const settings = {
      contentType,
      topic,
      // tone removed,
      template,
      contentPurpose,
      description,
      targetAudience,
      keyPoints,
      aiSettings,
      visualContent,
      writingMode,
    };
    localStorage.setItem("content-settings", JSON.stringify(settings));
  }, [
    contentType,
    topic,
    template,
    contentPurpose,
    description,
    targetAudience,
    keyPoints,
    aiSettings,
    visualContent,
    writingMode,
  ]);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast({
        title: "Topic Required",
        description: "Please enter a topic for your content",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Call the OpenAI API via our Edge Function
      const { data, error } = await supabase.functions.invoke(
        "supabase-functions-create-completion",
        {
          body: {
            topic,
            contentType,
            contentPurpose,
            targetAudience,
            keyPoints,
            aiSettings,
            model: "gpt-3.5-turbo-instruct",
            max_tokens: contentType === "article" ? 1000 : 500,
            temperature: aiSettings.creativity / 100,
          },
        },
      );

      if (error) {
        throw new Error(error.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      // Set the generated content
      setGeneratedContent(data.content);
      setEditorContent(data.content);
      setPlainTextContent(data.content);

      toast({
        title: "Content Generated",
        description:
          "Your content has been generated successfully using OpenAI",
      });
    } catch (error) {
      console.error("Error generating content:", error);
      toast({
        title: "Generation Failed",
        description:
          error instanceof Error ? error.message : "Failed to generate content",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddKeyPoint = () => {
    if (newKeyPoint.trim()) {
      setKeyPoints([...keyPoints, newKeyPoint.trim()]);
      setNewKeyPoint("");
    }
  };

  const handleRemoveKeyPoint = (index: number) => {
    const updatedPoints = [...keyPoints];
    updatedPoints.splice(index, 1);
    setKeyPoints(updatedPoints);
  };

  const handleGenerateImage = () => {
    setIsGeneratingImage(true);

    // Simulate AI image generation
    setTimeout(() => {
      const newImage = {
        url: `https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80`,
        caption: `AI-generated visualization for ${topic}`,
        alt: `Visualization of ${topic}`,
      };

      setVisualContent((prev) => ({
        ...prev,
        images: [...prev.images, newImage],
      }));

      setIsGeneratingImage(false);

      toast({
        title: "Image Generated",
        description: "Your image has been generated successfully",
      });
    }, 2000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    // Simulate image upload
    setTimeout(() => {
      const newImages = Array.from(files).map((file, index) => {
        // In a real implementation, you would upload the file to a server
        // and get back a URL. Here we're creating an object URL as a placeholder.
        return {
          url: URL.createObjectURL(file),
          caption: `Image ${index + 1}`,
          alt: file.name,
        };
      });

      setVisualContent((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }));

      setIsUploading(false);

      toast({
        title: "Images Uploaded",
        description: `${newImages.length} image(s) uploaded successfully`,
      });
    }, 1500);
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = [...visualContent.images];
    updatedImages.splice(index, 1);
    setVisualContent({
      ...visualContent,
      images: updatedImages,
    });
  };

  const handleSaveDraft = () => {
    setIsDraftSaved(true);
    localStorage.setItem("content-draft", editorContent);

    toast({
      title: "Draft Saved",
      description: "Your content draft has been saved",
    });

    // Reset the saved state after a delay
    setTimeout(() => setIsDraftSaved(false), 2000);
  };

  const handleEditorChange = (html: string) => {
    setEditorContent(html);

    // Extract plain text from HTML for preview
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    setPlainTextContent(tempDiv.textContent || tempDiv.innerText || "");
  };

  const handleAddHashtag = (hashtag: string) => {
    // Add the hashtag to the end of the content
    const updatedContent = `${plainTextContent} #${hashtag}`;
    setPlainTextContent(updatedContent);
    setEditorContent(`<p>${updatedContent}</p>`);

    toast({
      title: "Hashtag Added",
      description: `#${hashtag} has been added to your content`,
    });
  };

  const handlePublish = () => {
    // Simulate publishing to LinkedIn
    toast({
      title: "Content Published",
      description: "Your content has been published to LinkedIn",
      variant: "default",
    });

    // Clear the editor after publishing
    setEditorContent("");
    setPlainTextContent("");
    setGeneratedContent("");
    localStorage.removeItem("content-draft");
  };

  const handleSchedule = (date: Date, time: string) => {
    // Add to scheduled posts
    const newScheduledPost = {
      date,
      time,
      content: plainTextContent,
      type: contentType,
    };

    const updatedScheduledPosts = [...scheduledPosts, newScheduledPost];
    setScheduledPosts(updatedScheduledPosts);

    // Save to local storage
    localStorage.setItem(
      "scheduled-posts",
      JSON.stringify(updatedScheduledPosts),
    );

    toast({
      title: "Content Scheduled",
      description: `Your content has been scheduled for ${date.toLocaleDateString()} at ${time}`,
      variant: "default",
    });

    // Clear the editor after scheduling
    setEditorContent("");
    setPlainTextContent("");
    setGeneratedContent("");
    localStorage.removeItem("content-draft");
  };

  const getMaxLength = () => {
    switch (contentType) {
      case "post":
        return 3000; // LinkedIn post character limit
      case "article":
        return 100000; // LinkedIn article character limit (arbitrary large number)
      default:
        return 3000;
    }
  };

  const getPlaceholder = () => {
    switch (contentType) {
      case "post":
        return "Write your LinkedIn post here...";
      case "article":
        return "Start writing your article here...";
      default:
        return "Start writing your content here...";
    }
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
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
        <Tabs
          defaultValue="content"
          onValueChange={(value) => setActiveTab(value as any)}
        >
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="content">
              <FileText className="h-4 w-4 mr-2" />
              Content
            </TabsTrigger>
            <TabsTrigger value="visual">
              <ImageIcon className="h-4 w-4 mr-2" />
              Visual
            </TabsTrigger>
            <TabsTrigger value="optimize">
              <BarChart className="h-4 w-4 mr-2" />
              Optimize
            </TabsTrigger>
          </TabsList>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-4">
            <ContentTypeSelector
              value={contentType}
              onChange={setContentType}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Writing Mode</Label>
                <div className="flex mt-1 space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroup
                      value={writingMode}
                      onValueChange={(value) =>
                        setWritingMode(value as "manual" | "ai")
                      }
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="manual" id="manual" />
                        <Label htmlFor="manual">Manual</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="ai" id="ai" />
                        <Label htmlFor="ai">AI Assistance</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Content Purpose</Label>
                <Select
                  value={contentPurpose.type}
                  onValueChange={(value) =>
                    setContentPurpose({ ...contentPurpose, type: value as any })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="informational">Informational</SelectItem>
                    <SelectItem value="promotional">Promotional</SelectItem>
                    <SelectItem value="thought-leadership">
                      Thought Leadership
                    </SelectItem>
                    <SelectItem value="engagement">Engagement</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <ContentSettings
              topic={topic}
              onTopicChange={setTopic}
              template={template}
              onTemplateChange={setTemplate}
            />

            {writingMode === "ai" && (
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="advanced-settings">
                  <AccordionTrigger className="text-sm font-medium">
                    Advanced AI Settings
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">
                          Target Audience
                        </Label>
                        <Textarea
                          placeholder="Describe your target audience (e.g., Marketing professionals in tech industry)"
                          className="mt-1"
                          value={targetAudience.customDescription || ""}
                          onChange={(e) =>
                            setTargetAudience({
                              ...targetAudience,
                              customDescription: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium">
                          Key Points to Include
                        </Label>
                        <div className="flex mt-1">
                          <Input
                            placeholder="Add a key point"
                            value={newKeyPoint}
                            onChange={(e) => setNewKeyPoint(e.target.value)}
                            className="flex-1"
                          />
                          <Button
                            onClick={handleAddKeyPoint}
                            className="ml-2"
                            disabled={!newKeyPoint.trim()}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        {keyPoints.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {keyPoints.map((point, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
                              >
                                <span className="text-sm">{point}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveKeyPoint(index)}
                                >
                                  <X className="h-4 w-4 text-gray-500" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        <Label className="text-sm font-medium">
                          Brief Description/Outline
                        </Label>
                        <Textarea
                          placeholder="Provide a brief description or outline of your content"
                          className="mt-1"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between">
                            <Label className="text-sm font-medium">
                              Content Length
                            </Label>
                            <span className="text-xs text-gray-500">
                              {aiSettings.length < 33
                                ? "Short"
                                : aiSettings.length < 66
                                  ? "Medium"
                                  : "Long"}
                            </span>
                          </div>
                          <Slider
                            value={[aiSettings.length]}
                            onValueChange={(value) =>
                              setAiSettings({ ...aiSettings, length: value[0] })
                            }
                            max={100}
                            step={1}
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between">
                            <Label className="text-sm font-medium">
                              Formality
                            </Label>
                            <span className="text-xs text-gray-500">
                              {aiSettings.formality < 33
                                ? "Casual"
                                : aiSettings.formality < 66
                                  ? "Neutral"
                                  : "Formal"}
                            </span>
                          </div>
                          <Slider
                            value={[aiSettings.formality]}
                            onValueChange={(value) =>
                              setAiSettings({
                                ...aiSettings,
                                formality: value[0],
                              })
                            }
                            max={100}
                            step={1}
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between">
                            <Label className="text-sm font-medium">
                              Creativity
                            </Label>
                            <span className="text-xs text-gray-500">
                              {aiSettings.creativity < 33
                                ? "Conservative"
                                : aiSettings.creativity < 66
                                  ? "Balanced"
                                  : "Creative"}
                            </span>
                          </div>
                          <Slider
                            value={[aiSettings.creativity]}
                            onValueChange={(value) =>
                              setAiSettings({
                                ...aiSettings,
                                creativity: value[0],
                              })
                            }
                            max={100}
                            step={1}
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center justify-between">
                          <Label
                            className="text-sm font-medium"
                            htmlFor="include-hashtags"
                          >
                            Include Hashtags
                          </Label>
                          <Switch
                            id="include-hashtags"
                            checked={aiSettings.includeHashtags}
                            onCheckedChange={(checked) =>
                              setAiSettings({
                                ...aiSettings,
                                includeHashtags: checked,
                              })
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <Label
                            className="text-sm font-medium"
                            htmlFor="include-cta"
                          >
                            Include Call to Action
                          </Label>
                          <Switch
                            id="include-cta"
                            checked={aiSettings.includeCTA}
                            onCheckedChange={(checked) =>
                              setAiSettings({
                                ...aiSettings,
                                includeCTA: checked,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}

            <div className="flex gap-2">
              {writingMode === "ai" && (
                <Button
                  onClick={handleGenerate}
                  className="flex-1"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Content
                    </>
                  )}
                </Button>
              )}
              {writingMode === "manual" && editorContent && (
                <Button
                  onClick={handleGenerate}
                  className="flex-1"
                  disabled={isGenerating}
                  variant="outline"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Reviewing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Review Content
                    </>
                  )}
                </Button>
              )}
            </div>

            {(generatedContent || editorContent) && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">
                    {showPreview ? "Content Preview" : "Content Editor"}
                  </label>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={togglePreview}>
                      <Eye className="mr-2 h-4 w-4" />
                      {showPreview ? "Edit" : "Preview"}
                    </Button>
                    {!showPreview && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSaveDraft}
                        disabled={isDraftSaved}
                      >
                        {isDraftSaved ? (
                          "Saved"
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Draft
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>

                {showPreview ? (
                  <ContentPreview
                    content={plainTextContent}
                    contentType={contentType}
                  />
                ) : (
                  <ContentEditor
                    initialContent={editorContent}
                    placeholder={getPlaceholder()}
                    maxLength={getMaxLength()}
                    onChange={handleEditorChange}
                    onSave={handleSaveDraft}
                  />
                )}
              </div>
            )}
          </TabsContent>

          {/* Visual Tab */}
          <TabsContent value="visual" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Visual Type</Label>
                <Select
                  value={visualContent.type}
                  onValueChange={(value) =>
                    setVisualContent({ ...visualContent, type: value as any })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select visual type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single Image</SelectItem>
                    <SelectItem value="carousel">Carousel</SelectItem>
                    <SelectItem value="infographic">Infographic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Layout Template</Label>
                <Select
                  value={visualContent.layout || ""}
                  onValueChange={(value) =>
                    setVisualContent({ ...visualContent, layout: value })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select layout" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="data-driven">Data-Driven</SelectItem>
                    <SelectItem value="comparison">Comparison</SelectItem>
                    <SelectItem value="timeline">Timeline</SelectItem>
                    <SelectItem value="process">Process Flow</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-medium">Images</Label>
                <div className="flex gap-2">
                  <div className="relative">
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="image-upload"
                      multiple
                      onChange={handleImageUpload}
                    />
                    <Label htmlFor="image-upload" className="cursor-pointer">
                      <Button
                        variant="outline"
                        size="sm"
                        type="button"
                        disabled={isUploading}
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Images
                          </>
                        )}
                      </Button>
                    </Label>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGenerateImage}
                    disabled={isGeneratingImage}
                  >
                    {isGeneratingImage ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Image
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {visualContent.images.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {visualContent.images.map((image, index) => (
                    <div
                      key={index}
                      className="relative border rounded-md overflow-hidden"
                    >
                      <img
                        src={image.url}
                        alt={image.alt || `Image ${index + 1}`}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-2 right-2 flex gap-1">
                        <Button
                          variant="destructive"
                          size="icon"
                          className="h-8 w-8 rounded-full bg-white bg-opacity-70 hover:bg-opacity-100"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-8 w-8 rounded-full bg-white bg-opacity-70 hover:bg-opacity-100"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="p-2 bg-gray-50 space-y-2">
                        <Input
                          value={image.caption || ""}
                          onChange={(e) => {
                            const updatedImages = [...visualContent.images];
                            updatedImages[index] = {
                              ...image,
                              caption: e.target.value,
                            };
                            setVisualContent({
                              ...visualContent,
                              images: updatedImages,
                            });
                          }}
                          placeholder="Add caption"
                          className="text-sm"
                        />

                        <div className="flex items-center">
                          <label className="text-xs font-medium mr-2">
                            Image Type:
                          </label>
                          <Select
                            value={imageClassifications[index] || ""}
                            onValueChange={(value) => {
                              setImageClassifications((prev) => ({
                                ...prev,
                                [index]: value,
                              }));
                            }}
                          >
                            <SelectTrigger className="h-7 text-xs">
                              <SelectValue placeholder="Classify image" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="logo">Logo</SelectItem>
                              <SelectItem value="avatar">
                                Personal Avatar
                              </SelectItem>
                              <SelectItem value="background">
                                Background
                              </SelectItem>
                              <SelectItem value="product">Product</SelectItem>
                              <SelectItem value="chart">Chart/Graph</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-200 rounded-md p-8 text-center">
                  <ImageIcon className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No images added yet</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Upload images or generate with AI
                  </p>
                </div>
              )}
            </div>

            {visualContent.type === "infographic" &&
              visualContent.images.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Infographic Elements
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center justify-start"
                    >
                      <Layers className="mr-2 h-4 w-4" /> Add Chart
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center justify-start"
                    >
                      <PenTool className="mr-2 h-4 w-4" /> Add Text
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center justify-start"
                    >
                      <Palette className="mr-2 h-4 w-4" /> Add Icon
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center justify-start"
                    >
                      <Sliders className="mr-2 h-4 w-4" /> Adjust Layout
                    </Button>
                  </div>
                </div>
              )}
          </TabsContent>

          {/* Optimize Tab */}
          <TabsContent value="optimize" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                      Best Time to Post
                    </CardTitle>
                    <Clock className="h-4 w-4 text-gray-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  {bestTimeToPost ? (
                    <div className="text-center py-4">
                      <p className="text-2xl font-bold">{bestTimeToPost.day}</p>
                      <p className="text-xl">{bestTimeToPost.time}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Based on your audience's activity patterns
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <Loader2 className="h-8 w-8 text-gray-400 mx-auto animate-spin" />
                      <p className="text-sm text-gray-500 mt-2">
                        Analyzing audience patterns...
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                      Target Audience Insights
                    </CardTitle>
                    <Target className="h-4 w-4 text-gray-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Industry Professionals</span>
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: "65%" }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Decision Makers</span>
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: "42%" }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Tech Enthusiasts</span>
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: "78%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {contentType === "post" && plainTextContent && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Hashtag Recommendations
                </Label>
                <HashtagRecommendations
                  topic={topic}
                  onAddHashtag={handleAddHashtag}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Content Optimization Tips
              </Label>
              <div className="space-y-2">
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-md">
                  <p className="text-sm font-medium text-blue-800">
                    Add a clear call-to-action
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Posts with clear CTAs receive 36% more engagement
                  </p>
                </div>
                <div className="p-3 bg-green-50 border border-green-100 rounded-md">
                  <p className="text-sm font-medium text-green-800">
                    Include relevant industry hashtags
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    Using 3-5 targeted hashtags can increase reach by 40%
                  </p>
                </div>
                <div className="p-3 bg-amber-50 border border-amber-100 rounded-md">
                  <p className="text-sm font-medium text-amber-800">
                    Keep paragraphs short and scannable
                  </p>
                  <p className="text-xs text-amber-600 mt-1">
                    Content with shorter paragraphs gets 58% more reads
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <Label className="text-sm font-medium">Preview Mode</Label>
              <div className="flex items-center space-x-2">
                <Label htmlFor="mobile-preview" className="text-sm">
                  Mobile Preview
                </Label>
                <Switch
                  id="mobile-preview"
                  checked={showMobilePreview}
                  onCheckedChange={setShowMobilePreview}
                />
              </div>
            </div>

            <div
              className={`border rounded-md overflow-hidden ${showMobilePreview ? "max-w-[375px] mx-auto" : "w-full"}`}
            >
              <div className="bg-gray-100 p-2 flex items-center justify-between border-b">
                <div className="flex items-center">
                  {showMobilePreview ? (
                    <div className="h-2 w-16 bg-gray-300 rounded-full mx-auto" />
                  ) : (
                    <div className="flex space-x-1">
                      <div className="h-3 w-3 rounded-full bg-red-500" />
                      <div className="h-3 w-3 rounded-full bg-yellow-500" />
                      <div className="h-3 w-3 rounded-full bg-green-500" />
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm">
                    <Download className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className={`bg-white ${showMobilePreview ? "p-3" : "p-6"}`}>
                <ContentPreview
                  content={
                    plainTextContent || "Your content preview will appear here"
                  }
                  contentType={contentType}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Publish options - always visible at bottom */}
        {plainTextContent && (
          <div className="mt-6">
            <Separator className="my-4" />
            <PublishOptions
              onPublish={handlePublish}
              onSchedule={handleSchedule}
            />
          </div>
        )}

        {/* Scheduled Posts Section */}
        {scheduledPosts.length > 0 && (
          <div className="mt-6">
            <Separator className="my-4" />
            <h3 className="text-sm font-medium mb-3">Scheduled Posts</h3>
            <div className="space-y-3">
              {scheduledPosts.map((post, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">
                        {post.date.toLocaleDateString()} at {post.time}
                      </p>
                      <p className="text-xs text-gray-500 truncate max-w-[300px]">
                        {post.content.substring(0, 50)}...
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">{post.type}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContentCreationHub;
