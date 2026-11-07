"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ShieldCheck } from "lucide-react";

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
      setErrorMessage("Vui lòng nhập họ tên và lớp để tiếp tục.");
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
        "Không thể kết nối đến máy chủ. Hãy kiểm tra kết nối và thử lại.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      className="panel-frame mx-auto w-full max-w-xl border border-cyan-200/15 bg-[#091321]/90 p-6 shadow-[0_24px_100px_rgba(0,0,0,0.28)] backdrop-blur sm:p-9"
      onSubmit={handleSubmit}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] tracking-[0.18em] text-cyan-200/65">
            PLAYER REGISTRATION
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
            Bạn là ai trong lượt chơi này?
          </h2>
        </div>
        <ShieldCheck
          aria-hidden="true"
          className="mt-1 shrink-0 text-cyan-200/75"
          size={21}
          strokeWidth={1.5}
        />
      </div>

      <div className="mt-8 space-y-5">
        <label className="block">
          <span className="mb-2 block font-mono text-[10px] tracking-[0.13em] text-slate-300">
            HỌ VÀ TÊN <span className="text-cyan-200">*</span>
          </span>
          <input
            autoComplete="name"
            className="min-h-14 w-full border border-white/[0.12] bg-[#050b14] px-4 text-base text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-200/70 focus:ring-2 focus:ring-cyan-300/10"
            maxLength={80}
            name="fullName"
            onChange={(event) => setFullName(event.target.value)}
            placeholder="Nhập họ tên của bạn"
            required
            value={fullName}
          />
        </label>

        <label className="block">
          <span className="mb-2 block font-mono text-[10px] tracking-[0.13em] text-slate-300">
            LỚP <span className="text-cyan-200">*</span>
          </span>
          <input
            autoComplete="off"
            className="min-h-14 w-full border border-white/[0.12] bg-[#050b14] px-4 text-base text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-200/70 focus:ring-2 focus:ring-cyan-300/10"
            maxLength={20}
            name="className"
            onChange={(event) => setClassName(event.target.value)}
            placeholder="Ví dụ: 10A3"
            required
            value={className}
          />
        </label>
      </div>

      <div className="mt-6 border border-cyan-200/15 bg-cyan-200/[0.035] p-4">
        <p className="font-mono text-[10px] tracking-[0.13em] text-cyan-100/85">
          THÔNG TIN ĐƯỢC THU THẬP
        </p>
        <p className="mt-2 text-xs leading-6 text-slate-400">
          Họ tên và lớp chỉ dùng để chào bạn trong lượt chơi và lưu kết quả cho
          ban tổ chức. Dữ liệu được tự động xóa sau{" "}
          <strong className="font-semibold text-slate-200">
            {retentionDays ? `${retentionDays} ngày` : "thời hạn đã cấu hình"}
          </strong>
          {!retentionDays && " (hãy hỏi ban tổ chức để biết thời hạn cụ thể)"}
          . Hồ sơ nhân vật trong game là dữ liệu hư cấu, không liên quan đến bạn.
        </p>
        <p className="mt-2 text-xs leading-6 text-slate-400">
          Không nhập số điện thoại, địa chỉ, mật khẩu hoặc thông tin cá nhân
          khác. Tên và lớp không được hiển thị công khai trên bảng xếp hạng.
        </p>
      </div>

      <p
        aria-live="polite"
        className="min-h-6 pt-3 text-sm text-rose-300"
        role="status"
      >
        {errorMessage}
      </p>

      <button
        className="group mt-3 flex min-h-14 w-full items-center justify-center gap-3 bg-cyan-300 px-5 font-mono text-xs font-bold tracking-[0.15em] text-[#06101b] transition hover:bg-cyan-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-100 disabled:cursor-wait disabled:opacity-60"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "ĐANG TẠO PHIÊN..." : "TẠO PHIÊN CỦA TÔI"}
        {!isSubmitting && (
          <ArrowRight
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-1"
            size={16}
          />
        )}
      </button>
      <p className="mt-4 text-center font-mono text-[9px] tracking-[0.1em] text-slate-600">
        SESSION ISOLATED <span className="px-2 text-cyan-300/50">/</span>{" "}
        SIMULATED IDENTITY ONLY
      </p>
    </form>
  );
}
