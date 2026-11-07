"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Fingerprint,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";

function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${minutes}:${String(remaining).padStart(2, "0")}`;
}

export default function ResultScreen() {
  const router = useRouter();
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/results/current", { cache: "no-store" })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error ?? "Không thể tải kết quả.");
        if (active) setResult(payload);
      })
      .catch((error) => {
        if (active) setErrorMessage(error.message);
      });
    return () => {
      active = false;
    };
  }, []);

  async function resetAndPlayAgain() {
    setIsResetting(true);
    try {
      const response = await fetch("/api/sessions/reset", { method: "POST" });
      if (!response.ok) throw new Error("Không thể kết thúc lượt chơi này.");
      router.push("/register");
    } catch (error) {
      setErrorMessage(error.message);
      setIsResetting(false);
    }
  }

  if (!result) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#050a13] px-5 text-slate-100">
        <p aria-live="polite" className="text-center text-sm text-cyan-100/80">
          {errorMessage || "ĐANG TỔNG HỢP KẾT QUẢ..."}
          {errorMessage && (
            <Link className="mt-4 block text-cyan-200 underline" href="/register">
              Bắt đầu lượt chơi mới
            </Link>
          )}
        </p>
      </main>
    );
  }

  const isComplete = result.status === "completed" && result.completedStages === 4;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050a13] px-5 py-8 text-slate-100 sm:px-8 sm:py-12">
      <div aria-hidden="true" className="ambient ambient-left" />
      <div aria-hidden="true" className="grid-overlay" />
      <section className="relative z-10 mx-auto w-full max-w-3xl pb-12 pt-6">
        <p className="text-center font-mono text-[10px] tracking-[0.2em] text-cyan-200/65">
          DATA TRAP / MISSION DEBRIEF
        </p>
        <div className="identity-core mx-auto mt-7 grid h-24 w-24 place-items-center rounded-full border border-cyan-100/35 bg-cyan-200/[0.04] text-cyan-100">
          {isComplete ? (
            <ShieldCheck aria-hidden="true" size={49} strokeWidth={1.2} />
          ) : (
            <Fingerprint aria-hidden="true" size={49} strokeWidth={1.2} />
          )}
        </div>
        <h1 className="mt-7 text-center text-4xl font-black tracking-[-0.06em] text-white sm:text-6xl">
          {isComplete ? "IDENTITY SECURED." : "MISSION ENDED."}
        </h1>
        <p className="mt-3 text-center text-sm text-slate-400">
          {isComplete
            ? `Chúc mừng ${result.fullName} — ${result.className}. Bạn đã hoàn thành hành trình.`
            : `${result.fullName} — ${result.className}, phiên chơi đã hết giờ. Bài học bạn nhận được vẫn có giá trị.`}
        </p>

        <div className="mt-9 border border-cyan-200/20 bg-[#091321]/90 p-6 text-center sm:p-9">
          <Sparkles aria-hidden="true" className="mx-auto text-cyan-200" size={22} />
          <p className="mt-4 font-mono text-[9px] tracking-[0.19em] text-cyan-200/60">
            YOUR ACHIEVEMENT
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-[0.04em] text-cyan-100 sm:text-3xl">
            {result.achievement.title}
          </h2>
          <p className="mt-2 text-xs text-slate-400">{result.achievement.description}</p>
          <div className="mt-7 font-mono text-5xl font-bold tracking-tight text-white">
            {result.score}
            <span className="ml-2 text-sm tracking-[0.15em] text-cyan-200">XP</span>
          </div>
          <p className="mt-2 font-mono text-[9px] tracking-[0.15em] text-slate-600">
            CHARACTER // {result.characterName} · {result.persona}
          </p>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            [Target, "NHIỆM VỤ", `${result.completedStages}/4`],
            [CheckCircle2, "QUYẾT ĐỊNH ĐÚNG", `${result.correctAnswers}/${result.completedStages}`],
            [ShieldCheck, "CHÍNH XÁC", `${result.accuracy}%`],
            [Clock3, "THỜI GIAN", formatDuration(result.duration)],
          ].map(([Icon, label, value]) => (
            <article className="border border-white/[0.08] bg-white/[0.025] p-4" key={label}>
              <Icon aria-hidden="true" className="text-cyan-200/70" size={17} />
              <p className="mt-4 font-mono text-[8px] tracking-[0.1em] text-slate-600">{label}</p>
              <p className="mt-1 text-lg font-semibold text-white">{value}</p>
            </article>
          ))}
        </div>

        <div className="mt-5 border-l border-cyan-200/30 px-4 py-2">
          <p className="text-sm leading-6 text-slate-300">
            Danh tính số được tạo từ nhiều mảnh thông tin. Hãy cân nhắc mục đích
            trước khi chia sẻ, giới hạn quyền ứng dụng và xác minh yêu cầu qua
            kênh chính thức.
          </p>
          <p className="mt-2 text-[10px] leading-5 text-slate-600">
            Nội dung là mô phỏng giáo dục, không thay thế tư vấn pháp lý. Căn cứ
            điều khoản cho từng tình huống cần chuyên gia pháp lý rà soát.
          </p>
        </div>

        <p aria-live="polite" className="mt-3 min-h-5 text-center text-xs text-rose-300">
          {errorMessage}
        </p>
        <button
          className="group mt-3 flex min-h-14 w-full items-center justify-center gap-3 bg-cyan-300 px-5 font-mono text-xs font-bold tracking-[0.14em] text-[#06101b] transition hover:bg-cyan-200 disabled:opacity-60"
          disabled={isResetting}
          onClick={resetAndPlayAgain}
          type="button"
        >
          <RotateCcw aria-hidden="true" size={15} />
          {isResetting ? "ĐANG XÓA DỮ LIỆU LƯỢT TRƯỚC..." : "KẾT THÚC & BẮT ĐẦU LƯỢT MỚI"}
          {!isResetting && <ArrowRight aria-hidden="true" size={15} />}
        </button>
        <p className="mt-3 text-center font-mono text-[9px] tracking-[0.1em] text-slate-600">
          LƯỢT TRƯỚC SẼ ĐƯỢC XÓA NGAY TRƯỚC KHI BẮT ĐẦU LẠI
        </p>
      </section>
    </main>
  );
}
