"use client";

import { Message } from "@/app/page";
import SubmitButton from "./SubmitButton";
import { ChevronDownCircle } from "lucide-react";
import "./style.css";
import { useEffect, useRef, useState } from "react";
import Lookup from "./Lookup";
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
  autoPlacement,
} from "@floating-ui/react";
import { Card } from "./ui/card";
import clsx from "clsx";

interface Props {
  messages: Message[];
}

function Messages({ messages }: Props) {

  const handleMouseUp = (event: any) => {
    // const selectionRange = window.getSelection()?.getRangeAt(0);
    // const selectedText = getSelectedText();
    // if (selectionRange && selectedText && selectedText.length > 2) {
    //   // console.log(event.clientX, selectedText);
    //   // const element = document.createElement("span");
    //   // element.classList.add("selected-text");
    //   // element.textContent = selectedText;
    //   // window.getSelection()?.getRangeAt(0).surroundContents(element);
    //   const popover = document.getElementById("popover")!;
    //   const rect = selectionRange.getBoundingClientRect();
    //   popover.style.display = "block";
    //   popover.style.left = `${rect.left + window.scrollX}px`;
    //   popover.style.top = `${rect.bottom + window.scrollY}px`;
    // }
    // if (selectionRange) {
    //   const selectedText = selectionRange.cloneContents()?.textContent;
    //   if (selectedText) {
    //     lookup(selectedText);
    //   }
    // }
  };

  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    placement: "top",
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      inline(),
      flip(),
      shift(),
      offset(20),
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
              <div
                key={message.id}
                onMouseUp={handleMouseUp}
                className="space-y-5"
              >
                {/* reciever */}
                <div className="pr-48">
                  <p className="message bg-gray-800 rounded-bl-none">
                    {message.response}
                  </p>
                </div>

                {/* sender */}
                <div className="pl-48">
                  <p className="message text-left ml-auto rounded-br-none">
                    {message.sender}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {isOpen && (
            <Card
              ref={refs.setFloating}
              style={{
                ...floatingStyles,
                // background: "black",
                // color: "white",
                // padding: 4,
              }}
              {...getFloatingProps()}
            >
              <Lookup open={isOpen} />
            </Card>
          )}
        </div>
      </div>
    </>
  );
}

export default Messages;
