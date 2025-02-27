import { useState } from "react";
import { storage, db } from "@/firebase/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface AdminNewsUploadProps {
  isAdmin: boolean;
  onNewsCreated?: () => void;
}

const categories = ["Състезания", "Лагери", "Обучения", "Други"];

const AdminNewsUpload = ({ isAdmin, onNewsCreated }: AdminNewsUploadProps) => {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [link, setLink] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isAdmin) return null;

  const handleSubmit = async () => {
    if (!title || !excerpt || !category || !date || !image) {
      setError("Моля, попълнете всички полета");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const imageRef = ref(storage, `news/${Date.now()}_${image.name}`);
      await uploadBytes(imageRef, image);
      const imageUrl = await getDownloadURL(imageRef);

      await addDoc(collection(db, "news"), {
        title,
        excerpt,
        category,
        date,
        imageUrl,
        link,
        createdAt: new Date(),
      });

      setTitle("");
      setExcerpt("");
      setCategory("");
      setDate("");
      setLink("");
      setImage(null);
      setIsOpen(false);
      onNewsCreated?.();
    } catch (error) {
      setError("Грешка при създаването на новината");
      console.error("Error creating news:", error);
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
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Добави нова новина</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <Input
            placeholder="Заглавие"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="Кратко описание"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
          />
          <Select onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Изберете категория" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <Input
            placeholder="Линк към повече информация (незадължително)"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
          />
          <Button
            onClick={handleSubmit}
            disabled={uploading}
            className="w-full bg-orange-500 hover:bg-orange-600"
          >
            {uploading ? "Създаване..." : "Създай новина"}
          </Button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminNewsUpload;
