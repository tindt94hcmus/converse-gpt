"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CardContent } from "./ui/card";
import Word from "./Word";
import { Languages } from "lucide-react";
import { NoDefinition } from "./NoDefinition";

function waitMs(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function Loading() {
  return (
    <div className="mt-4">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
      <div className="flex items-center space-x-4 mt-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
      <div className="flex items-center space-x-4 mt-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
      <div className="flex items-center space-x-4 mt-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    </div>
  );
}

interface LookupProps {
  open: boolean;
}

function Lookup({ open }: LookupProps) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState([]);
  const [error, setError] = useState<any>(undefined);
  const [query, setQuery] = useState(getSelectedText());

  const lookup = async (text: string) => {
    // const text = query;
    if (text) {
      setLoading(true);
      try {
        const res = await fetch("/api/lookup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text }),
        });

        const json = await res.json();
        await waitMs(250);

        if (json) {
          if (json.title === "No Definitions Found") {
            setError(json);
            setResult([]);
          } else {
            setError(undefined);
            setResult(json);
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  function getSelectedText() {
    if (window.getSelection) {
      return window.getSelection()?.toString();
    }
    return "";
  }

  const handleClick = async (event: any) => {
    event.stopPropagation();
    event.preventDefault();
    setShow(true);
    if (query) {
      lookup(query);
    }
  };

  if (!open) return null;

  if (!show)
    return (
      <Button size="sm" variant="outline" onClick={handleClick}>
        <Languages className="mr-2 h-4 w-4" /> Define
      </Button>
    );

  return (
    <CardContent className="min-w-[350px] max-w-md max-h-[500px] overflow-y-auto">
      {loading && <Loading />}
      {error && <NoDefinition word={query} result={error} />}
      {!loading && result[0] && (
        <Word
          word={result[0]}
          setKeyword={setQuery}
          searchQuery={(query: string) => lookup(query)}
        />
      )}
    </CardContent>
  );
}

export default Lookup;
