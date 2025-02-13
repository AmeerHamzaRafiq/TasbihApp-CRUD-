import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CounterList } from "@/components/counter-list";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { useCounters, useCreateCounter, useDeleteCounter } from "@/lib/queries";
import { DotLottiePlayer } from "@dotlottie/react-player";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  count: z.coerce
    .number()
    .min(1, "Count must be at least 1")
    .max(10000, "Count cannot exceed 10,000"),
});

export default function Home() {
  const [open, setOpen] = useState(false);
  const { data: counters = [] } = useCounters();
  const { mutate: createCounterMutation } = useCreateCounter();
  const { mutate: deleteCounterMutation } = useDeleteCounter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      count: 100,
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      createCounterMutation(data);
      setOpen(false);
      form.reset();
      toast({
        title: "Counter created",
        description: "Your new Tasbih counter has been created successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create counter. Please try again.",
        variant: "destructive",
      });
    }
  }

  function onDelete(id: string) {
    try {
      deleteCounterMutation(id);
      toast({
        title: "Counter deleted",
        description: "The counter has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete counter.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="container p-4 sm:p-6 md:p-8 max-w-2xl mx-auto flex-grow">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Tasbih Counter</h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="whitespace-nowrap">
                <Plus className="h-4 w-4 mr-2" />
                New Counter
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create new counter</DialogTitle>
              </DialogHeader>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter title" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="count"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Count</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter count"
                            max="10000"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Create</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <CounterList counters={counters} onDelete={onDelete} />

        <div className="mt-12 sm:mt-16 flex justify-center items-center relative mb-24 sm:mb-32">
          <DotLottiePlayer
            src="https://lottie.host/c8eec2f4-e353-4437-8b50-98f36400cd19/qz1AeuZFVQ.lottie"
            autoplay
            loop
            style={{
              width: "150px",
              height: "150px",
              position: "absolute",
              left: "50%",
              marginTop: "0px",
              transform: "translateX(-50%)",
            }}
          />
        </div>
      </div>

      <footer className="bg-primary text-white text-center py-1 mt-auto">
        <p className="text-sm">&copy; {new Date().getFullYear()} Muhammad Ameer Hamza. All rights reserved.</p>
      </footer>
    </div>
  );
}