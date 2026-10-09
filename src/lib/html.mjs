// A tiny tagged-template HTML builder. Interpolated values are escaped
// unless they come from html`` or raw(); arrays are joined; null, undefined
// and false render as nothing.

class SafeHtml {
  constructor(value) {
    this.value = value;
  }
  toString() {
    return this.value;
  }
}

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export function escape(value) {
  return String(value).replace(/[&<>"']/g, (c) => ESCAPES[c]);
}

/** Marks trusted markup (authored in this repo) so it is not escaped. */
export function raw(value) {
  return new SafeHtml(String(value));
}

function render(value) {
  if (value === null || value === undefined || value === false) return '';
  if (value instanceof SafeHtml) return value.value;
  if (Array.isArray(value)) return value.map(render).join('');
  return escape(value);
}

export function html(strings, ...values) {
  let out = strings[0];
  for (let i = 0; i < values.length; i++) out += render(values[i]) + strings[i + 1];
  return new SafeHtml(out);
}

/** Joins class names, skipping falsy entries. */
export function cx(...names) {
  return names.filter(Boolean).join(' ');
}
