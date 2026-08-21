import { BrowserRouter } from "react-router-dom";
import { useSessionBootstrap } from "./hooks/useAuth";
import AppRoutes from "./routes/AppRoutes";
import ToastContainer from "./components/ui/Toast";

export default function App() {
  useSessionBootstrap();

  return (
    <BrowserRouter>
      <AppRoutes />
      <ToastContainer />
    </BrowserRouter>
  );
}
