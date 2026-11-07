"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  Clock3,
  FileSearch,
  Fingerprint,
  LockKeyhole,
  MessageCircle,
  Search,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from "lucide-react";

const STAGES = [
  { title: "THE BAIT", subtitle: "Kiểm tra ứng dụng", icon: Smartphone },
  { title: "THE BREACH", subtitle: "Điều tra dấu vết", icon: FileSearch },
  { title: "THE LAST CHOICE", subtitle: "Bảo vệ danh tính", icon: ShieldCheck },
];

const panelClass =
  "border border-cyan-200/20 bg-[linear-gradient(145deg,rgba(8,25,48,0.94),rgba(4,11,25,0.97))] shadow-[0_0_34px_rgba(8,145,178,0.08)]";

function GuardianPortrait() {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto h-40 w-40 shrink-0 sm:h-44 sm:w-44"
    >
      <div className="absolute inset-2 rounded-full border border-cyan-300/15" />
      <div className="absolute inset-5 rounded-full border border-dashed border-blue-300/20" />
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.2),rgba(37,99,235,0.12)_42%,transparent_72%)] blur-md" />
      <div className="absolute bottom-1 left-1/2 h-[78px] w-[124px] -translate-x-1/2 rounded-t-[58px] border border-cyan-300/60 bg-[linear-gradient(145deg,rgba(30,64,175,0.9),rgba(7,15,37,0.98)_62%)] shadow-[0_0_28px_rgba(34,211,238,0.25)]" />
      <div className="absolute left-1/2 top-[24px] h-[94px] w-[92px] -translate-x-1/2 rounded-[48%_48%_42%_42%] border border-blue-200/60 bg-[linear-gradient(160deg,#172e61,#08142f_70%)] shadow-[0_0_24px_rgba(59,130,246,0.3)]">
        <div className="absolute inset-x-[-9px] top-[-7px] h-[59px] rounded-t-[55px] border-x border-t border-cyan-300/70 bg-[linear-gradient(135deg,#10295b,#070c1e_76%)]" />
        <div className="absolute left-[17px] top-[48px] h-[4px] w-[15px] rounded-full bg-cyan-200 shadow-[0_0_11px_4px_rgba(34,211,238,0.8)]" />
        <div className="absolute right-[17px] top-[48px] h-[4px] w-[15px] rounded-full bg-cyan-200 shadow-[0_0_11px_4px_rgba(34,211,238,0.8)]" />
        <div className="absolute bottom-[13px] left-1/2 h-[1px] w-8 -translate-x-1/2 bg-blue-200/45" />
      </div>
      <div className="absolute bottom-1 left-1/2 h-2 w-24 -translate-x-1/2 rounded-full bg-cyan-300/40 blur-md" />
    </div>
  );
}

function BaitStage({
  game,
  rpg,
  secondsLeft,
  score,
  timerText,
  selectedAction,
  setSelectedAction,
  busy,
  errorMessage,
  choosePermission,
}) {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#050817] px-4 pb-5 pt-3 text-slate-100 sm:px-7 sm:pt-4">
      <div aria-hidden="true" className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_53%_43%,rgba(26,73,158,0.38),transparent_44%),radial-gradient(ellipse_at_90%_36%,rgba(124,58,237,0.2),transparent_32%),linear-gradient(180deg,#050817_0%,#09142b_58%,#050817_100%)]" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 opacity-40 [background-image:linear-gradient(rgba(67,110,191,0.09)_1px,transparent_1px),linear-gradient(90deg,rgba(67,110,191,0.08)_1px,transparent_1px)] [background-size:46px_46px] [mask-image:linear-gradient(to_bottom,transparent,black_22%,black_76%,transparent)]" />

      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[35vh] min-h-56 overflow-hidden opacity-60">
        <div className="absolute inset-x-0 bottom-0 h-20 border-t border-cyan-300/20 bg-[linear-gradient(180deg,rgba(15,35,77,0.4),rgba(2,7,18,0.98))]" />
        <div className="absolute inset-x-[-5%] bottom-16 h-28 -skew-y-[8deg] rounded-[50%] border-t border-cyan-300/35 shadow-[0_-8px_35px_rgba(34,211,238,0.13)]" />
        <div className="absolute inset-x-[-5%] bottom-8 h-28 skew-y-[5deg] rounded-[50%] border-t border-blue-400/25" />
        {[
          ["3%", "62%", "h-28"],
          ["11%", "76%", "h-40"],
          ["22%", "61%", "h-24"],
          ["34%", "72%", "h-36"],
          ["44%", "63%", "h-28"],
          ["58%", "75%", "h-40"],
          ["69%", "61%", "h-24"],
          ["78%", "72%", "h-36"],
          ["90%", "63%", "h-28"],
        ].map(([left, width, height], index) => (
          <div
            className={`absolute bottom-14 ${height} border border-blue-300/15 bg-[linear-gradient(90deg,rgba(8,18,42,0.94),rgba(19,43,86,0.78),rgba(7,13,31,0.98))]`}
            key={left}
            style={{ left, width }}
          >
            <div className="grid h-full grid-cols-3 gap-x-1 px-1 pt-2 opacity-70">
              {Array.from({ length: 9 }, (_, lightIndex) => (
                <span
                  className={`h-1 w-1 ${((index + lightIndex) % 3) === 0 ? "bg-cyan-300/70 shadow-[0_0_7px_rgba(34,211,238,0.7)]" : "bg-violet-300/40"}`}
                  key={lightIndex}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <header className="relative z-10 mx-auto flex w-full max-w-[1440px] items-center justify-between border-b border-blue-200/15 pb-3">
        <a
          className="flex items-center gap-2 font-mono text-sm font-black italic tracking-[0.16em] text-white sm:gap-3 sm:text-base"
          href="/character"
        >
          <span className="grid h-8 w-8 place-items-center border border-fuchsia-300/50 bg-fuchsia-300/[0.07] text-fuchsia-200 shadow-[0_0_18px_rgba(217,70,239,0.2)] sm:h-9 sm:w-9">
            <ShieldAlert aria-hidden="true" size={19} />
          </span>
          DATA <span className="text-cyan-300">TRAP</span>
          <span className="ml-1 hidden border-l border-white/15 pl-3 font-mono text-[8px] font-normal not-italic tracking-[0.16em] text-slate-500 sm:block">
            THE DIGITAL IDENTITY RPG
          </span>
        </a>
        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-2 font-mono text-[8px] tracking-[0.12em] text-cyan-100/65 md:flex">
            <span className="status-dot" />
            SIMULATION ACTIVE
          </span>
          <div className={`flex items-center gap-2 border px-3 py-2 font-mono text-[10px] tracking-[0.1em] ${secondsLeft < 60 ? "border-rose-300/50 bg-rose-400/10 text-rose-100" : "border-cyan-200/25 bg-[#071226]/80 text-cyan-100"}`}>
            <Clock3 aria-hidden="true" size={14} />
            {timerText}
          </div>
        </div>
      </header>

      <section className="relative z-10 mx-auto w-full max-w-[1320px] pt-4 sm:pt-5">
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="grid h-10 w-10 shrink-0 place-items-center border border-cyan-200/65 bg-cyan-300/[0.08] text-cyan-100 shadow-[0_0_20px_rgba(34,211,238,0.18)] sm:h-11 sm:w-11">
            <Sparkles aria-hidden="true" size={21} />
          </span>
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="min-w-[136px] sm:min-w-[155px]">
              <p className="font-mono text-[8px] tracking-[0.15em] text-cyan-200/55">
                STAGE 01
              </p>
              <h1 className="mt-0.5 truncate font-mono text-xs font-bold tracking-[0.12em] text-white sm:text-sm">
                THE BAIT
              </h1>
            </div>
            <div
              aria-label="Giai đoạn 1 trên 3"
              className="flex max-w-[360px] flex-1 items-center"
            >
              {[0, 1, 2, 3, 4].map((step) => (
                <span className="flex flex-1 items-center last:flex-none" key={step}>
                  <span className={`h-2.5 w-2.5 rounded-full border ${step === 0 ? "border-cyan-100 bg-cyan-200 shadow-[0_0_11px_3px_rgba(34,211,238,0.65)]" : "border-blue-300/50 bg-[#081329]"}`} />
                  {step < 4 && <span className="h-px flex-1 bg-blue-200/25" />}
                </span>
              ))}
            </div>
          </div>
          <span className="hidden border border-amber-200/20 bg-amber-200/[0.04] px-3 py-2 font-mono text-[9px] text-amber-100/85 sm:inline-flex">
            {score} XP
          </span>
        </div>

        <div className="mt-4 grid items-center gap-4 lg:mt-5 lg:grid-cols-[minmax(210px,0.78fr)_minmax(280px,1fr)_minmax(270px,0.92fr)] lg:gap-5 xl:gap-7">
          <aside className="relative order-2 flex items-center gap-4 border border-cyan-300/25 bg-[linear-gradient(145deg,rgba(8,27,57,0.84),rgba(7,12,30,0.86))] p-4 shadow-[0_0_36px_rgba(34,211,238,0.12)] lg:order-1 lg:min-h-[490px] lg:flex-col lg:justify-center lg:gap-3 lg:px-5 lg:py-6">
            <div aria-hidden="true" className="absolute left-0 top-0 h-12 w-12 border-l border-t border-cyan-200/75" />
            <div aria-hidden="true" className="absolute bottom-0 right-0 h-12 w-12 border-b border-r border-blue-300/55" />
            <GuardianPortrait />
            <div className="min-w-0 flex-1 lg:w-full lg:flex-none lg:text-center">
              <p className="font-mono text-[9px] font-bold tracking-[0.18em] text-cyan-200">
                AI GUARDIAN
              </p>
              <p className="mt-2 text-[10px] leading-5 text-slate-200 sm:text-xs">
                {rpg.guardian}
              </p>
              <div className="mt-3 border-l-2 border-cyan-300/45 bg-cyan-200/[0.04] px-3 py-2 text-left lg:text-center">
                <p className="font-mono text-[8px] tracking-[0.1em] text-cyan-100/50">
                  PLAYER // {game.character?.persona}
                </p>
                <p className="mt-1 truncate text-[10px] font-semibold text-slate-100">
                  {game.character?.name}
                </p>
              </div>
            </div>
          </aside>

          <section aria-label="Điện thoại mô phỏng" className="relative order-1 mx-auto w-full max-w-[360px] lg:order-2">
            <div aria-hidden="true" className="absolute -inset-6 rounded-[48%] bg-[radial-gradient(ellipse,rgba(30,111,255,0.2),rgba(34,211,238,0.1)_42%,transparent_72%)] blur-xl" />
            <div className="relative rounded-[2.4rem] border border-slate-400/35 bg-[linear-gradient(135deg,#586277,#101728_13%,#050914_26%,#111c31_74%,#3e4c66)] p-[6px] shadow-[0_20px_65px_rgba(0,0,0,0.64),0_0_32px_rgba(37,99,235,0.22)]">
              <div className="relative overflow-hidden rounded-[2rem] border border-cyan-100/10 bg-[linear-gradient(180deg,#edf4ff_0%,#dceaff_46%,#f4f7ff_100%)] text-slate-900">
                <div className="flex h-7 items-center justify-between bg-[#0b1021] px-5 font-mono text-[8px] text-slate-200">
                  <span>9:41</span>
                  <span className="h-[5px] w-14 rounded-full bg-black ring-1 ring-white/10" />
                  <span>◖ ▰ ▴</span>
                </div>

                <div className="bg-white/90 px-4 pb-4 pt-3 sm:px-5">
                  <div className="flex items-center justify-between text-[9px] text-slate-500">
                    <span>‹ Cửa hàng ứng dụng</span>
                    <span>•••</span>
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-violet-200 bg-[linear-gradient(145deg,#e9d5ff,#a78bfa)] text-violet-800 shadow-[0_6px_18px_rgba(124,58,237,0.18)]">
                      <Sparkles aria-hidden="true" size={27} />
                    </span>
                    <div className="min-w-0">
                      <h2 className="line-clamp-2 text-sm font-extrabold leading-5 text-slate-900 sm:text-base">
                        {rpg.stage01.serviceName}
                      </h2>
                      <p className="mt-1 text-[9px] text-slate-500">
                        ỨNG DỤNG MÔ PHỎNG
                      </p>
                      <p className="mt-1 flex items-center gap-1 text-[9px] text-amber-500">
                        <span>★★★★</span>
                        <span className="text-slate-400">★ · Đánh giá mô phỏng</span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl border border-blue-100 bg-[#f2f6ff] p-3">
                    <p className="text-[10px] font-bold text-slate-800">
                      Tình huống
                    </p>
                    <p className="mt-1.5 text-[10px] leading-[1.65] text-slate-600">
                      {rpg.stage01.scene}
                    </p>
                  </div>

                  <div className="mt-3">
                    <p className="text-[10px] font-bold text-slate-800">
                      Trước khi tiếp tục
                    </p>
                    <div className="mt-2 space-y-2">
                      {[
                        [Fingerprint, "Dữ liệu cá nhân"],
                        [Smartphone, "Quyền truy cập ứng dụng"],
                        [ShieldCheck, "Chia sẻ và hiển thị"],
                      ].map(([Icon, label]) => (
                        <div className="flex items-center gap-2 text-[9px] text-slate-600" key={label}>
                          <Icon aria-hidden="true" className="text-blue-600" size={13} />
                          {label}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-[9px] leading-4 text-blue-900">
                    Chỉ cấp quyền phù hợp với mục đích sử dụng.
                  </div>
                  <div className="mt-4 flex min-h-10 items-center justify-center rounded-full bg-[linear-gradient(180deg,#2589ff,#0871ee)] text-[11px] font-bold text-white shadow-[0_5px_13px_rgba(37,99,235,0.27)]">
                    Xem yêu cầu quyền
                  </div>
                </div>

                <div className="absolute left-1/2 top-[8px] h-[16px] w-[82px] -translate-x-1/2 rounded-b-xl bg-[#0b1021]" />
              </div>
            </div>
            <div className="mx-auto mt-3 flex w-fit items-center gap-2 border border-cyan-200/20 bg-[#061126]/90 px-3 py-1.5 font-mono text-[8px] tracking-[0.12em] text-cyan-100/65">
              <LockKeyhole aria-hidden="true" size={11} />
              SIMULATED DEVICE // NO REAL DATA
            </div>
          </section>

          <section aria-labelledby="bait-choice-title" className="relative order-3 border border-blue-300/30 bg-[linear-gradient(150deg,rgba(7,24,52,0.96),rgba(5,10,26,0.98))] p-4 shadow-[0_0_38px_rgba(37,99,235,0.14)] sm:p-5 lg:min-h-[440px] lg:p-5">
            <div aria-hidden="true" className="absolute right-0 top-0 h-9 w-9 border-r border-t border-cyan-200/75" />
            <p className="font-mono text-[8px] tracking-[0.18em] text-cyan-200/60">
              DECISION REQUIRED // 01
            </p>
            <h2 className="mt-2 text-lg font-bold leading-6 text-white" id="bait-choice-title">
              Bạn sẽ làm gì?
            </h2>
            <p className="mt-2 text-[10px] leading-5 text-slate-400">
              Chọn cách phản hồi yêu cầu truy cập. Lựa chọn này sẽ thay đổi dấu
              vết xuất hiện ở Stage tiếp theo.
            </p>

            <div className="mt-4 space-y-2.5">
              {rpg.stage01.choices.map((choice, index) => {
                const selected = selectedAction === choice.id;
                const safe = choice.id === "limit-permission";
                return (
                  <button
                    aria-pressed={selected}
                    className={`group flex min-h-[78px] w-full items-start gap-3 border p-3 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200 ${selected ? safe ? "border-cyan-200/75 bg-cyan-200/[0.12] shadow-[inset_0_0_22px_rgba(34,211,238,0.06)]" : "border-amber-200/65 bg-amber-200/[0.09]" : "border-blue-100/15 bg-[#09152b]/75 hover:border-cyan-200/40 hover:bg-cyan-200/[0.04]"}`}
                    key={choice.id}
                    onClick={() => setSelectedAction(choice.id)}
                    type="button"
                  >
                    <span className={`grid h-7 w-7 shrink-0 place-items-center border font-mono text-[10px] ${selected ? safe ? "border-cyan-100 bg-cyan-200 text-[#04101e]" : "border-amber-100 bg-amber-200 text-[#201000]" : "border-cyan-200/40 text-cyan-100"}`}>
                      {selected ? <Check aria-hidden="true" size={14} /> : String.fromCharCode(65 + index)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[11px] font-semibold leading-4 text-white sm:text-xs">
                        {choice.label}
                      </span>
                      <span className="mt-1 block text-[9px] leading-[1.55] text-slate-400">
                        {choice.detail}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              className="group mt-4 flex min-h-12 w-full items-center justify-center gap-3 border border-amber-100 bg-[linear-gradient(180deg,#ffe975_0%,#ffc21c_55%,#f59e0b_100%)] px-4 font-mono text-[10px] font-black tracking-[0.1em] text-[#191006] shadow-[0_0_25px_rgba(251,191,36,0.24),inset_0_1px_0_rgba(255,255,255,0.72)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={!selectedAction || busy}
              onClick={choosePermission}
              type="button"
            >
              {busy ? "ĐANG GHI NHẬN..." : "XÁC NHẬN LỰA CHỌN"}
              <ArrowRight aria-hidden="true" className="transition group-hover:translate-x-1" size={16} />
            </button>
            <p aria-live="polite" className="mt-2 min-h-4 text-[10px] text-rose-300">
              {errorMessage}
            </p>
            <p className="mt-1 flex items-center gap-2 font-mono text-[8px] leading-4 text-slate-600">
              <ShieldCheck aria-hidden="true" className="shrink-0 text-cyan-200/60" size={12} />
              YOUR DECISION SHAPES THE NEXT STAGE
            </p>
          </section>
        </div>

        <footer className="relative mt-3 flex items-center justify-between border-t border-blue-200/15 pt-3 font-mono text-[8px] tracking-[0.13em] text-slate-600">
          <span>DATA TRAP // SECURITY SIMULATION</span>
          <span className="hidden items-center gap-2 sm:flex">
            <ShieldCheck aria-hidden="true" size={12} />
            FICTIONAL CHARACTER · TRAINING ENVIRONMENT
          </span>
        </footer>
      </section>
    </main>
  );
}

export default function RpgConsole({ game, onRefresh, secondsLeft }) {
  const router = useRouter();
  const [selectedAction, setSelectedAction] = useState("");
  const [selectedActions, setSelectedActions] = useState([]);
  const [busy, setBusy] = useState(false);
  const [busyArtifact, setBusyArtifact] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const rpg = game.rpg;
  const stage = rpg.stage;
  const timerText = `${String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:${String(secondsLeft % 60).padStart(2, "0")}`;

  async function sendAction(path, payload) {
    setBusy(true);
    setErrorMessage("");
    try {
      const response = await fetch(`/api/game/rpg/${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (response.status === 410) {
        router.replace("/result");
        return null;
      }
      if (!response.ok) {
        throw new Error(result.error ?? "Không thể lưu thao tác.");
      }
      return result;
    } catch (error) {
      setErrorMessage(error.message);
      return null;
    } finally {
      setBusy(false);
    }
  }

  async function choosePermission() {
    const result = await sendAction("decide", { actionId: selectedAction });
    if (result) await onRefresh();
  }

  async function inspectArtifact(artifactId) {
    setBusyArtifact(artifactId);
    const result = await sendAction("interact", { artifactId });
    if (result) await onRefresh();
    setBusyArtifact("");
  }

  async function advanceToFinalChoice() {
    const result = await sendAction("advance", {});
    if (result) await onRefresh();
  }

  function toggleFinalAction(actionId) {
    setSelectedActions((current) => {
      if (actionId === "share-code") {
        return current.includes(actionId) ? [] : [actionId];
      }
      const safeActions = current.filter((id) => id !== "share-code");
      if (safeActions.includes(actionId)) {
        return safeActions.filter((id) => id !== actionId);
      }
      return safeActions.length < 3 ? [...safeActions, actionId] : safeActions;
    });
  }

  async function resolveIncident() {
    const result = await sendAction("resolve", { actions: selectedActions });
    if (result) router.replace("/result");
  }

  if (stage === 1) {
    return (
      <BaitStage
        busy={busy}
        choosePermission={choosePermission}
        errorMessage={errorMessage}
        game={game}
        rpg={rpg}
        score={game.score}
        secondsLeft={secondsLeft}
        selectedAction={selectedAction}
        setSelectedAction={setSelectedAction}
        timerText={timerText}
      />
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030816] px-4 py-4 text-slate-100 sm:px-7 sm:py-6">
      <div aria-hidden="true" className="ambient ambient-left" />
      <div aria-hidden="true" className="grid-overlay" />
      <header className="relative z-10 mx-auto flex w-full max-w-[1440px] items-center justify-between gap-4 border-b border-cyan-200/15 pb-4">
        <a
          className="flex items-center gap-2 font-mono text-sm font-black italic tracking-[0.16em] text-white sm:gap-3 sm:text-base"
          href="/character"
        >
          <span className="grid h-9 w-9 place-items-center border border-fuchsia-300/45 bg-fuchsia-300/[0.07] text-fuchsia-200">
            <ShieldAlert aria-hidden="true" size={20} />
          </span>
          DATA <span className="text-cyan-300">TRAP</span>
        </a>
        <div className="hidden items-center gap-2 font-mono text-[9px] tracking-[0.15em] text-slate-500 sm:flex">
          <span className="status-dot" />
          IDENTITY SIMULATION // ACTIVE
        </div>
        <div className={`flex items-center gap-2 border px-3 py-2 font-mono text-[10px] tracking-[0.1em] ${secondsLeft < 60 ? "border-rose-300/40 bg-rose-400/[0.06] text-rose-200" : "border-cyan-200/20 bg-cyan-300/[0.04] text-cyan-100"}`}>
          <Clock3 aria-hidden="true" size={14} />
          {timerText}
        </div>
      </header>

      <section className="relative z-10 mx-auto w-full max-w-[1440px] pb-10 pt-5 sm:pt-7">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center border border-cyan-200/40 bg-cyan-300/[0.07] text-cyan-100 shadow-[0_0_24px_rgba(34,211,238,0.12)]">
              <Fingerprint aria-hidden="true" size={23} />
            </span>
            <div>
              <p className="font-mono text-[8px] tracking-[0.18em] text-cyan-200/55 sm:text-[9px]">
                PLAYER PROFILE // {game.character?.persona}
              </p>
              <h1 className="mt-1 text-xl font-black tracking-tight text-white sm:text-2xl">
                {game.character?.name}
                <span className="ml-2 hidden font-mono text-[9px] font-normal tracking-[0.1em] text-slate-500 sm:inline">
                  DATA GUARDIAN
                </span>
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end border border-amber-200/20 bg-amber-300/[0.04] px-3 py-2 font-mono text-[10px] tracking-[0.1em] text-amber-100 sm:self-auto">
            <Sparkles aria-hidden="true" size={14} />
            {game.score} XP
          </div>
        </div>

        <nav aria-label="Tiến trình nhiệm vụ" className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
          {STAGES.map(({ title, subtitle, icon: Icon }, index) => {
            const number = index + 1;
            const active = stage === number;
            const complete = stage > number;
            return (
              <div
                aria-current={active ? "step" : undefined}
                className={`relative flex min-w-0 items-center gap-2 border px-2 py-3 sm:gap-3 sm:px-4 ${active ? "border-cyan-200/55 bg-cyan-300/[0.08] shadow-[0_0_22px_rgba(34,211,238,0.1)]" : complete ? "border-emerald-200/25 bg-emerald-300/[0.035]" : "border-white/[0.08] bg-white/[0.02]"}`}
                key={title}
              >
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border font-mono text-[10px] ${active ? "border-cyan-200 text-cyan-100" : complete ? "border-emerald-200/50 text-emerald-200" : "border-slate-700 text-slate-500"}`}>
                  {complete ? <Check aria-label="Hoàn thành" size={14} /> : <Icon aria-hidden="true" size={14} />}
                </span>
                <span className="min-w-0">
                  <span className={`block truncate font-mono text-[8px] font-bold tracking-[0.08em] sm:text-[10px] ${active ? "text-cyan-100" : complete ? "text-emerald-100" : "text-slate-500"}`}>
                    {title}
                  </span>
                  <span className="mt-1 hidden truncate text-[10px] text-slate-500 sm:block">
                    {subtitle}
                  </span>
                </span>
              </div>
            );
          })}
        </nav>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            ["DATA RISK", rpg.dataRisk, "text-rose-100", "border-rose-300/20"],
            ["PROTECTION", rpg.protectionScore, "text-emerald-100", "border-emerald-300/20"],
            ["EVIDENCE", rpg.evidenceInventory.length, "text-cyan-100", "border-cyan-300/20"],
          ].map(([label, value, color, border]) => (
            <article className={`flex items-center justify-between border bg-[#071226]/80 px-3 py-3 sm:px-5 ${border}`} key={label}>
              <span className="font-mono text-[8px] tracking-[0.1em] text-slate-500 sm:text-[9px]">
                {label}
              </span>
              <strong className={`font-mono text-sm sm:text-base ${color}`}>
                {value}{label !== "EVIDENCE" ? "/100" : ""}
              </strong>
            </article>
          ))}
        </div>

        <div className="mt-5 grid items-start gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.85fr)]">
          <section aria-labelledby="stage-title" className={`${panelClass} min-w-0 p-4 sm:p-6`}>
            <div className="mb-5 flex items-start justify-between gap-4 border-b border-cyan-100/10 pb-4">
              <div>
                <p className="font-mono text-[8px] tracking-[0.18em] text-cyan-200/60 sm:text-[9px]">
                  {stage === 1 ? "APP PERMISSION REVIEW" : stage === 2 ? "PHONE // INVESTIGATION FILES" : "IDENTITY INCIDENT // RESPONSE"}
                </p>
                <h2 className="mt-2 text-lg font-bold leading-6 text-white sm:text-xl" id="stage-title">
                  {stage === 1
                    ? "Ứng dụng này thực sự cần quyền gì?"
                    : stage === 2
                      ? "Khám phá các dấu vết trong thiết bị"
                      : "Lập phương án bảo vệ danh tính"}
                </h2>
                <p className="mt-2 max-w-2xl text-xs leading-5 text-slate-400">
                  {stage === 1
                    ? "Hãy xem ứng dụng đang yêu cầu dữ liệu nào trước khi quyết định."
                    : stage === 2
                      ? "Mở các mục trên điện thoại. Bằng chứng tìm được sẽ theo bạn sang quyết định cuối."
                      : "Chọn tối đa ba hành động. Lựa chọn trước và bằng chứng đã thu thập sẽ ảnh hưởng kết quả."}
                </p>
              </div>
              <span className="hidden shrink-0 font-mono text-[9px] tracking-[0.12em] text-slate-600 sm:block">
                STAGE 0{stage} / 03
              </span>
            </div>

            {stage === 1 && (
              <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
                <div className="relative mx-auto w-full max-w-sm border border-slate-500/30 bg-[#050914] p-3 shadow-[0_14px_45px_rgba(0,0,0,0.34)]">
                  <div className="flex items-center justify-between border-b border-white/10 px-2 pb-3 font-mono text-[8px] text-slate-500">
                    <span>◀ DEVICE</span>
                    <span>SIMULATED APP STORE</span>
                    <span>•••</span>
                  </div>
                  <div className="mt-3 flex items-center gap-3 rounded-sm border border-blue-200/15 bg-blue-300/[0.06] p-3">
                    <span className="grid h-12 w-12 shrink-0 place-items-center border border-violet-200/30 bg-violet-400/[0.14] text-violet-100">
                      <Sparkles aria-hidden="true" size={24} />
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-white">{rpg.stage01.serviceName}</p>
                      <p className="mt-1 text-[10px] text-slate-500">ỨNG DỤNG MÔ PHỎNG · YÊU CẦU TRUY CẬP</p>
                    </div>
                  </div>
                  <div className="mt-3 border border-white/[0.08] bg-[#0b1425] p-3">
                    <p className="font-mono text-[8px] tracking-[0.13em] text-cyan-100/65">
                      CONTEXT
                    </p>
                    <p className="mt-2 text-xs leading-5 text-slate-300">{rpg.stage01.scene}</p>
                  </div>
                  <div className="mt-3 flex items-center gap-2 border border-amber-200/20 bg-amber-300/[0.045] p-3">
                    <ShieldAlert aria-hidden="true" className="shrink-0 text-amber-200" size={16} />
                    <p className="text-[10px] leading-4 text-amber-100/80">
                      Kiểm tra yêu cầu có phù hợp với mục đích ứng dụng không.
                    </p>
                  </div>
                  <div aria-hidden="true" className="absolute -bottom-2 left-1/2 h-1 w-12 -translate-x-1/2 rounded-full bg-slate-500/60" />
                </div>

                <div className="space-y-3">
                  {rpg.stage01.choices.map((choice, index) => {
                    const selected = selectedAction === choice.id;
                    const safe = choice.id === "limit-permission";
                    return (
                      <button
                        aria-pressed={selected}
                        className={`group w-full border p-4 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200 ${selected ? safe ? "border-cyan-200/70 bg-cyan-200/[0.09] shadow-[0_0_20px_rgba(34,211,238,0.08)]" : "border-amber-200/60 bg-amber-200/[0.07]" : "border-white/[0.09] bg-white/[0.025] hover:border-cyan-100/30 hover:bg-cyan-100/[0.035]"}`}
                        key={choice.id}
                        onClick={() => setSelectedAction(choice.id)}
                        type="button"
                      >
                        <span className="flex items-center gap-3">
                          <span className={`grid h-8 w-8 shrink-0 place-items-center border font-mono text-[10px] ${selected ? safe ? "border-cyan-200 text-cyan-100" : "border-amber-200 text-amber-100" : "border-slate-700 text-slate-500"}`}>
                            {selected ? <Check aria-hidden="true" size={15} /> : `0${index + 1}`}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-semibold text-slate-100">{choice.label}</span>
                            <span className="mt-1 block text-xs leading-5 text-slate-400">{choice.detail}</span>
                          </span>
                        </span>
                      </button>
                    );
                  })}
                  <button
                    className="mt-1 flex min-h-12 w-full items-center justify-center gap-3 border border-amber-200/70 bg-[linear-gradient(180deg,#ffe861,#ffb800)] px-5 font-mono text-[10px] font-black tracking-[0.12em] text-[#17100a] shadow-[0_0_24px_rgba(251,191,36,0.16)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={!selectedAction || busy}
                    onClick={choosePermission}
                    type="button"
                  >
                    {busy ? "ĐANG LƯU QUYẾT ĐỊNH..." : "XÁC NHẬN LỰA CHỌN"}
                    <ArrowRight aria-hidden="true" size={16} />
                  </button>
                </div>
              </div>
            )}

            {stage === 2 && (
              <div className="grid gap-5 xl:grid-cols-[0.78fr_1.22fr]">
                <div className="border border-cyan-100/10 bg-[#050a16]/80 p-3">
                  <p className="mb-3 flex items-center gap-2 px-1 font-mono text-[9px] tracking-[0.13em] text-cyan-100/70">
                    <Smartphone aria-hidden="true" size={14} />
                    KHU VỰC ĐIỀU TRA
                  </p>
                  <div className="space-y-2">
                    {rpg.stage02.artifacts.map((artifact, index) => (
                      <button
                        aria-pressed={artifact.discovered}
                        className={`flex min-h-12 w-full items-center gap-3 border px-3 py-2 text-left transition ${artifact.discovered ? "border-emerald-200/40 bg-emerald-300/[0.07]" : "border-white/[0.08] bg-white/[0.025] hover:border-cyan-200/35"}`}
                        disabled={busy || busyArtifact === artifact.id || artifact.discovered}
                        key={artifact.id}
                        onClick={() => inspectArtifact(artifact.id)}
                        type="button"
                      >
                        <span className={`grid h-7 w-7 shrink-0 place-items-center border ${artifact.discovered ? "border-emerald-200/40 text-emerald-200" : "border-slate-700 text-cyan-100/70"}`}>
                          {artifact.discovered ? <Check aria-label="Đã tìm thấy" size={14} /> : <Search aria-hidden="true" size={14} />}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-xs font-medium text-slate-200">{artifact.title}</span>
                          <span className="mt-1 block font-mono text-[8px] tracking-[0.08em] text-slate-600">
                            {artifact.discovered ? "EVIDENCE ADDED" : `FILE 0${index + 1} // INSPECT`}
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="border border-blue-200/20 bg-[linear-gradient(135deg,rgba(20,36,76,0.56),rgba(5,13,28,0.75))] p-4 sm:p-5">
                    <p className="flex items-center gap-2 font-mono text-[9px] tracking-[0.13em] text-blue-100/75">
                      <MessageCircle aria-hidden="true" size={14} />
                      AI GUARDIAN // INVESTIGATION TIP
                    </p>
                    <p className="mt-3 text-xs leading-6 text-slate-300">{rpg.guardian}</p>
                  </div>
                  <div className="border border-cyan-200/20 bg-cyan-200/[0.025] p-4 sm:p-5">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-mono text-[9px] tracking-[0.13em] text-cyan-100/70">
                        BẰNG CHỨNG ĐÃ THU THẬP
                      </p>
                      <span className="font-mono text-[9px] text-cyan-100">
                        {rpg.evidence.length} / {rpg.stage02.minimumEvidence}
                      </span>
                    </div>
                    {rpg.evidence.length ? (
                      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                        {rpg.evidence.map((item) => (
                          <li className="border-l-2 border-cyan-200/45 bg-[#071226]/80 px-3 py-2" key={item.evidenceId}>
                            <p className="text-xs font-semibold text-slate-200">{item.title}</p>
                            <p className="mt-1 text-[10px] leading-4 text-slate-400">{item.body}</p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-3 text-xs text-slate-500">
                        Kiểm tra tệp trên thiết bị để thêm bằng chứng vào hồ sơ.
                      </p>
                    )}
                  </div>
                  <button
                    className="flex min-h-12 w-full items-center justify-center gap-3 border border-amber-200/70 bg-[linear-gradient(180deg,#ffe861,#ffb800)] px-5 font-mono text-[10px] font-black tracking-[0.12em] text-[#17100a] shadow-[0_0_24px_rgba(251,191,36,0.16)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={!rpg.stage02.canAdvance || busy}
                    onClick={advanceToFinalChoice}
                    type="button"
                  >
                    {rpg.stage02.canAdvance ? "TIẾP TỤC VỚI BẰNG CHỨNG" : `TÌM THÊM ${Math.max(0, rpg.stage02.minimumEvidence - rpg.evidence.length)} BẰNG CHỨNG`}
                    <ArrowRight aria-hidden="true" size={16} />
                  </button>
                </div>
              </div>
            )}

            {stage === 3 && (
              <div className="grid gap-5 xl:grid-cols-[0.78fr_1.22fr]">
                <div className="space-y-4">
                  <div className="border border-rose-200/25 bg-[linear-gradient(145deg,rgba(70,20,43,0.35),rgba(10,14,30,0.75))] p-4 sm:p-5">
                    <p className="flex items-center gap-2 font-mono text-[9px] tracking-[0.14em] text-rose-100/75">
                      <ShieldAlert aria-hidden="true" size={15} />
                      INCIDENT ALERT
                    </p>
                    <p className="mt-3 text-sm leading-6 text-slate-200">{rpg.stage03.incident}</p>
                  </div>
                  <div className="border border-cyan-200/15 bg-[#050a16]/80 p-4">
                    <p className="font-mono text-[9px] tracking-[0.13em] text-cyan-100/70">
                      EVIDENCE CARRIED FORWARD
                    </p>
                    {rpg.evidence.length ? (
                      <ul className="mt-3 space-y-2">
                        {rpg.evidence.map((item) => (
                          <li className="flex items-start gap-2 text-xs text-slate-300" key={item.evidenceId}>
                            <Check aria-hidden="true" className="mt-0.5 shrink-0 text-cyan-200" size={13} />
                            <span>{item.title}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-2 text-xs text-slate-500">Không có bằng chứng được chuyển tiếp.</p>
                    )}
                  </div>
                  <div className="border-l-2 border-blue-300/45 bg-blue-300/[0.035] p-4">
                    <p className="font-mono text-[8px] tracking-[0.13em] text-blue-100/70">
                      AI GUARDIAN
                    </p>
                    <p className="mt-2 text-xs leading-5 text-slate-300">{rpg.guardian}</p>
                  </div>
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <p className="font-mono text-[9px] tracking-[0.13em] text-cyan-100/70">
                      CHỌN PHƯƠNG ÁN XỬ LÝ
                    </p>
                    <span className="font-mono text-[9px] text-slate-500">
                      {selectedActions.length} / 3
                    </span>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {rpg.stage03.choices.map((choice, index) => {
                      const selected = selectedActions.includes(choice.id);
                      return (
                        <button
                          aria-pressed={selected}
                          className={`min-h-[88px] border p-3 text-left transition ${selected ? choice.unsafe ? "border-rose-200/55 bg-rose-200/[0.07]" : "border-cyan-200/60 bg-cyan-200/[0.07]" : "border-white/[0.09] bg-white/[0.025] hover:border-cyan-100/25"}`}
                          key={choice.id}
                          onClick={() => toggleFinalAction(choice.id)}
                          type="button"
                        >
                          <span className="flex items-start gap-2">
                            <span className={`grid h-6 w-6 shrink-0 place-items-center border font-mono text-[8px] ${selected ? choice.unsafe ? "border-rose-200 text-rose-100" : "border-cyan-200 text-cyan-100" : "border-slate-700 text-slate-500"}`}>
                              {selected ? <Check aria-hidden="true" size={12} /> : String.fromCharCode(65 + index)}
                            </span>
                            <span>
                              <span className="block text-xs font-semibold leading-5 text-slate-100">{choice.label}</span>
                              <span className="mt-1 block text-[10px] leading-4 text-slate-500">{choice.detail}</span>
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <button
                    className="mt-4 flex min-h-12 w-full items-center justify-center gap-3 border border-amber-200/70 bg-[linear-gradient(180deg,#ffe861,#ffb800)] px-5 font-mono text-[10px] font-black tracking-[0.12em] text-[#17100a] shadow-[0_0_24px_rgba(251,191,36,0.16)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={selectedActions.length === 0 || busy}
                    onClick={resolveIncident}
                    type="button"
                  >
                    {busy ? "ĐANG TỔNG HỢP..." : "CHỐT PHƯƠNG ÁN & XEM KẾT QUẢ"}
                    <ArrowRight aria-hidden="true" size={16} />
                  </button>
                </div>
              </div>
            )}

            <p aria-live="polite" className="mt-3 min-h-5 text-xs text-rose-300">
              {errorMessage}
            </p>
          </section>

          <aside className={`${panelClass} p-4 sm:p-5`}>
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-blue-200/40 bg-blue-300/[0.08] text-blue-100 shadow-[0_0_20px_rgba(96,165,250,0.14)]">
                <LockKeyhole aria-hidden="true" size={19} />
              </span>
              <div>
                <p className="font-mono text-[8px] tracking-[0.15em] text-blue-100/60">
                  DIGITAL IDENTITY // LIVE STATUS
                </p>
                <p className="mt-1 text-xs font-semibold text-white">
                  Hồ sơ của {game.character?.name}
                </p>
              </div>
            </div>
            <div className="my-4 h-px bg-gradient-to-r from-cyan-200/35 via-cyan-200/10 to-transparent" />
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="border border-white/[0.07] bg-white/[0.02] p-3">
                <p className="font-mono text-[8px] tracking-[0.1em] text-slate-500">STAGE STATUS</p>
                <p className="mt-2 text-cyan-100">{stage} / 3 ACTIVE</p>
              </div>
              <div className="border border-white/[0.07] bg-white/[0.02] p-3">
                <p className="font-mono text-[8px] tracking-[0.1em] text-slate-500">PROFILE TYPE</p>
                <p className="mt-2 text-slate-200">SIMULATED</p>
              </div>
            </div>
            <p className="mt-4 flex items-center gap-2 font-mono text-[8px] tracking-[0.11em] text-slate-500">
              <ShieldCheck aria-hidden="true" className="text-cyan-200/70" size={13} />
              DECISIONS SHAPE THE NEXT STAGE
            </p>
          </aside>
        </div>

        <p className="mt-5 text-center font-mono text-[8px] tracking-[0.15em] text-slate-700">
          TRAINING SIMULATION // NO REAL PERSONAL DATA
        </p>
      </section>
    </main>
  );
}
