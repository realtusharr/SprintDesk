import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getComments,
  getSprints,
  getTasks,
  getUsers,
} from "../api/task.api";
import { useBoardStore } from "../store/board.store";

export function useTasks() {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
    staleTime: Infinity,
  });
}

export function useSprints() {
  return useQuery({
    queryKey: ["sprints"],
    queryFn: getSprints,
    staleTime: Infinity,
  });
}

export function useBoardHydration() {
  const hydrateBoard = useBoardStore((state) => state.hydrateBoard);
  const hydrated = useBoardStore((state) => state.hydrated);

  const tasksQuery = useTasks();
  const commentsQuery = useComments();

  useEffect(() => {
    if (hydrated) return;
    if (tasksQuery.isSuccess && commentsQuery.isSuccess) {
      hydrateBoard(tasksQuery.data, commentsQuery.data);
    }
  }, [hydrated, hydrateBoard, tasksQuery.isSuccess, tasksQuery.data, commentsQuery.isSuccess, commentsQuery.data]);

  return {
    isLoading: !hydrated && (tasksQuery.isLoading || commentsQuery.isLoading),
    isError: !hydrated && (tasksQuery.isError || commentsQuery.isError),
    refetch: () => {
      void tasksQuery.refetch();
      void commentsQuery.refetch();
    },
  };
}

function useComments() {
  return useQuery({
    queryKey: ["comments"],
    queryFn: getComments,
    staleTime: Infinity,
  });
}
