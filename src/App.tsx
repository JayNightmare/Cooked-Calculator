import { useState, useEffect } from "react";
import {
    useCookedScore,
    type Degree,
    type Grade,
    type PostGrad,
} from "./hooks/useCookedScore";

function App() {
    const [degrees, setDegrees] = useState<Degree[]>([]);
    const [selectedDegree, setSelectedDegree] = useState<Degree | null>(null);
    const [grade, setGrade] = useState<Grade>("2:1");
    const [postGrad, setPostGrad] = useState<PostGrad>("None");

    const score = useCookedScore(selectedDegree, grade, postGrad);
    const percentage = Math.round(score * 100);

    useEffect(() => {
        fetch(`${import.meta.env.BASE_URL}degrees.json`)
            .then((res) => res.json())
            .then((data) => setDegrees(data))
            .catch((err) => console.error("Failed to load degrees", err));
    }, []);

    const getTier = (p: number) => {
        if (p >= 80)
            return {
                name: "Burnt",
                color: "bg-red-600",
                text: "You are absolutely cooked. Start learning to weld.",
            };
        if (p >= 50)
            return {
                name: "Well Done",
                color: "bg-orange-500",
                text: "It’s looking crispy. Have a backup plan.",
            };
        if (p >= 20)
            return {
                name: "Medium Rare",
                color: "bg-yellow-500",
                text: "Simmering. You might survive with upskilling.",
            };
        return {
            name: "Raw",
            color: "bg-green-500",
            text: "Still raw. You’re safe... for now.",
        };
    };

    const tier = getTier(percentage);
    const tierTextColor = tier.color.replace("bg-", "text-");

    return (
        <div className="min-h-screen bg-slate-900 text-gray-100 flex flex-col items-center py-12 px-4 font-sans selection:bg-orange-500 selection:text-white">
            <div className="max-w-2xl w-full space-y-8">
                <div className="text-center space-y-4">
                    <h1 className="text-5xl font-extrabold text-red-600 drop-shadow-sm">
                        The Cooked Calculator
                    </h1>
                    <p className="text-xl text-gray-400 font-light">
                        Discover your likelihood of being replaced by an LLM.
                    </p>
                </div>

                <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700/50 space-y-6 backdrop-blur-sm">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300 uppercase tracking-wider">
                            Degree Subject
                        </label>
                        <select
                            title="Select your degree subject"
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-200"
                            onChange={(e) => {
                                const deg =
                                    degrees.find(
                                        (d) => d.subject === e.target.value
                                    ) || null;
                                setSelectedDegree(deg);
                            }}
                            value={selectedDegree?.subject || ""}
                        >
                            <option value="">Select your degree...</option>
                            {degrees.map((d) => (
                                <option key={d.subject} value={d.subject}>
                                    {d.subject}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-300 uppercase tracking-wider">
                                University Grade
                            </label>
                            <select
                                title="Select your university grade"
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-200"
                                value={grade}
                                onChange={(e) =>
                                    setGrade(e.target.value as Grade)
                                }
                            >
                                <option value="First">First Class / 4.0</option>
                                <option value="2:1">2:1 (Upper Second)</option>
                                <option value="2:2">2:2 (Lower Second)</option>
                                <option value="Third">Third Class</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-300 uppercase tracking-wider">
                                Post-Grad Status
                            </label>
                            <select
                                title="Select your post-grad status"
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all duration-200"
                                value={postGrad}
                                onChange={(e) =>
                                    setPostGrad(e.target.value as PostGrad)
                                }
                            >
                                <option value="None">None</option>
                                <option value="Masters">Masters</option>
                                <option value="PhD">PhD</option>
                            </select>
                        </div>
                    </div>
                </div>

                {selectedDegree && (
                    <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700/50 text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-gray-200">
                                Cooked Score
                            </h2>
                            <div className="text-7xl font-black text-white tracking-tight">
                                {percentage}%
                            </div>
                            <div
                                className={`text-2xl font-bold ${tierTextColor}`}
                            >
                                {tier.name}
                            </div>
                        </div>

                        <div className="w-full bg-slate-900 rounded-full h-6 p-1 border border-slate-700 shadow-inner">
                            <div
                                className={`h-full rounded-full transition-all duration-1000 ease-out ${tier.color}`}
                                style={{ width: `${percentage}%` }}
                            />
                        </div>

                        <div className="bg-slate-700/30 p-6 rounded-xl border border-slate-600/50 backdrop-blur-md">
                            <p className="text-lg italic text-gray-300 font-serif">
                                "{tier.text}"
                            </p>
                        </div>
                    </div>
                )}

                <footer className="text-center text-gray-500 text-sm pt-8">
                    Made with anxiety and React.
                </footer>
            </div>
        </div>
    );
}

export default App;
