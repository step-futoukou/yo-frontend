import { useState } from 'react';
import { getUserId } from './api.js';
import Register from './screens/Register.jsx';
import Home from './screens/Home.jsx';
import Meeting from './screens/Meeting.jsx';
import Mission from './screens/Mission.jsx';
import Review from './screens/Review.jsx';

// React Router を使わず、currentScreen(useState) で画面を切り替える
const SCREENS = {
  '/': Register,
  '/home': Home,
  '/meeting': Meeting,
  '/mission': Mission,
  '/review': Review,
};

const NAV = [
  { path: '/', label: '登録' },
  { path: '/home', label: 'ホーム' },
  { path: '/meeting', label: '待ち合わせ' },
  { path: '/mission', label: 'ミッション' },
  { path: '/review', label: 'レビュー' },
];

export default function App() {
  // 登録済みならホームから開始
  const [currentScreen, setCurrentScreen] = useState(getUserId() ? '/home' : '/');

  // 'meeting' でも '/meeting' でも受け付けられるよう正規化
  const navigate = (path) => {
    const key = path && path.startsWith('/') ? path : `/${path || ''}`;
    setCurrentScreen(SCREENS[key] ? key : '/');
  };

  const Screen = SCREENS[currentScreen] || Register;

  return (
    <div className="app">
      <header className="app-header">
        <h1>Yo</h1>
        <p>大学生向け 友達マッチング</p>
      </header>

      <nav className="nav">
        {NAV.map((n) => (
          <button
            key={n.path}
            type="button"
            className={currentScreen === n.path ? 'on' : ''}
            onClick={() => navigate(n.path)}
          >
            {n.label}
          </button>
        ))}
      </nav>

      <main>
        <Screen navigate={navigate} />
      </main>
    </div>
  );
}
