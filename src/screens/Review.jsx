import { useState } from "react";
import { getUserId, postReview } from "../api.js";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  .yo-root { min-height:100vh; background:#F5F2EE; display:flex; align-items:center; justify-content:center; font-family:'DM Sans',sans-serif; }
  .yo-phone { width:360px; height:720px; background:#FDFCFA; border-radius:40px; border:1px solid #EAE6E0; box-shadow:0 40px 100px rgba(0,0,0,0.09),0 8px 24px rgba(0,0,0,0.05); overflow:hidden; position:relative; display:flex; flex-direction:column; }
  .yo-bg { position:absolute; border-radius:50%; pointer-events:none; }
  .yo-status { display:flex; justify-content:flex-end; padding:18px 28px 0; font-size:11px; color:#C0BAB4; letter-spacing:2px; flex-shrink:0; position:relative; z-index:2; }
  .yo-body { flex:1; display:flex; flex-direction:column; padding:20px 28px 0; position:relative; z-index:2; overflow-y:auto; min-height:0; }
  .yo-body::-webkit-scrollbar { display:none; }
  .yo-footer { padding:8px 28px 28px; display:flex; flex-direction:column; gap:9px; flex-shrink:0; position:relative; z-index:2; }
  .yo-btn-p { width:100%; height:52px; border-radius:100px; border:none; background:#2C2A28; color:#FDFCFA; font-family:'DM Sans',sans-serif; font-size:15px; font-weight:500; cursor:pointer; transition:background 0.2s,transform 0.15s; }
  .yo-btn-p:hover { background:#3C3A38; }
  .yo-btn-p:active { transform:scale(0.97); }
  .yo-btn-p:disabled { background:#E4DED8; cursor:default; }
  .yo-btn-ghost { width:100%; height:40px; border-radius:100px; border:none; background:transparent; color:#C0BAB4; font-family:'DM Sans',sans-serif; font-size:13px; cursor:pointer; }
  .yo-notif-screen { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:0 36px; position:relative; z-index:2; }
  .yo-notif-card { width:100%; background:#F5F2EE; border-radius:20px; padding:20px; border:1px solid #EAE6E0; box-shadow:0 4px 20px rgba(0,0,0,0.06); margin-bottom:28px; }
  .yo-notif-app { font-size:11px; color:#B8B2AA; margin-bottom:8px; display:flex; align-items:center; gap:6px; }
  .yo-notif-dot { width:18px; height:18px; border-radius:6px; background:#2C2A28; display:inline-flex; align-items:center; justify-content:center; font-size:10px; color:#FDFCFA; font-weight:500; }
  .yo-notif-title { font-size:14px; font-weight:500; color:#1C1A18; margin-bottom:4px; }
  .yo-notif-body { font-size:12px; color:#6A6460; line-height:1.6; }
  .yo-review-title { font-family:'DM Serif Display',serif; font-size:26px; color:#1C1A18; letter-spacing:-0.5px; margin-bottom:5px; flex-shrink:0; }
  .yo-review-sub { font-size:12px; color:#9A9490; margin-bottom:22px; line-height:1.7; flex-shrink:0; }
  .yo-section { margin-bottom:24px; flex-shrink:0; }
  .yo-section-label { font-size:13px; font-weight:500; color:#1C1A18; margin-bottom:12px; }
  .yo-slider-ends { display:flex; justify-content:space-between; font-size:11px; color:#B8B2AA; margin-bottom:4px; }
  .yo-range { width:100%; accent-color:#2C2A28; }
  .yo-slider-val { text-align:center; font-size:12px; color:#6A6460; margin-top:4px; }
  .yo-divider { height:1px; background:#F0EDE8; margin:4px 0 20px; flex-shrink:0; }
  .yo-adjust-hint { font-size:11px; color:#B8B2AA; margin-bottom:14px; padding:10px 12px; background:#F5F2EE; border-radius:10px; line-height:1.7; }
  .yo-adjust-row { margin-bottom:16px; }
  .yo-adjust-label { font-size:12px; color:#6A6460; margin-bottom:8px; }
  .yo-atmos-grid { display:flex; flex-wrap:wrap; gap:7px; margin-bottom:4px; }
  .yo-atmos-tag { padding:6px 14px; border-radius:100px; border:1px solid #EAE6E0; background:transparent; font-family:'DM Sans',sans-serif; font-size:12px; color:#9A9490; cursor:pointer; transition:all 0.15s; }
  .yo-atmos-tag.selected { background:#2C2A28; color:#FDFCFA; border-color:#2C2A28; }
  .yo-report-btn { width:100%; padding:12px; border-radius:12px; border:1px solid #F0DFDD; background:transparent; font-family:'DM Sans',sans-serif; font-size:12px; color:#C0544A; cursor:pointer; text-align:center; }
  .yo-report-btn:hover { background:#FDF2F0; }
  .yo-done-center { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:0 36px; text-align:center; position:relative; z-index:2; }
  .yo-done-card { width:100%; background:#F5F2EE; border-radius:16px; padding:16px 18px; margin-bottom:24px; text-align:left; }
  .yo-done-row { display:flex; gap:10px; margin-bottom:10px; }
  .yo-done-row:last-child { margin-bottom:0; }
  .yo-done-key { font-size:11px; color:#B8B2AA; min-width:52px; }
  .yo-done-val { font-size:12px; color:#6A6460; line-height:1.7; }
  .yo-modal-overlay { position:absolute; inset:0; background:rgba(28,26,24,0.5); display:flex; align-items:flex-end; z-index:10; border-radius:40px; }
  .yo-modal { background:#FDFCFA; border-radius:24px 24px 0 0; padding:28px 28px 36px; width:100%; }
  .yo-modal-title { font-family:'DM Serif Display',serif; font-size:22px; color:#1C1A18; margin-bottom:6px; }
  .yo-modal-sub { font-size:12px; color:#9A9490; margin-bottom:20px; line-height:1.7; }
  .yo-report-cats { display:flex; flex-direction:column; gap:8px; margin-bottom:16px; }
  .yo-report-cat { padding:13px 16px; border-radius:12px; border:1px solid #EAE6E0; background:transparent; font-family:'DM Sans',sans-serif; font-size:13px; color:#6A6460; cursor:pointer; text-align:left; transition:all 0.15s; }
  .yo-report-cat.selected { border-color:#2C2A28; background:#2C2A28; color:#FDFCFA; }
  .yo-report-note { width:100%; border-radius:10px; border:1px solid #EAE6E0; background:#F5F2EE; padding:12px 14px; font-size:12px; font-family:'DM Sans',sans-serif; color:#1C1A18; outline:none; resize:none; box-sizing:border-box; margin-bottom:14px; line-height:1.6; }
  .yo-report-note::placeholder { color:#C8C2BC; }
  .yo-report-sent { text-align:center; padding:16px 0 4px; }
  .yo-report-sent-icon { font-size:28px; margin-bottom:8px; }
  .yo-report-sent-text { font-size:13px; color:#6A6460; line-height:1.8; }
`;

const talkLabels = ["話しにくかった","少し話せた","まあ話せた","話せた","すごく話せた"];
const missionLabels = ["難しかった","少し難しい","ちょうどよかった","簡単だった","物足りなかった"];
const atmosTags = [
  "穏やかだった","テンポが合った","自然に話せた","話題が広がった",
  "笑いがあった","リラックスできた","あっという間だった","ちょうど良かった",
  "少し緊張した","静かめだった","マイペースだった","おもしろかった",
  "似た感じがした","共通点を感じた","意外と話せた","不思議と話しやすかった",
  "ゆっくりしたペース","にぎやかだった","お互い緊張してた","話が途切れた",
  "少し噛み合わなかった","思ったより長話した",
];

export default function Review({ navigate }) {
  const [screen, setScreen] = useState("notif");
  const [showReport, setShowReport] = useState(false);
  const [reportCategory, setReportCategory] = useState(null);
  const [reportNote, setReportNote] = useState("");
  const [reportSent, setReportSent] = useState(false);
  const [talkScore, setTalkScore] = useState(3);
  const [missionScore, setMissionScore] = useState(3);
  const [selectedAtmos, setSelectedAtmos] = useState(new Set());
  const [eiAdjust, setEiAdjust] = useState(3);
  const [hobbyAdjust, setHobbyAdjust] = useState(3);
  const [submitting, setSubmitting] = useState(false);

  const toggleAtmos = (tag) => setSelectedAtmos(prev => {
    const n = new Set(prev); n.has(tag) ? n.delete(tag) : n.add(tag); return n;
  });

  const handleSubmit = async () => {
    const userId = getUserId();
    const matchId = localStorage.getItem("yo_match_id");
    if (!userId || !matchId) { setScreen("done"); return; }
    setSubmitting(true);
    try {
      await postReview({ user_id: userId, match_id: matchId, talk_score: talkScore,
        mission_score: missionScore, ei_adjust: eiAdjust, hobby_adjust: hobbyAdjust,
        atmos_tags: [...selectedAtmos] });
    } catch(e) { console.error(e); }
    setScreen("done");
    setSubmitting(false);
  };

  const Bg = () => (
    <>
      <div className="yo-bg" style={{width:240,height:240,background:"#D4C4B0",opacity:0.10,top:-60,right:-60}}/>
      <div className="yo-bg" style={{width:160,height:160,background:"#B8C9B0",opacity:0.08,bottom:60,left:-40}}/>
    </>
  );

  if (screen === "notif") return (
    <><style>{css}</style>
    <div className="yo-root"><div className="yo-phone">
      <Bg/>
      <div className="yo-status">● ● ●</div>
      <div className="yo-notif-screen">
        <div style={{fontFamily:"'DM Serif Display',serif",fontSize:22,color:"#1C1A18",marginBottom:28,textAlign:"center"}}>
          さっきの出会い、<br/>どうでしたか？
        </div>
        <div className="yo-notif-card">
          <div className="yo-notif-app">
            <span className="yo-notif-dot">Yo</span>
            <span>Yo · 30分前</span>
          </div>
          <div className="yo-notif-title">レビューをお願いします</div>
          <div className="yo-notif-body">感想を教えてください。次のマッチングに活かします。</div>
        </div>
        <div style={{fontSize:11,color:"#C8C2BC",textAlign:"center",lineHeight:1.8}}>答えるのは任意です<br/>1〜2分で終わります</div>
      </div>
      <div className="yo-footer">
        <button className="yo-btn-p" onClick={()=>setScreen("review")}>レビューを書く</button>
        <button className="yo-btn-ghost" onClick={()=>setScreen("done")}>今はいい</button>
      </div>
    </div></div></>
  );

  if (screen === "review") return (
    <><style>{css}</style>
    <div className="yo-root"><div className="yo-phone">
      <Bg/>
      {showReport && (
        <div className="yo-modal-overlay" onClick={()=>{if(!reportSent)setShowReport(false);}}>
          <div className="yo-modal" onClick={e=>e.stopPropagation()}>
            {reportSent ? (
              <div className="yo-report-sent">
                <div className="yo-report-sent-icon">✓</div>
                <div className="yo-modal-title" style={{textAlign:"center"}}>報告を受け付けました</div>
                <div className="yo-report-sent-text">内容を確認します。<br/>複数の報告が集まった場合に<br/>ブラックリストに掲載されます。</div>
                <div style={{height:20}}/>
                <button className="yo-btn-p" onClick={()=>{setShowReport(false);setReportSent(false);setReportCategory(null);setReportNote("");}}>閉じる</button>
              </div>
            ) : (
              <>
                <div className="yo-modal-title">問題を報告する</div>
                <div className="yo-modal-sub">報告できるのは実際に会った相手のみです。複数報告が集まった場合にブラックリストへ掲載されます。</div>
                <div className="yo-report-cats">
                  {["ドタキャン","ヤリモク","暴言・不快な言動","その他"].map(cat=>(
                    <button key={cat} className={"yo-report-cat"+(reportCategory===cat?" selected":"")} onClick={()=>setReportCategory(cat)}>{cat}</button>
                  ))}
                </div>
                <textarea className="yo-report-note" rows={3} placeholder="具体的な状況を教えてください（任意）" value={reportNote} onChange={e=>setReportNote(e.target.value)}/>
                <button className="yo-btn-p" disabled={!reportCategory} style={{marginBottom:10,background:reportCategory?"#C0544A":undefined}} onClick={()=>setReportSent(true)}>報告する</button>
                <button className="yo-btn-ghost" onClick={()=>setShowReport(false)}>キャンセル</button>
              </>
            )}
          </div>
        </div>
      )}
      <div className="yo-status">● ● ●</div>
      <div className="yo-body">
        <div className="yo-review-title">レビュー</div>
        <div className="yo-review-sub">正直な感想でOKです</div>
        <div className="yo-section">
          <div className="yo-section-label">話せましたか？</div>
          <div className="yo-slider-ends"><span>話しにくかった</span><span>よく話せた</span></div>
          <input type="range" className="yo-range" min="1" max="5" value={talkScore} onChange={e=>setTalkScore(Number(e.target.value))}/>
          <div className="yo-slider-val">{talkLabels[talkScore-1]}</div>
        </div>
        <div className="yo-section">
          <div className="yo-section-label">ミッションの難しさは？</div>
          <div className="yo-slider-ends"><span>難しかった</span><span>物足りなかった</span></div>
          <input type="range" className="yo-range" min="1" max="5" value={missionScore} onChange={e=>setMissionScore(Number(e.target.value))}/>
          <div className="yo-slider-val">{missionLabels[missionScore-1]}</div>
        </div>
        <div className="yo-section">
          <div className="yo-section-label">どんな雰囲気でしたか？<span style={{fontWeight:400,color:"#B8B2AA",fontSize:11,marginLeft:6}}>(複数OK)</span></div>
          <div className="yo-atmos-grid">
            {atmosTags.map(tag=>(
              <button key={tag} className={"yo-atmos-tag"+(selectedAtmos.has(tag)?" selected":"")} onClick={()=>toggleAtmos(tag)}>{tag}</button>
            ))}
          </div>
        </div>
        <div className="yo-divider"/>
        <div className="yo-section">
          <div className="yo-section-label">設定を見直しますか？</div>
          <div className="yo-adjust-hint">実際に会った感覚をもとに、次のマッチングを調整できます。変えたくなければそのままでOKです。</div>
          <div className="yo-adjust-row">
            <div className="yo-adjust-label">会話のテンポについて</div>
            <div className="yo-slider-ends"><span>静かな人が好き</span><span>よく話す人が好き</span></div>
            <input type="range" className="yo-range" min="1" max="5" value={eiAdjust} onChange={e=>setEiAdjust(Number(e.target.value))}/>
            <div className="yo-slider-val" style={{fontSize:11,color:"#9A9490"}}>{eiAdjust===3?"変えない":eiAdjust<3?"静かな人の方が良かった":"よく話す人の方が良かった"}</div>
          </div>
          <div className="yo-adjust-row">
            <div className="yo-adjust-label">趣味の共通点について</div>
            <div className="yo-slider-ends"><span>違っていてもいい</span><span>共通点が大事</span></div>
            <input type="range" className="yo-range" min="1" max="5" value={hobbyAdjust} onChange={e=>setHobbyAdjust(Number(e.target.value))}/>
            <div className="yo-slider-val" style={{fontSize:11,color:"#9A9490"}}>{hobbyAdjust===3?"変えない":hobbyAdjust<3?"違う趣味でも楽しかった":"共通趣味は盛り上がった"}</div>
          </div>
        </div>
        <div className="yo-divider"/>
        <div className="yo-section">
          <button className="yo-report-btn" onClick={()=>setShowReport(true)}>問題がありましたか？ 報告する</button>
        </div>
        <div style={{height:8}}/>
      </div>
      <div className="yo-footer">
        <button className="yo-btn-p" disabled={submitting} onClick={handleSubmit}>{submitting?"送信中...":"送信する"}</button>
        <button className="yo-btn-ghost" onClick={()=>setScreen("done")}>スキップ</button>
      </div>
    </div></div></>
  );

  return (
    <><style>{css}</style>
    <div className="yo-root"><div className="yo-phone">
      <Bg/>
      <div className="yo-status">● ● ●</div>
      <div className="yo-done-center">
        <div style={{fontSize:36,marginBottom:16}}>✨</div>
        <div style={{fontFamily:"'DM Serif Display',serif",fontSize:26,color:"#1C1A18",marginBottom:8}}>ありがとうございました</div>
        <div style={{fontSize:12,color:"#9A9490",lineHeight:1.9,marginBottom:28}}>感想をもとに次のマッチングを調整します<br/>「普通に話せた」が積み重なっていきます</div>
        <div className="yo-done-card">
          <div className="yo-done-row"><span className="yo-done-key">会話</span><span className="yo-done-val">{talkLabels[talkScore-1]}</span></div>
          <div className="yo-done-row"><span className="yo-done-key">ミッション</span><span className="yo-done-val">{missionLabels[missionScore-1]}</span></div>
          {selectedAtmos.size>0&&<div className="yo-done-row"><span className="yo-done-key">雰囲気</span><span className="yo-done-val">{[...selectedAtmos].join("・")}</span></div>}
        </div>
        <button className="yo-btn-p" style={{width:"100%"}} onClick={()=>navigate("home")}>ホームへ</button>
      </div>
    </div></div></>
  );
}
