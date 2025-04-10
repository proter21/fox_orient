import { useState, useEffect } from "react";
import { db } from "@/firebase/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "./ui/dialog";
import { Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AdminGalleryUploadProps {
  isAdmin: boolean;
  onEventCreated?: () => void;
}

const AdminGalleryUpload = ({
  isAdmin,
  onEventCreated,
}: AdminGalleryUploadProps) => {
  const [eventName, setEventName] = useState("");
  const [imageUrls, setImageUrls] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [events, setEvents] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>("");

  useEffect(() => {
    const fetchEvents = async () => {
      const eventsRef = collection(db, "events");
      const eventsSnapshot = await getDocs(eventsRef);
      const eventsData = eventsSnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
      }));
      setEvents(eventsData);
    };

    fetchEvents();
  }, []);

  if (!isAdmin) return null;

  const isValidImageUrl = async (url: string): Promise<boolean> => {
    try {
      new URL(url);
      if (url.includes("ibb.co")) {
        return url.startsWith("https://i.ibb.co/");
      }
      return true;
    } catch {
      return false;
    }
  };

  const handleUpload = async () => {
    if ((!selectedEventId && !eventName) || !imageUrls) {
      toast({
        title: "Грешка",
        description: "Моля, въведете всички необходими данни",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setError(null);

    try {
      let targetEventId = selectedEventId;
      let targetEventName =
        events.find((e) => e.id === selectedEventId)?.name || "";

      if (!targetEventId) {
        const eventRef = await addDoc(collection(db, "events"), {
          name: eventName,
          createdAt: new Date(),
        });
        targetEventId = eventRef.id;
        targetEventName = eventName;
      }

      const urlList = imageUrls
        .split("\n")
        .map((url) => url.trim())
        .filter((url) => url !== "");

      const validationResults = await Promise.all(
        urlList.map(async (url) => {
          try {
            new URL(url);
            const isValid = await isValidImageUrl(url);
            return { url, isValid };
          } catch {
            return { url, isValid: false };
          }
        })
      );

      const validUrls = validationResults
        .filter((result) => result.isValid)
        .map((result) => result.url);

      if (validUrls.length === 0) {
        toast({
          title: "Грешка",
          description: "Моля, въведете валидни URL адреси на снимки",
          variant: "destructive",
        });
        setUploading(false);
        return;
      }

      for (let i = 0; i < validUrls.length; i++) {
        const imageData = {
          imageUrl: validUrls[i],
          competitionId: targetEventId,
          competitionName: targetEventName,
          caption: `${targetEventName} - Снимка ${i + 1}`,
          createdAt: new Date(),
        };

        await addDoc(collection(db, "gallery"), imageData);
      }

      toast({
        title: selectedEventId
          ? "Снимките са добавени успешно"
          : "Събитието е създадено успешно",
        description: `${validUrls.length} снимки бяха качени`,
        variant: "default",
      });

      setEventName("");
      setImageUrls("");
      setSelectedEventId("");
      setIsOpen(false);
      onEventCreated?.();
    } catch (error) {
      console.error("Error saving:", error);
      toast({
        title: "Грешка при качването",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg bg-orange-500 hover:bg-orange-600">
          <Plus size={24} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Добави снимки</DialogTitle>
          <DialogDescription>
            Изберете съществуващо събитие или създайте ново
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <select
            className="w-full p-2 border rounded-md"
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
          >
            <option value="">Създай ново събитие</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.name}
              </option>
            ))}
          </select>

          {!selectedEventId && (
            <Input
              type="text"
              placeholder="Име на новото събитие"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />
          )}

          <textarea
            placeholder="Въведете URL адресите на снимките (по един на ред)"
            value={imageUrls}
            onChange={(e) => setImageUrls(e.target.value)}
            className="w-full h-32 p-2 border rounded-md"
          />

          <Button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full bg-orange-500 hover:bg-orange-600"
          >
            {uploading
              ? "Запазване..."
              : selectedEventId
              ? "Добави снимки"
              : "Създай събитие"}
          </Button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminGalleryUpload;
