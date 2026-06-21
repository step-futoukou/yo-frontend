import { useState } from "react";
import { getUserId } from "./api.js";
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

export default function App() {
  // 登録済みならホームから開始
  const [currentScreen, setCurrentScreen] = useState(getUserId() ? "/home" : "/");

  // 'home' でも '/home' でも受け付ける。未知のキーは起動画面('/')へ。
  const navigate = (path) => {
    const key = path && path.startsWith("/") ? path : `/${path || ""}`;
    setCurrentScreen(SCREENS[key] ? key : "/");
  };

  const Screen = SCREENS[currentScreen] || Register;
  return <Screen navigate={navigate} />;
}
