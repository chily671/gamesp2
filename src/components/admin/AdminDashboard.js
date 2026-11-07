"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Activity,
  BarChart3,
  LogOut,
  Shield,
  UsersRound,
} from "lucide-react";

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Đăng nhập thất bại.");
      onLogin();
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="mx-auto mt-10 w-full max-w-md border border-cyan-200/20 bg-[#091321] p-6 sm:p-8" onSubmit={submit}>
      <Shield aria-hidden="true" className="text-cyan-200" size={24} />
      <h1 className="mt-5 text-2xl font-bold text-white">Event control</h1>
      <p className="mt-2 text-sm leading-6 text-slate-400">
        Đăng nhập bằng tài khoản quản trị.
      </p>
      <label className="mt-6 block">
        <span className="mb-2 block font-mono text-[10px] tracking-[0.12em] text-slate-300">TÊN ĐĂNG NHẬP</span>
        <input
          autoComplete="username"
          className="min-h-12 w-full border border-white/10 bg-[#050a13] px-4 text-white outline-none focus:border-cyan-200/60"
          onChange={(event) => setUsername(event.target.value)}
          required
          type="text"
          value={username}
        />
      </label>
      <label className="mt-4 block">
        <span className="mb-2 block font-mono text-[10px] tracking-[0.12em] text-slate-300">MẬT KHẨU</span>
        <input
          autoComplete="current-password"
          className="min-h-12 w-full border border-white/10 bg-[#050a13] px-4 text-white outline-none focus:border-cyan-200/60"
          onChange={(event) => setPassword(event.target.value)}
          required
          type="password"
          value={password}
        />
      </label>
      <p aria-live="polite" className="mt-3 min-h-5 text-sm text-rose-300">{errorMessage}</p>
      <button className="mt-3 min-h-12 w-full bg-cyan-300 font-mono text-xs font-bold tracking-[0.13em] text-slate-950 disabled:opacity-50" disabled={submitting}>
        {submitting ? "ĐANG XÁC THỰC..." : "ĐĂNG NHẬP"}
      </button>
    </form>
  );
}

function ToggleList({ title, kind, entries, onToggle, busyCode }) {
  return (
    <section className="border border-white/[0.08] bg-white/[0.02] p-5">
      <h2 className="font-mono text-xs tracking-[0.14em] text-white">{title}</h2>
      <div className="mt-4 divide-y divide-white/[0.06]">
        {entries.map((entry) => {
          const code = entry.characterCode ?? entry.missionCode;
          return (
            <div className="flex items-center justify-between gap-4 py-3" key={code}>
              <div className="min-w-0">
                <p className="truncate text-sm text-slate-200">{entry.characterName ?? entry.title}</p>
                <p className="mt-1 font-mono text-[9px] text-slate-600">{entry.persona ?? `STAGE ${entry.stage}`} · {code}</p>
              </div>
              <button
                aria-pressed={entry.isActive}
                className={`min-h-10 shrink-0 border px-3 font-mono text-[9px] tracking-[0.1em] transition ${entry.isActive ? "border-emerald-200/25 text-emerald-200" : "border-rose-200/25 text-rose-200"}`}
                disabled={busyCode === code}
                onClick={() => onToggle(kind, code, !entry.isActive)}
                type="button"
              >
                {busyCode === code ? "..." : entry.isActive ? "ACTIVE" : "INACTIVE"}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function formatAverageDuration(seconds) {
  if (!Number.isFinite(seconds)) return "—";
  const totalSeconds = Math.round(seconds);
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [stats, setStats] = useState(null);
  const [players, setPlayers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [busyCode, setBusyCode] = useState("");

  const loadData = useCallback(async () => {
    const [statsResponse, playersResponse] = await Promise.all([
      fetch("/api/admin/stats", { cache: "no-store" }),
      fetch("/api/admin/players", { cache: "no-store" }),
    ]);
    if (statsResponse.status === 401 || playersResponse.status === 401) {
      setAuthenticated(false);
      return;
    }
    const [statsResult, playersResult] = await Promise.all([
      statsResponse.json(),
      playersResponse.json(),
    ]);
    if (!statsResponse.ok || !playersResponse.ok) {
      throw new Error(statsResult.error ?? playersResult.error ?? "Không thể tải dữ liệu quản trị.");
    }
    setStats(statsResult);
    setPlayers(playersResult.players);
    setAuthenticated(true);
    setErrorMessage("");
  }, []);

  useEffect(() => {
    let active = true;
    Promise.resolve()
      .then(loadData)
      .catch((error) => {
        if (active) setErrorMessage(error.message);
      });
    return () => {
      active = false;
    };
  }, [loadData]);

  async function toggleContent(kind, code, isActive) {
    setBusyCode(code);
    setErrorMessage("");
    try {
      const response = await fetch(`/api/admin/content/${kind}/${code}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Cập nhật thất bại.");
      await loadData();
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setBusyCode("");
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
    setStats(null);
    setPlayers([]);
  }

  if (!authenticated || !stats) {
    return (
      <main className="min-h-screen bg-[#050a13] px-5 py-10 text-slate-100">
        <header className="mx-auto max-w-6xl font-mono text-xs font-bold tracking-[0.18em] text-white">
          DATA<span className="text-cyan-300">TRAP</span>{" "}
          <span className="text-slate-600">{"// ADMIN"}</span>
        </header>
        <LoginForm onLogin={() => loadData().catch((error) => setErrorMessage(error.message))} />
        <p aria-live="polite" className="mt-4 text-center text-sm text-rose-300">{errorMessage}</p>
      </main>
    );
  }

  const metrics = [
    ["NGƯỜI CHƠI ĐANG LƯU", stats.players],
    ["PHIÊN CHƠI", stats.sessions.total],
    [
      "TỶ LỆ HOÀN THÀNH",
      `${stats.sessions.total ? Math.round((stats.sessions.completed / stats.sessions.total) * 100) : 0}%`,
    ],
    ["ĐỘ CHÍNH XÁC TRUNG BÌNH", `${Math.round(stats.sessions.averageAccuracy ?? 0)}%`],
    ["THỜI GIAN TB / VÁN", formatAverageDuration(stats.sessions.averageDuration)],
    ["CÂU HỎI / NHIỆM VỤ", stats.questions.total],
    ["LƯỢT TRẢ LỜI ĐÃ GHI", stats.sessions.totalAnswers],
    ["ĐIỂM TRUNG BÌNH", Math.round(stats.sessions.averageScore ?? 0)],
  ];

  return (
    <main className="min-h-screen bg-[#050a13] px-5 py-7 text-slate-100 sm:px-8">
      <header className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="font-mono text-xs font-bold tracking-[0.18em] text-white">
          DATA<span className="text-cyan-300">TRAP</span>{" "}
          <span className="text-slate-600">{"// EVENT CONTROL"}</span>
        </div>
        <button className="flex min-h-10 items-center gap-2 border border-white/10 px-3 font-mono text-[9px] tracking-[0.1em] text-slate-400 hover:text-white" onClick={logout}>
          <LogOut aria-hidden="true" size={14} /> SIGN OUT
        </button>
      </header>

      <div className="mx-auto max-w-7xl pb-12 pt-9">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[9px] tracking-[0.17em] text-cyan-200/60">RESTRICTED ACCESS</p>
            <h1 className="mt-2 text-3xl font-bold text-white">Event dashboard</h1>
          </div>
          <button className="hidden items-center gap-2 font-mono text-[9px] text-cyan-100/70 sm:flex" onClick={() => loadData().catch((error) => setErrorMessage(error.message))}>
            <Activity aria-hidden="true" size={14} /> REFRESH
          </button>
        </div>
        <p aria-live="polite" className="mt-3 min-h-5 text-sm text-rose-300">{errorMessage}</p>

        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
          {metrics.map(([label, value]) => (
            <article className="border border-white/[0.08] bg-white/[0.025] p-4 sm:p-5" key={label}>
              <BarChart3 aria-hidden="true" className="text-cyan-200/70" size={17} />
              <p className="mt-4 font-mono text-[8px] tracking-[0.1em] text-slate-500">{label}</p>
              <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
            </article>
          ))}
        </div>

        <section className="mt-4 border border-amber-200/20 bg-amber-200/[0.035] p-4 sm:p-5">
          <p className="font-mono text-[9px] tracking-[0.14em] text-amber-100/70">
            MỨC ĐỘ ĐỐI CHIẾU PHÁP LUẬT
          </p>
          <p className="mt-2 text-sm font-semibold text-amber-100">
            Chưa được thẩm định — {stats.questions.legalReviewRequired}/{stats.questions.total} nhiệm vụ cần chuyên gia rà soát
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-400">
            Trò chơi đề cập các nguyên tắc quyền riêng tư nhưng chưa xác nhận tuân thủ theo từng điều khoản. Không xem chỉ số này là chứng nhận pháp lý.
          </p>
        </section>

        <section className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-3 border border-cyan-200/10 bg-cyan-200/[0.025] p-4">
          <div>
            <p className="font-mono text-[8px] tracking-[0.12em] text-slate-500">THỜI GIAN TỐI ĐA / LƯỢT</p>
            <p className="mt-1 text-sm text-cyan-100">{stats.sessionDurationMinutes} phút</p>
          </div>
          <div>
            <p className="font-mono text-[8px] tracking-[0.12em] text-slate-500">THỜI HẠN LƯU DỮ LIỆU</p>
            <p className="mt-1 text-sm text-cyan-100">{stats.dataRetentionDays} ngày</p>
          </div>
          <p className="text-[10px] leading-5 text-slate-500">
            Thay đổi tại SESSION_DURATION_MINUTES và DATA_RETENTION_DAYS trong .env.local, sau đó khởi động lại ứng dụng.
          </p>
        </section>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <ToggleList title="CHARACTER PROFILES" kind="profiles" entries={stats.profiles} onToggle={toggleContent} busyCode={busyCode} />
          <ToggleList title="MISSION CONTENT" kind="missions" entries={stats.missions} onToggle={toggleContent} busyCode={busyCode} />
        </div>

        <section className="mt-5 border border-white/[0.08] bg-white/[0.02] p-5">
          <h2 className="flex items-center gap-2 font-mono text-xs tracking-[0.14em] text-white">
            <UsersRound aria-hidden="true" className="text-cyan-200" size={16} /> PLAYER SESSIONS
          </h2>
          <p className="mt-2 text-xs leading-5 text-slate-500">
            Tối đa 500 phiên còn trong thời hạn lưu giữ. Dữ liệu nhận diện người tham gia — chỉ dành cho ban tổ chức được ủy quyền.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[780px] border-collapse text-left text-xs">
              <thead className="font-mono text-[9px] tracking-[0.08em] text-slate-500">
                <tr>
                  {["PLAYER CODE", "HỌ TÊN", "LỚP", "NHÂN VẬT", "TRẠNG THÁI", "ĐIỂM", "ĐÚNG", "THỜI GIAN"].map((item) => <th className="border-b border-white/10 px-3 py-3" key={item}>{item}</th>)}
                </tr>
              </thead>
              <tbody>
                {players.map((player) => (
                  <tr className="border-b border-white/[0.05] text-slate-300" key={player.playerCode}>
                    <td className="px-3 py-3 font-mono text-[10px] text-cyan-100/75">{player.playerCode}</td>
                    <td className="px-3 py-3">{player.fullName}</td>
                    <td className="px-3 py-3">{player.className}</td>
                    <td className="px-3 py-3">{player.character?.characterName ?? "—"}</td>
                    <td className="px-3 py-3">{player.status}</td>
                    <td className="px-3 py-3">{player.score}</td>
                    <td className="px-3 py-3">{player.accuracy}%</td>
                    <td className="px-3 py-3">{player.duration == null ? "—" : `${player.duration}s`}</td>
                  </tr>
                ))}
                {players.length === 0 && <tr><td className="px-3 py-5 text-slate-500" colSpan={8}>Chưa có phiên chơi.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-4 border border-white/[0.08] bg-white/[0.02] p-5">
          <h2 className="font-mono text-xs tracking-[0.14em] text-white">MOST MISSED STAGES</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {stats.commonMisses.length ? stats.commonMisses.map((item) => (
              <span className="border border-amber-200/15 bg-amber-200/[0.03] px-3 py-2 font-mono text-[10px] text-amber-100/70" key={item._id}>
                STAGE {String(item._id).padStart(2, "0")} · {item.count} MISSED
              </span>
            )) : <p className="text-xs text-slate-500">Chưa có câu trả lời sai.</p>}
          </div>
        </section>
        <p className="mt-5 text-[10px] leading-5 text-slate-600">
          Dữ liệu người tham gia được tự động xóa theo DATA_RETENTION_DAYS. Không xuất danh sách ra thiết bị dùng chung.
        </p>
      </div>
    </main>
  );
}
