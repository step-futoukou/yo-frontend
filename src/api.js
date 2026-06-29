// APIのベースURL。本番は Render の環境変数 VITE_API_BASE_URL で注入する（コードに直書きしない）。
// 開発時は未設定なら http://localhost:3000 にフォールバックする。
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
// バックエンドのルートは /api 配下にマウントされているため付与する。
const BASE_URL = `${API_BASE_URL}/api`;

// 端末固有IDを生成・保存（localStorage使用）
export const getDeviceId = () => {
  let id = localStorage.getItem('yo_device_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('yo_device_id', id);
  }
  return id;
};

// ユーザーIDを保存・取得
export const getUserId = () => localStorage.getItem('yo_user_id');
export const setUserId = (id) => localStorage.setItem('yo_user_id', id);

// 共通fetchラッパー
const api = async (method, path, body = null) => {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : null,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
};

// ユーザー登録
export const registerUser = (data) => api('POST', '/users', data);

// ユーザー取得
export const getUser = (userId) => api('GET', `/users/${userId}`);

// プロフィール更新（MBTI・タグ・性別設定）
export const updateUser = (userId, data) => api('PUT', `/users/${userId}`, data);

// マッチング検索
export const findMatch = (userId) => api('POST', '/matching/find', { user_id: userId });

// 自分が関わるマッチ一覧（user_a / user_b どちらでも）
export const getMatchingUser = (userId) => api('GET', `/matching/user/${userId}`);

// マッチ1件取得（user_a_id / user_b_id を含む。確定の side 判定に使う）
export const getMatch = (matchId) => api('GET', `/matching/${matchId}`);

// マッチング応答
export const respondMatch = (matchId, action) =>
  api('POST', `/matching/${matchId}/respond`, { action });

// 希望送信
export const sendWishes = (matchId, userId, timeSlots, places) =>
  api('POST', '/meetings/wishes', { match_id: matchId, user_id: userId, time_slots: timeSlots, places });

// 自動提案取得
export const getProposal = (matchId) => api('GET', `/meetings/${matchId}/proposal`);

// 進行状態のまとめ取得（画面復元用）
export const getMeetingStatus = (matchId) => api('GET', `/meetings/${matchId}/status`);

// 待ち合わせ確定
export const confirmMeeting = (meetingId, side) =>
  api('POST', `/meetings/${meetingId}/confirm`, { side });

// 当日の到着を記録
export const arriveMeeting = (meetingId, side) =>
  api('POST', `/meetings/${meetingId}/arrive`, { side });

// レビュー投稿
export const postReview = (data) => api('POST', '/reviews', data);

// 通知取得
export const getNotifications = (userId) => api('GET', `/notifications/${userId}`);

// 再通知
export const sendReminder = (matchId, userId) =>
  api('POST', '/notifications/reminder', { match_id: matchId, user_id: userId });

// ウェイト取得
export const getWeights = (userId) => api('GET', `/users/${userId}/weights`);

export default api;
