import { useState } from 'react';
import {
  getDeviceId,
  getUserId,
  setUserId,
  registerUser,
} from '../api.js';

// バックエンドの seed タグに合わせた選択肢
const HOBBIES = ['サッカー', '野球', 'バスケ', '筋トレ', 'ゲーム', '映画鑑賞', '料理', 'カフェ巡り', '旅行'];
const INTERESTS = ['プログラミング', '起業', '投資', 'デザイン', '語学', 'アニメ', 'ファッション', '読書'];

const MBTI_AXES = [
  { key: 'mbti_ei', left: '外向 (E)', right: '内向 (I)' },
  { key: 'mbti_ns', left: '直観 (N)', right: '感覚 (S)' },
  { key: 'mbti_tf', left: '思考 (T)', right: '感情 (F)' },
  { key: 'mbti_jp', left: '判断 (J)', right: '知覚 (P)' },
];

export default function Register({ navigate }) {
  const [faculty, setFaculty] = useState('');
  const [grade, setGrade] = useState(1);
  const [mbti, setMbti] = useState({ mbti_ei: 50, mbti_ns: 50, mbti_tf: 50, mbti_jp: 50 });
  const [relationValue, setRelationValue] = useState(2);
  const [genderPref, setGenderPref] = useState('any');
  const [hobbies, setHobbies] = useState([]);
  const [interests, setInterests] = useState([]);

  const [status, setStatus] = useState('idle'); // idle | loading | done | error
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const savedUserId = getUserId();

  const toggle = (list, setList, value) => {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setError('');
    try {
      const tags = [
        ...hobbies.map((name) => ({ name, type: 'hobby' })),
        ...interests.map((name) => ({ name, type: 'interest' })),
      ];
      const data = {
        device_id: getDeviceId(),
        faculty,
        grade: Number(grade),
        ...mbti,
        relation_value: Number(relationValue),
        gender_pref: genderPref,
        tags,
      };
      const user = await registerUser(data);
      setUserId(user.id);
      setResult(user);
      setStatus('done');
    } catch (err) {
      setError(err.message || '登録に失敗しました');
      setStatus('error');
    }
  };

  // 登録完了画面
  if (status === 'done' && result) {
    return (
      <section className="card">
        <h2>✅ 登録が完了しました</h2>
        <dl className="result">
          <dt>ユーザーID</dt>
          <dd><code>{result.id}</code></dd>
          <dt>学部 / 学年</dt>
          <dd>{result.faculty || '—'} / {result.grade ? `${result.grade}年` : '—'}</dd>
          <dt>求める関係値</dt>
          <dd>{result.relation_value}</dd>
          <dt>タグ</dt>
          <dd>{result.tags?.length ? result.tags.map((t) => t.name).join('、') : '—'}</dd>
        </dl>
        <p className="hint">このIDは端末に保存されました（次のマッチング画面で使用します）。</p>
        <button type="button" className="primary" onClick={() => navigate && navigate('/home')}>
          マッチングへ進む
        </button>
        <button type="button" className="secondary" onClick={() => setStatus('idle')}>
          プロフィールを編集する
        </button>
      </section>
    );
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>プロフィール登録</h2>

      {savedUserId && (
        <p className="banner">
          この端末は登録済みです（ID: <code>{savedUserId.slice(0, 8)}…</code>）。
          再登録すると内容が更新されます。
        </p>
      )}

      <label className="field">
        <span>学部</span>
        <input
          type="text"
          value={faculty}
          placeholder="例: 工学部"
          onChange={(e) => setFaculty(e.target.value)}
        />
      </label>

      <label className="field">
        <span>学年</span>
        <select value={grade} onChange={(e) => setGrade(e.target.value)}>
          {[1, 2, 3, 4, 5, 6].map((g) => (
            <option key={g} value={g}>{g}年</option>
          ))}
        </select>
      </label>

      <fieldset className="field">
        <legend>MBTI（スライダー 0〜100）</legend>
        {MBTI_AXES.map((axis) => (
          <div className="slider-row" key={axis.key}>
            <span className="slider-label left">{axis.left}</span>
            <input
              type="range"
              min="0"
              max="100"
              value={mbti[axis.key]}
              onChange={(e) => setMbti({ ...mbti, [axis.key]: Number(e.target.value) })}
            />
            <span className="slider-label right">{axis.right}</span>
            <span className="slider-value">{mbti[axis.key]}</span>
          </div>
        ))}
      </fieldset>

      <label className="field">
        <span>求める関係値（1〜5）</span>
        <input
          type="range"
          min="1"
          max="5"
          value={relationValue}
          onChange={(e) => setRelationValue(Number(e.target.value))}
        />
        <span className="slider-value">{relationValue}</span>
      </label>

      <label className="field">
        <span>性別の希望</span>
        <select value={genderPref} onChange={(e) => setGenderPref(e.target.value)}>
          <option value="any">どちらでも</option>
          <option value="same">同性のみ</option>
        </select>
      </label>

      <fieldset className="field">
        <legend>趣味（hobby）</legend>
        <div className="chips">
          {HOBBIES.map((h) => (
            <button
              type="button"
              key={h}
              className={`chip ${hobbies.includes(h) ? 'on' : ''}`}
              onClick={() => toggle(hobbies, setHobbies, h)}
            >
              {h}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="field">
        <legend>興味（interest）</legend>
        <div className="chips">
          {INTERESTS.map((i) => (
            <button
              type="button"
              key={i}
              className={`chip ${interests.includes(i) ? 'on' : ''}`}
              onClick={() => toggle(interests, setInterests, i)}
            >
              {i}
            </button>
          ))}
        </div>
      </fieldset>

      {status === 'error' && (
        <p className="error">⚠️ {error}（バックエンドが http://localhost:3000 で起動しているか確認してください）</p>
      )}

      <button type="submit" className="primary" disabled={status === 'loading'}>
        {status === 'loading' ? '登録中…' : '登録する'}
      </button>
    </form>
  );
}
