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
import { createCounter, deleteCounter, getCounters } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import bgImage from "../../../assets/tasbeeh.jpg";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  count: z.coerce.number().min(1, "Count must be at least 1"),
});

export default function Home() {
  const [open, setOpen] = useState(false);
  const [counters, setCounters] = useState(() => getCounters());
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
      createCounter(data);
      setCounters(getCounters());
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
    deleteCounter(id);
    setCounters(getCounters());
    toast({
      title: "Counter deleted",
      description: "The counter has been deleted successfully.",
    });
  }

  return (
    <div
    style={{
      backgroundImage: `url(${bgImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "fixed",
    }}
    className="min-h-screen w-full"
  >
    <div className="container px-6 py-12 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="bg-slate-100 py-6 px-4 w-full flex justify-between rounded-md shadow-md">
          <div className="my-[-0.6rem]">
            <h1 className="text-5xl font-light font-badeen">تسبیح</h1>
          </div>
  
          <div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="md:text-base">
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
                            <Input placeholder="Zikr, Durood or any other prayer here !!!" {...field} />
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
        </div>
      </div>
      <CounterList counters={counters} onDelete={onDelete} />
    </div>
  
    {/* Footer Section */}
    <footer className=" text-white text-center py-1 mt-auto">
    <p className="text-sm">&copy; {new Date().getFullYear()} Muhammad Ameer Hamza. All rights reserved.</p>
  </footer>
  </div>
  
  
  );
}
