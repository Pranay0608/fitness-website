import { useState, useEffect, useRef } from "react";
import {
  Dumbbell, Home, Utensils, MessageCircle, TrendingUp, ChevronRight,
  Send, Loader2, Plus, Flame, Target, Calendar, Check, RotateCcw,
  User, Weight, X, ChevronDown
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

/* ---------------------------------------------------------------
   FORGE — design tokens
   Industrial forge / iron-plate identity. Charcoal steel ground,
   molten-orange accent, chalk-white type, stamped-metal numerics.
----------------------------------------------------------------*/
const Tokens = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap');

    :root{
      --bg:#141519;
      --panel:#1c1e24;
      --panel-alt:#24262d;
      --line:#2f323a;
      --accent:#ff5024;
      --accent-dim:#c73f1c;
      --chalk:#f3f0e8;
      --muted:#8d919a;
      --success:#7fd08a;
      --font-display:'Bebas Neue', sans-serif;
      --font-body:'Inter', sans-serif;
      --font-mono:'JetBrains Mono', monospace;
    }
    .forge-root{
      font-family:var(--font-body);
      background:
        radial-gradient(circle at 15% 0%, rgba(255,80,36,0.08), transparent 40%),
        var(--bg);
      color:var(--chalk);
      min-height:100%;
    }
    .display{ font-family:var(--font-display); letter-spacing:0.02em; }
    .mono{ font-family:var(--font-mono); }
    .plate{
      background:var(--panel);
      border:1px solid var(--line);
      border-radius:6px;
    }
    .plate-alt{ background:var(--panel-alt); border:1px solid var(--line); border-radius:6px; }
    .accent-text{ color:var(--accent); }
    .muted-text{ color:var(--muted); }
    .btn-forge{
      background:var(--accent);
      color:#181008;
      font-weight:700;
      border:none;
      border-radius:4px;
      transition:transform .12s ease, background .12s ease;
    }
    .btn-forge:hover{ background:#ff6c3e; transform:translateY(-1px); }
    .btn-forge:active{ transform:translateY(0px); }
    .btn-ghost{
      background:transparent;
      border:1px solid var(--line);
      color:var(--chalk);
      border-radius:4px;
      transition:border-color .12s ease, background .12s ease;
    }
    .btn-ghost:hover{ border-color:var(--accent); background:rgba(255,80,36,0.06); }
    .tab-item{
      color:var(--muted);
      border-bottom:2px solid transparent;
      transition:color .12s ease, border-color .12s ease;
      white-space:nowrap;
    }
    .tab-item.active{ color:var(--chalk); border-bottom-color:var(--accent); }
    .tab-item:hover{ color:var(--chalk); }
    .stamp{
      width:64px; height:64px; border-radius:999px;
      background:
        radial-gradient(circle at 32% 28%, rgba(255,255,255,0.10), transparent 55%),
        conic-gradient(from 210deg, #33353c, #1c1d21, #33353c);
      border:2px solid #3c3f47;
      display:flex; align-items:center; justify-content:center;
      box-shadow: inset 0 0 0 3px #14151980;
    }
    .bar-divider{ display:flex; align-items:center; gap:6px; opacity:0.9; }
    .bar-divider .bar{ flex:1; height:6px; background:linear-gradient(90deg, transparent, var(--line) 15%, var(--line) 85%, transparent); border-radius:2px; }
    .plate-disc{ width:22px; height:22px; border-radius:999px; background:var(--panel-alt); border:2px solid var(--line); }
    .plate-disc.lg{ width:30px; height:30px; }
    input[type=text], input[type=number], select, textarea{
      background:var(--panel-alt);
      border:1px solid var(--line);
      color:var(--chalk);
      border-radius:4px;
      outline:none;
    }
    input:focus, select:focus, textarea:focus{ border-color:var(--accent); }
    input[type=range]{ accent-color:var(--accent); }
    ::selection{ background:var(--accent); color:#181008; }
    .scrollbar-thin::-webkit-scrollbar{ width:6px; height:6px; }
    .scrollbar-thin::-webkit-scrollbar-thumb{ background:var(--line); border-radius:3px; }
    @media (prefers-reduced-motion: reduce){
      *{ transition:none !important; animation:none !important; }
    }
  `}</style>
);

/* ---------------------------------------------------------------
   Exercise database
----------------------------------------------------------------*/
const EXERCISES = {
  Chest: [
    { name: "Barbell Bench Press", sets: 4, reps: "6-8", tip: "Drive through your feet, keep shoulder blades pinned back.", eq: "gym" },
    { name: "Incline Dumbbell Press", sets: 3, reps: "8-10", tip: "45° bench max — steeper turns it into a shoulder move.", eq: "gym" },
    { name: "Push-Ups", sets: 3, reps: "AMRAP", tip: "Keep a straight line from head to heel, full range of motion.", eq: "home" },
    { name: "Cable Fly", sets: 3, reps: "12-15", tip: "Slight bend in elbows, squeeze at the center, control the negative.", eq: "gym" },
    { name: "Dips (Chest lean)", sets: 3, reps: "8-12", tip: "Lean forward to bias chest over triceps.", eq: "gym" },
  ],
  Back: [
    { name: "Deadlift", sets: 4, reps: "5", tip: "Bar stays close to shins, brace core before you pull.", eq: "gym" },
    { name: "Pull-Ups", sets: 4, reps: "AMRAP", tip: "Full hang at the bottom, chest to bar at the top.", eq: "home" },
    { name: "Barbell Row", sets: 3, reps: "8-10", tip: "Hinge to ~45°, pull to your lower ribs, no jerking.", eq: "gym" },
    { name: "Lat Pulldown", sets: 3, reps: "10-12", tip: "Pull with elbows, not hands — think 'elbows to hips'.", eq: "gym" },
    { name: "Inverted Rows", sets: 3, reps: "10-15", tip: "Body straight, squeeze shoulder blades at the top.", eq: "home" },
  ],
  Legs: [
    { name: "Barbell Back Squat", sets: 4, reps: "6-8", tip: "Knees track over toes, hit at least parallel depth.", eq: "gym" },
    { name: "Romanian Deadlift", sets: 3, reps: "8-10", tip: "Soft knees, push hips back, feel the hamstring stretch.", eq: "gym" },
    { name: "Bodyweight Squats", sets: 4, reps: "15-20", tip: "Slow tempo down, explosive up — no weight needed.", eq: "home" },
    { name: "Walking Lunges", sets: 3, reps: "12/leg", tip: "Front knee stays behind toes, torso upright.", eq: "home" },
    { name: "Leg Press", sets: 3, reps: "10-12", tip: "Don't lock knees out hard at the top.", eq: "gym" },
  ],
  Shoulders: [
    { name: "Overhead Press", sets: 4, reps: "6-8", tip: "Brace your core hard — no leaning back to compensate.", eq: "gym" },
    { name: "Lateral Raises", sets: 3, reps: "12-15", tip: "Lead with elbows, stop at shoulder height, light weight is fine.", eq: "gym" },
    { name: "Pike Push-Ups", sets: 3, reps: "8-12", tip: "Hips high, hands close, lower head toward the floor.", eq: "home" },
    { name: "Rear Delt Fly", sets: 3, reps: "12-15", tip: "Hinge forward, squeeze shoulder blades together at the top.", eq: "gym" },
  ],
  Arms: [
    { name: "Barbell Curl", sets: 3, reps: "8-10", tip: "No swinging — elbows pinned to your sides the whole rep.", eq: "gym" },
    { name: "Close-Grip Bench Press", sets: 3, reps: "8-10", tip: "Elbows tucked, bar to lower chest, drives triceps hard.", eq: "gym" },
    { name: "Diamond Push-Ups", sets: 3, reps: "AMRAP", tip: "Hands form a diamond under your chest, elbows stay close.", eq: "home" },
    { name: "Hammer Curls", sets: 3, reps: "10-12", tip: "Neutral grip hits the brachialis for arm thickness.", eq: "gym" },
    { name: "Tricep Rope Pushdown", sets: 3, reps: "12-15", tip: "Elbows locked at your sides, split the rope at the bottom.", eq: "gym" },
  ],
  Core: [
    { name: "Hanging Leg Raise", sets: 3, reps: "10-15", tip: "Curl your pelvis under — don't just swing your legs.", eq: "gym" },
    { name: "Plank", sets: 3, reps: "45-60s", tip: "Squeeze glutes, don't let hips sag or pike up.", eq: "home" },
    { name: "Cable Crunch", sets: 3, reps: "12-15", tip: "Crunch through the spine, hips stay still.", eq: "gym" },
    { name: "Bicycle Crunches", sets: 3, reps: "20/side", tip: "Slow and controlled beats fast and sloppy every time.", eq: "home" },
  ],
};

const MUSCLE_LIST = Object.keys(EXERCISES);

/* Split generator based on days/week */
function buildSplit(days, equipment) {
  const plans = {
    3: [
      { day: "Day 1", label: "Push", muscles: ["Chest", "Shoulders", "Arms"] },
      { day: "Day 2", label: "Pull", muscles: ["Back", "Arms"] },
      { day: "Day 3", label: "Legs + Core", muscles: ["Legs", "Core"] },
    ],
    4: [
      { day: "Day 1", label: "Upper A", muscles: ["Chest", "Back"] },
      { day: "Day 2", label: "Lower A", muscles: ["Legs", "Core"] },
      { day: "Day 3", label: "Upper B", muscles: ["Shoulders", "Arms"] },
      { day: "Day 4", label: "Lower B", muscles: ["Legs", "Core"] },
    ],
    5: [
      { day: "Day 1", label: "Chest", muscles: ["Chest"] },
      { day: "Day 2", label: "Back", muscles: ["Back"] },
      { day: "Day 3", label: "Legs", muscles: ["Legs"] },
      { day: "Day 4", label: "Shoulders", muscles: ["Shoulders", "Core"] },
      { day: "Day 5", label: "Arms", muscles: ["Arms"] },
    ],
    6: [
      { day: "Day 1", label: "Push", muscles: ["Chest", "Shoulders"] },
      { day: "Day 2", label: "Pull", muscles: ["Back"] },
      { day: "Day 3", label: "Legs", muscles: ["Legs"] },
      { day: "Day 4", label: "Push", muscles: ["Chest", "Arms"] },
      { day: "Day 5", label: "Pull", muscles: ["Back", "Arms"] },
      { day: "Day 6", label: "Legs + Core", muscles: ["Legs", "Core"] },
    ],
  };
  const plan = plans[days] || plans[3];
  return plan.map((d) => ({
    ...d,
    exercises: d.muscles.flatMap((m) =>
      EXERCISES[m]
        .filter((e) => (equipment === "home" ? e.eq === "home" : true))
        .slice(0, equipment === "home" ? 3 : 2)
        .map((e) => ({ ...e, muscle: m }))
    ),
  }));
}

/* ---------------------------------------------------------------
   Small building blocks
----------------------------------------------------------------*/
const PlateStat = ({ value, label }) => (
  <div className="flex flex-col items-center gap-2">
    <div className="stamp">
      <span className="mono" style={{ fontSize: 15, fontWeight: 700, color: "var(--chalk)" }}>{value}</span>
    </div>
    <span className="muted-text" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</span>
  </div>
);

const BarDivider = () => (
  <div className="bar-divider">
    <div className="plate-disc lg" />
    <div className="plate-disc" />
    <div className="bar" />
    <div className="plate-disc" />
    <div className="plate-disc lg" />
  </div>
);

/* ---------------------------------------------------------------
   Onboarding
----------------------------------------------------------------*/
function Onboarding({ onDone }) {
  const [form, setForm] = useState({
    name: "", age: "", gender: "Male", weight: "", height: "",
    level: "Beginner", goal: "Muscle Gain", days: "4", equipment: "gym",
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const valid = form.name && form.age && form.weight && form.height;

  return (
    <div className="forge-root min-h-screen flex items-center justify-center p-4">
      <Tokens />
      <div className="plate w-full max-w-xl p-6 md:p-8">
        <div className="flex items-center gap-2 mb-1">
          <Flame size={22} color="var(--accent)" />
          <span className="display" style={{ fontSize: 28 }}>FORGE</span>
        </div>
        <p className="muted-text mb-6" style={{ fontSize: 14 }}>
          A few details so your coach can build a plan around your body, not a generic one.
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="muted-text text-xs uppercase tracking-wide">Name</label>
            <input type="text" className="w-full mt-1 px-3 py-2" value={form.name}
              onChange={(e) => set("name", e.target.value)} placeholder="Your name" />
          </div>
          <div>
            <label className="muted-text text-xs uppercase tracking-wide">Age</label>
            <input type="number" className="w-full mt-1 px-3 py-2" value={form.age}
              onChange={(e) => set("age", e.target.value)} placeholder="25" />
          </div>
          <div>
            <label className="muted-text text-xs uppercase tracking-wide">Gender</label>
            <select className="w-full mt-1 px-3 py-2" value={form.gender} onChange={(e) => set("gender", e.target.value)}>
              <option>Male</option><option>Female</option><option>Other</option>
            </select>
          </div>
          <div>
            <label className="muted-text text-xs uppercase tracking-wide">Weight (kg)</label>
            <input type="number" className="w-full mt-1 px-3 py-2" value={form.weight}
              onChange={(e) => set("weight", e.target.value)} placeholder="70" />
          </div>
          <div>
            <label className="muted-text text-xs uppercase tracking-wide">Height (cm)</label>
            <input type="number" className="w-full mt-1 px-3 py-2" value={form.height}
              onChange={(e) => set("height", e.target.value)} placeholder="175" />
          </div>
          <div>
            <label className="muted-text text-xs uppercase tracking-wide">Level</label>
            <select className="w-full mt-1 px-3 py-2" value={form.level} onChange={(e) => set("level", e.target.value)}>
              <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
            </select>
          </div>
          <div>
            <label className="muted-text text-xs uppercase tracking-wide">Goal</label>
            <select className="w-full mt-1 px-3 py-2" value={form.goal} onChange={(e) => set("goal", e.target.value)}>
              <option>Muscle Gain</option><option>Fat Loss</option><option>Strength</option><option>General Fitness</option>
            </select>
          </div>
          <div>
            <label className="muted-text text-xs uppercase tracking-wide">Days / week</label>
            <select className="w-full mt-1 px-3 py-2" value={form.days} onChange={(e) => set("days", e.target.value)}>
              <option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option>
            </select>
          </div>
          <div>
            <label className="muted-text text-xs uppercase tracking-wide">Equipment</label>
            <select className="w-full mt-1 px-3 py-2" value={form.equipment} onChange={(e) => set("equipment", e.target.value)}>
              <option value="gym">Full Gym</option><option value="home">Home / Minimal</option>
            </select>
          </div>
        </div>

        <button
          disabled={!valid}
          onClick={() => onDone(form)}
          className="btn-forge w-full mt-6 py-3 display flex items-center justify-center gap-2"
          style={{ fontSize: 18, opacity: valid ? 1 : 0.4, cursor: valid ? "pointer" : "not-allowed" }}
        >
          BUILD MY PLAN <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   Dashboard
----------------------------------------------------------------*/
function Dashboard({ profile, split, logsCount, streak, onGoto }) {
  const todayIdx = new Date().getDay() % split.length;
  const today = split[todayIdx];
  return (
    <div className="space-y-6">
      <div className="plate p-5 md:p-6">
        <p className="muted-text text-xs uppercase tracking-wide">Welcome back</p>
        <h2 className="display" style={{ fontSize: 30 }}>{profile.name || "Athlete"}</h2>
        <p className="muted-text mt-1" style={{ fontSize: 13 }}>
          Goal: <span className="accent-text">{profile.goal}</span> · {profile.level} · {profile.days}d/week
        </p>
        <div className="mt-5 flex gap-6 flex-wrap">
          <PlateStat value={streak} label="Day Streak" />
          <PlateStat value={logsCount} label="Workouts Logged" />
          <PlateStat value={profile.weight} label="Bodyweight (kg)" />
        </div>
      </div>

      <div className="my-4"><BarDivider /></div>

      <div className="plate p-5 md:p-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="muted-text text-xs uppercase tracking-wide">Today's session</p>
            <h3 className="display" style={{ fontSize: 22 }}>{today.day} — {today.label}</h3>
          </div>
          <button onClick={() => onGoto("workouts")} className="btn-ghost px-3 py-2 text-sm flex items-center gap-1">
            Full plan <ChevronRight size={14} />
          </button>
        </div>
        <div className="space-y-2">
          {today.exercises.slice(0, 4).map((e, i) => (
            <div key={i} className="plate-alt px-3 py-2 flex items-center justify-between">
              <span style={{ fontSize: 14 }}>{e.name}</span>
              <span className="mono muted-text" style={{ fontSize: 12 }}>{e.sets}×{e.reps}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <button onClick={() => onGoto("nutrition")} className="plate p-5 text-left hover:border-[var(--accent)]" style={{ borderColor: "var(--line)" }}>
          <Utensils size={20} color="var(--accent)" />
          <p className="display mt-2" style={{ fontSize: 18 }}>Protein & Supplements</p>
          <p className="muted-text" style={{ fontSize: 13 }}>Calculate your daily target and see what actually helps.</p>
        </button>
        <button onClick={() => onGoto("coach")} className="plate p-5 text-left">
          <MessageCircle size={20} color="var(--accent)" />
          <p className="display mt-2" style={{ fontSize: 18 }}>Ask Your AI Coach</p>
          <p className="muted-text" style={{ fontSize: 13 }}>Form checks, swaps, and plan tweaks in plain language.</p>
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   Workouts tab
----------------------------------------------------------------*/
function Workouts({ split, onLog }) {
  const [openDay, setOpenDay] = useState(0);
  return (
    <div className="space-y-4">
      <h2 className="display" style={{ fontSize: 26 }}>Your Weekly Split</h2>
      {split.map((d, i) => (
        <div key={i} className="plate overflow-hidden">
          <button onClick={() => setOpenDay(openDay === i ? -1 : i)} className="w-full flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="mono accent-text" style={{ fontSize: 13 }}>{String(i + 1).padStart(2, "0")}</span>
              <span className="display" style={{ fontSize: 20 }}>{d.day} — {d.label}</span>
            </div>
            <ChevronDown size={18} className="muted-text" style={{ transform: openDay === i ? "rotate(180deg)" : "none", transition: "transform .15s" }} />
          </button>
          {openDay === i && (
            <div className="px-5 pb-5 space-y-2">
              {d.exercises.map((e, j) => (
                <div key={j} className="plate-alt px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600 }}>{e.name} <span className="muted-text" style={{ fontWeight: 400, fontSize: 12 }}>· {e.muscle}</span></p>
                    <p className="muted-text" style={{ fontSize: 12, marginTop: 2 }}>{e.tip}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="mono" style={{ fontSize: 13 }}>{e.sets} × {e.reps}</span>
                    <button onClick={() => onLog(d, e)} className="btn-ghost p-2"><Plus size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------
   Muscle Groups tab
----------------------------------------------------------------*/
function MuscleGroups() {
  const [active, setActive] = useState("Chest");
  return (
    <div className="space-y-4">
      <h2 className="display" style={{ fontSize: 26 }}>Muscle Group Library</h2>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {MUSCLE_LIST.map((m) => (
          <button key={m} onClick={() => setActive(m)}
            className={active === m ? "btn-forge px-4 py-2 text-sm" : "btn-ghost px-4 py-2 text-sm"}>
            {m}
          </button>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        {EXERCISES[active].map((e, i) => (
          <div key={i} className="plate p-4">
            <div className="flex items-center justify-between">
              <p style={{ fontWeight: 700 }}>{e.name}</p>
              <span className="mono accent-text" style={{ fontSize: 12 }}>{e.sets}×{e.reps}</span>
            </div>
            <p className="muted-text mt-2" style={{ fontSize: 13 }}>{e.tip}</p>
            <span className="muted-text mono" style={{ fontSize: 11, textTransform: "uppercase" }}>{e.eq === "home" ? "No equipment needed" : "Gym equipment"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   Nutrition / Supplements tab
----------------------------------------------------------------*/
const SUPPLEMENTS = [
  { name: "Whey Protein", what: "Fast-digesting protein to help you hit your daily protein target when food alone isn't enough.", dose: "1 scoop (~25g protein)", timing: "Post-workout or between meals" },
  { name: "Creatine Monohydrate", what: "The most researched supplement for strength and muscle size — pulls water into muscle cells and fuels short bursts of effort.", dose: "3-5g", timing: "Any time, daily, consistency matters more than timing" },
  { name: "Multivitamin", what: "Covers micronutrient gaps, especially useful when dieting in a calorie deficit.", dose: "As labeled", timing: "With a meal" },
  { name: "Omega-3 / Fish Oil", what: "Supports joint health and recovery, useful for people who don't eat much fatty fish.", dose: "1-2g EPA/DHA", timing: "With a meal" },
  { name: "Caffeine / Pre-Workout", what: "Boosts alertness and output for a session — optional, not essential.", dose: "100-200mg caffeine", timing: "20-30 min before training" },
  { name: "BCAAs", what: "Mostly unnecessary if you already eat enough total protein — whole protein sources cover this.", dose: "Optional", timing: "N/A" },
];

function Nutrition({ profile }) {
  const [bw, setBw] = useState(profile.weight || 70);
  const [goal, setGoal] = useState(profile.goal || "Muscle Gain");

  const proteinPerKg = goal === "Muscle Gain" ? 2.0 : goal === "Fat Loss" ? 2.2 : goal === "Strength" ? 1.8 : 1.6;
  const protein = Math.round(bw * proteinPerKg);
  const bmr = profile.gender === "Female"
    ? 10 * bw + 6.25 * Number(profile.height || 165) - 5 * Number(profile.age || 25) - 161
    : 10 * bw + 6.25 * Number(profile.height || 175) - 5 * Number(profile.age || 25) + 5;
  const tdee = Math.round(bmr * 1.55);
  const calories = goal === "Muscle Gain" ? tdee + 300 : goal === "Fat Loss" ? tdee - 400 : tdee;
  const fat = Math.round((calories * 0.25) / 9);
  const carbs = Math.max(0, Math.round((calories - protein * 4 - fat * 9) / 4));

  const macroData = [
    { name: "Protein", value: protein * 4, color: "var(--accent)" },
    { name: "Carbs", value: carbs * 4, color: "#e8c766" },
    { name: "Fat", value: fat * 9, color: "#7fa8d0" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="display" style={{ fontSize: 26 }}>Nutrition & Supplements</h2>

      <div className="plate p-5">
        <p className="muted-text text-xs uppercase tracking-wide mb-3">Calculator</p>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="muted-text text-xs">Bodyweight (kg)</label>
            <input type="number" className="w-full mt-1 px-3 py-2" value={bw} onChange={(e) => setBw(Number(e.target.value))} />
          </div>
          <div>
            <label className="muted-text text-xs">Goal</label>
            <select className="w-full mt-1 px-3 py-2" value={goal} onChange={(e) => setGoal(e.target.value)}>
              <option>Muscle Gain</option><option>Fat Loss</option><option>Strength</option><option>General Fitness</option>
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="plate-alt py-4">
              <p className="mono accent-text" style={{ fontSize: 22, fontWeight: 700 }}>{protein}g</p>
              <p className="muted-text" style={{ fontSize: 11 }}>PROTEIN</p>
            </div>
            <div className="plate-alt py-4">
              <p className="mono" style={{ fontSize: 22, fontWeight: 700, color: "#e8c766" }}>{carbs}g</p>
              <p className="muted-text" style={{ fontSize: 11 }}>CARBS</p>
            </div>
            <div className="plate-alt py-4">
              <p className="mono" style={{ fontSize: 22, fontWeight: 700, color: "#7fa8d0" }}>{fat}g</p>
              <p className="muted-text" style={{ fontSize: 11 }}>FAT</p>
            </div>
            <div className="col-span-3 plate-alt py-3">
              <p className="mono" style={{ fontSize: 18, fontWeight: 700 }}>{calories} kcal / day</p>
            </div>
          </div>
          <div style={{ height: 160 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={macroData} dataKey="value" innerRadius={45} outerRadius={70} paddingAngle={3}>
                  {macroData.map((m, i) => <Cell key={i} fill={m.color} stroke="var(--panel)" />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--panel-alt)", border: "1px solid var(--line)", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <p className="muted-text mt-3" style={{ fontSize: 12 }}>
          Estimate only, based on standard formulas — not medical advice. Adjust based on real-world progress over a few weeks.
        </p>
      </div>

      <div>
        <p className="muted-text text-xs uppercase tracking-wide mb-3">Supplement Guide</p>
        <div className="grid md:grid-cols-2 gap-3">
          {SUPPLEMENTS.map((s, i) => (
            <div key={i} className="plate p-4">
              <p style={{ fontWeight: 700 }}>{s.name}</p>
              <p className="muted-text mt-1" style={{ fontSize: 13 }}>{s.what}</p>
              <div className="flex gap-4 mt-2 mono" style={{ fontSize: 11 }}>
                <span className="muted-text">DOSE: <span className="accent-text">{s.dose}</span></span>
                <span className="muted-text">WHEN: <span style={{ color: "var(--chalk)" }}>{s.timing}</span></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   AI Coach tab — real Claude API call
----------------------------------------------------------------*/
function Coach({ profile }) {
  const [messages, setMessages] = useState([
    { role: "assistant", text: `Hey ${profile.name || "there"}, I'm your coach. Ask me anything — form checks, exercise swaps, how much protein you need, whether to train through soreness, all of it.` }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", text: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const systemPrompt = `You are FORGE Coach, an expert, encouraging personal trainer and sports nutrition guide.
Client profile: ${profile.name}, ${profile.age}yo ${profile.gender}, ${profile.weight}kg, ${profile.height}cm, level: ${profile.level}, goal: ${profile.goal}, trains ${profile.days} days/week with ${profile.equipment === "home" ? "home/minimal equipment" : "full gym access"}.
Give specific, practical answers: sets/reps, exercise swaps, form cues, supplement/protein guidance. Keep replies concise (under ~150 words) and motivating but honest. Never give medical diagnoses; suggest a doctor for injuries or medical concerns.`;

    try {
      const apiMessages = newMessages.map(m => ({ role: m.role, content: m.text }));
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: systemPrompt,
          messages: apiMessages,
        }),
      });
      const data = await response.json();
      const text = (data.content || []).map(b => b.text || "").join("\n").trim() || "Sorry, I couldn't process that — try asking again.";
      setMessages(m => [...m, { role: "assistant", text }]);
    } catch (err) {
      setMessages(m => [...m, { role: "assistant", text: "Connection hiccup — check your network and try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="plate flex flex-col" style={{ height: "70vh" }}>
      <div className="px-5 py-4 border-b" style={{ borderColor: "var(--line)" }}>
        <p className="display" style={{ fontSize: 20 }}>AI Coach</p>
        <p className="muted-text" style={{ fontSize: 12 }}>Personalized to your profile</p>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 scrollbar-thin">
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
            <div className={m.role === "user" ? "btn-forge" : "plate-alt"} style={{ maxWidth: "80%", padding: "10px 14px", fontSize: 14, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="plate-alt flex items-center gap-2" style={{ padding: "10px 14px" }}>
              <Loader2 size={14} className="animate-spin" /> <span className="muted-text" style={{ fontSize: 13 }}>Coach is thinking…</span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>
      <div className="px-4 py-3 border-t flex gap-2" style={{ borderColor: "var(--line)" }}>
        <input type="text" className="flex-1 px-3 py-2" placeholder="Ask about form, swaps, protein…"
          value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()} />
        <button onClick={send} className="btn-forge px-4 py-2 flex items-center gap-1" disabled={loading}>
          <Send size={15} />
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   Progress tab
----------------------------------------------------------------*/
function Progress({ logs, weightLog, onAddWeight, onReset }) {
  const [newWeight, setNewWeight] = useState("");
  const chartData = weightLog.map((w) => ({ date: w.date, weight: w.value }));

  return (
    <div className="space-y-6">
      <h2 className="display" style={{ fontSize: 26 }}>Progress</h2>

      <div className="plate p-5">
        <p className="muted-text text-xs uppercase tracking-wide mb-3">Bodyweight trend</p>
        {chartData.length > 1 ? (
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid stroke="var(--line)" strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fill: "var(--muted)", fontSize: 11 }} />
                <YAxis tick={{ fill: "var(--muted)", fontSize: 11 }} domain={["auto", "auto"]} />
                <Tooltip contentStyle={{ background: "var(--panel-alt)", border: "1px solid var(--line)", fontSize: 12 }} />
                <Line type="monotone" dataKey="weight" stroke="var(--accent)" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="muted-text" style={{ fontSize: 13 }}>Log your weight a couple times to see a trend line here.</p>
        )}
        <div className="flex gap-2 mt-4">
          <input type="number" placeholder="Today's weight (kg)" className="flex-1 px-3 py-2"
            value={newWeight} onChange={(e) => setNewWeight(e.target.value)} />
          <button className="btn-forge px-4 py-2" onClick={() => { if (newWeight) { onAddWeight(Number(newWeight)); setNewWeight(""); } }}>
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div className="plate p-5">
        <p className="muted-text text-xs uppercase tracking-wide mb-3">Workout log</p>
        {logs.length === 0 ? (
          <p className="muted-text" style={{ fontSize: 13 }}>No sets logged yet — tap the + next to an exercise in the Workouts tab.</p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
            {logs.slice().reverse().map((l, i) => (
              <div key={i} className="plate-alt px-4 py-2 flex items-center justify-between">
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600 }}>{l.exercise}</p>
                  <p className="muted-text" style={{ fontSize: 11 }}>{l.day} · {l.date}</p>
                </div>
                <Check size={16} color="var(--success)" />
              </div>
            ))}
          </div>
        )}
      </div>

      <button onClick={onReset} className="btn-ghost px-4 py-2 text-sm flex items-center gap-2">
        <RotateCcw size={14} /> Reset all data
      </button>
    </div>
  );
}

/* ---------------------------------------------------------------
   App shell
----------------------------------------------------------------*/
const TABS = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "workouts", label: "Workouts", icon: Dumbbell },
  { id: "muscles", label: "Muscle Groups", icon: Target },
  { id: "nutrition", label: "Nutrition", icon: Utensils },
  { id: "coach", label: "AI Coach", icon: MessageCircle },
  { id: "progress", label: "Progress", icon: TrendingUp },
];

export default function App() {
  const [profile, setProfile] = useState(null);
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState("dashboard");
  const [logs, setLogs] = useState([]);
  const [weightLog, setWeightLog] = useState([]);

  // Load persisted data
  useEffect(() => {
    (async () => {
      try {
        const p = await window.storage.get("profile");
        if (p) setProfile(JSON.parse(p.value));
      } catch (e) { /* no profile yet */ }
      try {
        const l = await window.storage.get("logs");
        if (l) setLogs(JSON.parse(l.value));
      } catch (e) { /* none yet */ }
      try {
        const w = await window.storage.get("weightLog");
        if (w) setWeightLog(JSON.parse(w.value));
      } catch (e) { /* none yet */ }
      setReady(true);
    })();
  }, []);

  const saveProfile = async (p) => {
    setProfile(p);
    try { await window.storage.set("profile", JSON.stringify(p)); } catch (e) { console.error(e); }
  };

  const addLog = async (day, exercise) => {
    const entry = { day: day.label, exercise: exercise.name, date: new Date().toLocaleDateString() };
    const updated = [...logs, entry];
    setLogs(updated);
    try { await window.storage.set("logs", JSON.stringify(updated)); } catch (e) { console.error(e); }
  };

  const addWeight = async (value) => {
    const entry = { date: new Date().toLocaleDateString(), value };
    const updated = [...weightLog, entry];
    setWeightLog(updated);
    try { await window.storage.set("weightLog", JSON.stringify(updated)); } catch (e) { console.error(e); }
  };

  const resetAll = async () => {
    setLogs([]); setWeightLog([]);
    try { await window.storage.delete("logs"); } catch (e) {}
    try { await window.storage.delete("weightLog"); } catch (e) {}
  };

  if (!ready) {
    return (
      <div className="forge-root min-h-screen flex items-center justify-center">
        <Tokens />
        <Loader2 className="animate-spin" color="var(--accent)" />
      </div>
    );
  }

  if (!profile) return <Onboarding onDone={saveProfile} />;

  const split = buildSplit(Number(profile.days), profile.equipment);
  const streak = Math.min(logs.length, 30) > 0 ? new Set(logs.map(l => l.date)).size : 0;

  return (
    <div className="forge-root min-h-screen">
      <Tokens />
      <header className="sticky top-0 z-10" style={{ background: "rgba(20,21,25,0.92)", backdropFilter: "blur(6px)", borderBottom: "1px solid var(--line)" }}>
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame size={20} color="var(--accent)" />
            <span className="display" style={{ fontSize: 22 }}>FORGE</span>
          </div>
          <div className="flex items-center gap-1 muted-text" style={{ fontSize: 12 }}>
            <User size={14} /> {profile.name}
          </div>
        </div>
        <nav className="max-w-5xl mx-auto px-4 flex gap-5 overflow-x-auto scrollbar-thin">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`tab-item flex items-center gap-1.5 py-2.5 text-sm ${tab === t.id ? "active" : ""}`}>
              <t.icon size={14} /> {t.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {tab === "dashboard" && <Dashboard profile={profile} split={split} logsCount={logs.length} streak={streak} onGoto={setTab} />}
        {tab === "workouts" && <Workouts split={split} onLog={addLog} />}
        {tab === "muscles" && <MuscleGroups />}
        {tab === "nutrition" && <Nutrition profile={profile} />}
        {tab === "coach" && <Coach profile={profile} />}
        {tab === "progress" && <Progress logs={logs} weightLog={weightLog} onAddWeight={addWeight} onReset={resetAll} />}
      </main>
    </div>
  );
}
