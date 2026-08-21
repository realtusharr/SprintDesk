import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";
import Header from "./header";

export default function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          onMenuClick={() =>
            setMobileMenuOpen(true)
          }
        />

        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="h-full w-72 bg-white"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="p-4">
              <h2 className="text-lg font-bold">
                SprintDesk
              </h2>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}