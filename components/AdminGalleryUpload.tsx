import { useState } from "react";
import { db } from "@/firebase/firebase";
import { collection, addDoc } from "firebase/firestore";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Plus } from "lucide-react";

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

  if (!isAdmin) return null;

  const handleUpload = async () => {
    if (!imageUrls || !eventName) {
      setError("Моля, въведете URL на снимките и име на събитието");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const eventData = {
        name: eventName,
        createdAt: new Date(),
      };

      const eventRef = await addDoc(collection(db, "events"), eventData);

      // Split URLs by newline and filter empty lines
      const urlList = imageUrls.split("\n").filter((url) => url.trim() !== "");

      const uploadPromises = urlList.map(async (url, index) => {
        return addDoc(collection(db, "gallery"), {
          imageUrl: url.trim(),
          competitionId: eventRef.id,
          competitionName: eventName,
          caption: `${eventName} - Снимка ${index + 1}`,
          createdAt: new Date(),
        });
      });

      await Promise.all(uploadPromises);
      setEventName("");
      setImageUrls("");
      setIsOpen(false);
      onEventCreated?.();
    } catch (error) {
      setError("Грешка при запазването на снимките");
      console.error("Error saving:", error);
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
          <DialogTitle>Добави ново събитие</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <Input
            type="text"
            placeholder="Име на събитието"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
          />
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
            {uploading ? "Запазване..." : "Създай събитие"}
          </Button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminGalleryUpload;
