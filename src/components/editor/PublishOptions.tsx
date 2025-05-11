import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Clock, Send } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PublishOptionsProps {
  onPublish: () => void;
  onSchedule: (date: Date, time: string) => void;
}

const PublishOptions = ({ onPublish, onSchedule }: PublishOptionsProps) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>("09:00");
  const [isScheduling, setIsScheduling] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublishNow = () => {
    setIsPublishing(true);
    // Simulate publishing process
    setTimeout(() => {
      onPublish();
      setIsPublishing(false);
    }, 1500);
  };

  const handleSchedule = () => {
    if (!date) return;

    setIsScheduling(true);
    // Simulate scheduling process
    setTimeout(() => {
      onSchedule(date, time);
      setIsScheduling(false);
    }, 1500);
  };

  // Generate time options (every 30 minutes)
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute of [0, 30]) {
        const formattedHour = hour.toString().padStart(2, "0");
        const formattedMinute = minute.toString().padStart(2, "0");
        options.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  return (
    <div className="mt-6 flex flex-col sm:flex-row gap-3">
      <Button
        onClick={handlePublishNow}
        className="flex-1"
        disabled={isPublishing}
      >
        {isPublishing ? (
          <>Publishing...</>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Publish Now
          </>
        )}
      </Button>

      <div className="flex flex-1 gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="flex-1 justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              disabled={(date) => date < new Date()}
            />
          </PopoverContent>
        </Popover>

        <Select value={time} onValueChange={setTime}>
          <SelectTrigger className="w-[120px]">
            <Clock className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Time" />
          </SelectTrigger>
          <SelectContent>
            {timeOptions.map((timeOption) => (
              <SelectItem key={timeOption} value={timeOption}>
                {timeOption}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          onClick={handleSchedule}
          disabled={!date || isScheduling}
          variant="secondary"
        >
          {isScheduling ? "Scheduling..." : "Schedule"}
        </Button>
      </div>
    </div>
  );
};

export default PublishOptions;
