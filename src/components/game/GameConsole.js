"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Clock3,
  Fingerprint,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import RpgConsole from "@/components/game/RpgConsole";

function ChoicePanel({ mission, selected, onToggle, disabled }) {
  const singleChoice = mission.answerMode === "single";
  return (
    <div
      className="grid gap-3 sm:grid-cols-2"
      role={singleChoice ? "group" : undefined}
      aria-label={singleChoice ? "Chọn một hành động" : undefined}
    >
      {mission.options.map((option, index) => {
        const isSelected = selected.includes(option.id);
        return (
          <button
            aria-pressed={isSelected}
            className={`min-h-[92px] border p-4 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200 disabled:cursor-default ${
              isSelected
                ? "border-cyan-200/70 bg-cyan-200/[0.09] shadow-[inset_0_0_24px_rgba(34,211,238,0.04)]"
                : "border-white/[0.09] bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.05]"
            }`}
            disabled={disabled}
            key={option.id}
            onClick={() => onToggle(option.id)}
            type="button"
          >
            <span className="flex items-start gap-3">
              <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center border ${singleChoice ? "rounded-full" : ""} ${isSelected ? "border-cyan-200 bg-cyan-200 text-slate-950" : "border-slate-600 text-transparent"}`}>
                {isSelected && <Check aria-hidden="true" size={13} />}
              </span>
              <span>
                <span className="block text-sm font-medium text-slate-100">
                  <span className="mr-2 font-mono text-[9px] text-slate-600">0{index + 1}</span>
                  {option.label}
                </span>
                <span className="mt-1 block text-xs leading-5 text-slate-500">
                  {option.detail}
                </span>
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

function FeedbackCard({ feedback }) {
  const Icon = feedback.isCorrect ? Check : AlertTriangle;
  return (
    <section className={`mt-6 border p-5 ${feedback.isCorrect ? "border-emerald-200/25 bg-emerald-200/[0.045]" : "border-amber-200/20 bg-amber-200/[0.035]"}`}>
      <div className="flex items-start gap-3">
        <Icon aria-hidden="true" className={feedback.isCorrect ? "text-emerald-200" : "text-amber-200"} size={19} />
        <div className="min-w-0">
          <h2 className="font-mono text-xs font-bold tracking-[0.13em] text-white">
            {feedback.isCorrect ? "IDENTITY SECURED" : "RISK DETECTED — LEARN & ADAPT"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">{feedback.explanation}</p>
          <p className="mt-3 border-l border-cyan-200/35 pl-3 text-xs leading-5 text-slate-400">
            <strong className="font-semibold text-cyan-100">BÀI HỌC · </strong>
            {feedback.lesson}
          </p>
          <a
            className="mt-3 block text-[10px] leading-5 text-slate-400 underline decoration-cyan-200/30 underline-offset-2 hover:text-cyan-100"
            href="https://vanban.chinhphu.vn/?classid=1&docid=214590&pageid=27160&typegroup="
            rel="noreferrer"
            target="_blank"
          >
            {feedback.legalBasis} · Mở văn bản chính thức ↗
          </a>
          {feedback.legalReviewRequired && (
            <p className="mt-2 font-mono text-[9px] tracking-[0.07em] text-amber-200/60">
              CĂN CỨ ĐIỀU KHOẢN CỤ THỂ CẦN CHUYÊN GIA PHÁP LÝ RÀ SOÁT
            </p>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="font-mono text-[10px] tracking-[0.1em] text-cyan-100">
              +{feedback.points} XP
            </span>
            {!feedback.isCorrect && (
              <span className="text-xs text-slate-500">
                Hướng xử lý tốt hơn: {feedback.correctAnswer.join(", ")}
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function GameConsole() {
  const router = useRouter();
  const [game, setGame] = useState(null);
  const [selected, setSelected] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadGame = useCallback(async () => {
    const response = await fetch("/api/game/current", { cache: "no-store" });
    const result = await response.json();
    if (response.status === 401) {
      router.replace("/register");
      return;
    }
    if (response.status === 410) {
      router.replace("/result");
      return;
    }
    if (!response.ok) {
      throw new Error(result.error ?? "Không thể tải nhiệm vụ.");
    }
    if (result.status === "registered") {
      router.replace("/briefing");
      return;
    }
    if (result.status === "completed" || result.status === "expired") {
      router.replace("/result");
      return;
    }
    return result;
  }, [router]);

  const refreshGame = useCallback(async () => {
    const result = await loadGame();
    if (result) {
      setGame(result);
      setSecondsLeft(
        Math.max(
          0,
          Math.ceil((new Date(result.expiresAt) - Date.now()) / 1000),
        ),
      );
    }
    return result;
  }, [loadGame]);

  useEffect(() => {
    let active = true;
    loadGame()
      .then((result) => {
        if (active && result) {
          setGame(result);
          setSecondsLeft(
            Math.max(
              0,
              Math.ceil((new Date(result.expiresAt) - Date.now()) / 1000),
            ),
          );
        }
      })
      .catch((error) => {
        if (active) setErrorMessage(error.message);
      });
    return () => {
      active = false;
    };
  }, [loadGame]);

  useEffect(() => {
    if (!game?.expiresAt) return undefined;
    const timer = window.setInterval(() => {
      const remaining = Math.max(0, Math.ceil((new Date(game.expiresAt) - Date.now()) / 1000));
      setSecondsLeft(remaining);
      if (remaining === 0) {
        window.clearInterval(timer);
        fetch("/api/game/finish", { method: "POST" })
          .then(async (response) => {
            if (response.ok) {
              router.replace("/result");
              return;
            }
            const result = await response.json();
            if (response.status === 409) {
              router.replace("/result");
              return;
            }
            throw new Error(result.error ?? "Không thể kết thúc phiên chơi.");
          })
          .catch((error) => setErrorMessage(error.message));
      }
    }, 1000);
    return () => window.clearInterval(timer);
  }, [game?.expiresAt, router]);

  if (game?.gameVersion === "rpg-v2") {
    return (
      <RpgConsole
        game={game}
        key={game.rpg.stage}
        onRefresh={refreshGame}
        secondsLeft={secondsLeft ?? 0}
      />
    );
  }

  const mission = game?.mission;

  function toggleChoice(id) {
    if (feedback) return;
    if (mission?.answerMode === "single") {
      setSelected([id]);
      return;
    }
    setSelected((current) =>
      current.includes(id)
        ? current.filter((choice) => choice !== id)
        : [...current, id],
    );
  }

  async function submitAnswer() {
    if (!mission || selected.length === 0 || isSubmitting) return;
    setIsSubmitting(true);
    setErrorMessage("");
    try {
      const response = await fetch("/api/game/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: mission.stage, choice: selected }),
      });
      const result = await response.json();
      if (response.status === 409 || response.status === 410) {
        router.replace("/result");
        return;
      }
      if (!response.ok) {
        throw new Error(result.error ?? "Không thể gửi câu trả lời.");
      }
      setFeedback(result);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function continueMission() {
    if (feedback?.completed) {
      router.replace("/result");
      return;
    }
    setFeedback(null);
    setSelected([]);
    try {
      const nextGame = await loadGame();
      if (nextGame) {
        setGame(nextGame);
        setSecondsLeft(
          Math.max(
            0,
            Math.ceil((new Date(nextGame.expiresAt) - Date.now()) / 1000),
          ),
        );
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  if (!game || !mission) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#050a13] px-5 text-slate-100">
        <p aria-live="polite" className="max-w-md text-center text-sm text-cyan-100/80">
          {errorMessage || "ĐANG KẾT NỐI VỚI BẢNG ĐIỀU KHIỂN NHIỆM VỤ..."}
        </p>
      </main>
    );
  }

  const progress = (mission.stage / 4) * 100;
  const timerText = `${String(Math.floor((secondsLeft ?? 0) / 60)).padStart(2, "0")}:${String((secondsLeft ?? 0) % 60).padStart(2, "0")}`;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050a13] px-4 py-5 text-slate-100 sm:px-7 sm:py-8">
      <div aria-hidden="true" className="ambient ambient-left" />
      <div aria-hidden="true" className="grid-overlay" />
      <header className="relative z-10 mx-auto flex w-full max-w-5xl items-center justify-between">
        <a className="font-mono text-xs font-bold tracking-[0.2em] text-white" href="/character">
          DATA<span className="text-cyan-300">TRAP</span>
        </a>
        <div className={`flex items-center gap-2 border px-3 py-2 font-mono text-[10px] tracking-[0.1em] ${secondsLeft < 60 ? "border-rose-200/30 text-rose-200" : "border-white/10 text-cyan-100/80"}`}>
          <Clock3 aria-hidden="true" size={14} />
          {timerText}
        </div>
      </header>

      <section className="relative z-10 mx-auto w-full max-w-5xl pb-12 pt-9">
        <div className="flex items-center justify-between gap-4 font-mono text-[9px] tracking-[0.13em] text-slate-500">
          <span>MISSION {String(mission.stage).padStart(2, "0")} / 04</span>
          <span className="flex items-center gap-2">
            <LockKeyhole aria-hidden="true" size={13} />
            IDENTITY INTEGRITY <strong className="text-cyan-100">{game.score} XP</strong>
          </span>
        </div>
        <div className="mt-3 h-1 w-full bg-white/[0.07]">
          <div className="h-full bg-cyan-200 transition-[width] duration-700" style={{ width: `${progress}%` }} />
        </div>

        <div className="mt-9 grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
          <aside className="h-fit border border-cyan-200/15 bg-[#091321]/85 p-5 sm:p-6">
            <p className="font-mono text-[9px] tracking-[0.16em] text-cyan-200/65">
              {mission.subtitle}
            </p>
            <h1 className="mt-3 text-2xl font-black tracking-[-0.04em] text-white sm:text-3xl">
              {mission.title}
            </h1>
            <div className="my-5 h-px bg-cyan-200/10" />
            <p className="text-sm leading-6 text-slate-300">{mission.story}</p>
            <p className="mt-4 border-l border-cyan-200/30 pl-3 text-xs leading-5 text-slate-500">
              {mission.scenario}
            </p>
            {mission.interactionType === "chat" && (
              <div className="mt-5 border border-white/[0.08] bg-[#050a13] p-4">
                <p className="font-mono text-[9px] text-slate-600">INBOX // UNKNOWN SENDER</p>
                <p className="mt-3 rounded-sm bg-rose-300/[0.06] p-3 text-xs leading-5 text-rose-100/80">
                  “Chào {game.character?.name ?? "bạn"}, {game.character?.persona ?? "người chơi"}. Tài khoản của bạn sắp bị khóa! Gửi mật khẩu và mã xác thực để nhận vật phẩm ngay.”
                </p>
                <p className="mt-2 font-mono text-[8px] tracking-[0.08em] text-slate-600">
                  TIN NHẮN MÔ PHỎNG · KHÔNG CÓ LIÊN KẾT THẬT
                </p>
              </div>
            )}
            <p className="mt-5 flex items-center gap-2 font-mono text-[9px] tracking-[0.1em] text-cyan-100/55">
              <Fingerprint aria-hidden="true" size={14} />
              DATA GUARDIAN PROTOCOL
            </p>
          </aside>

          <div className="border border-white/[0.08] bg-[#08111e]/90 p-5 sm:p-7">
            <div className="mb-5">
              <p className="font-mono text-[9px] tracking-[0.15em] text-cyan-200/65">
                {mission.interactionType.replaceAll("-", " ").toUpperCase()}
              </p>
              <h2 className="mt-3 text-lg font-semibold leading-7 text-white">
                {mission.interactionPrompt}
              </h2>
              <p className="mt-2 text-xs text-slate-500">
                {mission.answerMode === "single"
                  ? "Chạm để chọn một cách xử lý."
                  : "Chạm để chọn hoặc bỏ chọn. Có thể chọn nhiều phương án."}
              </p>
            </div>

            <ChoicePanel
              disabled={Boolean(feedback)}
              mission={mission}
              onToggle={toggleChoice}
              selected={selected}
            />
            <p aria-live="polite" className="mt-3 min-h-5 text-xs text-rose-300">
              {errorMessage}
            </p>

            {feedback ? (
              <>
                <FeedbackCard feedback={feedback} />
                <button
                  className="mt-5 flex min-h-13 w-full items-center justify-center gap-3 bg-cyan-300 px-5 font-mono text-xs font-bold tracking-[0.14em] text-[#06101b] transition hover:bg-cyan-200"
                  onClick={continueMission}
                  type="button"
                >
                  {feedback.completed ? "XEM KẾT QUẢ" : "TIẾP TỤC NHIỆM VỤ"}
                  <ArrowRight aria-hidden="true" size={15} />
                </button>
              </>
            ) : (
              <button
                className="mt-4 flex min-h-13 w-full items-center justify-center gap-3 border border-cyan-200/40 bg-cyan-200 px-5 font-mono text-xs font-bold tracking-[0.14em] text-[#06101b] transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-40"
                disabled={selected.length === 0 || isSubmitting}
                onClick={submitAnswer}
                type="button"
              >
                {isSubmitting ? "ĐANG PHÂN TÍCH..." : "XÁC NHẬN QUYẾT ĐỊNH"}
                <ShieldCheck aria-hidden="true" size={16} />
              </button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
