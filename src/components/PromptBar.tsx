import { useState } from "react";
import { Loader2Icon, SparklesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PromptBarProps {
  onSubmit: (query: string) => void;
  loading: boolean;
  error: string | null;
}

export function PromptBar({ onSubmit, loading, error }: PromptBarProps) {
  const [value, setValue] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const query = value.trim();
    if (!query || loading) return;
    onSubmit(query);
    setValue("");
  }

  return (
    <div className="absolute bottom-6 left-1/2 z-10 w-full max-w-xl -translate-x-1/2 px-4">
      {error && (
        <p className="bg-destructive/10 text-destructive animate-in fade-in slide-in-from-bottom-2 mb-2 rounded-md px-3 py-1.5 text-xs">
          {error}
        </p>
      )}
      <form
        onSubmit={handleSubmit}
        className={`bg-background/95 flex gap-2 rounded-full border p-1.5 shadow-lg backdrop-blur transition-all duration-300 focus-within:shadow-xl ${
          loading ? "ring-primary/40 ring-2" : "focus-within:ring-ring/30 focus-within:ring-2"
        }`}
      >
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="e.g. metrics dashboard for a fitness app, or a user invite screen"
          className="rounded-full border-none shadow-none focus-visible:ring-0"
          autoFocus
          // Not a real form field (no name/id to persist), so suppress the
          // browser's save/autofill suggestions rather than leave it default.
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          data-1p-ignore
          data-lpignore="true"
          data-form-type="other"
        />
        <Button type="submit" disabled={loading || !value.trim()} className="rounded-full transition-all active:scale-95">
          {loading ? <Loader2Icon className="animate-spin" /> : <SparklesIcon />}
          {loading ? "Asking Jev…" : "Generate"}
        </Button>
      </form>
    </div>
  );
}
