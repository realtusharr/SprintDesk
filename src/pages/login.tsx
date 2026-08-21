import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/button";
import Input from "../components/ui/Input";
import { login } from "../api/auth.api";
import { useAuthStore } from "../store/auth.store";

export default function Login() {
  const navigate = useNavigate();

  const loginUser = useAuthStore(
    (state) => state.login
  );

  const [username, setUsername] = useState(
    "emilys"
  );

  const [password, setPassword] = useState(
    "emilyspass"
  );

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await login(
        username,
        password
      );

      loginUser(
        {
          id: response.id,
          username: response.username,
          email: response.email,
          firstName: response.firstName,
          lastName: response.lastName,
          image: response.image,
        },
        response.accessToken,
        response.refreshToken
      );

      navigate("/");
    } catch {
      setError(
        "Invalid username or password."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-xl font-bold text-white">
            S
          </div>

          <h1 className="text-2xl font-bold text-slate-800">
            SprintDesk
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Sign in to manage your sprint
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <label className="block text-sm font-medium text-slate-700">
            Username
            <Input
               label="Username"
               value={username}
              onChange={(event) =>
              setUsername(event.target.value)
               }
               placeholder="Enter username"
               required
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200"
            />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Password
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Enter password"
              required
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-800 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200"
            />
          </label>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading
              ? "Signing in..."
              : "Sign in"}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          SprintDesk project management
        </p>
      </div>
    </div>
  );
}