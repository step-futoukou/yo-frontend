import { useState, useEffect } from 'react';
import { getUserId, confirmMeeting, getNotifications } from '../api.js';

const MATCH_KEY = 'yo_match_id';
const MEETING_KEY = 'yo_meeting_id';
const POLL_MS = 10000;

export default function Mission({ navigate }) {
  const userId = getUserId();
  const matchId = localStorage.getItem(MATCH_KEY);
  const meetingId = localStorage.getItem(MEETING_KEY);

  // idle（未到着） | arrived（自分到着・相手待ち） | merged（両者到着）
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  // 'arrived': 両者到着（confirmation 通知）を 10秒ごとにポーリング
  useEffect(() => {
    if (status !== 'arrived' || !userId) return undefined;
    let active = true;
    const poll = async () => {
      try {
        const ns = await getNotifications(userId);
        if (!active) return;
        if (ns.some((n) => n.type === 'confirmation')) setStatus('merged');
      } catch (e) {
        /* 次回ポーリングで回復 */
      }
    };
    poll();
    const id = setInterval(poll, POLL_MS);
    return () => { active = false; clearInterval(id); };
  }, [status, userId]);

  const handleArrive = async () => {
    if (!meetingId) {
      setError('待ち合わせが未確定です。先に待ち合わせを決めてください。');
      return;
    }
    setBusy(true);
    setError('');
    try {
      // プロトタイプのため side は 'a'（自分側）固定
      await confirmMeeting(meetingId, 'a');
      setStatus('arrived');
    } catch (e) {
      setError('送信に失敗しました。しばらくしてから試してください。');
    } finally {
      setBusy(false);
    }
  };

  // ガード（フックの後に評価）
  if (!userId || !matchId) {
    return (
      <section className="card">
        <h2>ミッション</h2>
        <p className="error">⚠️ 先にマッチング・待ち合わせを行ってください。</p>
        <button type="button" className="primary" onClick={() => navigate('home')}>ホームへ</button>
      </section>
    );
  }

  return (
    <section className="card">
      <h2>当日ミッション</h2>

      {status === 'idle' && (
        <>
          <p className="hint">待ち合わせ場所に着いたらボタンを押してください。</p>
          {!meetingId && <p className="banner">待ち合わせが未確定です（「待ち合わせ」画面で確定してください）。</p>}
          {error && <p className="error">⚠️ {error}</p>}
          <button type="button" className="primary" onClick={handleArrive} disabled={busy}>
            {busy ? '送信中…' : '到着しました'}
          </button>
        </>
      )}

      {status === 'arrived' && (
        <>
          <p className="banner">⏳ 相手の到着を待っています…（10秒ごとに自動確認）</p>
          <p className="hint">相手も「到着しました」を押すと合流確認に進みます。</p>
        </>
      )}

      {status === 'merged' && (
        <>
          <div className="matched-badge">🎉 合流確認！</div>
          <p className="hint">無事に会えましたね。楽しんできてください！</p>
          <button type="button" className="primary" onClick={() => navigate('/review')}>
            会った後のレビューへ
          </button>
        </>
      )}
    </section>
  );
}
