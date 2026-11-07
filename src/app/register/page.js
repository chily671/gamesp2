import RegisterForm from "@/components/registration/RegisterForm";
import { Fingerprint } from "lucide-react";
import Link from "next/link";
import { getDataRetentionDays } from "@/lib/utils/data-retention";

export const metadata = {
  title: "Đăng ký người chơi — DATA TRAP",
  description: "Đăng ký tham gia mô phỏng DATA TRAP.",
};

export default function RegisterPage() {
  let retentionDays = null;
  try {
    retentionDays = getDataRetentionDays();
  } catch {
    retentionDays = null;
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050a13] px-5 py-8 text-slate-100 sm:px-8 sm:py-12">
      <div aria-hidden="true" className="ambient ambient-left" />
      <div aria-hidden="true" className="grid-overlay" />
      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between">
        <Link
          aria-label="DATA TRAP trang chủ"
          className="flex items-center gap-3"
          href="/"
        >
          <span className="brand-mark">
            <Fingerprint aria-hidden="true" size={20} strokeWidth={1.4} />
          </span>
          <span className="font-mono text-sm font-bold tracking-[0.2em] text-white">
            DATA<span className="text-cyan-300">TRAP</span>
          </span>
        </Link>
        <span className="hidden font-mono text-[10px] tracking-[0.16em] text-slate-500 sm:block">
          PLAYER ONBOARDING <span className="text-cyan-300/70">/ 01</span>
        </span>
      </header>

      <section className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 py-14 lg:min-h-[calc(100svh-112px)] lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="max-w-lg">
          <p className="mb-5 flex items-center gap-3 font-mono text-[10px] tracking-[0.2em] text-cyan-200/75 sm:text-xs">
            <span className="h-px w-8 bg-cyan-300/70" />
            INITIATE PLAYER SESSION
          </p>
          <h1 className="text-5xl font-black leading-[0.95] tracking-[-0.06em] text-white sm:text-6xl">
            Bước vào
            <br />
            <span className="text-cyan-300">thế giới số.</span>
          </h1>
          <p className="mt-6 max-w-md text-sm leading-7 text-slate-400 sm:text-base">
            Tạo phiên chơi của bạn. Sau đó, hệ thống sẽ cấp một hồ sơ nhân vật
            hoàn toàn hư cấu để bắt đầu hành trình.
          </p>

          <div className="mt-10 flex items-center gap-4 border-t border-white/[0.08] pt-5">
            <span className="grid h-10 w-10 place-items-center border border-cyan-300/20 bg-cyan-300/[0.05] font-mono text-xs text-cyan-200">
              01
            </span>
            <div>
              <p className="font-mono text-[10px] tracking-[0.15em] text-white">
                PLAYER IDENTITY
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Chỉ dùng để chào bạn trong phiên chơi.
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <span className="grid h-10 w-10 place-items-center border border-white/[0.08] font-mono text-xs text-slate-500">
              02
            </span>
            <div>
              <p className="font-mono text-[10px] tracking-[0.15em] text-slate-300">
                SIMULATED CHARACTER
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Danh tính game tách biệt với thông tin của bạn.
              </p>
            </div>
          </div>
        </div>

        <RegisterForm retentionDays={retentionDays} />
      </section>
    </main>
  );
}
