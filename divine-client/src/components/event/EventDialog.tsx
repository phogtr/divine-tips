import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { EventContent } from "@/components/event/EventContent";

import { EventItem } from "@/types/event.type";

interface EventDialogProps {
  isOpen: boolean;
  onOpenChange: () => void;
  eventData: EventItem[];
}

export const EventDialog: React.FC<EventDialogProps> = ({
  isOpen,
  onOpenChange,
  eventData,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger />
      <DialogContent
        className="bg-primary-50"
        overlayClassname="bg-transparent"
      >
        <DialogHeader>
          <DialogTitle className="text-center">Tomorrow</DialogTitle>

          <VisuallyHidden>
            <DialogDescription>Event for the next day</DialogDescription>
          </VisuallyHidden>
        </DialogHeader>

        <div>
          {eventData.map((d) => (
            <EventContent
              key={d.type}
              data={d}
              isTextStream={true}
              maxWidth="35%"
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
