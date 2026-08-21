import { Navigate, Route, Routes } from "react-router-dom";

import Login from "../pages/login";
import Dashboard from "../pages/Dashboard";
import Board from "../pages/board";
import Analytics from "../pages/Analytics";
import Notifications from "../pages/Notifications";

import ProtectedRoute from "./ProtectedRoute";
import AppLayout from "../components/layout/applayout";

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={<Login />}
      />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route
            path="/"
            element={<Dashboard />}
          />

          <Route
            path="/board"
            element={<Board />}
          />

          <Route
            path="/analytics"
            element={<Analytics />}
          />

          <Route
            path="/notifications"
            element={<Notifications />}
          />
        </Route>
      </Route>

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}