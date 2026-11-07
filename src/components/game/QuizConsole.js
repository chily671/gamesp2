"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Clock3,
  Fingerprint,
  ShieldCheck,
} from "lucide-react";

function ChoicePanel({ question, selected, onToggle, disabled }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {question.options.map((option, index) => {
        const isSelected = selected.includes(option.id);
        return (
          <button
            aria-pressed={isSelected}
            className={`min-h-[88px] border p-4 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200 disabled:cursor-default ${
              isSelected
                ? "border-cyan-200/70 bg-cyan-200/[0.09]"
                : "border-white/[0.09] bg-white/[0.025] hover:border-white/20"
            }`}
            disabled={disabled}
            key={option.id}
            onClick={() => onToggle(option.id)}
            type="button"
          >
            <span className="flex items-start gap-3">
              <span
                className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center border ${
                  question.answerMode === "single" ? "rounded-full" : ""
                } ${
                  isSelected
                    ? "border-cyan-200 bg-cyan-200 text-slate-950"
                    : "border-slate-600 text-transparent"
                }`}
              >
                {isSelected && <Check aria-hidden="true" size={13} />}
              </span>
              <span>
                <span className="block text-sm font-medium text-slate-100">
                  <span className="mr-2 font-mono text-[9px] text-slate-600">
                    {String(index + 1).padStart(2, "0")}
                  </span>
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

export default function QuizConsole({
  game,
  onRefresh,
  secondsLeft,
}) {
  const router = useRouter();
  const { questionIndex, questionCount, question } = game.quiz;
  const [selected, setSelected] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const progress = ((questionIndex + 1) / questionCount) * 100;
  const timerText = `${String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:${String(secondsLeft % 60).padStart(2, "0")}`;

  function toggleChoice(id) {
    if (feedback) return;
    if (question.answerMode === "single") {
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
    if (selected.length === 0 || isSubmitting) return;
    setIsSubmitting(true);
    setErrorMessage("");
    try {
      const response = await fetch("/api/game/quiz/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionIndex,
          questionCode: question.questionCode,
          choice: selected,
        }),
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

  async function continueQuiz() {
    if (feedback?.completed) {
      router.replace("/result");
      return;
    }
    setErrorMessage("");
    try {
      const nextGame = await onRefresh();
      if (!nextGame?.quiz?.question) {
        throw new Error("Không tải được câu hỏi tiếp theo.");
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050a13] px-4 py-5 text-slate-100 sm:px-7 sm:py-8">
      <div aria-hidden="true" className="ambient ambient-left" />
      <div aria-hidden="true" className="grid-overlay" />
      <header className="relative z-10 mx-auto flex w-full max-w-5xl items-center justify-between">
        <a
          className="font-mono text-xs font-bold tracking-[0.16em] text-white"
          href="/character"
        >
          KHÔNG GIAN <span className="text-cyan-300">2</span>
        </a>
        <div
          className={`flex items-center gap-2 border px-3 py-2 font-mono text-[10px] tracking-[0.1em] ${
            secondsLeft < 60
              ? "border-rose-200/30 text-rose-200"
              : "border-white/10 text-cyan-100/80"
          }`}
        >
          <Clock3 aria-hidden="true" size={14} />
          {timerText}
        </div>
      </header>

      <section className="relative z-10 mx-auto w-full max-w-5xl pb-12 pt-9">
        <div className="flex items-center justify-between gap-4 font-mono text-[9px] tracking-[0.13em] text-slate-500">
          <span>
            CÂU {String(questionIndex + 1).padStart(2, "0")} / {String(questionCount).padStart(2, "0")}
          </span>
          <span className="flex items-center gap-2">
            <Fingerprint aria-hidden="true" size={13} />
            {game.character?.name ?? "NGƯỜI CHƠI"} ·{" "}
            <strong className="text-cyan-100">{game.score} XP</strong>
          </span>
        </div>
        <div
          aria-label={`Tiến độ ${questionIndex + 1} trên ${questionCount}`}
          className="mt-3 h-1 w-full bg-white/[0.07]"
          role="progressbar"
          aria-valuemax={questionCount}
          aria-valuemin={0}
          aria-valuenow={questionIndex + 1}
        >
          <div
            className="h-full bg-cyan-200 transition-[width] duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-9 grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
          <aside className="h-fit border border-cyan-200/15 bg-[#091321]/85 p-5 sm:p-6">
            <p className="font-mono text-[9px] tracking-[0.16em] text-cyan-200/65">
              {question.title}
            </p>
            <h1 className="mt-4 text-2xl font-black tracking-[-0.04em] text-white sm:text-3xl">
              TÌNH HUỐNG ĐIỀU TRA
            </h1>
            <div className="my-5 h-px bg-cyan-200/10" />
            <p className="text-sm leading-6 text-slate-300">{question.story}</p>
            <p className="mt-4 border-l border-cyan-200/30 pl-3 text-xs leading-5 text-slate-500">
              {question.scenario}
            </p>
            {game.character?.persona && (
              <p className="mt-5 border border-white/[0.08] bg-[#050a13] p-3 font-mono text-[9px] leading-5 text-slate-500">
                PERSONA // {game.character.persona}
              </p>
            )}
          </aside>

          <div className="border border-white/[0.08] bg-[#08111e]/90 p-5 sm:p-7">
            <div className="mb-5">
              <p className="font-mono text-[9px] tracking-[0.15em] text-cyan-200/65">
                {question.answerMode === "single"
                  ? "CHỌN MỘT PHƯƠNG ÁN"
                  : "CHỌN MỘT HOẶC NHIỀU PHƯƠNG ÁN"}
              </p>
              <h2 className="mt-3 text-lg font-semibold leading-7 text-white">
                {question.interactionPrompt}
              </h2>
            </div>

            <ChoicePanel
              disabled={Boolean(feedback)}
              onToggle={toggleChoice}
              question={question}
              selected={selected}
            />
            <p aria-live="polite" className="mt-3 min-h-5 text-xs text-rose-300">
              {errorMessage}
            </p>

            {feedback ? (
              <section
                className={`mt-5 border p-5 ${
                  feedback.isCorrect
                    ? "border-emerald-200/25 bg-emerald-200/[0.045]"
                    : "border-amber-200/20 bg-amber-200/[0.035]"
                }`}
              >
                <div className="flex items-start gap-3">
                  {feedback.isCorrect ? (
                    <Check
                      aria-hidden="true"
                      className="text-emerald-200"
                      size={19}
                    />
                  ) : (
                    <AlertTriangle
                      aria-hidden="true"
                      className="text-amber-200"
                      size={19}
                    />
                  )}
                  <div className="min-w-0">
                    <h2 className="font-mono text-xs font-bold tracking-[0.13em] text-white">
                      {feedback.isCorrect ? "RISK CONTROLLED" : "REVIEW THE SIGNAL"}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      {feedback.explanation}
                    </p>
                    <p className="mt-3 border-l border-cyan-200/35 pl-3 text-xs leading-5 text-slate-400">
                      <strong className="font-semibold text-cyan-100">
                        BÀI HỌC ·{" "}
                      </strong>
                      {feedback.lesson}
                    </p>
                    <p className="mt-3 font-mono text-[9px] text-slate-500">
                      ĐIỀU ĐƯỢC ĐỐI CHIẾU ·{" "}
                      {feedback.legalArticles
                        .map((article) => `Điều ${article}`)
                        .join(" · ")}
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
                        CẦN CHUYÊN GIA RÀ SOÁT ĐIỀU KHOẢN CỤ THỂ
                      </p>
                    )}
                    <p className="mt-3 font-mono text-[10px] text-cyan-100">
                      +{feedback.points} XP
                      {!feedback.isCorrect &&
                        ` · Đáp án phù hợp hơn: ${feedback.correctAnswer.join(", ")}`}
                    </p>
                  </div>
                </div>
              </section>
            ) : (
              <button
                className="mt-4 flex min-h-13 w-full items-center justify-center gap-3 border border-cyan-200/40 bg-cyan-200 px-5 font-mono text-xs font-bold tracking-[0.14em] text-[#06101b] transition hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-40"
                disabled={selected.length === 0 || isSubmitting}
                onClick={submitAnswer}
                type="button"
              >
                {isSubmitting ? "ĐANG PHÂN TÍCH..." : "GỬI QUYẾT ĐỊNH"}
                <ShieldCheck aria-hidden="true" size={16} />
              </button>
            )}
            {feedback && (
              <button
                className="mt-4 flex min-h-13 w-full items-center justify-center gap-3 bg-cyan-300 px-5 font-mono text-xs font-bold tracking-[0.14em] text-[#06101b] transition hover:bg-cyan-200"
                onClick={continueQuiz}
                type="button"
              >
                {feedback.completed ? "XEM KẾT QUẢ" : "CÂU TIẾP THEO"}
                <ArrowRight aria-hidden="true" size={15} />
              </button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
