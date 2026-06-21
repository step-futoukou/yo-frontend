import { useState } from 'react';
import { getUserId, postReview } from '../api.js';

const MATCH_KEY = 'yo_match_id';

const ATMOS_TAGS = ['楽しい', '落ち着く', '話しやすい', '刺激的', '安心感', 'また会いたい'];

// モジュールスコープに定義（render内に置くと毎回再マウントされフォーカスが外れるため）
function Slider({ label, value, onChange, leftHint, rightHint }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input type="range" min="1" max="5" value={value} onChange={(e) => onChange(Number(e.target.value))} />
      <div className="range-foot">
        <small>{leftHint}</small>
        <span className="slider-value">{value}</span>
        <small>{rightHint}</small>
      </div>
    </label>
  );
}

export default function Review({ navigate }) {
  const userId = getUserId();
  const matchId = localStorage.getItem(MATCH_KEY);

  const [talk, setTalk] = useState(3);
  const [mission, setMission] = useState(3);
  const [ei, setEi] = useState(3);
  const [hobby, setHobby] = useState(3);
  const [atmos, setAtmos] = useState([]);

  const [status, setStatus] = useState('idle'); // idle | loading | done | error
  const [error, setError] = useState('');

  const toggleAtmos = (tag) => {
    setAtmos((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId || !matchId) {
      setError('ユーザーまたはマッチ情報がありません。先にマッチングしてください。');
      setStatus('error');
      return;
    }
    setStatus('loading');
    setError('');
    try {
      await postReview({
        user_id: userId,
        match_id: matchId,
        talk_score: talk,
        mission_score: mission,
        ei_adjust: ei,
        hobby_adjust: hobby,
        atmos_tags: atmos,
      });
      setStatus('done');
    } catch (err) {
      setError(err.message || '送信に失敗しました');
      setStatus('error');
    }
  };

  // 完了画面
  if (status === 'done') {
    return (
      <section className="card">
        <h2>✅ レビューを送信しました</h2>
        <p className="hint">
          フィードバックはあなたのマッチング傾向（ウェイト）に反映されます。
          相性が良ければ、いつか「縁をつなぐ」再マッチが届くかもしれません。
        </p>
        <button type="button" className="primary" onClick={() => navigate('/home')}>
          ホームに戻る
        </button>
      </section>
    );
  }

  // マッチ未確定
  if (!userId || !matchId) {
    return (
      <section className="card">
        <h2>レビュー</h2>
        <p className="error">⚠️ 先にマッチングを行ってください。</p>
        <button type="button" className="primary" onClick={() => navigate('/home')}>
          ホームへ
        </button>
      </section>
    );
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>会った後のレビュー</h2>

      <Slider label="会話の満足度" value={talk} onChange={setTalk} leftHint="低い" rightHint="高い" />
      <Slider label="ミッション達成度" value={mission} onChange={setMission} leftHint="未達" rightHint="達成" />
      <Slider label="話す量の好み" value={ei} onChange={setEi} leftHint="静かな人が好き" rightHint="よく話す人が好き" />
      <Slider label="共通点の重視度" value={hobby} onChange={setHobby} leftHint="違っていい" rightHint="共通点が大事" />

      <fieldset className="field">
        <legend>雰囲気タグ</legend>
        <div className="chips">
          {ATMOS_TAGS.map((tag) => (
            <button
              type="button"
              key={tag}
              className={`chip ${atmos.includes(tag) ? 'on' : ''}`}
              onClick={() => toggleAtmos(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </fieldset>

      {status === 'error' && <p className="error">⚠️ {error}</p>}

      <button type="submit" className="primary" disabled={status === 'loading'}>
        {status === 'loading' ? '送信中…' : '送信する'}
      </button>
    </form>
  );
}
