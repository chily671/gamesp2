"use client";

import { useState } from "react";
import { Pencil, Plus, Save, Trash2, X } from "lucide-react";

const fieldClass =
  "mt-1 min-h-11 w-full border border-white/10 bg-[#050a13] px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-200/50";
const labelClass =
  "block text-[10px] font-mono tracking-[0.08em] text-slate-400";

function emptyStoryline() {
  return {
    opening: "",
    stage01: {
      serviceName: "",
      scene: "",
      limitedAction: "",
      broadAction: "",
    },
    stage02: { artifacts: [] },
    stage03: { incident: "", safeEnding: "", exposedEnding: "" },
    guardian: { opening: "", stage01: "", stage02: "", stage03: "" },
  };
}

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
    storyline: emptyStoryline(),
    stage02ArtifactsText: "[]",
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

function validateProfileStep(value, step) {
  const identityValid =
    /^[A-Z0-9-]{1,40}$/.test(value.characterCode) &&
    [value.characterName, value.persona, value.gender, value.className, value.school, value.relationshipStatus]
      .every((field) => typeof field === "string" && field.trim()) &&
    Number.isInteger(value.age) &&
    value.age >= 1 &&
    value.age <= 120;
  const contextValid =
    [value.address, value.housing, value.contact?.phone, value.contact?.email,
      value.socialAccounts?.facebookUsername, value.socialAccounts?.simulatedPassword,
      value.financialInfo?.currencyLabel]
      .every((field) => typeof field === "string" && field.trim()) &&
    value.contact.email.toLowerCase().endsWith(".invalid") &&
      (value.contact.phone.toUpperCase().includes("DEMO") ||
        /x{2,}/i.test(value.contact.phone)) &&
    value.socialAccounts.simulatedPassword.toUpperCase().includes("DEMO") &&
    Number.isFinite(value.financialInfo.simulatedBalance) &&
    value.financialInfo.simulatedBalance >= 0;
  const contextListsValid = Array.isArray(value.familyMembers);
  const storyValid =
    typeof value.lifestyle?.summary === "string" &&
    value.lifestyle.summary.trim() &&
    Array.isArray(value.digitalFootprint) &&
    value.digitalFootprint.some((item) => item.trim()) &&
    Array.isArray(value.riskFactors) &&
    value.riskFactors.some((item) => item.trim()) &&
    ["hobbies", "habits", "frequentPlaces"].every((key) =>
      Array.isArray(value.lifestyle?.[key]),
    );
  let artifacts = null;
  try {
    artifacts = JSON.parse(value.stage02ArtifactsText);
  } catch {
    artifacts = null;
  }
  const storyline = value.storyline;
  const storylineValid =
    [
      storyline?.opening,
      storyline?.stage01?.serviceName,
      storyline?.stage01?.scene,
      storyline?.stage01?.limitedAction,
      storyline?.stage01?.broadAction,
      storyline?.stage03?.incident,
      storyline?.stage03?.safeEnding,
      storyline?.stage03?.exposedEnding,
      storyline?.guardian?.opening,
      storyline?.guardian?.stage01,
      storyline?.guardian?.stage02,
      storyline?.guardian?.stage03,
    ].every((field) => typeof field === "string" && field.trim()) &&
    Array.isArray(artifacts) &&
    artifacts.length >= 3 &&
    artifacts.length <= 20 &&
    artifacts.every(
      (artifact) =>
        artifact &&
        /^[a-zA-Z0-9_-]{1,60}$/.test(artifact.id) &&
        typeof artifact.title === "string" &&
        artifact.title.trim() &&
        typeof artifact.body === "string" &&
        artifact.body.trim() &&
        /^[a-zA-Z0-9_-]{1,80}$/.test(artifact.evidenceId) &&
        ["always", "limited-permission", "broad-permission"].includes(
          artifact.condition,
        ),
    ) &&
    new Set(artifacts.map((artifact) => artifact.id)).size ===
      artifacts.length &&
    new Set(artifacts.map((artifact) => artifact.evidenceId)).size ===
      artifacts.length;

  if ((step === 0 || step === 4) && !identityValid) {
    return "Hoàn thành các trường danh tính; tuổi phải từ 1 đến 120.";
  }
  if ((step === 1 || step === 4) && (!contextValid || !contextListsValid)) {
    return "Kiểm tra dữ liệu bối cảnh. Email phải dùng miền .invalid; điện thoại phải ghi DEMO hoặc được che bằng x; mật khẩu giả lập phải ghi DEMO.";
  }
  if ((step === 2 || step === 4) && !storyValid) {
    return "Thêm tóm tắt, ít nhất một dấu vết số và một rủi ro để hồ sơ dùng được trong nhiệm vụ.";
  }
  if ((step === 3 || step === 4) && !storylineValid) {
    return "Bổ sung tình huống cá nhân hóa cho cả ba stage, ít nhất 3 evidence hợp lệ và lời thoại Guardian.";
  }
  return "";
}

function validateMissionStep(value, step, entries) {
  const questionValid =
    /^[A-Z0-9-]{1,40}$/.test(value.missionCode) &&
    Number.isInteger(value.stage) &&
    value.stage >= 1 &&
    value.stage <= 4 &&
    !entries.some(
      (entry) =>
        entry.missionCode !== value.missionCode && entry.stage === value.stage,
    ) &&
    [value.title, value.subtitle, value.story, value.scenario, value.interactionPrompt]
      .every((field) => typeof field === "string" && field.trim()) &&
    ["permissions", "data-review", "chat", "final-plan"].includes(value.interactionType);
  const ids = value.options.map((option) => option.id);
  const answersValid =
    value.options.length >= 2 &&
    value.options.every(
      (option) =>
        /^[a-zA-Z0-9_-]{1,50}$/.test(option.id) &&
        option.label.trim() &&
        option.detail.trim(),
    ) &&
    new Set(ids).size === ids.length &&
    value.correctAnswer.length >= 1 &&
    value.correctAnswer.every((answer) => ids.includes(answer)) &&
    (value.answerMode !== "single" || value.correctAnswer.length === 1);
  const feedbackValid =
    [value.explanation, value.lesson, value.legalBasis]
      .every((field) => typeof field === "string" && field.trim()) &&
    typeof value.legalReviewRequired === "boolean" &&
    typeof value.isActive === "boolean";

  if ((step === 0 || step === 3) && !questionValid) {
    return "Hoàn thành tình huống và câu hỏi; stage phải trống và nằm trong khoảng 1–4.";
  }
  if ((step === 1 || step === 3) && !answersValid) {
    return "Cần ít nhất 2 lựa chọn hợp lệ, ID không trùng và chọn đúng ít nhất một đáp án.";
  }
  if ((step === 2 || step === 3) && !feedbackValid) {
    return "Bổ sung giải thích, bài học và ghi chú căn cứ trước khi tiếp tục.";
  }
  return "";
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

function ProfileForm({ value, setValue, step }) {
  function setField(key, nextValue) {
    setValue((current) => ({ ...current, [key]: nextValue }));
  }
  function setNested(group, key, nextValue) {
    setValue((current) => ({
      ...current,
      [group]: { ...current[group], [key]: nextValue },
    }));
  }
  function setStorylineField(group, key, nextValue) {
    setValue((current) => ({
      ...current,
      storyline: {
        ...current.storyline,
        [group]: { ...current.storyline[group], [key]: nextValue },
      },
    }));
  }

  if (step === 4) {
    return (
      <div className="space-y-4">
        <div className="border border-cyan-200/15 bg-cyan-200/[0.03] p-4">
          <p className="font-mono text-[10px] tracking-[0.12em] text-cyan-100/70">HỒ SƠ SẼ ĐƯỢC DÙNG TRONG TRÒ CHƠI</p>
          <p className="mt-2 text-lg font-semibold text-white">{value.characterName || "Chưa đặt tên"} · {value.persona || "Chưa có persona"}</p>
          <p className="mt-1 text-xs text-slate-400">{value.className || "Chưa có lớp"} · {value.school || "Chưa có trường"} · {value.age} tuổi</p>
          <p className="mt-3 text-xs leading-5 text-slate-300">{value.lifestyle.summary || "Chưa có tóm tắt."}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-[10px] font-mono text-amber-100/70">DẤU VẾT SỐ ({value.digitalFootprint.length})</p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-slate-400">{value.digitalFootprint.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
          <div>
            <p className="text-[10px] font-mono text-rose-100/70">RỦI RO GỢI Ý ({value.riskFactors.length})</p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-slate-400">{value.riskFactors.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
        </div>
        <div className="border border-cyan-200/10 p-4">
          <p className="font-mono text-[10px] tracking-[0.12em] text-cyan-100/70">CỐT TRUYỆN RPG</p>
          <p className="mt-2 text-xs text-slate-300">{value.storyline.opening}</p>
          <p className="mt-2 text-xs text-slate-400">Stage 01 · {value.storyline.stage01.serviceName}</p>
          <p className="mt-1 text-xs text-slate-400">Stage 02 · {value.storyline.stage02.artifacts.length} vật thể/evidence</p>
          <p className="mt-1 text-xs text-slate-400">Stage 03 · {value.storyline.stage03.incident}</p>
        </div>
        <p className="text-xs leading-5 text-slate-500">Chỉ dùng tên, trường, liên hệ và thông tin hoàn toàn hư cấu. Email phải dùng miền .invalid; không nhập dữ liệu hoặc mật khẩu thật.</p>
        <label className="flex items-center gap-2 text-xs text-slate-300">
          <input checked={value.isActive} onChange={(event) => setField("isActive", event.target.checked)} type="checkbox" />
          Hồ sơ đang hoạt động và có thể được cấp cho người chơi
        </label>
      </div>
    );
  }

  if (step === 3) {
    return (
      <>
        <p className="text-xs leading-5 text-slate-500">
          Bước 4/5 · Viết bối cảnh khác biệt cho nhân vật. Evidence JSON cần có ít nhất 3 vật thể; condition là always, limited-permission hoặc broad-permission.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <TextField label="SITUATION MỞ ĐẦU" multiline value={value.storyline.opening} onChange={(v) => setField("storyline", { ...value.storyline, opening: v })} />
          <TextField label="DỊCH VỤ / ỨNG DỤNG STAGE 01" value={value.storyline.stage01.serviceName} onChange={(v) => setStorylineField("stage01", "serviceName", v)} />
          <TextField label="TÌNH HUỐNG VÀ QUYỀN XIN CẤP" multiline value={value.storyline.stage01.scene} onChange={(v) => setStorylineField("stage01", "scene", v)} />
          <TextField label="HÀNH ĐỘNG GIỚI HẠN QUYỀN" multiline value={value.storyline.stage01.limitedAction} onChange={(v) => setStorylineField("stage01", "limitedAction", v)} />
          <TextField label="HÀNH ĐỘNG CẤP QUYỀN RỘNG" multiline value={value.storyline.stage01.broadAction} onChange={(v) => setStorylineField("stage01", "broadAction", v)} />
          <TextField label="EVIDENCE STAGE 02 — JSON" multiline value={value.stage02ArtifactsText} onChange={(v) => setField("stage02ArtifactsText", v)} />
          <TextField label="SỰ CỐ STAGE 03" multiline value={value.storyline.stage03.incident} onChange={(v) => setStorylineField("stage03", "incident", v)} />
          <TextField label="KẾT CỤC KHI XỬ LÝ AN TOÀN" multiline value={value.storyline.stage03.safeEnding} onChange={(v) => setStorylineField("stage03", "safeEnding", v)} />
          <TextField label="KẾT CỤC KHI RỦI RO CÒN CAO" multiline value={value.storyline.stage03.exposedEnding} onChange={(v) => setStorylineField("stage03", "exposedEnding", v)} />
          <TextField label="AI GUARDIAN — MỞ ĐẦU" multiline value={value.storyline.guardian.opening} onChange={(v) => setStorylineField("guardian", "opening", v)} />
          <TextField label="AI GUARDIAN — STAGE 01" multiline value={value.storyline.guardian.stage01} onChange={(v) => setStorylineField("guardian", "stage01", v)} />
          <TextField label="AI GUARDIAN — STAGE 02" multiline value={value.storyline.guardian.stage02} onChange={(v) => setStorylineField("guardian", "stage02", v)} />
          <TextField label="AI GUARDIAN — STAGE 03" multiline value={value.storyline.guardian.stage03} onChange={(v) => setStorylineField("guardian", "stage03", v)} />
        </div>
      </>
    );
  }

  if (step === 0) {
    return (
      <>
        <p className="text-xs leading-5 text-slate-500">Bước 1/3 · Tạo danh tính dễ nhớ. Persona mô tả một kiểu hành vi số sẽ liên quan tới các nhiệm vụ.</p>
        <div className="grid gap-3 md:grid-cols-2">
          <TextField label="MÃ HỒ SƠ" readOnly={Boolean(value._id)} value={value.characterCode} onChange={(v) => setField("characterCode", v.toUpperCase())} />
          <TextField label="TÊN NHÂN VẬT HƯ CẤU" value={value.characterName} onChange={(v) => setField("characterName", v)} />
          <TextField label="PERSONA / KIỂU HÀNH VI SỐ" value={value.persona} onChange={(v) => setField("persona", v)} />
          <TextField label="TUỔI" type="number" value={value.age} onChange={(v) => setField("age", Number(v))} />
          <TextField label="GIỚI TÍNH" value={value.gender} onChange={(v) => setField("gender", v)} />
          <TextField label="LỚP (HƯ CẤU)" value={value.className} onChange={(v) => setField("className", v)} />
          <TextField label="TRƯỜNG (HƯ CẤU)" value={value.school} onChange={(v) => setField("school", v)} />
          <TextField label="TÌNH TRẠNG QUAN HỆ (HƯ CẤU)" value={value.relationshipStatus} onChange={(v) => setField("relationshipStatus", v)} />
        </div>
      </>
    );
  }

  if (step === 1) {
    return (
      <>
        <p className="text-xs leading-5 text-slate-500">Bước 2/3 · Đây là dữ liệu mô phỏng để tạo bối cảnh, không dùng làm tài khoản hay phương thức liên hệ thật.</p>
        <div className="grid gap-3 md:grid-cols-2">
          <TextField label="ĐỊA CHỈ HƯ CẤU" value={value.address} onChange={(v) => setField("address", v)} />
          <TextField label="LOẠI NHÀ Ở HƯ CẤU" value={value.housing} onChange={(v) => setField("housing", v)} />
          <TextField label="SỐ ĐIỆN THOẠI — DEMO ONLY HOẶC CHE BẰNG X" value={value.contact.phone} onChange={(v) => setNested("contact", "phone", v)} />
          <TextField label="EMAIL — DÙNG MIỀN .INVALID" type="email" value={value.contact.email} onChange={(v) => setNested("contact", "email", v)} />
          <TextField label="TÀI KHOẢN MẠNG XÃ HỘI GIẢ LẬP" value={value.socialAccounts.facebookUsername} onChange={(v) => setNested("socialAccounts", "facebookUsername", v)} />
          <TextField label="MẬT KHẨU GIẢ LẬP — GHI DEMO ONLY" value={value.socialAccounts.simulatedPassword} onChange={(v) => setNested("socialAccounts", "simulatedPassword", v)} />
          <TextField label="SỐ DƯ GIẢ LẬP" type="number" value={value.financialInfo.simulatedBalance} onChange={(v) => setNested("financialInfo", "simulatedBalance", Number(v))} />
          <TextField label="ĐƠN VỊ TIỀN GIẢ LẬP" value={value.financialInfo.currencyLabel} onChange={(v) => setNested("financialInfo", "currencyLabel", v)} />
          <ListField label="Thành viên gia đình hư cấu" value={value.familyMembers} onChange={(v) => setField("familyMembers", v)} />
        </div>
      </>
    );
  }

  return (
    <>
      <p className="text-xs leading-5 text-slate-500">Bước 3/5 · Các dấu vết và rủi ro này làm chất liệu cho câu chuyện/nhiệm vụ. Ghi cụ thể để người chơi hiểu được vấn đề.</p>
      <div className="grid gap-3 md:grid-cols-2">
        <TextField label="TÓM TẮT NHÂN VẬT VÀ THÓI QUEN SỐ" multiline value={value.lifestyle.summary} onChange={(v) => setNested("lifestyle", "summary", v)} />
        <ListField label="DẤU VẾT SỐ CÔNG KHAI" value={value.digitalFootprint} onChange={(v) => setField("digitalFootprint", v)} />
        <ListField label="RỦI RO CÓ THỂ KHAI THÁC TRONG CÂU CHUYỆN" value={value.riskFactors} onChange={(v) => setField("riskFactors", v)} />
        <ListField label="Sở thích" value={value.lifestyle.hobbies} onChange={(v) => setNested("lifestyle", "hobbies", v)} />
        <ListField label="Thói quen" value={value.lifestyle.habits} onChange={(v) => setNested("lifestyle", "habits", v)} />
        <ListField label="Địa điểm thường lui tới — chỉ địa điểm hư cấu" value={value.lifestyle.frequentPlaces} onChange={(v) => setNested("lifestyle", "frequentPlaces", v)} />
      </div>
    </>
  );
}

function MissionForm({ value, setValue, entries, step }) {
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

  if (step === 3) {
    const correctLabels = value.options
      .filter((option) => value.correctAnswer.includes(option.id))
      .map((option) => option.label);
    return (
      <div className="space-y-4">
        <div className="border border-cyan-200/15 bg-cyan-200/[0.03] p-4">
          <p className="font-mono text-[10px] tracking-[0.12em] text-cyan-100/70">XEM TRƯỚC CÂU HỎI</p>
          <p className="mt-3 text-xs text-cyan-100/60">STAGE {value.stage} · {value.title || "Chưa có tiêu đề"}</p>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-200">{value.story}</p>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-white">{value.scenario}</p>
          <p className="mt-3 text-xs font-semibold text-cyan-100">{value.interactionPrompt}</p>
          <ol className="mt-3 list-inside list-[upper-alpha] space-y-2 text-xs text-slate-300">
            {value.options.map((option) => <li key={option.id}>{option.label} — {option.detail}</li>)}
          </ol>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <p className="text-xs leading-5 text-emerald-100">Đáp án đúng: {correctLabels.join(" · ") || "Chưa chọn"}</p>
          <p className="text-xs leading-5 text-slate-400">Giải thích: {value.explanation || "Chưa có giải thích."}</p>
          <p className="text-xs leading-5 text-slate-400">Bài học: {value.lesson || "Chưa có bài học."}</p>
          <p className="text-xs leading-5 text-slate-400">Căn cứ: {value.legalBasis || "Chưa có căn cứ."}</p>
        </div>
        <p className="text-xs leading-5 text-amber-100/80">Trạng thái pháp lý: {value.legalReviewRequired ? "Cần chuyên gia rà soát" : "Đã đánh dấu không cần rà soát — chỉ chọn nếu đã được người có chuyên môn xác nhận."}</p>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="space-y-4">
        <p className="text-xs leading-5 text-slate-500">Bước 2/4 · Mỗi lựa chọn cần một ID duy nhất. Đánh dấu đáp án đúng; ở chế độ nhiều đáp án, người chơi phải chọn đúng toàn bộ tập đáp án để được tính đúng.</p>
        <div className="grid gap-3 md:grid-cols-2">
          <label className={labelClass}>
            KIỂU TRẢ LỜI
            <select className={fieldClass} onChange={(event) => setValue((current) => ({ ...current, answerMode: event.target.value, correctAnswer: event.target.value === "single" ? current.correctAnswer.slice(0, 1) : current.correctAnswer }))} value={value.answerMode}>
              <option value="multiple">Nhiều đáp án</option>
              <option value="single">Một đáp án</option>
            </select>
          </label>
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
                let next = value.options.length + 1;
                while (value.options.some((option) => option.id === `option-${next}`)) {
                  next += 1;
                }
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
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="space-y-4">
        <p className="text-xs leading-5 text-slate-500">Bước 3/4 · Giải thích vì sao đáp án phù hợp, rút ra bài học và ghi căn cứ pháp lý. Nếu chưa được chuyên gia kiểm tra, giữ trạng thái cần rà soát.</p>
        <div className="grid gap-3 md:grid-cols-2">
          <TextField label="GIẢI THÍCH SAU KHI TRẢ LỜI" multiline value={value.explanation} onChange={(v) => setField("explanation", v)} />
          <TextField label="BÀI HỌC NGƯỜI CHƠI NÊN NHỚ" multiline value={value.lesson} onChange={(v) => setField("lesson", v)} />
          <TextField label="CĂN CỨ / GHI CHÚ PHÁP LÝ" multiline value={value.legalBasis} onChange={(v) => setField("legalBasis", v)} />
          <label className="flex items-center gap-2 text-xs text-amber-200">
            <input checked={value.legalReviewRequired} onChange={(event) => setField("legalReviewRequired", event.target.checked)} type="checkbox" />
            Cần chuyên gia rà soát pháp lý
          </label>
          <label className="flex items-center gap-2 text-xs text-slate-300">
            <input checked={value.isActive} onChange={(event) => setField("isActive", event.target.checked)} type="checkbox" />
            Nhiệm vụ đang hoạt động
          </label>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-xs leading-5 text-slate-500">Bước 1/4 · Viết bối cảnh và câu hỏi trước khi nghĩ đến đáp án. Một tình huống tốt nêu rõ mục tiêu, dữ kiện quan trọng và điều người chơi cần quyết định.</p>
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
        <TextField label="HƯỚNG DẪN CHỌN" multiline value={value.interactionPrompt} onChange={(v) => setField("interactionPrompt", v)} />
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
  const [wizardStep, setWizardStep] = useState(0);
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
      setDraft(
        isProfile
          ? {
              ...result.entry,
              storyline: result.entry.storyline ?? emptyStoryline(),
              stage02ArtifactsText: JSON.stringify(
                result.entry.storyline?.stage02?.artifacts ?? [],
                null,
                2,
              ),
            }
          : result.entry,
      );
      setWizardStep(0);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  function addEntry() {
    setSelectedCode("");
    setErrorMessage("");
    setWizardStep(0);
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
    const validationError = isProfile
      ? validateProfileStep(draft, 4)
      : validateMissionStep(draft, 3, entries);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }
    setBusy(true);
    setErrorMessage("");
    try {
      const response = await fetch(
        selectedCode ? `${baseUrl}/${selectedCode}` : baseUrl,
        {
          method: selectedCode ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            isProfile
              ? {
                  ...draft,
                  storyline: {
                    ...draft.storyline,
                    stage02: {
                      artifacts: JSON.parse(draft.stage02ArtifactsText),
                    },
                  },
                }
              : draft,
          ),
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

  function advanceWizard() {
    const validationError = isProfile
      ? validateProfileStep(draft, wizardStep)
      : validateMissionStep(draft, wizardStep, entries);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }
    setErrorMessage("");
    setWizardStep((step) => step + 1);
  }

  function retreatWizard() {
    setErrorMessage("");
    setWizardStep((step) => Math.max(0, step - 1));
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
          {(() => {
            const steps = isProfile
              ? ["Danh tính", "Bối cảnh", "Dấu vết", "Cốt truyện RPG", "Xem lại"]
              : ["Tình huống", "Lựa chọn & đáp án", "Giải thích", "Xem trước"];
            return (
              <ol aria-label="Các bước tạo nội dung" className={`mb-5 grid ${isProfile ? "grid-cols-5" : "grid-cols-4"} gap-2`}>
                {steps.map((label, index) => (
                  <li aria-current={wizardStep === index ? "step" : undefined} className={`border-t-2 pt-2 text-[9px] sm:text-xs ${wizardStep === index ? "border-cyan-200 text-cyan-100" : wizardStep > index ? "border-emerald-200/50 text-emerald-100/70" : "border-white/10 text-slate-600"}`} key={label}>
                    <span className="font-mono">{String(index + 1).padStart(2, "0")}</span>
                    <span className="ml-1 sm:ml-2">{label}</span>
                  </li>
                ))}
              </ol>
            );
          })()}
          {isProfile ? (
            <ProfileForm value={draft} setValue={setDraft} step={wizardStep} />
          ) : (
            <MissionForm value={draft} setValue={setDraft} entries={entries} step={wizardStep} />
          )}
          <p aria-live="polite" className="mt-3 min-h-5 text-xs text-rose-300">{errorMessage}</p>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-2">
              {wizardStep > 0 && (
                <button className="min-h-11 border border-white/10 px-4 font-mono text-[10px] text-slate-300 disabled:opacity-50" disabled={busy} onClick={retreatWizard} type="button">
                  QUAY LẠI
                </button>
              )}
              {wizardStep < (isProfile ? 4 : 3) ? (
                <button className="inline-flex min-h-11 items-center gap-2 bg-cyan-300 px-4 font-mono text-[10px] font-bold text-slate-950 disabled:opacity-50" disabled={busy} onClick={advanceWizard} type="button">
                  TIẾP TỤC
                </button>
              ) : (
                <button className="inline-flex min-h-11 items-center gap-2 bg-cyan-300 px-4 font-mono text-[10px] font-bold text-slate-950 disabled:opacity-50" disabled={busy} type="submit">
                  <Save size={14} /> {busy ? "ĐANG LƯU..." : isProfile ? "LƯU HỒ SƠ" : "LƯU CÂU HỎI"}
                </button>
              )}
            </div>
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
