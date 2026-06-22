import { useState, useEffect } from "react";
import { getUserId, getMeetingStatus } from "./api.js";
import { resolveScreen } from "./lib/resolveScreen.js";
import Register from "./screens/Register.jsx";
import Home from "./screens/Home.jsx";
import Meeting from "./screens/Meeting.jsx";
import Mission from "./screens/Mission.jsx";
import Review from "./screens/Review.jsx";

// React Router を使わず、currentScreen(useState) で画面を切り替える。
// 各画面は自己完結の電話モックアップ（独自ナビ内蔵）なので、
// アプリ側のヘッダー/ナビは持たず、現在の画面だけを描画する。
const SCREENS = {
  "/": Register,
  "/home": Home,
  "/meeting": Meeting,
  "/mission": Mission,
  "/review": Review,
};

// 起動直後の読み込み中スプラッシュ（状態復元の間だけ表示）
function Splash() {
  return (
    <div style={{ minHeight: "100vh", background: "#F5F2EE", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: 56, color: "#1C1A18", letterSpacing: "-2px" }}>
        Yo<span style={{ display: "inline-block", width: 8, height: 8, background: "#C8A97A", borderRadius: "50%", verticalAlign: "super", marginLeft: 2 }} />
      </div>
    </div>
  );
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("/");
  // Meeting/Mission に渡す初期サブ画面（復元結果）。通常遷移では null。
  const [initialScreen, setInitialScreen] = useState(null);
  const [booting, setBooting] = useState(true);

  // 'home' でも '/home' でも受け付ける。未知のキーは起動画面('/')へ。
  // 第2引数 subScreen を渡すと、その画面のサブ画面を指定して開ける（復元・再開用）。
  const navigate = (path, subScreen = null) => {
    const key = path && path.startsWith("/") ? path : `/${path || ""}`;
    setInitialScreen(subScreen);
    setCurrentScreen(SCREENS[key] ? key : "/");
  };

  // バックエンドの状態から「今いるべき画面」を復元する。
  // 起動時に1回、および Home の「進行中の待ち合わせに戻る」から呼ぶ。
  const restoreFromBackend = async () => {
    const uid = getUserId();
    if (!uid) { setCurrentScreen("/"); return; }

    const matchId = localStorage.getItem("yo_match_id");
    if (!matchId) { setCurrentScreen("/home"); return; }

    try {
      const status = await getMeetingStatus(matchId);
      const { route, screen } = resolveScreen(uid, status);
      if (status.meeting && status.meeting.id) {
        localStorage.setItem("yo_meeting_id", status.meeting.id);
      }
      setInitialScreen(screen);
      setCurrentScreen(route);
    } catch (e) {
      // マッチが消えている等 → ホームへ
      setCurrentScreen("/home");
    }
  };

  // マウント時に状態復元
  useEffect(() => {
    restoreFromBackend().finally(() => setBooting(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (booting) return <Splash />;

  const Screen = SCREENS[currentScreen] || Register;
  return <Screen navigate={navigate} initialScreen={initialScreen} resumeFlow={restoreFromBackend} />;
}
