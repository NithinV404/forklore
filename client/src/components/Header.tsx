import React from "react";

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container-custom py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 text-white flex items-center justify-center font-bold shadow">
            F
          </div>
          <div>
            <div className="text-slate-900 text-lg font-semibold">Forklore</div>
            <div className="text-sm text-muted">
              Your recipe collection, elegantly organized
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button className="text-sm text-muted hover:text-slate-900">
            Browse
          </button>
          <button className="text-sm text-muted hover:text-slate-900">
            Saved
          </button>
        </div>
      </div>
    </header>
  );
}
