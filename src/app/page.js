import {
  ArrowUpRight,
  ArrowRight,
  AudioLines,
  Fingerprint,
  LockKeyhole,
  Orbit,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Waves,
} from "lucide-react";

const protocols = [
  {
    number: "01",
    title: "IDENTITY",
    description: "Một danh tính giả lập. Một câu chuyện của riêng bạn.",
    icon: Fingerprint,
  },
  {
    number: "02",
    title: "INVESTIGATE",
    description: "Tìm những dấu vết dữ liệu ẩn trong thế giới số.",
    icon: ScanLine,
  },
  {
    number: "03",
    title: "PROTECT",
    description: "Mỗi lựa chọn đều giúp nhân vật an toàn hơn.",
    icon: ShieldCheck,
  },
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050a13] text-slate-100 selection:bg-cyan-300 selection:text-slate-950">
      <div aria-hidden="true" className="ambient ambient-left" />
      <div aria-hidden="true" className="ambient ambient-right" />
      <div aria-hidden="true" className="grid-overlay" />

      <header className="relative z-10 mx-auto flex w-full max-w-[1440px] items-center justify-between px-6 py-6 sm:px-10 lg:px-16">
        <a
          aria-label="DATA TRAP trang chủ"
          className="flex items-center gap-3"
          href="#top"
        >
          <span className="brand-mark">
            <Orbit aria-hidden="true" size={21} strokeWidth={1.7} />
          </span>
          <span className="font-mono text-sm font-bold tracking-[0.2em] text-white">
            DATA<span className="text-cyan-300">TRAP</span>
          </span>
        </a>

        <div className="hidden items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/[0.04] px-4 py-2 font-mono text-[10px] tracking-[0.16em] text-cyan-100/70 sm:flex">
          <span className="status-dot" />
          SIMULATION ENVIRONMENT
        </div>
        <div className="font-mono text-[10px] tracking-[0.16em] text-slate-500">
          SYSTEM 01 <span className="text-cyan-300/70">/ ONLINE</span>
        </div>
      </header>

      <section
        className="relative z-10 mx-auto grid min-h-[calc(100svh-88px)] w-full max-w-[1440px] items-center gap-14 px-6 pb-20 pt-10 sm:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:px-16 lg:pb-24 lg:pt-4"
        id="top"
      >
        <div className="relative max-w-2xl">
          <div className="mb-7 inline-flex items-center gap-3 font-mono text-[10px] tracking-[0.2em] text-cyan-200/75 sm:text-xs">
            <span className="h-px w-8 bg-cyan-300/70" />
            THE DIGITAL IDENTITY RPG
          </div>

          <h1 className="max-w-[740px] text-[clamp(4rem,11vw,8.75rem)] font-black leading-[0.79] tracking-[-0.085em] text-white">
            YOUR DATA.
            <br />
            <span className="text-glow text-cyan-300">YOUR</span>
            <br />
            IDENTITY.
          </h1>

          <div className="mt-9 flex max-w-xl gap-4">
            <span className="mt-1 h-11 w-[2px] shrink-0 bg-gradient-to-b from-cyan-300 to-transparent" />
            <div>
              <p className="text-sm leading-7 text-slate-300 sm:text-base">
                Một thế giới được tạo nên từ dữ liệu. Bốn nhiệm vụ để bảo vệ
                danh tính số.
              </p>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.17em] text-slate-500 sm:text-xs">
                YOUR DATA. YOUR IDENTITY. YOUR CHOICE.
              </p>
            </div>
          </div>

          <a
            className="group mt-10 inline-flex min-h-14 items-center justify-center gap-4 border border-cyan-200/50 bg-cyan-300 px-7 font-mono text-xs font-bold tracking-[0.15em] text-[#06101b] shadow-[0_0_34px_rgba(34,211,238,0.16)] transition duration-300 hover:-translate-y-0.5 hover:border-cyan-100 hover:bg-cyan-200 hover:shadow-[0_0_48px_rgba(34,211,238,0.3)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-200"
            href="/register"
          >
            BẮT ĐẦU NHIỆM VỤ
            <ArrowRight
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
              size={16}
            />
          </a>
          <p className="mt-4 font-mono text-[10px] tracking-[0.1em] text-slate-500">
            4 STAGES <span className="px-2 text-cyan-300/60">/</span> 3–5
            MINUTES <span className="px-2 text-cyan-300/60">/</span> ALL DATA
            IS SIMULATED
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-[510px] lg:ml-auto lg:mr-0">
          <div aria-hidden="true" className="scanner-ring scanner-ring-outer" />
          <div aria-hidden="true" className="scanner-ring scanner-ring-inner" />
          <div aria-hidden="true" className="orbit orbit-one">
            <span />
          </div>
          <div aria-hidden="true" className="orbit orbit-two">
            <span />
          </div>

          <div className="relative z-10 mx-auto aspect-square w-[min(76vw,420px)]">
            <div className="absolute inset-[8%] rounded-full border border-cyan-300/15" />
            <div className="absolute inset-[16%] rounded-full border border-dashed border-cyan-200/15" />
            <div className="absolute inset-[24%] rounded-full bg-[radial-gradient(circle,rgba(8,145,178,0.18),rgba(7,14,27,0.1)_62%,transparent_70%)]" />
            <div className="absolute inset-[29%] rounded-full border border-cyan-300/30 shadow-[inset_0_0_40px_rgba(34,211,238,0.07),0_0_50px_rgba(34,211,238,0.08)]" />

            <div className="scan-beam absolute inset-x-[15%] top-[39%] z-20 h-px bg-gradient-to-r from-transparent via-cyan-200 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="identity-core flex h-[42%] w-[42%] flex-col items-center justify-center rounded-full border border-cyan-100/40 bg-[#091525]/90 shadow-[0_0_70px_rgba(6,182,212,0.18)]">
                <Fingerprint
                  aria-hidden="true"
                  className="text-cyan-200"
                  size={68}
                  strokeWidth={1}
                />
                <span className="mt-3 font-mono text-[9px] tracking-[0.24em] text-cyan-100/70">
                  IDENTITY CORE
                </span>
              </div>
            </div>

            <div className="absolute left-[8%] top-[27%] flex items-center gap-2 rounded border border-cyan-300/15 bg-[#08111e]/90 px-3 py-2 font-mono text-[9px] tracking-[0.1em] text-cyan-100/70 backdrop-blur">
              <LockKeyhole aria-hidden="true" size={13} />
              PRIVATE DATA
            </div>
            <div className="absolute bottom-[24%] right-[4%] flex items-center gap-2 rounded border border-cyan-300/15 bg-[#08111e]/90 px-3 py-2 font-mono text-[9px] tracking-[0.1em] text-cyan-100/70 backdrop-blur">
              <AudioLines aria-hidden="true" size={13} />
              SIGNAL DETECTED
            </div>
            <div className="absolute right-[12%] top-[18%] text-cyan-300/50">
              <Sparkles aria-hidden="true" size={17} />
            </div>
            <div className="absolute bottom-[14%] left-[22%] text-cyan-300/40">
              <Waves aria-hidden="true" size={19} />
            </div>
          </div>

          <div className="absolute left-0 top-[8%] hidden font-mono text-[9px] leading-5 tracking-[0.1em] text-slate-600 sm:block">
            <div>SECURE ZONE</div>
            <div className="text-cyan-300/60">● ● ●</div>
          </div>
          <div className="absolute bottom-[4%] right-0 hidden text-right font-mono text-[9px] leading-5 tracking-[0.1em] text-slate-600 sm:block">
            <div>TRACE: 00x-7F</div>
            <div>ENCRYPTED SIMULATION</div>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="protocol-title"
        className="relative z-10 border-t border-white/[0.07] bg-[#080f1c]/85 px-6 py-16 sm:px-10 lg:px-16 lg:py-20"
        id="protocol"
      >
        <div className="mx-auto max-w-[1280px]">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="mb-3 font-mono text-[10px] tracking-[0.2em] text-cyan-300/70">
                MISSION PROTOCOL <span className="text-slate-600">/ 001</span>
              </p>
              <h2
                className="text-2xl font-semibold tracking-tight text-white sm:text-3xl"
                id="protocol-title"
              >
                Danh tính của bạn.{" "}
                <span className="text-slate-400">Nhiệm vụ của bạn.</span>
              </h2>
            </div>
            <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.14em] text-slate-500">
              <span className="status-dot" />
              TRAINING SIMULATION
            </div>
          </div>

          <div className="mt-10 grid gap-3 md:grid-cols-3">
            {protocols.map(({ number, title, description, icon: Icon }) => (
              <article
                className="group relative overflow-hidden border border-white/[0.08] bg-white/[0.02] p-6 transition duration-300 hover:border-cyan-200/25 hover:bg-cyan-200/[0.035] sm:p-7"
                key={number}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] tracking-[0.17em] text-cyan-300/60">
                    PROTOCOL {number}
                  </span>
                  <Icon
                    aria-hidden="true"
                    className="text-cyan-200/70 transition group-hover:text-cyan-100"
                    size={19}
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="mt-9 font-mono text-sm font-bold tracking-[0.16em] text-white">
                  {title}
                </h3>
                <p className="mt-3 max-w-xs text-sm leading-6 text-slate-400">
                  {description}
                </p>
                <ArrowUpRight
                  aria-hidden="true"
                  className="absolute bottom-6 right-6 text-slate-700 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-cyan-200"
                  size={16}
                />
              </article>
            ))}
          </div>

          <p className="mt-8 border-l border-cyan-300/40 pl-4 text-xs leading-6 text-slate-500">
            DATA TRAP là mô phỏng giáo dục. Mọi nhân vật và thông tin trong
            game đều là dữ liệu hư cấu; không nhập mật khẩu hay thông tin nhạy
            cảm thật.
          </p>
        </div>
      </section>

      <footer className="relative z-10 flex flex-col gap-3 border-t border-white/[0.06] px-6 py-5 font-mono text-[9px] tracking-[0.12em] text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-16">
        <span>DATA TRAP // DIGITAL IDENTITY RPG</span>
        <span>YOUR DATA. YOUR IDENTITY. YOUR CHOICE.</span>
      </footer>
    </main>
  );
}
