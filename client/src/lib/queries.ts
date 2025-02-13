import { useQuery, useMutation } from "@tanstack/react-query";
import { Counter } from "./types";
import { getCounters, createCounter, updateCounter, deleteCounter, editCounter } from "./storage";
import { queryClient } from "./queryClient";

export function useCounters() {
  return useQuery({
    queryKey: ["/counters"],
    queryFn: getCounters,
  });
}

export function useCreateCounter() {
  return useMutation({
    mutationFn: createCounter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/counters"] });
    },
  });
}

export function useUpdateCounter() {
  return useMutation({
    mutationFn: ({ id, current }: { id: string; current: number }) =>
      updateCounter(id, current),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/counters"] });
    },
  });
}

export function useEditCounter() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { title: string; count: number } }) =>
      editCounter(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/counters"] });
    },
  });
}

export function useDeleteCounter() {
  return useMutation({
    mutationFn: deleteCounter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/counters"] });
    },
  });
}
