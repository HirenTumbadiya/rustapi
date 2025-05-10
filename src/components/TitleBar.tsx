import { getCurrentWindow } from "@tauri-apps/api/window";
import { useEffect, useState } from "react";
import { Menu, Settings } from "lucide-react";

const appWindow = getCurrentWindow();

export function CustomTitlebar() {
  const [isMaximized, setIsMaximized] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    appWindow.isMaximized().then(setIsMaximized);

    const unlisten = appWindow.onResized(async () => {
      const maximized = await appWindow.isMaximized();
      setIsMaximized(maximized);
    });

    return () => {
      unlisten.then((f) => f());
    };
  }, []);

  const handleToggleMaximize = async () => {
    await appWindow.toggleMaximize();
    setTimeout(async () => {
      const maximized = await appWindow.isMaximized();
      setIsMaximized(maximized);
    }, 100);
  };

  return (
    <div className="titlebar" data-tauri-drag-region>
      <div className="titlebar-left">
        <button
          className="titlebar-button"
          title="Settings"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span>
            <Menu size={18} />
          </span>
        </button>
        <div className="titlebar-title">rustapi</div>
        {menuOpen && (
          <div className="dropdown-menu">
            <div className="dropdown-item">File</div>
            <div className="dropdown-item">Edit</div>
            <div className="dropdown-item">View</div>
            <div className="dropdown-item">Help</div>
          </div>
        )}
      </div>
      <div className="titlebar-buttons">
        <button className="titlebar-button" title="Settings">
          <span>
            <Settings size={18} />{" "}
          </span>
        </button>
        <button
          className="titlebar-button"
          onClick={() => appWindow.minimize()}
          title="Minimize"
        >
          <span style={{ fontSize: "14px" }}>━</span>
        </button>
        <button
          className="titlebar-button"
          onClick={handleToggleMaximize}
          title={isMaximized ? "Restore Down" : "Maximize"}
        >
          <span style={{ fontSize: "14px" }}>{isMaximized ? "🗗" : "▢"}</span>
        </button>
        <button
          className="titlebar-button"
          onClick={() => appWindow.close()}
          title="Close"
        >
          <span style={{ fontSize: "18px" }}>✕</span>
        </button>
      </div>
    </div>
  );
}
