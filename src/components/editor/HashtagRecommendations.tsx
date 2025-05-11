import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface HashtagRecommendationsProps {
  topic: string;
  onAddHashtag: (hashtag: string) => void;
}

const HashtagRecommendations = ({
  topic,
  onAddHashtag,
}: HashtagRecommendationsProps) => {
  // Generate hashtag recommendations based on the topic
  const generateHashtags = (topic: string): string[] => {
    // Split the topic into words
    const words = topic.toLowerCase().split(/\s+/);

    // Common industry hashtags
    const industryHashtags = [
      "AI",
      "MachineLearning",
      "DataScience",
      "Tech",
      "Innovation",
      "DigitalTransformation",
      "Business",
      "Leadership",
      "Marketing",
      "SocialMedia",
      "Strategy",
      "Growth",
      "Productivity",
      "Success",
      "Networking",
      "ProfessionalDevelopment",
      "CareerAdvice",
    ];

    // Generate topic-specific hashtags
    const topicHashtags = words
      .filter((word) => word.length > 3) // Filter out short words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter
      .filter((word) => !word.match(/[^a-zA-Z0-9]/)) // Remove words with special characters
      .map((word) => `${word}`);

    // Combine topic hashtags with some industry hashtags
    const combinedHashtags = [
      ...topicHashtags,
      ...industryHashtags.slice(0, 5), // Take first 5 industry hashtags
    ];

    // Remove duplicates and limit to 10 hashtags
    return Array.from(new Set(combinedHashtags)).slice(0, 10);
  };

  const recommendedHashtags = generateHashtags(topic);

  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium mb-2">Recommended Hashtags</h3>
      <div className="flex flex-wrap gap-2">
        {recommendedHashtags.map((hashtag, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="flex items-center gap-1 py-1 h-auto"
            onClick={() => onAddHashtag(hashtag)}
          >
            <PlusCircle className="h-3 w-3" />#{hashtag}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default HashtagRecommendations;
