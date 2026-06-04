// Forms & actions: Buttons, Fields, Upload, Modal, Empty, Validation
const { useState: useStateForm, useRef: useRefForm } = React;

/* ───────────── Buttons ───────────── */
const buttonCSS = `
.ds-btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; height: 36px; padding: 0 14px; border-radius: var(--r-md); font-size: 13.5px; font-weight: 700; letter-spacing: 0; cursor: pointer; border: 1px solid transparent; transition: background 120ms, border-color 120ms, color 120ms, box-shadow 120ms, transform 120ms; white-space: nowrap; user-select: none; line-height: 1; font-family: inherit; color: inherit; background: transparent; }
.ds-btn:focus-visible { outline: none; box-shadow: var(--shadow-focus); }
.ds-btn[disabled] { opacity: 0.5; cursor: not-allowed; }
.ds-btn[data-size="sm"] { height: 28px; padding: 0 10px; font-size: 12.5px; gap: 5px; }
.ds-btn[data-size="lg"] { height: 44px; padding: 0 18px; font-size: 14.5px; gap: 8px; }
.ds-btn[data-size="xs"] { height: 24px; padding: 0 8px; font-size: 12px; }
.ds-btn[data-icon-only="true"] { padding: 0; width: 36px; }
.ds-btn[data-icon-only="true"][data-size="sm"] { width: 28px; }
.ds-btn[data-icon-only="true"][data-size="lg"] { width: 44px; }

/* primary */
.ds-btn[data-variant="primary"] { background: linear-gradient(180deg, var(--accent), var(--accent-hover)); color: var(--paper); border-color: color-mix(in srgb, var(--accent-hover) 88%, #000); box-shadow: 0 1px 0 rgba(255,255,255,0.22) inset, 0 7px 14px -8px rgba(99,91,255,0.72), 0 1px 2px rgba(10,37,64,0.14); }
.ds-btn[data-variant="primary"]:hover:not([disabled]) { background: linear-gradient(180deg, color-mix(in srgb, var(--accent) 84%, #fff), var(--accent)); box-shadow: 0 1px 0 rgba(255,255,255,0.26) inset, 0 10px 18px -10px rgba(99,91,255,0.78), 0 2px 4px rgba(10,37,64,0.14); transform: translateY(-1px); }
.ds-btn[data-variant="primary"]:active:not([disabled]) { background: var(--accent-active); transform: translateY(0); }

/* accent */
.ds-btn[data-variant="accent"] { background: linear-gradient(180deg, var(--stripe-blue-800), var(--stripe-blue-900)); color: var(--paper); border-color: var(--stripe-blue-900); box-shadow: 0 1px 0 rgba(255,255,255,0.14) inset, 0 8px 16px -10px rgba(10,37,64,0.70); }
.ds-btn[data-variant="accent"]:hover:not([disabled]) { background: linear-gradient(180deg, var(--stripe-blue-700), var(--stripe-blue-800)); border-color: var(--stripe-blue-800); transform: translateY(-1px); box-shadow: 0 1px 0 rgba(255,255,255,0.16) inset, 0 12px 20px -12px rgba(10,37,64,0.78); }
.ds-btn[data-variant="accent"]:active:not([disabled]) { background: var(--stripe-blue-950); transform: translateY(0); }

/* secondary */
.ds-btn[data-variant="secondary"] { background: #FFFFFF; color: var(--ink-800); border-color: #D8E0EA; box-shadow: var(--shadow-xs); }
.ds-btn[data-variant="secondary"]:hover:not([disabled]) { background: var(--ink-50); border-color: #C7D2E1; color: var(--accent-text); box-shadow: var(--shadow-sm); transform: translateY(-1px); }
.ds-btn[data-variant="secondary"]:active:not([disabled]) { background: var(--ink-100); }

/* ghost */
.ds-btn[data-variant="ghost"] { background: transparent; color: var(--ink-700); }
.ds-btn[data-variant="ghost"]:hover:not([disabled]) { background: var(--accent-soft); color: var(--accent-text); }
.ds-btn[data-variant="ghost"][data-danger="true"] { color: var(--danger-text); }
.ds-btn[data-variant="ghost"][data-danger="true"]:hover:not([disabled]) { background: var(--danger-soft); }

/* danger */
.ds-btn[data-variant="danger"] { background: var(--danger); color: var(--paper); border-color: var(--danger); }
.ds-btn[data-variant="danger"]:hover:not([disabled]) { background: #C81436; transform: translateY(-1px); }

/* link */
.ds-btn[data-variant="link"] { background: transparent; color: var(--accent-text); padding: 0; height: auto; }
.ds-btn[data-variant="link"]:hover { text-decoration: underline; }

.ds-btn-group { display: inline-flex; }
.ds-btn-group .ds-btn { border-radius: 0; }
.ds-btn-group .ds-btn:first-child { border-radius: var(--r-md) 0 0 var(--r-md); }
.ds-btn-group .ds-btn:last-child { border-radius: 0 var(--r-md) var(--r-md) 0; }
.ds-btn-group .ds-btn:not(:first-child) { border-left-color: var(--ink-200); margin-left: -1px; }
.ds-btn-split { display: inline-flex; }
.ds-btn-split .ds-btn:first-child { border-radius: var(--r-md) 0 0 var(--r-md); border-right: 1px solid rgba(255,255,255,0.18); }
.ds-btn-split .ds-btn:last-child { border-radius: 0 var(--r-md) var(--r-md) 0; padding: 0 8px; }

.ds-btn-spinner { width: 14px; height: 14px; border: 2px solid currentColor; border-right-color: transparent; border-radius: 50%; animation: dsSpin 0.7s linear infinite; }
@keyframes dsSpin { to { transform: rotate(360deg); } }
`;

const Btn = ({ variant = "secondary", size, leadingIcon, trailingIcon, iconOnly, danger, loading, children, ...rest }) => (
  <button
    className="ds-btn"
    data-variant={variant}
    data-size={size}
    data-danger={danger}
    data-icon-only={iconOnly}
    disabled={rest.disabled || loading}
    {...rest}
  >
    {loading ? <span className="ds-btn-spinner" /> : leadingIcon && <Icon name={leadingIcon} size={size === "sm" ? 13 : size === "lg" ? 16 : 14} />}
    {!iconOnly && children}
    {trailingIcon && !loading && <Icon name={trailingIcon} size={size === "sm" ? 13 : 14} />}
  </button>
);

window.Btn = Btn; // exposed early so other components can use

/* ───────────── Form fields ───────────── */
const fieldCSS = `
.ds-field { display: flex; flex-direction: column; gap: 6px; }
.ds-label { font-size: 12.5px; font-weight: 600; color: var(--ink-800); display: flex; align-items: center; gap: 4px; letter-spacing: -0.005em; }
.ds-label-opt { font-weight: 400; color: var(--ink-500); font-size: 11.5px; }
.ds-label-req { color: var(--danger); }
.ds-help { font-size: 12px; color: var(--ink-500); line-height: 1.4; }
.ds-err { font-size: 12px; color: var(--danger-text); display: flex; align-items: center; gap: 4px; }

.ds-input { width: 100%; height: 36px; padding: 0 12px; border: var(--hairline); border-radius: var(--r-md); background: var(--paper); font-size: 13.5px; outline: none; transition: 120ms; color: var(--ink-900); }
.ds-input::placeholder { color: var(--ink-400); }
.ds-input:hover:not(:focus):not([disabled]) { border-color: var(--ink-300); }
.ds-input:focus { border-color: var(--accent); box-shadow: var(--shadow-focus); }
.ds-input[data-invalid="true"] { border-color: var(--danger); }
.ds-input[data-invalid="true"]:focus { box-shadow: 0 0 0 3px oklch(0.6 0.18 25 / 0.18); }
.ds-input[disabled] { background: var(--ink-50); color: var(--ink-500); cursor: not-allowed; }

.ds-input-group { position: relative; display: flex; align-items: stretch; }
.ds-input-group .ds-input { flex: 1; }
.ds-input-group .icon-left, .ds-input-group .icon-right { position: absolute; top: 50%; transform: translateY(-50%); color: var(--ink-500); pointer-events: none; }
.ds-input-group .icon-left { left: 11px; }
.ds-input-group .icon-right { right: 11px; }
.ds-input-group[data-has-left] .ds-input { padding-left: 36px; }
.ds-input-group[data-has-right] .ds-input { padding-right: 36px; }
.ds-input-affix { display: inline-flex; align-items: center; padding: 0 12px; background: var(--ink-50); border: var(--hairline); color: var(--ink-500); font-size: 13px; font-family: var(--font-mono); }
.ds-input-affix.left { border-right: 0; border-radius: var(--r-md) 0 0 var(--r-md); }
.ds-input-affix.right { border-left: 0; border-radius: 0 var(--r-md) var(--r-md) 0; }
.ds-input-affix + .ds-input { border-top-left-radius: 0; border-bottom-left-radius: 0; }
.ds-input:has(+ .ds-input-affix.right), .ds-input + .ds-input-affix.right { /* combined */ }

.ds-textarea { width: 100%; padding: 10px 12px; border: var(--hairline); border-radius: var(--r-md); background: var(--paper); font-size: 13.5px; outline: none; transition: 120ms; color: var(--ink-900); resize: vertical; min-height: 88px; line-height: 1.5; }
.ds-textarea:focus { border-color: var(--accent); box-shadow: var(--shadow-focus); }

.ds-select { width: 100%; height: 36px; padding: 0 36px 0 12px; border: var(--hairline); border-radius: var(--r-md); background: var(--paper); font-size: 13.5px; outline: none; appearance: none; cursor: pointer; background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='1.75' stroke-linecap='round' stroke-linejoin='round'><path d='m6 9 6 6 6-6'/></svg>"); background-repeat: no-repeat; background-position: right 10px center; background-size: 16px; }
.ds-select:focus { border-color: var(--accent); box-shadow: var(--shadow-focus); }

.ds-toggle { position: relative; display: inline-block; width: 34px; height: 20px; }
.ds-toggle input { display: none; }
.ds-toggle-slider { position: absolute; inset: 0; background: var(--ink-300); border-radius: var(--r-full); cursor: pointer; transition: 180ms; }
.ds-toggle-slider::after { content: ""; position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; border-radius: 50%; background: var(--paper); transition: 180ms; box-shadow: 0 1px 2px rgba(0,0,0,0.15); }
.ds-toggle input:checked + .ds-toggle-slider { background: var(--accent); }
.ds-toggle input:checked + .ds-toggle-slider::after { transform: translateX(14px); }

.ds-radio { width: 16px; height: 16px; border-radius: 50%; border: 1.5px solid var(--ink-300); background: var(--paper); cursor: pointer; display: inline-grid; place-items: center; transition: 120ms; flex-shrink: 0; }
.ds-radio[data-checked="true"] { border-color: var(--accent); border-width: 5px; }
.ds-radio:hover { border-color: var(--ink-500); }

.ds-radio-card { display: flex; gap: 12px; padding: 14px; border: var(--hairline); border-radius: var(--r-md); cursor: pointer; transition: 120ms; background: var(--paper); }
.ds-radio-card:hover { border-color: var(--ink-300); }
.ds-radio-card[data-checked="true"] { border-color: var(--accent); background: var(--accent-soft); box-shadow: 0 0 0 1px var(--accent) inset; }
.ds-radio-card-title { font-weight: 600; font-size: 13.5px; }
.ds-radio-card-desc { font-size: 12.5px; color: var(--ink-500); margin-top: 2px; }
`;

const Field = ({ label, required, optional, help, error, children, hint }) => (
  <div className="ds-field">
    {label && (
      <label className="ds-label">
        <span>{label}</span>
        {required && <span className="ds-label-req">*</span>}
        {optional && <span className="ds-label-opt">(optional)</span>}
      </label>
    )}
    {children}
    {error ? <div className="ds-err"><Icon name="alert" size={12} />{error}</div> : help ? <div className="ds-help">{help}</div> : null}
  </div>
);

const TextInput = ({ leadingIcon, trailingIcon, invalid, prefix, suffix, ...rest }) => (
  <div className="ds-input-group" data-has-left={leadingIcon ? "true" : undefined} data-has-right={trailingIcon ? "true" : undefined}>
    {prefix && <span className="ds-input-affix left">{prefix}</span>}
    {leadingIcon && <Icon name={leadingIcon} className="icon-left" size={15} />}
    <input className="ds-input" data-invalid={invalid} {...rest} />
    {trailingIcon && <Icon name={trailingIcon} className="icon-right" size={15} />}
    {suffix && <span className="ds-input-affix right">{suffix}</span>}
  </div>
);

const Select = ({ children, ...rest }) => <select className="ds-select" {...rest}>{children}</select>;
const Textarea = (props) => <textarea className="ds-textarea" {...props} />;
const Toggle = ({ checked, onChange }) => (
  <label className="ds-toggle">
    <input type="checkbox" checked={!!checked} onChange={(e) => onChange && onChange(e.target.checked)} />
    <span className="ds-toggle-slider" />
  </label>
);
const Radio = ({ checked, onChange }) => (
  <span className="ds-radio" data-checked={checked} onClick={() => onChange && onChange(true)} role="radio" aria-checked={checked} />
);
const RadioCard = ({ checked, onChange, icon, title, desc }) => (
  <div className="ds-radio-card" data-checked={checked} onClick={() => onChange && onChange(true)}>
    <Radio checked={checked} />
    <div>
      <div className="ds-radio-card-title" style={{display:"flex",alignItems:"center",gap:6}}>
        {icon && <Icon name={icon} size={14} />}
        {title}
      </div>
      <div className="ds-radio-card-desc">{desc}</div>
    </div>
  </div>
);

/* ───────────── Upload ───────────── */
const uploadCSS = `
.ds-upload { border: 1.5px dashed var(--ink-300); border-radius: var(--r-lg); padding: 24px; background: var(--ink-50); display: flex; flex-direction: column; align-items: center; gap: 8px; text-align: center; cursor: pointer; transition: 150ms; position: relative; }
.ds-upload:hover { border-color: var(--accent); background: var(--accent-soft); }
.ds-upload[data-drag="true"] { border-color: var(--accent); background: var(--accent-soft); border-style: solid; }
.ds-upload-icon { width: 44px; height: 44px; border-radius: var(--r-md); background: var(--paper); display: grid; place-items: center; color: var(--ink-700); border: var(--hairline); }
.ds-upload-title { font-weight: 600; font-size: 14px; color: var(--ink-900); }
.ds-upload-sub { font-size: 12.5px; color: var(--ink-500); }
.ds-upload-link { color: var(--accent-text); font-weight: 600; cursor: pointer; }
.ds-upload-formats { display: flex; gap: 6px; margin-top: 6px; flex-wrap: wrap; justify-content: center; }
.ds-upload-formats span { font-family: var(--font-mono); font-size: 10.5px; padding: 1px 6px; border-radius: 4px; background: var(--paper); color: var(--ink-600); border: var(--hairline); }

.ds-file-card { display: flex; align-items: center; gap: 12px; padding: 12px; border: var(--hairline); border-radius: var(--r-md); background: var(--paper); }
.ds-file-icon { width: 36px; height: 36px; border-radius: var(--r-sm); display: grid; place-items: center; flex-shrink: 0; font-family: var(--font-mono); font-size: 10px; font-weight: 700; letter-spacing: 0.04em; }
.ds-file-name { font-weight: 600; font-size: 13.5px; color: var(--ink-900); }
.ds-file-meta { font-size: 11.5px; color: var(--ink-500); display: flex; gap: 8px; align-items: center; margin-top: 2px; }
.ds-file-meta .sep { color: var(--ink-300); }
.ds-file-prog { flex: 1; max-width: 200px; height: 4px; background: var(--ink-100); border-radius: 2px; overflow: hidden; margin: 0 8px; }
.ds-file-prog-fill { height: 100%; background: var(--accent); transition: width 200ms; }
.ds-file-actions { display: flex; gap: 4px; }
`;

const UploadCard = ({ multi = true }) => {
  const [drag, setDrag] = useStateForm(false);
  return (
    <div
      className="ds-upload"
      data-drag={drag}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); }}
    >
      <div className="ds-upload-icon"><Icon name="upload" size={20} /></div>
      <div>
        <div className="ds-upload-title">Drop ESP schema files here</div>
        <div className="ds-upload-sub">or <span className="ds-upload-link">browse from your computer</span>{multi ? " — up to 25 at once" : ""}</div>
      </div>
      <div className="ds-upload-formats">
        <span>.xml</span><span>.esp</span><span>.yaml</span><span>.zip</span>
      </div>
    </div>
  );
};

const FileCard = ({ name, ext = "XML", size = "284 KB", status = "uploaded", progress = 100, meta }) => {
  const colors = {
    XML: { bg: "var(--info-soft)", color: "var(--info-text)" },
    ESP: { bg: "var(--accent-soft)", color: "var(--accent-text)" },
    YAML: { bg: "var(--success-soft)", color: "var(--success-text)" },
    ZIP: { bg: "var(--warning-soft)", color: "var(--warning-text)" },
    PDF: { bg: "var(--danger-soft)", color: "var(--danger-text)" },
  };
  const c = colors[ext] || { bg: "var(--ink-100)", color: "var(--ink-700)" };
  return (
    <div className="ds-file-card">
      <div className="ds-file-icon" style={{background: c.bg, color: c.color}}>{ext}</div>
      <div style={{flex:1, minWidth: 0}}>
        <div className="ds-file-name" style={{overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>{name}</div>
        <div className="ds-file-meta">
          <span>{size}</span>
          {meta && <><span className="sep">·</span><span>{meta}</span></>}
          <span className="sep">·</span>
          {status === "uploading" && <Chip tone="info" pulse>Uploading {progress}%</Chip>}
          {status === "uploaded" && <Chip tone="success" leadingIcon="check">Validated</Chip>}
          {status === "error" && <Chip tone="danger" leadingIcon="alert">Parse failed</Chip>}
          {status === "warning" && <Chip tone="warning" leadingIcon="alert_tri">3 warnings</Chip>}
        </div>
      </div>
      {status === "uploading" && (
        <div className="ds-file-prog"><div className="ds-file-prog-fill" style={{width: `${progress}%`}} /></div>
      )}
      <div className="ds-file-actions">
        {status === "uploading" ? (
          <Btn variant="ghost" size="sm" iconOnly leadingIcon="x" />
        ) : (
          <>
            <Btn variant="ghost" size="sm" iconOnly leadingIcon="eye" />
            <Btn variant="ghost" size="sm" iconOnly leadingIcon="trash" danger />
          </>
        )}
      </div>
    </div>
  );
};

/* ───────────── Modal ───────────── */
const modalCSS = `
.ds-modal-backdrop { position: absolute; inset: 0; background: oklch(0.18 0.02 240 / 0.4); backdrop-filter: blur(2px); display: grid; place-items: center; z-index: 50; animation: dsFadeIn 180ms; }
@keyframes dsFadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes dsSlideUp { from { transform: translateY(8px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.ds-modal { background: var(--paper); border-radius: var(--r-xl); width: min(520px, calc(100% - 32px)); box-shadow: var(--shadow-lg); overflow: hidden; display: flex; flex-direction: column; max-height: calc(100% - 32px); animation: dsSlideUp 200ms ease-out; }
.ds-modal-lg { width: min(720px, calc(100% - 32px)); }
.ds-modal-head { padding: 18px 20px; display: flex; align-items: flex-start; gap: 12px; border-bottom: var(--hairline); }
.ds-modal-icon { width: 36px; height: 36px; border-radius: var(--r-md); background: var(--danger-soft); color: var(--danger-text); display: grid; place-items: center; flex-shrink: 0; }
.ds-modal-title { font-size: 16px; font-weight: 600; letter-spacing: -0.01em; }
.ds-modal-sub { font-size: 13px; color: var(--ink-500); margin-top: 2px; }
.ds-modal-close { width: 30px; height: 30px; border-radius: var(--r-sm); border: none; background: transparent; color: var(--ink-500); cursor: pointer; display: grid; place-items: center; margin-left: auto; }
.ds-modal-close:hover { background: var(--ink-100); color: var(--ink-800); }
.ds-modal-body { padding: 20px; overflow-y: auto; }
.ds-modal-foot { padding: 14px 20px; border-top: var(--hairline); display: flex; align-items: center; justify-content: flex-end; gap: 8px; background: var(--ink-50); }
.ds-modal-foot-left { margin-right: auto; font-size: 12.5px; color: var(--ink-500); display: flex; align-items: center; gap: 6px; }
`;

const Modal = ({ open, onClose, icon, iconTone = "danger", title, subtitle, children, footer, size }) => {
  if (!open) return null;
  return (
    <div className="ds-modal-backdrop" onClick={onClose}>
      <div className={"ds-modal" + (size === "lg" ? " ds-modal-lg" : "")} onClick={(e) => e.stopPropagation()}>
        <div className="ds-modal-head">
          {icon && (
            <div className="ds-modal-icon" style={{
              background: `var(--${iconTone}-soft)`,
              color: `var(--${iconTone}-text)`,
            }}>
              <Icon name={icon} size={18} />
            </div>
          )}
          <div style={{flex:1, minWidth: 0}}>
            <div className="ds-modal-title">{title}</div>
            {subtitle && <div className="ds-modal-sub">{subtitle}</div>}
          </div>
          <button className="ds-modal-close" onClick={onClose}><Icon name="x" /></button>
        </div>
        <div className="ds-modal-body">{children}</div>
        {footer && <div className="ds-modal-foot">{footer}</div>}
      </div>
    </div>
  );
};

/* ───────────── Empty State ───────────── */
const emptyCSS = `
.ds-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 48px 24px; gap: 16px; background: var(--paper); border: var(--hairline); border-radius: var(--r-lg); }
.ds-empty-art { width: 96px; height: 96px; display: grid; place-items: center; }
.ds-empty-title { font-size: 17px; font-weight: 600; letter-spacing: -0.015em; color: var(--ink-900); }
.ds-empty-desc { font-size: 13.5px; color: var(--ink-500); max-width: 360px; line-height: 1.55; }
.ds-empty-actions { display: flex; gap: 8px; }
`;

const EmptyArt = ({ kind = "search" }) => {
  if (kind === "search") return (
    <svg viewBox="0 0 96 96" width="96" height="96" fill="none">
      <rect x="14" y="22" width="68" height="56" rx="6" fill="var(--ink-50)" stroke="var(--ink-200)" strokeWidth="1.5"/>
      <rect x="22" y="32" width="32" height="3" rx="1.5" fill="var(--ink-200)"/>
      <rect x="22" y="40" width="48" height="3" rx="1.5" fill="var(--ink-100)"/>
      <rect x="22" y="48" width="40" height="3" rx="1.5" fill="var(--ink-100)"/>
      <circle cx="62" cy="62" r="14" fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth="1.75"/>
      <path d="m72 72 6 6" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
  if (kind === "inbox") return (
    <svg viewBox="0 0 96 96" width="96" height="96" fill="none">
      <path d="M16 50h18l4 6h20l4-6h18v22a6 6 0 0 1-6 6H22a6 6 0 0 1-6-6z" fill="var(--ink-50)" stroke="var(--ink-300)" strokeWidth="1.5"/>
      <path d="m22 50 4-26h44l4 26" fill="var(--paper)" stroke="var(--ink-300)" strokeWidth="1.5"/>
      <circle cx="74" cy="26" r="10" fill="var(--accent)"/>
      <path d="M70 26h8M74 22v8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
  if (kind === "track") return (
    <svg viewBox="0 0 96 96" width="96" height="96" fill="none">
      <path d="M24 14v68M72 14v68" stroke="var(--ink-300)" strokeWidth="3" strokeLinecap="round"/>
      <path d="M14 24h68M14 40h68M14 56h68M14 72h68" stroke="var(--ink-200)" strokeWidth="2" strokeLinecap="round"/>
      <rect x="36" y="34" width="24" height="28" rx="4" fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth="1.75"/>
      <circle cx="42" cy="58" r="2" fill="var(--accent)"/>
      <circle cx="54" cy="58" r="2" fill="var(--accent)"/>
    </svg>
  );
  return null;
};

const EmptyState = ({ kind, title, description, primary, secondary }) => (
  <div className="ds-empty">
    <div className="ds-empty-art"><EmptyArt kind={kind} /></div>
    <div>
      <div className="ds-empty-title">{title}</div>
      <div className="ds-empty-desc" style={{marginTop: 6}}>{description}</div>
    </div>
    <div className="ds-empty-actions">
      {secondary && <Btn variant="secondary">{secondary}</Btn>}
      {primary && <Btn variant="primary" leadingIcon="plus">{primary}</Btn>}
    </div>
  </div>
);

/* ───────────── Validation panel ───────────── */
const validationCSS = `
.ds-valid { background: var(--paper); border: var(--hairline); border-radius: var(--r-lg); overflow: hidden; }
.ds-valid-head { display: flex; align-items: center; gap: 12px; padding: 14px 16px; border-bottom: var(--hairline); }
.ds-valid-head-icon { width: 32px; height: 32px; border-radius: var(--r-sm); display: grid; place-items: center; flex-shrink: 0; }
.ds-valid-head-title { font-size: 14.5px; font-weight: 600; }
.ds-valid-head-sub { font-size: 12px; color: var(--ink-500); margin-top: 1px; }
.ds-valid-summary { display: flex; gap: 16px; padding: 10px 16px; border-bottom: var(--hairline); background: var(--ink-50); }
.ds-valid-stat { display: flex; align-items: center; gap: 6px; font-size: 12.5px; font-weight: 500; color: var(--ink-700); }
.ds-valid-stat .num { font-family: var(--font-mono); font-weight: 700; font-variant-numeric: tabular-nums; }
.ds-valid-list { display: flex; flex-direction: column; }
.ds-valid-item { display: grid; grid-template-columns: 28px 1fr auto; gap: 12px; padding: 12px 16px; border-bottom: var(--hairline); cursor: pointer; transition: 100ms; align-items: start; }
.ds-valid-item:last-child { border-bottom: none; }
.ds-valid-item:hover { background: var(--ink-50); }
.ds-valid-sev { width: 22px; height: 22px; border-radius: var(--r-sm); display: grid; place-items: center; }
.ds-valid-sev[data-sev="error"] { background: var(--danger-soft); color: var(--danger-text); }
.ds-valid-sev[data-sev="warning"] { background: var(--warning-soft); color: var(--warning-text); }
.ds-valid-sev[data-sev="info"] { background: var(--info-soft); color: var(--info-text); }
.ds-valid-sev[data-sev="pass"] { background: var(--success-soft); color: var(--success-text); }
.ds-valid-body { min-width: 0; }
.ds-valid-title { font-size: 13.5px; font-weight: 600; color: var(--ink-900); }
.ds-valid-desc { font-size: 12.5px; color: var(--ink-600); margin-top: 3px; line-height: 1.5; }
.ds-valid-meta { font-size: 11.5px; font-family: var(--font-mono); color: var(--ink-500); margin-top: 6px; display: flex; gap: 8px; align-items: center; }
.ds-valid-meta .sep { color: var(--ink-300); }
.ds-valid-meta .link { color: var(--accent-text); cursor: pointer; }
.ds-valid-meta .link:hover { text-decoration: underline; }
.ds-valid-code { background: var(--ink-50); border: var(--hairline); border-radius: var(--r-sm); padding: 8px 10px; margin-top: 8px; font-family: var(--font-mono); font-size: 12px; color: var(--ink-800); white-space: pre-wrap; overflow-x: auto; }
.ds-valid-code .hl { background: var(--danger-soft); color: var(--danger-text); padding: 0 2px; border-radius: 2px; }
.ds-valid-actions { display: flex; gap: 4px; }
`;

const ValidationPanel = () => {
  const items = [
    { sev: "error", title: "Brake force assertion missing for class 745", desc: "Schema requires brakeForce.min for all rolling stock classes. Coupling assemblies will fail conformance at compile time.", file: "EU-RST-220.esp", line: 142, rule: "RST.brake.001" },
    { sev: "error", title: "Unresolved reference: pantograph.geometry.profile", desc: "Profile token \"DB-1450-AC\" is not registered in the active EN 50367 catalog.", file: "pantograph.yaml", line: 23, rule: "PNT.ref.014" },
    { sev: "warning", title: "Deprecated field: maxTractionEffort", desc: "Use tractionEnvelope.max instead. Field will be removed in schema v5.0.", file: "EU-RST-220.esp", line: 84, rule: "DEP.field.07" },
    { sev: "warning", title: "Coverage below threshold for door cycle SIP-08", desc: "Only 81% of operating conditions are exercised. Recommended threshold is 95%.", file: "sip-08.yaml", line: 1, rule: "COV.min.95" },
    { sev: "info", title: "Schema includes 14 derived assertions from baseline", desc: "Derived assertions inherit from EU-RST-200. Edits propagate to dependent procedures.", file: "EU-RST-220.esp", line: 1, rule: "INFO.derive" },
    { sev: "pass", title: "All gauge measurements satisfy EN 14363 envelope", desc: "12 of 12 wheelset profile checks within tolerance ±0.4 mm.", rule: "WHL.gauge.001" },
  ];
  const counts = items.reduce((a, b) => ((a[b.sev] = (a[b.sev] || 0) + 1), a), {});
  const sevIcon = { error: "alert", warning: "alert_tri", info: "info", pass: "check" };
  return (
    <div className="ds-valid">
      <div className="ds-valid-head">
        <div className="ds-valid-head-icon" style={{background:"var(--warning-soft)", color:"var(--warning-text)"}}>
          <Icon name="alert_tri" size={16} />
        </div>
        <div style={{flex:1}}>
          <div className="ds-valid-head-title">Validation report · EU-RST-220</div>
          <div className="ds-valid-head-sub">Run #4827 · Completed 12s ago · Total time 4.21s</div>
        </div>
        <Btn variant="secondary" size="sm" leadingIcon="refresh">Re-run</Btn>
        <Btn variant="secondary" size="sm" leadingIcon="download">Export</Btn>
      </div>
      <div className="ds-valid-summary">
        <div className="ds-valid-stat"><Icon name="alert" size={13} style={{color:"var(--danger)"}}/><span>Errors</span><span className="num">{counts.error || 0}</span></div>
        <div className="ds-valid-stat"><Icon name="alert_tri" size={13} style={{color:"var(--warning)"}}/><span>Warnings</span><span className="num">{counts.warning || 0}</span></div>
        <div className="ds-valid-stat"><Icon name="info" size={13} style={{color:"var(--info)"}}/><span>Info</span><span className="num">{counts.info || 0}</span></div>
        <div className="ds-valid-stat"><Icon name="check_circle" size={13} style={{color:"var(--success)"}}/><span>Passed</span><span className="num tabular">214</span></div>
        <div style={{flex:1}} />
        <div className="ds-valid-stat" style={{color:"var(--ink-500)"}}><span>Coverage</span><span className="num">87.4%</span></div>
      </div>
      <div className="ds-valid-list">
        {items.map((it, i) => (
          <div key={i} className="ds-valid-item">
            <div className="ds-valid-sev" data-sev={it.sev}><Icon name={sevIcon[it.sev]} size={13} /></div>
            <div className="ds-valid-body">
              <div className="ds-valid-title">{it.title}</div>
              <div className="ds-valid-desc">{it.desc}</div>
              {i === 0 && (
                <div className="ds-valid-code">
{`<class id="745"><brakes>
  <type>EP</type>
  `}<span className="hl">{`<!-- expected: <force min="…" /> -->`}</span>{`
</brakes></class>`}
                </div>
              )}
              <div className="ds-valid-meta">
                {it.file && <><span className="link">{it.file}:{it.line}</span><span className="sep">·</span></>}
                <span>Rule {it.rule}</span>
                {it.sev !== "pass" && <><span className="sep">·</span><span className="link">View docs</span></>}
              </div>
            </div>
            <div className="ds-valid-actions">
              <Btn variant="ghost" size="sm" leadingIcon="eye">Reveal</Btn>
              {it.sev !== "pass" && <Btn variant="ghost" size="sm">Suppress</Btn>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

window.Field = Field;
window.TextInput = TextInput;
window.Select = Select;
window.Textarea = Textarea;
window.Toggle = Toggle;
window.Radio = Radio;
window.RadioCard = RadioCard;
window.UploadCard = UploadCard;
window.FileCard = FileCard;
window.Modal = Modal;
window.EmptyState = EmptyState;
window.ValidationPanel = ValidationPanel;
window.FORM_CSS = buttonCSS + fieldCSS + uploadCSS + modalCSS + emptyCSS + validationCSS;
