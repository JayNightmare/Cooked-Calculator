import { useState, useEffect } from "react";
import {
    useCookedScore,
    type Degree,
    type Grade,
    type PostGrad,
} from "./hooks/useCookedScore";

// Icons
const BookOpenIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
);
const AwardIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <circle cx="12" cy="8" r="7" />
        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
);
const GraduationCapIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
);
const ShareIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        <polyline points="16 6 12 2 8 6" />
        <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
);
const LoaderIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-spin"
    >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
);

function App() {
    const [degrees, setDegrees] = useState<Degree[]>([]);
    const [selectedDegree, setSelectedDegree] = useState<Degree | null>(null);
    const [grade, setGrade] = useState<Grade>("2:1");
    const [postGrad, setPostGrad] = useState<PostGrad>("None");
    const [isCalculating, setIsCalculating] = useState(false);
    const [showResult, setShowResult] = useState(false);

    const score = useCookedScore(selectedDegree, grade, postGrad);
    const percentage = Math.round(score * 100);

    useEffect(() => {
        fetch(`${import.meta.env.BASE_URL}degrees.json`)
            .then((res) => res.json())
            .then((data) => setDegrees(data))
            .catch((err) => console.error("Failed to load degrees", err));
    }, []);

    useEffect(() => {
        if (isCalculating) {
            const timer = setTimeout(() => {
                setIsCalculating(false);
                setShowResult(true);
            }, 1000 + Math.random() * 800); // Random delay for dramatic effect
            return () => clearTimeout(timer);
        }
    }, [isCalculating]);

    const getTier = (p: number) => {
        if (p >= 80)
            return {
                name: "Burnt",
                color: "bg-red-600",
                text: "You are absolutely cooked. Start learning to weld.",
                glow: "shadow-[0_0_30px_rgba(220,38,38,0.6)]",
            };
        if (p >= 50)
            return {
                name: "Well Done",
                color: "bg-orange-500",
                text: "It’s looking crispy. Have a backup plan.",
                glow: "shadow-[0_0_30px_rgba(249,115,22,0.6)]",
            };
        if (p >= 20)
            return {
                name: "Medium Rare",
                color: "bg-yellow-500",
                text: "Simmering. You might survive with upskilling.",
                glow: "shadow-[0_0_30px_rgba(234,179,8,0.6)]",
            };
        return {
            name: "Raw",
            color: "bg-green-500",
            text: "Still raw. You’re safe... for now.",
            glow: "shadow-[0_0_30px_rgba(34,197,94,0.6)]",
        };
    };

    const tier = getTier(percentage);
    const tierTextColor = tier.color.replace("bg-", "text-");

    const handleShare = () => {
        const text = `I'm ${percentage}% cooked. ${tier.text} Check your own fate:`;
        if (navigator.share) {
            navigator
                .share({
                    title: "The Cooked Calculator",
                    text: text,
                    url: window.location.href,
                })
                .catch(console.error);
        } else {
            navigator.clipboard.writeText(`${text} ${window.location.href}`);
            alert("Result copied to clipboard!");
        }
    };

    return (
        <div className="min-h-screen text-gray-100 flex flex-col items-center py-12 px-4 selection:bg-orange-500 selection:text-white overflow-x-hidden">
            <div className="max-w-2xl w-full space-y-10 z-10">
                <div className="text-center space-y-4">
                    <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600 drop-shadow-sm tracking-tighter">
                        THE COOKED CALCULATOR
                    </h1>
                    <p className="text-xl text-gray-400 font-light tracking-wide">
                        Will AI take your job?{" "}
                        <span className="text-orange-500 font-medium">
                            Probably.
                        </span>
                    </p>
                </div>

                {/* Input Card */}
                <div className="bg-slate-800/50 p-8 rounded-3xl shadow-2xl border border-slate-700/50 space-y-8 backdrop-blur-xl transition-all duration-300 hover:border-slate-600/50">
                    <div className="space-y-6">
                        {/* Degree Select */}
                        <div className="space-y-2 group">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-400 uppercase tracking-widest group-focus-within:text-orange-500 transition-colors">
                                <BookOpenIcon /> Degree Subject
                            </label>
                            <div className="relative">
                                <select
                                    title="Select your degree subject"
                                    className="w-full bg-slate-900/80 border border-slate-700 rounded-2xl px-5 py-4 text-white text-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-200Appearance-none cursor-pointer hover:bg-slate-800"
                                    onChange={(e) => {
                                        const deg =
                                            degrees.find(
                                                (d) =>
                                                    d.subject === e.target.value
                                            ) || null;
                                        setSelectedDegree(deg);
                                        if (deg) {
                                            setIsCalculating(true);
                                            setShowResult(false);
                                        } else {
                                            setShowResult(false);
                                            setIsCalculating(false);
                                        }
                                    }}
                                    value={selectedDegree?.subject || ""}
                                >
                                    <option value="">
                                        Select your degree...
                                    </option>
                                    {degrees.map((d) => (
                                        <option
                                            key={d.subject}
                                            value={d.subject}
                                        >
                                            {d.subject}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                    ▼
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Grade Select */}
                            <div className="space-y-2 group">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-400 uppercase tracking-widest group-focus-within:text-orange-500 transition-colors">
                                    <AwardIcon /> Grade
                                </label>
                                <div className="relative">
                                    <select
                                        title="Select your university grade"
                                        className="w-full bg-slate-900/80 border border-slate-700 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-200 cursor-pointer hover:bg-slate-800"
                                        value={grade}
                                        onChange={(e) => {
                                            setGrade(e.target.value as Grade);
                                            if (selectedDegree) {
                                                setIsCalculating(true);
                                                setShowResult(false);
                                            }
                                        }}
                                    >
                                        <option value="First">
                                            First Class
                                        </option>
                                        <option value="2:1">
                                            2:1 (Upper Second)
                                        </option>
                                        <option value="2:2">
                                            2:2 (Lower Second)
                                        </option>
                                        <option value="Third">
                                            Third Class
                                        </option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                        ▼
                                    </div>
                                </div>
                            </div>

                            {/* Post-Grad Select */}
                            <div className="space-y-2 group">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-400 uppercase tracking-widest group-focus-within:text-orange-500 transition-colors">
                                    <GraduationCapIcon /> Post-Grad
                                </label>
                                <div className="relative">
                                    <select
                                        title="Select your post-grad status"
                                        className="w-full bg-slate-900/80 border border-slate-700 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-200 cursor-pointer hover:bg-slate-800"
                                        value={postGrad}
                                        onChange={(e) => {
                                            setPostGrad(
                                                e.target.value as PostGrad
                                            );
                                            if (selectedDegree) {
                                                setIsCalculating(true);
                                                setShowResult(false);
                                            }
                                        }}
                                    >
                                        <option value="None">None</option>
                                        <option value="Masters">Masters</option>
                                        <option value="PhD">PhD</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                        ▼
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Result Section */}
                <div className="relative min-h-[160px]">
                    {isCalculating && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-300">
                            <LoaderIcon />
                            <p className="text-orange-400 font-mono text-lg animate-pulse">
                                Running simulation...
                            </p>
                        </div>
                    )}

                    {!isCalculating && showResult && selectedDegree && (
                        <div className="bg-slate-800 p-8 rounded-3xl shadow-2xl border border-slate-700/50 text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 relative overflow-hidden group">
                            {/* Glow Effect */}
                            <div
                                className={`absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 ${tier.color} opacity-20 blur-[60px] pointer-events-none transition-all duration-1000`}
                            ></div>

                            <div className="space-y-2 z-10 relative">
                                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                                    Cooked Score
                                </h2>
                                <div
                                    className={`text-8xl font-black text-white tracking-tighter drop-shadow-lg ${tier.glow}`}
                                >
                                    {percentage}%
                                </div>
                                <div
                                    className={`text-3xl font-bold ${tierTextColor} tracking-tight`}
                                >
                                    {tier.name}
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full bg-slate-950 rounded-full h-8 p-1.5 border border-slate-800 shadow-inner">
                                <div
                                    className={`h-full rounded-full transition-all duration-1500 cubic-bezier(0.4, 0, 0.2, 1) ${tier.color} shadow-[0_0_15px_rgba(255,255,255,0.3)]`}
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>

                            {/* Quote & Pivot */}
                            <div className="space-y-4">
                                <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
                                    <p className="text-xl italic text-gray-300 font-serif leading-relaxed">
                                        "{tier.text}"
                                    </p>
                                </div>

                                {selectedDegree.careerPivot && (
                                    <div className="bg-orange-500/10 p-4 rounded-xl border border-orange-500/20">
                                        <p className="text-sm text-orange-200 font-medium">
                                            <span className="text-orange-500 font-bold uppercase tracking-wider block text-xs mb-1">
                                                Recommended Pivot
                                            </span>
                                            {selectedDegree.careerPivot}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-4 flex justify-center">
                                <button
                                    onClick={handleShare}
                                    className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-full text-white font-medium transition-all active:scale-95 group/btn"
                                >
                                    <ShareIcon /> Share Result
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <footer className="text-center text-gray-600 text-sm pt-12 pb-6">
                    Made with anxiety and React. Not financial or life advice.
                </footer>
            </div>
        </div>
    );
}

export default App;
