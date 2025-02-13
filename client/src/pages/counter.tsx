import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { CircularProgress } from "@/components/circular-progress";
import { getCounters, updateCounter } from "@/lib/storage";
import { ChevronLeft, RotateCcw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import confetti from "canvas-confetti";

export default function Counter() {
  const [location, navigate] = useLocation();
  const { id } = useParams();
  const [counter, setCounter] = useState(() =>
    getCounters().find((c) => c.id === id)
  );
  const [showComplete, setShowComplete] = useState(false);

  useEffect(() => {
    if (!counter) {
      navigate("/");
    }
  }, [counter, navigate]);

  if (!counter) return null;

  function increment() {
    if (!counter || counter.current >= counter.count) return;

    const updated = updateCounter(counter.id, counter.current + 1);
    setCounter(updated);

    if (updated.current === updated.count) {
      setShowComplete(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }

  function resetCounter() {
    if (!counter) return;
    const updated = updateCounter(counter.id, 0);
    setCounter(updated);
    setShowComplete(false);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-8 max-w-2xl mx-auto">
        <div className="bg-slate-100 py-6 px-4 w-full rounded-md shadow-md flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-sm md:text-base"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button
            variant="outline"
            onClick={resetCounter}
            className="text-sm md:text-base"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Restart
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{counter.title}</h1>
        </div>

        <div
          className="flex justify-center items-center min-h-[40vh] touch-none cursor-pointer"
          onClick={increment}
        >
          <CircularProgress current={counter.current} total={counter.count} />
        </div>

        <Dialog open={showComplete} onOpenChange={setShowComplete}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Congratulations! 🎉</DialogTitle>
              <DialogDescription>
                You have completed {counter.count} counts of {counter.title}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  resetCounter();
                  setShowComplete(false);
                  navigate("/");
                }}
              >
                Back to Home
              </Button>
              <Button
                onClick={() => {
                  resetCounter();
                }}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Continue
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
