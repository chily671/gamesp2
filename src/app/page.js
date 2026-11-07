import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  Clock3,
  FileSearch,
  Fingerprint,
  LockKeyhole,
  MessageSquareWarning,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from "lucide-react";

const stages = [
  {
    number: "01",
    title: "THE BAIT",
    question: "Ứng dụng này cần những quyền nào?",
    description: "Cân nhắc mục đích và giới hạn dữ liệu được chia sẻ.",
    icon: Smartphone,
    iconClass: "border-cyan-300/25 bg-cyan-400/[0.08] text-cyan-200",
  },
  {
    number: "02",
    title: "THE BREACH",
    question: "Dấu vết nào đang kể câu chuyện?",
    description: "Khám phá điện thoại và lưu lại ít nhất hai bằng chứng.",
    icon: FileSearch,
    iconClass: "border-blue-300/25 bg-blue-400/[0.08] text-blue-200",
  },
  {
    number: "03",
    title: "THE LAST CHOICE",
    question: "Bạn sẽ ứng phó sự cố ra sao?",
    description: "Dùng bằng chứng và lựa chọn trước để bảo vệ nhân vật.",
    icon: MessageSquareWarning,
    iconClass: "border-violet-300/25 bg-violet-400/[0.08] text-violet-200",
  },
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030816] text-slate-100 selection:bg-cyan-300 selection:text-slate-950">
      <div aria-hidden="true" className="ambient ambient-left" />
      <div aria-hidden="true" className="ambient ambient-right" />
      <div aria-hidden="true" className="grid-overlay" />

      <header className="relative z-10 border-b border-cyan-200/10 bg-[#030816]/85 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-[1500px] items-center justify-between gap-5 px-5 py-4 sm:px-8 lg:px-12">
          <Link
            aria-label="Không gian 2 trang chủ"
            className="flex shrink-0 items-center gap-3"
            href="#top"
          >
            <span className="grid h-10 w-10 place-items-center border border-fuchsia-300/50 bg-fuchsia-400/[0.07] text-fuchsia-200 shadow-[0_0_24px_rgba(217,70,239,0.2)]">
              <ShieldAlert aria-hidden="true" size={23} />
            </span>
            <span>
              <span className="block font-mono text-lg font-black italic tracking-[0.12em] text-white sm:text-xl">
                KHÔNG GIAN <span className="text-cyan-300">2</span>
              </span>
              <span className="block font-mono text-[8px] tracking-[0.23em] text-slate-500 sm:text-[9px]">
                THE DIGITAL IDENTITY RPG
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 border border-cyan-200/10 bg-[#071226]/80 p-1 sm:flex">
            <a className="bg-cyan-300/[0.11] px-5 py-2.5 font-mono text-[10px] tracking-[0.1em] text-cyan-100" href="#top">
              OVERVIEW
            </a>
            <a className="px-5 py-2.5 font-mono text-[10px] tracking-[0.1em] text-slate-400 transition hover:text-white" href="#stages">
              MISSION STAGES
            </a>
          </nav>

          <div className="hidden items-center gap-2 font-mono text-[9px] tracking-[0.12em] text-cyan-100/70 md:flex">
            <span className="status-dot" />
            SIMULATION ONLINE
          </div>
        </div>
      </header>

      <section
        className="relative z-10 mx-auto grid min-h-[calc(100svh-73px)] w-full max-w-[1500px] items-center gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[0.88fr_1.12fr] lg:gap-10 lg:px-12 lg:py-12"
        id="top"
      >
        <div className="relative">
          <div className="mb-6 inline-flex items-center gap-2 border border-cyan-300/20 bg-cyan-300/[0.05] px-3 py-2 font-mono text-[9px] tracking-[0.17em] text-cyan-100/80">
            <Sparkles aria-hidden="true" size={13} />
            STORY INTRO // DIGITAL IDENTITY PROTOCOL
          </div>
          <h1 className="max-w-2xl text-[clamp(2.7rem,6.6vw,6.2rem)] font-black leading-[0.94] tracking-[-0.065em] text-white">
            BẢO VỆ DANH TÍNH SỐ
            <span className="mt-2 block text-glow text-cyan-300">
              GIỮA THẾ GIỚI ĐẦY CẠM BẪY.
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
            Mỗi dấu vết đều kể một câu chuyện. Đồng hành cùng nhân vật, khám phá
            điều đang bị tiết lộ và chọn cách bảo vệ phù hợp.
          </p>

          <div className="mt-7 flex max-w-xl gap-4 border-l-2 border-cyan-300/60 bg-gradient-to-r from-cyan-300/[0.06] to-transparent py-3 pl-4">
            <div className="font-serif text-3xl leading-none text-cyan-200">“</div>
            <div>
              <p className="text-sm leading-6 text-slate-200">
                Hãy tỉnh táo, quan sát kỹ và đưa ra lựa chọn đúng đắn.
              </p>
              <p className="mt-2 font-mono text-[9px] tracking-[0.14em] text-cyan-100/60">
                — AI GUARDIAN
              </p>
            </div>
          </div>

          <div className="mt-8 grid max-w-xl grid-cols-3 border border-cyan-200/15 bg-[#071226]/80">
            {[
              [Clock3, "THỜI LƯỢNG", "3–5 phút"],
              [Fingerprint, "HÀNH TRÌNH", "3 Stage"],
              [ShieldCheck, "MỤC TIÊU", "Bảo vệ dữ liệu"],
            ].map(([Icon, label, value], index) => (
              <div
                className={`min-w-0 px-3 py-4 sm:px-4 ${index ? "border-l border-cyan-200/10" : ""}`}
                key={label}
              >
                <Icon aria-hidden="true" className="mb-3 text-cyan-200" size={17} />
                <p className="font-mono text-[8px] tracking-[0.1em] text-slate-500">
                  {label}
                </p>
                <p className="mt-1 text-[11px] font-semibold text-slate-200 sm:text-xs">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div aria-hidden="true" className="absolute -inset-8 bg-[radial-gradient(ellipse_at_center,rgba(8,145,178,0.16),transparent_68%)]" />
          <div className="relative grid gap-4 xl:grid-cols-[0.76fr_1.24fr]">
            <article className="relative flex min-h-[310px] flex-col justify-between overflow-hidden border border-cyan-200/20 bg-[linear-gradient(145deg,rgba(10,31,60,0.96),rgba(4,11,26,0.98))] p-5 shadow-[0_0_55px_rgba(8,145,178,0.11)] sm:p-7">
              <div aria-hidden="true" className="absolute -right-10 -top-10 h-48 w-48 rounded-full border border-cyan-200/10" />
              <div aria-hidden="true" className="absolute -right-4 -top-4 h-36 w-36 rounded-full border border-dashed border-blue-300/15" />
              <div className="relative">
                <p className="font-mono text-[9px] tracking-[0.18em] text-cyan-200/70">
                  PLAYER ROLE
                </p>
                <h2 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl">
                  DATA
                  <br />
                  <span className="text-cyan-300">GUARDIAN</span>
                </h2>
                <p className="mt-3 max-w-xs text-xs leading-5 text-slate-400">
                  Một hồ sơ nhân vật hư cấu. Một hành trình được định hình bởi
                  chính lựa chọn của bạn.
                </p>
              </div>
              <div className="relative mt-8 border border-cyan-200/20 bg-[#06101f]/85 p-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center border border-cyan-200/35 bg-cyan-300/[0.08] text-cyan-100">
                    <Fingerprint aria-hidden="true" size={27} strokeWidth={1.4} />
                  </span>
                  <div>
                    <p className="font-mono text-[8px] tracking-[0.13em] text-slate-500">
                      IDENTITY CORE
                    </p>
                    <p className="mt-1 text-xs font-semibold text-white">
                      DIGITAL PROFILE // SIMULATED
                    </p>
                  </div>
                  <LockKeyhole aria-hidden="true" className="ml-auto text-cyan-200" size={18} />
                </div>
                <div className="mt-4 h-px bg-gradient-to-r from-cyan-300/50 via-cyan-300/10 to-transparent" />
                <p className="mt-3 font-mono text-[8px] tracking-[0.13em] text-cyan-100/55">
                  YOUR DATA. YOUR IDENTITY. YOUR CHOICE.
                </p>
              </div>
            </article>

            <section
              aria-labelledby="stages-title"
              className="border border-cyan-200/20 bg-[#050d1c]/95 p-4 shadow-[0_0_45px_rgba(8,145,178,0.1)] sm:p-5"
              id="stages"
            >
              <div className="mb-4 flex items-center justify-between border-b border-cyan-200/15 pb-3">
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center border border-cyan-200/35 bg-cyan-300/[0.07] text-cyan-200">
                    <Sparkles aria-hidden="true" size={16} />
                  </span>
                  <div>
                    <p className="font-mono text-[8px] tracking-[0.15em] text-cyan-200/60">
                      STORY MODE // 3 LINKED STAGES
                    </p>
                    <h2 className="mt-1 font-mono text-sm font-bold tracking-[0.1em] text-white" id="stages-title">
                      MISSION STAGES
                    </h2>
                  </div>
                </div>
                <span className="font-mono text-[9px] text-slate-500">01—03</span>
              </div>

              <div className="space-y-3">
                {stages.map(({ number, title, question, description, icon: Icon, iconClass }) => (
                  <article
                    className="group relative grid grid-cols-[42px_58px_1fr_18px] items-center gap-3 overflow-hidden border border-cyan-100/10 bg-[linear-gradient(100deg,rgba(14,32,62,0.82),rgba(5,13,28,0.9))] p-3 transition hover:border-cyan-200/35 hover:bg-cyan-300/[0.04] sm:grid-cols-[46px_68px_1fr_20px] sm:gap-4 sm:p-4"
                    key={number}
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-full border border-cyan-200/50 bg-cyan-300/[0.07] font-mono text-sm font-bold text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.14)]">
                      {number}
                    </span>
                    <span className={`grid h-14 w-[58px] place-items-center border sm:h-16 sm:w-[68px] ${iconClass}`}>
                      <Icon aria-hidden="true" size={26} strokeWidth={1.5} />
                    </span>
                    <div className="min-w-0">
                      <p className="font-mono text-[9px] font-bold tracking-[0.11em] text-cyan-100 sm:text-[10px]">
                        {title}
                      </p>
                      <p className="mt-1 text-[11px] font-medium text-slate-200 sm:text-xs">
                        {question}
                      </p>
                      <p className="mt-1 hidden text-[10px] leading-4 text-slate-500 sm:block">
                        {description}
                      </p>
                    </div>
                    <ChevronRight aria-hidden="true" className="text-cyan-300 transition group-hover:translate-x-1" size={19} />
                  </article>
                ))}
              </div>

              <Link
                className="group mt-4 flex min-h-14 items-center justify-center gap-3 border border-amber-200/70 bg-[linear-gradient(180deg,#ffe861,#ffb800)] px-5 font-mono text-xs font-black tracking-[0.13em] text-[#17100a] shadow-[0_0_28px_rgba(251,191,36,0.2)] transition hover:-translate-y-0.5 hover:shadow-[0_0_38px_rgba(251,191,36,0.35)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-200"
                href="/register"
              >
                BẮT ĐẦU HÀNH TRÌNH
                <ArrowRight aria-hidden="true" className="transition group-hover:translate-x-1" size={17} />
              </Link>
              <p className="mt-3 flex items-center justify-center gap-2 text-center text-[10px] leading-5 text-slate-500">
                <ShieldCheck aria-hidden="true" className="shrink-0 text-cyan-200" size={14} />
                Hồ sơ nhân vật và mọi dữ liệu trong game đều là mô phỏng.
              </p>
            </section>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-cyan-200/10 bg-[#030816]/80 px-5 py-4 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-2 font-mono text-[8px] tracking-[0.15em] text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:text-[9px]">
          <span>KHÔNG GIAN 2 // DIGITAL IDENTITY RPG</span>
          <span>SIMULATION ONLY · NO REAL CREDENTIALS</span>
        </div>
      </footer>
    </main>
  );
}
