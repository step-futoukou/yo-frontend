import { useState, useEffect } from "react";
import { getUserId, getMatch, arriveMeeting } from "../api.js";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  .yo-root { min-height:100vh; background:#F5F2EE; display:flex; align-items:center; justify-content:center; font-family:'DM Sans',sans-serif; }
  .yo-phone { width:360px; height:720px; background:#FDFCFA; border-radius:40px; border:1px solid #EAE6E0; box-shadow:0 40px 100px rgba(0,0,0,0.09); overflow:hidden; position:relative; display:flex; flex-direction:column; }
  .yo-bg { position:absolute; border-radius:50%; pointer-events:none; }
  .yo-status { display:flex; justify-content:flex-end; padding:18px 28px 0; font-size:11px; color:#C0BAB4; letter-spacing:2px; flex-shrink:0; position:relative; z-index:2; }
  .yo-body { flex:1; display:flex; flex-direction:column; padding:20px 28px 0; position:relative; z-index:2; overflow-y:auto; min-height:0; }
  .yo-body::-webkit-scrollbar { display:none; }
  .yo-footer { padding:8px 28px 28px; display:flex; flex-direction:column; gap:9px; flex-shrink:0; position:relative; z-index:2; }
  .yo-btn-p { width:100%; height:52px; border-radius:100px; border:none; background:#2C2A28; color:#FDFCFA; font-family:'DM Sans',sans-serif; font-size:15px; font-weight:500; cursor:pointer; transition:background 0.2s,transform 0.15s; }
  .yo-btn-p:hover { background:#3C3A38; }
  .yo-btn-p:active { transform:scale(0.97); }
  .yo-btn-p:disabled { background:#E4DED8; cursor:default; }
  .yo-btn-o { width:100%; height:46px; border-radius:100px; border:1px solid #E4DED8; background:transparent; color:#6A6460; font-family:'DM Sans',sans-serif; font-size:13px; cursor:pointer; }
  .yo-btn-ghost { width:100%; height:40px; border-radius:100px; border:none; background:transparent; color:#C0BAB4; font-family:'DM Sans',sans-serif; font-size:13px; cursor:pointer; }
  .yo-meeting-card { background:#F5F2EE; border-radius:16px; padding:16px 18px; margin-bottom:16px; flex-shrink:0; }
  .yo-meeting-row { display:flex; gap:10px; margin-bottom:8px; }
  .yo-meeting-row:last-child { margin-bottom:0; }
  .yo-meeting-key { font-size:11px; color:#B8B2AA; min-width:40px; padding-top:2px; flex-shrink:0; }
  .yo-meeting-val { font-size:13px; font-weight:500; color:#1C1A18; }
  .yo-sec-label { font-size:12px; font-weight:500; color:#6A6460; margin-bottom:8px; flex-shrink:0; }
  .yo-msg-input { width:100%; border-radius:12px; border:1px solid #EAE6E0; background:#FDFCFA; padding:12px 14px; font-size:13px; font-family:'DM Sans',sans-serif; color:#1C1A18; outline:none; resize:none; box-sizing:border-box; line-height:1.6; margin-bottom:6px; }
  .yo-msg-input::placeholder { color:#C8C2BC; }
  .yo-sent-badge { display:inline-flex; align-items:center; gap:5px; font-size:11px; color:#4A8A4A; background:#E8F5E8; padding:4px 10px; border-radius:20px; }
  .yo-action-row { display:flex; gap:8px; }
  .yo-action-btn { flex:1; padding:10px 6px; border-radius:12px; border:1px solid #EAE6E0; background:transparent; font-family:'DM Sans',sans-serif; font-size:12px; color:#9A9490; cursor:pointer; text-align:center; line-height:1.5; }
  .yo-action-btn.danger { color:#C0544A; border-color:#F0DFDD; }
  .yo-modal-overlay { position:absolute; inset:0; background:rgba(28,26,24,0.5); display:flex; align-items:flex-end; z-index:10; border-radius:40px; }
  .yo-modal { background:#FDFCFA; border-radius:24px 24px 0 0; padding:28px 28px 36px; width:100%; }
  .yo-modal-title { font-family:'DM Serif Display',serif; font-size:22px; color:#1C1A18; margin-bottom:8px; }
  .yo-modal-sub { font-size:12px; color:#9A9490; margin-bottom:20px; line-height:1.7; }
  .yo-modal-input { width:100%; border-radius:10px; border:1px solid #EAE6E0; background:#F5F2EE; padding:12px 14px; font-size:13px; font-family:'DM Sans',sans-serif; outline:none; resize:none; box-sizing:border-box; margin-bottom:14px; color:#1C1A18; }
  .yo-modal-input::placeholder { color:#C8C2BC; }
  .yo-time-row { display:flex; gap:7px; margin-bottom:14px; }
  .yo-time-chip { flex:1; padding:10px 4px; border-radius:10px; border:1px solid #EAE6E0; background:transparent; font-family:'DM Sans',sans-serif; font-size:12px; color:#9A9490; cursor:pointer; text-align:center; }
  .yo-time-chip.selected { background:#2C2A28; color:#FDFCFA; border-color:#2C2A28; }
  .yo-warn-box { background:#FDF2F0; border:1px solid #F0DFDD; border-radius:10px; padding:10px 14px; margin-bottom:14px; font-size:12px; color:#C0544A; line-height:1.7; }
  .yo-wait-center { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:0 36px; text-align:center; position:relative; z-index:2; }
  .yo-wait-dots { display:flex; gap:8px; margin-bottom:20px; }
  .yo-dot { width:8px; height:8px; border-radius:50%; background:#D4C4B0; animation:pulse 1.4s ease-in-out infinite; }
  .yo-dot:nth-child(2) { animation-delay:0.2s; }
  .yo-dot:nth-child(3) { animation-delay:0.4s; }
  @keyframes pulse { 0%,80%,100%{opacity:0.3;transform:scale(0.9);}40%{opacity:1;transform:scale(1.1);} }
  .yo-wait-title { font-family:'DM Serif Display',serif; font-size:22px; color:#1C1A18; margin-bottom:8px; }
  .yo-wait-sub { font-size:12px; color:#9A9490; line-height:1.8; margin-bottom:20px; }
  .yo-mission-reveal { flex:1; display:flex; flex-direction:column; padding:20px 24px 0; position:relative; z-index:2; overflow-y:auto; min-height:0; }
  .yo-mission-reveal::-webkit-scrollbar { display:none; }
  .yo-mission-header { text-align:center; margin-bottom:20px; flex-shrink:0; }
  .yo-mission-header-title { font-family:'DM Serif Display',serif; font-size:28px; color:#1C1A18; letter-spacing:-0.5px; margin-bottom:4px; }
  .yo-mission-header-sub { font-size:12px; color:#9A9490; }
  .yo-mission-cards { display:flex; flex-direction:column; gap:12px; margin-bottom:16px; flex-shrink:0; }
  .yo-mission-card { border-radius:18px; border:1.5px solid #EAE6E0; background:#FDFCFA; padding:20px; cursor:pointer; position:relative; overflow:hidden; opacity:0; transform:translateY(20px); }
  .yo-mission-card.show { opacity:1; transform:translateY(0); transition:opacity 0.5s cubic-bezier(.16,1,.3,1), transform 0.5s cubic-bezier(.16,1,.3,1), border-color 0.2s, background 0.2s; }
  .yo-mission-card.show.delay { transition-delay:0.15s; }
  .yo-mission-card:hover { border-color:#C8C2BC; }
  .yo-mission-card.selected { border-color:#2C2A28; background:#2C2A28; }
  .yo-mission-card-label { font-size:11px; color:#B8B2AA; margin-bottom:8px; display:flex; align-items:center; gap:6px; }
  .yo-mission-card.selected .yo-mission-card-label { color:#9A9490; }
  .yo-mission-stars { color:#C8A97A; }
  .yo-mission-card.selected .yo-mission-stars { color:#E8C890; }
  .yo-mission-text { font-size:14px; font-weight:500; color:#1C1A18; line-height:1.8; }
  .yo-mission-card.selected .yo-mission-text { color:#FDFCFA; }
  .yo-mission-check { position:absolute; top:16px; right:16px; width:24px; height:24px; border-radius:50%; background:#FDFCFA; display:flex; align-items:center; justify-content:center; font-size:13px; opacity:0; }
  .yo-mission-card.selected .yo-mission-check { opacity:1; }
  .yo-or-divider { text-align:center; font-size:12px; color:#C8C2BC; margin:-4px 0; flex-shrink:0; }
  .yo-active-card { background:#2C2A28; border-radius:20px; padding:24px 22px; margin-bottom:20px; flex-shrink:0; }
  .yo-active-label { font-size:11px; color:#9A9490; margin-bottom:10px; display:flex; align-items:center; gap:6px; }
  .yo-active-stars { color:#C8A97A; }
  .yo-active-text { font-size:16px; font-weight:500; color:#FDFCFA; line-height:1.9; }
  .yo-skip-info { font-size:11px; color:#B8B2AA; text-align:center; margin-bottom:8px; flex-shrink:0; }
  .yo-divider { height:1px; background:#F0EDE8; margin:16px 0; flex-shrink:0; }
`;

const MAX_SKIP = 2;
const missionPool = [
  { text:"スマホのホーム画面を見せ合って、一番気になったアプリを聞く", stars:"★★", type:"話題ガチャ" },
  { text:"今日ここに来るまでに気になったものを1つ話す", stars:"★", type:"話題ガチャ" },
  { text:"最近よく聴いている曲を1つ聴かせ合う", stars:"★", type:"体験ミッション" },
  { text:"今持っているもので一番長く使っているものを紹介し合う", stars:"★★", type:"話題ガチャ" },
  { text:"朝型か夜型かを話す", stars:"★", type:"話題ガチャ" },
  { text:"最近ぼーっと考えていたことを話す", stars:"★", type:"話題ガチャ" },
];

export default function Mission({ navigate, initialScreen }) {
  const [screen, setScreen] = useState(initialScreen || "pre_arrival");
  const [msgText, setMsgText] = useState("");
  const [msgSent, setMsgSent] = useState(false);
  const [modal, setModal] = useState(null);
  const [lateTime, setLateTime] = useState(null);
  const [cancelNote, setCancelNote] = useState("");
  const [cardsShow, setCardsShow] = useState(false);
  const [selectedMission, setSelectedMission] = useState(null);
  const [skipCount, setSkipCount] = useState(0);
  const [missionPairIndex, setMissionPairIndex] = useState(0);
  const [arriving, setArriving] = useState(false);

  const userId = getUserId();
  const meetingId = localStorage.getItem("yo_meeting_id");
  const matchId = localStorage.getItem("yo_match_id");

  useEffect(() => {
    if (screen === "mission_reveal") {
      const t = setTimeout(() => setCardsShow(true), 300);
      return () => clearTimeout(t);
    }
  }, [screen, missionPairIndex]);

  const pairStart = (missionPairIndex * 2) % missionPool.length;
  const currentMissions = [missionPool[pairStart], missionPool[(pairStart + 1) % missionPool.length]];

  const handleArrive = async () => {
    setArriving(true);
    try {
      if (meetingId) {
        // 自分がこのマッチの user_a なら 'a'、user_b なら 'b'（side固定だと両者aで成立しない）
        let side = "a";
        try {
          const match = await getMatch(matchId);
          side = match.user_b_id === userId ? "b" : "a";
        } catch (e) { /* 取得失敗時は 'a' にフォールバック */ }
        await arriveMeeting(meetingId, side);
      }
    } catch(e) { console.error(e); }
    setScreen("arrived");
    setArriving(false);
  };

  const handleSkip = () => {
    if (skipCount >= MAX_SKIP) return;
    setSkipCount(s => s + 1);
    setMissionPairIndex(p => p + 1);
    setSelectedMission(null);
    setCardsShow(false);
    setTimeout(() => setCardsShow(true), 100);
  };

  const Bg = () => (
    <>
      <div className="yo-bg" style={{width:240,height:240,background:"#D4C4B0",opacity:0.10,top:-60,right:-60}}/>
      <div className="yo-bg" style={{width:160,height:160,background:"#B8C9B0",opacity:0.08,bottom:60,left:-40}}/>
    </>
  );

  // キャンセルモーダル
  const CancelModal = () => (
    <div className="yo-modal-overlay" onClick={()=>setModal(null)}>
      <div className="yo-modal" onClick={e=>e.stopPropagation()}>
        <div className="yo-modal-title">都合が悪くなりました</div>
        <div className="yo-modal-sub">相手に通知が届きます。一言添えることができます。</div>
        <textarea className="yo-modal-input" rows={3} placeholder="例：体調が悪くなってしまいました" value={cancelNote} onChange={e=>setCancelNote(e.target.value)}/>
        <div className="yo-warn-box">⚠️ 何度もキャンセルする場合は、利用停止になる場合があります</div>
        <button className="yo-btn-p" style={{background:"#C0544A",marginBottom:8}} onClick={()=>{setModal(null);setScreen("cancelled");}}>相手に伝える</button>
        <button className="yo-btn-ghost" onClick={()=>setModal(null)}>やめておく</button>
      </div>
    </div>
  );

  // 遅刻モーダル
  const LateModal = () => (
    <div className="yo-modal-overlay" onClick={()=>setModal(null)}>
      <div className="yo-modal" onClick={e=>e.stopPropagation()}>
        <div className="yo-modal-title">遅刻の連絡</div>
        <div className="yo-modal-sub">どのくらい遅れそうですか？</div>
        <div className="yo-time-row">
          {["5分","10分","15分","20分以上"].map(t=>(
            <button key={t} className={"yo-time-chip"+(lateTime===t?" selected":"")} onClick={()=>setLateTime(t)}>{t}</button>
          ))}
        </div>
        <button className="yo-btn-p" disabled={!lateTime} onClick={()=>{setModal(null);alert(`「${lateTime}遅れます」と相手に通知しました`);}}>送る</button>
      </div>
    </div>
  );

  // ① 待機中
  if (screen === "pre_arrival") return (
    <><style>{css}</style>
    <div className="yo-root"><div className="yo-phone">
      <Bg/>
      {modal === "cancel" && <CancelModal/>}
      {modal === "late" && <LateModal/>}
      <div className="yo-status">● ● ●</div>
      <div className="yo-body">
        <div style={{fontFamily:"'DM Serif Display',serif",fontSize:26,color:"#1C1A18",marginBottom:5}}>もうすぐ待ち合わせです</div>
        <div style={{fontSize:12,color:"#9A9490",marginBottom:20,lineHeight:1.7}}>予定時刻の15分前になりました</div>
        <div className="yo-meeting-card">
          <div className="yo-meeting-row"><span className="yo-meeting-key">日時</span><span className="yo-meeting-val">3日後　昼休み</span></div>
          <div className="yo-meeting-row"><span className="yo-meeting-key">場所</span><span className="yo-meeting-val">🌿 中庭・広場</span></div>
        </div>
        <div className="yo-sec-label">居場所や目印を相手に送る（任意）</div>
        <div style={{marginBottom:14}}>
          <textarea className="yo-msg-input" rows={3} placeholder={"例：中庭の大きな木の下にいます\n例：黄色いリュックを持っています"} value={msgText} onChange={e=>{setMsgText(e.target.value);setMsgSent(false);}} disabled={msgSent}/>
          {msgSent ? <span className="yo-sent-badge">✓ 相手に届きました</span>
            : <button className="yo-btn-o" style={{height:38,fontSize:12,marginTop:6}} disabled={!msgText.trim()} onClick={()=>setMsgSent(true)}>送る</button>}
        </div>
        <div style={{height:1,background:"#F0EDE8",margin:"0 0 16px"}}/>
        <div className="yo-sec-label">連絡する</div>
        <div className="yo-action-row">
          <button className="yo-action-btn" onClick={()=>setModal("late")}>⏱ 遅刻しそう</button>
          <button className="yo-action-btn danger" onClick={()=>setModal("cancel")}>都合が悪くなりました</button>
        </div>
      </div>
      <div className="yo-footer">
        <button className="yo-btn-p" disabled={arriving} onClick={handleArrive}>{arriving?"通知中...":"到着しました"}</button>
      </div>
    </div></div></>
  );

  // ② 到着通知済み
  if (screen === "arrived") return (
    <><style>{css}</style>
    <div className="yo-root"><div className="yo-phone">
      <Bg/>
      <div className="yo-status">● ● ●</div>
      <div className="yo-wait-center">
        <div className="yo-wait-dots"><div className="yo-dot"/><div className="yo-dot"/><div className="yo-dot"/></div>
        <div className="yo-wait-title">相手の到着を待っています</div>
        <div className="yo-wait-sub">「到着しました」と相手に通知しました<br/>相手が来たら声をかけてみましょう</div>
      </div>
      <div className="yo-footer">
        <button className="yo-btn-p" onClick={()=>setScreen("meetup_check")}>相手も到着しました</button>
        <button className="yo-btn-ghost" style={{color:"#C0544A"}} onClick={()=>setModal("cancel")}>都合が悪くなりました</button>
      </div>
    </div></div></>
  );

  // ③ 合流確認
  if (screen === "meetup_check") return (
    <><style>{css}</style>
    <div className="yo-root"><div className="yo-phone">
      <Bg/>
      <div className="yo-status">● ● ●</div>
      <div className="yo-wait-center">
        <div style={{fontSize:40,marginBottom:16,animation:"bounceIn 0.5s cubic-bezier(.16,1,.3,1)"}}>👋</div>
        <div style={{fontFamily:"'DM Serif Display',serif",fontSize:26,color:"#1C1A18",marginBottom:8}}>合流できましたか？</div>
        <div style={{fontSize:12,color:"#9A9490",lineHeight:1.8,marginBottom:32}}>合流できたら、ミッションをお渡しします<br/>うまく会えなかった場合はお知らせください</div>
      </div>
      <div className="yo-footer">
        <button className="yo-btn-p" onClick={()=>{setScreen("mission_reveal");}}>合流できました！</button>
        <button className="yo-btn-o" onClick={()=>setScreen("no_meetup")}>うまく会えなかった</button>
      </div>
    </div></div></>
  );

  // ④ ミッション2択
  if (screen === "mission_reveal") return (
    <><style>{css}</style>
    <div className="yo-root"><div className="yo-phone">
      <Bg/>
      <div className="yo-status">● ● ●</div>
      <div className="yo-mission-reveal">
        <div className="yo-mission-header">
          <div className="yo-mission-header-title">今日のミッション</div>
          <div className="yo-mission-header-sub">2人で相談して、どちらかを選んでください</div>
        </div>
        <div className="yo-mission-cards">
          {currentMissions.map((m,i) => (
            <>
              <div key={i} className={"yo-mission-card"+(cardsShow?" show":"")+(i===1?" delay":"")+(selectedMission===i?" selected":"")}
                onClick={()=>setSelectedMission(i)}>
                <div className="yo-mission-card-label"><span className="yo-mission-stars">{m.stars}</span><span>{m.type}</span></div>
                <div className="yo-mission-text">{m.text}</div>
                <div className="yo-mission-check">✓</div>
              </div>
              {i===0 && <div className="yo-or-divider">または</div>}
            </>
          ))}
        </div>
      </div>
      <div className="yo-footer">
        <button className="yo-btn-p" disabled={selectedMission===null} onClick={()=>setScreen("mission_active")}>これにする</button>
        <button className="yo-btn-ghost" disabled={skipCount>=MAX_SKIP} style={{opacity:skipCount>=MAX_SKIP?0.4:1}} onClick={handleSkip}>
          {skipCount>=MAX_SKIP?"スキップできません（残り0回）":`スキップして別のミッションを見る（残り${MAX_SKIP-skipCount}回）`}
        </button>
      </div>
    </div></div></>
  );

  // ⑤ ミッション実行中
  if (screen === "mission_active") {
    const m = currentMissions[selectedMission] || currentMissions[0];
    return (
      <><style>{css}</style>
      <div className="yo-root"><div className="yo-phone">
        <Bg/>
        <div className="yo-status">● ● ●</div>
        <div className="yo-body">
          <div style={{fontFamily:"'DM Serif Display',serif",fontSize:24,color:"#1C1A18",marginBottom:6}}>ミッション</div>
          <div style={{fontSize:12,color:"#9A9490",marginBottom:20,lineHeight:1.7}}>2人でやってみましょう</div>
          <div className="yo-active-card">
            <div className="yo-active-label"><span className="yo-active-stars">{m.stars}</span><span>{m.type}</span></div>
            <div className="yo-active-text">{m.text}</div>
          </div>
          <div className="yo-skip-info">スキップ残り {MAX_SKIP - skipCount} 回</div>
          <div style={{fontSize:12,color:"#9A9490",lineHeight:1.8,textAlign:"center"}}>うまく話せたら「完了」を押してください</div>
        </div>
        <div className="yo-footer">
          <button className="yo-btn-p" onClick={()=>setScreen("done")}>ミッション完了</button>
          <button className="yo-btn-o" disabled={skipCount>=MAX_SKIP}
            onClick={()=>{if(skipCount<MAX_SKIP){setSkipCount(s=>s+1);setSelectedMission(null);setScreen("mission_reveal");}}}>
            2人で話してスキップ（残り{MAX_SKIP-skipCount}回）
          </button>
        </div>
      </div></div></>
    );
  }

  // 完了 → 楽しんでください
  if (screen === "done") {
    const nextPairStart = ((missionPairIndex+1)*2)%missionPool.length;
    const nextMission = missionPool[nextPairStart];
    return (
      <><style>{css}</style>
      <div className="yo-root"><div className="yo-phone">
        <Bg/>
        <div className="yo-status">● ● ●</div>
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"0 36px",textAlign:"center",position:"relative",zIndex:2}}>
          <div style={{fontSize:36,marginBottom:16}}>☀️</div>
          <div style={{fontFamily:"'DM Serif Display',serif",fontSize:32,color:"#1C1A18",letterSpacing:"-1px",marginBottom:10}}>楽しんでください</div>
          <div style={{fontSize:13,color:"#9A9490",lineHeight:1.9,marginBottom:36}}>ミッションが終わりました<br/>あとは自由に過ごしましょう</div>
          <div style={{width:"100%",background:"#F5F2EE",borderRadius:16,padding:"16px 18px",marginBottom:12,textAlign:"left",cursor:"pointer",border:"1px solid #EAE6E0"}}
            onClick={()=>{setMissionPairIndex(p=>p+1);setSelectedMission(null);setCardsShow(false);setTimeout(()=>setCardsShow(true),100);setScreen("mission_reveal");}}>
            <div style={{fontSize:11,color:"#B8B2AA",marginBottom:6}}>もう1つミッションをやってみますか？</div>
            <div style={{fontSize:13,fontWeight:500,color:"#1C1A18",lineHeight:1.7}}>{nextMission.stars}　{nextMission.text.slice(0,24)}…</div>
          </div>
          <div style={{fontSize:11,color:"#C8C2BC",lineHeight:1.8}}>レビューは後ほど通知でお知らせします</div>
        </div>
        <div className="yo-footer">
          <button className="yo-btn-p" onClick={()=>setScreen("wrap_up")}>そろそろ帰ります</button>
        </div>
      </div></div></>
    );
  }

  // 帰ります → 通知予告
  if (screen === "wrap_up") return (
    <><style>{css}</style>
    <div className="yo-root"><div className="yo-phone">
      <Bg/>
      <div className="yo-status">● ● ●</div>
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"0 40px",textAlign:"center",position:"relative",zIndex:2}}>
        <div style={{fontSize:36,marginBottom:16}}>🍃</div>
        <div style={{fontFamily:"'DM Serif Display',serif",fontSize:26,color:"#1C1A18",marginBottom:10}}>お疲れ様でした</div>
        <div style={{fontSize:13,color:"#9A9490",lineHeight:1.9,marginBottom:28}}>「普通に話せた」だけで<br/>十分な成功です</div>
        <div style={{width:"100%",background:"#F5F2EE",borderRadius:16,padding:"16px 18px"}}>
          <div style={{fontSize:11,color:"#B8B2AA",marginBottom:6}}>📩 30分〜1時間後に通知します</div>
          <div style={{fontSize:13,color:"#6A6460",lineHeight:1.7}}>「さっきの出会い、どうでしたか？」<br/>落ち着いてからレビューしてください</div>
        </div>
      </div>
      <div className="yo-footer">
        <button className="yo-btn-p" onClick={()=>navigate("home")}>ホームへ</button>
      </div>
    </div></div></>
  );

  // キャンセル完了
  if (screen === "cancelled") return (
    <><style>{css}</style>
    <div className="yo-root"><div className="yo-phone">
      <Bg/>
      <div className="yo-status">● ● ●</div>
      <div className="yo-wait-center">
        <div style={{fontSize:32,marginBottom:16}}>🍃</div>
        <div style={{fontFamily:"'DM Serif Display',serif",fontSize:24,color:"#1C1A18",marginBottom:8}}>キャンセルを送りました</div>
        <div style={{fontSize:12,color:"#9A9490",lineHeight:1.8}}>相手に通知が届きました<br/>またの機会に会えるといいですね</div>
      </div>
      <div className="yo-footer">
        <button className="yo-btn-p" onClick={()=>navigate("home")}>ホームへもどる</button>
      </div>
    </div></div></>
  );

  // 会えなかった
  return (
    <><style>{css}</style>
    <div className="yo-root"><div className="yo-phone">
      <Bg/>
      <div className="yo-status">● ● ●</div>
      <div className="yo-wait-center">
        <div style={{fontSize:32,marginBottom:16}}>😞</div>
        <div style={{fontFamily:"'DM Serif Display',serif",fontSize:22,color:"#1C1A18",marginBottom:8,textAlign:"center"}}>うまく会えなかったようです</div>
        <div style={{fontSize:12,color:"#9A9490",lineHeight:1.8,textAlign:"center"}}>相手にも通知します<br/>次は別の出会いを探してみましょう</div>
      </div>
      <div className="yo-footer">
        <button className="yo-btn-p" onClick={()=>navigate("home")}>ホームへもどる</button>
      </div>
    </div></div></>
  );
}
