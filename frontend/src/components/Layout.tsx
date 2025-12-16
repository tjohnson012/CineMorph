import { Outlet, Link, useLocation } from 'react-router-dom';
import { Film } from 'lucide-react';

export function Layout() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Film grain overlay - always visible */}
      <div className="film-grain" />
      
      <header className="border-b border-zinc-900 backdrop-blur-sm bg-black/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <Film className="w-8 h-8 text-purple-500 group-hover:text-purple-400 transition-colors" />
              <div>
                <h1 className="text-2xl font-bold">CineMorph</h1>
                <p className="text-xs text-zinc-500">Extract. Remix. Redefine Cinema.</p>
              </div>
            </Link>

            <nav className="flex items-center gap-6">
              <Link
                to="/studio"
                className={`text-sm font-medium transition-colors ${
                  isActive('/studio')
                    ? 'text-purple-400'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Studio
              </Link>
              <Link
                to="/blend"
                className={`text-sm font-medium transition-colors ${
                  isActive('/blend')
                    ? 'text-purple-400'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Blend
              </Link>
              <Link
                to="/presets"
                className={`text-sm font-medium transition-colors ${
                  isActive('/presets')
                    ? 'text-purple-400'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Presets
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="border-t border-zinc-900 mt-24">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <p className="text-sm text-zinc-500">
              © 2025 CineMorph. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <span>Powered by</span>
              <span className="text-amber-500 font-semibold">FIBO</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}