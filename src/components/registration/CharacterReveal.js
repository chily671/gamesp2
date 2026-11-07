"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Banknote,
  Fingerprint,
  Heart,
  Home,
  MapPin,
  ShieldAlert,
  Smartphone,
  Sparkles,
  UserRound,
  UsersRound,
  Wifi,
} from "lucide-react";

const groups = [
  {
    title: "PERSONAL IDENTITY",
    icon: UserRound,
    fields: (character) => [
      ["Độ tuổi", `${character.age} — nhân vật mô phỏng`],
      ["Giới tính", character.gender],
      ["Lớp", character.className],
      ["Trường học", character.school],
      ["Tình trạng quan hệ", character.relationshipStatus],
    ],
  },
  {
    title: "CONTACT INFORMATION",
    icon: Smartphone,
    fields: (character) => [
      ["Số điện thoại", character.contact.phone],
      ["Email", character.contact.email],
      ["Nơi ở", character.address],
      ["Loại nhà ở", character.housing],
    ],
  },
  {
    title: "SOCIAL ACCOUNTS",
    icon: Fingerprint,
    fields: (character) => [
      ["Tài khoản mạng xã hội", character.socialAccounts.facebookUsername],
      ["Mật khẩu mô phỏng", character.socialAccounts.maskedPassword],
    ],
  },
  {
    title: "FINANCIAL INFORMATION",
    icon: Banknote,
    fields: (character) => [
      [
        "Số dư giả lập",
        `${new Intl.NumberFormat("vi-VN").format(character.financialInfo.simulatedBalance)} ${character.financialInfo.currencyLabel}`,
      ],
    ],
  },
  {
    title: "LIFESTYLE",
    icon: Heart,
    fields: (character) => [
      ["Sở thích", character.lifestyle.hobbies.join(" · ")],
      ["Thói quen", character.lifestyle.habits.join(" · ")],
      ["Địa điểm thường lui tới", character.lifestyle.frequentPlaces.join(" · ")],
      ["Gia đình", character.familyMembers.join(" · ")],
      ["Tóm tắt", character.lifestyle.summary],
    ],
  },
  {
    title: "DIGITAL FOOTPRINT",
    icon: Wifi,
    fields: (character) =>
      character.digitalFootprint.map((footprint, index) => [
        `Dấu vết 0${index + 1}`,
        footprint,
      ]),
  },
];

function LoadingPanel({ message, isError = false }) {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#050a13] px-6 text-slate-100">
      <div aria-hidden="true" className="ambient ambient-left" />
      <div className="relative z-10 max-w-md text-center">
        <div className="identity-core mx-auto grid h-20 w-20 place-items-center rounded-full border border-cyan-200/35 bg-cyan-300/[0.04] text-cyan-200">
          <Fingerprint aria-hidden="true" size={38} strokeWidth={1.2} />
        </div>
        <p className="mt-7 font-mono text-xs tracking-[0.17em] text-cyan-200/80">
          {message}
        </p>
        {isError && (
          <Link
            className="mt-6 inline-flex min-h-12 items-center justify-center border border-cyan-200/30 px-5 font-mono text-[10px] tracking-[0.12em] text-cyan-100 transition hover:bg-cyan-200/10"
            href="/register"
          >
            BẮT ĐẦU LƯỢT CHƠI MỚI
          </Link>
        )}
      </div>
    </main>
  );
}

export default function CharacterReveal() {
  const [session, setSession] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadSession() {
      try {
        const response = await fetch("/api/sessions/current", {
          cache: "no-store",
        });
        const result = await response.json();

        if (!response.ok) {
          if (active) {
            setErrorMessage(
              result.error ?? "Phiên chơi không hợp lệ hoặc đã hết hạn.",
            );
          }
          return;
        }

        if (active) {
          setSession(result);
        }
      } catch {
        if (active) {
          setErrorMessage("Không thể kết nối đến máy chủ. Hãy thử tải lại.");
        }
      }
    }

    loadSession();
    return () => {
      active = false;
    };
  }, []);

  if (errorMessage) {
    return <LoadingPanel isError message={errorMessage} />;
  }

  if (!session) {
    return <LoadingPanel message="ĐANG KHỞI TẠO DANH TÍNH SỐ..." />;
  }

  const { player, character } = session;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050a13] px-5 py-8 text-slate-100 sm:px-8 sm:py-10">
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
        <span className="hidden items-center gap-2 font-mono text-[10px] tracking-[0.14em] text-emerald-200/70 sm:flex">
          <span className="status-dot" />
          IDENTITY ISSUED
        </span>
      </header>

      <section className="relative z-10 mx-auto w-full max-w-6xl pb-12 pt-10">
        <Link
          className="inline-flex min-h-10 items-center gap-2 font-mono text-[10px] tracking-[0.13em] text-slate-500 transition hover:text-cyan-200"
          href="/register"
        >
          <ArrowLeft aria-hidden="true" size={14} />
          PLAYER REGISTRATION
        </Link>

        <div className="mt-7 grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-12">
          <aside className="h-fit border border-cyan-200/20 bg-[#091321]/90 p-6 sm:p-8 lg:sticky lg:top-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[9px] tracking-[0.18em] text-cyan-200/65">
                  DIGITAL IDENTITY CARD
                </p>
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-white">
                  {character.characterName}
                </h1>
              </div>
              <span className="grid h-12 w-12 shrink-0 place-items-center border border-cyan-200/25 bg-cyan-200/[0.05] text-cyan-200">
                <Fingerprint aria-hidden="true" size={28} strokeWidth={1.2} />
              </span>
            </div>
            <p className="mt-3 font-mono text-[10px] tracking-[0.14em] text-cyan-200/80">
              {character.persona}
            </p>

            <div className="my-7 h-px bg-gradient-to-r from-cyan-200/35 via-cyan-200/10 to-transparent" />

            <p className="text-sm leading-6 text-slate-300">
              Chào {player.fullName} — {player.className}. Bạn vừa nhận được
              một danh tính số mới.
            </p>
            <div className="mt-5 flex items-start gap-3 border border-emerald-200/15 bg-emerald-200/[0.035] p-3">
              <Sparkles
                aria-hidden="true"
                className="mt-0.5 shrink-0 text-emerald-200"
                size={15}
              />
              <p className="text-xs leading-5 text-emerald-100/75">
                Hồ sơ này hoàn toàn hư cấu, được tạo riêng cho trò chơi. Không
                có thông tin thật của bạn trong đây.
              </p>
            </div>

            <div className="mt-6 space-y-3 text-xs text-slate-400">
              <p className="flex items-center gap-2">
                <MapPin
                  aria-hidden="true"
                  className="shrink-0 text-cyan-200/70"
                  size={14}
                />
                {character.address}
              </p>
              <p className="flex items-center gap-2">
                <Home
                  aria-hidden="true"
                  className="shrink-0 text-cyan-200/70"
                  size={14}
                />
                {character.housing}
              </p>
              <p className="flex items-center gap-2">
                <UsersRound
                  aria-hidden="true"
                  className="shrink-0 text-cyan-200/70"
                  size={14}
                />
                {character.familyMembers.length} thành viên gia đình mô phỏng
              </p>
            </div>
          </aside>

          <div className="min-w-0">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="font-mono text-[9px] tracking-[0.18em] text-cyan-200/65">
                  PROFILE SCAN
                </p>
                <h2 className="mt-2 text-xl font-semibold text-white">
                  Những gì thế giới số biết về nhân vật
                </h2>
              </div>
              <span className="hidden shrink-0 font-mono text-[9px] text-slate-600 sm:block">
                DEMO ID: {character.characterCode}
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {groups.map(({ title, icon: Icon, fields }) => (
                <details
                  className="group border border-white/[0.09] bg-white/[0.02] open:border-cyan-200/25 open:bg-cyan-100/[0.025] sm:last:col-span-2"
                  key={title}
                  open={title === "PERSONAL IDENTITY"}
                >
                  <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
                    <span className="flex min-w-0 items-center gap-3">
                      <Icon
                        aria-hidden="true"
                        className="shrink-0 text-cyan-200/70"
                        size={17}
                        strokeWidth={1.5}
                      />
                      <span className="font-mono text-[9px] tracking-[0.1em] text-slate-200">
                        {title}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="font-mono text-xs text-cyan-200/50 transition-transform group-open:rotate-90"
                    >
                      ›
                    </span>
                  </summary>
                  <div className="space-y-3 border-t border-white/[0.07] px-4 py-4">
                    {fields(character).map(([label, value]) => (
                      <div
                        className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-4"
                        key={label}
                      >
                        <span className="shrink-0 text-[11px] text-slate-500">
                          {label}
                        </span>
                        <span className="break-words text-xs leading-5 text-slate-200 sm:text-right">
                          {value}
                        </span>
                      </div>
                    ))}
                    {title === "SOCIAL ACCOUNTS" && (
                      <p className="flex items-center gap-2 border-t border-white/[0.06] pt-3 font-mono text-[9px] tracking-[0.08em] text-amber-200/70">
                        <ShieldAlert aria-hidden="true" size={13} />
                        DEMO ONLY — KHÔNG THỂ ĐĂNG NHẬP
                      </p>
                    )}
                    {title === "FINANCIAL INFORMATION" && (
                      <p className="flex items-center gap-2 border-t border-white/[0.06] pt-3 font-mono text-[9px] tracking-[0.08em] text-amber-200/70">
                        <Banknote aria-hidden="true" size={13} />
                        SỐ DƯ MÔ PHỎNG — KHÔNG PHẢI TIỀN THẬT
                      </p>
                    )}
                  </div>
                </details>
              ))}
            </div>

            <div className="mt-6 flex items-start gap-3 border-l border-rose-300/40 bg-rose-300/[0.025] px-4 py-3">
              <ShieldAlert
                aria-hidden="true"
                className="mt-0.5 shrink-0 text-rose-200/80"
                size={16}
              />
              <div>
                <p className="font-mono text-[9px] tracking-[0.13em] text-rose-100/80">
                  POTENTIAL RISK SIGNALS
                </p>
                <ul className="mt-2 space-y-2">
                  {character.riskFactors.map((risk) => (
                    <li
                      className="text-xs leading-5 text-slate-400"
                      key={risk}
                    >
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="mt-6 text-center font-mono text-[9px] tracking-[0.12em] text-slate-600">
              PROFILE REVEAL COMPLETE <span className="text-cyan-200/50">/</span>{" "}
              NEXT: MISSION BRIEFING
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
