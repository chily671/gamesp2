"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Clock3, Fingerprint, Shield, Sparkles } from "lucide-react";

export default function Briefing() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    let active = true;

    fetch("/api/sessions/current", { cache: "no-store" })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error ?? "Phiên chơi đã hết hạn.");
        }
        if (active) {
          setPlayerName(`${result.player.fullName} — ${result.player.className}`);
        }
      })
      .catch((error) => {
        if (active) {
          setErrorMessage(error.message);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  async function startMission() {
    setIsStarting(true);
    setErrorMessage("");
    try {
      const response = await fetch("/api/game/start", { method: "POST" });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error ?? "Chưa thể bắt đầu nhiệm vụ.");
      }
      router.push("/game");
    } catch (error) {
      setErrorMessage(error.message);
      setIsStarting(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050a13] px-5 py-8 text-slate-100 sm:px-8 sm:py-12">
      <div aria-hidden="true" className="ambient ambient-left" />
      <div aria-hidden="true" className="grid-overlay" />
      <header className="relative z-10 mx-auto flex w-full max-w-5xl items-center justify-between">
        <Link className="font-mono text-sm font-bold tracking-[0.2em] text-white" href="/">
          DATA<span className="text-cyan-300">TRAP</span>
        </Link>
        <span className="font-mono text-[9px] tracking-[0.15em] text-cyan-100/60">
          MISSION BRIEFING / 00
        </span>
      </header>

      <section className="relative z-10 mx-auto flex min-h-[calc(100svh-100px)] w-full max-w-5xl flex-col justify-center py-14">
        <div className="mx-auto w-full max-w-3xl text-center">
          <div className="identity-core mx-auto grid h-20 w-20 place-items-center rounded-full border border-cyan-200/30 bg-cyan-300/[0.04] text-cyan-200">
            <Fingerprint aria-hidden="true" size={40} strokeWidth={1.2} />
          </div>
          <p className="mt-8 font-mono text-[10px] tracking-[0.2em] text-cyan-200/70">
            GUARDIAN IDENTIFIED {playerName && `// ${playerName}`}
          </p>
          <h1 className="mt-4 text-4xl font-black tracking-[-0.06em] text-white sm:text-6xl">
            DATA TRAP
            <span className="block pt-2 text-lg font-medium tracking-[0.08em] text-cyan-200 sm:text-2xl">
              THE DIGITAL IDENTITY RPG
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
            Một tổ chức giả lập đang ghép các dấu vết số để dựng nên danh tính
            của nhân vật. Hãy điều tra dữ liệu, nhận diện bẫy và bảo vệ hồ sơ
            trước khi quá muộn.
          </p>
        </div>

        <div className="mx-auto mt-10 grid w-full max-w-4xl gap-3 sm:grid-cols-3">
          {[
            ["01", "NHẬN DIỆN", "Kiểm tra ứng dụng và quyền dữ liệu.", Shield],
            ["02", "ĐIỀU TRA", "Phân loại yêu cầu và dấu hiệu đáng ngờ.", Sparkles],
            ["03", "BẢO VỆ", "Chọn hành động để bảo vệ danh tính.", Fingerprint],
          ].map(([number, title, detail, Icon]) => (
            <article className="border border-white/[0.09] bg-white/[0.025] p-5 text-left" key={number}>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] tracking-[0.15em] text-cyan-200/60">
                  STAGE {number}
                </span>
                <Icon aria-hidden="true" className="text-cyan-200/75" size={17} />
              </div>
              <h2 className="mt-5 font-mono text-xs font-bold tracking-[0.13em] text-white">
                {title}
              </h2>
              <p className="mt-2 text-xs leading-5 text-slate-500">{detail}</p>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-6 flex items-center justify-center gap-2 font-mono text-[9px] tracking-[0.12em] text-slate-500">
          <Clock3 aria-hidden="true" size={14} />
          4 NHIỆM VỤ <span className="text-cyan-300/50">/</span> KHOẢNG 3–5 PHÚT
        </div>
        <p aria-live="polite" className="mx-auto mt-4 min-h-5 text-center text-sm text-rose-300">
          {errorMessage}
        </p>
        {errorMessage ? (
          <Link className="mx-auto mt-2 inline-flex min-h-12 items-center border border-cyan-200/30 px-5 font-mono text-[10px] tracking-[0.12em] text-cyan-100" href="/register">
            BẮT ĐẦU LƯỢT CHƠI MỚI
          </Link>
        ) : (
          <button
            className="group mx-auto mt-2 flex min-h-14 items-center justify-center gap-4 bg-cyan-300 px-8 font-mono text-xs font-bold tracking-[0.15em] text-[#06101b] transition hover:bg-cyan-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-100 disabled:opacity-60"
            disabled={isStarting || !playerName}
            onClick={startMission}
            type="button"
          >
            {isStarting ? "ĐANG BẮT ĐẦU..." : "BẮT ĐẦU CHƠI"}
            {!isStarting && <ArrowRight aria-hidden="true" className="transition-transform group-hover:translate-x-1" size={16} />}
          </button>
        )}
      </section>
    </main>
  );
}
