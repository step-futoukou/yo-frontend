import { useState, useEffect } from 'react';
import {
  getUserId,
  sendWishes,
  getProposal,
  confirmMeeting,
  sendReminder,
  getNotifications,
} from '../api.js';

const MATCH_KEY = 'yo_match_id';
const MEETING_KEY = 'yo_meeting_id';
const POLL_MS = 10000;

const TIME_OPTIONS = ['月 18:00', '火 19:00', '水 20:00', '木 18:00', '金 19:00', '土 14:00', '日 15:00'];
const PLACE_OPTIONS = ['渋谷', '新宿', '池袋', '東京駅', '大学前のカフェ', '図書館前'];

export default function Meeting({ navigate }) {
  const userId = getUserId();
  const matchId = localStorage.getItem(MATCH_KEY);

  // wish | waiting | propose | confirming | done | no_match
  const [status, setStatus] = useState('wish');
  const [times, setTimes] = useState([]);
  const [places, setPlaces] = useState([]);
  const [proposal, setProposal] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [reminded, setReminded] = useState(false);

  // 'waiting': 相手の返答を 10秒ごとに getProposal でポーリング
  useEffect(() => {
    if (status !== 'waiting' || !matchId) return undefined;
    let active = true;
    const poll = async () => {
      try {
        const p = await getProposal(matchId);
        if (!active) return;
        if (p.status === 'proposed') {
          localStorage.setItem(MEETING_KEY, p.meeting_id);
          setProposal(p);
          setStatus('propose');
        } else if (p.status === 'no_match') {
          setStatus('no_match');
        }
      } catch (e) {
        /* ネットワーク一時失敗は次回ポーリングで回復 */
      }
    };
    poll();
    const id = setInterval(poll, POLL_MS);
    return () => { active = false; clearInterval(id); };
  }, [status, matchId]);

  // 'confirming': 'confirmation' 通知を 10秒ごとに getNotifications でポーリング
  useEffect(() => {
    if (status !== 'confirming' || !userId) return undefined;
    let active = true;
    const poll = async () => {
      try {
        const ns = await getNotifications(userId);
        if (!active) return;
        if (ns.some((n) => n.type === 'confirmation')) setStatus('done');
      } catch (e) {
        /* 次回ポーリングで回復 */
      }
    };
    poll();
    const id = setInterval(poll, POLL_MS);
    return () => { active = false; clearInterval(id); };
  }, [status, userId]);

  const toggle = (list, setList, value) =>
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const handleSend = async () => {
    if (times.length === 0 && places.length === 0) {
      setError('希望の日時・場所を1つ以上選んでください');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await sendWishes(matchId, userId, times, places);
      setStatus('waiting');
    } catch (e) {
      setError('送信に失敗しました。しばらくしてから試してください。');
    } finally {
      setBusy(false);
    }
  };

  const handleConfirm = async () => {
    const meetingId = proposal?.meeting_id || localStorage.getItem(MEETING_KEY);
    if (!meetingId) { setError('待ち合わせ情報がありません'); return; }
    setBusy(true);
    setError('');
    try {
      await confirmMeeting(meetingId, 'a');
      setStatus('confirming');
    } catch (e) {
      setError('確認の送信に失敗しました');
    } finally {
      setBusy(false);
    }
  };

  const handleReminder = async () => {
    try {
      await sendReminder(matchId, userId);
      setReminded(true);
      setTimeout(() => setReminded(false), 4000);
    } catch (e) {
      setError('再通知の送信に失敗しました');
    }
  };

  // ガード（フックの後に評価）
  if (!userId || !matchId) {
    return (
      <section className="card">
        <h2>待ち合わせ</h2>
        <p className="error">⚠️ 先にマッチングを行ってください。</p>
        <button type="button" className="primary" onClick={() => navigate('home')}>ホームへ</button>
      </section>
    );
  }

  return (
    <section className="card">
      <h2>待ち合わせを決める</h2>

      {status === 'wish' && (
        <>
          <fieldset className="field">
            <legend>希望の日時</legend>
            <div className="chips">
              {TIME_OPTIONS.map((t) => (
                <button type="button" key={t} className={`chip ${times.includes(t) ? 'on' : ''}`} onClick={() => toggle(times, setTimes, t)}>{t}</button>
              ))}
            </div>
          </fieldset>
          <fieldset className="field">
            <legend>希望の場所</legend>
            <div className="chips">
              {PLACE_OPTIONS.map((p) => (
                <button type="button" key={p} className={`chip ${places.includes(p) ? 'on' : ''}`} onClick={() => toggle(places, setPlaces, p)}>{p}</button>
              ))}
            </div>
          </fieldset>
          {error && <p className="error">⚠️ {error}</p>}
          <button type="button" className="primary" onClick={handleSend} disabled={busy}>
            {busy ? '送信中…' : '相手に送る'}
          </button>
        </>
      )}

      {status === 'waiting' && (
        <>
          <p className="banner">⏳ 相手の返答を待っています…（10秒ごとに自動確認）</p>
          <p className="hint">あなたの希望: {[...times, ...places].join('、') || '—'}</p>
          <button type="button" className="secondary" onClick={handleReminder}>相手に再通知する</button>
          {reminded && <p className="hint">✅ 再通知を送りました</p>}
        </>
      )}

      {status === 'propose' && proposal && (
        <>
          <div className="matched-badge">🤝 待ち合わせの提案</div>
          <dl className="result">
            <dt>日時</dt>
            <dd>{proposal.proposed_time || '—'}</dd>
            <dt>場所</dt>
            <dd>{proposal.proposed_place || '—'}</dd>
          </dl>
          {error && <p className="error">⚠️ {error}</p>}
          <button type="button" className="primary" onClick={handleConfirm} disabled={busy}>
            {busy ? '送信中…' : '了解した！'}
          </button>
        </>
      )}

      {status === 'confirming' && (
        <>
          <p className="banner">⏳ 相手の確認を待っています…（10秒ごとに自動確認）</p>
          <button type="button" className="secondary" onClick={handleReminder}>相手に再通知する</button>
          {reminded && <p className="hint">✅ 再通知を送りました</p>}
        </>
      )}

      {status === 'done' && (
        <>
          <div className="matched-badge">✅ 待ち合わせ確定！</div>
          {proposal && (
            <dl className="result">
              <dt>日時</dt><dd>{proposal.proposed_time || '—'}</dd>
              <dt>場所</dt><dd>{proposal.proposed_place || '—'}</dd>
            </dl>
          )}
          <p className="hint">当日は「ミッション」画面で到着を報告しましょう。</p>
          <button type="button" className="primary" onClick={() => navigate('mission')}>ミッションへ</button>
        </>
      )}

      {status === 'no_match' && (
        <>
          <p className="error">😢 希望が合いませんでした。日時・場所を選び直してください。</p>
          <button type="button" className="primary" onClick={() => { setStatus('wish'); setError(''); }}>
            再調整する
          </button>
        </>
      )}
    </section>
  );
}
