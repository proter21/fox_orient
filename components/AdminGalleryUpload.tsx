import { useState } from "react";
import { storage, db } from "@/firebase/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
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
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  if (!isAdmin) return null;

  const handleUpload = async () => {
    if (!files || !eventName) {
      setError("Моля, изберете снимки и въведете име на събитието");
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

      const uploadPromises = Array.from(files).map(async (file, index) => {
        const storageRef = ref(storage, `gallery/${eventRef.id}/${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);

        return addDoc(collection(db, "gallery"), {
          imageUrl: url,
          competitionId: eventRef.id,
          competitionName: eventName,
          caption: `${eventName} - Снимка ${index + 1}`,
          createdAt: new Date(),
        });
      });

      await Promise.all(uploadPromises);
      setEventName("");
      setFiles(null);
      setIsOpen(false);
      onEventCreated?.();
    } catch (error) {
      setError("Грешка при качването на снимките");
      console.error("Error uploading:", error);
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
          <Input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setFiles(e.target.files)}
          />
          <Button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full bg-orange-500 hover:bg-orange-600"
          >
            {uploading ? "Качване..." : "Създай събитие"}
          </Button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminGalleryUpload;
