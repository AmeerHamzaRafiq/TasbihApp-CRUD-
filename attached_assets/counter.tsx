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
import NavBgImage from "../../../assets/handTasbeeh.jpg";
import BgWallPpr from "../../../assets/bg.png";

export default function Counter() {
  const [location, navigate] = useLocation();
  const { id } = useParams();
  const [counter, setCounter] = useState(() =>
    getCounters().find((c) => c.id === id)
  );
  const [showComplete, setShowComplete] = useState(false);

  // Redirect to home if counter is not found
  useEffect(() => {
    if (!counter) {
      navigate("/");
    }
  }, [counter, navigate]);

  if (!counter) return null;

  // Increment the counter
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

  // Reset the counter
  function resetCounter() {
    if (!counter) return;
    const updated = updateCounter(counter.id, 0);
    setCounter(updated);
    setShowComplete(false);
  }

  return (
    <div className="min-h-screen bg-background bg-slate-200"   style={{
      backgroundImage: `url(${BgWallPpr})`,
      // backgroundSize: "cover",
      backgroundPosition: "center",
       backgroundRepeat: "repeat",
      
    }}>
      <div className="container px-4 py-4 md:py-8 max-w-2xl mx-auto">
        <div
          style={{
            backgroundImage: `url(${NavBgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
          className="bg-slate-100 py-6 px-5 w-full rounded-md shadow-md flex items-center justify-between mb-4 md:mb-8"
        >
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

        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 border-b-2 border-gray-400 pb-2">
            {counter.title}
          </h1>

          {/* <p className="text-muted-foreground text-sm md:text-base">
            Tap anywhere on screen to count
          </p> */}
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
