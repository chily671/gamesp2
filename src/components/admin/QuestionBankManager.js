"use client";

import { useState } from "react";
import { Plus, Save, Trash2, X } from "lucide-react";

const LEGAL_ARTICLES = [3, 4, 7, 9, 10, 12, 16, 19];
const fieldClass =
  "mt-1 min-h-10 w-full border border-white/10 bg-[#050a13] px-3 py-2 text-xs text-white outline-none focus:border-cyan-200/50";
const labelClass =
  "block font-mono text-[9px] tracking-[0.1em] text-slate-400";

function nextQuestionCode(entries) {
  const maxNumber = entries.reduce((max, entry) => {
    const match = /^QUESTION-(\d+)$/.exec(entry.questionCode);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);
  return `QUESTION-${String(maxNumber + 1).padStart(3, "0")}`;
}

function emptyQuestion(questionCode) {
  return {
    questionCode,
    title: "",
    story: "",
    scenario: "",
    interactionPrompt: "",
    answerMode: "single",
    options: [
      { id: "option-a", label: "", detail: "" },
      { id: "option-b", label: "", detail: "" },
    ],
    correctAnswer: [],
    explanation: "",
    lesson: "",
    legalArticles: [],
    legalBasis: "",
    legalReviewRequired: true,
    isActive: true,
  };
}

function TextControl({ label, value, onChange, multiline = false, readOnly = false }) {
  const Control = multiline ? "textarea" : "input";
  return (
    <label className={labelClass}>
      {label}
      <Control
        className={`${fieldClass} ${multiline ? "min-h-20 resize-y" : ""}`}
        onChange={(event) => onChange(event.target.value)}
        readOnly={readOnly}
        required
        value={value ?? ""}
      />
    </label>
  );
}

export default function QuestionBankManager({
  entries,
  questionCount,
  activeQuestionCount,
  onChanged,
}) {
  const [draft, setDraft] = useState(null);
  const [selectedCode, setSelectedCode] = useState("");
  const [countDraft, setCountDraft] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [savingCount, setSavingCount] = useState(false);

  function setField(key, value) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function addQuestion() {
    setSelectedCode("");
    setErrorMessage("");
    setDraft(emptyQuestion(nextQuestionCode(entries)));
  }

  async function editQuestion(code) {
    setBusy(true);
    setErrorMessage("");
    try {
      const response = await fetch(
        `/api/admin/content/quiz-questions/${code}`,
        { cache: "no-store" },
      );
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error ?? "Không thể tải câu hỏi.");
      }
      setSelectedCode(code);
      setDraft(result.entry);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function saveQuestion(event) {
    event.preventDefault();
    if (!draft || busy) return;
    setBusy(true);
    setErrorMessage("");
    try {
      const response = await fetch(
        selectedCode
          ? `/api/admin/content/quiz-questions/${selectedCode}`
          : "/api/admin/content/quiz-questions",
        {
          method: selectedCode ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(draft),
        },
      );
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error ?? "Không thể lưu câu hỏi.");
      }
      setDraft(null);
      setSelectedCode("");
      await onChanged();
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  async function saveQuestionCount(event) {
    event.preventDefault();
    if (savingCount) return;
    const nextCount = Number(countDraft || questionCount);
    setSavingCount(true);
    setErrorMessage("");
    try {
      const response = await fetch("/api/admin/question-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionCount: nextCount }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error ?? "Không thể lưu số câu mỗi ván.");
      }
      setCountDraft(String(result.questionCount));
      await onChanged();
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setSavingCount(false);
    }
  }

  async function changeActive(entry) {
    setErrorMessage("");
    try {
      const response = await fetch(
        `/api/admin/content/quiz-questions/${entry.questionCode}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isActive: !entry.isActive }),
        },
      );
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error ?? "Không thể cập nhật trạng thái câu hỏi.");
      }
      await onChanged();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  async function deleteQuestion() {
    if (!selectedCode) return;
    if (!window.confirm("Xóa câu hỏi này khỏi ngân hàng?")) return;
    setBusy(true);
    setErrorMessage("");
    try {
      const response = await fetch(
        `/api/admin/content/quiz-questions/${selectedCode}`,
        { method: "DELETE" },
      );
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error ?? "Không thể xóa câu hỏi.");
      }
      setDraft(null);
      setSelectedCode("");
      await onChanged();
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  function updateOption(index, patch) {
    const oldId = draft.options[index].id;
    const options = draft.options.map((option, optionIndex) =>
      optionIndex === index ? { ...option, ...patch } : option,
    );
    setDraft((current) => ({
      ...current,
      options,
      correctAnswer: current.correctAnswer
        .map((id) => (id === oldId && patch.id ? patch.id : id))
        .filter((id) => options.some((option) => option.id === id)),
    }));
  }

  function toggleCorrectAnswer(id, checked) {
    let correctAnswer = checked
      ? [...draft.correctAnswer, id]
      : draft.correctAnswer.filter((answer) => answer !== id);
    if (draft.answerMode === "single" && checked) correctAnswer = [id];
    setField("correctAnswer", correctAnswer);
  }

  return (
    <section className="border border-cyan-200/15 bg-cyan-200/[0.025] p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-mono text-xs tracking-[0.14em] text-cyan-100">
            NGÂN HÀNG CÂU HỎI
          </h2>
          <p className="mt-1 max-w-2xl text-[10px] leading-5 text-slate-500">
            Người chơi nhận ngẫu nhiên các câu đang bật. Nội dung mẫu được đối
            chiếu theo danh sách điều luật đã cung cấp và vẫn cần chuyên gia
            pháp lý rà soát.
          </p>
        </div>
        <button
          className="inline-flex min-h-10 items-center gap-2 bg-cyan-300 px-3 font-mono text-[9px] font-bold text-slate-950"
          onClick={addQuestion}
          type="button"
        >
          <Plus size={14} /> THÊM CÂU HỎI
        </button>
      </div>

      <div className="mt-4 grid gap-4 border-y border-white/[0.07] py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <div>
          <p className="font-mono text-[9px] tracking-[0.1em] text-slate-400">
            SỐ CÂU MỖI VÁN
          </p>
          <p className="mt-1 text-[10px] leading-5 text-slate-500">
            Mặc định là 4; câu hỏi được bốc ngẫu nhiên không lặp từ ngân hàng
            đang hoạt động ({activeQuestionCount} câu).
          </p>
        </div>
        <form className="flex items-end gap-2" onSubmit={saveQuestionCount}>
          <label className={labelClass}>
            SỐ CÂU
            <input
              className={`${fieldClass} w-24`}
              max={activeQuestionCount}
              min="1"
              onChange={(event) => setCountDraft(event.target.value)}
              required
              type="number"
              value={countDraft || questionCount}
            />
          </label>
          <button
            className="inline-flex min-h-10 items-center gap-2 border border-cyan-200/30 px-3 font-mono text-[9px] text-cyan-100 disabled:opacity-50"
            disabled={savingCount || activeQuestionCount < 1}
            type="submit"
          >
            <Save size={13} /> LƯU
          </button>
        </form>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {entries.map((entry) => (
          <article
            className="flex min-h-16 items-center gap-2 border border-white/[0.08] px-3 py-2"
            key={entry.questionCode}
          >
            <button
              className="min-w-0 flex-1 text-left"
              disabled={busy}
              onClick={() => editQuestion(entry.questionCode)}
              type="button"
            >
              <span className="block truncate text-xs text-slate-200">
                {entry.title}
              </span>
              <span className="mt-1 block font-mono text-[9px] text-slate-600">
                {entry.questionCode} · {entry.legalReviewRequired ? "CẦN RÀ SOÁT LUẬT" : "ĐÃ ĐÁNH DẤU RÀ SOÁT"}
              </span>
            </button>
            <button
              className={`min-h-8 border px-2 font-mono text-[8px] ${entry.isActive ? "border-emerald-200/20 text-emerald-100" : "border-white/10 text-slate-500"}`}
              onClick={() => changeActive(entry)}
              type="button"
            >
              {entry.isActive ? "ĐANG BẬT" : "ĐANG TẮT"}
            </button>
          </article>
        ))}
        {entries.length === 0 && (
          <p className="text-xs text-slate-500">Chưa có câu hỏi trong ngân hàng.</p>
        )}
      </div>

      <p aria-live="polite" className="mt-3 min-h-5 text-xs text-rose-300">
        {errorMessage}
      </p>

      {draft && (
        <form
          className="mt-4 space-y-4 border-t border-white/10 pt-5"
          onSubmit={saveQuestion}
        >
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-white">
              {selectedCode ? "CHỈNH SỬA CÂU HỎI" : "TẠO CÂU HỎI"}
            </h3>
            <button
              aria-label="Đóng biểu mẫu"
              className="min-h-9 border border-white/10 px-2 text-slate-400"
              onClick={() => {
                setDraft(null);
                setSelectedCode("");
                setErrorMessage("");
              }}
              type="button"
            >
              <X size={15} />
            </button>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <TextControl
              label="MÃ CÂU HỎI"
              onChange={(value) => setField("questionCode", value)}
              readOnly={Boolean(selectedCode)}
              value={draft.questionCode}
            />
            <TextControl
              label="TIÊU ĐỀ"
              onChange={(value) => setField("title", value)}
              value={draft.title}
            />
            <TextControl
              label="BỐI CẢNH"
              multiline
              onChange={(value) => setField("story", value)}
              value={draft.story}
            />
            <TextControl
              label="TÌNH HUỐNG"
              multiline
              onChange={(value) => setField("scenario", value)}
              value={draft.scenario}
            />
            <TextControl
              label="CÂU HỎI / YÊU CẦU TƯƠNG TÁC"
              onChange={(value) => setField("interactionPrompt", value)}
              value={draft.interactionPrompt}
            />
            <label className={labelClass}>
              KIỂU TRẢ LỜI
              <select
                className={fieldClass}
                onChange={(event) => {
                  const answerMode = event.target.value;
                  setDraft((current) => ({
                    ...current,
                    answerMode,
                    correctAnswer:
                      answerMode === "single"
                        ? current.correctAnswer.slice(0, 1)
                        : current.correctAnswer,
                  }));
                }}
                value={draft.answerMode}
              >
                <option value="single">Một đáp án</option>
                <option value="multiple">Nhiều đáp án</option>
              </select>
            </label>
          </div>

          <section className="border border-white/10 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h4 className="font-mono text-[9px] tracking-[0.1em] text-white">
                  LỰA CHỌN VÀ ĐÁP ÁN ĐÚNG
                </h4>
                <p className="mt-1 text-[10px] text-slate-500">
                  Đánh dấu các đáp án đúng; ở chế độ một đáp án chỉ chọn một.
                </p>
              </div>
              <button
                className="min-h-9 border border-cyan-200/20 px-3 font-mono text-[9px] text-cyan-100"
                onClick={() => {
                  let next = draft.options.length + 1;
                  while (
                    draft.options.some((option) => option.id === `option-${next}`)
                  ) {
                    next += 1;
                  }
                  setField("options", [
                    ...draft.options,
                    { id: `option-${next}`, label: "", detail: "" },
                  ]);
                }}
                type="button"
              >
                <Plus className="mr-1 inline" size={13} /> THÊM LỰA CHỌN
              </button>
            </div>
            <div className="mt-3 space-y-3">
              {draft.options.map((option, index) => (
                <div
                  className="grid items-end gap-2 border-t border-white/[0.06] pt-3 sm:grid-cols-[0.8fr_1.2fr_1.5fr_auto_auto]"
                  key={`${index}-${option.id}`}
                >
                  <TextControl
                    label="ID"
                    onChange={(value) => updateOption(index, { id: value })}
                    value={option.id}
                  />
                  <TextControl
                    label="NỘI DUNG"
                    onChange={(value) => updateOption(index, { label: value })}
                    value={option.label}
                  />
                  <TextControl
                    label="MÔ TẢ"
                    onChange={(value) => updateOption(index, { detail: value })}
                    value={option.detail}
                  />
                  <label className="flex min-h-10 items-center gap-2 text-[9px] text-emerald-200">
                    <input
                      checked={draft.correctAnswer.includes(option.id)}
                      onChange={(event) =>
                        toggleCorrectAnswer(option.id, event.target.checked)
                      }
                      type="checkbox"
                    />
                    ĐÚNG
                  </label>
                  <button
                    aria-label={`Xóa lựa chọn ${index + 1}`}
                    className="min-h-10 border border-rose-200/20 px-2 text-rose-200"
                    disabled={draft.options.length <= 2}
                    onClick={() => {
                      const removedId = option.id;
                      setDraft((current) => ({
                        ...current,
                        options: current.options.filter(
                          (_, optionIndex) => optionIndex !== index,
                        ),
                        correctAnswer: current.correctAnswer.filter(
                          (answer) => answer !== removedId,
                        ),
                      }));
                    }}
                    type="button"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <div className="grid gap-3 md:grid-cols-2">
            <TextControl
              label="GIẢI THÍCH SAU KHI TRẢ LỜI"
              multiline
              onChange={(value) => setField("explanation", value)}
              value={draft.explanation}
            />
            <TextControl
              label="BÀI HỌC"
              multiline
              onChange={(value) => setField("lesson", value)}
              value={draft.lesson}
            />
            <TextControl
              label="CĂN CỨ PHÁP LÝ / GHI CHÚ RÀ SOÁT"
              multiline
              onChange={(value) => setField("legalBasis", value)}
              value={draft.legalBasis}
            />
            <fieldset className="border border-white/[0.07] p-3">
              <legend className="px-1 font-mono text-[9px] text-slate-400">
                ĐIỀU LUẬT ĐƯỢC ĐỐI CHIẾU
              </legend>
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-2">
                {LEGAL_ARTICLES.map((article) => (
                  <label
                    className="flex items-center gap-1 text-[10px] text-slate-300"
                    key={article}
                  >
                    <input
                      checked={draft.legalArticles.includes(article)}
                      onChange={(event) =>
                        setField(
                          "legalArticles",
                          event.target.checked
                            ? [...draft.legalArticles, article]
                            : draft.legalArticles.filter((item) => item !== article),
                        )
                      }
                      type="checkbox"
                    />
                    Điều {article}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          <div className="flex flex-wrap gap-5 text-[10px] text-slate-300">
            <label className="flex items-center gap-2 text-amber-100">
              <input
                checked={draft.legalReviewRequired}
                onChange={(event) =>
                  setField("legalReviewRequired", event.target.checked)
                }
                type="checkbox"
              />
              Cần chuyên gia rà soát pháp lý
            </label>
            <label className="flex items-center gap-2">
              <input
                checked={draft.isActive}
                onChange={(event) => setField("isActive", event.target.checked)}
                type="checkbox"
              />
              Câu hỏi đang hoạt động
            </label>
          </div>

          <p aria-live="polite" className="min-h-5 text-xs text-rose-300">
            {errorMessage}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              className="inline-flex min-h-11 items-center gap-2 bg-cyan-300 px-4 font-mono text-[10px] font-bold text-slate-950 disabled:opacity-50"
              disabled={busy}
              type="submit"
            >
              <Save size={14} /> {busy ? "ĐANG LƯU..." : "LƯU CÂU HỎI"}
            </button>
            {selectedCode && (
              <button
                className="inline-flex min-h-11 items-center gap-2 border border-rose-200/20 px-4 font-mono text-[10px] text-rose-200 disabled:opacity-50"
                disabled={busy}
                onClick={deleteQuestion}
                type="button"
              >
                <Trash2 size={14} /> XÓA
              </button>
            )}
          </div>
        </form>
      )}
    </section>
  );
}
