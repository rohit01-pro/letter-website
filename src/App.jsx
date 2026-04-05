import { useState, useEffect } from "react";

/* ─── Global CSS & Keyframes ─── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Nunito:wght@400;600;700;800;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { height: 100%; overflow-x: hidden; }

  @keyframes floatPet {
    0%,100% { transform: translateY(0) rotate(-4deg) scale(1); }
    50%      { transform: translateY(-14px) rotate(4deg) scale(1.04); }
  }
  @keyframes pulseHint {
    0%,100% { opacity:1; transform:scale(1) translateY(0); }
    50%      { opacity:0.6; transform:scale(0.97) translateY(3px); }
  }
  @keyframes twinkle {
    0%,100% { opacity:0.15; transform:scale(0.7) rotate(0deg); }
    50%      { opacity:0.9;  transform:scale(1.3) rotate(25deg); }
  }
  @keyframes heartRise {
    0%   { opacity:1; transform:translateY(0) scale(1); }
    100% { opacity:0; transform:translateY(-70px) scale(0.4); }
  }
  @keyframes envelopeJiggle {
    0%,100%{ transform:rotate(0deg) scale(1); }
    20%    { transform:rotate(-5deg) scale(1.02); }
    40%    { transform:rotate(5deg) scale(1.02); }
    60%    { transform:rotate(-3deg); }
    80%    { transform:rotate(3deg); }
  }
  @keyframes bounceIn {
    0%   { transform:scale(0); opacity:0; }
    60%  { transform:scale(1.08); opacity:1; }
    100% { transform:scale(1); }
  }
  @keyframes shimmer {
    0%   { background-position:-200% center; }
    100% { background-position:200% center; }
  }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes petEnter { from{opacity:0;transform:translateY(30px) scale(0.7)} to{opacity:1;transform:translateY(0) scale(1)} }
`;

/* ─── Themes ─── */
const THEMES = {
  pink: {
    name:"🌸 Pink Rose", emoji:"🌸",
    bg:["#FFF0F5","#FFD6E6","#FFF5F9"],
    envBody:"#FFDDE8", envFlap:"#FFB3CA", envFlapDark:"#FF80A8", envInner:"#FFECF2",
    letterBg:"#FFFBFD",
    accent:"#FF4D8F", accentMid:"#FF80B3", accentLight:"#FFB3CF",
    textColor:"#C01060", lineColor:"#FFD6E6",
    particles:["💕","🌸","✨","💖","🌷"],
  },
  lavender: {
    name:"💜 Lavender", emoji:"💜",
    bg:["#F0EAFF","#DDD0F8","#F5F0FF"],
    envBody:"#E0D0FF", envFlap:"#B090F0", envFlapDark:"#9070D8", envInner:"#EEE5FF",
    letterBg:"#FDFBFF",
    accent:"#7C4DFF", accentMid:"#A87CFF", accentLight:"#C8AEFF",
    textColor:"#5C27C0", lineColor:"#E0D0FF",
    particles:["💜","🔮","✨","🌟","🫐"],
  },
  mint: {
    name:"🌿 Mint", emoji:"🌿",
    bg:["#E4FFF5","#C0F0E0","#EAFFF8"],
    envBody:"#C0EED8", envFlap:"#70D4AC", envFlapDark:"#50C098", envInner:"#DAFFF0",
    letterBg:"#F7FFFC",
    accent:"#20B888", accentMid:"#60D4B0", accentLight:"#A0EED4",
    textColor:"#10826A", lineColor:"#C0EEE0",
    particles:["💚","🌿","✨","🍃","🌱"],
  },
  peach: {
    name:"🍑 Peach", emoji:"🍑",
    bg:["#FFF0E8","#FFD8C0","#FFF8F2"],
    envBody:"#FFD0B0", envFlap:"#FFAA78", envFlapDark:"#FF8050", envInner:"#FFEADE",
    letterBg:"#FFFAF7",
    accent:"#FF6A2A", accentMid:"#FFA070", accentLight:"#FFC4A0",
    textColor:"#C04010", lineColor:"#FFD8C0",
    particles:["🍑","🧡","✨","🌻","🌼"],
  },
};

/* ─── Encode / Decode ─── */
const encode = d => { try { return btoa(unescape(encodeURIComponent(JSON.stringify(d)))); } catch { return ""; } };
const decode = s => { try { return JSON.parse(decodeURIComponent(escape(atob(s)))); } catch { return null; } };

/* ─── Pet SVGs ─── */
const Cat = ({ size = 120 }) => (
  <svg width={size} height={size} viewBox="0 0 120 120">
    <polygon points="22,50 8,10 42,36" fill="#FFB3BA"/>
    <polygon points="27,48 16,20 40,35" fill="#FF8FAB"/>
    <polygon points="98,50 112,10 78,36" fill="#FFB3BA"/>
    <polygon points="93,48 104,20 80,35" fill="#FF8FAB"/>
    <circle cx="60" cy="70" r="50" fill="#FFB3BA"/>
    <ellipse cx="43" cy="61" rx="12" ry="14" fill="#222"/>
    <ellipse cx="77" cy="61" rx="12" ry="14" fill="#222"/>
    <circle cx="47" cy="56" r="5" fill="white"/>
    <circle cx="81" cy="56" r="5" fill="white"/>
    <circle cx="49" cy="59" r="2" fill="white" opacity="0.7"/>
    <circle cx="83" cy="59" r="2" fill="white" opacity="0.7"/>
    <polygon points="60,74 55,68 65,68" fill="#FF6B9D"/>
    <path d="M54,75 Q60,82 66,75" stroke="#FF6B9D" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <line x1="63" y1="72" x2="97" y2="64" stroke="#bbb" strokeWidth="1.7" strokeLinecap="round"/>
    <line x1="63" y1="74" x2="99" y2="74" stroke="#bbb" strokeWidth="1.7" strokeLinecap="round"/>
    <line x1="63" y1="72" x2="96" y2="82" stroke="#bbb" strokeWidth="1.7" strokeLinecap="round"/>
    <line x1="57" y1="72" x2="23" y2="64" stroke="#bbb" strokeWidth="1.7" strokeLinecap="round"/>
    <line x1="57" y1="74" x2="21" y2="74" stroke="#bbb" strokeWidth="1.7" strokeLinecap="round"/>
    <line x1="57" y1="72" x2="24" y2="82" stroke="#bbb" strokeWidth="1.7" strokeLinecap="round"/>
    <circle cx="34" cy="81" r="10" fill="#FF9BAA" opacity="0.45"/>
    <circle cx="86" cy="81" r="10" fill="#FF9BAA" opacity="0.45"/>
  </svg>
);

const Dog = ({ size = 120 }) => (
  <svg width={size} height={size} viewBox="0 0 120 120">
    <ellipse cx="20" cy="62" rx="19" ry="30" fill="#D4A070" transform="rotate(-12 20 62)"/>
    <ellipse cx="20" cy="62" rx="12" ry="23" fill="#C09060" transform="rotate(-12 20 62)"/>
    <ellipse cx="100" cy="62" rx="19" ry="30" fill="#D4A070" transform="rotate(12 100 62)"/>
    <ellipse cx="100" cy="62" rx="12" ry="23" fill="#C09060" transform="rotate(12 100 62)"/>
    <circle cx="60" cy="67" r="48" fill="#FFDAB9"/>
    <ellipse cx="60" cy="82" rx="22" ry="16" fill="#F5C8A0"/>
    <circle cx="44" cy="57" r="12" fill="#222"/>
    <circle cx="76" cy="57" r="12" fill="#222"/>
    <circle cx="48" cy="52" r="4.5" fill="white"/>
    <circle cx="80" cy="52" r="4.5" fill="white"/>
    <circle cx="50" cy="55" r="2" fill="white" opacity="0.7"/>
    <circle cx="82" cy="55" r="2" fill="white" opacity="0.7"/>
    <ellipse cx="60" cy="76" rx="10" ry="7.5" fill="#222"/>
    <ellipse cx="57" cy="73" rx="4" ry="2.5" fill="#444" opacity="0.45"/>
    <ellipse cx="60" cy="95" rx="9" ry="9" fill="#FF8FAB"/>
    <path d="M51,95 Q60,103 69,95" fill="#FF8FAB" stroke="#FF6B8A" strokeWidth="1.5"/>
    <line x1="60" y1="88" x2="60" y2="103" stroke="#FF6B8A" strokeWidth="2"/>
    <circle cx="33" cy="81" r="10" fill="#FFB3BA" opacity="0.5"/>
    <circle cx="87" cy="81" r="10" fill="#FFB3BA" opacity="0.5"/>
  </svg>
);

const Bunny = ({ size = 120 }) => (
  <svg width={size} height={size} viewBox="0 0 120 120">
    <ellipse cx="38" cy="28" rx="13" ry="34" fill="#E8D5F5" transform="rotate(-10 38 28)"/>
    <ellipse cx="38" cy="28" rx="7.5" ry="26" fill="#FFB3D9" transform="rotate(-10 38 28)"/>
    <ellipse cx="82" cy="28" rx="13" ry="34" fill="#E8D5F5" transform="rotate(10 82 28)"/>
    <ellipse cx="82" cy="28" rx="7.5" ry="26" fill="#FFB3D9" transform="rotate(10 82 28)"/>
    <circle cx="60" cy="75" r="46" fill="#E8D5F5"/>
    <circle cx="44" cy="65" r="11" fill="#7B4FA0"/>
    <circle cx="76" cy="65" r="11" fill="#7B4FA0"/>
    <circle cx="48" cy="60" r="4" fill="white"/>
    <circle cx="80" cy="60" r="4" fill="white"/>
    <circle cx="50" cy="63" r="1.8" fill="white" opacity="0.7"/>
    <circle cx="82" cy="63" r="1.8" fill="white" opacity="0.7"/>
    <ellipse cx="60" cy="79" rx="7" ry="5" fill="#FFB3D9"/>
    <path d="M54,83 Q60,90 66,83" stroke="#DDA0DD" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <line x1="63" y1="79" x2="90" y2="73" stroke="#C9A0DC" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="63" y1="81" x2="91" y2="84" stroke="#C9A0DC" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="57" y1="79" x2="30" y2="73" stroke="#C9A0DC" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="57" y1="81" x2="29" y2="84" stroke="#C9A0DC" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="37" cy="84" r="9" fill="#FFB3D9" opacity="0.5"/>
    <circle cx="83" cy="84" r="9" fill="#FFB3D9" opacity="0.5"/>
  </svg>
);

const PETS = { cat: Cat, dog: Dog, bunny: Bunny };
const PET_LABELS = { cat: "🐱 Kitty", dog: "🐶 Puppy", bunny: "🐰 Bunny" };

/* ─── Flower ─── */
const Flower = ({ size = 48, accent, light }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    {[0,60,120,180,240,300].map((a,i)=>(
      <ellipse key={i} cx="24" cy="24" rx="5.5" ry="11"
        fill={i%2===0?accent:light}
        transform={`rotate(${a} 24 24) translate(0,-11)`} opacity="0.9"/>
    ))}
    <circle cx="24" cy="24" r="8" fill="#FFD700"/>
    <circle cx="24" cy="24" r="5" fill="#FFA500"/>
    <circle cx="22" cy="22" r="2" fill="rgba(255,255,255,0.55)"/>
  </svg>
);

/* ─── Ruled paper lines ─── */
const Lines = ({ color }) => (
  <div style={{
    position:"absolute", inset:0,
    backgroundImage:`repeating-linear-gradient(transparent,transparent 27px,${color}80 27px,${color}80 28px)`,
    backgroundPosition:"0 38px",
    pointerEvents:"none", borderRadius:"inherit",
  }}/>
);

/* ─── Floating background particles ─── */
function BgParticles({ emojis, n=14 }) {
  const list = Array.from({length:n},(_,i)=>({
    id:i, e:emojis[i%emojis.length],
    l:`${4+(i*8.7)%88}%`, t:`${4+(i*6.9)%84}%`,
    delay:`${(i*0.45)%3}s`,
    dur:`${2.4+(i*0.28)%2}s`,
    sz:13+(i%4)*5,
  }));
  return (
    <div style={{position:"absolute",inset:0,pointerEvents:"none",overflow:"hidden"}}>
      {list.map(p=>(
        <div key={p.id} style={{
          position:"absolute", left:p.l, top:p.t,
          fontSize:p.sz, userSelect:"none",
          animation:`twinkle ${p.dur} ${p.delay} ease-in-out infinite`,
        }}>{p.e}</div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════
   CREATE PAGE
═══════════════════════════════════ */
function CreatePage() {
  const [form, setForm] = useState({ toName:"", fromName:"", message:"", pet:"cat", theme:"pink" });
  const [done, setDone]   = useState(false);
  const [link, setLink]   = useState("");
  const [copied,setCopied]= useState(false);

  const t = THEMES[form.theme];
  const Pet = PETS[form.pet];
  const upd = (k,v)=>setForm(f=>({...f,[k]:v}));

  const create = () => {
    const enc = encode(form);
    const url = `${window.location.href.split("#")[0]}#view/${enc}`;
    setLink(url); setDone(true);
  };

  const copy = () => {
    navigator.clipboard.writeText(link).catch(()=>{});
    setCopied(true); setTimeout(()=>setCopied(false),2400);
  };

  const preview = () => {
    const enc = encode(form);
    window.location.hash = `view/${enc}`;
  };

  const inp = {
    width:"100%", padding:"12px 16px", borderRadius:16,
    border:`2px solid ${t.accentLight}`, background:"rgba(255,255,255,0.82)",
    fontSize:16, fontFamily:"Nunito, sans-serif", fontWeight:600,
    color:t.textColor, outline:"none",
  };

  const isReady = form.toName && form.fromName && form.message;

  return (
    <div style={{
      minHeight:"100vh",
      background:`linear-gradient(150deg,${t.bg[0]},${t.bg[1]},${t.bg[2]})`,
      fontFamily:"Nunito, sans-serif",
      padding:"24px 16px 48px",
      position:"relative", overflow:"hidden",
    }}>
      <BgParticles emojis={t.particles}/>

      {/* Header */}
      <div style={{textAlign:"center",marginBottom:20,position:"relative",zIndex:1}}>
        <div style={{fontSize:48,marginBottom:2}}>💌</div>
        <h1 style={{
          fontFamily:"Caveat, cursive", fontSize:40, fontWeight:700,
          color:t.textColor, textShadow:`2px 3px 0 ${t.accentLight}`,margin:0,
        }}>Write a Cute Letter</h1>
        <p style={{color:t.accentMid,fontSize:14,fontWeight:700,marginTop:4}}>
          Sprinkle some love on someone special ✨
        </p>
      </div>

      {/* Bouncing pet */}
      <div style={{
        display:"flex",justifyContent:"center",marginBottom:12,position:"relative",zIndex:1,
        animation:"floatPet 2.8s ease-in-out infinite",
      }}>
        <div style={{
          background:`radial-gradient(circle, ${t.accentLight}30, transparent)`,
          borderRadius:"50%", padding:8,
        }}>
          <Pet size={88}/>
        </div>
      </div>

      {/* Card */}
      <div style={{
        maxWidth:480, margin:"0 auto",
        background:"rgba(255,255,255,0.7)", backdropFilter:"blur(18px)",
        borderRadius:28, border:`2px solid ${t.accentLight}60`,
        padding:"24px 22px", boxShadow:`0 24px 70px ${t.accent}20`,
        position:"relative", zIndex:1,
      }}>

        {!done ? (
          <>
            {/* To / From */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
              {[["toName","🌟 TO","Receiver's name"],["fromName","💕 FROM","Your name"]].map(([k,label,ph])=>(
                <div key={k}>
                  <div style={{fontSize:12,fontWeight:900,color:t.textColor,marginBottom:6,letterSpacing:"0.6px"}}>{label}</div>
                  <input style={inp} placeholder={ph} value={form[k]}
                    onChange={e=>upd(k,e.target.value)} maxLength={20}/>
                </div>
              ))}
            </div>

            {/* Message */}
            <div style={{marginBottom:18}}>
              <div style={{fontSize:12,fontWeight:900,color:t.textColor,marginBottom:6,letterSpacing:"0.6px"}}>✍️ YOUR MESSAGE</div>
              <textarea style={{
                ...inp, minHeight:130, resize:"vertical", lineHeight:1.7,
                fontFamily:"Caveat, cursive", fontSize:19,
              }}
                placeholder="Write something sweet from the heart... 💕"
                value={form.message} onChange={e=>upd("message",e.target.value)} maxLength={500}
              />
              <div style={{textAlign:"right",fontSize:12,color:t.accentMid,marginTop:3,fontWeight:700}}>
                {form.message.length}/500
              </div>
            </div>

            {/* Pet picker */}
            <div style={{marginBottom:16}}>
              <div style={{fontSize:12,fontWeight:900,color:t.textColor,marginBottom:10,letterSpacing:"0.6px"}}>🐾 PET FRIEND</div>
              <div style={{display:"flex",gap:10}}>
                {Object.entries(PET_LABELS).map(([key,label])=>{
                  const P = PETS[key];
                  const sel = form.pet===key;
                  return (
                    <button key={key} onClick={()=>upd("pet",key)} style={{
                      flex:1, padding:"10px 4px", borderRadius:18,
                      border:`2.5px solid ${sel?t.accent:t.accentLight+"80"}`,
                      background:sel?`${t.accentLight}50`:"rgba(255,255,255,0.55)",
                      cursor:"pointer", transition:"all 0.2s",
                      display:"flex", flexDirection:"column", alignItems:"center", gap:4,
                      transform:sel?"scale(1.06)":"scale(1)",
                    }}>
                      <P size={46}/>
                      <span style={{fontSize:11,fontWeight:800,color:t.textColor}}>{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Theme picker */}
            <div style={{marginBottom:24}}>
              <div style={{fontSize:12,fontWeight:900,color:t.textColor,marginBottom:10,letterSpacing:"0.6px"}}>🎨 THEME</div>
              <div style={{display:"flex",gap:8}}>
                {Object.entries(THEMES).map(([key,th])=>{
                  const sel = form.theme===key;
                  return (
                    <button key={key} onClick={()=>upd("theme",key)} title={th.name} style={{
                      flex:1, height:46, borderRadius:14,
                      border:`2.5px solid ${sel?th.accent:"transparent"}`,
                      background:`linear-gradient(135deg,${th.bg[0]},${th.bg[1]})`,
                      cursor:"pointer", transition:"all 0.2s",
                      transform:sel?"scale(1.1)":"scale(1)",
                      boxShadow:sel?`0 4px 14px ${th.accent}55`:"none",
                      fontSize:20,
                    }}>{th.emoji}</button>
                  );
                })}
              </div>
            </div>

            {/* Buttons */}
            <div style={{display:"flex",gap:10}}>
              <button onClick={preview} style={{
                flex:1, padding:"13px", borderRadius:20,
                border:`2px solid ${t.accent}`, background:"white",
                color:t.accent, fontSize:14, fontWeight:800,
                fontFamily:"Nunito, sans-serif", cursor:"pointer",
              }}>👁️ Preview</button>
              <button onClick={create} disabled={!isReady} style={{
                flex:2, padding:"13px", borderRadius:20, border:"none",
                background:isReady?`linear-gradient(135deg,${t.accent},${t.accentMid})`:"#ddd",
                color:"white", fontSize:15, fontWeight:800,
                fontFamily:"Nunito, sans-serif",
                cursor:isReady?"pointer":"not-allowed",
                boxShadow:isReady?`0 8px 24px ${t.accent}50`:"none",
                transition:"all 0.2s",
              }}>💌 Create & Share!</button>
            </div>
          </>
        ) : (
          /* ── Done state ── */
          <div style={{textAlign:"center",animation:"bounceIn 0.5s ease-out"}}>
            <div style={{fontSize:56,marginBottom:10}}>🎉</div>
            <h2 style={{fontFamily:"Caveat, cursive",fontSize:34,color:t.textColor,marginBottom:6}}>
              Letter Ready!
            </h2>
            <p style={{color:t.accentMid,fontSize:14,fontWeight:700,marginBottom:18}}>
              Copy the link and send it to {form.toName||"your friend"} ✨
            </p>

            {/* Link box */}
            <div style={{
              background:"rgba(255,255,255,0.9)", borderRadius:14,
              border:`2px dashed ${t.accentLight}`,
              padding:"12px 14px", fontSize:11.5, color:t.textColor,
              wordBreak:"break-all", marginBottom:14,
              textAlign:"left", maxHeight:80, overflowY:"auto",
              fontFamily:"monospace", lineHeight:1.5,
            }}>{link}</div>

            <div style={{display:"flex",gap:10,marginBottom:14}}>
              <button onClick={copy} style={{
                flex:1, padding:"13px", borderRadius:18, border:"none",
                background:copied?"#4CAF50":`linear-gradient(135deg,${t.accent},${t.accentMid})`,
                color:"white", fontSize:15, fontWeight:800,
                fontFamily:"Nunito, sans-serif", cursor:"pointer",
                transition:"background 0.3s",
                boxShadow:`0 6px 18px ${t.accent}45`,
              }}>{copied?"✅ Copied!":"📋 Copy Link"}</button>
              <button onClick={preview} style={{
                flex:1, padding:"13px", borderRadius:18,
                border:`2px solid ${t.accent}`, background:"white",
                color:t.accent, fontSize:14, fontWeight:800,
                fontFamily:"Nunito, sans-serif", cursor:"pointer",
              }}>👁️ Preview</button>
            </div>

            <button onClick={()=>setDone(false)} style={{
              background:"none", border:"none",
              color:t.accentMid, fontSize:14, fontWeight:700,
              cursor:"pointer", textDecoration:"underline",
            }}>← Write another letter</button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        textAlign:"center", marginTop:28, position:"relative", zIndex:1,
        color:t.accentLight, fontSize:13, fontWeight:700,
      }}>made with 💕 for cute friends</div>
    </div>
  );
}

/* ═══════════════════════════════════
   VIEW PAGE
═══════════════════════════════════ */
function ViewPage({ data, onBack }) {
  const [stage, setStage]   = useState(0);  // 0→1→2
  const [jiggle,setJiggle]  = useState(false);
  const [hearts,setHearts]  = useState([]);
  const [petVisible, setPetVisible] = useState(false);

  const t   = THEMES[data?.theme] || THEMES.pink;
  const Pet = PETS[data?.pet]     || Cat;

  useEffect(()=>{ setTimeout(()=>setPetVisible(true),300); },[]);

  const handleTap = () => {
    if (stage === 0) {
      setJiggle(true);
      setTimeout(()=>{ setJiggle(false); setStage(1); }, 520);
    } else if (stage === 1) {
      setStage(2);
      for (let i=0;i<8;i++) {
        setTimeout(()=>setHearts(h=>[...h,{
          id:Date.now()+Math.random(),
          x:20+Math.random()*60,
          y:30+Math.random()*30,
          e:t.particles[Math.floor(Math.random()*t.particles.length)],
        }]),i*120);
      }
    }
  };

  const EW = 290, EH = 200;

  return (
    <div onClick={handleTap} style={{
      minHeight:"100vh",
      background:`linear-gradient(150deg,${t.bg[0]},${t.bg[1]},${t.bg[2]})`,
      fontFamily:"Nunito, sans-serif",
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      position:"relative", overflow:"hidden",
      cursor:stage<2?"pointer":"default",
      userSelect:"none",
      padding:"20px 16px 40px",
    }}>
      <BgParticles emojis={t.particles} n={18}/>

      {/* Back */}
      {onBack && (
        <button onClick={e=>{e.stopPropagation();onBack();}} style={{
          position:"fixed",top:14,left:14,zIndex:200,
          background:"rgba(255,255,255,0.85)",backdropFilter:"blur(8px)",
          border:`2px solid ${t.accentLight}`, borderRadius:20,
          padding:"7px 14px", fontSize:13, fontWeight:800,
          fontFamily:"Nunito, sans-serif", color:t.textColor, cursor:"pointer",
        }}>← Edit</button>
      )}

      {/* Stages 0 & 1 ─ envelope scene */}
      <div style={{
        display:"flex", flexDirection:"column", alignItems:"center",
        opacity:stage===2?0:1,
        transition:"opacity 0.5s",
        pointerEvents:stage===2?"none":"auto",
        position:"relative", zIndex:5,
      }}>

        {/* Greeting */}
        {data?.toName && (
          <div style={{
            fontFamily:"Caveat, cursive", fontSize:26, fontWeight:700,
            color:t.textColor, marginBottom:10, textAlign:"center",
            animation:"fadeUp 0.5s ease",
          }}>
            A letter for <span style={{color:t.accent}}>{data.toName}</span> 💌
          </div>
        )}

        {/* Pet */}
        <div style={{
          animation:"floatPet 2.8s ease-in-out infinite",
          marginBottom:14,
          opacity:petVisible?1:0,
          transform:petVisible?"scale(1)":"scale(0.5)",
          transition:"opacity 0.5s, transform 0.5s",
        }}>
          <Pet size={stage===0?110:80}/>
        </div>

        {/* Envelope */}
        <div style={{
          width:EW, height:EH,
          position:"relative",
          animation:jiggle?"envelopeJiggle 0.5s ease-in-out":"none",
          filter:`drop-shadow(0 16px 40px ${t.accent}35)`,
        }}>

          {/* Envelope inner bg */}
          <div style={{
            position:"absolute", inset:0,
            background:t.envInner, borderRadius:16, zIndex:0,
          }}/>

          {/* Side folds */}
          <div style={{
            position:"absolute", top:0,left:0,bottom:0,width:"55%",
            background:`${t.envBody}E8`,
            clipPath:"polygon(0 0,0 100%,100% 50%)", zIndex:2,
          }}/>
          <div style={{
            position:"absolute", top:0,right:0,bottom:0,width:"55%",
            background:`${t.envBody}E8`,
            clipPath:"polygon(100% 0,0 50%,100% 100%)", zIndex:2,
          }}/>

          {/* Bottom V fold */}
          <div style={{
            position:"absolute", bottom:0,left:0,right:0,height:"54%",
            background:t.envBody,
            clipPath:"polygon(0 100%,50% 0%,100% 100%)", zIndex:3,
          }}/>

          {/* Flap (animates open) */}
          <div style={{
            position:"absolute",top:0,left:0,right:0,height:"58%",
            background:`linear-gradient(180deg,${t.envFlap},${t.envFlapDark})`,
            clipPath:"polygon(0 0,100% 0,50% 100%)",
            transformOrigin:"top center",
            transform:stage>=1
              ?"perspective(300px) rotateX(-178deg)"
              :"perspective(300px) rotateX(0deg)",
            transition:"transform 0.9s cubic-bezier(0.34,1.2,0.64,1)",
            zIndex:8,
          }}/>

          {/* Flower seal */}
          <div style={{
            position:"absolute", bottom:"20%", left:"50%",
            transform:"translateX(-50%)",
            zIndex:9, opacity:stage>=1?0:1,
            transition:"opacity 0.3s",
          }}>
            <Flower size={54} accent={t.accent} light={t.accentLight}/>
          </div>

          {/* Letter paper inside envelope */}
          <div style={{
            position:"absolute",
            left:"8%", right:"8%", bottom:0,
            height:"85%",
            background:t.letterBg,
            borderRadius:"10px 10px 0 0",
            transform:stage===2?"translateY(-88%)":stage===1?"translateY(-18%)":"translateY(100%)",
            transition:"transform 1s cubic-bezier(0.34,1.2,0.64,1)",
            zIndex:7,
            boxShadow:"0 -8px 30px rgba(0,0,0,0.1)",
            padding:"14px 12px 8px",
            overflow:"hidden",
          }}>
            <Lines color={t.lineColor}/>
            <div style={{
              position:"relative", zIndex:1,
              opacity:stage>=1?0.5:0,
              transition:"opacity 0.4s",
              fontFamily:"Caveat, cursive",
              color:t.textColor, fontSize:17, lineHeight:1.9,
            }}>
              Dear {data?.toName||"Friend"} 💕
            </div>
          </div>
        </div>

        {/* Hint text */}
        <div style={{
          marginTop:22,
          fontFamily:"Caveat, cursive",
          fontSize:22, fontWeight:700,
          color:t.textColor, textAlign:"center",
          animation:"pulseHint 1.9s ease-in-out infinite",
          minHeight:32,
        }}>
          {stage===0 && "✨ Tap or swipe to open your letter ✨"}
          {stage===1 && "💌 Tap again to read your letter 💌"}
        </div>
      </div>

      {/* ── STAGE 2: Full letter reveal ── */}
      {stage===2 && (
        <div style={{
          position:"fixed", inset:0,
          background:"rgba(0,0,0,0.18)",
          backdropFilter:"blur(4px)",
          display:"flex", flexDirection:"column",
          alignItems:"center", justifyContent:"center",
          padding:"20px 16px",
          zIndex:30,
          animation:"fadeIn 0.4s ease",
        }}>

          {/* Letter card */}
          <div style={{
            background:t.letterBg,
            borderRadius:24, maxWidth:420, width:"100%",
            maxHeight:"80vh",
            boxShadow:`0 32px 90px ${t.accent}35, 0 10px 30px rgba(0,0,0,0.15)`,
            position:"relative", overflow:"hidden",
            animation:"bounceIn 0.55s cubic-bezier(0.34,1.3,0.64,1)",
          }}>
            <Lines color={t.lineColor}/>

            {/* Top accent bar */}
            <div style={{
              height:8,
              background:`linear-gradient(90deg,${t.accent},${t.accentMid},${t.accentLight},${t.accentMid},${t.accent})`,
              backgroundSize:"200% 100%",
              animation:"shimmer 2s linear infinite",
            }}/>

            {/* Letter content */}
            <div style={{padding:"22px 26px 24px",position:"relative",zIndex:1,overflowY:"auto",maxHeight:"calc(80vh - 80px)"}}>
              {/* Watermark pet */}
              <div style={{position:"absolute",top:12,right:16,opacity:0.12,pointerEvents:"none"}}>
                <Pet size={72}/>
              </div>

              <div style={{fontFamily:"Caveat, cursive",color:t.textColor,fontSize:21,lineHeight:1.88,position:"relative"}}>
                <div style={{fontSize:25,fontWeight:700,marginBottom:10,color:t.textColor}}>
                  Dear {data?.toName||"Friend"}, 💕
                </div>
                <div style={{whiteSpace:"pre-wrap",fontSize:20}}>
                  {data?.message}
                </div>
                <div style={{
                  marginTop:22,textAlign:"right",fontWeight:700,fontSize:20,
                  borderTop:`1.5px dashed ${t.lineColor}`,paddingTop:14,
                }}>
                  With all my love,{"\n"}
                  <span style={{color:t.accent,fontSize:26,fontWeight:700}}>{data?.fromName||"???"}</span>
                  {"  🌸"}
                </div>
              </div>
            </div>

            {/* Flower row */}
            <div style={{
              display:"flex",justifyContent:"center",gap:6,
              padding:"6px 0 14px",position:"relative",zIndex:1,
            }}>
              {[...Array(5)].map((_,i)=>(
                <Flower key={i} size={26} accent={t.accent} light={t.accentLight}/>
              ))}
            </div>
          </div>

          {/* Pet below letter */}
          <div style={{
            marginTop:16, animation:"floatPet 2.6s ease-in-out infinite",
            animation2:"petEnter 0.5s ease",
          }}>
            <Pet size={75}/>
          </div>

          {/* Tap to dismiss hint */}
          <div style={{
            marginTop:12, fontFamily:"Caveat, cursive",
            fontSize:16, fontWeight:700, color:"rgba(255,255,255,0.85)",
            textShadow:"0 1px 4px rgba(0,0,0,0.3)", textAlign:"center",
          }}>💌 Tap anywhere to close</div>
        </div>
      )}

      {/* Reset on stage2 tap */}
      {stage===2 && (
        <div onClick={e=>{e.stopPropagation();setStage(0);setHearts([]);}}
          style={{position:"fixed",inset:0,zIndex:29,cursor:"pointer"}}/>
      )}

      {/* Floating hearts */}
      {hearts.map(h=>(
        <div key={h.id}
          onAnimationEnd={()=>setHearts(hs=>hs.filter(x=>x.id!==h.id))}
          style={{
            position:"fixed", left:`${h.x}%`, top:`${h.y}%`,
            fontSize:22, pointerEvents:"none", zIndex:50,
            animation:"heartRise 1.4s ease-out forwards",
          }}>{h.e}</div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════
   ROOT APP
═══════════════════════════════════ */
export default function App() {
  const parseHash = () => {
    const h = window.location.hash;
    if (h.startsWith("#view/")) { const d=decode(h.slice(6)); if(d) return {route:"view",data:d}; }
    return {route:"create",data:null};
  };

  const [state, setState] = useState(parseHash);

  useEffect(()=>{
    const style = document.createElement("style");
    style.textContent = GLOBAL_CSS;
    document.head.appendChild(style);
    return ()=>document.head.removeChild(style);
  },[]);

  useEffect(()=>{
    const onHash = ()=>setState(parseHash());
    window.addEventListener("hashchange",onHash);
    return ()=>window.removeEventListener("hashchange",onHash);
  },[]);

  if (state.route==="view" && state.data) {
    return <ViewPage data={state.data} onBack={()=>{window.location.hash="";}} />;
  }
  return <CreatePage/>;
}
