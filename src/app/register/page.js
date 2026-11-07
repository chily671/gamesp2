import Link from "next/link";
import {
  Activity,
  Fingerprint,
  Orbit,
  ShieldAlert,
  Signal,
} from "lucide-react";
import RegisterForm from "@/components/registration/RegisterForm";
import { getDataRetentionDays } from "@/lib/utils/data-retention";

export const metadata = {
  title: "Kết nối người chơi — DATA TRAP",
  description: "Kết nối vào mô phỏng điều tra danh tính số DATA TRAP.",
};

function GuardianAvatar() {
  return (
    <div className="relative mx-auto h-44 w-44 shrink-0 sm:h-48 sm:w-48 lg:h-52 lg:w-52">
      <div className="absolute inset-2 rounded-full border border-cyan-200/20" />
      <div className="absolute inset-5 rounded-full border border-dashed border-blue-200/25 [animation:orbit-spin_42s_linear_infinite]" />
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.22),rgba(59,130,246,0.13)_42%,transparent_72%)] blur-md" />
      <svg
        aria-hidden="true"
        className="absolute inset-[8%] h-[84%] w-[84%] drop-shadow-[0_0_24px_rgba(34,211,238,0.24)]"
        fill="none"
        viewBox="0 0 220 220"
      >
        <defs>
          <linearGradient id="guardian-hood" x1="42" x2="184" y1="49" y2="191" gradientUnits="userSpaceOnUse">
            <stop stopColor="#2563EB" stopOpacity=".84" />
            <stop offset=".48" stopColor="#14254E" />
            <stop offset="1" stopColor="#070B1B" />
          </linearGradient>
          <linearGradient id="guardian-face" x1="82" x2="145" y1="82" y2="158" gradientUnits="userSpaceOnUse">
            <stop stopColor="#152C59" />
            <stop offset="1" stopColor="#080F26" />
          </linearGradient>
          <linearGradient id="guardian-cape" x1="48" x2="172" y1="154" y2="220" gradientUnits="userSpaceOnUse">
            <stop stopColor="#123B70" />
            <stop offset=".55" stopColor="#101A3D" />
            <stop offset="1" stopColor="#090D20" />
          </linearGradient>
        </defs>
        <path d="M37 213c3-37 18-61 47-72h52c29 11 44 35 47 72H37Z" fill="url(#guardian-cape)" stroke="#4DEBFF" strokeOpacity=".78" strokeWidth="2" />
        <path d="M58 148c1-52 17-92 52-103 35 11 51 51 52 103l-19 22H77l-19-22Z" fill="url(#guardian-hood)" stroke="#69E7FF" strokeOpacity=".9" strokeWidth="2" />
        <path d="M76 91c5-25 16-39 34-43 18 4 29 18 34 43l-8 54c-5 18-13 28-26 31-13-3-21-13-26-31l-8-54Z" fill="url(#guardian-face)" stroke="#548CDB" strokeOpacity=".7" strokeWidth="1.5" />
        <path d="m82 108 20-5-7 8-13 2v-5Zm56 0-20-5 7 8 13 2v-5Z" fill="#6AF4FF" />
        <path d="m84 108 17-3-6 7-11 1v-5Zm52 0-17-3 6 7 11 1v-5Z" fill="#A9FAFF" />
        <path d="M76 92c9-22 19-33 34-37 15 4 25 15 34 37l10-23c-7-27-23-42-44-44-21 2-37 17-44 44l10 23Z" fill="#090D20" stroke="#487CCF" strokeOpacity=".8" strokeWidth="2" />
        <path d="M52 160c21 11 39 15 58 15s37-4 58-15M64 178c17 10 32 14 46 14s29-4 46-14" stroke="#36DDF4" strokeOpacity=".55" strokeWidth="2" />
        <path d="m48 134 16 6m108-6-16 6" stroke="#F0A5FF" strokeOpacity=".8" strokeWidth="2" />
        <circle cx="110" cy="27" r="3" fill="#B5FAFF" />
      </svg>
      <span className="absolute bottom-1 left-1/2 h-2 w-24 -translate-x-1/2 rounded-full bg-cyan-300/45 blur-md" />
    </div>
  );
}

function CityBackdrop() {
  const towers = [
    { left: "0%", width: "9%", height: "43%" },
    { left: "8%", width: "8%", height: "63%" },
    { left: "16%", width: "10%", height: "37%" },
    { left: "27%", width: "8%", height: "57%" },
    { left: "36%", width: "10%", height: "46%" },
    { left: "48%", width: "7%", height: "72%" },
    { left: "57%", width: "11%", height: "50%" },
    { left: "69%", width: "8%", height: "64%" },
    { left: "78%", width: "11%", height: "42%" },
    { left: "89%", width: "11%", height: "59%" },
  ];

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] overflow-hidden opacity-45">
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#030612] to-transparent" />
      {towers.map((tower, towerIndex) => (
        <div
          className="absolute bottom-0 border-x border-t border-blue-300/20 bg-[linear-gradient(90deg,rgba(5,13,31,0.8),rgba(23,43,83,0.55),rgba(5,12,29,0.88))]"
          key={tower.left}
          style={{ height: tower.height, left: tower.left, width: tower.width }}
        >
          <div className="grid h-full grid-cols-3 content-start gap-x-1 gap-y-2 p-1.5 pt-3 sm:p-2 sm:pt-4">
            {Array.from({ length: 18 }, (_, windowIndex) => (
              <span
                className={`h-1 w-1 sm:h-1.5 sm:w-1.5 ${((towerIndex + windowIndex) % 4) === 0 ? "bg-cyan-200/80 shadow-[0_0_8px_rgba(34,211,238,0.8)]" : ((towerIndex + windowIndex) % 7) === 0 ? "bg-fuchsia-200/60" : "bg-blue-200/20"}`}
                key={windowIndex}
              />
            ))}
          </div>
        </div>
      ))}
      <div className="absolute inset-x-[-10%] bottom-7 h-20 -skew-y-[8deg] rounded-[50%] border-t border-cyan-200/45 shadow-[0_-8px_32px_rgba(34,211,238,0.15)]" />
      <div className="absolute inset-x-[-10%] bottom-0 h-24 skew-y-[5deg] rounded-[50%] border-t border-violet-300/30" />
    </div>
  );
}

export default function RegisterPage() {
  let retentionDays = null;
  try {
    retentionDays = getDataRetentionDays();
  } catch {
    retentionDays = null;
  }

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#030612] text-slate-100">
      <div aria-hidden="true" className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_52%_42%,rgba(19,63,131,0.4),transparent_44%),radial-gradient(ellipse_at_12%_45%,rgba(88,28,135,0.17),transparent_31%),radial-gradient(ellipse_at_88%_44%,rgba(8,145,178,0.15),transparent_32%),linear-gradient(180deg,#040713_0%,#09142b_58%,#030612_100%)]" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 opacity-30 [background-image:linear-gradient(rgba(67,110,191,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(67,110,191,0.1)_1px,transparent_1px)] [background-size:52px_52px] [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_82%,transparent)]" />
      <div aria-hidden="true" className="scan-beam pointer-events-none absolute inset-x-0 top-[22%] z-0 h-px bg-gradient-to-r from-transparent via-cyan-100/35 to-transparent" />
      <CityBackdrop />

      <header className="relative z-10 mx-auto flex w-full max-w-[1500px] items-center justify-between border-b border-cyan-100/10 px-4 py-3 sm:px-7 sm:py-4 lg:px-10">
        <Link
          aria-label="DATA TRAP trang chủ"
          className="flex items-center gap-2 sm:gap-3"
          href="/"
        >
          <span className="grid h-9 w-9 place-items-center border border-fuchsia-300/45 bg-fuchsia-300/[0.06] text-fuchsia-200 shadow-[0_0_20px_rgba(217,70,239,0.18)] sm:h-10 sm:w-10">
            <ShieldAlert aria-hidden="true" size={21} />
          </span>
          <span>
            <span className="block font-mono text-sm font-black italic tracking-[0.14em] text-white sm:text-base">
              DATA <span className="text-cyan-300">TRAP</span>
            </span>
            <span className="hidden font-mono text-[8px] tracking-[0.18em] text-slate-500 sm:block">
              THE DIGITAL IDENTITY RPG
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-3 font-mono text-[8px] tracking-[0.12em] sm:gap-5">
          <span className="hidden items-center gap-2 text-slate-500 sm:flex">
            <Activity aria-hidden="true" className="text-cyan-200" size={13} />
            UPLINK PROTOCOL // 01
          </span>
          <span className="flex items-center gap-2 border border-cyan-200/15 bg-cyan-200/[0.035] px-2.5 py-2 text-cyan-100/75 sm:px-3">
            <Signal aria-hidden="true" size={13} />
            CONNECTION READY
          </span>
        </div>
      </header>

      <section className="relative z-10 mx-auto grid min-h-[calc(100svh-65px)] w-full max-w-[1500px] items-center gap-4 px-4 pb-6 pt-5 sm:gap-6 sm:px-7 sm:pb-8 sm:pt-7 lg:grid-cols-[minmax(230px,0.82fr)_minmax(300px,1.08fr)_minmax(300px,0.96fr)] lg:gap-5 lg:px-10 xl:gap-8">
        <aside className="relative order-1 flex items-center gap-3 border border-cyan-200/20 bg-[linear-gradient(145deg,rgba(8,27,57,0.66),rgba(6,11,27,0.8))] p-3 shadow-[0_0_34px_rgba(34,211,238,0.08)] sm:gap-5 sm:p-4 lg:min-h-[470px] lg:flex-col lg:justify-center lg:gap-1 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none">
          <div aria-hidden="true" className="absolute left-0 top-0 h-8 w-8 border-l border-t border-cyan-200/60 lg:hidden" />
          <GuardianAvatar />
          <div className="min-w-0 flex-1 lg:w-full lg:flex-none lg:text-center">
            <p className="flex items-center gap-2 font-mono text-[8px] tracking-[0.17em] text-cyan-100/60 lg:justify-center sm:text-[9px]">
              <span className="status-dot" />
              AI GUARDIAN // ONLINE
            </p>
            <h1 className="mt-1 text-sm font-bold tracking-wide text-white sm:text-lg">
              Người dẫn đường của bạn
            </h1>
            <p className="mt-2 max-w-sm text-[10px] leading-5 text-slate-300 sm:text-xs sm:leading-6 lg:mx-auto">
              “Kết nối với tôi để mở một hồ sơ nhân vật mô phỏng. Chúng ta sẽ
              cùng lần theo những dấu vết số.”
            </p>
            <p className="mt-2 hidden font-mono text-[8px] tracking-[0.1em] text-cyan-100/50 lg:block">
              TRUSTED GUIDE // TRAINING SIMULATION
            </p>
          </div>
        </aside>

        <section aria-label="Quét danh tính mô phỏng" className="relative order-2 mx-auto flex min-h-[220px] w-full max-w-[470px] items-center justify-center sm:min-h-[260px] lg:min-h-[500px]">
          <div aria-hidden="true" className="absolute inset-[4%] rounded-full border border-cyan-200/10" />
          <div aria-hidden="true" className="absolute inset-[12%] rounded-full border border-dashed border-blue-200/20 [animation:orbit-spin_55s_linear_infinite]" />
          <div aria-hidden="true" className="absolute inset-[21%] rounded-full border border-cyan-200/15" />
          <div aria-hidden="true" className="absolute inset-[27%] rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.15),rgba(59,130,246,0.12)_45%,transparent_72%)] blur-xl" />
          <div aria-hidden="true" className="absolute left-1/2 top-1/2 h-[78%] w-px -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-transparent via-cyan-200/20 to-transparent" />
          <div aria-hidden="true" className="absolute left-1/2 top-1/2 h-px w-[78%] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-cyan-200/20 to-transparent" />

          <div className="identity-core relative z-10 w-[min(74%,310px)] border border-cyan-100/45 bg-[linear-gradient(145deg,rgba(10,32,63,0.85),rgba(5,12,29,0.93))] p-4 shadow-[0_0_45px_rgba(34,211,238,0.16),inset_0_0_35px_rgba(34,211,238,0.04)] backdrop-blur-md sm:p-5">
            <div aria-hidden="true" className="absolute -left-px -top-px h-7 w-7 border-l-2 border-t-2 border-cyan-100" />
            <div aria-hidden="true" className="absolute -bottom-px -right-px h-7 w-7 border-b-2 border-r-2 border-blue-200" />
            <div className="flex items-center justify-between border-b border-cyan-100/15 pb-2">
              <p className="font-mono text-[8px] tracking-[0.15em] text-cyan-100/65">
                IDENTITY SCANNER
              </p>
              <Orbit aria-hidden="true" className="text-cyan-200/70" size={14} />
            </div>

            <div className="relative mt-3 overflow-hidden border border-blue-100/15 bg-[#050b1a]/85 p-3 sm:p-4">
              <div aria-hidden="true" className="scan-beam absolute inset-x-0 top-1/3 z-10 h-px bg-gradient-to-r from-transparent via-cyan-100 to-transparent shadow-[0_0_12px_2px_rgba(34,211,238,0.52)]" />
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 shrink-0 place-items-center border border-cyan-200/30 bg-cyan-300/[0.06] text-cyan-100 sm:h-14 sm:w-14">
                  <Fingerprint aria-hidden="true" size={31} strokeWidth={1.2} />
                </span>
                <div className="min-w-0">
                  <p className="font-mono text-[8px] tracking-[0.12em] text-blue-100/50">
                    PLAYER SIGNATURE
                  </p>
                  <p className="mt-1 truncate font-mono text-[10px] font-bold tracking-[0.08em] text-white sm:text-xs">
                    UNREGISTERED
                  </p>
                  <p className="mt-1 font-mono text-[8px] text-cyan-100/60">
                    AWAITING SECURE LINK...
                  </p>
                </div>
              </div>

              <div className="mt-4 border-t border-cyan-100/10 pt-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-mono text-[8px] tracking-[0.13em] text-slate-500">
                    ASSIGNED CHARACTER
                  </p>
                  <span className="border border-blue-200/15 px-1.5 py-1 font-mono text-[7px] text-blue-100/55">
                    SEALED
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2 opacity-55">
                  <span className="grid h-8 w-8 place-items-center border border-blue-100/20 bg-blue-200/[0.04] text-blue-100/70">
                    <Fingerprint aria-hidden="true" size={17} />
                  </span>
                  <div className="flex-1">
                    <div className="h-1.5 w-3/4 bg-blue-100/15" />
                    <div className="mt-1.5 h-1 w-1/2 bg-blue-100/10" />
                  </div>
                  <span className="font-mono text-[7px] text-cyan-100/55">CHAR-???</span>
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between font-mono text-[7px] tracking-[0.1em] text-slate-500">
              <span>FICTIONAL IDENTITY ONLY</span>
              <span className="flex items-center gap-1 text-cyan-100/60">
                <span className="status-dot" />
                READY TO SCAN
              </span>
            </div>
          </div>

          <span className="absolute left-[8%] top-[23%] hidden border border-cyan-200/15 bg-[#071226]/75 px-2 py-1 font-mono text-[7px] tracking-[0.1em] text-cyan-100/55 sm:block">
            ID HASH // PENDING
          </span>
          <span className="absolute bottom-[19%] right-[4%] hidden border border-blue-200/15 bg-[#071226]/75 px-2 py-1 font-mono text-[7px] tracking-[0.1em] text-blue-100/55 sm:block">
            ENCRYPTED SIMULATION
          </span>
        </section>

        <RegisterForm retentionDays={retentionDays} />

        <footer className="relative order-4 col-span-full flex items-center justify-between border-t border-cyan-100/10 pt-3 font-mono text-[7px] tracking-[0.12em] text-slate-600 sm:text-[8px]">
          <span>DATA TRAP // SECURE TRAINING ENVIRONMENT</span>
          <span className="hidden items-center gap-2 sm:flex">
            <Signal aria-hidden="true" size={12} />
            NO REAL CHARACTER DATA
          </span>
        </footer>
      </section>
    </main>
  );
}
