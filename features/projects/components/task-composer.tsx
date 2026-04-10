"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";

interface TaskComposerProps {
  status: string;
  onAdd: (title: string, status: string) => Promise<any>;
  isPending: boolean;
}

export function TaskComposer({ status, onAdd, isPending }: TaskComposerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async () => {
    if (!title.trim() || isPending) return;
    await onAdd(title.trim(), status);
    setTitle(""); // Clear text but stay open
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape") {
      setIsEditing(false);
      setTitle("");
    }
  };

  useEffect(() => {
    if (isEditing) textareaRef.current?.focus();
  }, [isEditing]);

  if (!isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className="flex items-center gap-2 w-full p-2 text-zinc-500 hover:bg-zinc-800/40 hover:text-zinc-300 transition-all rounded-lg text-sm font-medium"
      >
        <Plus size={16} />
        Add a card
      </button>
    );
  }

  return (
    <div className="p-2 space-y-2">
      <Textarea
        ref={textareaRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter a title..."
        className="bg-zinc-950 border-zinc-800 focus-visible:ring-zinc-700 min-h-[70px] text-sm resize-none"
      />
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={handleSubmit} disabled={isPending || !title.trim()}>
          Add Card
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-zinc-500" 
          onClick={() => { setIsEditing(false); setTitle(""); }}
        >
          <X size={18} />
        </Button>
      </div>
    </div>
  );
}