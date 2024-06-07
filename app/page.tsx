"use client";

import transcript from "@/actions/transcript";
import { useFormState } from "react-dom";
import { useEffect, useRef, useState } from "react";
import Recorder from "@/components/Recorder";
import VoiceSynthesizer from "@/components/VoiceSynthesizer";
import Messages from "@/components/Messages";
import Image from "next/image";

const initialState = {
  sender: "",
  response: "",
  id: "",
};

export type Message = {
  sender: string;
  response: string;
  id: string;
};

export default function Home() {
  const [state, formAction] = useFormState(transcript, initialState);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const submitButtonRef = useRef<HTMLButtonElement | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const handleEdit = async (id: string, message: string) => {
    const index = messages.findIndex((message) => message.id === id);
    const newId = Math.random().toString(36);
    const res = await fetch("/api/completion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: message,
      }),
    });

    const resJson = await res.json();
    const text = resJson?.text;

    if (text && typeof text === "string") {
      const newMsg = {
        id: newId,
        sender: message,
        response: text,
      };
      setMessages((messages) => [newMsg, ...messages.slice(index + 1)]);
    } else {
      return;
    }
  };

  // Responsible for updating the messages when the Server Action completes
  useEffect(() => {
    if (!state) return;

    if (state.response && state.sender) {
      setMessages((messages) => [
        {
          sender: state.sender || "",
          response: state.response || "",
          id: state.id || "",
        },
        ...messages,
      ]);
    }
  }, [state]);

  const uploadAudio = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const audio = document.createElement("audio");
    audio.src = url;
    audio.controls = true;

    // Create a File object from the Blob
    const file = new File([blob], "audio.webm", { type: blob.type });

    // Set the file as the value of the file input element
    if (fileRef.current) {
      // Create a DataTransfer object to simulate a file input event
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileRef.current.files = dataTransfer.files;

      // Submit the form
      if (submitButtonRef.current) {
        submitButtonRef.current.click();
      }
    }
  };

  console.log(messages);

  return (
    <main className="bg-black h-screen overflow-y-scroll">
      <header className="flex fixed top-0 justify-between text-white w-full p-5">
        <div className="rounded-full overflow-hidden">
          <Image src="/logo.webp" alt="Logo" width={64} height={64} />
        </div>
      </header>

      <form action={formAction} className="flex flex-col bg-black">
        <div className="flex-1 bg-gradient-to-b from-purple-500 to-black">
          <Messages messages={messages} onEdit={handleEdit} />
        </div>

        <input type="file" name="file" ref={fileRef} hidden />
        <button type="submit" hidden ref={submitButtonRef} />

        <div className="fixed bottom-0 w-full overflow-hidden bg-black rounded-t-3xl">
          <Recorder uploadAudio={uploadAudio} />
          <div className="">
            <VoiceSynthesizer state={messages[0]} />
          </div>
        </div>
      </form>
    </main>
  );
}
