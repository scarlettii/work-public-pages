"use strict";
const pack = window.prototypeAssets,
  data = pack.current,
  ns = "http://www.w3.org/2000/svg";
const labels = [
  "首页",
  "所有技能",
  "技能详情",
  "确认领取",
  "重复领取",
  "放弃领取",
  "领取成功",
  "应用技能",
  "详情未选套餐",
];
const originalLabels = [
  "首页",
  "所有技能",
  "技能详情",
  "确认订单",
  "重复购买提示",
  "放弃购买",
  "购买成功",
  "应用技能",
  "详情未选套餐",
];
const screenNumbers = ["01", "02", "03", "04", "05", "06", "07", "08", "03-1"];
function picture(a) {
  const p = document.createElement("div");
  p.className = "picture";
  const img = document.createElement("img");
  img.src = a.src;
  img.alt = a.name + "截图";
  img.width = a.w;
  img.height = a.h;
  const svg = document.createElementNS(ns, "svg");
  svg.classList.add("marks");
  svg.setAttribute("viewBox", "0 0 " + a.w + " " + a.h);
  svg.setAttribute("aria-hidden", "true");
  for (const m of [...a.marks, ...(a.flowMark ? [a.flowMark] : [])]) {
    const r = document.createElementNS(ns, "rect");
    for (const [key, val] of Object.entries({
      x: (m.x * a.w) / 100,
      y: (m.y * a.h) / 100,
      width: (m.w * a.w) / 100,
      height: (m.h * a.h) / 100,
      rx: 2,
    }))
      r.setAttribute(key, val);
    if (m.kind === "removed") r.classList.add("removed");
    if (m.kind === "flow") r.classList.add("flow");
    const t = document.createElementNS(ns, "title");
    t.textContent = m.label;
    r.append(t);
    svg.append(r);
  }
  p.append(img, svg);
  return p;
}
function card(group, index) {
  const a = pack[group][index],
    f = document.createElement("figure"),
    title = (group === "original" ? originalLabels : labels)[index];
  f.className = "card";
  f.dataset.key = group + ":" + index;
  f.dataset.name = a.name;
  f.setAttribute("role", "button");
  f.tabIndex = 0;
  f.setAttribute(
    "aria-label",
    "放大查看" + (group === "original" ? "原页面" : "修改后页面") + title,
  );
  f.title = "点击放大查看";
  const caption = document.createElement("figcaption"),
    num = document.createElement("span");
  num.textContent = screenNumbers[index];
  caption.append(num, document.createTextNode(title));
  f.append(caption, picture(a));
  f.addEventListener("click", () => openPreview(group, index, f));
  f.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openPreview(group, index, f);
    }
  });
  return f;
}
function row(id, indices) {
  const e = document.getElementById(id);
  indices.forEach((n, i) => {
    if (i) {
      const arrow = document.createElement("span");
      arrow.className = "arrow";
      arrow.textContent = "→";
      arrow.setAttribute("aria-hidden", "true");
      e.append(arrow);
    }
    e.append(card("current", n));
  });
}
const displayOrder = [0, 1, 2, 8, 3, 4, 5, 6, 7];
displayOrder.forEach((i) =>
  document.getElementById("originalGrid").append(card("original", i)),
);
row("browse", [0, 1, 2, 8, 3]);
[
  [4, "数量＋", "提示后返回确认页"],
  [5, "取消", "再想想／放弃领取"],
].forEach(([n, trigger, desc]) => {
  const e = document.createElement("div");
  e.className = "branch";
  const p = document.createElement("p"),
    b = document.createElement("b");
  b.textContent = trigger + " →";
  p.append(b, document.createElement("br"), document.createTextNode(desc));
  e.append(p, card("current", n));
  document.getElementById("branches").append(e);
});
row("success", [6, 7]);

const note = document.createElement("aside");
note.className = "flow-note";
note.setAttribute("aria-label", "取消订单页跳转说明");
note.innerHTML =
  '<figure class="flow-thumb"><figcaption>原跳转页面 · 仅作参考</figcaption><button type="button" id="orderPreview" aria-label="放大查看原订单页"><img alt="原订单页面"></button></figure><div class="flow-copy" id="flowCopy"><strong>取消「2」的跳转</strong><del>点击数量 → 订单页</del><p>数量仅展示，点击不再跳转。</p></div>';
note.querySelector("img").src = pack.reference.src;
note.querySelector("button").onclick = (e) =>
  openPreview("reference", 0, e.currentTarget);
document.getElementById("browse").append(note);
function drawConnector() {
  const shell = document.getElementById("browseShell"),
    svg = document.getElementById("flowConnector"),
    target = document.querySelector('[data-key="current:3"] .picture'),
    label = document.getElementById("flowCopy");
  if (!target) {
    svg.replaceChildren();
    return;
  }
  const b = shell.getBoundingClientRect(),
    t = target.getBoundingClientRect(),
    l = label.getBoundingClientRect();
  const mark = pack.current[3].flowMark;
  const x = t.left + (t.width * (mark.x + mark.w / 2)) / 100 - b.left,
    y = t.top + (t.height * (mark.y + mark.h)) / 100 - b.top,
    ex = l.left - b.left - 6,
    ey = l.top + 10 - b.top,
    mid = (x + ex) / 2;
  svg.setAttribute(
    "viewBox",
    "0 0 " + shell.clientWidth + " " + shell.clientHeight,
  );
  svg.innerHTML =
    '<path d="M ' +
    x +
    " " +
    y +
    " V " +
    (y + 7) +
    " H " +
    (ex - 8) +
    " V " +
    ey +
    " H " +
    ex +
    '"/><circle cx="' +
    x +
    '" cy="' +
    y +
    '" r="2"/><line x1="' +
    (mid - 4) +
    '" y1="' +
    (y + 3) +
    '" x2="' +
    (mid + 4) +
    '" y2="' +
    (y + 11) +
    '"/><line x1="' +
    (mid - 4) +
    '" y1="' +
    (y + 11) +
    '" x2="' +
    (mid + 4) +
    '" y2="' +
    (y + 3) +
    '"/>';
}
document.getElementById("showMarks").addEventListener("change", (e) => {
  document.body.classList.toggle("annotated", e.target.checked);
  drawConnector();
});
document.getElementById("browse").addEventListener("scroll", drawConnector);
new ResizeObserver(drawConnector).observe(
  document.getElementById("browseShell"),
);
document.fonts.ready.then(drawConnector);
const viewer = document.getElementById("imageViewer"),
  viewerPane = document.getElementById("viewerPane"),
  viewerStage = document.getElementById("viewerStage");
let viewerGroup = "current",
  viewerIndex = 0,
  viewerOpener = null,
  viewerPicture = null,
  statusTimer = null;
function viewerPosition() {
  return viewerGroup === "reference" ? 0 : displayOrder.indexOf(viewerIndex);
}
function viewerItems() {
  return viewerGroup === "reference" ? [pack.reference] : pack[viewerGroup];
}
function fitViewer() {
  if (!viewer.open || !viewerPicture) return;
  const a = viewerItems()[viewerIndex],
    s = getComputedStyle(viewerStage);
  const w =
      viewerStage.clientWidth -
      parseFloat(s.paddingLeft) -
      parseFloat(s.paddingRight),
    h =
      viewerStage.clientHeight -
      parseFloat(s.paddingTop) -
      parseFloat(s.paddingBottom);
  viewerPicture.style.width = Math.min(w, (h * a.w) / a.h) + "px";
}
function showViewerImage() {
  const items = viewerItems(),
    a = items[viewerIndex];
  viewerStage.replaceChildren();
  viewerPicture = picture(a);
  viewerPicture.classList.add("viewer-picture");
  viewerPicture.querySelector("img").draggable = false;
  viewerStage.append(viewerPicture);
  document.getElementById("viewerTitle").textContent =
    (viewerGroup === "original"
      ? "原页面 · "
      : viewerGroup === "current"
        ? "修改后 · "
        : "") +
    (viewerGroup === "original"
      ? originalLabels[viewerIndex]
      : viewerGroup === "current"
        ? labels[viewerIndex]
        : a.name);
  document.getElementById("viewerCount").textContent =
    viewerPosition() + 1 + " / " + items.length;
  document.getElementById("prevImage").disabled = viewerPosition() === 0;
  document.getElementById("nextImage").disabled =
    viewerPosition() === items.length - 1;
  fitViewer();
}
function openPreview(group, index, opener) {
  viewerGroup = group;
  viewerIndex = index;
  viewerOpener = opener;
  if (!viewer.open) {
    viewer.showModal();
    document.body.style.overflow = "hidden";
  }
  showViewerImage();
}
function stepViewer(delta) {
  const next = viewerPosition() + delta;
  if (next < 0 || next >= viewerItems().length) return;
  viewerIndex = viewerGroup === "reference" ? 0 : displayOrder[next];
  showViewerImage();
}
document.getElementById("prevImage").onclick = () => stepViewer(-1);
document.getElementById("nextImage").onclick = () => stepViewer(1);
document.getElementById("closeViewer").onclick = () => viewer.close();
viewerStage.onclick = (e) => {
  if (e.target === viewerStage) viewer.close();
};
viewer.addEventListener("close", () => {
  document.body.style.overflow = "";
  if (viewerOpener) viewerOpener.focus({ preventScroll: true });
});
viewer.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    e.preventDefault();
    stepViewer(-1);
  }
  if (e.key === "ArrowRight") {
    e.preventDefault();
    stepViewer(1);
  }
});
window.addEventListener("resize", () => {
  fitViewer();
  drawConnector();
});
const exportData = [
  ...pack.original.map((a, i) => ({
    ...a,
    name: "原页面/" + screenNumbers[i] + "_" + originalLabels[i],
  })),
  ...pack.current.map((a, i) => ({
    ...a,
    name: "修改后页面/" + screenNumbers[i] + "_" + labels[i],
  })),
  { ...pack.reference, name: "参考页面/原订单页" },
];
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  crcTable[n] = c >>> 0;
}
function crc32(bytes) {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++)
    c = crcTable[(c ^ bytes[i]) & 255] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
async function makeOriginalZip() {
  const encoder = new TextEncoder(),
    localParts = [],
    directory = [];
  let offset = 0,
    centralSize = 0;
  const now = new Date(),
    date =
      ((now.getFullYear() - 1980) << 9) |
      ((now.getMonth() + 1) << 5) |
      now.getDate(),
    time =
      (now.getHours() << 11) |
      (now.getMinutes() << 5) |
      (now.getSeconds() >> 1);
  for (const a of exportData) {
    const response = await fetch(a.src);
    if (!response.ok)
      throw new Error(`无法读取图片：${a.src} (${response.status})`);
    const bytes = new Uint8Array(await response.arrayBuffer());
    const filename = encoder.encode(a.name + ".png"),
      crc = crc32(bytes);
    const local = new Uint8Array(30 + filename.length),
      lv = new DataView(local.buffer);
    lv.setUint32(0, 0x04034b50, true);
    lv.setUint16(4, 20, true);
    lv.setUint16(6, 0x0800, true);
    lv.setUint16(8, 0, true);
    lv.setUint16(10, time, true);
    lv.setUint16(12, date, true);
    lv.setUint32(14, crc, true);
    lv.setUint32(18, bytes.length, true);
    lv.setUint32(22, bytes.length, true);
    lv.setUint16(26, filename.length, true);
    local.set(filename, 30);
    const central = new Uint8Array(46 + filename.length),
      cv = new DataView(central.buffer);
    cv.setUint32(0, 0x02014b50, true);
    cv.setUint16(4, 20, true);
    cv.setUint16(6, 20, true);
    cv.setUint16(8, 0x0800, true);
    cv.setUint16(10, 0, true);
    cv.setUint16(12, time, true);
    cv.setUint16(14, date, true);
    cv.setUint32(16, crc, true);
    cv.setUint32(20, bytes.length, true);
    cv.setUint32(24, bytes.length, true);
    cv.setUint16(28, filename.length, true);
    cv.setUint32(42, offset, true);
    central.set(filename, 46);
    localParts.push(local, bytes);
    directory.push(central);
    offset += local.length + bytes.length;
    centralSize += central.length;
  }
  const end = new Uint8Array(22),
    ev = new DataView(end.buffer);
  ev.setUint32(0, 0x06054b50, true);
  ev.setUint16(8, exportData.length, true);
  ev.setUint16(10, exportData.length, true);
  ev.setUint32(12, centralSize, true);
  ev.setUint32(16, offset, true);
  return new Blob([...localParts, ...directory, end], {
    type: "application/zip",
  });
}
document
  .getElementById("exportOriginals")
  .addEventListener("click", async () => {
    const button = document.getElementById("exportOriginals"),
      status = document.getElementById("exportStatus");
    button.disabled = true;
    button.textContent = "正在导出…";
    clearTimeout(statusTimer);
    try {
      await new Promise((resolve) =>
        requestAnimationFrame(() => setTimeout(resolve, 0)),
      );
      const url = URL.createObjectURL(await makeOriginalZip()),
        link = document.createElement("a");
      link.href = url;
      link.download = "AI技能_原页面与修改后图片.zip";
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60000);
      status.textContent = "已开始导出 19 张无标注图片";
      statusTimer = setTimeout(() => {
        status.textContent = "";
      }, 3500);
    } catch (error) {
      status.textContent = "导出失败，请重新点击导出原图。";
      console.error(error);
    } finally {
      button.disabled = false;
      button.textContent = "导出原图";
    }
  });
