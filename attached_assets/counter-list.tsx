import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, XCircle } from "lucide-react";
import { Link } from "wouter";
import { Counter } from "@/lib/types";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Define form schema (Modify as needed)
const editFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  count: z.number().min(1, "Count must be at least 1"),
});

export function CounterList({
  counters: initialCounters,
  onDelete,
}: {
  counters: Counter[];
  onDelete: (id: string) => void;
}) {
  const [counters, setCounters] = useState<Counter[]>(initialCounters);
  const [editingCounter, setEditingCounter] = useState<Counter | null>(null);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    setCounters(initialCounters);
  }, [initialCounters]);

  const onSubmitEdit = async (data: { title: string; count: number }) => {
    if (!editingCounter) return;

    try {
      const res = await fetch(`/api/counters/${editingCounter.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, current: editingCounter.current }),
      });

      if (!res.ok) throw new Error("Failed to update counter");

      const updated = await res.json();
      setCounters((prevCounters) =>
        prevCounters.map((counter) => (counter.id === editingCounter.id ? updated : counter))
      );

      setEditingCounter(null);
      reset();
      toast({ title: "Success", description: "Counter updated successfully!" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update counter.", variant: "destructive" });
    }
  };

  if (counters.length === 0) {
    return (
      <div className="text-center py-12 flex justify-center">
        <motion.p
          className="text-muted-foreground text-lg fixed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          No counters yet. Create one to get started.
        </motion.p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {counters.map((counter) => (
        <Card key={counter.id} className="hover:shadow-md transition-shadow">
          <Link href={`/counter/${counter.id}`}>
            <CardContent className="p-4 cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg md:text-xl">{counter.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Progress: {counter.current} / {counter.count}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    className="bg-green-600 hover:bg-green-500"
                    variant="outline"
                    size="icon"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setEditingCounter(counter);
                      reset({ title: counter.title, count: counter.count });
                    }}
                  >
                    <Pencil className="h-4 w-4 text-white" />
                  </Button>
                  <Button
                    className="bg-red-600 hover:bg-red-500"
                    variant="destructive"
                    size="icon"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onDelete(counter.id);
                    }}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Link>
        </Card>
      ))}

      {/* Edit Counter Modal */}
      {editingCounter && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          role="dialog"
          aria-labelledby="edit-counter-title"
          aria-describedby="edit-counter-description"
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 id="edit-counter-title" className="text-xl font-semibold mb-4">
              Edit Counter
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium">Title</label>
                <input
                  {...register("title")}
                  className="w-full px-3 py-2 border rounded"
                  defaultValue={editingCounter.title}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Count</label>
                <input
                  type="number"
                  {...register("count")}
                  className="w-full px-3 py-2 border rounded"
                  defaultValue={editingCounter.count}
                />
              </div>
              <div id="edit-counter-description" className="sr-only">
                Use this form to edit the counter title and count value.
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  className="bg-gray-500 hover:bg-gray-400"
                  type="button"
                  onClick={() => setEditingCounter(null)}
                >
                  Cancel
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-500" type="submit">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
