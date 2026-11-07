"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Clock3,
  FileSearch,
  Fingerprint,
  MessageCircle,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from "lucide-react";

const RPG_STAGES = [
  ["01", "THE BAIT", "Kiểm tra ứng dụng và chọn phạm vi quyền.", Smartphone],
  ["02", "THE BREACH", "Khám phá điện thoại và thu thập bằng chứng.", FileSearch],
  ["03", "THE LAST CHOICE", "Ứng phó sự cố dựa trên bằng chứng.", ShieldCheck],
];

const LEGACY_STAGES = [
  ["01", "MISSION 01", "Nhận diện yêu cầu dữ liệu.", Shield],
  ["02", "MISSION 02", "Kiểm tra dấu hiệu đáng ngờ.", Sparkles],
  ["03", "MISSION 03", "Phân tích dấu vết và nguy cơ.", FileSearch],
  ["04", "MISSION 04", "Chọn cách bảo vệ danh tính.", Fingerprint],
];

const QUIZ_STEPS = [
  ["01", "LỰA CHỌN NGẪU NHIÊN", "Mỗi ván rút câu hỏi khác nhau từ ngân hàng đang bật.", Sparkles],
  ["02", "QUYẾT ĐỊNH CỦA BẠN", "Đọc tình huống, chọn phương án và xem giải thích.", FileSearch],
  ["03", "TỔNG KẾT KIẾN THỨC", "Nhận điểm, bài học và căn cứ tham khảo sau mỗi câu.", ShieldCheck],
];

export default function Briefing() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState("");
  const [gameVersion, setGameVersion] = useState("legacy-v1");
  const [questionCount, setQuestionCount] = useState(4);
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
          setGameVersion(result.gameVersion ?? "legacy-v1");
          setQuestionCount(result.questionCount ?? 4);
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
    <main className="relative min-h-screen overflow-hidden bg-[#030816] px-5 py-6 text-slate-100 sm:px-8 sm:py-8">
      <div aria-hidden="true" className="ambient ambient-left" />
      <div aria-hidden="true" className="ambient ambient-right" />
      <div aria-hidden="true" className="grid-overlay" />
      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between border-b border-cyan-200/10 pb-4">
        <Link className="flex items-center gap-2 font-mono text-sm font-black italic tracking-[0.16em] text-white" href="/">
          <span className="grid h-9 w-9 place-items-center border border-fuchsia-300/45 bg-fuchsia-300/[0.07] text-fuchsia-200">
            <ShieldAlert aria-hidden="true" size={19} />
          </span>
          KHÔNG GIAN <span className="text-cyan-300">2</span>
        </Link>
        <span className="font-mono text-[8px] tracking-[0.15em] text-cyan-100/60 sm:text-[9px]">
          MISSION BRIEFING / {gameVersion === "rpg-v2" ? "RPG V2" : gameVersion === "quiz-v3" ? "QUESTION RUN" : "LEGACY"}
        </span>
      </header>

      <section className="relative z-10 mx-auto grid min-h-[calc(100svh-90px)] w-full max-w-7xl items-center gap-7 py-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-10 lg:py-10">
        <div className="relative border border-cyan-200/20 bg-[linear-gradient(145deg,rgba(10,31,60,0.84),rgba(4,11,26,0.96))] p-5 shadow-[0_0_45px_rgba(8,145,178,0.1)] sm:p-8">
          <p className="flex items-center gap-2 font-mono text-[9px] tracking-[0.17em] text-cyan-200/70">
            <span className="status-dot" />
            STORY INTRO // GUARDIAN IDENTIFIED
          </p>
          <h1 className="mt-6 text-3xl font-black leading-[1.05] tracking-[-0.05em] text-white sm:text-5xl">
            BẢO VỆ DANH TÍNH SỐ
            <span className="mt-2 block text-cyan-300">
              TRONG THẾ GIỚI ĐẦY CẠM BẪY.
            </span>
          </h1>
          <p className="mt-5 text-xs leading-6 text-slate-300 sm:text-sm sm:leading-7">
            {gameVersion === "quiz-v3"
              ? `Cùng ${questionCount} tình huống được rút ngẫu nhiên từ ngân hàng câu hỏi, bạn sẽ thực hành cách bảo vệ danh tính số. Nhân vật và dữ liệu trong game đều là mô phỏng.`
              : "Bạn sẽ đồng hành cùng nhân vật và khám phá cách những dấu vết số có thể bị ghép lại thành một danh tính. Mỗi lựa chọn đều để lại hậu quả cho chặng tiếp theo."}
          </p>

          <div className="mt-6 flex items-start gap-3 border-l-2 border-blue-300/50 bg-blue-300/[0.04] p-4">
            <MessageCircle aria-hidden="true" className="mt-0.5 shrink-0 text-blue-200" size={17} />
            <div>
              <p className="font-mono text-[8px] tracking-[0.14em] text-blue-100/65">
                AI GUARDIAN // BRIEFING
              </p>
              <p className="mt-2 text-xs leading-5 text-slate-300">
                {gameVersion === "quiz-v3"
                  ? "Đọc kỹ tình huống, cân nhắc mục đích sử dụng dữ liệu và kiểm tra căn cứ trước khi quyết định."
                  : "Hãy quan sát kỹ, kiểm tra trước khi chia sẻ và dùng bằng chứng để chọn cách xử lý."}
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3 border border-cyan-100/15 bg-[#050a16]/70 p-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center border border-cyan-200/35 bg-cyan-300/[0.07] text-cyan-100">
              <Fingerprint aria-hidden="true" size={23} />
            </span>
            <div className="min-w-0">
              <p className="font-mono text-[8px] tracking-[0.13em] text-slate-500">
                PLAYER // DATA GUARDIAN
              </p>
              <p className="mt-1 truncate text-xs font-semibold text-white">
                {playerName || "Đang xác minh người chơi..."}
              </p>
            </div>
            <ShieldCheck aria-hidden="true" className="ml-auto shrink-0 text-cyan-200" size={18} />
          </div>
          <div className="mt-5 flex items-center gap-2 font-mono text-[8px] tracking-[0.13em] text-slate-500">
            <Clock3 aria-hidden="true" size={13} />
            {gameVersion === "quiz-v3" ? "SỐ CÂU DO ADMIN CÀI ĐẶT" : "KHOẢNG 3–5 PHÚT"}
            <span className="px-1 text-cyan-300/50">/</span>
            {gameVersion === "quiz-v3" ? `${questionCount} CÂU NGẪU NHIÊN` : gameVersion === "rpg-v2" ? "3 STAGE LIÊN KẾT" : "4 NHIỆM VỤ LEGACY"}
          </div>
        </div>

        <div className="border border-cyan-200/20 bg-[#050d1c]/95 p-4 shadow-[0_0_45px_rgba(8,145,178,0.1)] sm:p-6">
          <div className="mb-4 flex items-center justify-between border-b border-cyan-200/15 pb-4">
            <div>
              <p className="font-mono text-[8px] tracking-[0.17em] text-cyan-200/60">
                {gameVersion === "quiz-v3" ? "RANDOMIZED QUESTION BANK" : gameVersion === "rpg-v2" ? "YOUR DECISIONS SHAPE THE STORY" : "PRESERVED LEGACY FLOW"}
              </p>
              <h2 className="mt-1 font-mono text-sm font-bold tracking-[0.12em] text-white sm:text-base">
                {gameVersion === "quiz-v3" ? "QUESTION BRIEFING" : gameVersion === "rpg-v2" ? "MISSION STAGES" : "MISSION BRIEFING"}
              </h2>
            </div>
            <span className="font-mono text-[9px] text-slate-500">
              {gameVersion === "quiz-v3" ? `01—${String(questionCount).padStart(2, "0")}` : gameVersion === "rpg-v2" ? "01—03" : "01—04"}
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {(gameVersion === "quiz-v3" ? QUIZ_STEPS : gameVersion === "rpg-v2" ? RPG_STAGES : LEGACY_STAGES).map(
              ([number, title, detail, Icon]) => (
                <article
                  className="relative overflow-hidden border border-cyan-100/10 bg-[linear-gradient(110deg,rgba(14,32,62,0.78),rgba(5,13,28,0.9))] p-4"
                  key={number}
                >
                  <div className="flex items-start gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-cyan-200/45 bg-cyan-300/[0.06] font-mono text-xs text-cyan-100">
                      {number}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-[9px] font-bold tracking-[0.11em] text-cyan-100">
                        {gameVersion === "rpg-v2" ? `STAGE ${number}` : title}
                      </p>
                      {gameVersion === "rpg-v2" && (
                        <h3 className="mt-1 text-xs font-semibold text-white">{title}</h3>
                      )}
                      {gameVersion === "quiz-v3" && (
                        <p className="mt-4 border-l border-cyan-200/35 pl-3 text-[10px] leading-5 text-slate-400">
                          Mỗi ván chọn {questionCount} câu không lặp. Căn cứ pháp luật chỉ
                          mang tính tham khảo và các câu còn được đánh dấu rà soát sẽ cần
                          chuyên gia kiểm tra.
                        </p>
                      )}
                      <p className="mt-2 text-[10px] leading-5 text-slate-400">{detail}</p>
                    </div>
                    <Icon aria-hidden="true" className="shrink-0 text-cyan-200/75" size={17} />
                  </div>
                </article>
              ),
            )}
          </div>
          {gameVersion === "rpg-v2" && (
            <p className="mt-4 border-l border-cyan-200/35 pl-3 text-[10px] leading-5 text-slate-400">
              Bằng chứng và quyết định được lưu xuyên suốt phiên chơi để làm thay
              đổi các phương án xử lý ở Stage cuối.
            </p>
          )}
        <p aria-live="polite" className="mx-auto mt-4 min-h-5 text-center text-sm text-rose-300">
          {errorMessage}
        </p>
        {errorMessage ? (
          <Link className="group mx-auto mt-2 flex min-h-12 items-center justify-center gap-3 border border-cyan-200/30 px-5 font-mono text-[10px] tracking-[0.12em] text-cyan-100" href="/register">
            TẠO PHIÊN CHƠI MỚI
            <ArrowRight aria-hidden="true" size={15} />
          </Link>
        ) : (
          <button
            className="group mx-auto mt-2 flex min-h-14 w-full items-center justify-center gap-4 border border-amber-200/70 bg-[linear-gradient(180deg,#ffe861,#ffb800)] px-8 font-mono text-xs font-black tracking-[0.15em] text-[#17100a] shadow-[0_0_28px_rgba(251,191,36,0.18)] transition hover:-translate-y-0.5 hover:shadow-[0_0_38px_rgba(251,191,36,0.32)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-200 disabled:opacity-60"
            disabled={isStarting || !playerName}
            onClick={startMission}
            type="button"
          >
            {isStarting ? "ĐANG BẮT ĐẦU..." : "BẮT ĐẦU CHƠI"}
            {!isStarting && <ArrowRight aria-hidden="true" className="transition-transform group-hover:translate-x-1" size={16} />}
          </button>
        )}
        </div>
      </section>
    </main>
  );
}
