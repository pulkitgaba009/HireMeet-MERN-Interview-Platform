import { useEffect } from "react";

export default function SecureQuiz({ onFullscreenExit }) {
  useEffect(() => {
    const enterFullscreen = async () => {
      try {
        const el = document.documentElement;
        const isFullscreen =
          document.fullscreenElement ||
          document.webkitFullscreenElement ||
          document.mozFullScreenElement ||
          document.msFullscreenElement;
        if (isFullscreen) return true;

        if (el.requestFullscreen) await el.requestFullscreen();
        else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
        else if (el.mozRequestFullScreen) await el.mozRequestFullScreen();
        else if (el.msRequestFullscreen) await el.msRequestFullscreen();
        return true;
      } catch (err) {
        console.warn("Fullscreen request failed:", err);
        return false;
      }
    };

    enterFullscreen();
    const attemptFullscreenOnGesture = () => {
      enterFullscreen();
    };

    const allowedKeys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Tab"];

    const handleKeyDown = (e) => {
      if (!e.ctrlKey && !e.metaKey && !e.altKey && allowedKeys.includes(e.key)) {
        return;
      }

      const blockedCombos = ["c", "x", "v", "a", "s", "p", "f", "u", "i", "j", "o", "w", "t", "y", "r"];
      const keyLower = (e.key || "").toLowerCase();

      if (e.ctrlKey || e.metaKey) {
        if (blockedCombos.includes(keyLower) || e.key === "Tab" || e.key === "Escape") {
          e.preventDefault?.();
          e.stopPropagation?.();
          if (e.stopImmediatePropagation) e.stopImmediatePropagation();
          return false;
        }
      }

      if (e.key === "ContextMenu" || (e.shiftKey && e.key === "F10")) {
        e.preventDefault?.();
        e.stopPropagation?.();
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();
        return false;
      }
    };

    const disableEvent = (e) => {
      e.preventDefault();
      e.stopPropagation?.();
      if (e.stopImmediatePropagation) e.stopImmediatePropagation();
    };

    const onFullScreenChange = () => {
      const isFullscreen =
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement;

      if (!isFullscreen) {
        onFullscreenExit?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown, { capture: true });
    document.addEventListener("contextmenu", disableEvent, { capture: true });
    document.addEventListener("copy", disableEvent, { capture: true });
    document.addEventListener("cut", disableEvent, { capture: true });
    document.addEventListener("paste", disableEvent, { capture: true });

    document.addEventListener("fullscreenchange", onFullScreenChange);
    document.addEventListener("webkitfullscreenchange", onFullScreenChange);
    document.addEventListener("mozfullscreenchange", onFullScreenChange);
    document.addEventListener("MSFullscreenChange", onFullScreenChange);
    document.addEventListener("click", attemptFullscreenOnGesture, { capture: true });
    document.addEventListener("keydown", attemptFullscreenOnGesture, { capture: true });
    document.addEventListener("touchstart", attemptFullscreenOnGesture, { capture: true });

    return () => {
      document.removeEventListener("keydown", handleKeyDown, { capture: true });
      document.removeEventListener("contextmenu", disableEvent, { capture: true });
      document.removeEventListener("copy", disableEvent, { capture: true });
      document.removeEventListener("cut", disableEvent, { capture: true });
      document.removeEventListener("paste", disableEvent, { capture: true });

      document.removeEventListener("fullscreenchange", onFullScreenChange);
      document.removeEventListener("webkitfullscreenchange", onFullScreenChange);
      document.removeEventListener("mozfullscreenchange", onFullScreenChange);
      document.removeEventListener("MSFullscreenChange", onFullScreenChange);
      document.removeEventListener("click", attemptFullscreenOnGesture, { capture: true });
      document.removeEventListener("keydown", attemptFullscreenOnGesture, { capture: true });
      document.removeEventListener("touchstart", attemptFullscreenOnGesture, { capture: true });
    };
  }, [onFullscreenExit]);

  return null;
}
