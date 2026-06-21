import { useState } from 'react';
import { getUserId, getUser, findMatch } from '../api.js';

const MATCH_KEY = 'yo_match_id';

export default function Home({ navigate }) {
  const userId = getUserId();

  // 'idle' | 'searching' | 'matched'
  const [status, setStatus] = useState('idle');
  const [match, setMatch] = useState(null);
  const [partner, setPartner] = useState(null);
  const [common, setCommon] = useState([]);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const handleSearch = async () => {
    if (!userId) {
      setError('先にプロフィール登録をしてください');
      return;
    }
    setStatus('searching');
    setError('');
    setInfo('');
    setMatch(null);
    setPartner(null);

    try {
      const res = await findMatch(userId);

      // マッチ相手がいない
      if (!res.match || !res.candidates || res.candidates.length === 0) {
        setStatus('idle');
        setInfo('いまはマッチできる相手がいません。しばらくしてから試してください。');
        return;
      }

      // matchId を localStorage に保存
      localStorage.setItem(MATCH_KEY, res.match.id);
      setMatch({ ...res.match, rematch: res.rematch });

      // 相手と自分のプロフィールから共通点を算出
      const partnerId = res.candidates[0].user_id;
      const [me, other] = await Promise.all([getUser(userId), getUser(partnerId)]);
      setPartner(other);
      const myTagNames = new Set((me.tags || []).map((t) => t.name));
      setCommon((other.tags || []).filter((t) => myTagNames.has(t.name)).map((t) => t.name));

      setStatus('matched');
    } catch (e) {
      setStatus('idle');
      setError('しばらくしてから試してください');
    }
  };

  // 未登録
  if (!userId) {
    return (
      <section className="card">
        <h2>ホーム</h2>
        <p className="banner">プロフィールが未登録です。</p>
        <button type="button" className="primary" onClick={() => navigate('/')}>
          プロフィール登録へ
        </button>
      </section>
    );
  }

  return (
    <section className="card">
      <h2>マッチング</h2>

      {status !== 'matched' && (
        <>
          <p className="hint">ボタンを押すと、相性の良い相手を探します。</p>
          <button
            type="button"
            className="primary"
            onClick={handleSearch}
            disabled={status === 'searching'}
          >
            {status === 'searching' ? '探しています…' : 'マッチングを探す'}
          </button>
          {info && <p className="banner" style={{ marginTop: 16 }}>{info}</p>}
          {error && <p className="error" style={{ marginTop: 16 }}>⚠️ {error}</p>}
        </>
      )}

      {status === 'matched' && partner && (
        <div className="matched">
          <div className="matched-badge">
            {match?.rematch ? '🪢 縁をつなぐマッチ' : '🎉 マッチ成立！'}
            <span className="score">相性 {match?.score ?? '—'}</span>
          </div>

          <dl className="result">
            <dt>学部</dt>
            <dd>{partner.faculty || '—'}</dd>
            <dt>学年</dt>
            <dd>{partner.grade ? `${partner.grade}年` : '—'}</dd>
            <dt>共通点</dt>
            <dd>
              {common.length > 0 ? (
                <div className="chips">
                  {common.map((c) => (
                    <span key={c} className="chip on">{c}</span>
                  ))}
                </div>
              ) : (
                '共通点はまだ見つかりませんでした'
              )}
            </dd>
          </dl>

          <button type="button" className="primary" onClick={() => navigate('meeting')}>
            待ち合わせを決める
          </button>
          <button type="button" className="secondary" onClick={() => navigate('/review')}>
            会った後のレビューへ
          </button>
          <button type="button" className="secondary" onClick={handleSearch}>
            もう一度探す
          </button>
        </div>
      )}
    </section>
  );
}
