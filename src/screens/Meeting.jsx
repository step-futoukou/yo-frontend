import { useState, useEffect } from "react";
import { getUserId, getUser, getMatch, sendWishes, getProposal, getMeetingStatus, confirmMeeting, sendReminder, getNotifications } from "../api.js";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  .yo-root { min-height:100vh; background:#F5F2EE; display:flex; align-items:center; justify-content:center; font-family:'DM Sans',sans-serif; }
  .yo-phone { width:360px; height:720px; background:#FDFCFA; border-radius:40px; border:1px solid #EAE6E0; box-shadow:0 40px 100px rgba(0,0,0,0.09); overflow:hidden; position:relative; display:flex; flex-direction:column; }
  .yo-bg { position:absolute; border-radius:50%; pointer-events:none; }
  .yo-status { display:flex; justify-content:flex-end; padding:18px 28px 0; font-size:11px; color:#C0BAB4; letter-spacing:2px; flex-shrink:0; position:relative; z-index:2; }
  .yo-body { flex:1; display:flex; flex-direction:column; padding:20px 24px 0; position:relative; z-index:2; overflow-y:auto; min-height:0; }
  .yo-body::-webkit-scrollbar { display:none; }
  .yo-page-title { font-family:'DM Serif Display',serif; font-size:26px; color:#1C1A18; letter-spacing:-0.5px; margin-bottom:5px; flex-shrink:0; }
  .yo-page-sub { font-size:12px; color:#9A9490; margin-bottom:18px; line-height:1.7; flex-shrink:0; }
  .yo-sec-label { font-size:12px; font-weight:500; color:#6A6460; margin-bottom:8px; flex-shrink:0; }
  .yo-divider { height:1px; background:#F0EDE8; margin:14px 0; flex-shrink:0; }
  .yo-day-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:6px; margin-bottom:8px; }
  .yo-day-col { display:flex; flex-direction:column; gap:4px; }
  .yo-day-header { text-align:center; padding:6px 4px; background:#F5F2EE; border-radius:8px; }
  .yo-day-label { font-size:11px; font-weight:500; color:#1C1A18; }
  .yo-slot-btn { padding:6px 4px; border-radius:8px; border:1px solid #EAE6E0; background:transparent; font-family:'DM Sans',sans-serif; font-size:11px; color:#9A9490; cursor:pointer; text-align:center; transition:all 0.15s; line-height:1.4; }
  .yo-slot-btn.selected { background:#2C2A28; color:#FDFCFA; border-color:#2C2A28; }
  .yo-place-grid { display:grid; grid-template-columns:1fr 1fr; gap:7px; margin-bottom:12px; }
  .yo-place-btn { padding:10px; border-radius:12px; border:1px solid #EAE6E0; background:transparent; font-family:'DM Sans',sans-serif; font-size:12px; color:#9A9490; cursor:pointer; text-align:left; transition:all 0.18s; line-height:1.5; }
  .yo-place-btn.selected { border-color:#2C2A28; background:#2C2A28; color:#FDFCFA; }
  .yo-place-icon { display:block; font-size:16px; margin-bottom:3px; }
  .yo-footer { padding:8px 24px 28px; display:flex; flex-direction:column; gap:9px; flex-shrink:0; position:relative; z-index:2; }
  .yo-btn-p { width:100%; height:52px; border-radius:100px; border:none; background:#2C2A28; color:#FDFCFA; font-family:'DM Sans',sans-serif; font-size:15px; font-weight:500; cursor:pointer; transition:background 0.2s,transform 0.15s; }
  .yo-btn-p:hover { background:#3C3A38; }
  .yo-btn-p:active { transform:scale(0.97); }
  .yo-btn-p:disabled { background:#E4DED8; cursor:default; }
  .yo-btn-ghost { width:100%; height:40px; border-radius:100px; border:none; background:transparent; color:#C0BAB4; font-family:'DM Sans',sans-serif; font-size:13px; cursor:pointer; }
  .yo-match-body { flex:1; display:flex; flex-direction:column; align-items:center; padding:20px 32px 0; position:relative; z-index:2; overflow-y:auto; }
  .yo-match-body::-webkit-scrollbar { display:none; }
  .yo-match-title { font-family:'DM Serif Display',serif; font-size:52px; color:#1C1A18; letter-spacing:-2px; line-height:1; margin-bottom:6px; opacity:0; transform:translateY(12px); animation:fadeUp 0.6s cubic-bezier(.16,1,.3,1) 0.1s forwards; }
  .yo-match-sub { font-size:13px; color:#9A9490; margin-bottom:28px; opacity:0; animation:fadeUp 0.6s cubic-bezier(.16,1,.3,1) 0.2s forwards; }
  @keyframes fadeUp { to { opacity:1; transform:translateY(0); } }
  .yo-avatars { display:flex; align-items:center; margin-bottom:24px; opacity:0; animation:fadeUp 0.6s cubic-bezier(.16,1,.3,1) 0.3s forwards; }
  .yo-avatar { width:60px; height:60px; border-radius:50%; background:#F0EDE8; border:2px solid #FDFCFA; display:flex; align-items:center; justify-content:center; font-size:20px; box-shadow:0 2px 12px rgba(0,0,0,0.06); }
  .yo-avatar.me { background:#2C2A28; color:#FDFCFA; }
  .yo-avatar.them { margin-left:-10px; }
  .yo-connect-dot { width:6px; height:6px; border-radius:50%; background:#C8A97A; margin:0 10px; }
  .yo-info-card { width:100%; background:#F5F2EE; border-radius:16px; padding:14px 16px; margin-bottom:14px; opacity:0; animation:fadeUp 0.6s cubic-bezier(.16,1,.3,1) 0.4s forwards; }
  .yo-info-row { display:flex; align-items:flex-start; gap:10px; margin-bottom:10px; }
  .yo-info-row:last-child { margin-bottom:0; }
  .yo-info-key { font-size:11px; color:#B8B2AA; min-width:52px; flex-shrink:0; }
  .yo-info-val { font-size:12px; color:#1C1A18; line-height:1.6; }
  .yo-tag-inline { display:inline-block; font-size:11px; padding:2px 9px; border-radius:20px; margin:2px 3px 2px 0; background:#2C2A28; color:#FDFCFA; }
  .yo-notice { font-size:11px; color:#C0BAB4; text-align:center; line-height:1.8; margin-bottom:14px; opacity:0; animation:fadeUp 0.6s cubic-bezier(.16,1,.3,1) 0.5s forwards; }
  .yo-wait-center { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:0 36px; text-align:center; position:relative; z-index:2; }
  .yo-wait-dots { display:flex; gap:8px; margin-bottom:24px; }
  .yo-dot { width:8px; height:8px; border-radius:50%; background:#D4C4B0; animation:pulse 1.4s ease-in-out infinite; }
  .yo-dot:nth-child(2) { animation-delay:0.2s; }
  .yo-dot:nth-child(3) { animation-delay:0.4s; }
  @keyframes pulse { 0%,80%,100%{opacity:0.3;transform:scale(0.9);}40%{opacity:1;transform:scale(1.1);} }
  .yo-wait-title { font-family:'DM Serif Display',serif; font-size:22px; color:#1C1A18; margin-bottom:8px; }
  .yo-wait-sub { font-size:12px; color:#9A9490; line-height:1.8; }
  .yo-propose-card { width:100%; background:#F5F2EE; border-radius:16px; padding:18px 20px; margin-bottom:16px; }
  .yo-propose-row { display:flex; gap:12px; margin-bottom:12px; }
  .yo-propose-row:last-child { margin-bottom:0; }
  .yo-propose-key { font-size:11px; color:#B8B2AA; min-width:40px; }
  .yo-propose-val { font-size:14px; font-weight:500; color:#1C1A18; }
  .yo-done-center { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:0 36px; text-align:center; position:relative; z-index:2; }
  .yo-error { font-size:12px; color:#C0544A; text-align:center; margin-top:8px; }
`;

const days = [
  { label:"明日", slots:["午前中","昼","ティータイム","放課後","夕方〜"] },
  { label:"明後日", slots:["午前中","昼","ティータイム","放課後","夕方〜"] },
  { label:"3日後", slots:["1限","2限","3限","昼休み","4限","5限","放課後"] },
];
const places = [
  { icon:"☕", label:"学食・カフェ" },
  { icon:"📚", label:"図書館前" },
  { icon:"🌿", label:"中庭・広場" },
  { icon:"🏪", label:"コンビニ前" },
  { icon:"🏛️", label:"正門前" },
  { icon:"📖", label:"講義棟ロビー" },
];

export default function Meeting({ navigate, matchData, initialScreen }) {
  const [screen, setScreen] = useState(initialScreen || "match");
  const [mySlots, setMySlots] = useState(new Set());
  const [myPlaces, setMyPlaces] = useState(new Set());
  const [proposal, setProposal] = useState(null);
  const [meetingId, setMeetingId] = useState(localStorage.getItem("yo_meeting_id"));
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const [commonTags, setCommonTags] = useState([]);
  const [partnerInfo, setPartnerInfo] = useState(null);

  const userId = getUserId();
  const matchId = localStorage.getItem("yo_match_id");

  // 相手プロフィール（学部・学年）と共通タグを backend から取得（match画面で表示）
  useEffect(() => {
    if (!matchId) return;
    (async () => {
      try {
        const st = await getMeetingStatus(matchId);
        setCommonTags(Array.isArray(st.common_tags) ? st.common_tags : []);
        const partnerId = st.match.user_a_id === userId ? st.match.user_b_id : st.match.user_a_id;
        try {
          const p = await getUser(partnerId);
          setPartnerInfo({ faculty: p.faculty, grade: p.grade });
        } catch (e) { /* プロフィール取得失敗は無視 */ }
      } catch (e) { /* status取得失敗は無視 */ }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleSlot = (key) => setMySlots(prev => { const n = new Set(prev); n.has(key)?n.delete(key):n.add(key); return n; });
  const togglePlace = (i) => setMyPlaces(prev => { const n = new Set(prev); n.has(i)?n.delete(i):n.add(i); return n; });

  const handleSendWishes = async () => {
    if (mySlots.size === 0 && myPlaces.size === 0) { setError("時間か場所を選んでください"); return; }
    setSending(true); setError(null);
    try {
      const timeSlots = [...mySlots];
      const placeNames = [...myPlaces].map(i => places[i].label);
      await sendWishes(matchId, userId, timeSlots, placeNames);
      setScreen("waiting");
      startPolling();
    } catch(e) { setError("送信に失敗しました。再度お試しください"); }
    setSending(false);
  };

  const startPolling = () => {
    const iv = setInterval(async () => {
      try {
        const result = await getProposal(matchId);
        if (result.status === "proposed") {
          setProposal(result); setMeetingId(result.meeting_id);
          localStorage.setItem("yo_meeting_id", result.meeting_id);
          setScreen("propose"); clearInterval(iv);
        } else if (result.status === "no_match") { setScreen("no_match"); clearInterval(iv); }
      } catch(e) {}
    }, 10000);
    return () => clearInterval(iv);
  };

  // 両者合意（confirmed_a && confirmed_b）になったら done へ。状態ベースで監視（復元でも使える）。
  const startConfirmPolling = () => {
    const iv = setInterval(async () => {
      try {
        const st = await getMeetingStatus(matchId);
        if (st.meeting && st.meeting.confirmed_a === 1 && st.meeting.confirmed_b === 1) {
          setScreen("done"); clearInterval(iv);
        }
      } catch(e) {}
    }, 10000);
    return () => clearInterval(iv);
  };

  const handleConfirm = async () => {
    try {
      // 自分がこのマッチの user_a なら 'a'、user_b なら 'b' を確定する（side固定は両者aになり成立しない）
      let side = "a";
      try {
        const match = await getMatch(matchId);
        side = match.user_b_id === userId ? "b" : "a";
      } catch (e) { /* 取得失敗時は 'a' にフォールバック */ }
      await confirmMeeting(meetingId, side);
      setScreen("confirming");
      startConfirmPolling();
    } catch(e) { setError("確定に失敗しました"); }
  };

  // 復元（initialScreen）で waiting/propose/confirming に直接入った場合、
  // 必要なポーリング/提案取得をマウント時に立ち上げる。
  useEffect(() => {
    if (!initialScreen) return undefined;
    if (initialScreen === "waiting") return startPolling();
    if (initialScreen === "confirming") return startConfirmPolling();
    if (initialScreen === "propose") {
      (async () => {
        try {
          const p = await getProposal(matchId);
          if (p.status === "proposed") {
            setProposal(p); setMeetingId(p.meeting_id);
            localStorage.setItem("yo_meeting_id", p.meeting_id);
          }
        } catch(e) {}
      })();
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Bg = () => (
    <>
      <div className="yo-bg" style={{width:260,height:260,background:"#D4C4B0",opacity:0.11,top:-70,right:-70}}/>
      <div className="yo-bg" style={{width:180,height:180,background:"#B8C9B0",opacity:0.09,bottom:60,left:-50}}/>
    </>
  );

  if (screen === "match") return (
    <><style>{css}</style>
    <div className="yo-root"><div className="yo-phone">
      <Bg/>
      <div className="yo-status">● ● ●</div>
      <div className="yo-match-body">
        <div className="yo-match-title">Yo!</div>
        <div className="yo-match-sub">顔見知りになれそうな人がいます</div>
        <div className="yo-avatars">
          <div className="yo-avatar me">あ</div>
          <div className="yo-connect-dot"/>
          <div className="yo-avatar them">?</div>
        </div>
        <div className="yo-info-card">
          <div className="yo-info-row">
            <span className="yo-info-key">相手</span>
            <span className="yo-info-val">
              {(partnerInfo?.faculty || matchData?.other_user?.faculty || "—")} · {(partnerInfo?.grade || matchData?.other_user?.grade || "—")}年生
            </span>
          </div>
          <div className="yo-info-row">
            <span className="yo-info-key">共通点</span>
            <span className="yo-info-val">
              {commonTags.length > 0
                ? commonTags.map((t) => <span key={t} className="yo-tag-inline">{t}</span>)
                : <span style={{color:"#9A9490"}}>当日のお楽しみ</span>}
            </span>
          </div>
        </div>
        <div className="yo-notice">名前・顔写真は表示されません<br/>まず話してみましょう</div>
      </div>
      <div className="yo-footer">
        <button className="yo-btn-p" onClick={()=>setScreen("wish")}>待ち合わせの希望を送る</button>
        <button className="yo-btn-ghost" onClick={()=>navigate("home")}>あとで決める</button>
      </div>
    </div></div></>
  );

  if (screen === "wish") return (
    <><style>{css}</style>
    <div className="yo-root"><div className="yo-phone">
      <Bg/>
      <div className="yo-status">● ● ●</div>
      <div className="yo-body">
        <div className="yo-page-title">希望を送る</div>
        <div className="yo-page-sub">都合のよい時間と場所を選んでください（複数可）</div>
        <div className="yo-sec-label">時間帯</div>
        <div className="yo-day-grid">
          {days.map(d => (
            <div key={d.label} className="yo-day-col">
              <div className="yo-day-header"><span className="yo-day-label">{d.label}</span></div>
              {d.slots.map(s => {
                const key = `${d.label}-${s}`;
                return <button key={s} className={"yo-slot-btn"+(mySlots.has(key)?" selected":"")} onClick={()=>toggleSlot(key)}>{s}</button>;
              })}
            </div>
          ))}
        </div>
        <div className="yo-divider"/>
        <div className="yo-sec-label">場所</div>
        <div className="yo-place-grid">
          {places.map((p,i) => (
            <button key={i} className={"yo-place-btn"+(myPlaces.has(i)?" selected":"")} onClick={()=>togglePlace(i)}>
              <span className="yo-place-icon">{p.icon}</span>{p.label}
            </button>
          ))}
        </div>
        {error && <div className="yo-error">{error}</div>}
        <div style={{height:8}}/>
      </div>
      <div className="yo-footer">
        <button className="yo-btn-p" disabled={sending} onClick={handleSendWishes}>{sending?"送信中...":"相手に送る"}</button>
        <button className="yo-btn-ghost" onClick={()=>setScreen("match")}>もどる</button>
      </div>
    </div></div></>
  );

  if (screen === "waiting") return (
    <><style>{css}</style>
    <div className="yo-root"><div className="yo-phone">
      <Bg/>
      <div className="yo-status">● ● ●</div>
      <div className="yo-wait-center">
        <div className="yo-wait-dots"><div className="yo-dot"/><div className="yo-dot"/><div className="yo-dot"/></div>
        <div className="yo-wait-title">相手の返答を待っています</div>
        <div className="yo-wait-sub">希望が届いたら通知でお知らせします</div>
      </div>
      <div className="yo-footer">
        <button className="yo-btn-ghost" onClick={async()=>{try{await sendReminder(matchId,userId);}catch(e){} alert("再通知しました");}}>再通知する</button>
        <button className="yo-btn-ghost" style={{color:"#C0544A"}} onClick={()=>navigate("home")}>ホームへもどる</button>
      </div>
    </div></div></>
  );

  if (screen === "propose") return (
    <><style>{css}</style>
    <div className="yo-root"><div className="yo-phone">
      <Bg/>
      <div className="yo-status">● ● ●</div>
      <div className="yo-body">
        <div className="yo-page-title">候補が届きました</div>
        <div className="yo-page-sub">アプリが自動で提案しました</div>
        <div className="yo-propose-card">
          <div className="yo-propose-row">
            <span className="yo-propose-key">日時</span>
            <span className="yo-propose-val">{proposal?.proposed_time || "3日後 昼休み"}</span>
          </div>
          <div className="yo-propose-row">
            <span className="yo-propose-key">場所</span>
            <span className="yo-propose-val">🌿 {proposal?.proposed_place || "中庭・広場"}</span>
          </div>
        </div>
        {error && <div className="yo-error">{error}</div>}
      </div>
      <div className="yo-footer">
        <button className="yo-btn-p" onClick={handleConfirm}>了解した！</button>
        <button className="yo-btn-ghost" onClick={()=>setScreen("wish")}>希望を変更する</button>
      </div>
    </div></div></>
  );

  if (screen === "confirming") return (
    <><style>{css}</style>
    <div className="yo-root"><div className="yo-phone">
      <Bg/>
      <div className="yo-status">● ● ●</div>
      <div className="yo-wait-center">
        <div className="yo-wait-dots"><div className="yo-dot"/><div className="yo-dot"/><div className="yo-dot"/></div>
        <div className="yo-wait-title">相手の確認を待っています</div>
        <div className="yo-wait-sub">相手が確認したら通知でお知らせします</div>
      </div>
      <div className="yo-footer">
        <button className="yo-btn-ghost" onClick={async()=>{try{await sendReminder(matchId,userId);}catch(e){} alert("再通知しました");}}>再通知する</button>
      </div>
    </div></div></>
  );

  if (screen === "no_match") return (
    <><style>{css}</style>
    <div className="yo-root"><div className="yo-phone">
      <Bg/>
      <div className="yo-status">● ● ●</div>
      <div className="yo-done-center">
        <div style={{fontSize:32,marginBottom:16}}>🍃</div>
        <div style={{fontFamily:"'DM Serif Display',serif",fontSize:22,color:"#1C1A18",marginBottom:8}}>今回はご縁がありませんでした</div>
        <div style={{fontSize:12,color:"#9A9490",lineHeight:1.8,marginBottom:28}}>また別の出会いを探してみましょう</div>
      </div>
      <div className="yo-footer">
        <button className="yo-btn-p" onClick={()=>navigate("home")}>ホームへもどる</button>
      </div>
    </div></div></>
  );

  return (
    <><style>{css}</style>
    <div className="yo-root"><div className="yo-phone">
      <Bg/>
      <div className="yo-status">● ● ●</div>
      <div className="yo-done-center">
        <div style={{fontSize:36,marginBottom:14}}>🎉</div>
        <div style={{fontFamily:"'DM Serif Display',serif",fontSize:26,color:"#1C1A18",marginBottom:8}}>準備完了！</div>
        <div style={{fontSize:12,color:"#9A9490",lineHeight:1.9,marginBottom:28}}>当日ミッションをお渡しします<br/>気負わずに行きましょう</div>
      </div>
      <div className="yo-footer">
        <button className="yo-btn-p" onClick={()=>navigate("mission")}>ミッションへ</button>
      </div>
    </div></div></>
  );
}
