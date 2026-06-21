import { useState } from "react";
import { getDeviceId, getUserId, setUserId, registerUser } from "../api.js";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  .yo-root { min-height:100vh; background:#F5F2EE; display:flex; align-items:center; justify-content:center; font-family:'DM Sans',sans-serif; }
  .yo-phone { width:360px; height:720px; background:#FDFCFA; border-radius:40px; border:1px solid #EAE6E0; box-shadow:0 40px 100px rgba(0,0,0,0.09); overflow:hidden; position:relative; display:flex; flex-direction:column; }
  .yo-bg { position:absolute; border-radius:50%; pointer-events:none; }
  .yo-status { display:flex; justify-content:flex-end; padding:18px 28px 0; font-size:11px; color:#C0BAB4; letter-spacing:2px; flex-shrink:0; position:relative; z-index:2; }
  .yo-footer { padding:8px 28px 28px; display:flex; flex-direction:column; gap:9px; flex-shrink:0; position:relative; z-index:2; }
  .yo-btn-p { width:100%; height:52px; border-radius:100px; border:none; background:#2C2A28; color:#FDFCFA; font-family:'DM Sans',sans-serif; font-size:15px; font-weight:500; cursor:pointer; transition:background 0.2s,transform 0.15s; }
  .yo-btn-p:hover { background:#3C3A38; }
  .yo-btn-p:active { transform:scale(0.97); }
  .yo-btn-p:disabled { background:#E4DED8; cursor:default; }
  .yo-btn-ghost { width:100%; height:40px; border-radius:100px; border:none; background:transparent; color:#C0BAB4; font-family:'DM Sans',sans-serif; font-size:13px; cursor:pointer; }

  /* 起動画面 */
  .yo-launch-center { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:0 40px; text-align:center; position:relative; z-index:2; }
  .yo-logo { font-family:'DM Serif Display',serif; font-size:80px; color:#1C1A18; letter-spacing:-3px; line-height:1; margin-bottom:6px; }
  .yo-logo-dot { display:inline-block; width:12px; height:12px; background:#C8A97A; border-radius:50%; vertical-align:super; margin-left:3px; }
  .yo-tagline { font-size:14px; color:#9A9490; margin-bottom:52px; line-height:1.9; }

  /* MBTI */
  .yo-mbti-body { flex:1; display:flex; flex-direction:column; padding:20px 28px 0; position:relative; z-index:2; overflow-y:auto; min-height:0; }
  .yo-mbti-body::-webkit-scrollbar { display:none; }
  .yo-page-title { font-family:'DM Serif Display',serif; font-size:26px; color:#1C1A18; letter-spacing:-0.5px; margin-bottom:5px; flex-shrink:0; }
  .yo-page-sub { font-size:12px; color:#9A9490; margin-bottom:20px; line-height:1.7; flex-shrink:0; }
  .yo-step-dots { display:flex; gap:6px; margin-bottom:24px; flex-shrink:0; }
  .yo-step-dot { width:6px; height:6px; border-radius:50%; background:#E4DED8; }
  .yo-step-dot.active { background:#2C2A28; width:20px; border-radius:3px; }
  .yo-axis-row { display:flex; align-items:center; gap:8px; margin-bottom:16px; flex-shrink:0; }
  .yo-axis-end { font-size:11px; color:#B8B2AA; width:16px; flex-shrink:0; }
  .yo-axis-end.right { text-align:right; }
  .yo-range-wrap { flex:1; position:relative; height:32px; display:flex; align-items:center; }
  .yo-track-bg { position:absolute; left:0; right:0; height:4px; background:#EAE6E0; border-radius:2px; }
  .yo-track-fill { position:absolute; left:0; height:4px; background:#2C2A28; border-radius:2px; }
  .yo-thumb { position:absolute; width:22px; height:22px; background:#2C2A28; border-radius:50%; border:3px solid #FDFCFA; box-shadow:0 2px 8px rgba(0,0,0,0.15); transform:translateX(-50%); pointer-events:none; }
  .yo-range-input { position:absolute; left:0; right:0; width:100%; height:32px; opacity:0; cursor:pointer; z-index:2; }
  .yo-axis-pct { font-size:11px; color:#B8B2AA; width:36px; text-align:right; flex-shrink:0; }
  .yo-mbti-label { font-size:12px; color:#6A6460; margin-bottom:4px; }
  .yo-divider { height:1px; background:#F0EDE8; margin:16px 0; flex-shrink:0; }
  .yo-select { width:100%; padding:12px 14px; border-radius:12px; border:1px solid #EAE6E0; background:#FDFCFA; font-family:'DM Sans',sans-serif; font-size:13px; color:#1C1A18; outline:none; margin-bottom:12px; }
  .yo-input { width:100%; padding:12px 14px; border-radius:12px; border:1px solid #EAE6E0; background:#FDFCFA; font-family:'DM Sans',sans-serif; font-size:13px; color:#1C1A18; outline:none; box-sizing:border-box; }
  .yo-input::placeholder { color:#C8C2BC; }

  /* 趣味 */
  .yo-hobbies-body { flex:1; display:flex; flex-direction:column; padding:20px 28px 0; position:relative; z-index:2; overflow-y:auto; min-height:0; }
  .yo-hobbies-body::-webkit-scrollbar { display:none; }
  .yo-legend { display:flex; align-items:center; gap:6px; margin-bottom:10px; flex-shrink:0; }
  .yo-legend-chip { height:22px; padding:0 10px; border-radius:20px; font-size:11px; display:inline-flex; align-items:center; }
  .yo-legend-chip.hobby { background:#2C2A28; color:#FDFCFA; }
  .yo-legend-chip.interest { background:#F0EDE8; color:#7A7470; border:1px dashed #C0BAB4; }
  .yo-legend-text { font-size:11px; color:#9A9490; }
  .yo-legend-sep { font-size:11px; color:#D8D2CC; }
  .yo-legend-tip { font-size:11px; color:#C8C2BC; margin-left:auto; }
  .yo-tags-wrap { display:flex; flex-wrap:wrap; gap:7px; margin-bottom:14px; }
  .yo-tag { height:32px; padding:0 13px; border-radius:100px; font-size:12px; cursor:pointer; border:1px solid transparent; transition:all 0.15s; display:inline-flex; align-items:center; font-family:'DM Sans',sans-serif; }
  .yo-tag.off { border-color:#EAE6E0; color:#C0BAB4; background:transparent; }
  .yo-tag.hobby { background:#2C2A28; color:#FDFCFA; border-color:#2C2A28; }
  .yo-tag.interest { background:#F0EDE8; color:#7A7470; border:1px dashed #C0BAB4; }
  .yo-free-row { display:flex; gap:7px; margin-bottom:8px; }
  .yo-free-in { flex:1; height:34px; border-radius:100px; border:1px solid #EAE6E0; background:#FDFCFA; padding:0 14px; font-size:12px; font-family:'DM Sans',sans-serif; color:#1C1A18; outline:none; }
  .yo-free-in::placeholder { color:#C8C2BC; }
  .yo-free-add { width:34px; height:34px; border-radius:50%; border:none; background:#2C2A28; color:#FDFCFA; font-size:18px; cursor:pointer; display:flex; align-items:center; justify-content:center; }
  .yo-free-add:disabled { background:#E4DED8; cursor:default; }
  .yo-free-chips { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:8px; }
  .yo-free-chip { display:inline-flex; align-items:center; gap:5px; height:26px; padding:0 10px 0 12px; border-radius:100px; background:#F5F2EE; border:1px solid #E4DED8; font-size:11px; color:#6A6460; }
  .yo-del { font-size:12px; color:#C0BAB4; cursor:pointer; }
  .yo-count-bar { display:flex; gap:12px; margin-top:8px; flex-shrink:0; }
  .yo-count-item { font-size:11px; color:#9A9490; display:flex; align-items:center; gap:5px; }
  .yo-count-badge { display:inline-flex; align-items:center; justify-content:center; width:18px; height:18px; border-radius:50%; font-size:11px; font-weight:500; }
  .yo-count-badge.hobby { background:#2C2A28; color:#FDFCFA; }
  .yo-count-badge.interest { background:#E4DED8; color:#6A6460; }
  .yo-toggle-row { display:flex; gap:8px; margin-top:8px; }
  .yo-toggle-btn { flex:1; padding:10px; border-radius:12px; border:1px solid #E4DED8; background:transparent; font-family:'DM Sans',sans-serif; font-size:13px; color:#B8B2AA; cursor:pointer; transition:all 0.2s; }
  .yo-toggle-btn.active { background:#2C2A28; color:#FDFCFA; border-color:#2C2A28; }
  .yo-error { font-size:12px; color:#C0544A; text-align:center; margin-top:8px; }
`;

const allTags = [
  "音楽","カフェ","映画","読書","マンガ","アニメ","ゲーム","写真","スポーツ","料理",
  "芸術鑑賞","イラスト","絵画","ダンス","筋トレ","登山","キャンプ","自転車",
  "水泳","格闘技","スケボー","サーフィン","楽器","手芸・DIY","プログラミング",
  "デザイン","映像制作","ファッション","インスタ","インテリア","植物","ペット",
  "スキンケア","カラオケ","ライブ","フェス","お笑い","YouTube","語学","歴史",
  "天文","将棋・チェス","資格勉強","バイク","鉄道","旅行","お酒","スイーツ",
  "温泉","ドライブ","グルメ","雑貨集め",
];

const axes = [
  { left:"E", right:"I", desc:"外向き / 内向き" },
  { left:"N", right:"S", desc:"直感 / 感覚" },
  { left:"T", right:"F", desc:"論理 / 感情" },
  { left:"J", right:"P", desc:"計画 / 柔軟" },
];

export default function Register({ navigate }) {
  const [step, setStep] = useState("launch");
  const [faculty, setFaculty] = useState("");
  const [grade, setGrade] = useState("1");
  const [mbti, setMbti] = useState([50, 50, 50, 50]);
  const [genderPref, setGenderPref] = useState("same");
  const [relationValue, setRelationValue] = useState(2);
  const [tagState, setTagState] = useState({});
  const [freeInput, setFreeInput] = useState("");
  const [freeTags, setFreeTags] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const toggleTag = (tag) => setTagState(prev => ({ ...prev, [tag]: ((prev[tag] || 0) + 1) % 3 }));
  const addFree = () => { const v = freeInput.trim(); if (!v || freeTags.includes(v)) return; setFreeTags(p => [...p, v]); setFreeInput(""); };
  const hobbyCount = Object.values(tagState).filter(v => v === 1).length;
  const interestCount = Object.values(tagState).filter(v => v === 2).length;

  const handleSubmit = async () => {
    if (!faculty.trim()) { setError("学部を入力してください"); return; }
    setSubmitting(true); setError(null);
    try {
      const tags = [
        ...Object.entries(tagState).filter(([,v])=>v===1).map(([name])=>({name,type:"hobby"})),
        ...Object.entries(tagState).filter(([,v])=>v===2).map(([name])=>({name,type:"interest"})),
        ...freeTags.map(name=>({name,type:"hobby"})),
      ];
      const res = await registerUser({
        device_id: getDeviceId(), faculty, grade: Number(grade),
        mbti_ei: mbti[0], mbti_ns: mbti[1], mbti_tf: mbti[2], mbti_jp: mbti[3],
        gender_pref: genderPref, relation_value: relationValue, tags,
      });
      setUserId(res.id);
      navigate("home");
    } catch(e) { setError("登録に失敗しました。もう一度お試しください"); }
    setSubmitting(false);
  };

  const Bg = () => (
    <>
      <div className="yo-bg" style={{width:280,height:280,background:"#D4C4B0",opacity:0.12,top:-80,right:-80}}/>
      <div className="yo-bg" style={{width:200,height:200,background:"#B8C9B0",opacity:0.09,bottom:80,left:-60}}/>
    </>
  );

  // ── 起動画面 ──
  if (step === "launch") return (
    <><style>{css}</style>
    <div className="yo-root"><div className="yo-phone">
      <Bg/>
      <div className="yo-status">● ● ●</div>
      <div className="yo-launch-center">
        <div className="yo-logo">Yo<span className="yo-logo-dot"/></div>
        <div className="yo-tagline">外れを引かない出会いを用意します<br/>顔見知りから始めましょう</div>
      </div>
      <div className="yo-footer">
        <button className="yo-btn-p" onClick={()=>setStep("mbti")}>はじめる</button>
        {getUserId() && <button className="yo-btn-ghost" onClick={()=>navigate("home")}>すでに登録済みの方はこちら</button>}
      </div>
    </div></div></>
  );

  // ── MBTI入力 ──
  if (step === "mbti") return (
    <><style>{css}</style>
    <div className="yo-root"><div className="yo-phone">
      <Bg/>
      <div className="yo-status">● ● ●</div>
      <div className="yo-mbti-body">
        <div className="yo-step-dots">
          <div className="yo-step-dot active"/>
          <div className="yo-step-dot"/>
          <div className="yo-step-dot"/>
        </div>
        <div className="yo-page-title">自分を教えてください</div>
        <div className="yo-page-sub">スライダーでMBTIを入力してください<br/>わからなければスキップもできます</div>
        <div style={{marginBottom:12}}>
          <input className="yo-input" placeholder="学部（例：工学部）" value={faculty} onChange={e=>setFaculty(e.target.value)} style={{marginBottom:10}}/>
          <select className="yo-select" value={grade} onChange={e=>setGrade(e.target.value)}>
            {["1","2","3","4"].map(g=><option key={g} value={g}>{g}年生</option>)}
          </select>
        </div>
        <div className="yo-divider"/>
        <div className="yo-mbti-label">MBTI（スライダーで調整）</div>
        {axes.map((a,i)=>(
          <div key={a.left} className="yo-axis-row">
            <span className="yo-axis-end">{a.left}</span>
            <div className="yo-range-wrap">
              <div className="yo-track-bg"/>
              <div className="yo-track-fill" style={{width:`${mbti[i]}%`}}/>
              <div className="yo-thumb" style={{left:`${mbti[i]}%`}}/>
              <input type="range" className="yo-range-input" min="0" max="100" value={mbti[i]}
                onChange={e=>setMbti(prev=>prev.map((v,j)=>j===i?Number(e.target.value):v))}/>
            </div>
            <span className="yo-axis-end right">{a.right}</span>
            <span className="yo-axis-pct">{a.left} {100-mbti[i]}%</span>
          </div>
        ))}
        <div className="yo-divider"/>
        <div className="yo-mbti-label">求める関係値（1〜5）</div>
        <input type="range" className="yo-range-input" style={{position:"relative",opacity:1,width:"100%",marginBottom:4,accentColor:"#2C2A28"}} min="1" max="5" value={relationValue} onChange={e=>setRelationValue(Number(e.target.value))}/>
        <div style={{fontSize:11,color:"#9A9490",textAlign:"center"}}>{["","気軽な挨拶","ゆるい知り合い","たまに話す仲","友達","親友候補"][relationValue]}</div>
        <div style={{height:16}}/>
      </div>
      <div className="yo-footer">
        <button className="yo-btn-p" onClick={()=>setStep("hobbies")}>次へ</button>
        <button className="yo-btn-ghost" onClick={()=>{ setMbti([50,50,50,50]); setStep("hobbies"); }}>MBTIをスキップ</button>
      </div>
    </div></div></>
  );

  // ── 趣味・設定 ──
  return (
    <><style>{css}</style>
    <div className="yo-root"><div className="yo-phone">
      <Bg/>
      <div className="yo-status">● ● ●</div>
      <div className="yo-hobbies-body">
        <div className="yo-step-dots">
          <div className="yo-step-dot"/>
          <div className="yo-step-dot active"/>
          <div className="yo-step-dot"/>
        </div>
        <div className="yo-page-title">趣味・興味</div>
        <div className="yo-page-sub">1回タップ=やっている　2回=やってみたい</div>
        <div className="yo-legend">
          <span className="yo-legend-chip hobby">音楽</span>
          <span className="yo-legend-text">やっている</span>
          <span className="yo-legend-sep">|</span>
          <span className="yo-legend-chip interest">音楽</span>
          <span className="yo-legend-text">やってみたい</span>
          <span className="yo-legend-tip">もう1回で解除</span>
        </div>
        <div className="yo-tags-wrap">
          {allTags.map(tag=>{
            const s = tagState[tag] || 0;
            return <button key={tag} className={"yo-tag "+(s===0?"off":s===1?"hobby":"interest")} onClick={()=>toggleTag(tag)}>{tag}</button>;
          })}
        </div>
        <div className="yo-free-row">
          <input className="yo-free-in" placeholder="リストにないものを入力..." value={freeInput} onChange={e=>setFreeInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addFree()}/>
          <button className="yo-free-add" onClick={addFree} disabled={!freeInput.trim()}>+</button>
        </div>
        {freeTags.length>0&&<div className="yo-free-chips">{freeTags.map(t=><span key={t} className="yo-free-chip">{t}<span className="yo-del" onClick={()=>setFreeTags(p=>p.filter(x=>x!==t))}>×</span></span>)}</div>}
        <div className="yo-count-bar">
          <div className="yo-count-item"><span className="yo-count-badge hobby">{hobbyCount}</span>やっている</div>
          <div className="yo-count-item"><span className="yo-count-badge interest">{interestCount}</span>やってみたい</div>
        </div>
        <div className="yo-divider"/>
        <div style={{fontSize:13,color:"#6A6460",marginBottom:8}}>マッチング相手</div>
        <div className="yo-toggle-row">
          <button className={"yo-toggle-btn"+(genderPref==="same"?" active":"")} onClick={()=>setGenderPref("same")}>同性のみ</button>
          <button className={"yo-toggle-btn"+(genderPref==="any"?" active":"")} onClick={()=>setGenderPref("any")}>どちらでも</button>
        </div>
        {error && <div className="yo-error">{error}</div>}
        <div style={{height:16}}/>
      </div>
      <div className="yo-footer">
        <button className="yo-btn-p" disabled={submitting} onClick={handleSubmit}>{submitting?"登録中...":"はじめる"}</button>
        <button className="yo-btn-ghost" onClick={()=>setStep("mbti")}>もどる</button>
      </div>
    </div></div></>
  );
}
