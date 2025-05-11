import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ContentSettingsProps {
  topic: string;
  onTopicChange: (topic: string) => void;
  template: string;
  onTemplateChange: (template: string) => void;
}

interface Template {
  id: string;
  name: string;
  content: string;
  type: "system" | "personal";
}

const ContentSettings = ({
  topic,
  onTopicChange,
  template,
  onTemplateChange,
}: ContentSettingsProps) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [personalTemplates, setPersonalTemplates] = useState<Template[]>(() => {
    // Load saved templates from localStorage
    const savedTemplates = localStorage.getItem("personal-templates");
    return savedTemplates ? JSON.parse(savedTemplates) : [];
  });

  const systemTemplates: Template[] = [
    { id: "standard", name: "Standard", content: "", type: "system" },
    { id: "data-driven", name: "Data-Driven", content: "", type: "system" },
    { id: "storytelling", name: "Storytelling", content: "", type: "system" },
    { id: "question", name: "Question-Based", content: "", type: "system" },
  ];

  const allTemplates = [...systemTemplates, ...personalTemplates];

  const handleSaveTemplate = () => {
    if (!newTemplateName.trim()) {
      toast({
        title: "Template name required",
        description: "Please enter a name for your template",
        variant: "destructive",
      });
      return;
    }

    const newTemplate: Template = {
      id: `personal-${Date.now()}`,
      name: newTemplateName,
      content: topic, // Save current topic as template content
      type: "personal",
    };

    const updatedTemplates = [...personalTemplates, newTemplate];
    setPersonalTemplates(updatedTemplates);
    localStorage.setItem(
      "personal-templates",
      JSON.stringify(updatedTemplates),
    );

    setNewTemplateName("");
    setIsDialogOpen(false);

    toast({
      title: "Template saved",
      description: "Your template has been saved successfully",
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Topic</label>
        <Textarea
          placeholder="Enter the topic or key points for your content"
          className="mt-1"
          value={topic}
          onChange={(e) => onTopicChange(e.target.value)}
        />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Template</label>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" /> Save as Template
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save as Template</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <label className="text-sm font-medium">Template Name</label>
                <Input
                  placeholder="Enter template name"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  className="mt-1"
                />
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveTemplate}>
                  <Save className="h-4 w-4 mr-1" /> Save Template
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <Select
          value={template}
          onValueChange={onTemplateChange}
          className="mt-1"
        >
          <SelectTrigger>
            <SelectValue placeholder="Select template" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="system-header" disabled>
              System Templates
            </SelectItem>
            {systemTemplates.map((tmpl) => (
              <SelectItem key={tmpl.id} value={tmpl.id}>
                {tmpl.name}
              </SelectItem>
            ))}

            {personalTemplates.length > 0 && (
              <>
                <SelectItem value="personal-header" disabled className="mt-2">
                  Personal Templates
                </SelectItem>
                {personalTemplates.map((tmpl) => (
                  <SelectItem key={tmpl.id} value={tmpl.id}>
                    {tmpl.name}
                  </SelectItem>
                ))}
              </>
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ContentSettings;
