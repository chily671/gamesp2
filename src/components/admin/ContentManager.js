"use client";

import { useState } from "react";
import { Pencil, Plus, Save, Trash2, X } from "lucide-react";

const fieldClass =
  "mt-1 min-h-11 w-full border border-white/10 bg-[#050a13] px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-200/50";
const labelClass =
  "block text-[10px] font-mono tracking-[0.08em] text-slate-400";

function emptyProfile() {
  return {
    characterCode: "",
    characterName: "",
    persona: "",
    age: 16,
    gender: "",
    className: "",
    school: "",
    address: "",
    housing: "",
    familyMembers: [],
    contact: { phone: "", email: "" },
    socialAccounts: { facebookUsername: "", simulatedPassword: "" },
    financialInfo: { simulatedBalance: 0, currencyLabel: "PIXEL COINS — SIMULATED" },
    relationshipStatus: "",
    lifestyle: { hobbies: [], habits: [], frequentPlaces: [], summary: "" },
    riskFactors: [],
    digitalFootprint: [],
    isActive: true,
    isDemoOnly: true,
  };
}

function emptyMission(stage) {
  return {
    missionCode: "",
    stage,
    title: "",
    subtitle: "",
    story: "",
    scenario: "",
    interactionType: "permissions",
    answerMode: "multiple",
    interactionPrompt: "",
    options: [
      { id: "option-a", label: "", detail: "" },
      { id: "option-b", label: "", detail: "" },
    ],
    correctAnswer: [],
    explanation: "",
    lesson: "",
    legalBasis: "",
    legalReviewRequired: true,
    isActive: true,
  };
}

function TextField({ label, value, onChange, multiline = false, type = "text", required = true, readOnly = false }) {
  const Control = multiline ? "textarea" : "input";
  return (
    <label className={labelClass}>
      {label}
      <Control
        className={`${fieldClass} ${multiline ? "min-h-24 resize-y" : ""}`}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        readOnly={readOnly}
        type={type}
        value={value ?? ""}
      />
    </label>
  );
}

function ListField({ label, value, onChange }) {
  return (
    <TextField
      label={`${label} — mỗi mục một dòng`}
      multiline
      onChange={(text) =>
        onChange(text.split("\n").map((item) => item.trim()).filter(Boolean))
      }
      required={false}
      value={(value ?? []).join("\n")}
    />
  );
}

function ProfileForm({ value, setValue }) {
  function setField(key, nextValue) {
    setValue((current) => ({ ...current, [key]: nextValue }));
  }
  function setNested(group, key, nextValue) {
    setValue((current) => ({
      ...current,
      [group]: { ...current[group], [key]: nextValue },
    }));
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      <TextField label="MÃ HỒ SƠ" readOnly={Boolean(value._id)} value={value.characterCode} onChange={(v) => setField("characterCode", v.toUpperCase())} />
      <TextField label="TÊN NHÂN VẬT" value={value.characterName} onChange={(v) => setField("characterName", v)} />
      <TextField label="PERSONA" value={value.persona} onChange={(v) => setField("persona", v)} />
      <TextField label="TUỔI" type="number" value={value.age} onChange={(v) => setField("age", Number(v))} />
      <TextField label="GIỚI TÍNH" value={value.gender} onChange={(v) => setField("gender", v)} />
      <TextField label="LỚP" value={value.className} onChange={(v) => setField("className", v)} />
      <TextField label="TRƯỜNG (HƯ CẤU)" value={value.school} onChange={(v) => setField("school", v)} />
      <TextField label="TÌNH TRẠNG QUAN HỆ" value={value.relationshipStatus} onChange={(v) => setField("relationshipStatus", v)} />
      <TextField label="ĐỊA CHỈ (HƯ CẤU)" value={value.address} onChange={(v) => setField("address", v)} />
      <TextField label="LOẠI NHÀ Ở" value={value.housing} onChange={(v) => setField("housing", v)} />
      <TextField label="SỐ ĐIỆN THOẠI DEMO" value={value.contact.phone} onChange={(v) => setNested("contact", "phone", v)} />
      <TextField label="EMAIL DEMO" value={value.contact.email} onChange={(v) => setNested("contact", "email", v)} />
      <TextField label="TÀI KHOẢN MẠNG XÃ HỘI DEMO" value={value.socialAccounts.facebookUsername} onChange={(v) => setNested("socialAccounts", "facebookUsername", v)} />
      <TextField label="MẬT KHẨU GIẢ LẬP (KHÔNG DÙNG ĐĂNG NHẬP)" value={value.socialAccounts.simulatedPassword} onChange={(v) => setNested("socialAccounts", "simulatedPassword", v)} />
      <TextField label="SỐ DƯ GIẢ LẬP" type="number" value={value.financialInfo.simulatedBalance} onChange={(v) => setNested("financialInfo", "simulatedBalance", Number(v))} />
      <TextField label="ĐƠN VỊ TIỀN GIẢ LẬP" value={value.financialInfo.currencyLabel} onChange={(v) => setNested("financialInfo", "currencyLabel", v)} />
      <TextField label="TÓM TẮT LỐI SỐNG" multiline value={value.lifestyle.summary} onChange={(v) => setNested("lifestyle", "summary", v)} />
      <ListField label="Thành viên gia đình hư cấu" value={value.familyMembers} onChange={(v) => setField("familyMembers", v)} />
      <ListField label="Sở thích" value={value.lifestyle.hobbies} onChange={(v) => setNested("lifestyle", "hobbies", v)} />
      <ListField label="Thói quen" value={value.lifestyle.habits} onChange={(v) => setNested("lifestyle", "habits", v)} />
      <ListField label="Địa điểm thường lui tới hư cấu" value={value.lifestyle.frequentPlaces} onChange={(v) => setNested("lifestyle", "frequentPlaces", v)} />
      <ListField label="Yếu tố rủi ro" value={value.riskFactors} onChange={(v) => setField("riskFactors", v)} />
      <ListField label="Dấu chân số" value={value.digitalFootprint} onChange={(v) => setField("digitalFootprint", v)} />
      <label className="flex items-center gap-2 text-xs text-slate-300">
        <input checked={value.isActive} onChange={(event) => setField("isActive", event.target.checked)} type="checkbox" />
        Hồ sơ đang hoạt động
      </label>
    </div>
  );
}

function MissionForm({ value, setValue, entries }) {
  function setField(key, nextValue) {
    setValue((current) => ({ ...current, [key]: nextValue }));
  }
  const occupiedStages = new Set(
    entries
      .filter((entry) => entry.missionCode !== value.missionCode)
      .map((entry) => entry.stage),
  );

  function updateOption(index, patch) {
    const previousId = value.options[index].id;
    const options = value.options.map((option, optionIndex) =>
      optionIndex === index ? { ...option, ...patch } : option,
    );
    setValue((current) => ({
      ...current,
      options,
      correctAnswer: current.correctAnswer
        .map((id) => (id === previousId && patch.id ? patch.id : id))
        .filter((id) => options.some((option) => option.id === id)),
    }));
  }

  function removeOption(index) {
    const removedId = value.options[index].id;
    setValue((current) => ({
      ...current,
      options: current.options.filter((_, optionIndex) => optionIndex !== index),
      correctAnswer: current.correctAnswer.filter((id) => id !== removedId),
    }));
  }

  function toggleAnswer(id, checked) {
    let correctAnswer = checked
      ? [...value.correctAnswer, id]
      : value.correctAnswer.filter((item) => item !== id);
    if (value.answerMode === "single" && checked) correctAnswer = [id];
    setField("correctAnswer", correctAnswer);
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <TextField label="MÃ NHIỆM VỤ" readOnly={Boolean(value._id)} value={value.missionCode} onChange={(v) => setField("missionCode", v.toUpperCase())} />
        <label className={labelClass}>
          STAGE (TỐI ĐA 4)
          <select className={fieldClass} onChange={(event) => setField("stage", Number(event.target.value))} value={value.stage}>
            {[1, 2, 3, 4].filter((stage) => !occupiedStages.has(stage)).map((stage) => <option key={stage} value={stage}>{stage}</option>)}
          </select>
        </label>
        <TextField label="TIÊU ĐỀ" value={value.title} onChange={(v) => setField("title", v)} />
        <TextField label="PHỤ ĐỀ" value={value.subtitle} onChange={(v) => setField("subtitle", v)} />
        <TextField label="CÂU CHUYỆN" multiline value={value.story} onChange={(v) => setField("story", v)} />
        <TextField label="TÌNH HUỐNG" multiline value={value.scenario} onChange={(v) => setField("scenario", v)} />
        <label className={labelClass}>
          LOẠI TƯƠNG TÁC
          <select className={fieldClass} onChange={(event) => setField("interactionType", event.target.value)} value={value.interactionType}>
            <option value="permissions">Quyền ứng dụng</option>
            <option value="data-review">Rà soát dữ liệu</option>
            <option value="chat">Tin nhắn</option>
            <option value="final-plan">Kế hoạch bảo vệ</option>
          </select>
        </label>
        <label className={labelClass}>
          KIỂU ĐÁP ÁN
          <select className={fieldClass} onChange={(event) => setValue((current) => ({ ...current, answerMode: event.target.value, correctAnswer: event.target.value === "single" ? current.correctAnswer.slice(0, 1) : current.correctAnswer }))} value={value.answerMode}>
            <option value="multiple">Nhiều đáp án</option>
            <option value="single">Một đáp án</option>
          </select>
        </label>
        <TextField label="HƯỚNG DẪN CHỌN" multiline value={value.interactionPrompt} onChange={(v) => setField("interactionPrompt", v)} />
        <TextField label="GIẢI THÍCH SAU KHI TRẢ LỜI" multiline value={value.explanation} onChange={(v) => setField("explanation", v)} />
        <TextField label="BÀI HỌC" multiline value={value.lesson} onChange={(v) => setField("lesson", v)} />
        <TextField label="CĂN CỨ / GHI CHÚ PHÁP LÝ" multiline value={value.legalBasis} onChange={(v) => setField("legalBasis", v)} />
      </div>

      <section className="border border-white/10 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-semibold text-white">LỰA CHỌN VÀ ĐÁP ÁN ĐÚNG</h3>
            <p className="mt-1 text-[10px] text-slate-500">Chọn hộp kiểm ở mỗi lựa chọn để đánh dấu đáp án đúng.</p>
          </div>
          <button
            className="inline-flex min-h-9 items-center gap-2 border border-cyan-200/20 px-3 text-[10px] text-cyan-100"
            onClick={() => {
              const next = value.options.length + 1;
              setField("options", [...value.options, { id: `option-${next}`, label: "", detail: "" }]);
            }}
            type="button"
          >
            <Plus size={14} /> THÊM LỰA CHỌN
          </button>
        </div>
        <div className="mt-3 space-y-3">
          {value.options.map((option, index) => (
            <div className="grid items-end gap-2 border-t border-white/[0.06] pt-3 sm:grid-cols-[1fr_1.2fr_1.5fr_auto_auto]" key={`${index}-${option.id}`}>
              <TextField label="ID" required value={option.id} onChange={(v) => updateOption(index, { id: v })} />
              <TextField label="NỘI DUNG" value={option.label} onChange={(v) => updateOption(index, { label: v })} />
              <TextField label="MÔ TẢ" value={option.detail} onChange={(v) => updateOption(index, { detail: v })} />
              <label className="flex min-h-11 items-center gap-2 text-[10px] text-emerald-200">
                <input aria-label={`Đáp án đúng: ${option.label || option.id}`} checked={value.correctAnswer.includes(option.id)} onChange={(event) => toggleAnswer(option.id, event.target.checked)} type="checkbox" />
                ĐÚNG
              </label>
              <button aria-label={`Xóa lựa chọn ${index + 1}`} className="min-h-10 border border-rose-200/20 px-2 text-rose-200" onClick={() => removeOption(index)} type="button">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap gap-5">
        <label className="flex items-center gap-2 text-xs text-slate-300">
          <input checked={value.isActive} onChange={(event) => setField("isActive", event.target.checked)} type="checkbox" />
          Nhiệm vụ đang hoạt động
        </label>
        <label className="flex items-center gap-2 text-xs text-amber-200">
          <input checked={value.legalReviewRequired} onChange={(event) => setField("legalReviewRequired", event.target.checked)} type="checkbox" />
          Cần chuyên gia rà soát pháp lý
        </label>
      </div>
    </div>
  );
}

export default function ContentManager({ kind, entries, onChanged }) {
  const isProfile = kind === "profiles";
  const [selectedCode, setSelectedCode] = useState("");
  const [draft, setDraft] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const baseUrl = `/api/admin/content/${kind}`;
  const occupiedStages = new Set(entries.map((entry) => entry.stage));

  async function editEntry(code) {
    setBusy(true);
    setErrorMessage("");
    try {
      const response = await fetch(`${baseUrl}/${code}`, { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Không thể tải nội dung.");
      setSelectedCode(code);
      setDraft(result.entry);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  function addEntry() {
    setSelectedCode("");
    setErrorMessage("");
    if (isProfile) {
      setDraft(emptyProfile());
      return;
    }
    const stage = [1, 2, 3, 4].find((item) => !occupiedStages.has(item));
    if (!stage) {
      setErrorMessage("Đã đủ 4 stage; hiện trò chơi hỗ trợ tối đa 4 nhiệm vụ.");
      return;
    }
    setDraft(emptyMission(stage));
  }

  async function saveEntry(event) {
    event.preventDefault();
    setBusy(true);
    setErrorMessage("");
    try {
      const response = await fetch(
        selectedCode ? `${baseUrl}/${selectedCode}` : baseUrl,
        {
          method: selectedCode ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(draft),
        },
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Không thể lưu nội dung.");
      setDraft(null);
      setSelectedCode("");
      await onChanged();
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function deleteEntry() {
    const label = isProfile ? "hồ sơ" : "nhiệm vụ";
    if (!window.confirm(`Xóa ${label} này? Thao tác này không thể hoàn tác.`)) return;
    setBusy(true);
    setErrorMessage("");
    try {
      const response = await fetch(`${baseUrl}/${selectedCode}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? `Không thể xóa ${label}.`);
      setDraft(null);
      setSelectedCode("");
      await onChanged();
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="border border-white/[0.08] bg-white/[0.02] p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-mono text-xs tracking-[0.14em] text-white">
            {isProfile ? "QUẢN LÝ HỒ SƠ NHÂN VẬT" : "QUẢN LÝ CÂU HỎI VÀ ĐÁP ÁN"}
          </h2>
          <p className="mt-1 text-[10px] text-slate-500">
            {isProfile
              ? "Hồ sơ chỉ chứa nhân vật hư cấu; hồ sơ đang được phiên chơi dùng sẽ không xóa được."
              : "Tối đa 4 nhiệm vụ theo cấu trúc game hiện tại. Có thể thêm lựa chọn và đánh dấu đáp án đúng."}
          </p>
        </div>
        <button className="inline-flex min-h-10 items-center gap-2 bg-cyan-300 px-3 font-mono text-[9px] font-bold text-slate-950" onClick={addEntry} type="button">
          <Plus size={14} /> THÊM {isProfile ? "HỒ SƠ" : "CÂU HỎI"}
        </button>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {entries.map((entry) => {
          const code = isProfile ? entry.characterCode : entry.missionCode;
          return (
            <button
              className={`flex min-h-16 items-center justify-between gap-3 border px-3 py-2 text-left ${selectedCode === code ? "border-cyan-200/40 bg-cyan-200/[0.05]" : "border-white/[0.08] hover:border-white/20"}`}
              disabled={busy}
              key={code}
              onClick={() => editEntry(code)}
              type="button"
            >
              <span className="min-w-0">
                <span className="block truncate text-xs text-slate-200">{isProfile ? entry.characterName : `STAGE ${entry.stage} · ${entry.title}`}</span>
                <span className="mt-1 block font-mono text-[9px] text-slate-600">{code} · {entry.isActive ? "ACTIVE" : "INACTIVE"}</span>
              </span>
              <Pencil aria-hidden="true" className="shrink-0 text-cyan-200/70" size={14} />
            </button>
          );
        })}
        {entries.length === 0 && <p className="text-xs text-slate-500">Chưa có nội dung.</p>}
      </div>

      {draft && (
        <form className="mt-5 border-t border-white/10 pt-5" onSubmit={saveEntry}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-white">
              {selectedCode ? "CHỈNH SỬA" : "TẠO MỚI"} {isProfile ? "HỒ SƠ" : "NHIỆM VỤ"}
            </h3>
            <button aria-label="Đóng biểu mẫu" className="min-h-9 border border-white/10 px-2 text-slate-400" onClick={() => setDraft(null)} type="button">
              <X size={15} />
            </button>
          </div>
          {isProfile ? (
            <ProfileForm value={draft} setValue={setDraft} />
          ) : (
            <MissionForm value={draft} setValue={setDraft} entries={entries} />
          )}
          <p aria-live="polite" className="mt-3 min-h-5 text-xs text-rose-300">{errorMessage}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button className="inline-flex min-h-11 items-center gap-2 bg-cyan-300 px-4 font-mono text-[10px] font-bold text-slate-950 disabled:opacity-50" disabled={busy} type="submit">
              <Save size={14} /> {busy ? "ĐANG LƯU..." : "LƯU"}
            </button>
            {selectedCode && (
              <button className="inline-flex min-h-11 items-center gap-2 border border-rose-200/25 px-4 font-mono text-[10px] text-rose-200 disabled:opacity-50" disabled={busy} onClick={deleteEntry} type="button">
                <Trash2 size={14} /> XÓA
              </button>
            )}
          </div>
        </form>
      )}
    </section>
  );
}
