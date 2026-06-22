import { useState, useEffect } from "react";
import { getUserId, getUser, findMatch, getMatchingUser, getNotifications } from "../api.js";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  .yo-root { min-height:100vh; background:#F5F2EE; display:flex; align-items:center; justify-content:center; font-family:"DM Sans",sans-serif; }
  .yo-phone { width:360px; height:720px; background:#FDFCFA; border-radius:40px; border:1px solid #EAE6E0; box-shadow:0 40px 100px rgba(0,0,0,0.09); overflow:hidden; position:relative; display:flex; flex-direction:column; }
  .yo-bg { position:absolute; border-radius:50%; pointer-events:none; }
  .yo-status { display:flex; justify-content:flex-end; padding:18px 28px 0; font-size:11px; color:#C0BAB4; letter-spacing:2px; flex-shrink:0; position:relative; z-index:2; }
  .yo-nav { display:flex; border-top:1px solid #EAE6E0; background:#FDFCFA; flex-shrink:0; position:relative; z-index:3; padding-bottom:4px; }
  .yo-nav-item { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:10px 4px 6px; cursor:pointer; gap:4px; border:none; background:transparent; }
  .yo-nav-icon { font-size:20px; line-height:1; }
  .yo-nav-label { font-size:10px; color:#B8B2AA; font-family:"DM Sans",sans-serif; }
  .yo-nav-item.active .yo-nav-label { color:#1C1A18; font-weight:500; }
  .yo-page { flex:1; display:flex; flex-direction:column; overflow-y:auto; min-height:0; position:relative; z-index:2; }
  .yo-page::-webkit-scrollbar { display:none; }
  .yo-home-inner { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:0 40px; text-align:center; }
  .yo-home-logo { font-family:"DM Serif Display",serif; font-size:64px; color:#1C1A18; letter-spacing:-2px; line-height:1; margin-bottom:8px; }
  .yo-home-dot { display:inline-block; width:9px; height:9px; background:#C8A97A; border-radius:50%; vertical-align:super; margin-left:2px; }
  .yo-home-tagline { font-size:13px; color:#9A9490; margin-bottom:52px; line-height:1.8; }
  .yo-match-btn { width:100%; height:60px; border-radius:100px; border:none; background:#2C2A28; color:#FDFCFA; font-family:"DM Serif Display",serif; font-size:20px; cursor:pointer; transition:background 0.2s,transform 0.15s; margin-bottom:14px; }
  .yo-match-btn:hover { background:#3C3A38; }
  .yo-match-btn:active { transform:scale(0.97); }
  .yo-match-note { font-size:11px; color:#C0BAB4; }
  .yo-searching-wrap { display:flex; flex-direction:column; align-items:center; gap:6px; margin-bottom:14px; }
  .yo-searching-dots { display:flex; gap:6px; }
  .yo-s-dot { width:7px; height:7px; border-radius:50%; background:#C8A97A; animation:pulse 1.4s ease-in-out infinite; }
  .yo-s-dot:nth-child(2) { animation-delay:0.2s; }
  .yo-s-dot:nth-child(3) { animation-delay:0.4s; }
  @keyframes pulse { 0%,80%,100%{opacity:0.3;transform:scale(0.9);}40%{opacity:1;transform:scale(1.1);} }
  .yo-searching-label { font-size:13px; color:#6A6460; }
  .yo-match-page { padding:20px 28px 0; }
  .yo-match-page-title { font-family:"DM Serif Display",serif; font-size:26px; color:#1C1A18; margin-bottom:18px; }
  .yo-status-card { border-radius:18px; border:1px solid #EAE6E0; padding:20px; margin-bottom:12px; }
  .yo-status-card.active { border-color:#2C2A28; background:#2C2A28; }
  .yo-status-card.pending { background:#FBF7F0; border-color:#E8D8C0; }
  .yo-status-card.idle { background:#F5F2EE; }
  .yo-status-badge { display:inline-block; font-size:10px; font-weight:500; padding:3px 9px; border-radius:20px; margin-bottom:10px; }
  .yo-status-badge.active { background:rgba(255,255,255,0.15); color:#E8E4E0; }
  .yo-status-badge.pending { background:#F0E4CC; color:#8A6030; }
  .yo-status-badge.idle { background:#E8E4E0; color:#8A8480; }
  .yo-status-card-title { font-size:15px; font-weight:500; color:#1C1A18; margin-bottom:6px; }
  .yo-status-card.active .yo-status-card-title { color:#FDFCFA; }
  .yo-status-card-sub { font-size:12px; color:#9A9490; line-height:1.7; }
  .yo-status-card.active .yo-status-card-sub { color:#C8C2BC; }
  .yo-meeting-detail { margin-top:14px; padding-top:14px; border-top:1px solid rgba(255,255,255,0.12); }
  .yo-meeting-row { display:flex; gap:10px; margin-bottom:8px; }
  .yo-meeting-key { font-size:11px; color:#C8C2BC; min-width:40px; padding-top:1px; }
  .yo-meeting-val { font-size:13px; font-weight:500; color:#FDFCFA; }
  .yo-prof-page { padding:20px 28px 0; }
  .yo-prof-header { display:flex; align-items:center; gap:14px; margin-bottom:24px; }
  .yo-prof-avatar { width:56px; height:56px; border-radius:50%; background:#2C2A28; display:flex; align-items:center; justify-content:center; font-family:"DM Serif Display",serif; font-size:22px; color:#FDFCFA; }
  .yo-prof-name { font-family:"DM Serif Display",serif; font-size:22px; color:#1C1A18; }
  .yo-prof-dept { font-size:12px; color:#9A9490; margin-top:2px; }
  .yo-prof-section { margin-bottom:20px; }
  .yo-prof-section-label { font-size:11px; font-weight:500; color:#B8B2AA; margin-bottom:10px; letter-spacing:0.05em; }
  .yo-setting-row { display:flex; align-items:center; justify-content:space-between; padding:10px 0; border-bottom:1px solid #F0EDE8; }
  .yo-setting-key { font-size:13px; color:#6A6460; }
  .yo-edit-btn { font-size:12px; color:#9A9490; background:transparent; border:1px solid #E4DED8; border-radius:20px; padding:4px 12px; cursor:pointer; }
  .yo-error { font-size:12px; color:#C0544A; text-align:center; margin-top:8px; }
`;

export default function Home({ navigate, resumeFlow }) {
  const [tab, setTab] = useState("home");
  const [matchState, setMatchState] = useState("idle");
  const [matchData, setMatchData] = useState(null);
  const [error, setError] = useState(null);
  const userId = getUserId();

  const handleFindMatch = async () => {
    if (!userId) { navigate("register"); return; }
    setMatchState("searching");
    setError(null);
    try {
      // 方針A: 自分が関わる pending マッチが既にあれば「合流」する。
      // （相手が先に findMatch して作ったマッチに乗る＝同じ match_id を共有して新規作成しない）
      let match = null;
      let partnerId = null;
      let isRematch = false;

      try {
        const myMatches = await getMatchingUser(userId);
        const incoming = (myMatches || []).find(
          (m) => m.status === "pending" && (m.user_a_id === userId || m.user_b_id === userId)
        );
        if (incoming) {
          match = incoming;
          partnerId = incoming.user_a_id === userId ? incoming.user_b_id : incoming.user_a_id;
        }
      } catch (e) {
        /* 取得失敗時は新規作成にフォールバック */
      }

      // 合流できる相手がいなければ、従来どおり新規にマッチを探す
      if (!match) {
        const result = await findMatch(userId);
        if (result.match && result.candidates && result.candidates.length > 0) {
          match = result.match;
          partnerId = result.candidates[0].user_id;
          isRematch = !!result.rematch;
        }
      }

      if (match && partnerId) {
        localStorage.setItem("yo_match_id", match.id);

        // 相手のプロフィール（学部・学年・共通点）を取得
        let otherUser = {};
        let common = [];
        try {
          const [me, partner] = await Promise.all([getUser(userId), getUser(partnerId)]);
          otherUser = { faculty: partner.faculty, grade: partner.grade };
          const myTagNames = new Set((me.tags || []).map((t) => t.name));
          common = (partner.tags || []).filter((t) => myTagNames.has(t.name)).map((t) => t.name);
        } catch (e) {
          /* プロフィール取得失敗は致命的でないので無視 */
        }

        setMatchData({ ...match, rematch: isRematch, other_user: otherUser, common });
        setMatchState("matched");
      } else {
        setTimeout(handleFindMatch, 10000);
      }
    } catch (e) {
      setError("しばらくしてから試してください");
      setMatchState("idle");
    }
  };

  const navItems = [
    { id:"home", icon:"🏠", label:"ホーム" },
    { id:"matching", icon:"📅", label:"マッチング", badge: matchState==="matched" },
    { id:"profile", icon:"👤", label:"プロフィール" },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="yo-root"><div className="yo-phone">
        <div className="yo-bg" style={{width:280,height:280,background:"#D4C4B0",opacity:0.12,top:-80,right:-80,borderRadius:"50%",position:"absolute",pointerEvents:"none"}}/>
        <div className="yo-bg" style={{width:200,height:200,background:"#B8C9B0",opacity:0.09,bottom:80,left:-60,borderRadius:"50%",position:"absolute",pointerEvents:"none"}}/>
        <div className="yo-status">● ● ●</div>

        {/* ホームタブ */}
        {tab === "home" && (
          <div className="yo-page">
            <div className="yo-home-inner">
              <div className="yo-home-logo">Yo<span className="yo-home-dot"/></div>
              <div className="yo-home-tagline">気負いせず、<br/>顔見知りを増やそう</div>
              {matchState === "searching" ? (
                <>
                  <div className="yo-searching-wrap">
                    <div className="yo-searching-dots">
                      <div className="yo-s-dot"/><div className="yo-s-dot"/><div className="yo-s-dot"/>
                    </div>
                    <div className="yo-searching-label">マッチング相手を探しています</div>
                  </div>
                  <button className="yo-match-btn" style={{background:"#6A6460",cursor:"default"}} disabled>探し中...</button>
                  <div className="yo-match-note" style={{cursor:"pointer",color:"#C0544A"}} onClick={()=>setMatchState("idle")}>探すのをやめる</div>
                </>
              ) : matchState === "matched" ? (
                <>
                  <div style={{width:"100%",background:"#F5F2EE",borderRadius:16,padding:"16px 18px",marginBottom:20,textAlign:"left"}}>
                    <div style={{fontSize:11,color:"#C8A97A",marginBottom:6,fontWeight:500}}>📅 マッチング成立</div>
                    <div style={{fontSize:13,fontWeight:500,color:"#1C1A18"}}>{matchData?.other_user?.faculty} · {matchData?.other_user?.grade}年生</div>
                  </div>
                  <button className="yo-match-btn" onClick={()=>navigate("meeting")}>待ち合わせを決める</button>
                  <div className="yo-match-note" style={{cursor:"pointer"}} onClick={()=>setMatchState("idle")}>もどる</div>
                </>
              ) : (
                <>
                  <button className="yo-match-btn" onClick={handleFindMatch}>マッチングを探す</button>
                  <div className="yo-match-note">同じ大学の顔見知りと出会えます</div>
                  {localStorage.getItem("yo_match_id") && (
                    <div className="yo-match-note" style={{cursor:"pointer",marginTop:12,textDecoration:"underline"}} onClick={()=>(resumeFlow ? resumeFlow() : navigate("meeting"))}>
                      進行中の待ち合わせに戻る
                    </div>
                  )}
                  {error && <div className="yo-error">{error}</div>}
                </>
              )}
            </div>
          </div>
        )}

        {/* マッチングタブ */}
        {tab === "matching" && (
          <div className="yo-page">
            <div className="yo-match-page">
              <div className="yo-match-page-title">マッチング状況</div>
              {matchState === "matched" ? (
                <div className="yo-status-card active">
                  <div className="yo-status-badge active">✓ マッチング成立</div>
                  <div className="yo-status-card-title">{matchData?.other_user?.faculty} · {matchData?.other_user?.grade}年生</div>
                  <div className="yo-status-card-sub">{matchData?.common?.length ? `共通点: ${matchData.common.join("、")}` : "共通点あり"}</div>
                </div>
              ) : matchState === "searching" ? (
                <div className="yo-status-card pending">
                  <div className="yo-status-badge pending">🔍 探し中</div>
                  <div className="yo-status-card-title" style={{color:"#1C1A18"}}>マッチング相手を探しています</div>
                </div>
              ) : (
                <div className="yo-status-card idle">
                  <div className="yo-status-badge idle">− マッチングなし</div>
                  <div className="yo-status-card-title" style={{color:"#1C1A18"}}>現在マッチングしていません</div>
                  <div className="yo-status-card-sub" style={{color:"#9A9490"}}>ホームからマッチングを探してみましょう</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* プロフィールタブ */}
        {tab === "profile" && (
          <div className="yo-page">
            <div className="yo-prof-page">
              <div className="yo-prof-header">
                <div className="yo-prof-avatar">あ</div>
                <div>
                  <div className="yo-prof-name">あなた</div>
                  <div className="yo-prof-dept">登録済みユーザー</div>
                </div>
              </div>
              <div className="yo-prof-section">
                <div className="yo-prof-section-label">設定</div>
                <div className="yo-setting-row">
                  <span className="yo-setting-key">MBTI・趣味</span>
                  <button className="yo-edit-btn" onClick={()=>navigate("register")}>編集する</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ボトムナビ */}
        <nav className="yo-nav">
          {navItems.map(item=>(
            <button key={item.id} className={"yo-nav-item"+(tab===item.id?" active":"")} onClick={()=>setTab(item.id)}>
              <span className="yo-nav-icon">{item.icon}</span>
              <span className="yo-nav-label">{item.label}</span>
            </button>
          ))}
        </nav>
      </div></div>
    </>
  );
}
