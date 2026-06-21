const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

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

// マッチング検索
export const findMatch = (userId) => api('POST', '/matching/find', { user_id: userId });

// マッチング応答
export const respondMatch = (matchId, action) =>
  api('POST', `/matching/${matchId}/respond`, { action });

// 希望送信
export const sendWishes = (matchId, userId, timeSlots, places) =>
  api('POST', '/meetings/wishes', { match_id: matchId, user_id: userId, time_slots: timeSlots, places });

// 自動提案取得
export const getProposal = (matchId) => api('GET', `/meetings/${matchId}/proposal`);

// 待ち合わせ確定
export const confirmMeeting = (meetingId, side) =>
  api('POST', `/meetings/${meetingId}/confirm`, { side });

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
