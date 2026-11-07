"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  Fingerprint,
  LockKeyhole,
  ShieldCheck,
  UserRound,
} from "lucide-react";

function LinkField({
  autoComplete,
  icon: Icon,
  label,
  maxLength,
  name,
  onChange,
  placeholder,
  value,
}) {
  const hasValue = value.trim().length > 0;

  return (
    <label className="block">
      <span className="mb-1.5 flex items-center justify-between gap-3 font-mono text-[8px] tracking-[0.15em] text-cyan-100/70 sm:text-[9px]">
        <span>{label}</span>
        <span className={hasValue ? "flex items-center gap-1 text-emerald-200/75" : "text-slate-600"}>
          {hasValue ? (
            <>
              <Check aria-hidden="true" size={11} />
              READY
            </>
          ) : (
            "REQUIRED"
          )}
        </span>
      </span>
      <span className="group flex min-h-12 items-center gap-3 border border-blue-100/15 bg-[#050a18]/90 px-3 transition focus-within:border-cyan-200/65 focus-within:shadow-[0_0_20px_rgba(34,211,238,0.12)] sm:min-h-[52px]">
        <Icon
          aria-hidden="true"
          className={`shrink-0 ${hasValue ? "text-cyan-100" : "text-slate-600"} transition`}
          size={16}
        />
        <input
          autoComplete={autoComplete}
          className="h-full min-w-0 flex-1 bg-transparent py-3 text-sm text-white outline-none placeholder:text-slate-600"
          maxLength={maxLength}
          name={name}
          onChange={onChange}
          placeholder={placeholder}
          required
          value={value}
        />
        <span aria-hidden="true" className="h-4 w-px bg-cyan-100/15" />
        <span className="font-mono text-[8px] text-slate-600">
          {value.length}/{maxLength}
        </span>
      </span>
    </label>
  );
}

export default function RegisterForm({ retentionDays }) {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [className, setClassName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");

    if (!fullName.trim() || !className.trim()) {
      setErrorMessage("Cần xác lập cả tên người chơi và lớp để tiếp tục.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, className }),
      });
      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(result.error ?? "Chưa thể tạo phiên chơi.");
        return;
      }

      router.replace("/character");
    } catch {
      setErrorMessage(
        "Mất kết nối với máy chủ mô phỏng. Hãy kiểm tra mạng và thử lại.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      className="relative order-3 mx-auto w-full max-w-[410px] border border-cyan-200/30 bg-[linear-gradient(150deg,rgba(8,25,51,0.94),rgba(4,9,22,0.97))] p-4 shadow-[0_18px_70px_rgba(0,0,0,0.48),0_0_35px_rgba(34,211,238,0.09)] backdrop-blur-md sm:p-5 lg:order-3 lg:p-5"
      onSubmit={handleSubmit}
    >
      <span aria-hidden="true" className="absolute left-0 top-0 h-7 w-7 border-l-2 border-t-2 border-cyan-100/85" />
      <span aria-hidden="true" className="absolute bottom-0 right-0 h-7 w-7 border-b-2 border-r-2 border-blue-200/70" />

      <div className="flex items-start gap-3 border-b border-cyan-100/15 pb-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center border border-cyan-200/35 bg-cyan-200/[0.06] text-cyan-100">
          <Fingerprint aria-hidden="true" size={19} />
        </span>
        <div className="min-w-0">
          <p className="font-mono text-[8px] tracking-[0.17em] text-cyan-100/60">
            SECURE UPLINK // PLAYER ID
          </p>
          <h2 className="mt-1 text-sm font-bold tracking-wide text-white sm:text-base">
            Xác lập liên kết
          </h2>
        </div>
        <span className="ml-auto flex items-center gap-1.5 border border-emerald-200/20 bg-emerald-200/[0.04] px-2 py-1 font-mono text-[7px] text-emerald-100/70">
          <span className="status-dot" />
          ENCRYPTED
        </span>
      </div>

      <p className="mt-3 text-[10px] leading-5 text-slate-400">
        AI Guardian cần thông tin cơ bản để mở phiên mô phỏng và chào bạn trong
        nhiệm vụ.
      </p>

      <div className="mt-4 space-y-3">
        <LinkField
          autoComplete="name"
          icon={UserRound}
          label="TÊN NGƯỜI CHƠI"
          maxLength={80}
          name="fullName"
          onChange={(event) => setFullName(event.target.value)}
          placeholder="Nhập họ tên"
          value={fullName}
        />
        <LinkField
          autoComplete="off"
          icon={Fingerprint}
          label="LỚP / ĐỘI"
          maxLength={20}
          name="className"
          onChange={(event) => setClassName(event.target.value)}
          placeholder="Ví dụ: 10A3"
          value={className}
        />
      </div>

      <div className="mt-3 border border-blue-200/15 bg-blue-200/[0.035] p-3">
        <p className="flex items-center gap-2 font-mono text-[8px] tracking-[0.12em] text-blue-100/75">
          <LockKeyhole aria-hidden="true" size={12} />
          DATA TRANSMISSION NOTICE
        </p>
        <p className="mt-2 text-[9px] leading-[1.65] text-slate-400">
          Chỉ lưu tên và lớp để nhận diện lượt chơi, chào bạn và lưu kết quả cho
          ban tổ chức. Tự động xóa sau{" "}
          <strong className="font-semibold text-slate-200">
            {retentionDays ? `${retentionDays} ngày` : "thời hạn đã cấu hình"}
          </strong>
          {!retentionDays && " (liên hệ ban tổ chức để biết thời hạn cụ thể)"}.
          Không nhập mật khẩu hay thông tin nhạy cảm thật.
        </p>
        <p className="mt-1.5 text-[9px] leading-[1.65] text-slate-500">
          Nhân vật và toàn bộ dữ liệu trong game là hư cấu, tách biệt với bạn.
        </p>
      </div>

      <p
        aria-live="polite"
        className="min-h-5 pt-2 text-[10px] text-rose-300"
        role="status"
      >
        {errorMessage}
      </p>

      <button
        className="group flex min-h-12 w-full items-center justify-center gap-2 border border-amber-100 bg-[linear-gradient(180deg,#ffe975_0%,#ffc21c_55%,#f59e0b_100%)] px-4 font-mono text-[9px] font-black tracking-[0.1em] text-[#191006] shadow-[0_0_24px_rgba(251,191,36,0.2),inset_0_1px_0_rgba(255,255,255,0.7)] transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-100 disabled:cursor-wait disabled:opacity-65 sm:text-[10px]"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "ĐANG THIẾT LẬP UPLINK..." : "KẾT NỐI & MỞ HỒ SƠ"}
        {!isSubmitting && (
          <ArrowRight
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-1"
            size={15}
          />
        )}
      </button>

      <p className="mt-3 flex items-center justify-center gap-1.5 font-mono text-[7px] tracking-[0.1em] text-slate-600">
        <ShieldCheck aria-hidden="true" size={11} />
        PLAYER LINK ONLY // CHARACTER PROFILE IS FICTIONAL
      </p>
    </form>
  );
}
