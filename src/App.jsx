import { useState } from 'react';
import { getUserId } from './api.js';
import Register from './screens/Register.jsx';
import Home from './screens/Home.jsx';
import Review from './screens/Review.jsx';

// React Router を使わず、currentScreen(useState) で画面を切り替える
const SCREENS = {
  '/': Register,
  '/home': Home,
  '/review': Review,
};

const NAV = [
  { path: '/', label: '登録' },
  { path: '/home', label: 'ホーム' },
  { path: '/review', label: 'レビュー' },
];

export default function App() {
  // 登録済みならホームから開始
  const [currentScreen, setCurrentScreen] = useState(getUserId() ? '/home' : '/');

  const navigate = (path) => setCurrentScreen(path);
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
