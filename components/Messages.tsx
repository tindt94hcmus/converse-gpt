"use client";

import { useEffect, useRef, useState } from "react";
import {
  useFloating,
  useDismiss,
  useInteractions,
  flip,
  shift,
  inline,
  autoUpdate,
  arrow,
  offset,
} from "@floating-ui/react";
import { Card } from "./ui/card";
import { ChevronDownCircle } from "lucide-react";
import Lookup from "./Lookup";
import { Message } from "@/app/page";
import SubmitButton from "./SubmitButton";
import { Sender } from "./Sender";

interface Props {
  messages: Message[];
  onEdit: (id: string, message: string) => void;
}

function Messages({ messages, onEdit }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const arrowRef = useRef(null);

  const handleSubmitMessage = (id: string, message: string) => {
    onEdit(id, message);
  };

  const { refs, x, y, strategy, floatingStyles, context, middlewareData } =
    useFloating({
      placement: "bottom",
      open: isOpen,
      onOpenChange: setIsOpen,
      middleware: [
        inline(),
        flip(),
        shift(),
        offset(-16),
        arrow({ element: arrowRef }),
      ],
      whileElementsMounted: autoUpdate,
    });

  const dismiss = useDismiss(context);

  const { getFloatingProps } = useInteractions([dismiss]);

  useEffect(() => {
    function handleMouseUp(event: MouseEvent) {
      if (refs.floating.current?.contains(event.target as Element | null)) {
        return;
      }

      setTimeout(() => {
        const selection = window.getSelection();
        const range =
          typeof selection?.rangeCount === "number" && selection.rangeCount > 0
            ? selection.getRangeAt(0)
            : null;

        if (selection?.isCollapsed) {
          setIsOpen(false);
          return;
        }

        if (range) {
          refs.setReference({
            getBoundingClientRect: () => range.getBoundingClientRect(),
            getClientRects: () => range.getClientRects(),
          });
          setIsOpen(true);
        }
      }, 500);
    }

    function handleMouseDown(event: MouseEvent) {
      if (refs.floating.current?.contains(event.target as Element | null)) {
        return;
      }

      if (window.getSelection()?.isCollapsed) {
        setIsOpen(false);
      }
    }

    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousedown", handleMouseDown);

    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, [refs]);

  return (
    <>
      <div
        className={`flex flex-col min-h-screen p-5 pt-20 ${
          messages.length > 0 ? "pb-96" : "pb-32"
        }`}
      >
        <div className="flex flex-col flex-1 space-y-5 max-w-3xl mx-auto">
          <SubmitButton />

          {!messages.length && (
            <div className="flex flex-col space-y-10 flex-1 items-center justify-end">
              <p className="text-gray-500 animate-pulse">
                Start a conversation
              </p>
              <ChevronDownCircle
                size={64}
                className="animate-bounce text-gray-500"
              />
            </div>
          )}

          <div className="p-5 space-y-5">
            {messages.map((message) => (
              <div key={message.id} className="space-y-5">
                {/* reciever */}
                <div className="pr-48">
                  <p className="message bg-gray-800 rounded-bl-none">
                    {message.response}
                  </p>
                </div>

                {/* sender */}
                <Sender
                  id={message.id}
                  message={message.sender}
                  onSubmit={handleSubmitMessage}
                />
              </div>
            ))}
          </div>
          {isOpen && (
            <Card
              ref={refs.setFloating}
              style={{
                position: strategy,
                top: x ?? 0,
                left: y ?? 0,
                ...floatingStyles,
              }}
              {...getFloatingProps()}
            >
              <Lookup open={isOpen} />
              <div
                ref={arrowRef}
                style={{
                  position: "absolute",
                  width: "10px",
                  height: "10px",
                  background: "inherit",
                  left:
                    middlewareData.arrow?.x != null
                      ? `${middlewareData.arrow.x}px`
                      : "",
                  top: "-5px",
                  transform: "rotate(45deg)",
                }}
              />
            </Card>
          )}
        </div>
      </div>
    </>
  );
}

export default Messages;
