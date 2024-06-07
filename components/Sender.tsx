import { useCallback, useState } from "react";
import { Button } from "./ui/button";
import { Pencil } from "lucide-react";

interface Props {
  id: string;
  message: string;
  onSubmit: (id: string, message: string) => void;
}

export const Sender = ({ id, message, onSubmit }: Props) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(message);

  const handleSend = useCallback(() => {
    onSubmit?.(id, value);
    setEditing(false);
  }, [value]);

  if (editing) {
    return (
      <div className="pl-48">
        <div className="message w-full">
          <input
            className="w-full bg-transparent outline-none"
            onChange={(e) => setValue(e.target.value)}
            value={value}
          />
          <div className="flex justify-end gap-2 mt-2">
            <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-purple-900 hover:bg-purple-700"
              onClick={handleSend}
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group/item flex justify-end gap-2">
      <Button
        variant="ghost"
        size="icon"
        className="group/icon hidden group-hover/item:flex rounded-full"
        onClick={() => setEditing(true)}
      >
        <Pencil className="h-4 w-4 text-white group-hover/icon:text-primary" />
      </Button>
      <p className="message text-left rounded-br-none">{value}</p>
    </div>
  );
};
