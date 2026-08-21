import { useQuery } from "@tanstack/react-query";
import {
  getTasks,
  getUsers,
  getSprints,
} from "../api/task.api";

export function useTasks() {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });
}

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });
}

export function useSprints() {
  return useQuery({
    queryKey: ["sprints"],
    queryFn: getSprints,
  });
}