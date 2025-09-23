/*! For license information please see background.js.LICENSE.txt */
(() => {
  var e = {
      2689: (e, t, n) => {
        "use strict";
        n.d(t, { L: () => i });
        const r = {
          all: (o = o || new Map()),
          on: function (e, t) {
            var n = o.get(e);
            n ? n.push(t) : o.set(e, [t]);
          },
          off: function (e, t) {
            var n = o.get(e);
            n && (t ? n.splice(n.indexOf(t) >>> 0, 1) : o.set(e, []));
          },
          emit: function (e, t) {
            var n = o.get(e);
            n &&
              n.slice().map(function (e) {
                e(t);
              }),
              (n = o.get("*")) &&
                n.slice().map(function (n) {
                  n(e, t);
                });
          },
        };
        var o;
        function i(e) {
          for (
            var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), o = 1;
            o < t;
            o++
          )
            n[o - 1] = arguments[o];
          const i = r.all.get(e);
          return i ? Array.from(i).map((e) => e(...n)) : [];
        }
      },
      5821: (e, t, n) => {
        "use strict";
        n.d(t, { A: () => r });
        const r = async function () {
          const e = fetch;
          let t = {
              dom: "<{tag}{label}|{attr}{content}{subtree} >",
              label: "[{label}]",
              attr: "{attr}",
              attrSplitter: "; ",
              subtreeSplitter: " ",
            },
            n = {
              refine: t,
              xml: {
                dom: "<{tag}{label}{attr}>{content}{subtree} </{tag}>",
                label: ' id="{label}"',
                attr: '{key}="{attr}"',
                attrSplitter: " ",
                subtreeSplitter: " ",
              },
              new_data: t,
            };
          class r {
            constructor() {
              let e =
                arguments.length > 0 && void 0 !== arguments[0]
                  ? arguments[0]
                  : "";
              if (((e = this.extract(e, "xml")), !n.hasOwnProperty(e)))
                throw new Error("Unknown prompt: " + e);
              const t = {
                refine: this.normalPromptConstructor,
                xml: this.normalPromptConstructor,
                new_data: this.newDataPromptConstructor,
              };
              (this.name = e), (this.prompt = n[e]), (this.constructor = t[e]);
            }
            extract(e) {
              return (
                e ||
                (arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : "")
              );
            }
            subtreeConstructor() {
              return (
                arguments.length > 0 && void 0 !== arguments[0]
                  ? arguments[0]
                  : []
              ).join(this.prompt.subtreeSplitter);
            }
            normalPromptConstructor() {
              let e =
                  arguments.length > 0 && void 0 !== arguments[0]
                    ? arguments[0]
                    : "",
                t =
                  arguments.length > 1 && void 0 !== arguments[1]
                    ? arguments[1]
                    : "",
                n =
                  arguments.length > 2 && void 0 !== arguments[2]
                    ? arguments[2]
                    : "",
                r =
                  arguments.length > 3 && void 0 !== arguments[3]
                    ? arguments[3]
                    : "",
                o =
                  arguments.length > 4 && void 0 !== arguments[4]
                    ? arguments[4]
                    : {},
                i =
                  arguments.length > 5 && void 0 !== arguments[5]
                    ? arguments[5]
                    : "";
              const a = (e, t) => (e.length > 0 ? t + e : "");
              (e = this.extract(e)),
                (t = this.extract(t)),
                (n = this.extract(n)),
                (r = this.extract(r, "")),
                (o = this.extract(o, {})),
                (i = this.extract(i));
              let s = "",
                l = "";
              t.length > 0 && (s = ' id="'.concat(t, '"')),
                i.length > 0 && (l = ' id="'.concat(i, '"'));
              const c = [],
                u = new Set();
              for (const [f, g] of Object.entries(o))
                u.has(g) ||
                  (u.add(g), c.push("".concat(f, '="').concat(g, '"')));
              let d = c.join(this.prompt.attrSplitter);
              const h = 0 === d.length ? " " : this.prompt.attrSplitter;
              d = a(d, " ");
              const p = a(n, h);
              return (
                (r = a(r, " ")),
                "<"
                  .concat(e)
                  .concat(d)
                  .concat(l, ">")
                  .concat(p)
                  .concat(r, "</")
                  .concat(e, ">")
              );
            }
            newDataPromptConstructor() {
              let e =
                  arguments.length > 0 && void 0 !== arguments[0]
                    ? arguments[0]
                    : "",
                t =
                  arguments.length > 1 && void 0 !== arguments[1]
                    ? arguments[1]
                    : "",
                n =
                  arguments.length > 2 && void 0 !== arguments[2]
                    ? arguments[2]
                    : "",
                r =
                  arguments.length > 3 && void 0 !== arguments[3]
                    ? arguments[3]
                    : "",
                o =
                  arguments.length > 4 && void 0 !== arguments[4]
                    ? arguments[4]
                    : {};
              const i = (e, t) => (e.length > 0 ? t + e : "");
              (e = this.extract(e)),
                (t = this.extract(t)),
                (n = this.extract(n)),
                (r = this.extract(r, "")),
                (o = this.extract(o, {}));
              let a = "";
              t.length > 0 && (a = ' id="'.concat(t, '"'));
              const s = [],
                l = new Set(),
                c = [];
              for (const [p, f] of Object.entries(o))
                "" !== f
                  ? l.has(f) ||
                    (l.add(f), s.push("".concat(p, '="').concat(f, '"')))
                  : c.push(p);
              if (c.length > 0) {
                const e = c.join(" ");
                s.push('message="'.concat(e, '"'));
              }
              let u = s.join(this.prompt.attrSplitter);
              const d = 0 === u.length ? " " : this.prompt.attrSplitter;
              u = i(u, " ");
              const h = i(n, d);
              return (
                (r = i(r, " ")),
                "<"
                  .concat(e)
                  .concat(a)
                  .concat(u, ">")
                  .concat(h)
                  .concat(r, "</")
                  .concat(e, ">")
              );
            }
            promptConstructor() {
              let e =
                  arguments.length > 0 && void 0 !== arguments[0]
                    ? arguments[0]
                    : "",
                t =
                  arguments.length > 1 && void 0 !== arguments[1]
                    ? arguments[1]
                    : "",
                n =
                  arguments.length > 2 && void 0 !== arguments[2]
                    ? arguments[2]
                    : "",
                r =
                  arguments.length > 3 && void 0 !== arguments[3]
                    ? arguments[3]
                    : "",
                o =
                  arguments.length > 4 && void 0 !== arguments[4]
                    ? arguments[4]
                    : {},
                i =
                  arguments.length > 5 && void 0 !== arguments[5]
                    ? arguments[5]
                    : "";
              return this.constructor(e, t, n, r, o, i);
            }
          }
          var o = [
            "title",
            "value",
            "type",
            "placeholder",
            "selected",
            "data-value",
            "data-text",
            "data-testid",
            "data-label",
            "data-bbox",
            "data-status",
          ];
          function i(e) {
            return (
              null !== e &&
              "string" === typeof e &&
              4 === (e = e.trim()).split(",").length &&
              (e = e.split(",").map(parseFloat))
            );
          }
          const a = (e, t) => {
              function n(e) {
                return e ? e.trim().substring(0, 1e3) : "";
              }
              function a(e, t) {
                t.tagName.toLowerCase();
                return !(
                  ("role" === e &&
                    ["presentation", "none", "link"].includes(
                      t.getAttribute(e)
                    )) ||
                  ("type" === e && "hidden" === t.getAttribute(e)) ||
                  ("aria-hidden" === e && "true" === t.getAttribute(e))
                );
              }
              let s = (function e(s, l) {
                let c = s.getAttribute("data-backend-node-id") || "",
                  u = s.tagName.toLowerCase(),
                  d = s.getAttribute("data-label-id") || "",
                  h =
                    (function (e) {
                      let n = e.getAttribute("data-bbox") || null;
                      if (e.classList.contains("start-chat-btn")) return !0;
                      if (!i(n)) return !1;
                      if (!t) return !1;
                      let [r, o, a, s] = t,
                        [l, c, u, d] = i(n);
                      return (
                        null !== l &&
                        null !== c &&
                        null !== u &&
                        null !== d &&
                        !(l + u < 0 || l > a || c + d < 0 || c > s)
                      );
                    })(s) || l;
                d && (h = !0);
                let p = (function (e) {
                    let t = "";
                    return (
                      Array.from(e.childNodes).forEach((e) => {
                        e.nodeType === Node.TEXT_NODE &&
                          (t += e.textContent.trim() + " ");
                      }),
                      "INPUT" === e.nodeName &&
                        e.nextSibling &&
                        e.nextSibling.nodeType === Node.TEXT_NODE &&
                        (t += e.nextSibling.textContent.trim() + " "),
                      n(t.trim())
                    );
                  })(s),
                  f = {},
                  g = o;
                for (let t = 0; t < g.length; t++) {
                  if (
                    !Array.from(s.attributes)
                      .map((e) => e.name)
                      .includes(g[t]) ||
                    !a(g[t], s)
                  )
                    continue;
                  if (["data-backend-node-id", "data-label-id"].includes(g[t]))
                    continue;
                  let e = n(s.getAttribute(g[t]));
                  (e.length > 0 || 0 === g.length) && (f[g[t]] = e);
                }
                p.length > 0 || f.length, (l = h && "select" === u);
                let m = [],
                  v = s.children;
                for (const t of v)
                  if (t.nodeType === Node.ELEMENT_NODE) {
                    let n = e(t, l);
                    n && n.length > 0 && m.push(n);
                  }
                const y = new r();
                let b = y.subtreeConstructor(m);
                return h && (b = y.promptConstructor(u, d, p, b, f, c)), b;
              })(e, !1);
              return s;
            },
            s = (e, t) => {
              Date.now();
              const n = ((e) => {
                let t = e;
                for (;;) {
                  var n;
                  let e =
                    null === (n = t) || void 0 === n ? void 0 : n.parentNode;
                  if (
                    !e ||
                    (null === e || void 0 === e ? void 0 : e.nodeType) !==
                      Node.ELEMENT_NODE
                  )
                    break;
                  t = e;
                }
                return t;
              })(e);
              return a(n, t);
            },
            l = (e) =>
              new Promise((t) => {
                setTimeout(t, e);
              });
          async function c() {
            const t = [],
              n = document.querySelector("#noteContainer");
            if (n) {
              const r = Array.prototype.slice
                .call(n.querySelectorAll("*"))
                .map(async (n) => {
                  if (
                    "IMG" === n.tagName &&
                    n.hasAttribute("src") &&
                    n.getAttribute("src").includes("xhscdn.com") &&
                    n.getAttribute("class") &&
                    n.getAttribute("class").includes("note-slider-img")
                  ) {
                    const o = n.getAttribute("src");
                    try {
                      const n = await (async function (t) {
                        try {
                          const n = await e(t);
                          if (!n.ok)
                            throw new Error("Network response was not ok.");
                          const r = await n.blob(),
                            o = new Image();
                          return new Promise((e, t) => {
                            (o.onload = () => {
                              const t = document.createElement("canvas");
                              (t.width = o.width),
                                (t.height = o.height),
                                t.getContext("2d").drawImage(o, 0, 0);
                              const n = t.toDataURL("image/jpeg", 0.1);
                              e(n);
                            }),
                              (o.onerror = () => {
                                t(new Error("Image failed to load."));
                              }),
                              (o.src = URL.createObjectURL(r));
                          });
                        } catch (n) {
                          throw n;
                        }
                      })(o);
                      t.length < 3 && t.push(n);
                    } catch (r) {}
                  }
                });
              await Promise.all(r);
            }
            return t;
          }
          function u(e) {
            return (
              (e = (e = (e = (e = (e = (e = (e = (e = (e = e.replace(
                /<style[^>]*>([\s\S]*?)<\/style>/gi,
                ""
              )).replace(/<meta[^>]*>([\s\S]*?)<\/meta>/gi, "")).replace(
                /<br[^>]*>/gi,
                ""
              )).replace(/<meta[^>]*>/gi, "")).replace(
                /<html\b([^>]*)\bdata-bbox="[^"]*"\s*/g,
                "<html$1"
              )).replace(
                /<body\b([^>]*)\bdata-bbox="[^"]*"\s*/g,
                "<body$1"
              )).replace(/>\s+</g, "><")).replace(
                /<html\s*>/g,
                "<html>"
              )).replace(/<body\s*>/g, "<body>")).match(/<html\b[^>]*>/i) ||
                (e = "<html>" + e),
              e.match(/<\/html>/i) || (e += "</html>"),
              e.match(/<body\b[^>]*>/i) ||
                (e = (e = e.replace(/<html\b[^>]*>/i, "<html><body>")).replace(
                  /<\/html>/i,
                  "</body></html>"
                )),
              e.match(/<\/body>/i) ||
                (e = e.replace(/<\/html>/i, "</body></html>")),
              (e = (e = (e = (e = (e = e.replace(
                /<svg\b([^>]*)data-text=["']([^"']*)["']([^>]*)>([\s\S]*?)<\/svg>/gi,
                (e, t, n, r, o) => {
                  let i = n || "";
                  return "<svg"
                    .concat(t, 'data-text="')
                    .concat(n, '"')
                    .concat(r, ">")
                    .concat(i, "</svg>");
                }
              )).replace(
                /<textarea\b([^>]*)placeholder=["']([^"']*)["']([^>]*)>([\s\S]*?)<\/textarea>/gi,
                (e, t, n, r, o) =>
                  "<textarea"
                    .concat(t, 'data-text="')
                    .concat(n, '"')
                    .concat(r, ">")
                    .concat(o, "</textarea>")
              )).replace(
                /<input\b([^>]*)placeholder=["']([^"']*)["']([^>]*)>/gi,
                (e, t, n, r) =>
                  "<input"
                    .concat(t, ' placeholder="')
                    .concat(n, '" data-text="')
                    .concat(n, '"')
                    .concat(r, ">")
              )).replace(
                /<button\b([^>]*)title=["']([^"']*)["']([^>]*)>([\s\S]*?)<\/button>/gi,
                (e, t, n, r, o) =>
                  "<button"
                    .concat(t, 'data-text="')
                    .concat(n, '"')
                    .concat(r, ">")
                    .concat(o, "</button>")
              )).replace(/\s*title\s*=\s*["'][^"']*["']/g, ""))
            );
          }
          try {
            await new Promise((e, t) => {
              const n = setTimeout(() => {
                  e();
                }, 1e4),
                r = () => {
                  "complete" === document.readyState
                    ? (clearTimeout(n), e())
                    : setTimeout(r, 100);
                };
              r();
            });
          } catch (m) {}
          const d = await (async () => {
            await l(500);
            try {
              Array.from(
                document.getElementsByClassName("possible-clickable-element")
              ).forEach((e) => {
                e.classList.remove("possible-clickable-element"),
                  e.removeAttribute("data-value"),
                  e.removeAttribute("data-text"),
                  e.removeAttribute("data-label"),
                  e.removeAttribute("data-bbox"),
                  e.removeAttribute("data-status"),
                  e.removeAttribute("data-backend-node-id"),
                  e.removeAttribute("data-label-id");
              });
            } catch (m) {}
            let e = {
              window: [
                window.screenX,
                window.screenY,
                window.innerWidth,
                window.innerHeight,
              ],
              viewportSize: {
                viewport_width: Math.round(window.visualViewport.width),
                viewport_height: Math.round(window.visualViewport.height),
              },
            };
            (() => {
              Math.max(
                document.documentElement.clientWidth || 0,
                window.innerWidth || 0
              ),
                Math.max(
                  document.documentElement.clientHeight || 0,
                  window.innerHeight || 0
                );
              var e = 0;
              Array.prototype.slice
                .call(document.querySelectorAll("*"))
                .forEach((t) => {
                  var n, r;
                  t.setAttribute("data-backend-node-id", e), e++;
                  var o =
                      (null === (n = (r = t.tagName).toLowerCase) ||
                      void 0 === n
                        ? void 0
                        : n.call(r)) || "",
                    i = t.getBoundingClientRect();
                  if (
                    (i &&
                      (i.width > 0 || i.height > 0) &&
                      ((rect = {
                        left: (100 * Math.round(i.left)) / 100,
                        top: (100 * Math.round(i.top)) / 100,
                        width: (100 * Math.round(i.width)) / 100,
                        height: (100 * Math.round(i.height)) / 100,
                      }),
                      t.setAttribute(
                        "data-bbox",
                        ""
                          .concat(rect.left, ",")
                          .concat(rect.top, ",")
                          .concat(rect.width, ",")
                          .concat(rect.height)
                      )),
                    t.hasChildNodes() &&
                      "style" !== t.tagName.toLowerCase() &&
                      "script" !== t.tagName.toLowerCase() &&
                      "noscript" !== t.tagName.toLowerCase() &&
                      "title" !== t.tagName.toLowerCase() &&
                      "object" !== t.tagName.toLowerCase())
                  ) {
                    var a = Array.prototype.slice
                      .call(t.childNodes)
                      .filter((e) => e.nodeType == Node.TEXT_NODE)
                      .map(
                        (e) =>
                          e.textContent.trim().replace(/\s{2,}/g, " ") || ""
                      )
                      .filter((e) => e.length > 0);
                    t.setAttribute("data-text", a.join(","));
                  }
                  if ("select" == o) {
                    var s,
                      l,
                      c = t.value,
                      u =
                        (null === (s = t.options[t.selectedIndex]) ||
                        void 0 === s
                          ? void 0
                          : s.text) || "";
                    t.setAttribute("data-value", c),
                      t.setAttribute("data-text", u),
                      null === (l = t.options[t.selectedIndex]) ||
                        void 0 === l ||
                        l.setAttribute("data-status", "selected");
                  }
                  if ("input" == o) {
                    if ("checkbox" == (t.getAttribute("type") || "")) {
                      var d = t.checked ? "checked" : "not-checked";
                      t.setAttribute("data-status", d);
                    }
                    let e = t.getAttribute("name") || "";
                    if (e && t.closest("div[role='dialog']")) {
                      let n = e
                        .replace(/([A-Z])/g, " $1")
                        .toLowerCase()
                        .replace(/^./, (e) => e.toUpperCase());
                      t.setAttribute("data-text", n);
                    }
                    if (
                      e &&
                      t.closest("div[class='j_title_wrap']") &&
                      t
                        .closest("div[class='j_title_wrap']")
                        .querySelector("div[class='tbui_placeholder']")
                    ) {
                      let e = t
                        .closest("div[class='j_title_wrap']")
                        .querySelector("div[class='tbui_placeholder']")
                        .textContent.trim();
                      t.setAttribute("data-text", e);
                    }
                    t.placeholder &&
                    "string" === typeof t.placeholder &&
                    t.placeholder.includes("\u6700\u9ad8\u4ef7")
                      ? t.setAttribute("data-text", "\xa5 \u6700\u9ad8\u4ef7")
                      : t.placeholder &&
                        "string" === typeof t.placeholder &&
                        t.placeholder.includes("\u6700\u4f4e\u4ef7") &&
                        t.setAttribute("data-text", "\xa5 \u6700\u4f4e\u4ef7"),
                      t.hasAttribute("aria-label") &&
                        t.setAttribute(
                          "data-text",
                          t.getAttribute("aria-label")
                        ),
                      window.location.href.includes("mail.google.com") &&
                        (t.getAttribute("aria-label") &&
                          t
                            .getAttribute("aria-label")
                            .includes("\u65e5\u671f") &&
                          t.setAttribute(
                            "data-text",
                            t.getAttribute("aria-label")
                          ),
                        t.getAttribute("aria-label") &&
                          t.getAttribute("aria-label").includes("date") &&
                          t.setAttribute(
                            "data-text",
                            t.getAttribute("aria-label")
                          ));
                  }
                  if ("svg" === o) {
                    let e = t.closest("button");
                    e &&
                      e.hasAttribute("data-testid") &&
                      t.setAttribute(
                        "data-text",
                        e.getAttribute("data-testid")
                      );
                    let n = t.closest("div[class*='video-toolbar-left-item']");
                    n &&
                      n.classList &&
                      n.classList.length > 0 &&
                      (n.classList.contains("video-like") &&
                        (t.setAttribute("data-text", "\u672a\u70b9\u8d5e"),
                        n.classList.contains("on") &&
                          t.setAttribute("data-text", "\u5df2\u70b9\u8d5e")),
                      n.classList.contains("video-coin") &&
                        (t.setAttribute("data-text", "\u672a\u6295\u5e01"),
                        n.classList.contains("on") &&
                          t.setAttribute("data-text", "\u5df2\u6295\u5e01")),
                      n.classList.contains("video-fav") &&
                        (t.setAttribute("data-text", "\u672a\u6536\u85cf"),
                        n.classList.contains("on") &&
                          t.setAttribute("data-text", "\u5df2\u6536\u85cf")),
                      n.classList.contains("video-share-wrap") &&
                        (t.setAttribute("data-text", "\u672a\u5206\u4eab"),
                        n.classList.contains("on") &&
                          t.setAttribute("data-text", "\u5df2\u5206\u4eab")));
                    let r = t.closest("a[class*='right-entry__outside']");
                    r &&
                      r.querySelector("span[class*='right-entry-text']") &&
                      t.setAttribute(
                        "data-text",
                        r
                          .querySelector("span[class*='right-entry-text']")
                          .textContent.trim()
                      );
                    let o = t.closest("div[class*='header-upload-entry']");
                    o &&
                      o.querySelector(
                        "span[class*='header-upload-entry__text']"
                      ) &&
                      t.setAttribute(
                        "data-text",
                        o
                          .querySelector(
                            "span[class*='header-upload-entry__text']"
                          )
                          .textContent.trim()
                      );
                  }
                  if ("a" === o) {
                    let e = t.closest("li");
                    if (e) {
                      const n = {
                        tbui_fbar_auxiliaryCare: "\u8f85\u52a9\u6a21\u5f0f",
                        tbui_fbar_down: "\u4e0b\u8f7dAPP",
                        tbui_fbar_post: "\u53d1\u5e16",
                        tbui_fbar_refresh: "\u5237\u65b0",
                        tbui_fbar_share: "\u5206\u4eab",
                        tbui_fbar_favor: "\u7231\u901b\u7684\u5427",
                        tbui_fbar_feedback: "\u6211\u8981\u53cd\u9988",
                      };
                      for (const [r, o] of Object.entries(n))
                        if (e.classList.contains(r)) {
                          t.setAttribute("data-text", o);
                          break;
                        }
                    }
                  }
                  if ("button" === o) {
                    if (t.querySelector("span[class*='woo-like-count']")) {
                      let e = t.querySelector("span[class*='woo-like-count']");
                      e.classList.contains("woo-like-liked") ||
                      "NaN" == e.textContent
                        ? t.setAttribute("title", "\u5df2\u8d5e")
                        : t.setAttribute("title", "\u8d5e");
                    }
                    t.querySelector("svg[data-icon='SendColorful']") &&
                      t.setAttribute("data-text", "Send");
                  }
                  "li" === o &&
                    (t.classList.contains("is-allow-hover") ||
                      t.classList.contains("is-disable")) &&
                    t.closest("ul[class*='c-calendar-month__week']") &&
                    t.setAttribute("data-text", t.textContent.trim()),
                    "span" === o &&
                      t.className &&
                      "add-new-event-icon-wrapper" === t.className &&
                      t.setAttribute("data-text", "add new event");
                }),
                Array.prototype.slice
                  .call(document.querySelectorAll("input, textarea"))
                  .forEach((e) => {
                    e.setAttribute("data-value", e.value);
                  });
            })(),
              await l(100),
              Array.prototype.slice
                .call(document.querySelectorAll("*"))
                .map(function (e) {
                  var t,
                    n,
                    r = Math.max(
                      document.documentElement.clientWidth || 0,
                      window.innerWidth || 0
                    ),
                    o = Math.max(
                      document.documentElement.clientHeight || 0,
                      window.innerHeight || 0
                    ),
                    i = e.getBoundingClientRect(),
                    a = i.left + i.width / 2,
                    s = i.top + i.height / 2,
                    l = document.elementFromPoint(a, s),
                    c = [];
                  l &&
                    (l === e || e.contains(l)) &&
                    ((rect = {
                      left: Math.max(0, i.left),
                      top: Math.max(0, i.top),
                      right: Math.min(r, i.right),
                      bottom: Math.min(o, i.bottom),
                      width: Math.min(r, i.right) - Math.max(0, i.left),
                      height: Math.min(o, i.bottom) - Math.max(0, i.top),
                    }),
                    c.push(rect));
                  var u = c.reduce((e, t) => e + t.width * t.height, 0);
                  const d =
                    (null === (t = (n = e.tagName).toLowerCase) || void 0 === t
                      ? void 0
                      : t.call(n)) || "";
                  let h =
                    null != e.onclick ||
                    "pointer" == window.getComputedStyle(e).cursor ||
                    ("SPAN" === e.tagName &&
                      e.textContent.includes("Invite collaborator") &&
                      e.closest("div[role='option']")) ||
                    ("LI" === e.tagName &&
                      e.classList.contains("ActionMenu-item") &&
                      e.parentNode &&
                      "UL" === e.parentNode.tagName &&
                      e.parentNode.classList.contains("ActionMenu"));
                  if ("img" === d) {
                    let t = e.getAttribute("usemap");
                    if (t) {
                      const n = e.getBoundingClientRect();
                      (t = t.replace(/^#/, "").replace('"', '\\"')),
                        document.querySelector('map[name="'.concat(t, '"]')) &&
                          (n.width > 0 || n.height > 0) &&
                          (h = !0);
                    }
                  }
                  if (!h) {
                    const t = e.getAttribute("role");
                    if (
                      null != t &&
                      [
                        "button",
                        "tab",
                        "link",
                        "checkbox",
                        "menuitem",
                        "menuitemcheckbox",
                        "menuitemradio",
                        "radio",
                        "option",
                        "listbox",
                      ].includes(t.toLowerCase())
                    )
                      h = !0;
                    else {
                      var p, f;
                      const t = e.getAttribute("contentEditable");
                      null != t &&
                        ["", "contenteditable", "true"].includes(
                          t.toLowerCase()
                        ) &&
                        (h = !0),
                        "DIV" === e.tagName &&
                          ((e.classList.contains(
                            "public-DraftStyleDefault-block"
                          ) &&
                            e.closest("div[contenteditable='true']")) ||
                            e.classList.contains("mc-box") ||
                            e.classList.contains("bili-topic-search__input")) &&
                          (h = !0),
                        "H4" === e.tagName &&
                          ("DT" === e.parentNode.tagName ||
                            (e.classList &&
                              e.classList.length > 0 &&
                              e.classList.contains("channel-name"))) &&
                          (h = !0);
                      const n = e.getAttribute("data-morpho-type");
                      null != n && "paragraph" === n && (h = !0),
                        "pointer" ===
                          window.getComputedStyle(e, ":hover").cursor &&
                          (h = !0),
                        e &&
                          "string" === typeof e.className &&
                          e.className.includes("QuickAccess_item") &&
                          (h = !0),
                        "SPAN" === e.tagName &&
                          ((null !== (p = e.getAttribute("id")) &&
                            void 0 !== p &&
                            p.includes("mm-recipes-details__nutrition-link")) ||
                            e.classList.contains(
                              "bili-topic-search__input__text"
                            )) &&
                          (h = !0),
                        "P" === e.tagName &&
                          null !== (f = e.getAttribute("id")) &&
                          void 0 !== f &&
                          f.includes("check") &&
                          (h = !0),
                        "LI" === e.tagName &&
                          e.classList.contains("sr-li") &&
                          (h = !0),
                        "BILI-COMMENTS" === e.tagName && (h = !0),
                        "DIV" === e.tagName &&
                          e.parentElement &&
                          "DIV" === e.parentElement.tagName &&
                          e.parentElement.getAttribute("jscontroller") &&
                          "checkbox" === e.parentElement.getAttribute("role") &&
                          e.parentElement.getAttribute("aria-label") &&
                          (h = !0),
                        "DIV" === e.tagName &&
                          e.className.includes("VfPpkd-RLmnJb") &&
                          (h = !0),
                        "DIV" === e.tagName &&
                          "LI" === e.parentElement.tagName &&
                          (e.className.includes(
                            "FeedItem-module__feedItemWrapper"
                          ) ||
                            e.className.includes(
                              "FeedItem-module__feedItemLeftWrapper"
                            )) &&
                          (h = !0),
                        "SPAN" === e.tagName &&
                          "LABEL" === e.parentElement.tagName &&
                          e.className.includes("next-checkbox-label") &&
                          (h = !0),
                        "DT" === e.tagName &&
                          "DL" === e.parentElement.tagName &&
                          e.getAttribute("groupitem") &&
                          e.getAttribute("groupid") &&
                          window.location.href.includes("kns.cnki") &&
                          (h = !0),
                        "B" === e.tagName &&
                          "DT" === e.parentElement.tagName &&
                          e.className.includes("noorders") &&
                          window.location.href.includes("kns.cnki") &&
                          (h = !0),
                        window.location.href.includes(".ctrip") &&
                          ("DIV" === e.tagName &&
                            "DIV" === e.parentElement.tagName &&
                            e.parentElement.className.includes("date-week") &&
                            e.className.includes("date-day") &&
                            (h = !0),
                          "LI" === e.tagName &&
                            e.getAttribute("u_key") &&
                            (h = !0),
                          "DIV" === e.tagName &&
                            e.className.includes("address") &&
                            e.getAttribute("u_key") &&
                            (h = !0),
                          "LI" === e.tagName &&
                            "DIV" === e.parentElement.parentElement.tagName &&
                            e.parentElement.parentElement.className.includes(
                              "class-grade-select"
                            ) &&
                            (h = !0),
                          "DIV" === e.tagName &&
                            e.getAttribute("u_key") &&
                            (h = !0),
                          "STRONG" === e.tagName &&
                            e.className.includes("assist-hidden-dom") &&
                            e.parentElement.className.includes("date") &&
                            "DIV" === e.parentElement.tagName &&
                            (h = !0),
                          ("STRONG" === e.tagName || "I" === e.tagName) &&
                            e.parentElement.className.includes("item") &&
                            "DIV" === e.parentElement.tagName &&
                            e.parentElement.getAttribute("data-ubt-key") &&
                            (h = !0));
                    }
                  }
                  if (!h && e.hasAttribute("jsaction")) {
                    const t = e.getAttribute("jsaction").split(";");
                    for (let e of t) {
                      const t = e.trim().split(":");
                      if (t.length >= 1 && t.length <= 2) {
                        const [e, n, r] =
                          1 === t.length
                            ? ["click", ...t[0].trim().split("."), "_"]
                            : [t[0], ...t[1].trim().split("."), "_"];
                        h || (h = "click" === e && "none" !== n && "_" !== r);
                      }
                    }
                  }
                  h ||
                    (h = [
                      "input",
                      "textarea",
                      "select",
                      "button",
                      "a",
                      "iframe",
                      "video",
                      "object",
                      "embed",
                      "details",
                      "svg",
                    ].includes(d)),
                    h ||
                      ("label" === d
                        ? (h = null != e.control && !e.control.disabled)
                        : "img" === d &&
                          (h = ["zoom-in", "zoom-out"].includes(
                            e.style.cursor
                          )));
                  const g = e.getAttribute("class");
                  !h && g && g.toLowerCase().includes("button") && (h = !0);
                  const m = e.getAttribute("tabindex"),
                    v = m ? parseInt(m) : -1;
                  h || v < 0 || isNaN(v) || (h = !0);
                  const y = e.getAttribute("id"),
                    b = y ? y.toLowerCase() : "";
                  if (h && 0 == u) {
                    const t = e.textContent.trim().replace(/\s{2,}/g, " ");
                    ""
                      .concat(d, "[id=")
                      .concat(b, "] ")
                      .concat(h, " (")
                      .concat(u, ") ")
                      .concat(t);
                  }
                  return {
                    element: e,
                    include: h,
                    area: u,
                    rects: c,
                    text: e.textContent.trim().replace(/\s{2,}/g, " "),
                  };
                })
                .filter((e) => e.include)
                .forEach((e) => {
                  e.element.classList.add("possible-clickable-element");
                });
            let t,
              n = 0;
            ([t, n] = ((e) => {
              e.usedIds || (e.usedIds = new Set());
              let t = e.selector,
                n = e.startIndex;
              var r = Array.prototype.slice.call(document.querySelectorAll(t)),
                o = Math.max(
                  document.documentElement.clientWidth || 0,
                  window.innerWidth || 0
                ),
                i = Math.max(
                  document.documentElement.clientHeight || 0,
                  window.innerHeight || 0
                );
              return [
                (r = r
                  .map((t) => {
                    var r,
                      a,
                      s = t.getBoundingClientRect(),
                      l = {
                        left: Math.max(0, s.left),
                        top: Math.max(0, s.top),
                        right: Math.min(o, s.right),
                        bottom: Math.min(i, s.bottom),
                        width: Math.min(o, s.width),
                        height: Math.min(i, s.height),
                      },
                      c = "",
                      u = -1;
                    if (l.width > 0 || l.height > 0) {
                      if (n >= 0) {
                        for (; e.usedIds.has(n); ) n++;
                        (u = n++),
                          e.usedIds.add(u),
                          t.setAttribute("data-label-id", u);
                      }
                      for (var d = t.childNodes, h = 0; h < d.length; h++)
                        d[h].nodeType == Node.TEXT_NODE &&
                          (c += d[h].textContent);
                    }
                    if (t.classList.contains("start-chat-btn")) {
                      if (n >= 0) {
                        for (; e.usedIds.has(n); ) n++;
                        (u = n++),
                          e.usedIds.add(u),
                          t.setAttribute("data-label-id", u);
                      }
                      for (d = t.childNodes, h = 0; h < d.length; h++)
                        d[h].nodeType == Node.TEXT_NODE &&
                          (c += d[h].textContent);
                    }
                    return {
                      keep: !0,
                      id: u,
                      rects: l,
                      tag:
                        (null === (r = (a = t.tagName).toLowerCase) ||
                        void 0 === r
                          ? void 0
                          : r.call(a)) || "",
                      text: c,
                    };
                  })
                  .filter((e) => e.keep)),
                n,
              ];
            })({ selector: ".possible-clickable-element", startIndex: n })),
              await l(50),
              await l(100),
              document.querySelectorAll(".our-dom-marker").forEach((e) => {
                document.body.removeChild(e);
              }),
              (e.modified_html = document.documentElement.outerHTML);
            let r = document.querySelector("#noteContainer");
            r && (e.modified_html = r.outerHTML);
            let o = (() => {
              function e(e) {
                var t, n, r;
                return {
                  bid: e.getAttribute("data-backend-node-id") || "",
                  label: e.getAttribute("data-label-id") || "",
                  tag:
                    (null === (t = (n = e.tagName).toLowerCase) || void 0 === t
                      ? void 0
                      : t.call(n)) || "",
                  area: JSON.parse(
                    "[" + (e.getAttribute("data-bbox") || "") + "]"
                  ),
                  text:
                    (null === (r = e.innerText) || void 0 === r
                      ? void 0
                      : r.trim().replace(/\s{2,}/g, " ")) || "",
                  id: e.getAttribute("id") || "",
                  role: e.getAttribute("role") || "",
                  "aria-label": e.getAttribute("aria-label") || "",
                  href: e.getAttribute("href") || "",
                };
              }
              return {
                all_elements: Array.prototype.slice
                  .call(document.querySelectorAll("*"))
                  .map((t) => e(t)),
                clickable_elements: Array.prototype.slice
                  .call(document.querySelectorAll("*"))
                  .filter((e) => e.getAttribute("data-label-id"))
                  .map((t) => e(t)),
              };
            })();
            e.element_info = o;
            let i = (function (e) {
                const t = (e = (e = (e = (e = (e = (e = (e = e.replace(
                  /<!--[\s\S]*?-->/g,
                  ""
                )).replace(/<script[\s\S]*?<\/script>/g, "")).replace(
                  /<link[\s\S]*?>/g,
                  ""
                )).replace(/<noscript[\s\S]*?<\/noscript>/g, "")).replace(
                  /<style[\s\S]*?<\/style>/g,
                  ""
                )).replace(/<plasmo-csui[\s\S]*?<\/plasmo-csui>/g, ""))
                  ? e.replace(/\s+/g, " ").trim()
                  : "").match(/<meta charset="([^"]*)">/);
                let n = new DOMParser({
                  explicitDocumentType: !0,
                  proxyDocument: { encoding: "utf-8" },
                });
                if (t) {
                  const e = t[1];
                  n = new DOMParser({
                    explicitDocumentType: !0,
                    proxyDocument: { encoding: e },
                  });
                }
                let r = n.parseFromString(e, "text/html");
                function o(e) {
                  e.querySelectorAll("*").forEach((e) => {
                    const t = e.getAttribute("style"),
                      n =
                        e &&
                        ("xft-popup-container" === e.tagName.toLowerCase() ||
                          e.classList.contains("dropdown-items") ||
                          e.classList.contains("start-chat-btn")),
                      r =
                        e.hasAttribute("data-sg-type") &&
                        "placeholder" === e.getAttribute("data-sg-type"),
                      o =
                        e.hasAttribute("id") &&
                        e.getAttribute("id").includes("_mail_emailhide_");
                    t &&
                      !n &&
                      (t.includes("display: none") ||
                        t.includes("display:none") ||
                        t.includes("visibility: hidden") ||
                        t.includes("visibility:hidden") ||
                        t.includes("opacity: 0") ||
                        t.includes("opacity:0") ||
                        (t.includes("position: absolute") &&
                          (t.includes("left: -9999px") ||
                            t.includes("left: -10000px"))) ||
                        t.includes("clip: rect(0, 0, 0, 0)") ||
                        t.includes("clip-path: inset(100%)") ||
                        r ||
                        o) &&
                      e.remove();
                  }),
                    e.querySelector("div[id*='_mail_emailhide_']") &&
                      e.querySelector("div[id*='_mail_emailhide_']").remove();
                }
                Array.prototype.slice
                  .call(r.querySelectorAll("div[class='DraftEditor-root']"))
                  .forEach((e) => {
                    if (
                      e.querySelector(
                        "div[class='public-DraftEditorPlaceholder-inner']"
                      ) &&
                      e
                        .querySelector(
                          "div[class='public-DraftEditorPlaceholder-inner']"
                        )
                        .hasAttribute("data-text") &&
                      e.querySelector("div[contenteditable='true']")
                    ) {
                      e.querySelector(
                        "div[contenteditable='true']"
                      ).setAttribute(
                        "data-text",
                        e
                          .querySelector(
                            "div[class='public-DraftEditorPlaceholder-inner']"
                          )
                          .getAttribute("data-text")
                      );
                    }
                  }),
                  Array.prototype.slice
                    .call(r.querySelectorAll("svg"))
                    .forEach((e) => {
                      let t = e.querySelectorAll("use"),
                        n = e.getAttribute("width") + "px" || 0;
                      t.forEach((t) => {
                        let r = t.getAttribute("xlink:href"),
                          o = "";
                        (o =
                          "#chat" === r && "24px" === n
                            ? "\u8bc4\u8bba"
                            : "#collect" === r && "24px" === n
                            ? "\u6536\u85cf"
                            : "#like" === r && "24px" === n
                            ? "\u70b9\u8d5e"
                            : "#share_new" === r && "24px" === n
                            ? "\u5206\u4eab"
                            : "#link_c" === r && "24px" === n
                            ? "\u5206\u4eab\u5f62\u5f0f"
                            : ("#chat" === r && "16px" === n) ||
                              ("#reply" === r && "16px" === n)
                            ? "\u56de\u590d"
                            : "#collect" === r && "16px" === n
                            ? "\u8bc4\u8bba\u533a\u6536\u85cf"
                            : "#like" === r && "16px" === n
                            ? "\u8bc4\u8bba\u533a\u70b9\u8d5e"
                            : "#collected" === r && "24px" === n
                            ? "\u5df2\u6536\u85cf"
                            : "#liked" === r && "24px" === n
                            ? "\u5df2\u70b9\u8d5e"
                            : "#collected" === r && "16px" === n
                            ? "\u8bc4\u8bba\u533a\u5df2\u6536\u85cf"
                            : "#liked" === r && "16px" === n
                            ? "\u8bc4\u8bba\u533a\u5df2\u70b9\u8d5e"
                            : ""),
                          o && e.setAttribute("data-text", o);
                      });
                      let r = e.getAttribute("data-icon"),
                        o = "";
                      "EmojiOutlined" === r
                        ? (o = "EmojiOutlined")
                        : "AtOutlined" === r
                        ? (o = "AtOutlined")
                        : "MoreAddOutlined" === r
                        ? (o = "Add More")
                        : "ExpandOutlined" === r && (o = "Expand"),
                        o && e.setAttribute("data-text", o);
                    }),
                  Array.prototype.slice
                    .call(r.querySelectorAll("div[contenteditable=true]"))
                    .forEach((e) => {
                      e &&
                        e.parentNode &&
                        "SEARCH_EDITOR_ID" === e.parentNode.id &&
                        e.setAttribute(
                          "data-text",
                          "\u4f60\u60f3\u641c\u7684\uff0c\u5728\u8fd9\u91cc\u90fd\u80fd\u641c\u5230"
                        ),
                        e &&
                          e.className.includes("zone-container text-editor") &&
                          e.className.includes("text-editor-focused") &&
                          e.hasAttribute("data-zone-id") &&
                          "2" === e.getAttribute("data-zone-id") &&
                          e.setAttribute(
                            "data-text",
                            "\u8bf7\u8f93\u5165\u6b63\u6587"
                          );
                    }),
                  r.querySelectorAll("button").forEach((e) => {
                    "\u7efc\u5408" === e.textContent && e.remove();
                  }),
                  o(r);
                const i = r.documentElement;
                return i;
              })(e.modified_html),
              a = s(i, e.window),
              u = await c();
            return (
              (e.html = a), (e.imageList = u), e.userIds && delete e.userIds, e
            );
          })();
          let h = "",
            p = document.querySelector("#noteContainer");
          p &&
            (h = u(
              (function (e) {
                const t = (e = (e = (e = (e = (e = (e = (e = e.replace(
                  /<!--[\s\S]*?-->/g,
                  ""
                )).replace(/<script[\s\S]*?<\/script>/g, "")).replace(
                  /<link[\s\S]*?>/g,
                  ""
                )).replace(/<noscript[\s\S]*?<\/noscript>/g, "")).replace(
                  /<style[\s\S]*?<\/style>/g,
                  ""
                )).replace(/<plasmo-csui[\s\S]*?<\/plasmo-csui>/g, ""))
                  ? e.replace(/\s+/g, " ").trim()
                  : "").match(/<meta charset="([^"]*)">/);
                let n = new DOMParser({
                  explicitDocumentType: !0,
                  proxyDocument: { encoding: "utf-8" },
                });
                if (t) {
                  const e = t[1];
                  n = new DOMParser({
                    explicitDocumentType: !0,
                    proxyDocument: { encoding: e },
                  });
                }
                let r = n.parseFromString(e, "text/html");
                return (
                  Array.prototype.slice
                    .call(r.querySelectorAll("svg"))
                    .forEach((e) => {
                      let t = e.querySelectorAll("use"),
                        n = e.getAttribute("width") + "px" || 0;
                      t.forEach((t) => {
                        let r = t.getAttribute("xlink:href"),
                          o = "";
                        "#chat" === r && "24px" === n
                          ? (o = "\u8bc4\u8bba")
                          : "#collect" === r && "24px" === n
                          ? (o = "\u6536\u85cf")
                          : "#like" === r && "24px" === n
                          ? (o = "\u70b9\u8d5e")
                          : "#share_new" === r && "24px" === n
                          ? (o = "\u5206\u4eab")
                          : "#link_c" === r && "24px" === n
                          ? (o = "\u5206\u4eab\u5f62\u5f0f")
                          : ("#chat" === r && "16px" === n) ||
                            ("#reply" === r && "16px" === n)
                          ? (o = "\u56de\u590d")
                          : "#collect" === r && "16px" === n
                          ? (o = "\u8bc4\u8bba\u533a\u6536\u85cf")
                          : "#like" === r && "16px" === n
                          ? (o = "\u8bc4\u8bba\u533a\u70b9\u8d5e")
                          : "#collected" === r && "24px" === n
                          ? (o = "\u5df2\u6536\u85cf")
                          : "#liked" === r && "24px" === n
                          ? (o = "\u5df2\u70b9\u8d5e")
                          : "#collected" === r && "16px" === n
                          ? (o = "\u8bc4\u8bba\u533a\u5df2\u6536\u85cf")
                          : "#liked" === r &&
                            "16px" === n &&
                            (o = "\u8bc4\u8bba\u533a\u5df2\u70b9\u8d5e"),
                          o && e.setAttribute("data-text", o);
                      });
                    }),
                  (function (e) {
                    e.querySelectorAll("*").forEach((e) => {
                      const t = e.getAttribute("style"),
                        n =
                          e &&
                          ("xft-popup-container" === e.tagName.toLowerCase() ||
                            e.classList.contains("dropdown-items") ||
                            e.classList.contains("start-chat-btn"));
                      t &&
                        !n &&
                        (t.includes("display: none") ||
                          t.includes("display:none") ||
                          t.includes("visibility: hidden") ||
                          t.includes("visibility:hidden") ||
                          t.includes("opacity: 0") ||
                          t.includes("opacity:0") ||
                          (t.includes("position: absolute") &&
                            /left:\s*(-\d+)px/.test(t) &&
                            parseInt(t.match(/left:\s*(-\d+)px/)[1]) <=
                              -9999) ||
                          t.includes("clip: rect(0, 0, 0, 0)") ||
                          t.includes("clip-path: inset(100%)")) &&
                        e.remove();
                    });
                  })(r),
                  r.documentElement.outerHTML
                );
              })(p.outerHTML)
            ));
          const f = u(d.html),
            g = d.imageList;
          return {
            html_text: f,
            viewport_size: d.viewportSize,
            image_list: g,
            note_container_html: h,
          };
        };
      },
      8852: (e, t, n) => {
        "use strict";
        n.d(t, { E: () => l });
        var r = n(47041);
        n(28694);
        const o = chrome.runtime.getManifest().commands,
          i = {
            Ctrl: r.cX ? "Cmd" : "Ctrl",
            Alt: r.cX ? "Opt" : "Alt",
            Shift: "Shift",
          },
          a = function (e) {
            var t, n;
            let r =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : o;
            return null === r ||
              void 0 === r ||
              null === (t = r[e]) ||
              void 0 === t ||
              null === (n = t.suggested_key) ||
              void 0 === n
              ? void 0
              : n.default;
          },
          s = function (e) {
            let t =
              a(
                e,
                arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : o
              ) || "";
            return (
              (t = t.replace("+", " + ")),
              Object.keys(i).forEach((e) => {
                t = t.replace(e, i[e]);
              }),
              t
            );
          },
          l = function () {
            let e =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : o;
            return {
              commands_modal: {
                text: "floatBall.quickPopup",
                key: a("commands_modal", e),
                label: s("commands_modal", e),
                description: "floatBall.showQuickPopupWithFeatures",
              },
              web_translate: {
                text: "floatBall.webpageTranslation",
                key: a("web_translate", e),
                label: s("web_translate", e),
                description: "floatBall.translateEntireWebpage",
              },
              summary_page: {
                text: "floatBall.pageSummary",
                key: a("summary_page", e),
                label: s("summary_page", e),
                description: "floatBall.openSidebarSummarizePage",
              },
              advanced_select: {
                text: "floatBall.multiLinkSummary",
                key: a("advanced_select", e),
                label: s("advanced_select", e),
                description: "floatBall.selectLinksSummarizeAll",
              },
            };
          };
        l();
      },
      12209: (e, t, n) => {
        "use strict";
        n.a(e, async (e, r) => {
          try {
            n.d(t, { l: () => d });
            var o = n(89379),
              i = n(76358),
              a = n(63919),
              s = e([a]),
              l = s.then ? (await s)() : s;
            function u(e) {
              return e.match(/(https?:\/\/[^\s"']+)/g) || [];
            }
            a = l[0];
            const d = async (e, t) => {
              if (null === e || void 0 === e || !e.content) return;
              chrome.storage.local.remove(["advancedMessages"]);
              let { taskWindowId: n, taskTabId: r } =
                await chrome.storage.local.get(["taskWindowId", "taskTabId"]);
              if ((null === e || void 0 === e ? void 0 : e.tab_id) < 0 && n)
                return void chrome.windows.remove(n);
              const { functions: s } = (0, i.i)(
                null === e || void 0 === e ? void 0 : e.content
              );
              let l = s[0];
              if (
                (null !== e &&
                  void 0 !== e &&
                  e.id &&
                  (l.id = null === e || void 0 === e ? void 0 : e.id),
                null !== e &&
                  void 0 !== e &&
                  e.type &&
                  (l.type = null === e || void 0 === e ? void 0 : e.type),
                null !== e &&
                  void 0 !== e &&
                  e.tab_id &&
                  (l.tab_id = null === e || void 0 === e ? void 0 : e.tab_id),
                t && (l.oriTabId = t),
                (null === l || void 0 === l || !l.url) &&
                  ("0" === l.tab_id ||
                    0 === l.tab_id ||
                    "1" === l.tab_id ||
                    1 === l.tab_id))
              ) {
                l.url = u(l.instruction).length > 0 && u(l.instruction)[0];
                const e =
                  l.instruction.indexOf("\uff0c") || l.instruction.indexOf(",");
                -1 !== e && (l.instruction = l.instruction.slice(e + 1).trim()),
                  -1 !== e ||
                    ("1" !== l.tab_id &&
                      1 !== l.tab_id &&
                      "0" !== l.tab_id &&
                      0 !== l.tab_id) ||
                    (l.instruction = "\u67e5\u770b\u5168\u6587");
              }
              await chrome.storage.local.set({
                functionCall: (0, o.A)(
                  (0, o.A)({}, l),
                  {},
                  { isRunning: !1, oriTabId: t }
                ),
              }),
                await chrome.storage.local.set({ workflowStart: !0 }),
                n
                  ? chrome.windows.get(n, async (e) => {
                      e
                        ? r
                          ? null !== l && void 0 !== l && l.url
                            ? chrome.tabs.create(
                                {
                                  url:
                                    null === l || void 0 === l ? void 0 : l.url,
                                  windowId: n,
                                },
                                async (e) => {
                                  await chrome.storage.local.set({
                                    taskTabId: e.id,
                                  }),
                                    (0, a.F)(e, l);
                                }
                              )
                            : chrome.scripting.executeScript(
                                {
                                  target: { tabId: r },
                                  files: ["static/js/content.js"],
                                },
                                () => {
                                  chrome.tabs.get(r, async (e) => {
                                    chrome.runtime.lastError;
                                  });
                                }
                              )
                          : chrome.tabs.create(
                              {
                                url:
                                  null === l || void 0 === l ? void 0 : l.url,
                                windowId: n,
                              },
                              async (e) => {
                                await chrome.storage.local.set({
                                  taskTabId: e.id,
                                }),
                                  (0, a.F)(e, l);
                              }
                            )
                        : chrome.windows.create(
                            { state: "maximized" },
                            async (e) => {
                              (n = e.id),
                                await chrome.storage.local.set({
                                  taskWindowId: n,
                                }),
                                chrome.tabs.query({ windowId: e.id }, (e) => {
                                  e &&
                                    e.length > 0 &&
                                    chrome.tabs.update(
                                      e[0].id,
                                      {
                                        url:
                                          null === l || void 0 === l
                                            ? void 0
                                            : l.url,
                                      },
                                      async (e) => {
                                        await chrome.storage.local.set({
                                          taskTabId: e.id,
                                        }),
                                          (0, a.F)(e, l);
                                      }
                                    );
                                });
                            }
                          );
                    })
                  : chrome.windows.create({ state: "maximized" }, async (e) => {
                      (n = e.id),
                        await chrome.storage.local.set({ taskWindowId: n }),
                        chrome.tabs.query({ windowId: e.id }, (e) => {
                          e &&
                            e.length > 0 &&
                            chrome.tabs.update(
                              e[0].id,
                              {
                                url:
                                  null === l || void 0 === l ? void 0 : l.url,
                              },
                              async (e) => {
                                await chrome.storage.local.set({
                                  taskTabId: e.id,
                                }),
                                  (0, a.F)(e, l);
                              }
                            );
                        });
                    });
            };
            r();
          } catch (c) {
            r(c);
          }
        });
      },
      13676: (e, t, n) => {
        "use strict";
        n.d(t, { A: () => r });
        const r = async function (e) {
          return e
            ? new Promise((t) => {
                const n = new FileReader();
                (n.onload = () => t(n.result)),
                  (n.onerror = () => t(null)),
                  n.readAsArrayBuffer(e);
              })
            : "";
        };
      },
      16641: function (e, t, n) {
        !(function () {
          var t;
          e.exports =
            ((t = n(29402)),
            (function (e) {
              var n = t,
                r = n.lib,
                o = r.WordArray,
                i = r.Hasher,
                a = n.algo,
                s = [];
              !(function () {
                for (var t = 0; t < 64; t++)
                  s[t] = (4294967296 * e.abs(e.sin(t + 1))) | 0;
              })();
              var l = (a.MD5 = i.extend({
                _doReset: function () {
                  this._hash = new o.init([
                    1732584193, 4023233417, 2562383102, 271733878,
                  ]);
                },
                _doProcessBlock: function (e, t) {
                  for (var n = 0; n < 16; n++) {
                    var r = t + n,
                      o = e[r];
                    e[r] =
                      (16711935 & ((o << 8) | (o >>> 24))) |
                      (4278255360 & ((o << 24) | (o >>> 8)));
                  }
                  var i = this._hash.words,
                    a = e[t + 0],
                    l = e[t + 1],
                    p = e[t + 2],
                    f = e[t + 3],
                    g = e[t + 4],
                    m = e[t + 5],
                    v = e[t + 6],
                    y = e[t + 7],
                    b = e[t + 8],
                    w = e[t + 9],
                    _ = e[t + 10],
                    x = e[t + 11],
                    S = e[t + 12],
                    k = e[t + 13],
                    A = e[t + 14],
                    C = e[t + 15],
                    E = i[0],
                    T = i[1],
                    I = i[2],
                    L = i[3];
                  (E = c(E, T, I, L, a, 7, s[0])),
                    (L = c(L, E, T, I, l, 12, s[1])),
                    (I = c(I, L, E, T, p, 17, s[2])),
                    (T = c(T, I, L, E, f, 22, s[3])),
                    (E = c(E, T, I, L, g, 7, s[4])),
                    (L = c(L, E, T, I, m, 12, s[5])),
                    (I = c(I, L, E, T, v, 17, s[6])),
                    (T = c(T, I, L, E, y, 22, s[7])),
                    (E = c(E, T, I, L, b, 7, s[8])),
                    (L = c(L, E, T, I, w, 12, s[9])),
                    (I = c(I, L, E, T, _, 17, s[10])),
                    (T = c(T, I, L, E, x, 22, s[11])),
                    (E = c(E, T, I, L, S, 7, s[12])),
                    (L = c(L, E, T, I, k, 12, s[13])),
                    (I = c(I, L, E, T, A, 17, s[14])),
                    (E = u(
                      E,
                      (T = c(T, I, L, E, C, 22, s[15])),
                      I,
                      L,
                      l,
                      5,
                      s[16]
                    )),
                    (L = u(L, E, T, I, v, 9, s[17])),
                    (I = u(I, L, E, T, x, 14, s[18])),
                    (T = u(T, I, L, E, a, 20, s[19])),
                    (E = u(E, T, I, L, m, 5, s[20])),
                    (L = u(L, E, T, I, _, 9, s[21])),
                    (I = u(I, L, E, T, C, 14, s[22])),
                    (T = u(T, I, L, E, g, 20, s[23])),
                    (E = u(E, T, I, L, w, 5, s[24])),
                    (L = u(L, E, T, I, A, 9, s[25])),
                    (I = u(I, L, E, T, f, 14, s[26])),
                    (T = u(T, I, L, E, b, 20, s[27])),
                    (E = u(E, T, I, L, k, 5, s[28])),
                    (L = u(L, E, T, I, p, 9, s[29])),
                    (I = u(I, L, E, T, y, 14, s[30])),
                    (E = d(
                      E,
                      (T = u(T, I, L, E, S, 20, s[31])),
                      I,
                      L,
                      m,
                      4,
                      s[32]
                    )),
                    (L = d(L, E, T, I, b, 11, s[33])),
                    (I = d(I, L, E, T, x, 16, s[34])),
                    (T = d(T, I, L, E, A, 23, s[35])),
                    (E = d(E, T, I, L, l, 4, s[36])),
                    (L = d(L, E, T, I, g, 11, s[37])),
                    (I = d(I, L, E, T, y, 16, s[38])),
                    (T = d(T, I, L, E, _, 23, s[39])),
                    (E = d(E, T, I, L, k, 4, s[40])),
                    (L = d(L, E, T, I, a, 11, s[41])),
                    (I = d(I, L, E, T, f, 16, s[42])),
                    (T = d(T, I, L, E, v, 23, s[43])),
                    (E = d(E, T, I, L, w, 4, s[44])),
                    (L = d(L, E, T, I, S, 11, s[45])),
                    (I = d(I, L, E, T, C, 16, s[46])),
                    (E = h(
                      E,
                      (T = d(T, I, L, E, p, 23, s[47])),
                      I,
                      L,
                      a,
                      6,
                      s[48]
                    )),
                    (L = h(L, E, T, I, y, 10, s[49])),
                    (I = h(I, L, E, T, A, 15, s[50])),
                    (T = h(T, I, L, E, m, 21, s[51])),
                    (E = h(E, T, I, L, S, 6, s[52])),
                    (L = h(L, E, T, I, f, 10, s[53])),
                    (I = h(I, L, E, T, _, 15, s[54])),
                    (T = h(T, I, L, E, l, 21, s[55])),
                    (E = h(E, T, I, L, b, 6, s[56])),
                    (L = h(L, E, T, I, C, 10, s[57])),
                    (I = h(I, L, E, T, v, 15, s[58])),
                    (T = h(T, I, L, E, k, 21, s[59])),
                    (E = h(E, T, I, L, g, 6, s[60])),
                    (L = h(L, E, T, I, x, 10, s[61])),
                    (I = h(I, L, E, T, p, 15, s[62])),
                    (T = h(T, I, L, E, w, 21, s[63])),
                    (i[0] = (i[0] + E) | 0),
                    (i[1] = (i[1] + T) | 0),
                    (i[2] = (i[2] + I) | 0),
                    (i[3] = (i[3] + L) | 0);
                },
                _doFinalize: function () {
                  var t = this._data,
                    n = t.words,
                    r = 8 * this._nDataBytes,
                    o = 8 * t.sigBytes;
                  n[o >>> 5] |= 128 << (24 - (o % 32));
                  var i = e.floor(r / 4294967296),
                    a = r;
                  (n[15 + (((o + 64) >>> 9) << 4)] =
                    (16711935 & ((i << 8) | (i >>> 24))) |
                    (4278255360 & ((i << 24) | (i >>> 8)))),
                    (n[14 + (((o + 64) >>> 9) << 4)] =
                      (16711935 & ((a << 8) | (a >>> 24))) |
                      (4278255360 & ((a << 24) | (a >>> 8)))),
                    (t.sigBytes = 4 * (n.length + 1)),
                    this._process();
                  for (var s = this._hash, l = s.words, c = 0; c < 4; c++) {
                    var u = l[c];
                    l[c] =
                      (16711935 & ((u << 8) | (u >>> 24))) |
                      (4278255360 & ((u << 24) | (u >>> 8)));
                  }
                  return s;
                },
                clone: function () {
                  var e = i.clone.call(this);
                  return (e._hash = this._hash.clone()), e;
                },
              }));
              function c(e, t, n, r, o, i, a) {
                var s = e + ((t & n) | (~t & r)) + o + a;
                return ((s << i) | (s >>> (32 - i))) + t;
              }
              function u(e, t, n, r, o, i, a) {
                var s = e + ((t & r) | (n & ~r)) + o + a;
                return ((s << i) | (s >>> (32 - i))) + t;
              }
              function d(e, t, n, r, o, i, a) {
                var s = e + (t ^ n ^ r) + o + a;
                return ((s << i) | (s >>> (32 - i))) + t;
              }
              function h(e, t, n, r, o, i, a) {
                var s = e + (n ^ (t | ~r)) + o + a;
                return ((s << i) | (s >>> (32 - i))) + t;
              }
              (n.MD5 = i._createHelper(l)),
                (n.HmacMD5 = i._createHmacHelper(l));
            })(Math),
            t.MD5);
        })();
      },
      17846: (e, t, n) => {
        "use strict";
        n.d(t, { A: () => r });
        const r = function (e) {
          try {
            const t = e.split(".")[1],
              n = (4 - (t.length % 4)) % 4,
              r = (t + "=".repeat(n)).replace(/-/g, "+").replace(/_/g, "/");
            return JSON.parse(atob(r));
          } catch (t) {
            return null;
          }
        };
      },
      17876: function (e) {
        e.exports = (function () {
          "use strict";
          var e = 1e3,
            t = 6e4,
            n = 36e5,
            r = "millisecond",
            o = "second",
            i = "minute",
            a = "hour",
            s = "day",
            l = "week",
            c = "month",
            u = "quarter",
            d = "year",
            h = "date",
            p = "Invalid Date",
            f =
              /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,
            g =
              /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,
            m = {
              name: "en",
              weekdays:
                "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split(
                  "_"
                ),
              months:
                "January_February_March_April_May_June_July_August_September_October_November_December".split(
                  "_"
                ),
              ordinal: function (e) {
                var t = ["th", "st", "nd", "rd"],
                  n = e % 100;
                return "[" + e + (t[(n - 20) % 10] || t[n] || t[0]) + "]";
              },
            },
            v = function (e, t, n) {
              var r = String(e);
              return !r || r.length >= t
                ? e
                : "" + Array(t + 1 - r.length).join(n) + e;
            },
            y = {
              s: v,
              z: function (e) {
                var t = -e.utcOffset(),
                  n = Math.abs(t),
                  r = Math.floor(n / 60),
                  o = n % 60;
                return (t <= 0 ? "+" : "-") + v(r, 2, "0") + ":" + v(o, 2, "0");
              },
              m: function e(t, n) {
                if (t.date() < n.date()) return -e(n, t);
                var r = 12 * (n.year() - t.year()) + (n.month() - t.month()),
                  o = t.clone().add(r, c),
                  i = n - o < 0,
                  a = t.clone().add(r + (i ? -1 : 1), c);
                return +(-(r + (n - o) / (i ? o - a : a - o)) || 0);
              },
              a: function (e) {
                return e < 0 ? Math.ceil(e) || 0 : Math.floor(e);
              },
              p: function (e) {
                return (
                  {
                    M: c,
                    y: d,
                    w: l,
                    d: s,
                    D: h,
                    h: a,
                    m: i,
                    s: o,
                    ms: r,
                    Q: u,
                  }[e] ||
                  String(e || "")
                    .toLowerCase()
                    .replace(/s$/, "")
                );
              },
              u: function (e) {
                return void 0 === e;
              },
            },
            b = "en",
            w = {};
          w[b] = m;
          var _ = "$isDayjsObject",
            x = function (e) {
              return e instanceof C || !(!e || !e[_]);
            },
            S = function e(t, n, r) {
              var o;
              if (!t) return b;
              if ("string" == typeof t) {
                var i = t.toLowerCase();
                w[i] && (o = i), n && ((w[i] = n), (o = i));
                var a = t.split("-");
                if (!o && a.length > 1) return e(a[0]);
              } else {
                var s = t.name;
                (w[s] = t), (o = s);
              }
              return !r && o && (b = o), o || (!r && b);
            },
            k = function (e, t) {
              if (x(e)) return e.clone();
              var n = "object" == typeof t ? t : {};
              return (n.date = e), (n.args = arguments), new C(n);
            },
            A = y;
          (A.l = S),
            (A.i = x),
            (A.w = function (e, t) {
              return k(e, {
                locale: t.$L,
                utc: t.$u,
                x: t.$x,
                $offset: t.$offset,
              });
            });
          var C = (function () {
              function m(e) {
                (this.$L = S(e.locale, null, !0)),
                  this.parse(e),
                  (this.$x = this.$x || e.x || {}),
                  (this[_] = !0);
              }
              var v = m.prototype;
              return (
                (v.parse = function (e) {
                  (this.$d = (function (e) {
                    var t = e.date,
                      n = e.utc;
                    if (null === t) return new Date(NaN);
                    if (A.u(t)) return new Date();
                    if (t instanceof Date) return new Date(t);
                    if ("string" == typeof t && !/Z$/i.test(t)) {
                      var r = t.match(f);
                      if (r) {
                        var o = r[2] - 1 || 0,
                          i = (r[7] || "0").substring(0, 3);
                        return n
                          ? new Date(
                              Date.UTC(
                                r[1],
                                o,
                                r[3] || 1,
                                r[4] || 0,
                                r[5] || 0,
                                r[6] || 0,
                                i
                              )
                            )
                          : new Date(
                              r[1],
                              o,
                              r[3] || 1,
                              r[4] || 0,
                              r[5] || 0,
                              r[6] || 0,
                              i
                            );
                      }
                    }
                    return new Date(t);
                  })(e)),
                    this.init();
                }),
                (v.init = function () {
                  var e = this.$d;
                  (this.$y = e.getFullYear()),
                    (this.$M = e.getMonth()),
                    (this.$D = e.getDate()),
                    (this.$W = e.getDay()),
                    (this.$H = e.getHours()),
                    (this.$m = e.getMinutes()),
                    (this.$s = e.getSeconds()),
                    (this.$ms = e.getMilliseconds());
                }),
                (v.$utils = function () {
                  return A;
                }),
                (v.isValid = function () {
                  return !(this.$d.toString() === p);
                }),
                (v.isSame = function (e, t) {
                  var n = k(e);
                  return this.startOf(t) <= n && n <= this.endOf(t);
                }),
                (v.isAfter = function (e, t) {
                  return k(e) < this.startOf(t);
                }),
                (v.isBefore = function (e, t) {
                  return this.endOf(t) < k(e);
                }),
                (v.$g = function (e, t, n) {
                  return A.u(e) ? this[t] : this.set(n, e);
                }),
                (v.unix = function () {
                  return Math.floor(this.valueOf() / 1e3);
                }),
                (v.valueOf = function () {
                  return this.$d.getTime();
                }),
                (v.startOf = function (e, t) {
                  var n = this,
                    r = !!A.u(t) || t,
                    u = A.p(e),
                    p = function (e, t) {
                      var o = A.w(
                        n.$u ? Date.UTC(n.$y, t, e) : new Date(n.$y, t, e),
                        n
                      );
                      return r ? o : o.endOf(s);
                    },
                    f = function (e, t) {
                      return A.w(
                        n
                          .toDate()
                          [e].apply(
                            n.toDate("s"),
                            (r ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice(t)
                          ),
                        n
                      );
                    },
                    g = this.$W,
                    m = this.$M,
                    v = this.$D,
                    y = "set" + (this.$u ? "UTC" : "");
                  switch (u) {
                    case d:
                      return r ? p(1, 0) : p(31, 11);
                    case c:
                      return r ? p(1, m) : p(0, m + 1);
                    case l:
                      var b = this.$locale().weekStart || 0,
                        w = (g < b ? g + 7 : g) - b;
                      return p(r ? v - w : v + (6 - w), m);
                    case s:
                    case h:
                      return f(y + "Hours", 0);
                    case a:
                      return f(y + "Minutes", 1);
                    case i:
                      return f(y + "Seconds", 2);
                    case o:
                      return f(y + "Milliseconds", 3);
                    default:
                      return this.clone();
                  }
                }),
                (v.endOf = function (e) {
                  return this.startOf(e, !1);
                }),
                (v.$set = function (e, t) {
                  var n,
                    l = A.p(e),
                    u = "set" + (this.$u ? "UTC" : ""),
                    p = ((n = {}),
                    (n[s] = u + "Date"),
                    (n[h] = u + "Date"),
                    (n[c] = u + "Month"),
                    (n[d] = u + "FullYear"),
                    (n[a] = u + "Hours"),
                    (n[i] = u + "Minutes"),
                    (n[o] = u + "Seconds"),
                    (n[r] = u + "Milliseconds"),
                    n)[l],
                    f = l === s ? this.$D + (t - this.$W) : t;
                  if (l === c || l === d) {
                    var g = this.clone().set(h, 1);
                    g.$d[p](f),
                      g.init(),
                      (this.$d = g.set(
                        h,
                        Math.min(this.$D, g.daysInMonth())
                      ).$d);
                  } else p && this.$d[p](f);
                  return this.init(), this;
                }),
                (v.set = function (e, t) {
                  return this.clone().$set(e, t);
                }),
                (v.get = function (e) {
                  return this[A.p(e)]();
                }),
                (v.add = function (r, u) {
                  var h,
                    p = this;
                  r = Number(r);
                  var f = A.p(u),
                    g = function (e) {
                      var t = k(p);
                      return A.w(t.date(t.date() + Math.round(e * r)), p);
                    };
                  if (f === c) return this.set(c, this.$M + r);
                  if (f === d) return this.set(d, this.$y + r);
                  if (f === s) return g(1);
                  if (f === l) return g(7);
                  var m =
                      ((h = {}), (h[i] = t), (h[a] = n), (h[o] = e), h)[f] || 1,
                    v = this.$d.getTime() + r * m;
                  return A.w(v, this);
                }),
                (v.subtract = function (e, t) {
                  return this.add(-1 * e, t);
                }),
                (v.format = function (e) {
                  var t = this,
                    n = this.$locale();
                  if (!this.isValid()) return n.invalidDate || p;
                  var r = e || "YYYY-MM-DDTHH:mm:ssZ",
                    o = A.z(this),
                    i = this.$H,
                    a = this.$m,
                    s = this.$M,
                    l = n.weekdays,
                    c = n.months,
                    u = n.meridiem,
                    d = function (e, n, o, i) {
                      return (e && (e[n] || e(t, r))) || o[n].slice(0, i);
                    },
                    h = function (e) {
                      return A.s(i % 12 || 12, e, "0");
                    },
                    f =
                      u ||
                      function (e, t, n) {
                        var r = e < 12 ? "AM" : "PM";
                        return n ? r.toLowerCase() : r;
                      };
                  return r.replace(g, function (e, r) {
                    return (
                      r ||
                      (function (e) {
                        switch (e) {
                          case "YY":
                            return String(t.$y).slice(-2);
                          case "YYYY":
                            return A.s(t.$y, 4, "0");
                          case "M":
                            return s + 1;
                          case "MM":
                            return A.s(s + 1, 2, "0");
                          case "MMM":
                            return d(n.monthsShort, s, c, 3);
                          case "MMMM":
                            return d(c, s);
                          case "D":
                            return t.$D;
                          case "DD":
                            return A.s(t.$D, 2, "0");
                          case "d":
                            return String(t.$W);
                          case "dd":
                            return d(n.weekdaysMin, t.$W, l, 2);
                          case "ddd":
                            return d(n.weekdaysShort, t.$W, l, 3);
                          case "dddd":
                            return l[t.$W];
                          case "H":
                            return String(i);
                          case "HH":
                            return A.s(i, 2, "0");
                          case "h":
                            return h(1);
                          case "hh":
                            return h(2);
                          case "a":
                            return f(i, a, !0);
                          case "A":
                            return f(i, a, !1);
                          case "m":
                            return String(a);
                          case "mm":
                            return A.s(a, 2, "0");
                          case "s":
                            return String(t.$s);
                          case "ss":
                            return A.s(t.$s, 2, "0");
                          case "SSS":
                            return A.s(t.$ms, 3, "0");
                          case "Z":
                            return o;
                        }
                        return null;
                      })(e) ||
                      o.replace(":", "")
                    );
                  });
                }),
                (v.utcOffset = function () {
                  return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
                }),
                (v.diff = function (r, h, p) {
                  var f,
                    g = this,
                    m = A.p(h),
                    v = k(r),
                    y = (v.utcOffset() - this.utcOffset()) * t,
                    b = this - v,
                    w = function () {
                      return A.m(g, v);
                    };
                  switch (m) {
                    case d:
                      f = w() / 12;
                      break;
                    case c:
                      f = w();
                      break;
                    case u:
                      f = w() / 3;
                      break;
                    case l:
                      f = (b - y) / 6048e5;
                      break;
                    case s:
                      f = (b - y) / 864e5;
                      break;
                    case a:
                      f = b / n;
                      break;
                    case i:
                      f = b / t;
                      break;
                    case o:
                      f = b / e;
                      break;
                    default:
                      f = b;
                  }
                  return p ? f : A.a(f);
                }),
                (v.daysInMonth = function () {
                  return this.endOf(c).$D;
                }),
                (v.$locale = function () {
                  return w[this.$L];
                }),
                (v.locale = function (e, t) {
                  if (!e) return this.$L;
                  var n = this.clone(),
                    r = S(e, t, !0);
                  return r && (n.$L = r), n;
                }),
                (v.clone = function () {
                  return A.w(this.$d, this);
                }),
                (v.toDate = function () {
                  return new Date(this.valueOf());
                }),
                (v.toJSON = function () {
                  return this.isValid() ? this.toISOString() : null;
                }),
                (v.toISOString = function () {
                  return this.$d.toISOString();
                }),
                (v.toString = function () {
                  return this.$d.toUTCString();
                }),
                m
              );
            })(),
            E = C.prototype;
          return (
            (k.prototype = E),
            [
              ["$ms", r],
              ["$s", o],
              ["$m", i],
              ["$H", a],
              ["$W", s],
              ["$M", c],
              ["$y", d],
              ["$D", h],
            ].forEach(function (e) {
              E[e[1]] = function (t) {
                return this.$g(t, e[0], e[1]);
              };
            }),
            (k.extend = function (e, t) {
              return e.$i || (e(t, C, k), (e.$i = !0)), k;
            }),
            (k.locale = S),
            (k.isDayjs = x),
            (k.unix = function (e) {
              return k(1e3 * e);
            }),
            (k.en = w[b]),
            (k.Ls = w),
            (k.p = {}),
            k
          );
        })();
      },
      20816: (e, t, n) => {
        "use strict";
        n.d(t, { A: () => o });
        var r = n(82284);
        function o(e) {
          var t = (function (e, t) {
            if ("object" != (0, r.A)(e) || !e) return e;
            var n = e[Symbol.toPrimitive];
            if (void 0 !== n) {
              var o = n.call(e, t || "default");
              if ("object" != (0, r.A)(o)) return o;
              throw new TypeError(
                "@@toPrimitive must return a primitive value."
              );
            }
            return ("string" === t ? String : Number)(e);
          })(e, "string");
          return "symbol" == (0, r.A)(t) ? t : t + "";
        }
      },
      23718: (e, t, n) => {
        "use strict";
        n.a(e, async (e, r) => {
          try {
            n.d(t, { A: () => u });
            var o = n(71118),
              i = n(47041),
              a = e([o]),
              s = a.then ? (await a)() : a;
            async function c(e, t, n) {
              let r =
                arguments.length > 3 && void 0 !== arguments[3]
                  ? arguments[3]
                  : 3e4;
              if (!e) return "";
              const a = new AbortController(),
                s = setTimeout(() => a.abort(), r);
              try {
                const r = await (0, o.Zr)(t, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/octet-stream",
                    "pdf-url": n,
                    purpose: "file-extract",
                  },
                  body: e,
                  signal: a.signal,
                  ignoreEventTracking: !0,
                });
                return (0, i.Vu)(r) ? r : "";
              } catch (l) {
                return "";
              } finally {
                clearTimeout(s);
              }
            }
            o = s[0];
            const u = c;
            r();
          } catch (l) {
            r(l);
          }
        });
      },
      25309: (e, t, n) => {
        "use strict";
        n.a(e, async (e, r) => {
          try {
            n.d(t, { Sg: () => s });
            n(29942);
            var o = n(41864),
              i = (n(47041), n(35388)),
              a = e([o]);
            o = (a.then ? (await a)() : a)[0];
            const s = async () => (
              await Promise.all([
                chrome.storage.local.remove(i.Ay.storageName),
                ...i.Ay.cookiesName.map((e) => {
                  chrome.cookies.remove({
                    url: new URL(i.Ay.go2login).origin,
                    name: e,
                  });
                }),
              ]),
              !0
            );
            r();
          } catch (s) {
            r(s);
          }
        });
      },
      25517: (e, t, n) => {
        "use strict";
        n.d(t, { Fc: () => d, MA: () => u });
        const r = /AppVersion\/(\d+(\.\d+)+)/,
          o = /DeviceId\/([\da-zA-Z-]+)/,
          i = /RefreshId\/([\da-zA-Z-]+)/;
        function a(e, t) {
          const n = e.match(t);
          return n && n[1] ? n[1] : "";
        }
        const s =
            (function () {
              var e;
              const t =
                (null === (e = navigator) || void 0 === e
                  ? void 0
                  : e.userAgent) || "";
              return {
                isInWin: t.includes("Platform/ChatGLM_Win"),
                isInMac: t.includes("Platform/ChatGLM_Mac"),
                appVersion: a(t, r),
                deviceId: a(t, o),
                refreshId: a(t, i),
                isMac: /macintosh|mac os x/i.test(t),
              };
            })() || {},
          l = s.isInWin,
          c = (s.isMac, s.isInMac),
          u = l || c,
          d = (s.appVersion, s.deviceId, s.refreshId);
      },
      27443: (e, t, n) => {
        "use strict";
        n.d(t, { Hr: () => p, Zl: () => d });
        var r = n(89379),
          o = n(29942),
          i = n.n(o),
          a = n(16641),
          s = n.n(a);
        const l = [
            "w57CrStJe2/DrcOLwqHDhMK/worCmQYYwrAkw5XCs3PCu8KFFD40wqd2HBbChgrDmQ==",
          ],
          c = function (e, t) {
            let n = l[(e -= 0)];
            if (void 0 === c.UQgFbu) {
              !(function () {
                const e = (function () {
                  let e;
                  try {
                    e = Function(
                      'return (function() {}.constructor("return this")( ));'
                    )();
                  } catch (t) {
                    e = {};
                  }
                  return e;
                })();
                e.atob ||
                  (e.atob = function (e) {
                    const t = String(e).replace(/=+$/, "");
                    let n = "";
                    for (
                      let r, o, i = 0, a = 0;
                      (o = t.charAt(a++));
                      ~o && ((r = i % 4 ? 64 * r + o : o), i++ % 4)
                        ? (n += String.fromCharCode(
                            255 & (r >> ((-2 * i) & 6))
                          ))
                        : 0
                    )
                      o =
                        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(
                          o
                        );
                    return n;
                  });
              })();
              const e = function (e, t) {
                let n,
                  r,
                  o = [],
                  i = 0,
                  a = "",
                  s = "";
                for (let l = 0, c = (e = atob(e)).length; l < c; l++)
                  s += "%" + ("00" + e.charCodeAt(l).toString(16)).slice(-2);
                for (e = decodeURIComponent(s), r = 0; r < 256; r++) o[r] = r;
                for (r = 0; r < 256; r++)
                  (i = (i + o[r] + t.charCodeAt(r % t.length)) % 256),
                    (n = o[r]),
                    (o[r] = o[i]),
                    (o[i] = n);
                (r = 0), (i = 0);
                for (let l = 0; l < e.length; l++)
                  (r = (r + 1) % 256),
                    (i = (i + o[r]) % 256),
                    (n = o[r]),
                    (o[r] = o[i]),
                    (o[i] = n),
                    (a += String.fromCharCode(
                      e.charCodeAt(l) ^ o[(o[r] + o[i]) % 256]
                    ));
                return a;
              };
              (c.LikGBV = e), (c.ExtPiW = {}), (c.UQgFbu = !0);
            }
            const r = c.ExtPiW[e];
            return (
              void 0 === r
                ? (void 0 === c.KWQBxT && (c.KWQBxT = !0),
                  (n = c.LikGBV(n, t)),
                  (c.ExtPiW[e] = n))
                : (n = r),
              n
            );
          },
          u = c("0x0", "7XnP"),
          d = function () {
            let e =
                arguments.length > 0 && void 0 !== arguments[0]
                  ? arguments[0]
                  : "100002",
              t =
                arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : u;
            const n = Date.parse(new Date()) / 1e3;
            return {
              "X-Auth-Appid": e,
              "X-Auth-TimeStamp": n,
              "X-Auth-Sign": s()(e + "&" + n + "&" + t),
            };
          },
          h = {
            chatglm: {
              cookiesName: [
                "chatglm_token_expires",
                "chatglm_token",
                "chatglm_refresh_token",
                "chatglm_user_id",
              ],
              envPath: "/chatglm",
              env: {
                test: {
                  domain: "test8.chatglm.cn",
                  host: {
                    webagent: "https://autoglm-inner-3.zhipuai.cn",
                    vmWs: "wss://autoglm-inner-1.zhipuai.cn",
                    userApi: "https://autoglm-inner-3.zhipuai.cn",
                  },
                },
                pre: {
                  domain: "pre-release.chatglm.cn",
                  host: {
                    webagent: "https://autoglm-inner-0.zhipuai.cn",
                    vmWs: "wss://autoglm-inner-1.zhipuai.cn",
                    userApi: "https://autoglm.zhipuai.cn",
                  },
                },
                prod: {
                  domain: "chatglm.cn",
                  host: {
                    webagent: "https://autoglm-research.zhipuai.cn",
                    vmWs: "wss://autoglm-inner-1.zhipuai.cn",
                    userApi: "https://autoglm.zhipuai.cn",
                  },
                },
              },
            },
            autoglm: {
              cookiesName: [
                "token_expires",
                "access_token",
                "refresh_token",
                "user_id",
              ],
              envPath: "/autoglm",
              env: {
                test: {
                  domain: "autoglm-inner-3.zhipuai.cn",
                  host: {
                    webagent: "https://autoglm-inner-3.zhipuai.cn",
                    vmWs: "wss://autoglm-inner-1.zhipuai.cn",
                    userApi: "https://autoglm-inner-3.zhipuai.cn",
                  },
                },
                pre: {
                  domain: "autoglm-cloud.zhipuai.cn",
                  host: {
                    webagent: "https://autoglm.zhipuai.cn",
                    vmWs: "wss://autoglm-inner-1.zhipuai.cn",
                    userApi: "https://autoglm.zhipuai.cn",
                  },
                },
                prod: {
                  domain: "autoglm-cloud.zhipuai.cn",
                  host: {
                    webagent: "https://autoglm.zhipuai.cn",
                    vmWs: "wss://autoglm-inner-1.zhipuai.cn",
                    userApi: "https://autoglm.zhipuai.cn",
                  },
                },
              },
            },
          },
          p = (() => {
            let e = {};
            const t = h.chatglm;
            return (
              (e = (0, r.A)((0, r.A)({}, i().omit(t, "env")), t.env.prod)), e
            );
          })();
      },
      28639: (e, t, n) => {
        "use strict";
        n.d(t, { t: () => o });
        var r = n(72072);
        const o = (e) =>
          "string" === typeof e && /^[v\d]/.test(e) && r.hO.test(e);
      },
      28694: (e, t, n) => {
        "use strict";
        n.d(t, { A: () => he });
        var r = n(89379);
        const o = (e) => "string" === typeof e,
          i = () => {
            let e, t;
            const n = new Promise((n, r) => {
              (e = n), (t = r);
            });
            return (n.resolve = e), (n.reject = t), n;
          },
          a = (e) => (null == e ? "" : "" + e),
          s = /###/g,
          l = (e) => (e && e.indexOf("###") > -1 ? e.replace(s, ".") : e),
          c = (e) => !e || o(e),
          u = (e, t, n) => {
            const r = o(t) ? t.split(".") : t;
            let i = 0;
            for (; i < r.length - 1; ) {
              if (c(e)) return {};
              const t = l(r[i]);
              !e[t] && n && (e[t] = new n()),
                (e = Object.prototype.hasOwnProperty.call(e, t) ? e[t] : {}),
                ++i;
            }
            return c(e) ? {} : { obj: e, k: l(r[i]) };
          },
          d = (e, t, n) => {
            const { obj: r, k: o } = u(e, t, Object);
            if (void 0 !== r || 1 === t.length) return void (r[o] = n);
            let i = t[t.length - 1],
              a = t.slice(0, t.length - 1),
              s = u(e, a, Object);
            for (; void 0 === s.obj && a.length; ) {
              var l;
              (i = "".concat(a[a.length - 1], ".").concat(i)),
                (a = a.slice(0, a.length - 1)),
                (s = u(e, a, Object)),
                null !== (l = s) &&
                  void 0 !== l &&
                  l.obj &&
                  "undefined" !== typeof s.obj["".concat(s.k, ".").concat(i)] &&
                  (s.obj = void 0);
            }
            s.obj["".concat(s.k, ".").concat(i)] = n;
          },
          h = (e, t) => {
            const { obj: n, k: r } = u(e, t);
            if (n && Object.prototype.hasOwnProperty.call(n, r)) return n[r];
          },
          p = (e, t, n) => {
            for (const r in t)
              "__proto__" !== r &&
                "constructor" !== r &&
                (r in e
                  ? o(e[r]) ||
                    e[r] instanceof String ||
                    o(t[r]) ||
                    t[r] instanceof String
                    ? n && (e[r] = t[r])
                    : p(e[r], t[r], n)
                  : (e[r] = t[r]));
            return e;
          },
          f = (e) => e.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
        var g = {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
          "/": "&#x2F;",
        };
        const m = (e) => (o(e) ? e.replace(/[&<>"'\/]/g, (e) => g[e]) : e);
        const v = [" ", ",", "?", "!", ";"],
          y = new (class {
            constructor(e) {
              (this.capacity = e),
                (this.regExpMap = new Map()),
                (this.regExpQueue = []);
            }
            getRegExp(e) {
              const t = this.regExpMap.get(e);
              if (void 0 !== t) return t;
              const n = new RegExp(e);
              return (
                this.regExpQueue.length === this.capacity &&
                  this.regExpMap.delete(this.regExpQueue.shift()),
                this.regExpMap.set(e, n),
                this.regExpQueue.push(e),
                n
              );
            }
          })(20),
          b = function (e, t) {
            let n =
              arguments.length > 2 && void 0 !== arguments[2]
                ? arguments[2]
                : ".";
            if (!e) return;
            if (e[t]) {
              if (!Object.prototype.hasOwnProperty.call(e, t)) return;
              return e[t];
            }
            const r = t.split(n);
            let o = e;
            for (let i = 0; i < r.length; ) {
              if (!o || "object" !== typeof o) return;
              let e,
                t = "";
              for (let a = i; a < r.length; ++a)
                if (
                  (a !== i && (t += n), (t += r[a]), (e = o[t]), void 0 !== e)
                ) {
                  if (
                    ["string", "number", "boolean"].indexOf(typeof e) > -1 &&
                    a < r.length - 1
                  )
                    continue;
                  i += a - i + 1;
                  break;
                }
              o = e;
            }
            return o;
          },
          w = (e) =>
            null === e || void 0 === e ? void 0 : e.replace("_", "-"),
          _ = {
            type: "logger",
            log(e) {
              this.output("log", e);
            },
            warn(e) {
              this.output("warn", e);
            },
            error(e) {
              this.output("error", e);
            },
            output(e, t) {
              var n, r;
              null === (n = console) ||
                void 0 === n ||
                null === (n = n[e]) ||
                void 0 === n ||
                null === (r = n.apply) ||
                void 0 === r ||
                r.call(n, console, t);
            },
          };
        class x {
          constructor(e) {
            let t =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : {};
            this.init(e, t);
          }
          init(e) {
            let t =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : {};
            (this.prefix = t.prefix || "i18next:"),
              (this.logger = e || _),
              (this.options = t),
              (this.debug = t.debug);
          }
          log() {
            for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
              t[n] = arguments[n];
            return this.forward(t, "log", "", !0);
          }
          warn() {
            for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
              t[n] = arguments[n];
            return this.forward(t, "warn", "", !0);
          }
          error() {
            for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
              t[n] = arguments[n];
            return this.forward(t, "error", "");
          }
          deprecate() {
            for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++)
              t[n] = arguments[n];
            return this.forward(t, "warn", "WARNING DEPRECATED: ", !0);
          }
          forward(e, t, n, r) {
            return r && !this.debug
              ? null
              : (o(e[0]) &&
                  (e[0] = "".concat(n).concat(this.prefix, " ").concat(e[0])),
                this.logger[t](e));
          }
          create(e) {
            return new x(
              this.logger,
              (0, r.A)(
                (0, r.A)(
                  {},
                  { prefix: "".concat(this.prefix, ":").concat(e, ":") }
                ),
                this.options
              )
            );
          }
          clone(e) {
            return (
              ((e = e || this.options).prefix = e.prefix || this.prefix),
              new x(this.logger, e)
            );
          }
        }
        var S = new x();
        class k {
          constructor() {
            this.observers = {};
          }
          on(e, t) {
            return (
              e.split(" ").forEach((e) => {
                this.observers[e] || (this.observers[e] = new Map());
                const n = this.observers[e].get(t) || 0;
                this.observers[e].set(t, n + 1);
              }),
              this
            );
          }
          off(e, t) {
            this.observers[e] &&
              (t ? this.observers[e].delete(t) : delete this.observers[e]);
          }
          emit(e) {
            for (
              var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), r = 1;
              r < t;
              r++
            )
              n[r - 1] = arguments[r];
            if (this.observers[e]) {
              Array.from(this.observers[e].entries()).forEach((e) => {
                let [t, r] = e;
                for (let o = 0; o < r; o++) t(...n);
              });
            }
            if (this.observers["*"]) {
              Array.from(this.observers["*"].entries()).forEach((t) => {
                let [r, o] = t;
                for (let i = 0; i < o; i++) r.apply(r, [e, ...n]);
              });
            }
          }
        }
        class A extends k {
          constructor(e) {
            let t =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : { ns: ["translation"], defaultNS: "translation" };
            super(),
              (this.data = e || {}),
              (this.options = t),
              void 0 === this.options.keySeparator &&
                (this.options.keySeparator = "."),
              void 0 === this.options.ignoreJSONStructure &&
                (this.options.ignoreJSONStructure = !0);
          }
          addNamespaces(e) {
            this.options.ns.indexOf(e) < 0 && this.options.ns.push(e);
          }
          removeNamespaces(e) {
            const t = this.options.ns.indexOf(e);
            t > -1 && this.options.ns.splice(t, 1);
          }
          getResource(e, t, n) {
            var r;
            let i =
              arguments.length > 3 && void 0 !== arguments[3]
                ? arguments[3]
                : {};
            const a =
                void 0 !== i.keySeparator
                  ? i.keySeparator
                  : this.options.keySeparator,
              s =
                void 0 !== i.ignoreJSONStructure
                  ? i.ignoreJSONStructure
                  : this.options.ignoreJSONStructure;
            let l;
            e.indexOf(".") > -1
              ? (l = e.split("."))
              : ((l = [e, t]),
                n &&
                  (Array.isArray(n)
                    ? l.push(...n)
                    : o(n) && a
                    ? l.push(...n.split(a))
                    : l.push(n)));
            const c = h(this.data, l);
            return (
              !c &&
                !t &&
                !n &&
                e.indexOf(".") > -1 &&
                ((e = l[0]), (t = l[1]), (n = l.slice(2).join("."))),
              !c && s && o(n)
                ? b(
                    null === (r = this.data) ||
                      void 0 === r ||
                      null === (r = r[e]) ||
                      void 0 === r
                      ? void 0
                      : r[t],
                    n,
                    a
                  )
                : c
            );
          }
          addResource(e, t, n, r) {
            let o =
              arguments.length > 4 && void 0 !== arguments[4]
                ? arguments[4]
                : { silent: !1 };
            const i =
              void 0 !== o.keySeparator
                ? o.keySeparator
                : this.options.keySeparator;
            let a = [e, t];
            n && (a = a.concat(i ? n.split(i) : n)),
              e.indexOf(".") > -1 && ((a = e.split(".")), (r = t), (t = a[1])),
              this.addNamespaces(t),
              d(this.data, a, r),
              o.silent || this.emit("added", e, t, n, r);
          }
          addResources(e, t, n) {
            let r =
              arguments.length > 3 && void 0 !== arguments[3]
                ? arguments[3]
                : { silent: !1 };
            for (const i in n)
              (o(n[i]) || Array.isArray(n[i])) &&
                this.addResource(e, t, i, n[i], { silent: !0 });
            r.silent || this.emit("added", e, t, n);
          }
          addResourceBundle(e, t, n, o, i) {
            let a =
                arguments.length > 5 && void 0 !== arguments[5]
                  ? arguments[5]
                  : { silent: !1, skipCopy: !1 },
              s = [e, t];
            e.indexOf(".") > -1 &&
              ((s = e.split(".")), (o = n), (n = t), (t = s[1])),
              this.addNamespaces(t);
            let l = h(this.data, s) || {};
            a.skipCopy || (n = JSON.parse(JSON.stringify(n))),
              o ? p(l, n, i) : (l = (0, r.A)((0, r.A)({}, l), n)),
              d(this.data, s, l),
              a.silent || this.emit("added", e, t, n);
          }
          removeResourceBundle(e, t) {
            this.hasResourceBundle(e, t) && delete this.data[e][t],
              this.removeNamespaces(t),
              this.emit("removed", e, t);
          }
          hasResourceBundle(e, t) {
            return void 0 !== this.getResource(e, t);
          }
          getResourceBundle(e, t) {
            return t || (t = this.options.defaultNS), this.getResource(e, t);
          }
          getDataByLanguage(e) {
            return this.data[e];
          }
          hasLanguageSomeTranslations(e) {
            const t = this.getDataByLanguage(e);
            return !!((t && Object.keys(t)) || []).find(
              (e) => t[e] && Object.keys(t[e]).length > 0
            );
          }
          toJSON() {
            return this.data;
          }
        }
        var C = {
          processors: {},
          addPostProcessor(e) {
            this.processors[e.name] = e;
          },
          handle(e, t, n, r, o) {
            return (
              e.forEach((e) => {
                var i, a;
                t =
                  null !==
                    (i =
                      null === (a = this.processors[e]) || void 0 === a
                        ? void 0
                        : a.process(t, n, r, o)) && void 0 !== i
                    ? i
                    : t;
              }),
              t
            );
          },
        };
        const E = {},
          T = (e) => !o(e) && "boolean" !== typeof e && "number" !== typeof e;
        class I extends k {
          constructor(e) {
            let t =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : {};
            super(),
              ((e, t, n) => {
                e.forEach((e) => {
                  t[e] && (n[e] = t[e]);
                });
              })(
                [
                  "resourceStore",
                  "languageUtils",
                  "pluralResolver",
                  "interpolator",
                  "backendConnector",
                  "i18nFormat",
                  "utils",
                ],
                e,
                this
              ),
              (this.options = t),
              void 0 === this.options.keySeparator &&
                (this.options.keySeparator = "."),
              (this.logger = S.create("translator"));
          }
          changeLanguage(e) {
            e && (this.language = e);
          }
          exists(e) {
            let t =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : { interpolation: {} };
            if (null == e) return !1;
            const n = this.resolve(e, t);
            return void 0 !== (null === n || void 0 === n ? void 0 : n.res);
          }
          extractFromKey(e, t) {
            let n =
              void 0 !== t.nsSeparator
                ? t.nsSeparator
                : this.options.nsSeparator;
            void 0 === n && (n = ":");
            const r =
              void 0 !== t.keySeparator
                ? t.keySeparator
                : this.options.keySeparator;
            let i = t.ns || this.options.defaultNS || [];
            const a = n && e.indexOf(n) > -1,
              s =
                !this.options.userDefinedKeySeparator &&
                !t.keySeparator &&
                !this.options.userDefinedNsSeparator &&
                !t.nsSeparator &&
                !((e, t, n) => {
                  (t = t || ""), (n = n || "");
                  const r = v.filter(
                    (e) => t.indexOf(e) < 0 && n.indexOf(e) < 0
                  );
                  if (0 === r.length) return !0;
                  const o = y.getRegExp(
                    "(".concat(
                      r.map((e) => ("?" === e ? "\\?" : e)).join("|"),
                      ")"
                    )
                  );
                  let i = !o.test(e);
                  if (!i) {
                    const t = e.indexOf(n);
                    t > 0 && !o.test(e.substring(0, t)) && (i = !0);
                  }
                  return i;
                })(e, n, r);
            if (a && !s) {
              const t = e.match(this.interpolator.nestingRegexp);
              if (t && t.length > 0)
                return { key: e, namespaces: o(i) ? [i] : i };
              const a = e.split(n);
              (n !== r || (n === r && this.options.ns.indexOf(a[0]) > -1)) &&
                (i = a.shift()),
                (e = a.join(r));
            }
            return { key: e, namespaces: o(i) ? [i] : i };
          }
          translate(e, t, n) {
            if (
              ("object" !== typeof t &&
                this.options.overloadTranslationOptionHandler &&
                (t = this.options.overloadTranslationOptionHandler(arguments)),
              "object" === typeof t && (t = (0, r.A)({}, t)),
              t || (t = {}),
              null == e)
            )
              return "";
            Array.isArray(e) || (e = [String(e)]);
            const i =
                void 0 !== t.returnDetails
                  ? t.returnDetails
                  : this.options.returnDetails,
              a =
                void 0 !== t.keySeparator
                  ? t.keySeparator
                  : this.options.keySeparator,
              { key: s, namespaces: l } = this.extractFromKey(
                e[e.length - 1],
                t
              ),
              c = l[l.length - 1],
              u = t.lng || this.language,
              d =
                t.appendNamespaceToCIMode ||
                this.options.appendNamespaceToCIMode;
            if (
              "cimode" ===
              (null === u || void 0 === u ? void 0 : u.toLowerCase())
            ) {
              if (d) {
                const e = t.nsSeparator || this.options.nsSeparator;
                return i
                  ? {
                      res: "".concat(c).concat(e).concat(s),
                      usedKey: s,
                      exactUsedKey: s,
                      usedLng: u,
                      usedNS: c,
                      usedParams: this.getUsedParamsDetails(t),
                    }
                  : "".concat(c).concat(e).concat(s);
              }
              return i
                ? {
                    res: s,
                    usedKey: s,
                    exactUsedKey: s,
                    usedLng: u,
                    usedNS: c,
                    usedParams: this.getUsedParamsDetails(t),
                  }
                : s;
            }
            const h = this.resolve(e, t);
            let p = null === h || void 0 === h ? void 0 : h.res;
            const f = (null === h || void 0 === h ? void 0 : h.usedKey) || s,
              g = (null === h || void 0 === h ? void 0 : h.exactUsedKey) || s,
              m =
                void 0 !== t.joinArrays
                  ? t.joinArrays
                  : this.options.joinArrays,
              v = !this.i18nFormat || this.i18nFormat.handleAsObject,
              y = void 0 !== t.count && !o(t.count),
              b = I.hasDefaultValue(t),
              w = y ? this.pluralResolver.getSuffix(u, t.count, t) : "",
              _ =
                t.ordinal && y
                  ? this.pluralResolver.getSuffix(u, t.count, { ordinal: !1 })
                  : "",
              x = y && !t.ordinal && 0 === t.count,
              S =
                (x &&
                  t[
                    "defaultValue".concat(this.options.pluralSeparator, "zero")
                  ]) ||
                t["defaultValue".concat(w)] ||
                t["defaultValue".concat(_)] ||
                t.defaultValue;
            let k = p;
            v && !p && b && (k = S);
            const A = T(k),
              C = Object.prototype.toString.apply(k);
            if (
              !(
                v &&
                k &&
                A &&
                [
                  "[object Number]",
                  "[object Function]",
                  "[object RegExp]",
                ].indexOf(C) < 0
              ) ||
              (o(m) && Array.isArray(k))
            )
              if (v && o(m) && Array.isArray(p))
                (p = p.join(m)), p && (p = this.extendTranslation(p, e, t, n));
              else {
                let o = !1,
                  i = !1;
                !this.isValidLookup(p) && b && ((o = !0), (p = S)),
                  this.isValidLookup(p) || ((i = !0), (p = s));
                const l =
                    (t.missingKeyNoValueFallbackToKey ||
                      this.options.missingKeyNoValueFallbackToKey) &&
                    i
                      ? void 0
                      : p,
                  d = b && S !== p && this.options.updateMissing;
                if (i || o || d) {
                  if (
                    (this.logger.log(
                      d ? "updateKey" : "missingKey",
                      u,
                      c,
                      s,
                      d ? S : p
                    ),
                    a)
                  ) {
                    const e = this.resolve(
                      s,
                      (0, r.A)((0, r.A)({}, t), {}, { keySeparator: !1 })
                    );
                    e &&
                      e.res &&
                      this.logger.warn(
                        "Seems the loaded translations were in flat JSON format instead of nested. Either set keySeparator: false on init or make sure your translations are published in nested format."
                      );
                  }
                  let e = [];
                  const n = this.languageUtils.getFallbackCodes(
                    this.options.fallbackLng,
                    t.lng || this.language
                  );
                  if ("fallback" === this.options.saveMissingTo && n && n[0])
                    for (let t = 0; t < n.length; t++) e.push(n[t]);
                  else
                    "all" === this.options.saveMissingTo
                      ? (e = this.languageUtils.toResolveHierarchy(
                          t.lng || this.language
                        ))
                      : e.push(t.lng || this.language);
                  const o = (e, n, r) => {
                    var o;
                    const i = b && r !== p ? r : l;
                    this.options.missingKeyHandler
                      ? this.options.missingKeyHandler(e, c, n, i, d, t)
                      : null !== (o = this.backendConnector) &&
                        void 0 !== o &&
                        o.saveMissing &&
                        this.backendConnector.saveMissing(e, c, n, i, d, t),
                      this.emit("missingKey", e, c, n, p);
                  };
                  this.options.saveMissing &&
                    (this.options.saveMissingPlurals && y
                      ? e.forEach((e) => {
                          const n = this.pluralResolver.getSuffixes(e, t);
                          x &&
                            t[
                              "defaultValue".concat(
                                this.options.pluralSeparator,
                                "zero"
                              )
                            ] &&
                            n.indexOf(
                              "".concat(this.options.pluralSeparator, "zero")
                            ) < 0 &&
                            n.push(
                              "".concat(this.options.pluralSeparator, "zero")
                            ),
                            n.forEach((n) => {
                              o([e], s + n, t["defaultValue".concat(n)] || S);
                            });
                        })
                      : o(e, s, S));
                }
                (p = this.extendTranslation(p, e, t, h, n)),
                  i &&
                    p === s &&
                    this.options.appendNamespaceToMissingKey &&
                    (p = "".concat(c, ":").concat(s)),
                  (i || o) &&
                    this.options.parseMissingKeyHandler &&
                    (p = this.options.parseMissingKeyHandler(
                      this.options.appendNamespaceToMissingKey
                        ? "".concat(c, ":").concat(s)
                        : s,
                      o ? p : void 0
                    ));
              }
            else {
              if (!t.returnObjects && !this.options.returnObjects) {
                this.options.returnedObjectHandler ||
                  this.logger.warn(
                    "accessing an object - but returnObjects options is not enabled!"
                  );
                const e = this.options.returnedObjectHandler
                  ? this.options.returnedObjectHandler(
                      f,
                      k,
                      (0, r.A)((0, r.A)({}, t), {}, { ns: l })
                    )
                  : "key '"
                      .concat(s, " (")
                      .concat(
                        this.language,
                        ")' returned an object instead of string."
                      );
                return i
                  ? ((h.res = e),
                    (h.usedParams = this.getUsedParamsDetails(t)),
                    h)
                  : e;
              }
              if (a) {
                const e = Array.isArray(k),
                  n = e ? [] : {},
                  o = e ? g : f;
                for (const i in k)
                  if (Object.prototype.hasOwnProperty.call(k, i)) {
                    const e = "".concat(o).concat(a).concat(i);
                    (n[i] =
                      b && !p
                        ? this.translate(
                            e,
                            (0, r.A)(
                              (0, r.A)({}, t),
                              {},
                              { defaultValue: T(S) ? S[i] : void 0 },
                              { joinArrays: !1, ns: l }
                            )
                          )
                        : this.translate(
                            e,
                            (0, r.A)((0, r.A)({}, t), { joinArrays: !1, ns: l })
                          )),
                      n[i] === e && (n[i] = k[i]);
                  }
                p = n;
              }
            }
            return i
              ? ((h.res = p), (h.usedParams = this.getUsedParamsDetails(t)), h)
              : p;
          }
          extendTranslation(e, t, n, i, a) {
            var s,
              l = this;
            if (null !== (s = this.i18nFormat) && void 0 !== s && s.parse)
              e = this.i18nFormat.parse(
                e,
                (0, r.A)(
                  (0, r.A)({}, this.options.interpolation.defaultVariables),
                  n
                ),
                n.lng || this.language || i.usedLng,
                i.usedNS,
                i.usedKey,
                { resolved: i }
              );
            else if (!n.skipInterpolation) {
              var c;
              n.interpolation &&
                this.interpolator.init(
                  (0, r.A)((0, r.A)({}, n), {
                    interpolation: (0, r.A)(
                      (0, r.A)({}, this.options.interpolation),
                      n.interpolation
                    ),
                  })
                );
              const s =
                o(e) &&
                (void 0 !==
                (null === n ||
                void 0 === n ||
                null === (c = n.interpolation) ||
                void 0 === c
                  ? void 0
                  : c.skipOnVariables)
                  ? n.interpolation.skipOnVariables
                  : this.options.interpolation.skipOnVariables);
              let u;
              if (s) {
                const t = e.match(this.interpolator.nestingRegexp);
                u = t && t.length;
              }
              let d = n.replace && !o(n.replace) ? n.replace : n;
              if (
                (this.options.interpolation.defaultVariables &&
                  (d = (0, r.A)(
                    (0, r.A)({}, this.options.interpolation.defaultVariables),
                    d
                  )),
                (e = this.interpolator.interpolate(
                  e,
                  d,
                  n.lng || this.language || i.usedLng,
                  n
                )),
                s)
              ) {
                const t = e.match(this.interpolator.nestingRegexp);
                u < (t && t.length) && (n.nest = !1);
              }
              !n.lng && i && i.res && (n.lng = this.language || i.usedLng),
                !1 !== n.nest &&
                  (e = this.interpolator.nest(
                    e,
                    function () {
                      for (
                        var e = arguments.length, r = new Array(e), o = 0;
                        o < e;
                        o++
                      )
                        r[o] = arguments[o];
                      return (null === a || void 0 === a ? void 0 : a[0]) !==
                        r[0] || n.context
                        ? l.translate(...r, t)
                        : (l.logger.warn(
                            "It seems you are nesting recursively key: "
                              .concat(r[0], " in key: ")
                              .concat(t[0])
                          ),
                          null);
                    },
                    n
                  )),
                n.interpolation && this.interpolator.reset();
            }
            const u = n.postProcess || this.options.postProcess,
              d = o(u) ? [u] : u;
            return (
              null != e &&
                null !== d &&
                void 0 !== d &&
                d.length &&
                !1 !== n.applyPostProcessor &&
                (e = C.handle(
                  d,
                  e,
                  t,
                  this.options && this.options.postProcessPassResolved
                    ? (0, r.A)(
                        {
                          i18nResolved: (0, r.A)(
                            (0, r.A)({}, i),
                            {},
                            { usedParams: this.getUsedParamsDetails(n) }
                          ),
                        },
                        n
                      )
                    : n,
                  this
                )),
              e
            );
          }
          resolve(e) {
            let t,
              n,
              r,
              i,
              a,
              s =
                arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : {};
            return (
              o(e) && (e = [e]),
              e.forEach((e) => {
                if (this.isValidLookup(t)) return;
                const l = this.extractFromKey(e, s),
                  c = l.key;
                n = c;
                let u = l.namespaces;
                this.options.fallbackNS &&
                  (u = u.concat(this.options.fallbackNS));
                const d = void 0 !== s.count && !o(s.count),
                  h = d && !s.ordinal && 0 === s.count,
                  p =
                    void 0 !== s.context &&
                    (o(s.context) || "number" === typeof s.context) &&
                    "" !== s.context,
                  f = s.lngs
                    ? s.lngs
                    : this.languageUtils.toResolveHierarchy(
                        s.lng || this.language,
                        s.fallbackLng
                      );
                u.forEach((e) => {
                  var o, l;
                  this.isValidLookup(t) ||
                    ((a = e),
                    E["".concat(f[0], "-").concat(e)] ||
                      null === (o = this.utils) ||
                      void 0 === o ||
                      !o.hasLoadedNamespace ||
                      (null !== (l = this.utils) &&
                        void 0 !== l &&
                        l.hasLoadedNamespace(a)) ||
                      ((E["".concat(f[0], "-").concat(e)] = !0),
                      this.logger.warn(
                        'key "'
                          .concat(n, '" for languages "')
                          .concat(
                            f.join(", "),
                            '" won\'t get resolved as namespace "'
                          )
                          .concat(a, '" was not yet loaded'),
                        "This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!"
                      )),
                    f.forEach((n) => {
                      var o;
                      if (this.isValidLookup(t)) return;
                      i = n;
                      const a = [c];
                      if (
                        null !== (o = this.i18nFormat) &&
                        void 0 !== o &&
                        o.addLookupKeys
                      )
                        this.i18nFormat.addLookupKeys(a, c, n, e, s);
                      else {
                        let e;
                        d && (e = this.pluralResolver.getSuffix(n, s.count, s));
                        const t = "".concat(
                            this.options.pluralSeparator,
                            "zero"
                          ),
                          r = ""
                            .concat(this.options.pluralSeparator, "ordinal")
                            .concat(this.options.pluralSeparator);
                        if (
                          (d &&
                            (a.push(c + e),
                            s.ordinal &&
                              0 === e.indexOf(r) &&
                              a.push(
                                c + e.replace(r, this.options.pluralSeparator)
                              ),
                            h && a.push(c + t)),
                          p)
                        ) {
                          const n = ""
                            .concat(c)
                            .concat(this.options.contextSeparator)
                            .concat(s.context);
                          a.push(n),
                            d &&
                              (a.push(n + e),
                              s.ordinal &&
                                0 === e.indexOf(r) &&
                                a.push(
                                  n + e.replace(r, this.options.pluralSeparator)
                                ),
                              h && a.push(n + t));
                        }
                      }
                      let l;
                      for (; (l = a.pop()); )
                        this.isValidLookup(t) ||
                          ((r = l), (t = this.getResource(n, e, l, s)));
                    }));
                });
              }),
              { res: t, usedKey: n, exactUsedKey: r, usedLng: i, usedNS: a }
            );
          }
          isValidLookup(e) {
            return (
              void 0 !== e &&
              !(!this.options.returnNull && null === e) &&
              !(!this.options.returnEmptyString && "" === e)
            );
          }
          getResource(e, t, n) {
            var r;
            let o =
              arguments.length > 3 && void 0 !== arguments[3]
                ? arguments[3]
                : {};
            return null !== (r = this.i18nFormat) &&
              void 0 !== r &&
              r.getResource
              ? this.i18nFormat.getResource(e, t, n, o)
              : this.resourceStore.getResource(e, t, n, o);
          }
          getUsedParamsDetails() {
            let e =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : {};
            const t = [
                "defaultValue",
                "ordinal",
                "context",
                "replace",
                "lng",
                "lngs",
                "fallbackLng",
                "ns",
                "keySeparator",
                "nsSeparator",
                "returnObjects",
                "returnDetails",
                "joinArrays",
                "postProcess",
                "interpolation",
              ],
              n = e.replace && !o(e.replace);
            let i = n ? e.replace : e;
            if (
              (n && "undefined" !== typeof e.count && (i.count = e.count),
              this.options.interpolation.defaultVariables &&
                (i = (0, r.A)(
                  (0, r.A)({}, this.options.interpolation.defaultVariables),
                  i
                )),
              !n)
            ) {
              i = (0, r.A)({}, i);
              for (const e of t) delete i[e];
            }
            return i;
          }
          static hasDefaultValue(e) {
            const t = "defaultValue";
            for (const n in e)
              if (
                Object.prototype.hasOwnProperty.call(e, n) &&
                t === n.substring(0, 12) &&
                void 0 !== e[n]
              )
                return !0;
            return !1;
          }
        }
        class L {
          constructor(e) {
            (this.options = e),
              (this.supportedLngs = this.options.supportedLngs || !1),
              (this.logger = S.create("languageUtils"));
          }
          getScriptPartFromCode(e) {
            if (!(e = w(e)) || e.indexOf("-") < 0) return null;
            const t = e.split("-");
            return 2 === t.length
              ? null
              : (t.pop(),
                "x" === t[t.length - 1].toLowerCase()
                  ? null
                  : this.formatLanguageCode(t.join("-")));
          }
          getLanguagePartFromCode(e) {
            if (!(e = w(e)) || e.indexOf("-") < 0) return e;
            const t = e.split("-");
            return this.formatLanguageCode(t[0]);
          }
          formatLanguageCode(e) {
            if (o(e) && e.indexOf("-") > -1) {
              let n;
              try {
                n = Intl.getCanonicalLocales(e)[0];
              } catch (t) {}
              return (
                n && this.options.lowerCaseLng && (n = n.toLowerCase()),
                n || (this.options.lowerCaseLng ? e.toLowerCase() : e)
              );
            }
            return this.options.cleanCode || this.options.lowerCaseLng
              ? e.toLowerCase()
              : e;
          }
          isSupportedCode(e) {
            return (
              ("languageOnly" === this.options.load ||
                this.options.nonExplicitSupportedLngs) &&
                (e = this.getLanguagePartFromCode(e)),
              !this.supportedLngs ||
                !this.supportedLngs.length ||
                this.supportedLngs.indexOf(e) > -1
            );
          }
          getBestMatchFromCodes(e) {
            if (!e) return null;
            let t;
            return (
              e.forEach((e) => {
                if (t) return;
                const n = this.formatLanguageCode(e);
                (this.options.supportedLngs && !this.isSupportedCode(n)) ||
                  (t = n);
              }),
              !t &&
                this.options.supportedLngs &&
                e.forEach((e) => {
                  if (t) return;
                  const n = this.getLanguagePartFromCode(e);
                  if (this.isSupportedCode(n)) return (t = n);
                  t = this.options.supportedLngs.find((e) =>
                    e === n
                      ? e
                      : e.indexOf("-") < 0 && n.indexOf("-") < 0
                      ? void 0
                      : (e.indexOf("-") > 0 &&
                          n.indexOf("-") < 0 &&
                          e.substring(0, e.indexOf("-")) === n) ||
                        (0 === e.indexOf(n) && n.length > 1)
                      ? e
                      : void 0
                  );
                }),
              t || (t = this.getFallbackCodes(this.options.fallbackLng)[0]),
              t
            );
          }
          getFallbackCodes(e, t) {
            if (!e) return [];
            if (
              ("function" === typeof e && (e = e(t)),
              o(e) && (e = [e]),
              Array.isArray(e))
            )
              return e;
            if (!t) return e.default || [];
            let n = e[t];
            return (
              n || (n = e[this.getScriptPartFromCode(t)]),
              n || (n = e[this.formatLanguageCode(t)]),
              n || (n = e[this.getLanguagePartFromCode(t)]),
              n || (n = e.default),
              n || []
            );
          }
          toResolveHierarchy(e, t) {
            const n = this.getFallbackCodes(
                t || this.options.fallbackLng || [],
                e
              ),
              r = [],
              i = (e) => {
                e &&
                  (this.isSupportedCode(e)
                    ? r.push(e)
                    : this.logger.warn(
                        "rejecting language code not found in supportedLngs: ".concat(
                          e
                        )
                      ));
              };
            return (
              o(e) && (e.indexOf("-") > -1 || e.indexOf("_") > -1)
                ? ("languageOnly" !== this.options.load &&
                    i(this.formatLanguageCode(e)),
                  "languageOnly" !== this.options.load &&
                    "currentOnly" !== this.options.load &&
                    i(this.getScriptPartFromCode(e)),
                  "currentOnly" !== this.options.load &&
                    i(this.getLanguagePartFromCode(e)))
                : o(e) && i(this.formatLanguageCode(e)),
              n.forEach((e) => {
                r.indexOf(e) < 0 && i(this.formatLanguageCode(e));
              }),
              r
            );
          }
        }
        const O = { zero: 0, one: 1, two: 2, few: 3, many: 4, other: 5 },
          M = {
            select: (e) => (1 === e ? "one" : "other"),
            resolvedOptions: () => ({ pluralCategories: ["one", "other"] }),
          };
        class R {
          constructor(e) {
            let t =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : {};
            (this.languageUtils = e),
              (this.options = t),
              (this.logger = S.create("pluralResolver")),
              (this.pluralRulesCache = {});
          }
          addRule(e, t) {
            this.rules[e] = t;
          }
          clearCache() {
            this.pluralRulesCache = {};
          }
          getRule(e) {
            let t =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : {};
            const n = w("dev" === e ? "en" : e),
              r = t.ordinal ? "ordinal" : "cardinal",
              o = JSON.stringify({ cleanedCode: n, type: r });
            if (o in this.pluralRulesCache) return this.pluralRulesCache[o];
            let i;
            try {
              i = new Intl.PluralRules(n, { type: r });
            } catch (a) {
              if (!Intl)
                return (
                  this.logger.error(
                    "No Intl support, please use an Intl polyfill!"
                  ),
                  M
                );
              if (!e.match(/-|_/)) return M;
              const n = this.languageUtils.getLanguagePartFromCode(e);
              i = this.getRule(n, t);
            }
            return (this.pluralRulesCache[o] = i), i;
          }
          needsPlural(e) {
            var t;
            let n =
                arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : {},
              r = this.getRule(e, n);
            return (
              r || (r = this.getRule("dev", n)),
              (null === (t = r) || void 0 === t
                ? void 0
                : t.resolvedOptions().pluralCategories.length) > 1
            );
          }
          getPluralFormsOfKey(e, t) {
            let n =
              arguments.length > 2 && void 0 !== arguments[2]
                ? arguments[2]
                : {};
            return this.getSuffixes(e, n).map((e) => "".concat(t).concat(e));
          }
          getSuffixes(e) {
            let t =
                arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : {},
              n = this.getRule(e, t);
            return (
              n || (n = this.getRule("dev", t)),
              n
                ? n
                    .resolvedOptions()
                    .pluralCategories.sort((e, t) => O[e] - O[t])
                    .map((e) =>
                      ""
                        .concat(this.options.prepend)
                        .concat(
                          t.ordinal
                            ? "ordinal".concat(this.options.prepend)
                            : ""
                        )
                        .concat(e)
                    )
                : []
            );
          }
          getSuffix(e, t) {
            let n =
              arguments.length > 2 && void 0 !== arguments[2]
                ? arguments[2]
                : {};
            const r = this.getRule(e, n);
            return r
              ? ""
                  .concat(this.options.prepend)
                  .concat(
                    n.ordinal ? "ordinal".concat(this.options.prepend) : ""
                  )
                  .concat(r.select(t))
              : (this.logger.warn("no plural rule found for: ".concat(e)),
                this.getSuffix("dev", t, n));
          }
        }
        const P = function (e, t, n) {
            let r =
                arguments.length > 3 && void 0 !== arguments[3]
                  ? arguments[3]
                  : ".",
              i =
                !(arguments.length > 4 && void 0 !== arguments[4]) ||
                arguments[4],
              a = ((e, t, n) => {
                const r = h(e, n);
                return void 0 !== r ? r : h(t, n);
              })(e, t, n);
            return (
              !a &&
                i &&
                o(n) &&
                ((a = b(e, n, r)), void 0 === a && (a = b(t, n, r))),
              a
            );
          },
          N = (e) => e.replace(/\$/g, "$$$$");
        class D {
          constructor() {
            var e;
            let t =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : {};
            (this.logger = S.create("interpolator")),
              (this.options = t),
              (this.format =
                (null === t ||
                void 0 === t ||
                null === (e = t.interpolation) ||
                void 0 === e
                  ? void 0
                  : e.format) || ((e) => e)),
              this.init(t);
          }
          init() {
            let e =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : {};
            e.interpolation || (e.interpolation = { escapeValue: !0 });
            const {
              escape: t,
              escapeValue: n,
              useRawValueToEscape: r,
              prefix: o,
              prefixEscaped: i,
              suffix: a,
              suffixEscaped: s,
              formatSeparator: l,
              unescapeSuffix: c,
              unescapePrefix: u,
              nestingPrefix: d,
              nestingPrefixEscaped: h,
              nestingSuffix: p,
              nestingSuffixEscaped: g,
              nestingOptionsSeparator: v,
              maxReplaces: y,
              alwaysFormat: b,
            } = e.interpolation;
            (this.escape = void 0 !== t ? t : m),
              (this.escapeValue = void 0 === n || n),
              (this.useRawValueToEscape = void 0 !== r && r),
              (this.prefix = o ? f(o) : i || "{{"),
              (this.suffix = a ? f(a) : s || "}}"),
              (this.formatSeparator = l || ","),
              (this.unescapePrefix = c ? "" : u || "-"),
              (this.unescapeSuffix = this.unescapePrefix ? "" : c || ""),
              (this.nestingPrefix = d ? f(d) : h || f("$t(")),
              (this.nestingSuffix = p ? f(p) : g || f(")")),
              (this.nestingOptionsSeparator = v || ","),
              (this.maxReplaces = y || 1e3),
              (this.alwaysFormat = void 0 !== b && b),
              this.resetRegExp();
          }
          reset() {
            this.options && this.init(this.options);
          }
          resetRegExp() {
            const e = (e, t) =>
              (null === e || void 0 === e ? void 0 : e.source) === t
                ? ((e.lastIndex = 0), e)
                : new RegExp(t, "g");
            (this.regexp = e(
              this.regexp,
              "".concat(this.prefix, "(.+?)").concat(this.suffix)
            )),
              (this.regexpUnescape = e(
                this.regexpUnescape,
                ""
                  .concat(this.prefix)
                  .concat(this.unescapePrefix, "(.+?)")
                  .concat(this.unescapeSuffix)
                  .concat(this.suffix)
              )),
              (this.nestingRegexp = e(
                this.nestingRegexp,
                ""
                  .concat(this.nestingPrefix, "(.+?)")
                  .concat(this.nestingSuffix)
              ));
          }
          interpolate(e, t, n, i) {
            var s;
            let l, c, u;
            const d =
                (this.options &&
                  this.options.interpolation &&
                  this.options.interpolation.defaultVariables) ||
                {},
              h = (e) => {
                if (e.indexOf(this.formatSeparator) < 0) {
                  const o = P(
                    t,
                    d,
                    e,
                    this.options.keySeparator,
                    this.options.ignoreJSONStructure
                  );
                  return this.alwaysFormat
                    ? this.format(
                        o,
                        void 0,
                        n,
                        (0, r.A)(
                          (0, r.A)((0, r.A)({}, i), t),
                          {},
                          { interpolationkey: e }
                        )
                      )
                    : o;
                }
                const o = e.split(this.formatSeparator),
                  a = o.shift().trim(),
                  s = o.join(this.formatSeparator).trim();
                return this.format(
                  P(
                    t,
                    d,
                    a,
                    this.options.keySeparator,
                    this.options.ignoreJSONStructure
                  ),
                  s,
                  n,
                  (0, r.A)(
                    (0, r.A)((0, r.A)({}, i), t),
                    {},
                    { interpolationkey: a }
                  )
                );
              };
            this.resetRegExp();
            const p =
                (null === i || void 0 === i
                  ? void 0
                  : i.missingInterpolationHandler) ||
                this.options.missingInterpolationHandler,
              f =
                void 0 !==
                (null === i ||
                void 0 === i ||
                null === (s = i.interpolation) ||
                void 0 === s
                  ? void 0
                  : s.skipOnVariables)
                  ? i.interpolation.skipOnVariables
                  : this.options.interpolation.skipOnVariables;
            return (
              [
                { regex: this.regexpUnescape, safeValue: (e) => N(e) },
                {
                  regex: this.regexp,
                  safeValue: (e) =>
                    this.escapeValue ? N(this.escape(e)) : N(e),
                },
              ].forEach((t) => {
                for (u = 0; (l = t.regex.exec(e)); ) {
                  const n = l[1].trim();
                  if (((c = h(n)), void 0 === c))
                    if ("function" === typeof p) {
                      const t = p(e, l, i);
                      c = o(t) ? t : "";
                    } else if (i && Object.prototype.hasOwnProperty.call(i, n))
                      c = "";
                    else {
                      if (f) {
                        c = l[0];
                        continue;
                      }
                      this.logger.warn(
                        "missed to pass in variable "
                          .concat(n, " for interpolating ")
                          .concat(e)
                      ),
                        (c = "");
                    }
                  else o(c) || this.useRawValueToEscape || (c = a(c));
                  const r = t.safeValue(c);
                  if (
                    ((e = e.replace(l[0], r)),
                    f
                      ? ((t.regex.lastIndex += c.length),
                        (t.regex.lastIndex -= l[0].length))
                      : (t.regex.lastIndex = 0),
                    u++,
                    u >= this.maxReplaces)
                  )
                    break;
                }
              }),
              e
            );
          }
          nest(e, t) {
            let n,
              i,
              s,
              l =
                arguments.length > 2 && void 0 !== arguments[2]
                  ? arguments[2]
                  : {};
            const c = (e, t) => {
              var n;
              const o = this.nestingOptionsSeparator;
              if (e.indexOf(o) < 0) return e;
              const i = e.split(new RegExp("".concat(o, "[ ]*{")));
              let a = "{".concat(i[1]);
              (e = i[0]), (a = this.interpolate(a, s));
              const l = a.match(/'/g),
                c = a.match(/"/g);
              (((null !==
                (n = null === l || void 0 === l ? void 0 : l.length) &&
              void 0 !== n
                ? n
                : 0) %
                2 ===
                0 &&
                !c) ||
                c.length % 2 !== 0) &&
                (a = a.replace(/'/g, '"'));
              try {
                (s = JSON.parse(a)), t && (s = (0, r.A)((0, r.A)({}, t), s));
              } catch (u) {
                return (
                  this.logger.warn(
                    "failed parsing options string in nesting for key ".concat(
                      e
                    ),
                    u
                  ),
                  "".concat(e).concat(o).concat(a)
                );
              }
              return (
                s.defaultValue &&
                  s.defaultValue.indexOf(this.prefix) > -1 &&
                  delete s.defaultValue,
                e
              );
            };
            for (; (n = this.nestingRegexp.exec(e)); ) {
              let u = [];
              (s = (0, r.A)({}, l)),
                (s = s.replace && !o(s.replace) ? s.replace : s),
                (s.applyPostProcessor = !1),
                delete s.defaultValue;
              let d = !1;
              if (
                -1 !== n[0].indexOf(this.formatSeparator) &&
                !/{.*}/.test(n[1])
              ) {
                const e = n[1].split(this.formatSeparator).map((e) => e.trim());
                (n[1] = e.shift()), (u = e), (d = !0);
              }
              if (
                ((i = t(c.call(this, n[1].trim(), s), s)),
                i && n[0] === e && !o(i))
              )
                return i;
              o(i) || (i = a(i)),
                i ||
                  (this.logger.warn(
                    "missed to resolve ".concat(n[1], " for nesting ").concat(e)
                  ),
                  (i = "")),
                d &&
                  (i = u.reduce(
                    (e, t) =>
                      this.format(
                        e,
                        t,
                        l.lng,
                        (0, r.A)(
                          (0, r.A)({}, l),
                          {},
                          { interpolationkey: n[1].trim() }
                        )
                      ),
                    i.trim()
                  )),
                (e = e.replace(n[0], i)),
                (this.regexp.lastIndex = 0);
            }
            return e;
          }
        }
        const q = (e) => {
          const t = {};
          return (n, o, i) => {
            let a = i;
            i &&
              i.interpolationkey &&
              i.formatParams &&
              i.formatParams[i.interpolationkey] &&
              i[i.interpolationkey] &&
              (a = (0, r.A)(
                (0, r.A)({}, a),
                {},
                { [i.interpolationkey]: void 0 }
              ));
            const s = o + JSON.stringify(a);
            let l = t[s];
            return l || ((l = e(w(o), i)), (t[s] = l)), l(n);
          };
        };
        class j {
          constructor() {
            let e =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : {};
            (this.logger = S.create("formatter")),
              (this.options = e),
              (this.formats = {
                number: q((e, t) => {
                  const n = new Intl.NumberFormat(e, (0, r.A)({}, t));
                  return (e) => n.format(e);
                }),
                currency: q((e, t) => {
                  const n = new Intl.NumberFormat(
                    e,
                    (0, r.A)((0, r.A)({}, t), {}, { style: "currency" })
                  );
                  return (e) => n.format(e);
                }),
                datetime: q((e, t) => {
                  const n = new Intl.DateTimeFormat(e, (0, r.A)({}, t));
                  return (e) => n.format(e);
                }),
                relativetime: q((e, t) => {
                  const n = new Intl.RelativeTimeFormat(e, (0, r.A)({}, t));
                  return (e) => n.format(e, t.range || "day");
                }),
                list: q((e, t) => {
                  const n = new Intl.ListFormat(e, (0, r.A)({}, t));
                  return (e) => n.format(e);
                }),
              }),
              this.init(e);
          }
          init(e) {
            let t =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : { interpolation: {} };
            this.formatSeparator = t.interpolation.formatSeparator || ",";
          }
          add(e, t) {
            this.formats[e.toLowerCase().trim()] = t;
          }
          addCached(e, t) {
            this.formats[e.toLowerCase().trim()] = q(t);
          }
          format(e, t, n) {
            let o =
              arguments.length > 3 && void 0 !== arguments[3]
                ? arguments[3]
                : {};
            const i = t.split(this.formatSeparator);
            if (
              i.length > 1 &&
              i[0].indexOf("(") > 1 &&
              i[0].indexOf(")") < 0 &&
              i.find((e) => e.indexOf(")") > -1)
            ) {
              const e = i.findIndex((e) => e.indexOf(")") > -1);
              i[0] = [i[0], ...i.splice(1, e)].join(this.formatSeparator);
            }
            return i.reduce((e, t) => {
              const { formatName: i, formatOptions: a } = ((e) => {
                let t = e.toLowerCase().trim();
                const n = {};
                if (e.indexOf("(") > -1) {
                  const r = e.split("(");
                  t = r[0].toLowerCase().trim();
                  const o = r[1].substring(0, r[1].length - 1);
                  "currency" === t && o.indexOf(":") < 0
                    ? n.currency || (n.currency = o.trim())
                    : "relativetime" === t && o.indexOf(":") < 0
                    ? n.range || (n.range = o.trim())
                    : o.split(";").forEach((e) => {
                        if (e) {
                          const [t, ...r] = e.split(":"),
                            o = r
                              .join(":")
                              .trim()
                              .replace(/^'+|'+$/g, ""),
                            i = t.trim();
                          n[i] || (n[i] = o),
                            "false" === o && (n[i] = !1),
                            "true" === o && (n[i] = !0),
                            isNaN(o) || (n[i] = parseInt(o, 10));
                        }
                      });
                }
                return { formatName: t, formatOptions: n };
              })(t);
              if (this.formats[i]) {
                let t = e;
                try {
                  var s;
                  const l =
                      (null === o ||
                      void 0 === o ||
                      null === (s = o.formatParams) ||
                      void 0 === s
                        ? void 0
                        : s[o.interpolationkey]) || {},
                    c = l.locale || l.lng || o.locale || o.lng || n;
                  t = this.formats[i](
                    e,
                    c,
                    (0, r.A)((0, r.A)((0, r.A)({}, a), o), l)
                  );
                } catch (l) {
                  this.logger.warn(l);
                }
                return t;
              }
              return (
                this.logger.warn("there was no format function for ".concat(i)),
                e
              );
            }, e);
          }
        }
        class U extends k {
          constructor(e, t, n) {
            var r, o;
            let i =
              arguments.length > 3 && void 0 !== arguments[3]
                ? arguments[3]
                : {};
            super(),
              (this.backend = e),
              (this.store = t),
              (this.services = n),
              (this.languageUtils = n.languageUtils),
              (this.options = i),
              (this.logger = S.create("backendConnector")),
              (this.waitingReads = []),
              (this.maxParallelReads = i.maxParallelReads || 10),
              (this.readingCalls = 0),
              (this.maxRetries = i.maxRetries >= 0 ? i.maxRetries : 5),
              (this.retryTimeout = i.retryTimeout >= 1 ? i.retryTimeout : 350),
              (this.state = {}),
              (this.queue = []),
              null === (r = this.backend) ||
                void 0 === r ||
                null === (o = r.init) ||
                void 0 === o ||
                o.call(r, n, i.backend, i);
          }
          queueLoad(e, t, n, r) {
            const o = {},
              i = {},
              a = {},
              s = {};
            return (
              e.forEach((e) => {
                let r = !0;
                t.forEach((t) => {
                  const a = "".concat(e, "|").concat(t);
                  !n.reload && this.store.hasResourceBundle(e, t)
                    ? (this.state[a] = 2)
                    : this.state[a] < 0 ||
                      (1 === this.state[a]
                        ? void 0 === i[a] && (i[a] = !0)
                        : ((this.state[a] = 1),
                          (r = !1),
                          void 0 === i[a] && (i[a] = !0),
                          void 0 === o[a] && (o[a] = !0),
                          void 0 === s[t] && (s[t] = !0)));
                }),
                  r || (a[e] = !0);
              }),
              (Object.keys(o).length || Object.keys(i).length) &&
                this.queue.push({
                  pending: i,
                  pendingCount: Object.keys(i).length,
                  loaded: {},
                  errors: [],
                  callback: r,
                }),
              {
                toLoad: Object.keys(o),
                pending: Object.keys(i),
                toLoadLanguages: Object.keys(a),
                toLoadNamespaces: Object.keys(s),
              }
            );
          }
          loaded(e, t, n) {
            const r = e.split("|"),
              o = r[0],
              i = r[1];
            t && this.emit("failedLoading", o, i, t),
              !t &&
                n &&
                this.store.addResourceBundle(o, i, n, void 0, void 0, {
                  skipCopy: !0,
                }),
              (this.state[e] = t ? -1 : 2),
              t && n && (this.state[e] = 0);
            const a = {};
            this.queue.forEach((n) => {
              ((e, t, n) => {
                const { obj: r, k: o } = u(e, t, Object);
                (r[o] = r[o] || []), r[o].push(n);
              })(n.loaded, [o], i),
                ((e, t) => {
                  void 0 !== e.pending[t] &&
                    (delete e.pending[t], e.pendingCount--);
                })(n, e),
                t && n.errors.push(t),
                0 !== n.pendingCount ||
                  n.done ||
                  (Object.keys(n.loaded).forEach((e) => {
                    a[e] || (a[e] = {});
                    const t = n.loaded[e];
                    t.length &&
                      t.forEach((t) => {
                        void 0 === a[e][t] && (a[e][t] = !0);
                      });
                  }),
                  (n.done = !0),
                  n.errors.length ? n.callback(n.errors) : n.callback());
            }),
              this.emit("loaded", a),
              (this.queue = this.queue.filter((e) => !e.done));
          }
          read(e, t, n) {
            let r =
                arguments.length > 3 && void 0 !== arguments[3]
                  ? arguments[3]
                  : 0,
              o =
                arguments.length > 4 && void 0 !== arguments[4]
                  ? arguments[4]
                  : this.retryTimeout,
              i = arguments.length > 5 ? arguments[5] : void 0;
            if (!e.length) return i(null, {});
            if (this.readingCalls >= this.maxParallelReads)
              return void this.waitingReads.push({
                lng: e,
                ns: t,
                fcName: n,
                tried: r,
                wait: o,
                callback: i,
              });
            this.readingCalls++;
            const a = (a, s) => {
                if ((this.readingCalls--, this.waitingReads.length > 0)) {
                  const e = this.waitingReads.shift();
                  this.read(e.lng, e.ns, e.fcName, e.tried, e.wait, e.callback);
                }
                a && s && r < this.maxRetries
                  ? setTimeout(() => {
                      this.read.call(this, e, t, n, r + 1, 2 * o, i);
                    }, o)
                  : i(a, s);
              },
              s = this.backend[n].bind(this.backend);
            if (2 !== s.length) return s(e, t, a);
            try {
              const n = s(e, t);
              n && "function" === typeof n.then
                ? n.then((e) => a(null, e)).catch(a)
                : a(null, n);
            } catch (l) {
              a(l);
            }
          }
          prepareLoading(e, t) {
            let n =
                arguments.length > 2 && void 0 !== arguments[2]
                  ? arguments[2]
                  : {},
              r = arguments.length > 3 ? arguments[3] : void 0;
            if (!this.backend)
              return (
                this.logger.warn(
                  "No backend was added via i18next.use. Will not load resources."
                ),
                r && r()
              );
            o(e) && (e = this.languageUtils.toResolveHierarchy(e)),
              o(t) && (t = [t]);
            const i = this.queueLoad(e, t, n, r);
            if (!i.toLoad.length) return i.pending.length || r(), null;
            i.toLoad.forEach((e) => {
              this.loadOne(e);
            });
          }
          load(e, t, n) {
            this.prepareLoading(e, t, {}, n);
          }
          reload(e, t, n) {
            this.prepareLoading(e, t, { reload: !0 }, n);
          }
          loadOne(e) {
            let t =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : "";
            const n = e.split("|"),
              r = n[0],
              o = n[1];
            this.read(r, o, "read", void 0, void 0, (n, i) => {
              n &&
                this.logger.warn(
                  ""
                    .concat(t, "loading namespace ")
                    .concat(o, " for language ")
                    .concat(r, " failed"),
                  n
                ),
                !n &&
                  i &&
                  this.logger.log(
                    ""
                      .concat(t, "loaded namespace ")
                      .concat(o, " for language ")
                      .concat(r),
                    i
                  ),
                this.loaded(e, n, i);
            });
          }
          saveMissing(e, t, n, o, i) {
            var a, s, l;
            let c =
                arguments.length > 5 && void 0 !== arguments[5]
                  ? arguments[5]
                  : {},
              u =
                arguments.length > 6 && void 0 !== arguments[6]
                  ? arguments[6]
                  : () => {};
            if (
              null === (a = this.services) ||
              void 0 === a ||
              null === (a = a.utils) ||
              void 0 === a ||
              !a.hasLoadedNamespace ||
              (null !== (s = this.services) &&
                void 0 !== s &&
                null !== (s = s.utils) &&
                void 0 !== s &&
                s.hasLoadedNamespace(t))
            ) {
              if (void 0 !== n && null !== n && "" !== n) {
                if (null !== (l = this.backend) && void 0 !== l && l.create) {
                  const a = (0, r.A)((0, r.A)({}, c), {}, { isUpdate: i }),
                    s = this.backend.create.bind(this.backend);
                  if (s.length < 6)
                    try {
                      let r;
                      (r = 5 === s.length ? s(e, t, n, o, a) : s(e, t, n, o)),
                        r && "function" === typeof r.then
                          ? r.then((e) => u(null, e)).catch(u)
                          : u(null, r);
                    } catch (d) {
                      u(d);
                    }
                  else s(e, t, n, o, u, a);
                }
                e && e[0] && this.store.addResource(e[0], t, n, o);
              }
            } else
              this.logger.warn(
                'did not save key "'
                  .concat(n, '" as the namespace "')
                  .concat(t, '" was not yet loaded'),
                "This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!"
              );
          }
        }
        const F = () => ({
            debug: !1,
            initAsync: !0,
            ns: ["translation"],
            defaultNS: ["translation"],
            fallbackLng: ["dev"],
            fallbackNS: !1,
            supportedLngs: !1,
            nonExplicitSupportedLngs: !1,
            load: "all",
            preload: !1,
            simplifyPluralSuffix: !0,
            keySeparator: ".",
            nsSeparator: ":",
            pluralSeparator: "_",
            contextSeparator: "_",
            partialBundledLanguages: !1,
            saveMissing: !1,
            updateMissing: !1,
            saveMissingTo: "fallback",
            saveMissingPlurals: !0,
            missingKeyHandler: !1,
            missingInterpolationHandler: !1,
            postProcess: !1,
            postProcessPassResolved: !1,
            returnNull: !1,
            returnEmptyString: !0,
            returnObjects: !1,
            joinArrays: !1,
            returnedObjectHandler: !1,
            parseMissingKeyHandler: !1,
            appendNamespaceToMissingKey: !1,
            appendNamespaceToCIMode: !1,
            overloadTranslationOptionHandler: (e) => {
              let t = {};
              if (
                ("object" === typeof e[1] && (t = e[1]),
                o(e[1]) && (t.defaultValue = e[1]),
                o(e[2]) && (t.tDescription = e[2]),
                "object" === typeof e[2] || "object" === typeof e[3])
              ) {
                const n = e[3] || e[2];
                Object.keys(n).forEach((e) => {
                  t[e] = n[e];
                });
              }
              return t;
            },
            interpolation: {
              escapeValue: !0,
              format: (e) => e,
              prefix: "{{",
              suffix: "}}",
              formatSeparator: ",",
              unescapePrefix: "-",
              nestingPrefix: "$t(",
              nestingSuffix: ")",
              nestingOptionsSeparator: ",",
              maxReplaces: 1e3,
              skipOnVariables: !0,
            },
          }),
          W = (e) => {
            var t, n;
            return (
              o(e.ns) && (e.ns = [e.ns]),
              o(e.fallbackLng) && (e.fallbackLng = [e.fallbackLng]),
              o(e.fallbackNS) && (e.fallbackNS = [e.fallbackNS]),
              (null === (t = e.supportedLngs) ||
              void 0 === t ||
              null === (n = t.indexOf) ||
              void 0 === n
                ? void 0
                : n.call(t, "cimode")) < 0 &&
                (e.supportedLngs = e.supportedLngs.concat(["cimode"])),
              "boolean" === typeof e.initImmediate &&
                (e.initAsync = e.initImmediate),
              e
            );
          },
          z = () => {};
        class B extends k {
          constructor() {
            let e =
                arguments.length > 0 && void 0 !== arguments[0]
                  ? arguments[0]
                  : {},
              t = arguments.length > 1 ? arguments[1] : void 0;
            var n;
            if (
              (super(),
              (this.options = W(e)),
              (this.services = {}),
              (this.logger = S),
              (this.modules = { external: [] }),
              (n = this),
              Object.getOwnPropertyNames(Object.getPrototypeOf(n)).forEach(
                (e) => {
                  "function" === typeof n[e] && (n[e] = n[e].bind(n));
                }
              ),
              t && !this.isInitialized && !e.isClone)
            ) {
              if (!this.options.initAsync) return this.init(e, t), this;
              setTimeout(() => {
                this.init(e, t);
              }, 0);
            }
          }
          init() {
            var e = this;
            let t =
                arguments.length > 0 && void 0 !== arguments[0]
                  ? arguments[0]
                  : {},
              n = arguments.length > 1 ? arguments[1] : void 0;
            (this.isInitializing = !0),
              "function" === typeof t && ((n = t), (t = {})),
              null == t.defaultNS &&
                t.ns &&
                (o(t.ns)
                  ? (t.defaultNS = t.ns)
                  : t.ns.indexOf("translation") < 0 && (t.defaultNS = t.ns[0]));
            const a = F();
            (this.options = (0, r.A)(
              (0, r.A)((0, r.A)({}, a), this.options),
              W(t)
            )),
              (this.options.interpolation = (0, r.A)(
                (0, r.A)({}, a.interpolation),
                this.options.interpolation
              )),
              void 0 !== t.keySeparator &&
                (this.options.userDefinedKeySeparator = t.keySeparator),
              void 0 !== t.nsSeparator &&
                (this.options.userDefinedNsSeparator = t.nsSeparator);
            const s = (e) =>
              e ? ("function" === typeof e ? new e() : e) : null;
            if (!this.options.isClone) {
              let t;
              this.modules.logger
                ? S.init(s(this.modules.logger), this.options)
                : S.init(null, this.options),
                (t = this.modules.formatter ? this.modules.formatter : j);
              const n = new L(this.options);
              this.store = new A(this.options.resources, this.options);
              const r = this.services;
              (r.logger = S),
                (r.resourceStore = this.store),
                (r.languageUtils = n),
                (r.pluralResolver = new R(n, {
                  prepend: this.options.pluralSeparator,
                  simplifyPluralSuffix: this.options.simplifyPluralSuffix,
                })),
                !t ||
                  (this.options.interpolation.format &&
                    this.options.interpolation.format !==
                      a.interpolation.format) ||
                  ((r.formatter = s(t)),
                  r.formatter.init(r, this.options),
                  (this.options.interpolation.format = r.formatter.format.bind(
                    r.formatter
                  ))),
                (r.interpolator = new D(this.options)),
                (r.utils = {
                  hasLoadedNamespace: this.hasLoadedNamespace.bind(this),
                }),
                (r.backendConnector = new U(
                  s(this.modules.backend),
                  r.resourceStore,
                  r,
                  this.options
                )),
                r.backendConnector.on("*", function (t) {
                  for (
                    var n = arguments.length,
                      r = new Array(n > 1 ? n - 1 : 0),
                      o = 1;
                    o < n;
                    o++
                  )
                    r[o - 1] = arguments[o];
                  e.emit(t, ...r);
                }),
                this.modules.languageDetector &&
                  ((r.languageDetector = s(this.modules.languageDetector)),
                  r.languageDetector.init &&
                    r.languageDetector.init(
                      r,
                      this.options.detection,
                      this.options
                    )),
                this.modules.i18nFormat &&
                  ((r.i18nFormat = s(this.modules.i18nFormat)),
                  r.i18nFormat.init && r.i18nFormat.init(this)),
                (this.translator = new I(this.services, this.options)),
                this.translator.on("*", function (t) {
                  for (
                    var n = arguments.length,
                      r = new Array(n > 1 ? n - 1 : 0),
                      o = 1;
                    o < n;
                    o++
                  )
                    r[o - 1] = arguments[o];
                  e.emit(t, ...r);
                }),
                this.modules.external.forEach((e) => {
                  e.init && e.init(this);
                });
            }
            if (
              ((this.format = this.options.interpolation.format),
              n || (n = z),
              this.options.fallbackLng &&
                !this.services.languageDetector &&
                !this.options.lng)
            ) {
              const e = this.services.languageUtils.getFallbackCodes(
                this.options.fallbackLng
              );
              e.length > 0 && "dev" !== e[0] && (this.options.lng = e[0]);
            }
            this.services.languageDetector ||
              this.options.lng ||
              this.logger.warn(
                "init: no languageDetector is used and no lng is defined"
              );
            [
              "getResource",
              "hasResourceBundle",
              "getResourceBundle",
              "getDataByLanguage",
            ].forEach((t) => {
              this[t] = function () {
                return e.store[t](...arguments);
              };
            });
            [
              "addResource",
              "addResources",
              "addResourceBundle",
              "removeResourceBundle",
            ].forEach((t) => {
              this[t] = function () {
                return e.store[t](...arguments), e;
              };
            });
            const l = i(),
              c = () => {
                const e = (e, t) => {
                  (this.isInitializing = !1),
                    this.isInitialized &&
                      !this.initializedStoreOnce &&
                      this.logger.warn(
                        "init: i18next is already initialized. You should call init just once!"
                      ),
                    (this.isInitialized = !0),
                    this.options.isClone ||
                      this.logger.log("initialized", this.options),
                    this.emit("initialized", this.options),
                    l.resolve(t),
                    n(e, t);
                };
                if (this.languages && !this.isInitialized)
                  return e(null, this.t.bind(this));
                this.changeLanguage(this.options.lng, e);
              };
            return (
              this.options.resources || !this.options.initAsync
                ? c()
                : setTimeout(c, 0),
              l
            );
          }
          loadResources(e) {
            let t =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : z;
            const n = o(e) ? e : this.language;
            if (
              ("function" === typeof e && (t = e),
              !this.options.resources || this.options.partialBundledLanguages)
            ) {
              var r, i;
              if (
                "cimode" ===
                  (null === n || void 0 === n ? void 0 : n.toLowerCase()) &&
                (!this.options.preload || 0 === this.options.preload.length)
              )
                return t();
              const e = [],
                o = (t) => {
                  if (!t) return;
                  if ("cimode" === t) return;
                  this.services.languageUtils
                    .toResolveHierarchy(t)
                    .forEach((t) => {
                      "cimode" !== t && e.indexOf(t) < 0 && e.push(t);
                    });
                };
              if (n) o(n);
              else {
                this.services.languageUtils
                  .getFallbackCodes(this.options.fallbackLng)
                  .forEach((e) => o(e));
              }
              null === (r = this.options.preload) ||
                void 0 === r ||
                null === (i = r.forEach) ||
                void 0 === i ||
                i.call(r, (e) => o(e)),
                this.services.backendConnector.load(e, this.options.ns, (e) => {
                  e ||
                    this.resolvedLanguage ||
                    !this.language ||
                    this.setResolvedLanguage(this.language),
                    t(e);
                });
            } else t(null);
          }
          reloadResources(e, t, n) {
            const r = i();
            return (
              "function" === typeof e && ((n = e), (e = void 0)),
              "function" === typeof t && ((n = t), (t = void 0)),
              e || (e = this.languages),
              t || (t = this.options.ns),
              n || (n = z),
              this.services.backendConnector.reload(e, t, (e) => {
                r.resolve(), n(e);
              }),
              r
            );
          }
          use(e) {
            if (!e)
              throw new Error(
                "You are passing an undefined module! Please check the object you are passing to i18next.use()"
              );
            if (!e.type)
              throw new Error(
                "You are passing a wrong module! Please check the object you are passing to i18next.use()"
              );
            return (
              "backend" === e.type && (this.modules.backend = e),
              ("logger" === e.type || (e.log && e.warn && e.error)) &&
                (this.modules.logger = e),
              "languageDetector" === e.type &&
                (this.modules.languageDetector = e),
              "i18nFormat" === e.type && (this.modules.i18nFormat = e),
              "postProcessor" === e.type && C.addPostProcessor(e),
              "formatter" === e.type && (this.modules.formatter = e),
              "3rdParty" === e.type && this.modules.external.push(e),
              this
            );
          }
          setResolvedLanguage(e) {
            if (e && this.languages && !(["cimode", "dev"].indexOf(e) > -1))
              for (let t = 0; t < this.languages.length; t++) {
                const e = this.languages[t];
                if (
                  !(["cimode", "dev"].indexOf(e) > -1) &&
                  this.store.hasLanguageSomeTranslations(e)
                ) {
                  this.resolvedLanguage = e;
                  break;
                }
              }
          }
          changeLanguage(e, t) {
            var n = this;
            this.isLanguageChangingTo = e;
            const r = i();
            this.emit("languageChanging", e);
            const a = (e) => {
                (this.language = e),
                  (this.languages =
                    this.services.languageUtils.toResolveHierarchy(e)),
                  (this.resolvedLanguage = void 0),
                  this.setResolvedLanguage(e);
              },
              s = (e, o) => {
                o
                  ? (a(o),
                    this.translator.changeLanguage(o),
                    (this.isLanguageChangingTo = void 0),
                    this.emit("languageChanged", o),
                    this.logger.log("languageChanged", o))
                  : (this.isLanguageChangingTo = void 0),
                  r.resolve(function () {
                    return n.t(...arguments);
                  }),
                  t &&
                    t(e, function () {
                      return n.t(...arguments);
                    });
              },
              l = (t) => {
                e || t || !this.services.languageDetector || (t = []);
                const n = o(t)
                  ? t
                  : this.services.languageUtils.getBestMatchFromCodes(t);
                var r, i;
                n &&
                  (this.language || a(n),
                  this.translator.language || this.translator.changeLanguage(n),
                  null === (r = this.services.languageDetector) ||
                    void 0 === r ||
                    null === (i = r.cacheUserLanguage) ||
                    void 0 === i ||
                    i.call(r, n));
                this.loadResources(n, (e) => {
                  s(e, n);
                });
              };
            return (
              e ||
              !this.services.languageDetector ||
              this.services.languageDetector.async
                ? !e &&
                  this.services.languageDetector &&
                  this.services.languageDetector.async
                  ? 0 === this.services.languageDetector.detect.length
                    ? this.services.languageDetector.detect().then(l)
                    : this.services.languageDetector.detect(l)
                  : l(e)
                : l(this.services.languageDetector.detect()),
              r
            );
          }
          getFixedT(e, t, n) {
            var i = this;
            const a = function (e, t) {
              let o;
              if ("object" !== typeof t) {
                for (
                  var s = arguments.length,
                    l = new Array(s > 2 ? s - 2 : 0),
                    c = 2;
                  c < s;
                  c++
                )
                  l[c - 2] = arguments[c];
                o = i.options.overloadTranslationOptionHandler(
                  [e, t].concat(l)
                );
              } else o = (0, r.A)({}, t);
              (o.lng = o.lng || a.lng),
                (o.lngs = o.lngs || a.lngs),
                (o.ns = o.ns || a.ns),
                "" !== o.keyPrefix &&
                  (o.keyPrefix = o.keyPrefix || n || a.keyPrefix);
              const u = i.options.keySeparator || ".";
              let d;
              return (
                (d =
                  o.keyPrefix && Array.isArray(e)
                    ? e.map((e) => "".concat(o.keyPrefix).concat(u).concat(e))
                    : o.keyPrefix
                    ? "".concat(o.keyPrefix).concat(u).concat(e)
                    : e),
                i.t(d, o)
              );
            };
            return (
              o(e) ? (a.lng = e) : (a.lngs = e),
              (a.ns = t),
              (a.keyPrefix = n),
              a
            );
          }
          t() {
            for (
              var e, t = arguments.length, n = new Array(t), r = 0;
              r < t;
              r++
            )
              n[r] = arguments[r];
            return null === (e = this.translator) || void 0 === e
              ? void 0
              : e.translate(...n);
          }
          exists() {
            for (
              var e, t = arguments.length, n = new Array(t), r = 0;
              r < t;
              r++
            )
              n[r] = arguments[r];
            return null === (e = this.translator) || void 0 === e
              ? void 0
              : e.exists(...n);
          }
          setDefaultNamespace(e) {
            this.options.defaultNS = e;
          }
          hasLoadedNamespace(e) {
            let t =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : {};
            if (!this.isInitialized)
              return (
                this.logger.warn(
                  "hasLoadedNamespace: i18next was not initialized",
                  this.languages
                ),
                !1
              );
            if (!this.languages || !this.languages.length)
              return (
                this.logger.warn(
                  "hasLoadedNamespace: i18n.languages were undefined or empty",
                  this.languages
                ),
                !1
              );
            const n = t.lng || this.resolvedLanguage || this.languages[0],
              r = !!this.options && this.options.fallbackLng,
              o = this.languages[this.languages.length - 1];
            if ("cimode" === n.toLowerCase()) return !0;
            const i = (e, t) => {
              const n =
                this.services.backendConnector.state[
                  "".concat(e, "|").concat(t)
                ];
              return -1 === n || 0 === n || 2 === n;
            };
            if (t.precheck) {
              const e = t.precheck(this, i);
              if (void 0 !== e) return e;
            }
            return (
              !!this.hasResourceBundle(n, e) ||
              !(
                this.services.backendConnector.backend &&
                (!this.options.resources ||
                  this.options.partialBundledLanguages)
              ) ||
              !(!i(n, e) || (r && !i(o, e)))
            );
          }
          loadNamespaces(e, t) {
            const n = i();
            return this.options.ns
              ? (o(e) && (e = [e]),
                e.forEach((e) => {
                  this.options.ns.indexOf(e) < 0 && this.options.ns.push(e);
                }),
                this.loadResources((e) => {
                  n.resolve(), t && t(e);
                }),
                n)
              : (t && t(), Promise.resolve());
          }
          loadLanguages(e, t) {
            const n = i();
            o(e) && (e = [e]);
            const r = this.options.preload || [],
              a = e.filter(
                (e) =>
                  r.indexOf(e) < 0 &&
                  this.services.languageUtils.isSupportedCode(e)
              );
            return a.length
              ? ((this.options.preload = r.concat(a)),
                this.loadResources((e) => {
                  n.resolve(), t && t(e);
                }),
                n)
              : (t && t(), Promise.resolve());
          }
          dir(e) {
            var t, n;
            if (
              (e ||
                (e =
                  this.resolvedLanguage ||
                  ((null === (t = this.languages) || void 0 === t
                    ? void 0
                    : t.length) > 0
                    ? this.languages[0]
                    : this.language)),
              !e)
            )
              return "rtl";
            const r =
              (null === (n = this.services) || void 0 === n
                ? void 0
                : n.languageUtils) || new L(F());
            return [
              "ar",
              "shu",
              "sqr",
              "ssh",
              "xaa",
              "yhd",
              "yud",
              "aao",
              "abh",
              "abv",
              "acm",
              "acq",
              "acw",
              "acx",
              "acy",
              "adf",
              "ads",
              "aeb",
              "aec",
              "afb",
              "ajp",
              "apc",
              "apd",
              "arb",
              "arq",
              "ars",
              "ary",
              "arz",
              "auz",
              "avl",
              "ayh",
              "ayl",
              "ayn",
              "ayp",
              "bbz",
              "pga",
              "he",
              "iw",
              "ps",
              "pbt",
              "pbu",
              "pst",
              "prp",
              "prd",
              "ug",
              "ur",
              "ydd",
              "yds",
              "yih",
              "ji",
              "yi",
              "hbo",
              "men",
              "xmn",
              "fa",
              "jpr",
              "peo",
              "pes",
              "prs",
              "dv",
              "sam",
              "ckb",
            ].indexOf(r.getLanguagePartFromCode(e)) > -1 ||
              e.toLowerCase().indexOf("-arab") > 1
              ? "rtl"
              : "ltr";
          }
          static createInstance() {
            return new B(
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : {},
              arguments.length > 1 ? arguments[1] : void 0
            );
          }
          cloneInstance() {
            let e =
                arguments.length > 0 && void 0 !== arguments[0]
                  ? arguments[0]
                  : {},
              t =
                arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : z;
            const n = e.forkResourceStore;
            n && delete e.forkResourceStore;
            const o = (0, r.A)((0, r.A)((0, r.A)({}, this.options), e), {
                isClone: !0,
              }),
              i = new B(o);
            (void 0 === e.debug && void 0 === e.prefix) ||
              (i.logger = i.logger.clone(e));
            if (
              (["store", "services", "language"].forEach((e) => {
                i[e] = this[e];
              }),
              (i.services = (0, r.A)({}, this.services)),
              (i.services.utils = {
                hasLoadedNamespace: i.hasLoadedNamespace.bind(i),
              }),
              n)
            ) {
              const e = Object.keys(this.store.data).reduce(
                (e, t) => (
                  (e[t] = (0, r.A)({}, this.store.data[t])),
                  Object.keys(e[t]).reduce(
                    (n, o) => ((n[o] = (0, r.A)({}, e[t][o])), n),
                    {}
                  )
                ),
                {}
              );
              (i.store = new A(e, o)), (i.services.resourceStore = i.store);
            }
            return (
              (i.translator = new I(i.services, o)),
              i.translator.on("*", function (e) {
                for (
                  var t = arguments.length,
                    n = new Array(t > 1 ? t - 1 : 0),
                    r = 1;
                  r < t;
                  r++
                )
                  n[r - 1] = arguments[r];
                i.emit(e, ...n);
              }),
              i.init(o, t),
              (i.translator.options = o),
              (i.translator.backendConnector.services.utils = {
                hasLoadedNamespace: i.hasLoadedNamespace.bind(i),
              }),
              i
            );
          }
          toJSON() {
            return {
              options: this.options,
              store: this.store,
              language: this.language,
              languages: this.languages,
              resolvedLanguage: this.resolvedLanguage,
            };
          }
        }
        const H = B.createInstance();
        H.createInstance = B.createInstance;
        H.createInstance,
          H.dir,
          H.init,
          H.loadResources,
          H.reloadResources,
          H.use,
          H.changeLanguage,
          H.getFixedT,
          H.t,
          H.exists,
          H.setDefaultNamespace,
          H.hasLoadedNamespace,
          H.loadNamespaces,
          H.loadLanguages;
        var $ = n(67827);
        const { slice: G, forEach: V } = [];
        const K = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/,
          Y = {
            create(e, t, n, r) {
              let o =
                arguments.length > 4 && void 0 !== arguments[4]
                  ? arguments[4]
                  : { path: "/", sameSite: "strict" };
              n &&
                ((o.expires = new Date()),
                o.expires.setTime(o.expires.getTime() + 60 * n * 1e3)),
                r && (o.domain = r),
                (document.cookie = (function (e, t) {
                  const n =
                      arguments.length > 2 && void 0 !== arguments[2]
                        ? arguments[2]
                        : { path: "/" },
                    r = encodeURIComponent(t);
                  let o = "".concat(e, "=").concat(r);
                  if (n.maxAge > 0) {
                    const e = n.maxAge - 0;
                    if (Number.isNaN(e))
                      throw new Error("maxAge should be a Number");
                    o += "; Max-Age=".concat(Math.floor(e));
                  }
                  if (n.domain) {
                    if (!K.test(n.domain))
                      throw new TypeError("option domain is invalid");
                    o += "; Domain=".concat(n.domain);
                  }
                  if (n.path) {
                    if (!K.test(n.path))
                      throw new TypeError("option path is invalid");
                    o += "; Path=".concat(n.path);
                  }
                  if (n.expires) {
                    if ("function" !== typeof n.expires.toUTCString)
                      throw new TypeError("option expires is invalid");
                    o += "; Expires=".concat(n.expires.toUTCString());
                  }
                  if (
                    (n.httpOnly && (o += "; HttpOnly"),
                    n.secure && (o += "; Secure"),
                    n.sameSite)
                  )
                    switch (
                      "string" === typeof n.sameSite
                        ? n.sameSite.toLowerCase()
                        : n.sameSite
                    ) {
                      case !0:
                        o += "; SameSite=Strict";
                        break;
                      case "lax":
                        o += "; SameSite=Lax";
                        break;
                      case "strict":
                        o += "; SameSite=Strict";
                        break;
                      case "none":
                        o += "; SameSite=None";
                        break;
                      default:
                        throw new TypeError("option sameSite is invalid");
                    }
                  return n.partitioned && (o += "; Partitioned"), o;
                })(e, t, o));
            },
            read(e) {
              const t = "".concat(e, "="),
                n = document.cookie.split(";");
              for (let r = 0; r < n.length; r++) {
                let e = n[r];
                for (; " " === e.charAt(0); ) e = e.substring(1, e.length);
                if (0 === e.indexOf(t)) return e.substring(t.length, e.length);
              }
              return null;
            },
            remove(e, t) {
              this.create(e, "", -1, t);
            },
          };
        var Q = {
            name: "cookie",
            lookup(e) {
              let { lookupCookie: t } = e;
              if (t && "undefined" !== typeof document)
                return Y.read(t) || void 0;
            },
            cacheUserLanguage(e, t) {
              let {
                lookupCookie: n,
                cookieMinutes: r,
                cookieDomain: o,
                cookieOptions: i,
              } = t;
              n && "undefined" !== typeof document && Y.create(n, e, r, o, i);
            },
          },
          Z = {
            name: "querystring",
            lookup(e) {
              let t,
                { lookupQuerystring: n } = e;
              if ("undefined" !== typeof window) {
                var r;
                let { search: e } = window.location;
                !window.location.search &&
                  (null === (r = window.location.hash) || void 0 === r
                    ? void 0
                    : r.indexOf("?")) > -1 &&
                  (e = window.location.hash.substring(
                    window.location.hash.indexOf("?")
                  ));
                const o = e.substring(1).split("&");
                for (let r = 0; r < o.length; r++) {
                  const e = o[r].indexOf("=");
                  if (e > 0) {
                    o[r].substring(0, e) === n && (t = o[r].substring(e + 1));
                  }
                }
              }
              return t;
            },
          },
          J = {
            name: "hash",
            lookup(e) {
              let t,
                { lookupHash: n, lookupFromHashIndex: r } = e;
              if ("undefined" !== typeof window) {
                const { hash: e } = window.location;
                if (e && e.length > 2) {
                  const i = e.substring(1);
                  if (n) {
                    const e = i.split("&");
                    for (let r = 0; r < e.length; r++) {
                      const o = e[r].indexOf("=");
                      if (o > 0) {
                        e[r].substring(0, o) === n &&
                          (t = e[r].substring(o + 1));
                      }
                    }
                  }
                  if (t) return t;
                  if (!t && r > -1) {
                    var o;
                    const t = e.match(/\/([a-zA-Z-]*)/g);
                    if (!Array.isArray(t)) return;
                    return null === (o = t["number" === typeof r ? r : 0]) ||
                      void 0 === o
                      ? void 0
                      : o.replace("/", "");
                  }
                }
              }
              return t;
            },
          };
        let X = null;
        const ee = () => {
          if (null !== X) return X;
          try {
            if (
              ((X =
                "undefined" !== typeof window && null !== window.localStorage),
              !X)
            )
              return !1;
            const e = "i18next.translate.boo";
            window.localStorage.setItem(e, "foo"),
              window.localStorage.removeItem(e);
          } catch (e) {
            X = !1;
          }
          return X;
        };
        var te = {
          name: "localStorage",
          lookup(e) {
            let { lookupLocalStorage: t } = e;
            if (t && ee()) return window.localStorage.getItem(t) || void 0;
          },
          cacheUserLanguage(e, t) {
            let { lookupLocalStorage: n } = t;
            n && ee() && window.localStorage.setItem(n, e);
          },
        };
        let ne = null;
        const re = () => {
          if (null !== ne) return ne;
          try {
            if (
              ((ne =
                "undefined" !== typeof window &&
                null !== window.sessionStorage),
              !ne)
            )
              return !1;
            const e = "i18next.translate.boo";
            window.sessionStorage.setItem(e, "foo"),
              window.sessionStorage.removeItem(e);
          } catch (e) {
            ne = !1;
          }
          return ne;
        };
        var oe = {
            name: "sessionStorage",
            lookup(e) {
              let { lookupSessionStorage: t } = e;
              if (t && re()) return window.sessionStorage.getItem(t) || void 0;
            },
            cacheUserLanguage(e, t) {
              let { lookupSessionStorage: n } = t;
              n && re() && window.sessionStorage.setItem(n, e);
            },
          },
          ie = {
            name: "navigator",
            lookup(e) {
              const t = [];
              if ("undefined" !== typeof navigator) {
                const {
                  languages: e,
                  userLanguage: n,
                  language: r,
                } = navigator;
                if (e) for (let o = 0; o < e.length; o++) t.push(e[o]);
                n && t.push(n), r && t.push(r);
              }
              return t.length > 0 ? t : void 0;
            },
          },
          ae = {
            name: "htmlTag",
            lookup(e) {
              let t,
                { htmlTag: n } = e;
              const r =
                n ||
                ("undefined" !== typeof document
                  ? document.documentElement
                  : null);
              return (
                r &&
                  "function" === typeof r.getAttribute &&
                  (t = r.getAttribute("lang")),
                t
              );
            },
          },
          se = {
            name: "path",
            lookup(e) {
              var t;
              let { lookupFromPathIndex: n } = e;
              if ("undefined" === typeof window) return;
              const r = window.location.pathname.match(/\/([a-zA-Z-]*)/g);
              if (!Array.isArray(r)) return;
              return null === (t = r["number" === typeof n ? n : 0]) ||
                void 0 === t
                ? void 0
                : t.replace("/", "");
            },
          },
          le = {
            name: "subdomain",
            lookup(e) {
              var t;
              let { lookupFromSubdomainIndex: n } = e;
              const r = "number" === typeof n ? n + 1 : 1,
                o =
                  "undefined" !== typeof window &&
                  (null === (t = window.location) ||
                  void 0 === t ||
                  null === (t = t.hostname) ||
                  void 0 === t
                    ? void 0
                    : t.match(
                        /^(\w{2,5})\.(([a-z0-9-]{1,63}\.[a-z]{2,6})|localhost)/i
                      ));
              if (o) return o[r];
            },
          };
        let ce = !1;
        try {
          document.cookie, (ce = !0);
        } catch (pe) {}
        const ue = [
          "querystring",
          "cookie",
          "localStorage",
          "sessionStorage",
          "navigator",
          "htmlTag",
        ];
        ce || ue.splice(1, 1);
        class de {
          constructor(e) {
            let t =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : {};
            (this.type = "languageDetector"),
              (this.detectors = {}),
              this.init(e, t);
          }
          init() {
            let e =
                arguments.length > 0 && void 0 !== arguments[0]
                  ? arguments[0]
                  : { languageUtils: {} },
              t =
                arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : {},
              n =
                arguments.length > 2 && void 0 !== arguments[2]
                  ? arguments[2]
                  : {};
            (this.services = e),
              (this.options = (function (e) {
                return (
                  V.call(G.call(arguments, 1), (t) => {
                    if (t) for (const n in t) void 0 === e[n] && (e[n] = t[n]);
                  }),
                  e
                );
              })(t, this.options || {}, {
                order: ue,
                lookupQuerystring: "lng",
                lookupCookie: "i18next",
                lookupLocalStorage: "i18nextLng",
                lookupSessionStorage: "i18nextLng",
                caches: ["localStorage"],
                excludeCacheFor: ["cimode"],
                convertDetectedLanguage: (e) => e,
              })),
              "string" === typeof this.options.convertDetectedLanguage &&
                this.options.convertDetectedLanguage.indexOf("15897") > -1 &&
                (this.options.convertDetectedLanguage = (e) =>
                  e.replace("-", "_")),
              this.options.lookupFromUrlIndex &&
                (this.options.lookupFromPathIndex =
                  this.options.lookupFromUrlIndex),
              (this.i18nOptions = n),
              this.addDetector(Q),
              this.addDetector(Z),
              this.addDetector(te),
              this.addDetector(oe),
              this.addDetector(ie),
              this.addDetector(ae),
              this.addDetector(se),
              this.addDetector(le),
              this.addDetector(J);
          }
          addDetector(e) {
            return (this.detectors[e.name] = e), this;
          }
          detect() {
            let e =
                arguments.length > 0 && void 0 !== arguments[0]
                  ? arguments[0]
                  : this.options.order,
              t = [];
            return (
              e.forEach((e) => {
                if (this.detectors[e]) {
                  let n = this.detectors[e].lookup(this.options);
                  n && "string" === typeof n && (n = [n]),
                    n && (t = t.concat(n));
                }
              }),
              (t = t
                .filter((e) => {
                  return (
                    void 0 !== e &&
                    null !== e &&
                    !(
                      "string" === typeof (t = e) &&
                      [
                        /<\s*script.*?>/i,
                        /<\s*\/\s*script\s*>/i,
                        /<\s*img.*?on\w+\s*=/i,
                        /<\s*\w+\s*on\w+\s*=.*?>/i,
                        /javascript\s*:/i,
                        /vbscript\s*:/i,
                        /expression\s*\(/i,
                        /eval\s*\(/i,
                        /alert\s*\(/i,
                        /document\.cookie/i,
                        /document\.write\s*\(/i,
                        /window\.location/i,
                        /innerHTML/i,
                      ].some((e) => e.test(t))
                    )
                  );
                  var t;
                })
                .map((e) => this.options.convertDetectedLanguage(e))),
              this.services &&
              this.services.languageUtils &&
              this.services.languageUtils.getBestMatchFromCodes
                ? t
                : t.length > 0
                ? t[0]
                : null
            );
          }
          cacheUserLanguage(e) {
            let t =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : this.options.caches;
            t &&
              ((this.options.excludeCacheFor &&
                this.options.excludeCacheFor.indexOf(e) > -1) ||
                t.forEach((t) => {
                  this.detectors[t] &&
                    this.detectors[t].cacheUserLanguage(e, this.options);
                }));
          }
        }
        (de.type = "languageDetector"),
          H.use(de)
            .use($.r9)
            .init({
              fallbackLng: "zh",
              supportedLngs: ["zh", "en"],
              load: "languageOnly",
              nonExplicitSupportedLngs: !0,
              detection: {
                order: ["localStorage", "chromeStorage", "navigator"],
                caches: ["localStorage"],
                chromeStorage: {
                  lookup: () =>
                    new Promise((e) => {
                      var t;
                      null === (t = chrome.storage) ||
                        void 0 === t ||
                        t.local.get("i18nextLng", (t) => {
                          e(t.i18nextLng);
                        });
                    }),
                },
                convertDetectedLanguage: (e) => e.split("-")[0],
              },
              resources: {
                en: { translation: n(44174) },
                zh: { translation: n(79527) },
              },
            });
        const he = H;
      },
      29402: function (e, t, n) {
        e.exports = (function () {
          var e =
            e ||
            (function (e, t) {
              var r;
              if (
                ("undefined" !== typeof window &&
                  window.crypto &&
                  (r = window.crypto),
                "undefined" !== typeof self && self.crypto && (r = self.crypto),
                "undefined" !== typeof globalThis &&
                  globalThis.crypto &&
                  (r = globalThis.crypto),
                !r &&
                  "undefined" !== typeof window &&
                  window.msCrypto &&
                  (r = window.msCrypto),
                !r &&
                  "undefined" !== typeof n.g &&
                  n.g.crypto &&
                  (r = n.g.crypto),
                !r)
              )
                try {
                  r = n(50477);
                } catch (m) {}
              var o = function () {
                  if (r) {
                    if ("function" === typeof r.getRandomValues)
                      try {
                        return r.getRandomValues(new Uint32Array(1))[0];
                      } catch (m) {}
                    if ("function" === typeof r.randomBytes)
                      try {
                        return r.randomBytes(4).readInt32LE();
                      } catch (m) {}
                  }
                  throw new Error(
                    "Native crypto module could not be used to get secure random number."
                  );
                },
                i =
                  Object.create ||
                  (function () {
                    function e() {}
                    return function (t) {
                      var n;
                      return (
                        (e.prototype = t),
                        (n = new e()),
                        (e.prototype = null),
                        n
                      );
                    };
                  })(),
                a = {},
                s = (a.lib = {}),
                l = (s.Base = {
                  extend: function (e) {
                    var t = i(this);
                    return (
                      e && t.mixIn(e),
                      (t.hasOwnProperty("init") && this.init !== t.init) ||
                        (t.init = function () {
                          t.$super.init.apply(this, arguments);
                        }),
                      (t.init.prototype = t),
                      (t.$super = this),
                      t
                    );
                  },
                  create: function () {
                    var e = this.extend();
                    return e.init.apply(e, arguments), e;
                  },
                  init: function () {},
                  mixIn: function (e) {
                    for (var t in e) e.hasOwnProperty(t) && (this[t] = e[t]);
                    e.hasOwnProperty("toString") &&
                      (this.toString = e.toString);
                  },
                  clone: function () {
                    return this.init.prototype.extend(this);
                  },
                }),
                c = (s.WordArray = l.extend({
                  init: function (e, n) {
                    (e = this.words = e || []),
                      (this.sigBytes = n != t ? n : 4 * e.length);
                  },
                  toString: function (e) {
                    return (e || d).stringify(this);
                  },
                  concat: function (e) {
                    var t = this.words,
                      n = e.words,
                      r = this.sigBytes,
                      o = e.sigBytes;
                    if ((this.clamp(), r % 4))
                      for (var i = 0; i < o; i++) {
                        var a = (n[i >>> 2] >>> (24 - (i % 4) * 8)) & 255;
                        t[(r + i) >>> 2] |= a << (24 - ((r + i) % 4) * 8);
                      }
                    else
                      for (var s = 0; s < o; s += 4)
                        t[(r + s) >>> 2] = n[s >>> 2];
                    return (this.sigBytes += o), this;
                  },
                  clamp: function () {
                    var t = this.words,
                      n = this.sigBytes;
                    (t[n >>> 2] &= 4294967295 << (32 - (n % 4) * 8)),
                      (t.length = e.ceil(n / 4));
                  },
                  clone: function () {
                    var e = l.clone.call(this);
                    return (e.words = this.words.slice(0)), e;
                  },
                  random: function (e) {
                    for (var t = [], n = 0; n < e; n += 4) t.push(o());
                    return new c.init(t, e);
                  },
                })),
                u = (a.enc = {}),
                d = (u.Hex = {
                  stringify: function (e) {
                    for (
                      var t = e.words, n = e.sigBytes, r = [], o = 0;
                      o < n;
                      o++
                    ) {
                      var i = (t[o >>> 2] >>> (24 - (o % 4) * 8)) & 255;
                      r.push((i >>> 4).toString(16)),
                        r.push((15 & i).toString(16));
                    }
                    return r.join("");
                  },
                  parse: function (e) {
                    for (var t = e.length, n = [], r = 0; r < t; r += 2)
                      n[r >>> 3] |=
                        parseInt(e.substr(r, 2), 16) << (24 - (r % 8) * 4);
                    return new c.init(n, t / 2);
                  },
                }),
                h = (u.Latin1 = {
                  stringify: function (e) {
                    for (
                      var t = e.words, n = e.sigBytes, r = [], o = 0;
                      o < n;
                      o++
                    ) {
                      var i = (t[o >>> 2] >>> (24 - (o % 4) * 8)) & 255;
                      r.push(String.fromCharCode(i));
                    }
                    return r.join("");
                  },
                  parse: function (e) {
                    for (var t = e.length, n = [], r = 0; r < t; r++)
                      n[r >>> 2] |=
                        (255 & e.charCodeAt(r)) << (24 - (r % 4) * 8);
                    return new c.init(n, t);
                  },
                }),
                p = (u.Utf8 = {
                  stringify: function (e) {
                    try {
                      return decodeURIComponent(escape(h.stringify(e)));
                    } catch (t) {
                      throw new Error("Malformed UTF-8 data");
                    }
                  },
                  parse: function (e) {
                    return h.parse(unescape(encodeURIComponent(e)));
                  },
                }),
                f = (s.BufferedBlockAlgorithm = l.extend({
                  reset: function () {
                    (this._data = new c.init()), (this._nDataBytes = 0);
                  },
                  _append: function (e) {
                    "string" == typeof e && (e = p.parse(e)),
                      this._data.concat(e),
                      (this._nDataBytes += e.sigBytes);
                  },
                  _process: function (t) {
                    var n,
                      r = this._data,
                      o = r.words,
                      i = r.sigBytes,
                      a = this.blockSize,
                      s = i / (4 * a),
                      l =
                        (s = t
                          ? e.ceil(s)
                          : e.max((0 | s) - this._minBufferSize, 0)) * a,
                      u = e.min(4 * l, i);
                    if (l) {
                      for (var d = 0; d < l; d += a) this._doProcessBlock(o, d);
                      (n = o.splice(0, l)), (r.sigBytes -= u);
                    }
                    return new c.init(n, u);
                  },
                  clone: function () {
                    var e = l.clone.call(this);
                    return (e._data = this._data.clone()), e;
                  },
                  _minBufferSize: 0,
                })),
                g =
                  ((s.Hasher = f.extend({
                    cfg: l.extend(),
                    init: function (e) {
                      (this.cfg = this.cfg.extend(e)), this.reset();
                    },
                    reset: function () {
                      f.reset.call(this), this._doReset();
                    },
                    update: function (e) {
                      return this._append(e), this._process(), this;
                    },
                    finalize: function (e) {
                      return e && this._append(e), this._doFinalize();
                    },
                    blockSize: 16,
                    _createHelper: function (e) {
                      return function (t, n) {
                        return new e.init(n).finalize(t);
                      };
                    },
                    _createHmacHelper: function (e) {
                      return function (t, n) {
                        return new g.HMAC.init(e, n).finalize(t);
                      };
                    },
                  })),
                  (a.algo = {}));
              return a;
            })(Math);
          return e;
        })();
      },
      29942: function (e, t, n) {
        var r;
        (e = n.nmd(e)),
          function () {
            var o,
              i = "Expected a function",
              a = "__lodash_hash_undefined__",
              s = "__lodash_placeholder__",
              l = 16,
              c = 32,
              u = 64,
              d = 128,
              h = 256,
              p = 1 / 0,
              f = 9007199254740991,
              g = NaN,
              m = 4294967295,
              v = [
                ["ary", d],
                ["bind", 1],
                ["bindKey", 2],
                ["curry", 8],
                ["curryRight", l],
                ["flip", 512],
                ["partial", c],
                ["partialRight", u],
                ["rearg", h],
              ],
              y = "[object Arguments]",
              b = "[object Array]",
              w = "[object Boolean]",
              _ = "[object Date]",
              x = "[object Error]",
              S = "[object Function]",
              k = "[object GeneratorFunction]",
              A = "[object Map]",
              C = "[object Number]",
              E = "[object Object]",
              T = "[object Promise]",
              I = "[object RegExp]",
              L = "[object Set]",
              O = "[object String]",
              M = "[object Symbol]",
              R = "[object WeakMap]",
              P = "[object ArrayBuffer]",
              N = "[object DataView]",
              D = "[object Float32Array]",
              q = "[object Float64Array]",
              j = "[object Int8Array]",
              U = "[object Int16Array]",
              F = "[object Int32Array]",
              W = "[object Uint8Array]",
              z = "[object Uint8ClampedArray]",
              B = "[object Uint16Array]",
              H = "[object Uint32Array]",
              $ = /\b__p \+= '';/g,
              G = /\b(__p \+=) '' \+/g,
              V = /(__e\(.*?\)|\b__t\)) \+\n'';/g,
              K = /&(?:amp|lt|gt|quot|#39);/g,
              Y = /[&<>"']/g,
              Q = RegExp(K.source),
              Z = RegExp(Y.source),
              J = /<%-([\s\S]+?)%>/g,
              X = /<%([\s\S]+?)%>/g,
              ee = /<%=([\s\S]+?)%>/g,
              te = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
              ne = /^\w*$/,
              re =
                /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
              oe = /[\\^$.*+?()[\]{}|]/g,
              ie = RegExp(oe.source),
              ae = /^\s+/,
              se = /\s/,
              le = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/,
              ce = /\{\n\/\* \[wrapped with (.+)\] \*/,
              ue = /,? & /,
              de = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g,
              he = /[()=,{}\[\]\/\s]/,
              pe = /\\(\\)?/g,
              fe = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,
              ge = /\w*$/,
              me = /^[-+]0x[0-9a-f]+$/i,
              ve = /^0b[01]+$/i,
              ye = /^\[object .+?Constructor\]$/,
              be = /^0o[0-7]+$/i,
              we = /^(?:0|[1-9]\d*)$/,
              _e = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g,
              xe = /($^)/,
              Se = /['\n\r\u2028\u2029\\]/g,
              ke = "\\ud800-\\udfff",
              Ae = "\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff",
              Ce = "\\u2700-\\u27bf",
              Ee = "a-z\\xdf-\\xf6\\xf8-\\xff",
              Te = "A-Z\\xc0-\\xd6\\xd8-\\xde",
              Ie = "\\ufe0e\\ufe0f",
              Le =
                "\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000",
              Oe = "['\u2019]",
              Me = "[" + ke + "]",
              Re = "[" + Le + "]",
              Pe = "[" + Ae + "]",
              Ne = "\\d+",
              De = "[" + Ce + "]",
              qe = "[" + Ee + "]",
              je = "[^" + ke + Le + Ne + Ce + Ee + Te + "]",
              Ue = "\\ud83c[\\udffb-\\udfff]",
              Fe = "[^" + ke + "]",
              We = "(?:\\ud83c[\\udde6-\\uddff]){2}",
              ze = "[\\ud800-\\udbff][\\udc00-\\udfff]",
              Be = "[" + Te + "]",
              He = "\\u200d",
              $e = "(?:" + qe + "|" + je + ")",
              Ge = "(?:" + Be + "|" + je + ")",
              Ve = "(?:['\u2019](?:d|ll|m|re|s|t|ve))?",
              Ke = "(?:['\u2019](?:D|LL|M|RE|S|T|VE))?",
              Ye = "(?:" + Pe + "|" + Ue + ")" + "?",
              Qe = "[" + Ie + "]?",
              Ze =
                Qe +
                Ye +
                ("(?:" +
                  He +
                  "(?:" +
                  [Fe, We, ze].join("|") +
                  ")" +
                  Qe +
                  Ye +
                  ")*"),
              Je = "(?:" + [De, We, ze].join("|") + ")" + Ze,
              Xe = "(?:" + [Fe + Pe + "?", Pe, We, ze, Me].join("|") + ")",
              et = RegExp(Oe, "g"),
              tt = RegExp(Pe, "g"),
              nt = RegExp(Ue + "(?=" + Ue + ")|" + Xe + Ze, "g"),
              rt = RegExp(
                [
                  Be +
                    "?" +
                    qe +
                    "+" +
                    Ve +
                    "(?=" +
                    [Re, Be, "$"].join("|") +
                    ")",
                  Ge + "+" + Ke + "(?=" + [Re, Be + $e, "$"].join("|") + ")",
                  Be + "?" + $e + "+" + Ve,
                  Be + "+" + Ke,
                  "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])",
                  "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])",
                  Ne,
                  Je,
                ].join("|"),
                "g"
              ),
              ot = RegExp("[" + He + ke + Ae + Ie + "]"),
              it =
                /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/,
              at = [
                "Array",
                "Buffer",
                "DataView",
                "Date",
                "Error",
                "Float32Array",
                "Float64Array",
                "Function",
                "Int8Array",
                "Int16Array",
                "Int32Array",
                "Map",
                "Math",
                "Object",
                "Promise",
                "RegExp",
                "Set",
                "String",
                "Symbol",
                "TypeError",
                "Uint8Array",
                "Uint8ClampedArray",
                "Uint16Array",
                "Uint32Array",
                "WeakMap",
                "_",
                "clearTimeout",
                "isFinite",
                "parseInt",
                "setTimeout",
              ],
              st = -1,
              lt = {};
            (lt[D] =
              lt[q] =
              lt[j] =
              lt[U] =
              lt[F] =
              lt[W] =
              lt[z] =
              lt[B] =
              lt[H] =
                !0),
              (lt[y] =
                lt[b] =
                lt[P] =
                lt[w] =
                lt[N] =
                lt[_] =
                lt[x] =
                lt[S] =
                lt[A] =
                lt[C] =
                lt[E] =
                lt[I] =
                lt[L] =
                lt[O] =
                lt[R] =
                  !1);
            var ct = {};
            (ct[y] =
              ct[b] =
              ct[P] =
              ct[N] =
              ct[w] =
              ct[_] =
              ct[D] =
              ct[q] =
              ct[j] =
              ct[U] =
              ct[F] =
              ct[A] =
              ct[C] =
              ct[E] =
              ct[I] =
              ct[L] =
              ct[O] =
              ct[M] =
              ct[W] =
              ct[z] =
              ct[B] =
              ct[H] =
                !0),
              (ct[x] = ct[S] = ct[R] = !1);
            var ut = {
                "\\": "\\",
                "'": "'",
                "\n": "n",
                "\r": "r",
                "\u2028": "u2028",
                "\u2029": "u2029",
              },
              dt = parseFloat,
              ht = parseInt,
              pt =
                "object" == typeof n.g && n.g && n.g.Object === Object && n.g,
              ft =
                "object" == typeof self &&
                self &&
                self.Object === Object &&
                self,
              gt = pt || ft || Function("return this")(),
              mt = t && !t.nodeType && t,
              vt = mt && e && !e.nodeType && e,
              yt = vt && vt.exports === mt,
              bt = yt && pt.process,
              wt = (function () {
                try {
                  var e = vt && vt.require && vt.require("util").types;
                  return e || (bt && bt.binding && bt.binding("util"));
                } catch (t) {}
              })(),
              _t = wt && wt.isArrayBuffer,
              xt = wt && wt.isDate,
              St = wt && wt.isMap,
              kt = wt && wt.isRegExp,
              At = wt && wt.isSet,
              Ct = wt && wt.isTypedArray;
            function Et(e, t, n) {
              switch (n.length) {
                case 0:
                  return e.call(t);
                case 1:
                  return e.call(t, n[0]);
                case 2:
                  return e.call(t, n[0], n[1]);
                case 3:
                  return e.call(t, n[0], n[1], n[2]);
              }
              return e.apply(t, n);
            }
            function Tt(e, t, n, r) {
              for (var o = -1, i = null == e ? 0 : e.length; ++o < i; ) {
                var a = e[o];
                t(r, a, n(a), e);
              }
              return r;
            }
            function It(e, t) {
              for (
                var n = -1, r = null == e ? 0 : e.length;
                ++n < r && !1 !== t(e[n], n, e);

              );
              return e;
            }
            function Lt(e, t) {
              for (
                var n = null == e ? 0 : e.length;
                n-- && !1 !== t(e[n], n, e);

              );
              return e;
            }
            function Ot(e, t) {
              for (var n = -1, r = null == e ? 0 : e.length; ++n < r; )
                if (!t(e[n], n, e)) return !1;
              return !0;
            }
            function Mt(e, t) {
              for (
                var n = -1, r = null == e ? 0 : e.length, o = 0, i = [];
                ++n < r;

              ) {
                var a = e[n];
                t(a, n, e) && (i[o++] = a);
              }
              return i;
            }
            function Rt(e, t) {
              return !!(null == e ? 0 : e.length) && Bt(e, t, 0) > -1;
            }
            function Pt(e, t, n) {
              for (var r = -1, o = null == e ? 0 : e.length; ++r < o; )
                if (n(t, e[r])) return !0;
              return !1;
            }
            function Nt(e, t) {
              for (
                var n = -1, r = null == e ? 0 : e.length, o = Array(r);
                ++n < r;

              )
                o[n] = t(e[n], n, e);
              return o;
            }
            function Dt(e, t) {
              for (var n = -1, r = t.length, o = e.length; ++n < r; )
                e[o + n] = t[n];
              return e;
            }
            function qt(e, t, n, r) {
              var o = -1,
                i = null == e ? 0 : e.length;
              for (r && i && (n = e[++o]); ++o < i; ) n = t(n, e[o], o, e);
              return n;
            }
            function jt(e, t, n, r) {
              var o = null == e ? 0 : e.length;
              for (r && o && (n = e[--o]); o--; ) n = t(n, e[o], o, e);
              return n;
            }
            function Ut(e, t) {
              for (var n = -1, r = null == e ? 0 : e.length; ++n < r; )
                if (t(e[n], n, e)) return !0;
              return !1;
            }
            var Ft = Vt("length");
            function Wt(e, t, n) {
              var r;
              return (
                n(e, function (e, n, o) {
                  if (t(e, n, o)) return (r = n), !1;
                }),
                r
              );
            }
            function zt(e, t, n, r) {
              for (var o = e.length, i = n + (r ? 1 : -1); r ? i-- : ++i < o; )
                if (t(e[i], i, e)) return i;
              return -1;
            }
            function Bt(e, t, n) {
              return t === t
                ? (function (e, t, n) {
                    var r = n - 1,
                      o = e.length;
                    for (; ++r < o; ) if (e[r] === t) return r;
                    return -1;
                  })(e, t, n)
                : zt(e, $t, n);
            }
            function Ht(e, t, n, r) {
              for (var o = n - 1, i = e.length; ++o < i; )
                if (r(e[o], t)) return o;
              return -1;
            }
            function $t(e) {
              return e !== e;
            }
            function Gt(e, t) {
              var n = null == e ? 0 : e.length;
              return n ? Qt(e, t) / n : g;
            }
            function Vt(e) {
              return function (t) {
                return null == t ? o : t[e];
              };
            }
            function Kt(e) {
              return function (t) {
                return null == e ? o : e[t];
              };
            }
            function Yt(e, t, n, r, o) {
              return (
                o(e, function (e, o, i) {
                  n = r ? ((r = !1), e) : t(n, e, o, i);
                }),
                n
              );
            }
            function Qt(e, t) {
              for (var n, r = -1, i = e.length; ++r < i; ) {
                var a = t(e[r]);
                a !== o && (n = n === o ? a : n + a);
              }
              return n;
            }
            function Zt(e, t) {
              for (var n = -1, r = Array(e); ++n < e; ) r[n] = t(n);
              return r;
            }
            function Jt(e) {
              return e ? e.slice(0, mn(e) + 1).replace(ae, "") : e;
            }
            function Xt(e) {
              return function (t) {
                return e(t);
              };
            }
            function en(e, t) {
              return Nt(t, function (t) {
                return e[t];
              });
            }
            function tn(e, t) {
              return e.has(t);
            }
            function nn(e, t) {
              for (var n = -1, r = e.length; ++n < r && Bt(t, e[n], 0) > -1; );
              return n;
            }
            function rn(e, t) {
              for (var n = e.length; n-- && Bt(t, e[n], 0) > -1; );
              return n;
            }
            var on = Kt({
                "\xc0": "A",
                "\xc1": "A",
                "\xc2": "A",
                "\xc3": "A",
                "\xc4": "A",
                "\xc5": "A",
                "\xe0": "a",
                "\xe1": "a",
                "\xe2": "a",
                "\xe3": "a",
                "\xe4": "a",
                "\xe5": "a",
                "\xc7": "C",
                "\xe7": "c",
                "\xd0": "D",
                "\xf0": "d",
                "\xc8": "E",
                "\xc9": "E",
                "\xca": "E",
                "\xcb": "E",
                "\xe8": "e",
                "\xe9": "e",
                "\xea": "e",
                "\xeb": "e",
                "\xcc": "I",
                "\xcd": "I",
                "\xce": "I",
                "\xcf": "I",
                "\xec": "i",
                "\xed": "i",
                "\xee": "i",
                "\xef": "i",
                "\xd1": "N",
                "\xf1": "n",
                "\xd2": "O",
                "\xd3": "O",
                "\xd4": "O",
                "\xd5": "O",
                "\xd6": "O",
                "\xd8": "O",
                "\xf2": "o",
                "\xf3": "o",
                "\xf4": "o",
                "\xf5": "o",
                "\xf6": "o",
                "\xf8": "o",
                "\xd9": "U",
                "\xda": "U",
                "\xdb": "U",
                "\xdc": "U",
                "\xf9": "u",
                "\xfa": "u",
                "\xfb": "u",
                "\xfc": "u",
                "\xdd": "Y",
                "\xfd": "y",
                "\xff": "y",
                "\xc6": "Ae",
                "\xe6": "ae",
                "\xde": "Th",
                "\xfe": "th",
                "\xdf": "ss",
                "\u0100": "A",
                "\u0102": "A",
                "\u0104": "A",
                "\u0101": "a",
                "\u0103": "a",
                "\u0105": "a",
                "\u0106": "C",
                "\u0108": "C",
                "\u010a": "C",
                "\u010c": "C",
                "\u0107": "c",
                "\u0109": "c",
                "\u010b": "c",
                "\u010d": "c",
                "\u010e": "D",
                "\u0110": "D",
                "\u010f": "d",
                "\u0111": "d",
                "\u0112": "E",
                "\u0114": "E",
                "\u0116": "E",
                "\u0118": "E",
                "\u011a": "E",
                "\u0113": "e",
                "\u0115": "e",
                "\u0117": "e",
                "\u0119": "e",
                "\u011b": "e",
                "\u011c": "G",
                "\u011e": "G",
                "\u0120": "G",
                "\u0122": "G",
                "\u011d": "g",
                "\u011f": "g",
                "\u0121": "g",
                "\u0123": "g",
                "\u0124": "H",
                "\u0126": "H",
                "\u0125": "h",
                "\u0127": "h",
                "\u0128": "I",
                "\u012a": "I",
                "\u012c": "I",
                "\u012e": "I",
                "\u0130": "I",
                "\u0129": "i",
                "\u012b": "i",
                "\u012d": "i",
                "\u012f": "i",
                "\u0131": "i",
                "\u0134": "J",
                "\u0135": "j",
                "\u0136": "K",
                "\u0137": "k",
                "\u0138": "k",
                "\u0139": "L",
                "\u013b": "L",
                "\u013d": "L",
                "\u013f": "L",
                "\u0141": "L",
                "\u013a": "l",
                "\u013c": "l",
                "\u013e": "l",
                "\u0140": "l",
                "\u0142": "l",
                "\u0143": "N",
                "\u0145": "N",
                "\u0147": "N",
                "\u014a": "N",
                "\u0144": "n",
                "\u0146": "n",
                "\u0148": "n",
                "\u014b": "n",
                "\u014c": "O",
                "\u014e": "O",
                "\u0150": "O",
                "\u014d": "o",
                "\u014f": "o",
                "\u0151": "o",
                "\u0154": "R",
                "\u0156": "R",
                "\u0158": "R",
                "\u0155": "r",
                "\u0157": "r",
                "\u0159": "r",
                "\u015a": "S",
                "\u015c": "S",
                "\u015e": "S",
                "\u0160": "S",
                "\u015b": "s",
                "\u015d": "s",
                "\u015f": "s",
                "\u0161": "s",
                "\u0162": "T",
                "\u0164": "T",
                "\u0166": "T",
                "\u0163": "t",
                "\u0165": "t",
                "\u0167": "t",
                "\u0168": "U",
                "\u016a": "U",
                "\u016c": "U",
                "\u016e": "U",
                "\u0170": "U",
                "\u0172": "U",
                "\u0169": "u",
                "\u016b": "u",
                "\u016d": "u",
                "\u016f": "u",
                "\u0171": "u",
                "\u0173": "u",
                "\u0174": "W",
                "\u0175": "w",
                "\u0176": "Y",
                "\u0177": "y",
                "\u0178": "Y",
                "\u0179": "Z",
                "\u017b": "Z",
                "\u017d": "Z",
                "\u017a": "z",
                "\u017c": "z",
                "\u017e": "z",
                "\u0132": "IJ",
                "\u0133": "ij",
                "\u0152": "Oe",
                "\u0153": "oe",
                "\u0149": "'n",
                "\u017f": "s",
              }),
              an = Kt({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;",
              });
            function sn(e) {
              return "\\" + ut[e];
            }
            function ln(e) {
              return ot.test(e);
            }
            function cn(e) {
              var t = -1,
                n = Array(e.size);
              return (
                e.forEach(function (e, r) {
                  n[++t] = [r, e];
                }),
                n
              );
            }
            function un(e, t) {
              return function (n) {
                return e(t(n));
              };
            }
            function dn(e, t) {
              for (var n = -1, r = e.length, o = 0, i = []; ++n < r; ) {
                var a = e[n];
                (a !== t && a !== s) || ((e[n] = s), (i[o++] = n));
              }
              return i;
            }
            function hn(e) {
              var t = -1,
                n = Array(e.size);
              return (
                e.forEach(function (e) {
                  n[++t] = e;
                }),
                n
              );
            }
            function pn(e) {
              var t = -1,
                n = Array(e.size);
              return (
                e.forEach(function (e) {
                  n[++t] = [e, e];
                }),
                n
              );
            }
            function fn(e) {
              return ln(e)
                ? (function (e) {
                    var t = (nt.lastIndex = 0);
                    for (; nt.test(e); ) ++t;
                    return t;
                  })(e)
                : Ft(e);
            }
            function gn(e) {
              return ln(e)
                ? (function (e) {
                    return e.match(nt) || [];
                  })(e)
                : (function (e) {
                    return e.split("");
                  })(e);
            }
            function mn(e) {
              for (var t = e.length; t-- && se.test(e.charAt(t)); );
              return t;
            }
            var vn = Kt({
              "&amp;": "&",
              "&lt;": "<",
              "&gt;": ">",
              "&quot;": '"',
              "&#39;": "'",
            });
            var yn = (function e(t) {
              var n = (t =
                  null == t ? gt : yn.defaults(gt.Object(), t, yn.pick(gt, at)))
                  .Array,
                r = t.Date,
                se = t.Error,
                ke = t.Function,
                Ae = t.Math,
                Ce = t.Object,
                Ee = t.RegExp,
                Te = t.String,
                Ie = t.TypeError,
                Le = n.prototype,
                Oe = ke.prototype,
                Me = Ce.prototype,
                Re = t["__core-js_shared__"],
                Pe = Oe.toString,
                Ne = Me.hasOwnProperty,
                De = 0,
                qe = (function () {
                  var e = /[^.]+$/.exec(
                    (Re && Re.keys && Re.keys.IE_PROTO) || ""
                  );
                  return e ? "Symbol(src)_1." + e : "";
                })(),
                je = Me.toString,
                Ue = Pe.call(Ce),
                Fe = gt._,
                We = Ee(
                  "^" +
                    Pe.call(Ne)
                      .replace(oe, "\\$&")
                      .replace(
                        /hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,
                        "$1.*?"
                      ) +
                    "$"
                ),
                ze = yt ? t.Buffer : o,
                Be = t.Symbol,
                He = t.Uint8Array,
                $e = ze ? ze.allocUnsafe : o,
                Ge = un(Ce.getPrototypeOf, Ce),
                Ve = Ce.create,
                Ke = Me.propertyIsEnumerable,
                Ye = Le.splice,
                Qe = Be ? Be.isConcatSpreadable : o,
                Ze = Be ? Be.iterator : o,
                Je = Be ? Be.toStringTag : o,
                Xe = (function () {
                  try {
                    var e = hi(Ce, "defineProperty");
                    return e({}, "", {}), e;
                  } catch (t) {}
                })(),
                nt = t.clearTimeout !== gt.clearTimeout && t.clearTimeout,
                ot = r && r.now !== gt.Date.now && r.now,
                ut = t.setTimeout !== gt.setTimeout && t.setTimeout,
                pt = Ae.ceil,
                ft = Ae.floor,
                mt = Ce.getOwnPropertySymbols,
                vt = ze ? ze.isBuffer : o,
                bt = t.isFinite,
                wt = Le.join,
                Ft = un(Ce.keys, Ce),
                Kt = Ae.max,
                bn = Ae.min,
                wn = r.now,
                _n = t.parseInt,
                xn = Ae.random,
                Sn = Le.reverse,
                kn = hi(t, "DataView"),
                An = hi(t, "Map"),
                Cn = hi(t, "Promise"),
                En = hi(t, "Set"),
                Tn = hi(t, "WeakMap"),
                In = hi(Ce, "create"),
                Ln = Tn && new Tn(),
                On = {},
                Mn = ji(kn),
                Rn = ji(An),
                Pn = ji(Cn),
                Nn = ji(En),
                Dn = ji(Tn),
                qn = Be ? Be.prototype : o,
                jn = qn ? qn.valueOf : o,
                Un = qn ? qn.toString : o;
              function Fn(e) {
                if (ts(e) && !Ha(e) && !(e instanceof Hn)) {
                  if (e instanceof Bn) return e;
                  if (Ne.call(e, "__wrapped__")) return Ui(e);
                }
                return new Bn(e);
              }
              var Wn = (function () {
                function e() {}
                return function (t) {
                  if (!es(t)) return {};
                  if (Ve) return Ve(t);
                  e.prototype = t;
                  var n = new e();
                  return (e.prototype = o), n;
                };
              })();
              function zn() {}
              function Bn(e, t) {
                (this.__wrapped__ = e),
                  (this.__actions__ = []),
                  (this.__chain__ = !!t),
                  (this.__index__ = 0),
                  (this.__values__ = o);
              }
              function Hn(e) {
                (this.__wrapped__ = e),
                  (this.__actions__ = []),
                  (this.__dir__ = 1),
                  (this.__filtered__ = !1),
                  (this.__iteratees__ = []),
                  (this.__takeCount__ = m),
                  (this.__views__ = []);
              }
              function $n(e) {
                var t = -1,
                  n = null == e ? 0 : e.length;
                for (this.clear(); ++t < n; ) {
                  var r = e[t];
                  this.set(r[0], r[1]);
                }
              }
              function Gn(e) {
                var t = -1,
                  n = null == e ? 0 : e.length;
                for (this.clear(); ++t < n; ) {
                  var r = e[t];
                  this.set(r[0], r[1]);
                }
              }
              function Vn(e) {
                var t = -1,
                  n = null == e ? 0 : e.length;
                for (this.clear(); ++t < n; ) {
                  var r = e[t];
                  this.set(r[0], r[1]);
                }
              }
              function Kn(e) {
                var t = -1,
                  n = null == e ? 0 : e.length;
                for (this.__data__ = new Vn(); ++t < n; ) this.add(e[t]);
              }
              function Yn(e) {
                var t = (this.__data__ = new Gn(e));
                this.size = t.size;
              }
              function Qn(e, t) {
                var n = Ha(e),
                  r = !n && Ba(e),
                  o = !n && !r && Ka(e),
                  i = !n && !r && !o && cs(e),
                  a = n || r || o || i,
                  s = a ? Zt(e.length, Te) : [],
                  l = s.length;
                for (var c in e)
                  (!t && !Ne.call(e, c)) ||
                    (a &&
                      ("length" == c ||
                        (o && ("offset" == c || "parent" == c)) ||
                        (i &&
                          ("buffer" == c ||
                            "byteLength" == c ||
                            "byteOffset" == c)) ||
                        bi(c, l))) ||
                    s.push(c);
                return s;
              }
              function Zn(e) {
                var t = e.length;
                return t ? e[Kr(0, t - 1)] : o;
              }
              function Jn(e, t) {
                return Ni(Lo(e), sr(t, 0, e.length));
              }
              function Xn(e) {
                return Ni(Lo(e));
              }
              function er(e, t, n) {
                ((n !== o && !Fa(e[t], n)) || (n === o && !(t in e))) &&
                  ir(e, t, n);
              }
              function tr(e, t, n) {
                var r = e[t];
                (Ne.call(e, t) && Fa(r, n) && (n !== o || t in e)) ||
                  ir(e, t, n);
              }
              function nr(e, t) {
                for (var n = e.length; n--; ) if (Fa(e[n][0], t)) return n;
                return -1;
              }
              function rr(e, t, n, r) {
                return (
                  hr(e, function (e, o, i) {
                    t(r, e, n(e), i);
                  }),
                  r
                );
              }
              function or(e, t) {
                return e && Oo(t, Os(t), e);
              }
              function ir(e, t, n) {
                "__proto__" == t && Xe
                  ? Xe(e, t, {
                      configurable: !0,
                      enumerable: !0,
                      value: n,
                      writable: !0,
                    })
                  : (e[t] = n);
              }
              function ar(e, t) {
                for (
                  var r = -1, i = t.length, a = n(i), s = null == e;
                  ++r < i;

                )
                  a[r] = s ? o : Cs(e, t[r]);
                return a;
              }
              function sr(e, t, n) {
                return (
                  e === e &&
                    (n !== o && (e = e <= n ? e : n),
                    t !== o && (e = e >= t ? e : t)),
                  e
                );
              }
              function lr(e, t, n, r, i, a) {
                var s,
                  l = 1 & t,
                  c = 2 & t,
                  u = 4 & t;
                if ((n && (s = i ? n(e, r, i, a) : n(e)), s !== o)) return s;
                if (!es(e)) return e;
                var d = Ha(e);
                if (d) {
                  if (
                    ((s = (function (e) {
                      var t = e.length,
                        n = new e.constructor(t);
                      t &&
                        "string" == typeof e[0] &&
                        Ne.call(e, "index") &&
                        ((n.index = e.index), (n.input = e.input));
                      return n;
                    })(e)),
                    !l)
                  )
                    return Lo(e, s);
                } else {
                  var h = gi(e),
                    p = h == S || h == k;
                  if (Ka(e)) return ko(e, l);
                  if (h == E || h == y || (p && !i)) {
                    if (((s = c || p ? {} : vi(e)), !l))
                      return c
                        ? (function (e, t) {
                            return Oo(e, fi(e), t);
                          })(
                            e,
                            (function (e, t) {
                              return e && Oo(t, Ms(t), e);
                            })(s, e)
                          )
                        : (function (e, t) {
                            return Oo(e, pi(e), t);
                          })(e, or(s, e));
                  } else {
                    if (!ct[h]) return i ? e : {};
                    s = (function (e, t, n) {
                      var r = e.constructor;
                      switch (t) {
                        case P:
                          return Ao(e);
                        case w:
                        case _:
                          return new r(+e);
                        case N:
                          return (function (e, t) {
                            var n = t ? Ao(e.buffer) : e.buffer;
                            return new e.constructor(
                              n,
                              e.byteOffset,
                              e.byteLength
                            );
                          })(e, n);
                        case D:
                        case q:
                        case j:
                        case U:
                        case F:
                        case W:
                        case z:
                        case B:
                        case H:
                          return Co(e, n);
                        case A:
                          return new r();
                        case C:
                        case O:
                          return new r(e);
                        case I:
                          return (function (e) {
                            var t = new e.constructor(e.source, ge.exec(e));
                            return (t.lastIndex = e.lastIndex), t;
                          })(e);
                        case L:
                          return new r();
                        case M:
                          return (o = e), jn ? Ce(jn.call(o)) : {};
                      }
                      var o;
                    })(e, h, l);
                  }
                }
                a || (a = new Yn());
                var f = a.get(e);
                if (f) return f;
                a.set(e, s),
                  as(e)
                    ? e.forEach(function (r) {
                        s.add(lr(r, t, n, r, e, a));
                      })
                    : ns(e) &&
                      e.forEach(function (r, o) {
                        s.set(o, lr(r, t, n, o, e, a));
                      });
                var g = d ? o : (u ? (c ? ii : oi) : c ? Ms : Os)(e);
                return (
                  It(g || e, function (r, o) {
                    g && (r = e[(o = r)]), tr(s, o, lr(r, t, n, o, e, a));
                  }),
                  s
                );
              }
              function cr(e, t, n) {
                var r = n.length;
                if (null == e) return !r;
                for (e = Ce(e); r--; ) {
                  var i = n[r],
                    a = t[i],
                    s = e[i];
                  if ((s === o && !(i in e)) || !a(s)) return !1;
                }
                return !0;
              }
              function ur(e, t, n) {
                if ("function" != typeof e) throw new Ie(i);
                return Oi(function () {
                  e.apply(o, n);
                }, t);
              }
              function dr(e, t, n, r) {
                var o = -1,
                  i = Rt,
                  a = !0,
                  s = e.length,
                  l = [],
                  c = t.length;
                if (!s) return l;
                n && (t = Nt(t, Xt(n))),
                  r
                    ? ((i = Pt), (a = !1))
                    : t.length >= 200 && ((i = tn), (a = !1), (t = new Kn(t)));
                e: for (; ++o < s; ) {
                  var u = e[o],
                    d = null == n ? u : n(u);
                  if (((u = r || 0 !== u ? u : 0), a && d === d)) {
                    for (var h = c; h--; ) if (t[h] === d) continue e;
                    l.push(u);
                  } else i(t, d, r) || l.push(u);
                }
                return l;
              }
              (Fn.templateSettings = {
                escape: J,
                evaluate: X,
                interpolate: ee,
                variable: "",
                imports: { _: Fn },
              }),
                (Fn.prototype = zn.prototype),
                (Fn.prototype.constructor = Fn),
                (Bn.prototype = Wn(zn.prototype)),
                (Bn.prototype.constructor = Bn),
                (Hn.prototype = Wn(zn.prototype)),
                (Hn.prototype.constructor = Hn),
                ($n.prototype.clear = function () {
                  (this.__data__ = In ? In(null) : {}), (this.size = 0);
                }),
                ($n.prototype.delete = function (e) {
                  var t = this.has(e) && delete this.__data__[e];
                  return (this.size -= t ? 1 : 0), t;
                }),
                ($n.prototype.get = function (e) {
                  var t = this.__data__;
                  if (In) {
                    var n = t[e];
                    return n === a ? o : n;
                  }
                  return Ne.call(t, e) ? t[e] : o;
                }),
                ($n.prototype.has = function (e) {
                  var t = this.__data__;
                  return In ? t[e] !== o : Ne.call(t, e);
                }),
                ($n.prototype.set = function (e, t) {
                  var n = this.__data__;
                  return (
                    (this.size += this.has(e) ? 0 : 1),
                    (n[e] = In && t === o ? a : t),
                    this
                  );
                }),
                (Gn.prototype.clear = function () {
                  (this.__data__ = []), (this.size = 0);
                }),
                (Gn.prototype.delete = function (e) {
                  var t = this.__data__,
                    n = nr(t, e);
                  return (
                    !(n < 0) &&
                    (n == t.length - 1 ? t.pop() : Ye.call(t, n, 1),
                    --this.size,
                    !0)
                  );
                }),
                (Gn.prototype.get = function (e) {
                  var t = this.__data__,
                    n = nr(t, e);
                  return n < 0 ? o : t[n][1];
                }),
                (Gn.prototype.has = function (e) {
                  return nr(this.__data__, e) > -1;
                }),
                (Gn.prototype.set = function (e, t) {
                  var n = this.__data__,
                    r = nr(n, e);
                  return (
                    r < 0 ? (++this.size, n.push([e, t])) : (n[r][1] = t), this
                  );
                }),
                (Vn.prototype.clear = function () {
                  (this.size = 0),
                    (this.__data__ = {
                      hash: new $n(),
                      map: new (An || Gn)(),
                      string: new $n(),
                    });
                }),
                (Vn.prototype.delete = function (e) {
                  var t = ui(this, e).delete(e);
                  return (this.size -= t ? 1 : 0), t;
                }),
                (Vn.prototype.get = function (e) {
                  return ui(this, e).get(e);
                }),
                (Vn.prototype.has = function (e) {
                  return ui(this, e).has(e);
                }),
                (Vn.prototype.set = function (e, t) {
                  var n = ui(this, e),
                    r = n.size;
                  return n.set(e, t), (this.size += n.size == r ? 0 : 1), this;
                }),
                (Kn.prototype.add = Kn.prototype.push =
                  function (e) {
                    return this.__data__.set(e, a), this;
                  }),
                (Kn.prototype.has = function (e) {
                  return this.__data__.has(e);
                }),
                (Yn.prototype.clear = function () {
                  (this.__data__ = new Gn()), (this.size = 0);
                }),
                (Yn.prototype.delete = function (e) {
                  var t = this.__data__,
                    n = t.delete(e);
                  return (this.size = t.size), n;
                }),
                (Yn.prototype.get = function (e) {
                  return this.__data__.get(e);
                }),
                (Yn.prototype.has = function (e) {
                  return this.__data__.has(e);
                }),
                (Yn.prototype.set = function (e, t) {
                  var n = this.__data__;
                  if (n instanceof Gn) {
                    var r = n.__data__;
                    if (!An || r.length < 199)
                      return r.push([e, t]), (this.size = ++n.size), this;
                    n = this.__data__ = new Vn(r);
                  }
                  return n.set(e, t), (this.size = n.size), this;
                });
              var hr = Po(wr),
                pr = Po(_r, !0);
              function fr(e, t) {
                var n = !0;
                return (
                  hr(e, function (e, r, o) {
                    return (n = !!t(e, r, o));
                  }),
                  n
                );
              }
              function gr(e, t, n) {
                for (var r = -1, i = e.length; ++r < i; ) {
                  var a = e[r],
                    s = t(a);
                  if (null != s && (l === o ? s === s && !ls(s) : n(s, l)))
                    var l = s,
                      c = a;
                }
                return c;
              }
              function mr(e, t) {
                var n = [];
                return (
                  hr(e, function (e, r, o) {
                    t(e, r, o) && n.push(e);
                  }),
                  n
                );
              }
              function vr(e, t, n, r, o) {
                var i = -1,
                  a = e.length;
                for (n || (n = yi), o || (o = []); ++i < a; ) {
                  var s = e[i];
                  t > 0 && n(s)
                    ? t > 1
                      ? vr(s, t - 1, n, r, o)
                      : Dt(o, s)
                    : r || (o[o.length] = s);
                }
                return o;
              }
              var yr = No(),
                br = No(!0);
              function wr(e, t) {
                return e && yr(e, t, Os);
              }
              function _r(e, t) {
                return e && br(e, t, Os);
              }
              function xr(e, t) {
                return Mt(t, function (t) {
                  return Za(e[t]);
                });
              }
              function Sr(e, t) {
                for (var n = 0, r = (t = wo(t, e)).length; null != e && n < r; )
                  e = e[qi(t[n++])];
                return n && n == r ? e : o;
              }
              function kr(e, t, n) {
                var r = t(e);
                return Ha(e) ? r : Dt(r, n(e));
              }
              function Ar(e) {
                return null == e
                  ? e === o
                    ? "[object Undefined]"
                    : "[object Null]"
                  : Je && Je in Ce(e)
                  ? (function (e) {
                      var t = Ne.call(e, Je),
                        n = e[Je];
                      try {
                        e[Je] = o;
                        var r = !0;
                      } catch (a) {}
                      var i = je.call(e);
                      r && (t ? (e[Je] = n) : delete e[Je]);
                      return i;
                    })(e)
                  : (function (e) {
                      return je.call(e);
                    })(e);
              }
              function Cr(e, t) {
                return e > t;
              }
              function Er(e, t) {
                return null != e && Ne.call(e, t);
              }
              function Tr(e, t) {
                return null != e && t in Ce(e);
              }
              function Ir(e, t, r) {
                for (
                  var i = r ? Pt : Rt,
                    a = e[0].length,
                    s = e.length,
                    l = s,
                    c = n(s),
                    u = 1 / 0,
                    d = [];
                  l--;

                ) {
                  var h = e[l];
                  l && t && (h = Nt(h, Xt(t))),
                    (u = bn(h.length, u)),
                    (c[l] =
                      !r && (t || (a >= 120 && h.length >= 120))
                        ? new Kn(l && h)
                        : o);
                }
                h = e[0];
                var p = -1,
                  f = c[0];
                e: for (; ++p < a && d.length < u; ) {
                  var g = h[p],
                    m = t ? t(g) : g;
                  if (
                    ((g = r || 0 !== g ? g : 0), !(f ? tn(f, m) : i(d, m, r)))
                  ) {
                    for (l = s; --l; ) {
                      var v = c[l];
                      if (!(v ? tn(v, m) : i(e[l], m, r))) continue e;
                    }
                    f && f.push(m), d.push(g);
                  }
                }
                return d;
              }
              function Lr(e, t, n) {
                var r = null == (e = Ti(e, (t = wo(t, e)))) ? e : e[qi(Qi(t))];
                return null == r ? o : Et(r, e, n);
              }
              function Or(e) {
                return ts(e) && Ar(e) == y;
              }
              function Mr(e, t, n, r, i) {
                return (
                  e === t ||
                  (null == e || null == t || (!ts(e) && !ts(t))
                    ? e !== e && t !== t
                    : (function (e, t, n, r, i, a) {
                        var s = Ha(e),
                          l = Ha(t),
                          c = s ? b : gi(e),
                          u = l ? b : gi(t),
                          d = (c = c == y ? E : c) == E,
                          h = (u = u == y ? E : u) == E,
                          p = c == u;
                        if (p && Ka(e)) {
                          if (!Ka(t)) return !1;
                          (s = !0), (d = !1);
                        }
                        if (p && !d)
                          return (
                            a || (a = new Yn()),
                            s || cs(e)
                              ? ni(e, t, n, r, i, a)
                              : (function (e, t, n, r, o, i, a) {
                                  switch (n) {
                                    case N:
                                      if (
                                        e.byteLength != t.byteLength ||
                                        e.byteOffset != t.byteOffset
                                      )
                                        return !1;
                                      (e = e.buffer), (t = t.buffer);
                                    case P:
                                      return !(
                                        e.byteLength != t.byteLength ||
                                        !i(new He(e), new He(t))
                                      );
                                    case w:
                                    case _:
                                    case C:
                                      return Fa(+e, +t);
                                    case x:
                                      return (
                                        e.name == t.name &&
                                        e.message == t.message
                                      );
                                    case I:
                                    case O:
                                      return e == t + "";
                                    case A:
                                      var s = cn;
                                    case L:
                                      var l = 1 & r;
                                      if (
                                        (s || (s = hn), e.size != t.size && !l)
                                      )
                                        return !1;
                                      var c = a.get(e);
                                      if (c) return c == t;
                                      (r |= 2), a.set(e, t);
                                      var u = ni(s(e), s(t), r, o, i, a);
                                      return a.delete(e), u;
                                    case M:
                                      if (jn) return jn.call(e) == jn.call(t);
                                  }
                                  return !1;
                                })(e, t, c, n, r, i, a)
                          );
                        if (!(1 & n)) {
                          var f = d && Ne.call(e, "__wrapped__"),
                            g = h && Ne.call(t, "__wrapped__");
                          if (f || g) {
                            var m = f ? e.value() : e,
                              v = g ? t.value() : t;
                            return a || (a = new Yn()), i(m, v, n, r, a);
                          }
                        }
                        if (!p) return !1;
                        return (
                          a || (a = new Yn()),
                          (function (e, t, n, r, i, a) {
                            var s = 1 & n,
                              l = oi(e),
                              c = l.length,
                              u = oi(t),
                              d = u.length;
                            if (c != d && !s) return !1;
                            var h = c;
                            for (; h--; ) {
                              var p = l[h];
                              if (!(s ? p in t : Ne.call(t, p))) return !1;
                            }
                            var f = a.get(e),
                              g = a.get(t);
                            if (f && g) return f == t && g == e;
                            var m = !0;
                            a.set(e, t), a.set(t, e);
                            var v = s;
                            for (; ++h < c; ) {
                              var y = e[(p = l[h])],
                                b = t[p];
                              if (r)
                                var w = s
                                  ? r(b, y, p, t, e, a)
                                  : r(y, b, p, e, t, a);
                              if (
                                !(w === o ? y === b || i(y, b, n, r, a) : w)
                              ) {
                                m = !1;
                                break;
                              }
                              v || (v = "constructor" == p);
                            }
                            if (m && !v) {
                              var _ = e.constructor,
                                x = t.constructor;
                              _ == x ||
                                !("constructor" in e) ||
                                !("constructor" in t) ||
                                ("function" == typeof _ &&
                                  _ instanceof _ &&
                                  "function" == typeof x &&
                                  x instanceof x) ||
                                (m = !1);
                            }
                            return a.delete(e), a.delete(t), m;
                          })(e, t, n, r, i, a)
                        );
                      })(e, t, n, r, Mr, i))
                );
              }
              function Rr(e, t, n, r) {
                var i = n.length,
                  a = i,
                  s = !r;
                if (null == e) return !a;
                for (e = Ce(e); i--; ) {
                  var l = n[i];
                  if (s && l[2] ? l[1] !== e[l[0]] : !(l[0] in e)) return !1;
                }
                for (; ++i < a; ) {
                  var c = (l = n[i])[0],
                    u = e[c],
                    d = l[1];
                  if (s && l[2]) {
                    if (u === o && !(c in e)) return !1;
                  } else {
                    var h = new Yn();
                    if (r) var p = r(u, d, c, e, t, h);
                    if (!(p === o ? Mr(d, u, 3, r, h) : p)) return !1;
                  }
                }
                return !0;
              }
              function Pr(e) {
                return (
                  !(!es(e) || ((t = e), qe && qe in t)) &&
                  (Za(e) ? We : ye).test(ji(e))
                );
                var t;
              }
              function Nr(e) {
                return "function" == typeof e
                  ? e
                  : null == e
                  ? rl
                  : "object" == typeof e
                  ? Ha(e)
                    ? Wr(e[0], e[1])
                    : Fr(e)
                  : hl(e);
              }
              function Dr(e) {
                if (!ki(e)) return Ft(e);
                var t = [];
                for (var n in Ce(e))
                  Ne.call(e, n) && "constructor" != n && t.push(n);
                return t;
              }
              function qr(e) {
                if (!es(e))
                  return (function (e) {
                    var t = [];
                    if (null != e) for (var n in Ce(e)) t.push(n);
                    return t;
                  })(e);
                var t = ki(e),
                  n = [];
                for (var r in e)
                  ("constructor" != r || (!t && Ne.call(e, r))) && n.push(r);
                return n;
              }
              function jr(e, t) {
                return e < t;
              }
              function Ur(e, t) {
                var r = -1,
                  o = Ga(e) ? n(e.length) : [];
                return (
                  hr(e, function (e, n, i) {
                    o[++r] = t(e, n, i);
                  }),
                  o
                );
              }
              function Fr(e) {
                var t = di(e);
                return 1 == t.length && t[0][2]
                  ? Ci(t[0][0], t[0][1])
                  : function (n) {
                      return n === e || Rr(n, e, t);
                    };
              }
              function Wr(e, t) {
                return _i(e) && Ai(t)
                  ? Ci(qi(e), t)
                  : function (n) {
                      var r = Cs(n, e);
                      return r === o && r === t ? Es(n, e) : Mr(t, r, 3);
                    };
              }
              function zr(e, t, n, r, i) {
                e !== t &&
                  yr(
                    t,
                    function (a, s) {
                      if ((i || (i = new Yn()), es(a)))
                        !(function (e, t, n, r, i, a, s) {
                          var l = Ii(e, n),
                            c = Ii(t, n),
                            u = s.get(c);
                          if (u) return void er(e, n, u);
                          var d = a ? a(l, c, n + "", e, t, s) : o,
                            h = d === o;
                          if (h) {
                            var p = Ha(c),
                              f = !p && Ka(c),
                              g = !p && !f && cs(c);
                            (d = c),
                              p || f || g
                                ? Ha(l)
                                  ? (d = l)
                                  : Va(l)
                                  ? (d = Lo(l))
                                  : f
                                  ? ((h = !1), (d = ko(c, !0)))
                                  : g
                                  ? ((h = !1), (d = Co(c, !0)))
                                  : (d = [])
                                : os(c) || Ba(c)
                                ? ((d = l),
                                  Ba(l)
                                    ? (d = vs(l))
                                    : (es(l) && !Za(l)) || (d = vi(c)))
                                : (h = !1);
                          }
                          h && (s.set(c, d), i(d, c, r, a, s), s.delete(c));
                          er(e, n, d);
                        })(e, t, s, n, zr, r, i);
                      else {
                        var l = r ? r(Ii(e, s), a, s + "", e, t, i) : o;
                        l === o && (l = a), er(e, s, l);
                      }
                    },
                    Ms
                  );
              }
              function Br(e, t) {
                var n = e.length;
                if (n) return bi((t += t < 0 ? n : 0), n) ? e[t] : o;
              }
              function Hr(e, t, n) {
                t = t.length
                  ? Nt(t, function (e) {
                      return Ha(e)
                        ? function (t) {
                            return Sr(t, 1 === e.length ? e[0] : e);
                          }
                        : e;
                    })
                  : [rl];
                var r = -1;
                t = Nt(t, Xt(ci()));
                var o = Ur(e, function (e, n, o) {
                  var i = Nt(t, function (t) {
                    return t(e);
                  });
                  return { criteria: i, index: ++r, value: e };
                });
                return (function (e, t) {
                  var n = e.length;
                  for (e.sort(t); n--; ) e[n] = e[n].value;
                  return e;
                })(o, function (e, t) {
                  return (function (e, t, n) {
                    var r = -1,
                      o = e.criteria,
                      i = t.criteria,
                      a = o.length,
                      s = n.length;
                    for (; ++r < a; ) {
                      var l = Eo(o[r], i[r]);
                      if (l) return r >= s ? l : l * ("desc" == n[r] ? -1 : 1);
                    }
                    return e.index - t.index;
                  })(e, t, n);
                });
              }
              function $r(e, t, n) {
                for (var r = -1, o = t.length, i = {}; ++r < o; ) {
                  var a = t[r],
                    s = Sr(e, a);
                  n(s, a) && Xr(i, wo(a, e), s);
                }
                return i;
              }
              function Gr(e, t, n, r) {
                var o = r ? Ht : Bt,
                  i = -1,
                  a = t.length,
                  s = e;
                for (e === t && (t = Lo(t)), n && (s = Nt(e, Xt(n))); ++i < a; )
                  for (
                    var l = 0, c = t[i], u = n ? n(c) : c;
                    (l = o(s, u, l, r)) > -1;

                  )
                    s !== e && Ye.call(s, l, 1), Ye.call(e, l, 1);
                return e;
              }
              function Vr(e, t) {
                for (var n = e ? t.length : 0, r = n - 1; n--; ) {
                  var o = t[n];
                  if (n == r || o !== i) {
                    var i = o;
                    bi(o) ? Ye.call(e, o, 1) : ho(e, o);
                  }
                }
                return e;
              }
              function Kr(e, t) {
                return e + ft(xn() * (t - e + 1));
              }
              function Yr(e, t) {
                var n = "";
                if (!e || t < 1 || t > f) return n;
                do {
                  t % 2 && (n += e), (t = ft(t / 2)) && (e += e);
                } while (t);
                return n;
              }
              function Qr(e, t) {
                return Mi(Ei(e, t, rl), e + "");
              }
              function Zr(e) {
                return Zn(Fs(e));
              }
              function Jr(e, t) {
                var n = Fs(e);
                return Ni(n, sr(t, 0, n.length));
              }
              function Xr(e, t, n, r) {
                if (!es(e)) return e;
                for (
                  var i = -1, a = (t = wo(t, e)).length, s = a - 1, l = e;
                  null != l && ++i < a;

                ) {
                  var c = qi(t[i]),
                    u = n;
                  if (
                    "__proto__" === c ||
                    "constructor" === c ||
                    "prototype" === c
                  )
                    return e;
                  if (i != s) {
                    var d = l[c];
                    (u = r ? r(d, c, l) : o) === o &&
                      (u = es(d) ? d : bi(t[i + 1]) ? [] : {});
                  }
                  tr(l, c, u), (l = l[c]);
                }
                return e;
              }
              var eo = Ln
                  ? function (e, t) {
                      return Ln.set(e, t), e;
                    }
                  : rl,
                to = Xe
                  ? function (e, t) {
                      return Xe(e, "toString", {
                        configurable: !0,
                        enumerable: !1,
                        value: el(t),
                        writable: !0,
                      });
                    }
                  : rl;
              function no(e) {
                return Ni(Fs(e));
              }
              function ro(e, t, r) {
                var o = -1,
                  i = e.length;
                t < 0 && (t = -t > i ? 0 : i + t),
                  (r = r > i ? i : r) < 0 && (r += i),
                  (i = t > r ? 0 : (r - t) >>> 0),
                  (t >>>= 0);
                for (var a = n(i); ++o < i; ) a[o] = e[o + t];
                return a;
              }
              function oo(e, t) {
                var n;
                return (
                  hr(e, function (e, r, o) {
                    return !(n = t(e, r, o));
                  }),
                  !!n
                );
              }
              function io(e, t, n) {
                var r = 0,
                  o = null == e ? r : e.length;
                if ("number" == typeof t && t === t && o <= 2147483647) {
                  for (; r < o; ) {
                    var i = (r + o) >>> 1,
                      a = e[i];
                    null !== a && !ls(a) && (n ? a <= t : a < t)
                      ? (r = i + 1)
                      : (o = i);
                  }
                  return o;
                }
                return ao(e, t, rl, n);
              }
              function ao(e, t, n, r) {
                var i = 0,
                  a = null == e ? 0 : e.length;
                if (0 === a) return 0;
                for (
                  var s = (t = n(t)) !== t,
                    l = null === t,
                    c = ls(t),
                    u = t === o;
                  i < a;

                ) {
                  var d = ft((i + a) / 2),
                    h = n(e[d]),
                    p = h !== o,
                    f = null === h,
                    g = h === h,
                    m = ls(h);
                  if (s) var v = r || g;
                  else
                    v = u
                      ? g && (r || p)
                      : l
                      ? g && p && (r || !f)
                      : c
                      ? g && p && !f && (r || !m)
                      : !f && !m && (r ? h <= t : h < t);
                  v ? (i = d + 1) : (a = d);
                }
                return bn(a, 4294967294);
              }
              function so(e, t) {
                for (var n = -1, r = e.length, o = 0, i = []; ++n < r; ) {
                  var a = e[n],
                    s = t ? t(a) : a;
                  if (!n || !Fa(s, l)) {
                    var l = s;
                    i[o++] = 0 === a ? 0 : a;
                  }
                }
                return i;
              }
              function lo(e) {
                return "number" == typeof e ? e : ls(e) ? g : +e;
              }
              function co(e) {
                if ("string" == typeof e) return e;
                if (Ha(e)) return Nt(e, co) + "";
                if (ls(e)) return Un ? Un.call(e) : "";
                var t = e + "";
                return "0" == t && 1 / e == -1 / 0 ? "-0" : t;
              }
              function uo(e, t, n) {
                var r = -1,
                  o = Rt,
                  i = e.length,
                  a = !0,
                  s = [],
                  l = s;
                if (n) (a = !1), (o = Pt);
                else if (i >= 200) {
                  var c = t ? null : Qo(e);
                  if (c) return hn(c);
                  (a = !1), (o = tn), (l = new Kn());
                } else l = t ? [] : s;
                e: for (; ++r < i; ) {
                  var u = e[r],
                    d = t ? t(u) : u;
                  if (((u = n || 0 !== u ? u : 0), a && d === d)) {
                    for (var h = l.length; h--; ) if (l[h] === d) continue e;
                    t && l.push(d), s.push(u);
                  } else o(l, d, n) || (l !== s && l.push(d), s.push(u));
                }
                return s;
              }
              function ho(e, t) {
                return (
                  null == (e = Ti(e, (t = wo(t, e)))) || delete e[qi(Qi(t))]
                );
              }
              function po(e, t, n, r) {
                return Xr(e, t, n(Sr(e, t)), r);
              }
              function fo(e, t, n, r) {
                for (
                  var o = e.length, i = r ? o : -1;
                  (r ? i-- : ++i < o) && t(e[i], i, e);

                );
                return n
                  ? ro(e, r ? 0 : i, r ? i + 1 : o)
                  : ro(e, r ? i + 1 : 0, r ? o : i);
              }
              function go(e, t) {
                var n = e;
                return (
                  n instanceof Hn && (n = n.value()),
                  qt(
                    t,
                    function (e, t) {
                      return t.func.apply(t.thisArg, Dt([e], t.args));
                    },
                    n
                  )
                );
              }
              function mo(e, t, r) {
                var o = e.length;
                if (o < 2) return o ? uo(e[0]) : [];
                for (var i = -1, a = n(o); ++i < o; )
                  for (var s = e[i], l = -1; ++l < o; )
                    l != i && (a[i] = dr(a[i] || s, e[l], t, r));
                return uo(vr(a, 1), t, r);
              }
              function vo(e, t, n) {
                for (
                  var r = -1, i = e.length, a = t.length, s = {};
                  ++r < i;

                ) {
                  var l = r < a ? t[r] : o;
                  n(s, e[r], l);
                }
                return s;
              }
              function yo(e) {
                return Va(e) ? e : [];
              }
              function bo(e) {
                return "function" == typeof e ? e : rl;
              }
              function wo(e, t) {
                return Ha(e) ? e : _i(e, t) ? [e] : Di(ys(e));
              }
              var _o = Qr;
              function xo(e, t, n) {
                var r = e.length;
                return (n = n === o ? r : n), !t && n >= r ? e : ro(e, t, n);
              }
              var So =
                nt ||
                function (e) {
                  return gt.clearTimeout(e);
                };
              function ko(e, t) {
                if (t) return e.slice();
                var n = e.length,
                  r = $e ? $e(n) : new e.constructor(n);
                return e.copy(r), r;
              }
              function Ao(e) {
                var t = new e.constructor(e.byteLength);
                return new He(t).set(new He(e)), t;
              }
              function Co(e, t) {
                var n = t ? Ao(e.buffer) : e.buffer;
                return new e.constructor(n, e.byteOffset, e.length);
              }
              function Eo(e, t) {
                if (e !== t) {
                  var n = e !== o,
                    r = null === e,
                    i = e === e,
                    a = ls(e),
                    s = t !== o,
                    l = null === t,
                    c = t === t,
                    u = ls(t);
                  if (
                    (!l && !u && !a && e > t) ||
                    (a && s && c && !l && !u) ||
                    (r && s && c) ||
                    (!n && c) ||
                    !i
                  )
                    return 1;
                  if (
                    (!r && !a && !u && e < t) ||
                    (u && n && i && !r && !a) ||
                    (l && n && i) ||
                    (!s && i) ||
                    !c
                  )
                    return -1;
                }
                return 0;
              }
              function To(e, t, r, o) {
                for (
                  var i = -1,
                    a = e.length,
                    s = r.length,
                    l = -1,
                    c = t.length,
                    u = Kt(a - s, 0),
                    d = n(c + u),
                    h = !o;
                  ++l < c;

                )
                  d[l] = t[l];
                for (; ++i < s; ) (h || i < a) && (d[r[i]] = e[i]);
                for (; u--; ) d[l++] = e[i++];
                return d;
              }
              function Io(e, t, r, o) {
                for (
                  var i = -1,
                    a = e.length,
                    s = -1,
                    l = r.length,
                    c = -1,
                    u = t.length,
                    d = Kt(a - l, 0),
                    h = n(d + u),
                    p = !o;
                  ++i < d;

                )
                  h[i] = e[i];
                for (var f = i; ++c < u; ) h[f + c] = t[c];
                for (; ++s < l; ) (p || i < a) && (h[f + r[s]] = e[i++]);
                return h;
              }
              function Lo(e, t) {
                var r = -1,
                  o = e.length;
                for (t || (t = n(o)); ++r < o; ) t[r] = e[r];
                return t;
              }
              function Oo(e, t, n, r) {
                var i = !n;
                n || (n = {});
                for (var a = -1, s = t.length; ++a < s; ) {
                  var l = t[a],
                    c = r ? r(n[l], e[l], l, n, e) : o;
                  c === o && (c = e[l]), i ? ir(n, l, c) : tr(n, l, c);
                }
                return n;
              }
              function Mo(e, t) {
                return function (n, r) {
                  var o = Ha(n) ? Tt : rr,
                    i = t ? t() : {};
                  return o(n, e, ci(r, 2), i);
                };
              }
              function Ro(e) {
                return Qr(function (t, n) {
                  var r = -1,
                    i = n.length,
                    a = i > 1 ? n[i - 1] : o,
                    s = i > 2 ? n[2] : o;
                  for (
                    a = e.length > 3 && "function" == typeof a ? (i--, a) : o,
                      s && wi(n[0], n[1], s) && ((a = i < 3 ? o : a), (i = 1)),
                      t = Ce(t);
                    ++r < i;

                  ) {
                    var l = n[r];
                    l && e(t, l, r, a);
                  }
                  return t;
                });
              }
              function Po(e, t) {
                return function (n, r) {
                  if (null == n) return n;
                  if (!Ga(n)) return e(n, r);
                  for (
                    var o = n.length, i = t ? o : -1, a = Ce(n);
                    (t ? i-- : ++i < o) && !1 !== r(a[i], i, a);

                  );
                  return n;
                };
              }
              function No(e) {
                return function (t, n, r) {
                  for (var o = -1, i = Ce(t), a = r(t), s = a.length; s--; ) {
                    var l = a[e ? s : ++o];
                    if (!1 === n(i[l], l, i)) break;
                  }
                  return t;
                };
              }
              function Do(e) {
                return function (t) {
                  var n = ln((t = ys(t))) ? gn(t) : o,
                    r = n ? n[0] : t.charAt(0),
                    i = n ? xo(n, 1).join("") : t.slice(1);
                  return r[e]() + i;
                };
              }
              function qo(e) {
                return function (t) {
                  return qt(Zs(Bs(t).replace(et, "")), e, "");
                };
              }
              function jo(e) {
                return function () {
                  var t = arguments;
                  switch (t.length) {
                    case 0:
                      return new e();
                    case 1:
                      return new e(t[0]);
                    case 2:
                      return new e(t[0], t[1]);
                    case 3:
                      return new e(t[0], t[1], t[2]);
                    case 4:
                      return new e(t[0], t[1], t[2], t[3]);
                    case 5:
                      return new e(t[0], t[1], t[2], t[3], t[4]);
                    case 6:
                      return new e(t[0], t[1], t[2], t[3], t[4], t[5]);
                    case 7:
                      return new e(t[0], t[1], t[2], t[3], t[4], t[5], t[6]);
                  }
                  var n = Wn(e.prototype),
                    r = e.apply(n, t);
                  return es(r) ? r : n;
                };
              }
              function Uo(e) {
                return function (t, n, r) {
                  var i = Ce(t);
                  if (!Ga(t)) {
                    var a = ci(n, 3);
                    (t = Os(t)),
                      (n = function (e) {
                        return a(i[e], e, i);
                      });
                  }
                  var s = e(t, n, r);
                  return s > -1 ? i[a ? t[s] : s] : o;
                };
              }
              function Fo(e) {
                return ri(function (t) {
                  var n = t.length,
                    r = n,
                    a = Bn.prototype.thru;
                  for (e && t.reverse(); r--; ) {
                    var s = t[r];
                    if ("function" != typeof s) throw new Ie(i);
                    if (a && !l && "wrapper" == si(s)) var l = new Bn([], !0);
                  }
                  for (r = l ? r : n; ++r < n; ) {
                    var c = si((s = t[r])),
                      u = "wrapper" == c ? ai(s) : o;
                    l =
                      u && xi(u[0]) && 424 == u[1] && !u[4].length && 1 == u[9]
                        ? l[si(u[0])].apply(l, u[3])
                        : 1 == s.length && xi(s)
                        ? l[c]()
                        : l.thru(s);
                  }
                  return function () {
                    var e = arguments,
                      r = e[0];
                    if (l && 1 == e.length && Ha(r)) return l.plant(r).value();
                    for (var o = 0, i = n ? t[o].apply(this, e) : r; ++o < n; )
                      i = t[o].call(this, i);
                    return i;
                  };
                });
              }
              function Wo(e, t, r, i, a, s, l, c, u, h) {
                var p = t & d,
                  f = 1 & t,
                  g = 2 & t,
                  m = 24 & t,
                  v = 512 & t,
                  y = g ? o : jo(e);
                return function d() {
                  for (var b = arguments.length, w = n(b), _ = b; _--; )
                    w[_] = arguments[_];
                  if (m)
                    var x = li(d),
                      S = (function (e, t) {
                        for (var n = e.length, r = 0; n--; ) e[n] === t && ++r;
                        return r;
                      })(w, x);
                  if (
                    (i && (w = To(w, i, a, m)),
                    s && (w = Io(w, s, l, m)),
                    (b -= S),
                    m && b < h)
                  ) {
                    var k = dn(w, x);
                    return Ko(e, t, Wo, d.placeholder, r, w, k, c, u, h - b);
                  }
                  var A = f ? r : this,
                    C = g ? A[e] : e;
                  return (
                    (b = w.length),
                    c
                      ? (w = (function (e, t) {
                          var n = e.length,
                            r = bn(t.length, n),
                            i = Lo(e);
                          for (; r--; ) {
                            var a = t[r];
                            e[r] = bi(a, n) ? i[a] : o;
                          }
                          return e;
                        })(w, c))
                      : v && b > 1 && w.reverse(),
                    p && u < b && (w.length = u),
                    this &&
                      this !== gt &&
                      this instanceof d &&
                      (C = y || jo(C)),
                    C.apply(A, w)
                  );
                };
              }
              function zo(e, t) {
                return function (n, r) {
                  return (function (e, t, n, r) {
                    return (
                      wr(e, function (e, o, i) {
                        t(r, n(e), o, i);
                      }),
                      r
                    );
                  })(n, e, t(r), {});
                };
              }
              function Bo(e, t) {
                return function (n, r) {
                  var i;
                  if (n === o && r === o) return t;
                  if ((n !== o && (i = n), r !== o)) {
                    if (i === o) return r;
                    "string" == typeof n || "string" == typeof r
                      ? ((n = co(n)), (r = co(r)))
                      : ((n = lo(n)), (r = lo(r))),
                      (i = e(n, r));
                  }
                  return i;
                };
              }
              function Ho(e) {
                return ri(function (t) {
                  return (
                    (t = Nt(t, Xt(ci()))),
                    Qr(function (n) {
                      var r = this;
                      return e(t, function (e) {
                        return Et(e, r, n);
                      });
                    })
                  );
                });
              }
              function $o(e, t) {
                var n = (t = t === o ? " " : co(t)).length;
                if (n < 2) return n ? Yr(t, e) : t;
                var r = Yr(t, pt(e / fn(t)));
                return ln(t) ? xo(gn(r), 0, e).join("") : r.slice(0, e);
              }
              function Go(e) {
                return function (t, r, i) {
                  return (
                    i && "number" != typeof i && wi(t, r, i) && (r = i = o),
                    (t = ps(t)),
                    r === o ? ((r = t), (t = 0)) : (r = ps(r)),
                    (function (e, t, r, o) {
                      for (
                        var i = -1, a = Kt(pt((t - e) / (r || 1)), 0), s = n(a);
                        a--;

                      )
                        (s[o ? a : ++i] = e), (e += r);
                      return s;
                    })(t, r, (i = i === o ? (t < r ? 1 : -1) : ps(i)), e)
                  );
                };
              }
              function Vo(e) {
                return function (t, n) {
                  return (
                    ("string" == typeof t && "string" == typeof n) ||
                      ((t = ms(t)), (n = ms(n))),
                    e(t, n)
                  );
                };
              }
              function Ko(e, t, n, r, i, a, s, l, d, h) {
                var p = 8 & t;
                (t |= p ? c : u), 4 & (t &= ~(p ? u : c)) || (t &= -4);
                var f = [
                    e,
                    t,
                    i,
                    p ? a : o,
                    p ? s : o,
                    p ? o : a,
                    p ? o : s,
                    l,
                    d,
                    h,
                  ],
                  g = n.apply(o, f);
                return xi(e) && Li(g, f), (g.placeholder = r), Ri(g, e, t);
              }
              function Yo(e) {
                var t = Ae[e];
                return function (e, n) {
                  if (
                    ((e = ms(e)), (n = null == n ? 0 : bn(fs(n), 292)) && bt(e))
                  ) {
                    var r = (ys(e) + "e").split("e");
                    return +(
                      (r = (ys(t(r[0] + "e" + (+r[1] + n))) + "e").split(
                        "e"
                      ))[0] +
                      "e" +
                      (+r[1] - n)
                    );
                  }
                  return t(e);
                };
              }
              var Qo =
                En && 1 / hn(new En([, -0]))[1] == p
                  ? function (e) {
                      return new En(e);
                    }
                  : ll;
              function Zo(e) {
                return function (t) {
                  var n = gi(t);
                  return n == A
                    ? cn(t)
                    : n == L
                    ? pn(t)
                    : (function (e, t) {
                        return Nt(t, function (t) {
                          return [t, e[t]];
                        });
                      })(t, e(t));
                };
              }
              function Jo(e, t, r, a, p, f, g, m) {
                var v = 2 & t;
                if (!v && "function" != typeof e) throw new Ie(i);
                var y = a ? a.length : 0;
                if (
                  (y || ((t &= -97), (a = p = o)),
                  (g = g === o ? g : Kt(fs(g), 0)),
                  (m = m === o ? m : fs(m)),
                  (y -= p ? p.length : 0),
                  t & u)
                ) {
                  var b = a,
                    w = p;
                  a = p = o;
                }
                var _ = v ? o : ai(e),
                  x = [e, t, r, a, p, b, w, f, g, m];
                if (
                  (_ &&
                    (function (e, t) {
                      var n = e[1],
                        r = t[1],
                        o = n | r,
                        i = o < 131,
                        a =
                          (r == d && 8 == n) ||
                          (r == d && n == h && e[7].length <= t[8]) ||
                          (384 == r && t[7].length <= t[8] && 8 == n);
                      if (!i && !a) return e;
                      1 & r && ((e[2] = t[2]), (o |= 1 & n ? 0 : 4));
                      var l = t[3];
                      if (l) {
                        var c = e[3];
                        (e[3] = c ? To(c, l, t[4]) : l),
                          (e[4] = c ? dn(e[3], s) : t[4]);
                      }
                      (l = t[5]) &&
                        ((c = e[5]),
                        (e[5] = c ? Io(c, l, t[6]) : l),
                        (e[6] = c ? dn(e[5], s) : t[6]));
                      (l = t[7]) && (e[7] = l);
                      r & d && (e[8] = null == e[8] ? t[8] : bn(e[8], t[8]));
                      null == e[9] && (e[9] = t[9]);
                      (e[0] = t[0]), (e[1] = o);
                    })(x, _),
                  (e = x[0]),
                  (t = x[1]),
                  (r = x[2]),
                  (a = x[3]),
                  (p = x[4]),
                  !(m = x[9] =
                    x[9] === o ? (v ? 0 : e.length) : Kt(x[9] - y, 0)) &&
                    24 & t &&
                    (t &= -25),
                  t && 1 != t)
                )
                  S =
                    8 == t || t == l
                      ? (function (e, t, r) {
                          var i = jo(e);
                          return function a() {
                            for (
                              var s = arguments.length,
                                l = n(s),
                                c = s,
                                u = li(a);
                              c--;

                            )
                              l[c] = arguments[c];
                            var d =
                              s < 3 && l[0] !== u && l[s - 1] !== u
                                ? []
                                : dn(l, u);
                            return (s -= d.length) < r
                              ? Ko(
                                  e,
                                  t,
                                  Wo,
                                  a.placeholder,
                                  o,
                                  l,
                                  d,
                                  o,
                                  o,
                                  r - s
                                )
                              : Et(
                                  this && this !== gt && this instanceof a
                                    ? i
                                    : e,
                                  this,
                                  l
                                );
                          };
                        })(e, t, m)
                      : (t != c && 33 != t) || p.length
                      ? Wo.apply(o, x)
                      : (function (e, t, r, o) {
                          var i = 1 & t,
                            a = jo(e);
                          return function t() {
                            for (
                              var s = -1,
                                l = arguments.length,
                                c = -1,
                                u = o.length,
                                d = n(u + l),
                                h =
                                  this && this !== gt && this instanceof t
                                    ? a
                                    : e;
                              ++c < u;

                            )
                              d[c] = o[c];
                            for (; l--; ) d[c++] = arguments[++s];
                            return Et(h, i ? r : this, d);
                          };
                        })(e, t, r, a);
                else
                  var S = (function (e, t, n) {
                    var r = 1 & t,
                      o = jo(e);
                    return function t() {
                      return (
                        this && this !== gt && this instanceof t ? o : e
                      ).apply(r ? n : this, arguments);
                    };
                  })(e, t, r);
                return Ri((_ ? eo : Li)(S, x), e, t);
              }
              function Xo(e, t, n, r) {
                return e === o || (Fa(e, Me[n]) && !Ne.call(r, n)) ? t : e;
              }
              function ei(e, t, n, r, i, a) {
                return (
                  es(e) &&
                    es(t) &&
                    (a.set(t, e), zr(e, t, o, ei, a), a.delete(t)),
                  e
                );
              }
              function ti(e) {
                return os(e) ? o : e;
              }
              function ni(e, t, n, r, i, a) {
                var s = 1 & n,
                  l = e.length,
                  c = t.length;
                if (l != c && !(s && c > l)) return !1;
                var u = a.get(e),
                  d = a.get(t);
                if (u && d) return u == t && d == e;
                var h = -1,
                  p = !0,
                  f = 2 & n ? new Kn() : o;
                for (a.set(e, t), a.set(t, e); ++h < l; ) {
                  var g = e[h],
                    m = t[h];
                  if (r) var v = s ? r(m, g, h, t, e, a) : r(g, m, h, e, t, a);
                  if (v !== o) {
                    if (v) continue;
                    p = !1;
                    break;
                  }
                  if (f) {
                    if (
                      !Ut(t, function (e, t) {
                        if (!tn(f, t) && (g === e || i(g, e, n, r, a)))
                          return f.push(t);
                      })
                    ) {
                      p = !1;
                      break;
                    }
                  } else if (g !== m && !i(g, m, n, r, a)) {
                    p = !1;
                    break;
                  }
                }
                return a.delete(e), a.delete(t), p;
              }
              function ri(e) {
                return Mi(Ei(e, o, $i), e + "");
              }
              function oi(e) {
                return kr(e, Os, pi);
              }
              function ii(e) {
                return kr(e, Ms, fi);
              }
              var ai = Ln
                ? function (e) {
                    return Ln.get(e);
                  }
                : ll;
              function si(e) {
                for (
                  var t = e.name + "",
                    n = On[t],
                    r = Ne.call(On, t) ? n.length : 0;
                  r--;

                ) {
                  var o = n[r],
                    i = o.func;
                  if (null == i || i == e) return o.name;
                }
                return t;
              }
              function li(e) {
                return (Ne.call(Fn, "placeholder") ? Fn : e).placeholder;
              }
              function ci() {
                var e = Fn.iteratee || ol;
                return (
                  (e = e === ol ? Nr : e),
                  arguments.length ? e(arguments[0], arguments[1]) : e
                );
              }
              function ui(e, t) {
                var n = e.__data__;
                return (function (e) {
                  var t = typeof e;
                  return "string" == t ||
                    "number" == t ||
                    "symbol" == t ||
                    "boolean" == t
                    ? "__proto__" !== e
                    : null === e;
                })(t)
                  ? n["string" == typeof t ? "string" : "hash"]
                  : n.map;
              }
              function di(e) {
                for (var t = Os(e), n = t.length; n--; ) {
                  var r = t[n],
                    o = e[r];
                  t[n] = [r, o, Ai(o)];
                }
                return t;
              }
              function hi(e, t) {
                var n = (function (e, t) {
                  return null == e ? o : e[t];
                })(e, t);
                return Pr(n) ? n : o;
              }
              var pi = mt
                  ? function (e) {
                      return null == e
                        ? []
                        : ((e = Ce(e)),
                          Mt(mt(e), function (t) {
                            return Ke.call(e, t);
                          }));
                    }
                  : gl,
                fi = mt
                  ? function (e) {
                      for (var t = []; e; ) Dt(t, pi(e)), (e = Ge(e));
                      return t;
                    }
                  : gl,
                gi = Ar;
              function mi(e, t, n) {
                for (var r = -1, o = (t = wo(t, e)).length, i = !1; ++r < o; ) {
                  var a = qi(t[r]);
                  if (!(i = null != e && n(e, a))) break;
                  e = e[a];
                }
                return i || ++r != o
                  ? i
                  : !!(o = null == e ? 0 : e.length) &&
                      Xa(o) &&
                      bi(a, o) &&
                      (Ha(e) || Ba(e));
              }
              function vi(e) {
                return "function" != typeof e.constructor || ki(e)
                  ? {}
                  : Wn(Ge(e));
              }
              function yi(e) {
                return Ha(e) || Ba(e) || !!(Qe && e && e[Qe]);
              }
              function bi(e, t) {
                var n = typeof e;
                return (
                  !!(t = null == t ? f : t) &&
                  ("number" == n || ("symbol" != n && we.test(e))) &&
                  e > -1 &&
                  e % 1 == 0 &&
                  e < t
                );
              }
              function wi(e, t, n) {
                if (!es(n)) return !1;
                var r = typeof t;
                return (
                  !!("number" == r
                    ? Ga(n) && bi(t, n.length)
                    : "string" == r && t in n) && Fa(n[t], e)
                );
              }
              function _i(e, t) {
                if (Ha(e)) return !1;
                var n = typeof e;
                return (
                  !(
                    "number" != n &&
                    "symbol" != n &&
                    "boolean" != n &&
                    null != e &&
                    !ls(e)
                  ) ||
                  ne.test(e) ||
                  !te.test(e) ||
                  (null != t && e in Ce(t))
                );
              }
              function xi(e) {
                var t = si(e),
                  n = Fn[t];
                if ("function" != typeof n || !(t in Hn.prototype)) return !1;
                if (e === n) return !0;
                var r = ai(n);
                return !!r && e === r[0];
              }
              ((kn && gi(new kn(new ArrayBuffer(1))) != N) ||
                (An && gi(new An()) != A) ||
                (Cn && gi(Cn.resolve()) != T) ||
                (En && gi(new En()) != L) ||
                (Tn && gi(new Tn()) != R)) &&
                (gi = function (e) {
                  var t = Ar(e),
                    n = t == E ? e.constructor : o,
                    r = n ? ji(n) : "";
                  if (r)
                    switch (r) {
                      case Mn:
                        return N;
                      case Rn:
                        return A;
                      case Pn:
                        return T;
                      case Nn:
                        return L;
                      case Dn:
                        return R;
                    }
                  return t;
                });
              var Si = Re ? Za : ml;
              function ki(e) {
                var t = e && e.constructor;
                return e === (("function" == typeof t && t.prototype) || Me);
              }
              function Ai(e) {
                return e === e && !es(e);
              }
              function Ci(e, t) {
                return function (n) {
                  return null != n && n[e] === t && (t !== o || e in Ce(n));
                };
              }
              function Ei(e, t, r) {
                return (
                  (t = Kt(t === o ? e.length - 1 : t, 0)),
                  function () {
                    for (
                      var o = arguments,
                        i = -1,
                        a = Kt(o.length - t, 0),
                        s = n(a);
                      ++i < a;

                    )
                      s[i] = o[t + i];
                    i = -1;
                    for (var l = n(t + 1); ++i < t; ) l[i] = o[i];
                    return (l[t] = r(s)), Et(e, this, l);
                  }
                );
              }
              function Ti(e, t) {
                return t.length < 2 ? e : Sr(e, ro(t, 0, -1));
              }
              function Ii(e, t) {
                if (
                  ("constructor" !== t || "function" !== typeof e[t]) &&
                  "__proto__" != t
                )
                  return e[t];
              }
              var Li = Pi(eo),
                Oi =
                  ut ||
                  function (e, t) {
                    return gt.setTimeout(e, t);
                  },
                Mi = Pi(to);
              function Ri(e, t, n) {
                var r = t + "";
                return Mi(
                  e,
                  (function (e, t) {
                    var n = t.length;
                    if (!n) return e;
                    var r = n - 1;
                    return (
                      (t[r] = (n > 1 ? "& " : "") + t[r]),
                      (t = t.join(n > 2 ? ", " : " ")),
                      e.replace(le, "{\n/* [wrapped with " + t + "] */\n")
                    );
                  })(
                    r,
                    (function (e, t) {
                      return (
                        It(v, function (n) {
                          var r = "_." + n[0];
                          t & n[1] && !Rt(e, r) && e.push(r);
                        }),
                        e.sort()
                      );
                    })(
                      (function (e) {
                        var t = e.match(ce);
                        return t ? t[1].split(ue) : [];
                      })(r),
                      n
                    )
                  )
                );
              }
              function Pi(e) {
                var t = 0,
                  n = 0;
                return function () {
                  var r = wn(),
                    i = 16 - (r - n);
                  if (((n = r), i > 0)) {
                    if (++t >= 800) return arguments[0];
                  } else t = 0;
                  return e.apply(o, arguments);
                };
              }
              function Ni(e, t) {
                var n = -1,
                  r = e.length,
                  i = r - 1;
                for (t = t === o ? r : t; ++n < t; ) {
                  var a = Kr(n, i),
                    s = e[a];
                  (e[a] = e[n]), (e[n] = s);
                }
                return (e.length = t), e;
              }
              var Di = (function (e) {
                var t = Pa(e, function (e) {
                    return 500 === n.size && n.clear(), e;
                  }),
                  n = t.cache;
                return t;
              })(function (e) {
                var t = [];
                return (
                  46 === e.charCodeAt(0) && t.push(""),
                  e.replace(re, function (e, n, r, o) {
                    t.push(r ? o.replace(pe, "$1") : n || e);
                  }),
                  t
                );
              });
              function qi(e) {
                if ("string" == typeof e || ls(e)) return e;
                var t = e + "";
                return "0" == t && 1 / e == -1 / 0 ? "-0" : t;
              }
              function ji(e) {
                if (null != e) {
                  try {
                    return Pe.call(e);
                  } catch (t) {}
                  try {
                    return e + "";
                  } catch (t) {}
                }
                return "";
              }
              function Ui(e) {
                if (e instanceof Hn) return e.clone();
                var t = new Bn(e.__wrapped__, e.__chain__);
                return (
                  (t.__actions__ = Lo(e.__actions__)),
                  (t.__index__ = e.__index__),
                  (t.__values__ = e.__values__),
                  t
                );
              }
              var Fi = Qr(function (e, t) {
                  return Va(e) ? dr(e, vr(t, 1, Va, !0)) : [];
                }),
                Wi = Qr(function (e, t) {
                  var n = Qi(t);
                  return (
                    Va(n) && (n = o),
                    Va(e) ? dr(e, vr(t, 1, Va, !0), ci(n, 2)) : []
                  );
                }),
                zi = Qr(function (e, t) {
                  var n = Qi(t);
                  return (
                    Va(n) && (n = o), Va(e) ? dr(e, vr(t, 1, Va, !0), o, n) : []
                  );
                });
              function Bi(e, t, n) {
                var r = null == e ? 0 : e.length;
                if (!r) return -1;
                var o = null == n ? 0 : fs(n);
                return o < 0 && (o = Kt(r + o, 0)), zt(e, ci(t, 3), o);
              }
              function Hi(e, t, n) {
                var r = null == e ? 0 : e.length;
                if (!r) return -1;
                var i = r - 1;
                return (
                  n !== o &&
                    ((i = fs(n)), (i = n < 0 ? Kt(r + i, 0) : bn(i, r - 1))),
                  zt(e, ci(t, 3), i, !0)
                );
              }
              function $i(e) {
                return (null == e ? 0 : e.length) ? vr(e, 1) : [];
              }
              function Gi(e) {
                return e && e.length ? e[0] : o;
              }
              var Vi = Qr(function (e) {
                  var t = Nt(e, yo);
                  return t.length && t[0] === e[0] ? Ir(t) : [];
                }),
                Ki = Qr(function (e) {
                  var t = Qi(e),
                    n = Nt(e, yo);
                  return (
                    t === Qi(n) ? (t = o) : n.pop(),
                    n.length && n[0] === e[0] ? Ir(n, ci(t, 2)) : []
                  );
                }),
                Yi = Qr(function (e) {
                  var t = Qi(e),
                    n = Nt(e, yo);
                  return (
                    (t = "function" == typeof t ? t : o) && n.pop(),
                    n.length && n[0] === e[0] ? Ir(n, o, t) : []
                  );
                });
              function Qi(e) {
                var t = null == e ? 0 : e.length;
                return t ? e[t - 1] : o;
              }
              var Zi = Qr(Ji);
              function Ji(e, t) {
                return e && e.length && t && t.length ? Gr(e, t) : e;
              }
              var Xi = ri(function (e, t) {
                var n = null == e ? 0 : e.length,
                  r = ar(e, t);
                return (
                  Vr(
                    e,
                    Nt(t, function (e) {
                      return bi(e, n) ? +e : e;
                    }).sort(Eo)
                  ),
                  r
                );
              });
              function ea(e) {
                return null == e ? e : Sn.call(e);
              }
              var ta = Qr(function (e) {
                  return uo(vr(e, 1, Va, !0));
                }),
                na = Qr(function (e) {
                  var t = Qi(e);
                  return Va(t) && (t = o), uo(vr(e, 1, Va, !0), ci(t, 2));
                }),
                ra = Qr(function (e) {
                  var t = Qi(e);
                  return (
                    (t = "function" == typeof t ? t : o),
                    uo(vr(e, 1, Va, !0), o, t)
                  );
                });
              function oa(e) {
                if (!e || !e.length) return [];
                var t = 0;
                return (
                  (e = Mt(e, function (e) {
                    if (Va(e)) return (t = Kt(e.length, t)), !0;
                  })),
                  Zt(t, function (t) {
                    return Nt(e, Vt(t));
                  })
                );
              }
              function ia(e, t) {
                if (!e || !e.length) return [];
                var n = oa(e);
                return null == t
                  ? n
                  : Nt(n, function (e) {
                      return Et(t, o, e);
                    });
              }
              var aa = Qr(function (e, t) {
                  return Va(e) ? dr(e, t) : [];
                }),
                sa = Qr(function (e) {
                  return mo(Mt(e, Va));
                }),
                la = Qr(function (e) {
                  var t = Qi(e);
                  return Va(t) && (t = o), mo(Mt(e, Va), ci(t, 2));
                }),
                ca = Qr(function (e) {
                  var t = Qi(e);
                  return (
                    (t = "function" == typeof t ? t : o), mo(Mt(e, Va), o, t)
                  );
                }),
                ua = Qr(oa);
              var da = Qr(function (e) {
                var t = e.length,
                  n = t > 1 ? e[t - 1] : o;
                return (
                  (n = "function" == typeof n ? (e.pop(), n) : o), ia(e, n)
                );
              });
              function ha(e) {
                var t = Fn(e);
                return (t.__chain__ = !0), t;
              }
              function pa(e, t) {
                return t(e);
              }
              var fa = ri(function (e) {
                var t = e.length,
                  n = t ? e[0] : 0,
                  r = this.__wrapped__,
                  i = function (t) {
                    return ar(t, e);
                  };
                return !(t > 1 || this.__actions__.length) &&
                  r instanceof Hn &&
                  bi(n)
                  ? ((r = r.slice(n, +n + (t ? 1 : 0))).__actions__.push({
                      func: pa,
                      args: [i],
                      thisArg: o,
                    }),
                    new Bn(r, this.__chain__).thru(function (e) {
                      return t && !e.length && e.push(o), e;
                    }))
                  : this.thru(i);
              });
              var ga = Mo(function (e, t, n) {
                Ne.call(e, n) ? ++e[n] : ir(e, n, 1);
              });
              var ma = Uo(Bi),
                va = Uo(Hi);
              function ya(e, t) {
                return (Ha(e) ? It : hr)(e, ci(t, 3));
              }
              function ba(e, t) {
                return (Ha(e) ? Lt : pr)(e, ci(t, 3));
              }
              var wa = Mo(function (e, t, n) {
                Ne.call(e, n) ? e[n].push(t) : ir(e, n, [t]);
              });
              var _a = Qr(function (e, t, r) {
                  var o = -1,
                    i = "function" == typeof t,
                    a = Ga(e) ? n(e.length) : [];
                  return (
                    hr(e, function (e) {
                      a[++o] = i ? Et(t, e, r) : Lr(e, t, r);
                    }),
                    a
                  );
                }),
                xa = Mo(function (e, t, n) {
                  ir(e, n, t);
                });
              function Sa(e, t) {
                return (Ha(e) ? Nt : Ur)(e, ci(t, 3));
              }
              var ka = Mo(
                function (e, t, n) {
                  e[n ? 0 : 1].push(t);
                },
                function () {
                  return [[], []];
                }
              );
              var Aa = Qr(function (e, t) {
                  if (null == e) return [];
                  var n = t.length;
                  return (
                    n > 1 && wi(e, t[0], t[1])
                      ? (t = [])
                      : n > 2 && wi(t[0], t[1], t[2]) && (t = [t[0]]),
                    Hr(e, vr(t, 1), [])
                  );
                }),
                Ca =
                  ot ||
                  function () {
                    return gt.Date.now();
                  };
              function Ea(e, t, n) {
                return (
                  (t = n ? o : t),
                  (t = e && null == t ? e.length : t),
                  Jo(e, d, o, o, o, o, t)
                );
              }
              function Ta(e, t) {
                var n;
                if ("function" != typeof t) throw new Ie(i);
                return (
                  (e = fs(e)),
                  function () {
                    return (
                      --e > 0 && (n = t.apply(this, arguments)),
                      e <= 1 && (t = o),
                      n
                    );
                  }
                );
              }
              var Ia = Qr(function (e, t, n) {
                  var r = 1;
                  if (n.length) {
                    var o = dn(n, li(Ia));
                    r |= c;
                  }
                  return Jo(e, r, t, n, o);
                }),
                La = Qr(function (e, t, n) {
                  var r = 3;
                  if (n.length) {
                    var o = dn(n, li(La));
                    r |= c;
                  }
                  return Jo(t, r, e, n, o);
                });
              function Oa(e, t, n) {
                var r,
                  a,
                  s,
                  l,
                  c,
                  u,
                  d = 0,
                  h = !1,
                  p = !1,
                  f = !0;
                if ("function" != typeof e) throw new Ie(i);
                function g(t) {
                  var n = r,
                    i = a;
                  return (r = a = o), (d = t), (l = e.apply(i, n));
                }
                function m(e) {
                  var n = e - u;
                  return u === o || n >= t || n < 0 || (p && e - d >= s);
                }
                function v() {
                  var e = Ca();
                  if (m(e)) return y(e);
                  c = Oi(
                    v,
                    (function (e) {
                      var n = t - (e - u);
                      return p ? bn(n, s - (e - d)) : n;
                    })(e)
                  );
                }
                function y(e) {
                  return (c = o), f && r ? g(e) : ((r = a = o), l);
                }
                function b() {
                  var e = Ca(),
                    n = m(e);
                  if (((r = arguments), (a = this), (u = e), n)) {
                    if (c === o)
                      return (function (e) {
                        return (d = e), (c = Oi(v, t)), h ? g(e) : l;
                      })(u);
                    if (p) return So(c), (c = Oi(v, t)), g(u);
                  }
                  return c === o && (c = Oi(v, t)), l;
                }
                return (
                  (t = ms(t) || 0),
                  es(n) &&
                    ((h = !!n.leading),
                    (s = (p = "maxWait" in n) ? Kt(ms(n.maxWait) || 0, t) : s),
                    (f = "trailing" in n ? !!n.trailing : f)),
                  (b.cancel = function () {
                    c !== o && So(c), (d = 0), (r = u = a = c = o);
                  }),
                  (b.flush = function () {
                    return c === o ? l : y(Ca());
                  }),
                  b
                );
              }
              var Ma = Qr(function (e, t) {
                  return ur(e, 1, t);
                }),
                Ra = Qr(function (e, t, n) {
                  return ur(e, ms(t) || 0, n);
                });
              function Pa(e, t) {
                if (
                  "function" != typeof e ||
                  (null != t && "function" != typeof t)
                )
                  throw new Ie(i);
                var n = function () {
                  var r = arguments,
                    o = t ? t.apply(this, r) : r[0],
                    i = n.cache;
                  if (i.has(o)) return i.get(o);
                  var a = e.apply(this, r);
                  return (n.cache = i.set(o, a) || i), a;
                };
                return (n.cache = new (Pa.Cache || Vn)()), n;
              }
              function Na(e) {
                if ("function" != typeof e) throw new Ie(i);
                return function () {
                  var t = arguments;
                  switch (t.length) {
                    case 0:
                      return !e.call(this);
                    case 1:
                      return !e.call(this, t[0]);
                    case 2:
                      return !e.call(this, t[0], t[1]);
                    case 3:
                      return !e.call(this, t[0], t[1], t[2]);
                  }
                  return !e.apply(this, t);
                };
              }
              Pa.Cache = Vn;
              var Da = _o(function (e, t) {
                  var n = (t =
                    1 == t.length && Ha(t[0])
                      ? Nt(t[0], Xt(ci()))
                      : Nt(vr(t, 1), Xt(ci()))).length;
                  return Qr(function (r) {
                    for (var o = -1, i = bn(r.length, n); ++o < i; )
                      r[o] = t[o].call(this, r[o]);
                    return Et(e, this, r);
                  });
                }),
                qa = Qr(function (e, t) {
                  var n = dn(t, li(qa));
                  return Jo(e, c, o, t, n);
                }),
                ja = Qr(function (e, t) {
                  var n = dn(t, li(ja));
                  return Jo(e, u, o, t, n);
                }),
                Ua = ri(function (e, t) {
                  return Jo(e, h, o, o, o, t);
                });
              function Fa(e, t) {
                return e === t || (e !== e && t !== t);
              }
              var Wa = Vo(Cr),
                za = Vo(function (e, t) {
                  return e >= t;
                }),
                Ba = Or(
                  (function () {
                    return arguments;
                  })()
                )
                  ? Or
                  : function (e) {
                      return (
                        ts(e) && Ne.call(e, "callee") && !Ke.call(e, "callee")
                      );
                    },
                Ha = n.isArray,
                $a = _t
                  ? Xt(_t)
                  : function (e) {
                      return ts(e) && Ar(e) == P;
                    };
              function Ga(e) {
                return null != e && Xa(e.length) && !Za(e);
              }
              function Va(e) {
                return ts(e) && Ga(e);
              }
              var Ka = vt || ml,
                Ya = xt
                  ? Xt(xt)
                  : function (e) {
                      return ts(e) && Ar(e) == _;
                    };
              function Qa(e) {
                if (!ts(e)) return !1;
                var t = Ar(e);
                return (
                  t == x ||
                  "[object DOMException]" == t ||
                  ("string" == typeof e.message &&
                    "string" == typeof e.name &&
                    !os(e))
                );
              }
              function Za(e) {
                if (!es(e)) return !1;
                var t = Ar(e);
                return (
                  t == S ||
                  t == k ||
                  "[object AsyncFunction]" == t ||
                  "[object Proxy]" == t
                );
              }
              function Ja(e) {
                return "number" == typeof e && e == fs(e);
              }
              function Xa(e) {
                return "number" == typeof e && e > -1 && e % 1 == 0 && e <= f;
              }
              function es(e) {
                var t = typeof e;
                return null != e && ("object" == t || "function" == t);
              }
              function ts(e) {
                return null != e && "object" == typeof e;
              }
              var ns = St
                ? Xt(St)
                : function (e) {
                    return ts(e) && gi(e) == A;
                  };
              function rs(e) {
                return "number" == typeof e || (ts(e) && Ar(e) == C);
              }
              function os(e) {
                if (!ts(e) || Ar(e) != E) return !1;
                var t = Ge(e);
                if (null === t) return !0;
                var n = Ne.call(t, "constructor") && t.constructor;
                return (
                  "function" == typeof n && n instanceof n && Pe.call(n) == Ue
                );
              }
              var is = kt
                ? Xt(kt)
                : function (e) {
                    return ts(e) && Ar(e) == I;
                  };
              var as = At
                ? Xt(At)
                : function (e) {
                    return ts(e) && gi(e) == L;
                  };
              function ss(e) {
                return "string" == typeof e || (!Ha(e) && ts(e) && Ar(e) == O);
              }
              function ls(e) {
                return "symbol" == typeof e || (ts(e) && Ar(e) == M);
              }
              var cs = Ct
                ? Xt(Ct)
                : function (e) {
                    return ts(e) && Xa(e.length) && !!lt[Ar(e)];
                  };
              var us = Vo(jr),
                ds = Vo(function (e, t) {
                  return e <= t;
                });
              function hs(e) {
                if (!e) return [];
                if (Ga(e)) return ss(e) ? gn(e) : Lo(e);
                if (Ze && e[Ze])
                  return (function (e) {
                    for (var t, n = []; !(t = e.next()).done; ) n.push(t.value);
                    return n;
                  })(e[Ze]());
                var t = gi(e);
                return (t == A ? cn : t == L ? hn : Fs)(e);
              }
              function ps(e) {
                return e
                  ? (e = ms(e)) === p || e === -1 / 0
                    ? 17976931348623157e292 * (e < 0 ? -1 : 1)
                    : e === e
                    ? e
                    : 0
                  : 0 === e
                  ? e
                  : 0;
              }
              function fs(e) {
                var t = ps(e),
                  n = t % 1;
                return t === t ? (n ? t - n : t) : 0;
              }
              function gs(e) {
                return e ? sr(fs(e), 0, m) : 0;
              }
              function ms(e) {
                if ("number" == typeof e) return e;
                if (ls(e)) return g;
                if (es(e)) {
                  var t = "function" == typeof e.valueOf ? e.valueOf() : e;
                  e = es(t) ? t + "" : t;
                }
                if ("string" != typeof e) return 0 === e ? e : +e;
                e = Jt(e);
                var n = ve.test(e);
                return n || be.test(e)
                  ? ht(e.slice(2), n ? 2 : 8)
                  : me.test(e)
                  ? g
                  : +e;
              }
              function vs(e) {
                return Oo(e, Ms(e));
              }
              function ys(e) {
                return null == e ? "" : co(e);
              }
              var bs = Ro(function (e, t) {
                  if (ki(t) || Ga(t)) Oo(t, Os(t), e);
                  else for (var n in t) Ne.call(t, n) && tr(e, n, t[n]);
                }),
                ws = Ro(function (e, t) {
                  Oo(t, Ms(t), e);
                }),
                _s = Ro(function (e, t, n, r) {
                  Oo(t, Ms(t), e, r);
                }),
                xs = Ro(function (e, t, n, r) {
                  Oo(t, Os(t), e, r);
                }),
                Ss = ri(ar);
              var ks = Qr(function (e, t) {
                  e = Ce(e);
                  var n = -1,
                    r = t.length,
                    i = r > 2 ? t[2] : o;
                  for (i && wi(t[0], t[1], i) && (r = 1); ++n < r; )
                    for (
                      var a = t[n], s = Ms(a), l = -1, c = s.length;
                      ++l < c;

                    ) {
                      var u = s[l],
                        d = e[u];
                      (d === o || (Fa(d, Me[u]) && !Ne.call(e, u))) &&
                        (e[u] = a[u]);
                    }
                  return e;
                }),
                As = Qr(function (e) {
                  return e.push(o, ei), Et(Ps, o, e);
                });
              function Cs(e, t, n) {
                var r = null == e ? o : Sr(e, t);
                return r === o ? n : r;
              }
              function Es(e, t) {
                return null != e && mi(e, t, Tr);
              }
              var Ts = zo(function (e, t, n) {
                  null != t &&
                    "function" != typeof t.toString &&
                    (t = je.call(t)),
                    (e[t] = n);
                }, el(rl)),
                Is = zo(function (e, t, n) {
                  null != t &&
                    "function" != typeof t.toString &&
                    (t = je.call(t)),
                    Ne.call(e, t) ? e[t].push(n) : (e[t] = [n]);
                }, ci),
                Ls = Qr(Lr);
              function Os(e) {
                return Ga(e) ? Qn(e) : Dr(e);
              }
              function Ms(e) {
                return Ga(e) ? Qn(e, !0) : qr(e);
              }
              var Rs = Ro(function (e, t, n) {
                  zr(e, t, n);
                }),
                Ps = Ro(function (e, t, n, r) {
                  zr(e, t, n, r);
                }),
                Ns = ri(function (e, t) {
                  var n = {};
                  if (null == e) return n;
                  var r = !1;
                  (t = Nt(t, function (t) {
                    return (t = wo(t, e)), r || (r = t.length > 1), t;
                  })),
                    Oo(e, ii(e), n),
                    r && (n = lr(n, 7, ti));
                  for (var o = t.length; o--; ) ho(n, t[o]);
                  return n;
                });
              var Ds = ri(function (e, t) {
                return null == e
                  ? {}
                  : (function (e, t) {
                      return $r(e, t, function (t, n) {
                        return Es(e, n);
                      });
                    })(e, t);
              });
              function qs(e, t) {
                if (null == e) return {};
                var n = Nt(ii(e), function (e) {
                  return [e];
                });
                return (
                  (t = ci(t)),
                  $r(e, n, function (e, n) {
                    return t(e, n[0]);
                  })
                );
              }
              var js = Zo(Os),
                Us = Zo(Ms);
              function Fs(e) {
                return null == e ? [] : en(e, Os(e));
              }
              var Ws = qo(function (e, t, n) {
                return (t = t.toLowerCase()), e + (n ? zs(t) : t);
              });
              function zs(e) {
                return Qs(ys(e).toLowerCase());
              }
              function Bs(e) {
                return (e = ys(e)) && e.replace(_e, on).replace(tt, "");
              }
              var Hs = qo(function (e, t, n) {
                  return e + (n ? "-" : "") + t.toLowerCase();
                }),
                $s = qo(function (e, t, n) {
                  return e + (n ? " " : "") + t.toLowerCase();
                }),
                Gs = Do("toLowerCase");
              var Vs = qo(function (e, t, n) {
                return e + (n ? "_" : "") + t.toLowerCase();
              });
              var Ks = qo(function (e, t, n) {
                return e + (n ? " " : "") + Qs(t);
              });
              var Ys = qo(function (e, t, n) {
                  return e + (n ? " " : "") + t.toUpperCase();
                }),
                Qs = Do("toUpperCase");
              function Zs(e, t, n) {
                return (
                  (e = ys(e)),
                  (t = n ? o : t) === o
                    ? (function (e) {
                        return it.test(e);
                      })(e)
                      ? (function (e) {
                          return e.match(rt) || [];
                        })(e)
                      : (function (e) {
                          return e.match(de) || [];
                        })(e)
                    : e.match(t) || []
                );
              }
              var Js = Qr(function (e, t) {
                  try {
                    return Et(e, o, t);
                  } catch (n) {
                    return Qa(n) ? n : new se(n);
                  }
                }),
                Xs = ri(function (e, t) {
                  return (
                    It(t, function (t) {
                      (t = qi(t)), ir(e, t, Ia(e[t], e));
                    }),
                    e
                  );
                });
              function el(e) {
                return function () {
                  return e;
                };
              }
              var tl = Fo(),
                nl = Fo(!0);
              function rl(e) {
                return e;
              }
              function ol(e) {
                return Nr("function" == typeof e ? e : lr(e, 1));
              }
              var il = Qr(function (e, t) {
                  return function (n) {
                    return Lr(n, e, t);
                  };
                }),
                al = Qr(function (e, t) {
                  return function (n) {
                    return Lr(e, n, t);
                  };
                });
              function sl(e, t, n) {
                var r = Os(t),
                  o = xr(t, r);
                null != n ||
                  (es(t) && (o.length || !r.length)) ||
                  ((n = t), (t = e), (e = this), (o = xr(t, Os(t))));
                var i = !(es(n) && "chain" in n) || !!n.chain,
                  a = Za(e);
                return (
                  It(o, function (n) {
                    var r = t[n];
                    (e[n] = r),
                      a &&
                        (e.prototype[n] = function () {
                          var t = this.__chain__;
                          if (i || t) {
                            var n = e(this.__wrapped__);
                            return (
                              (n.__actions__ = Lo(this.__actions__)).push({
                                func: r,
                                args: arguments,
                                thisArg: e,
                              }),
                              (n.__chain__ = t),
                              n
                            );
                          }
                          return r.apply(e, Dt([this.value()], arguments));
                        });
                  }),
                  e
                );
              }
              function ll() {}
              var cl = Ho(Nt),
                ul = Ho(Ot),
                dl = Ho(Ut);
              function hl(e) {
                return _i(e)
                  ? Vt(qi(e))
                  : (function (e) {
                      return function (t) {
                        return Sr(t, e);
                      };
                    })(e);
              }
              var pl = Go(),
                fl = Go(!0);
              function gl() {
                return [];
              }
              function ml() {
                return !1;
              }
              var vl = Bo(function (e, t) {
                  return e + t;
                }, 0),
                yl = Yo("ceil"),
                bl = Bo(function (e, t) {
                  return e / t;
                }, 1),
                wl = Yo("floor");
              var _l = Bo(function (e, t) {
                  return e * t;
                }, 1),
                xl = Yo("round"),
                Sl = Bo(function (e, t) {
                  return e - t;
                }, 0);
              return (
                (Fn.after = function (e, t) {
                  if ("function" != typeof t) throw new Ie(i);
                  return (
                    (e = fs(e)),
                    function () {
                      if (--e < 1) return t.apply(this, arguments);
                    }
                  );
                }),
                (Fn.ary = Ea),
                (Fn.assign = bs),
                (Fn.assignIn = ws),
                (Fn.assignInWith = _s),
                (Fn.assignWith = xs),
                (Fn.at = Ss),
                (Fn.before = Ta),
                (Fn.bind = Ia),
                (Fn.bindAll = Xs),
                (Fn.bindKey = La),
                (Fn.castArray = function () {
                  if (!arguments.length) return [];
                  var e = arguments[0];
                  return Ha(e) ? e : [e];
                }),
                (Fn.chain = ha),
                (Fn.chunk = function (e, t, r) {
                  t = (r ? wi(e, t, r) : t === o) ? 1 : Kt(fs(t), 0);
                  var i = null == e ? 0 : e.length;
                  if (!i || t < 1) return [];
                  for (var a = 0, s = 0, l = n(pt(i / t)); a < i; )
                    l[s++] = ro(e, a, (a += t));
                  return l;
                }),
                (Fn.compact = function (e) {
                  for (
                    var t = -1, n = null == e ? 0 : e.length, r = 0, o = [];
                    ++t < n;

                  ) {
                    var i = e[t];
                    i && (o[r++] = i);
                  }
                  return o;
                }),
                (Fn.concat = function () {
                  var e = arguments.length;
                  if (!e) return [];
                  for (var t = n(e - 1), r = arguments[0], o = e; o--; )
                    t[o - 1] = arguments[o];
                  return Dt(Ha(r) ? Lo(r) : [r], vr(t, 1));
                }),
                (Fn.cond = function (e) {
                  var t = null == e ? 0 : e.length,
                    n = ci();
                  return (
                    (e = t
                      ? Nt(e, function (e) {
                          if ("function" != typeof e[1]) throw new Ie(i);
                          return [n(e[0]), e[1]];
                        })
                      : []),
                    Qr(function (n) {
                      for (var r = -1; ++r < t; ) {
                        var o = e[r];
                        if (Et(o[0], this, n)) return Et(o[1], this, n);
                      }
                    })
                  );
                }),
                (Fn.conforms = function (e) {
                  return (function (e) {
                    var t = Os(e);
                    return function (n) {
                      return cr(n, e, t);
                    };
                  })(lr(e, 1));
                }),
                (Fn.constant = el),
                (Fn.countBy = ga),
                (Fn.create = function (e, t) {
                  var n = Wn(e);
                  return null == t ? n : or(n, t);
                }),
                (Fn.curry = function e(t, n, r) {
                  var i = Jo(t, 8, o, o, o, o, o, (n = r ? o : n));
                  return (i.placeholder = e.placeholder), i;
                }),
                (Fn.curryRight = function e(t, n, r) {
                  var i = Jo(t, l, o, o, o, o, o, (n = r ? o : n));
                  return (i.placeholder = e.placeholder), i;
                }),
                (Fn.debounce = Oa),
                (Fn.defaults = ks),
                (Fn.defaultsDeep = As),
                (Fn.defer = Ma),
                (Fn.delay = Ra),
                (Fn.difference = Fi),
                (Fn.differenceBy = Wi),
                (Fn.differenceWith = zi),
                (Fn.drop = function (e, t, n) {
                  var r = null == e ? 0 : e.length;
                  return r
                    ? ro(e, (t = n || t === o ? 1 : fs(t)) < 0 ? 0 : t, r)
                    : [];
                }),
                (Fn.dropRight = function (e, t, n) {
                  var r = null == e ? 0 : e.length;
                  return r
                    ? ro(
                        e,
                        0,
                        (t = r - (t = n || t === o ? 1 : fs(t))) < 0 ? 0 : t
                      )
                    : [];
                }),
                (Fn.dropRightWhile = function (e, t) {
                  return e && e.length ? fo(e, ci(t, 3), !0, !0) : [];
                }),
                (Fn.dropWhile = function (e, t) {
                  return e && e.length ? fo(e, ci(t, 3), !0) : [];
                }),
                (Fn.fill = function (e, t, n, r) {
                  var i = null == e ? 0 : e.length;
                  return i
                    ? (n &&
                        "number" != typeof n &&
                        wi(e, t, n) &&
                        ((n = 0), (r = i)),
                      (function (e, t, n, r) {
                        var i = e.length;
                        for (
                          (n = fs(n)) < 0 && (n = -n > i ? 0 : i + n),
                            (r = r === o || r > i ? i : fs(r)) < 0 && (r += i),
                            r = n > r ? 0 : gs(r);
                          n < r;

                        )
                          e[n++] = t;
                        return e;
                      })(e, t, n, r))
                    : [];
                }),
                (Fn.filter = function (e, t) {
                  return (Ha(e) ? Mt : mr)(e, ci(t, 3));
                }),
                (Fn.flatMap = function (e, t) {
                  return vr(Sa(e, t), 1);
                }),
                (Fn.flatMapDeep = function (e, t) {
                  return vr(Sa(e, t), p);
                }),
                (Fn.flatMapDepth = function (e, t, n) {
                  return (n = n === o ? 1 : fs(n)), vr(Sa(e, t), n);
                }),
                (Fn.flatten = $i),
                (Fn.flattenDeep = function (e) {
                  return (null == e ? 0 : e.length) ? vr(e, p) : [];
                }),
                (Fn.flattenDepth = function (e, t) {
                  return (null == e ? 0 : e.length)
                    ? vr(e, (t = t === o ? 1 : fs(t)))
                    : [];
                }),
                (Fn.flip = function (e) {
                  return Jo(e, 512);
                }),
                (Fn.flow = tl),
                (Fn.flowRight = nl),
                (Fn.fromPairs = function (e) {
                  for (
                    var t = -1, n = null == e ? 0 : e.length, r = {};
                    ++t < n;

                  ) {
                    var o = e[t];
                    r[o[0]] = o[1];
                  }
                  return r;
                }),
                (Fn.functions = function (e) {
                  return null == e ? [] : xr(e, Os(e));
                }),
                (Fn.functionsIn = function (e) {
                  return null == e ? [] : xr(e, Ms(e));
                }),
                (Fn.groupBy = wa),
                (Fn.initial = function (e) {
                  return (null == e ? 0 : e.length) ? ro(e, 0, -1) : [];
                }),
                (Fn.intersection = Vi),
                (Fn.intersectionBy = Ki),
                (Fn.intersectionWith = Yi),
                (Fn.invert = Ts),
                (Fn.invertBy = Is),
                (Fn.invokeMap = _a),
                (Fn.iteratee = ol),
                (Fn.keyBy = xa),
                (Fn.keys = Os),
                (Fn.keysIn = Ms),
                (Fn.map = Sa),
                (Fn.mapKeys = function (e, t) {
                  var n = {};
                  return (
                    (t = ci(t, 3)),
                    wr(e, function (e, r, o) {
                      ir(n, t(e, r, o), e);
                    }),
                    n
                  );
                }),
                (Fn.mapValues = function (e, t) {
                  var n = {};
                  return (
                    (t = ci(t, 3)),
                    wr(e, function (e, r, o) {
                      ir(n, r, t(e, r, o));
                    }),
                    n
                  );
                }),
                (Fn.matches = function (e) {
                  return Fr(lr(e, 1));
                }),
                (Fn.matchesProperty = function (e, t) {
                  return Wr(e, lr(t, 1));
                }),
                (Fn.memoize = Pa),
                (Fn.merge = Rs),
                (Fn.mergeWith = Ps),
                (Fn.method = il),
                (Fn.methodOf = al),
                (Fn.mixin = sl),
                (Fn.negate = Na),
                (Fn.nthArg = function (e) {
                  return (
                    (e = fs(e)),
                    Qr(function (t) {
                      return Br(t, e);
                    })
                  );
                }),
                (Fn.omit = Ns),
                (Fn.omitBy = function (e, t) {
                  return qs(e, Na(ci(t)));
                }),
                (Fn.once = function (e) {
                  return Ta(2, e);
                }),
                (Fn.orderBy = function (e, t, n, r) {
                  return null == e
                    ? []
                    : (Ha(t) || (t = null == t ? [] : [t]),
                      Ha((n = r ? o : n)) || (n = null == n ? [] : [n]),
                      Hr(e, t, n));
                }),
                (Fn.over = cl),
                (Fn.overArgs = Da),
                (Fn.overEvery = ul),
                (Fn.overSome = dl),
                (Fn.partial = qa),
                (Fn.partialRight = ja),
                (Fn.partition = ka),
                (Fn.pick = Ds),
                (Fn.pickBy = qs),
                (Fn.property = hl),
                (Fn.propertyOf = function (e) {
                  return function (t) {
                    return null == e ? o : Sr(e, t);
                  };
                }),
                (Fn.pull = Zi),
                (Fn.pullAll = Ji),
                (Fn.pullAllBy = function (e, t, n) {
                  return e && e.length && t && t.length
                    ? Gr(e, t, ci(n, 2))
                    : e;
                }),
                (Fn.pullAllWith = function (e, t, n) {
                  return e && e.length && t && t.length ? Gr(e, t, o, n) : e;
                }),
                (Fn.pullAt = Xi),
                (Fn.range = pl),
                (Fn.rangeRight = fl),
                (Fn.rearg = Ua),
                (Fn.reject = function (e, t) {
                  return (Ha(e) ? Mt : mr)(e, Na(ci(t, 3)));
                }),
                (Fn.remove = function (e, t) {
                  var n = [];
                  if (!e || !e.length) return n;
                  var r = -1,
                    o = [],
                    i = e.length;
                  for (t = ci(t, 3); ++r < i; ) {
                    var a = e[r];
                    t(a, r, e) && (n.push(a), o.push(r));
                  }
                  return Vr(e, o), n;
                }),
                (Fn.rest = function (e, t) {
                  if ("function" != typeof e) throw new Ie(i);
                  return Qr(e, (t = t === o ? t : fs(t)));
                }),
                (Fn.reverse = ea),
                (Fn.sampleSize = function (e, t, n) {
                  return (
                    (t = (n ? wi(e, t, n) : t === o) ? 1 : fs(t)),
                    (Ha(e) ? Jn : Jr)(e, t)
                  );
                }),
                (Fn.set = function (e, t, n) {
                  return null == e ? e : Xr(e, t, n);
                }),
                (Fn.setWith = function (e, t, n, r) {
                  return (
                    (r = "function" == typeof r ? r : o),
                    null == e ? e : Xr(e, t, n, r)
                  );
                }),
                (Fn.shuffle = function (e) {
                  return (Ha(e) ? Xn : no)(e);
                }),
                (Fn.slice = function (e, t, n) {
                  var r = null == e ? 0 : e.length;
                  return r
                    ? (n && "number" != typeof n && wi(e, t, n)
                        ? ((t = 0), (n = r))
                        : ((t = null == t ? 0 : fs(t)),
                          (n = n === o ? r : fs(n))),
                      ro(e, t, n))
                    : [];
                }),
                (Fn.sortBy = Aa),
                (Fn.sortedUniq = function (e) {
                  return e && e.length ? so(e) : [];
                }),
                (Fn.sortedUniqBy = function (e, t) {
                  return e && e.length ? so(e, ci(t, 2)) : [];
                }),
                (Fn.split = function (e, t, n) {
                  return (
                    n && "number" != typeof n && wi(e, t, n) && (t = n = o),
                    (n = n === o ? m : n >>> 0)
                      ? (e = ys(e)) &&
                        ("string" == typeof t || (null != t && !is(t))) &&
                        !(t = co(t)) &&
                        ln(e)
                        ? xo(gn(e), 0, n)
                        : e.split(t, n)
                      : []
                  );
                }),
                (Fn.spread = function (e, t) {
                  if ("function" != typeof e) throw new Ie(i);
                  return (
                    (t = null == t ? 0 : Kt(fs(t), 0)),
                    Qr(function (n) {
                      var r = n[t],
                        o = xo(n, 0, t);
                      return r && Dt(o, r), Et(e, this, o);
                    })
                  );
                }),
                (Fn.tail = function (e) {
                  var t = null == e ? 0 : e.length;
                  return t ? ro(e, 1, t) : [];
                }),
                (Fn.take = function (e, t, n) {
                  return e && e.length
                    ? ro(e, 0, (t = n || t === o ? 1 : fs(t)) < 0 ? 0 : t)
                    : [];
                }),
                (Fn.takeRight = function (e, t, n) {
                  var r = null == e ? 0 : e.length;
                  return r
                    ? ro(
                        e,
                        (t = r - (t = n || t === o ? 1 : fs(t))) < 0 ? 0 : t,
                        r
                      )
                    : [];
                }),
                (Fn.takeRightWhile = function (e, t) {
                  return e && e.length ? fo(e, ci(t, 3), !1, !0) : [];
                }),
                (Fn.takeWhile = function (e, t) {
                  return e && e.length ? fo(e, ci(t, 3)) : [];
                }),
                (Fn.tap = function (e, t) {
                  return t(e), e;
                }),
                (Fn.throttle = function (e, t, n) {
                  var r = !0,
                    o = !0;
                  if ("function" != typeof e) throw new Ie(i);
                  return (
                    es(n) &&
                      ((r = "leading" in n ? !!n.leading : r),
                      (o = "trailing" in n ? !!n.trailing : o)),
                    Oa(e, t, { leading: r, maxWait: t, trailing: o })
                  );
                }),
                (Fn.thru = pa),
                (Fn.toArray = hs),
                (Fn.toPairs = js),
                (Fn.toPairsIn = Us),
                (Fn.toPath = function (e) {
                  return Ha(e) ? Nt(e, qi) : ls(e) ? [e] : Lo(Di(ys(e)));
                }),
                (Fn.toPlainObject = vs),
                (Fn.transform = function (e, t, n) {
                  var r = Ha(e),
                    o = r || Ka(e) || cs(e);
                  if (((t = ci(t, 4)), null == n)) {
                    var i = e && e.constructor;
                    n = o
                      ? r
                        ? new i()
                        : []
                      : es(e) && Za(i)
                      ? Wn(Ge(e))
                      : {};
                  }
                  return (
                    (o ? It : wr)(e, function (e, r, o) {
                      return t(n, e, r, o);
                    }),
                    n
                  );
                }),
                (Fn.unary = function (e) {
                  return Ea(e, 1);
                }),
                (Fn.union = ta),
                (Fn.unionBy = na),
                (Fn.unionWith = ra),
                (Fn.uniq = function (e) {
                  return e && e.length ? uo(e) : [];
                }),
                (Fn.uniqBy = function (e, t) {
                  return e && e.length ? uo(e, ci(t, 2)) : [];
                }),
                (Fn.uniqWith = function (e, t) {
                  return (
                    (t = "function" == typeof t ? t : o),
                    e && e.length ? uo(e, o, t) : []
                  );
                }),
                (Fn.unset = function (e, t) {
                  return null == e || ho(e, t);
                }),
                (Fn.unzip = oa),
                (Fn.unzipWith = ia),
                (Fn.update = function (e, t, n) {
                  return null == e ? e : po(e, t, bo(n));
                }),
                (Fn.updateWith = function (e, t, n, r) {
                  return (
                    (r = "function" == typeof r ? r : o),
                    null == e ? e : po(e, t, bo(n), r)
                  );
                }),
                (Fn.values = Fs),
                (Fn.valuesIn = function (e) {
                  return null == e ? [] : en(e, Ms(e));
                }),
                (Fn.without = aa),
                (Fn.words = Zs),
                (Fn.wrap = function (e, t) {
                  return qa(bo(t), e);
                }),
                (Fn.xor = sa),
                (Fn.xorBy = la),
                (Fn.xorWith = ca),
                (Fn.zip = ua),
                (Fn.zipObject = function (e, t) {
                  return vo(e || [], t || [], tr);
                }),
                (Fn.zipObjectDeep = function (e, t) {
                  return vo(e || [], t || [], Xr);
                }),
                (Fn.zipWith = da),
                (Fn.entries = js),
                (Fn.entriesIn = Us),
                (Fn.extend = ws),
                (Fn.extendWith = _s),
                sl(Fn, Fn),
                (Fn.add = vl),
                (Fn.attempt = Js),
                (Fn.camelCase = Ws),
                (Fn.capitalize = zs),
                (Fn.ceil = yl),
                (Fn.clamp = function (e, t, n) {
                  return (
                    n === o && ((n = t), (t = o)),
                    n !== o && (n = (n = ms(n)) === n ? n : 0),
                    t !== o && (t = (t = ms(t)) === t ? t : 0),
                    sr(ms(e), t, n)
                  );
                }),
                (Fn.clone = function (e) {
                  return lr(e, 4);
                }),
                (Fn.cloneDeep = function (e) {
                  return lr(e, 5);
                }),
                (Fn.cloneDeepWith = function (e, t) {
                  return lr(e, 5, (t = "function" == typeof t ? t : o));
                }),
                (Fn.cloneWith = function (e, t) {
                  return lr(e, 4, (t = "function" == typeof t ? t : o));
                }),
                (Fn.conformsTo = function (e, t) {
                  return null == t || cr(e, t, Os(t));
                }),
                (Fn.deburr = Bs),
                (Fn.defaultTo = function (e, t) {
                  return null == e || e !== e ? t : e;
                }),
                (Fn.divide = bl),
                (Fn.endsWith = function (e, t, n) {
                  (e = ys(e)), (t = co(t));
                  var r = e.length,
                    i = (n = n === o ? r : sr(fs(n), 0, r));
                  return (n -= t.length) >= 0 && e.slice(n, i) == t;
                }),
                (Fn.eq = Fa),
                (Fn.escape = function (e) {
                  return (e = ys(e)) && Z.test(e) ? e.replace(Y, an) : e;
                }),
                (Fn.escapeRegExp = function (e) {
                  return (e = ys(e)) && ie.test(e) ? e.replace(oe, "\\$&") : e;
                }),
                (Fn.every = function (e, t, n) {
                  var r = Ha(e) ? Ot : fr;
                  return n && wi(e, t, n) && (t = o), r(e, ci(t, 3));
                }),
                (Fn.find = ma),
                (Fn.findIndex = Bi),
                (Fn.findKey = function (e, t) {
                  return Wt(e, ci(t, 3), wr);
                }),
                (Fn.findLast = va),
                (Fn.findLastIndex = Hi),
                (Fn.findLastKey = function (e, t) {
                  return Wt(e, ci(t, 3), _r);
                }),
                (Fn.floor = wl),
                (Fn.forEach = ya),
                (Fn.forEachRight = ba),
                (Fn.forIn = function (e, t) {
                  return null == e ? e : yr(e, ci(t, 3), Ms);
                }),
                (Fn.forInRight = function (e, t) {
                  return null == e ? e : br(e, ci(t, 3), Ms);
                }),
                (Fn.forOwn = function (e, t) {
                  return e && wr(e, ci(t, 3));
                }),
                (Fn.forOwnRight = function (e, t) {
                  return e && _r(e, ci(t, 3));
                }),
                (Fn.get = Cs),
                (Fn.gt = Wa),
                (Fn.gte = za),
                (Fn.has = function (e, t) {
                  return null != e && mi(e, t, Er);
                }),
                (Fn.hasIn = Es),
                (Fn.head = Gi),
                (Fn.identity = rl),
                (Fn.includes = function (e, t, n, r) {
                  (e = Ga(e) ? e : Fs(e)), (n = n && !r ? fs(n) : 0);
                  var o = e.length;
                  return (
                    n < 0 && (n = Kt(o + n, 0)),
                    ss(e)
                      ? n <= o && e.indexOf(t, n) > -1
                      : !!o && Bt(e, t, n) > -1
                  );
                }),
                (Fn.indexOf = function (e, t, n) {
                  var r = null == e ? 0 : e.length;
                  if (!r) return -1;
                  var o = null == n ? 0 : fs(n);
                  return o < 0 && (o = Kt(r + o, 0)), Bt(e, t, o);
                }),
                (Fn.inRange = function (e, t, n) {
                  return (
                    (t = ps(t)),
                    n === o ? ((n = t), (t = 0)) : (n = ps(n)),
                    (function (e, t, n) {
                      return e >= bn(t, n) && e < Kt(t, n);
                    })((e = ms(e)), t, n)
                  );
                }),
                (Fn.invoke = Ls),
                (Fn.isArguments = Ba),
                (Fn.isArray = Ha),
                (Fn.isArrayBuffer = $a),
                (Fn.isArrayLike = Ga),
                (Fn.isArrayLikeObject = Va),
                (Fn.isBoolean = function (e) {
                  return !0 === e || !1 === e || (ts(e) && Ar(e) == w);
                }),
                (Fn.isBuffer = Ka),
                (Fn.isDate = Ya),
                (Fn.isElement = function (e) {
                  return ts(e) && 1 === e.nodeType && !os(e);
                }),
                (Fn.isEmpty = function (e) {
                  if (null == e) return !0;
                  if (
                    Ga(e) &&
                    (Ha(e) ||
                      "string" == typeof e ||
                      "function" == typeof e.splice ||
                      Ka(e) ||
                      cs(e) ||
                      Ba(e))
                  )
                    return !e.length;
                  var t = gi(e);
                  if (t == A || t == L) return !e.size;
                  if (ki(e)) return !Dr(e).length;
                  for (var n in e) if (Ne.call(e, n)) return !1;
                  return !0;
                }),
                (Fn.isEqual = function (e, t) {
                  return Mr(e, t);
                }),
                (Fn.isEqualWith = function (e, t, n) {
                  var r = (n = "function" == typeof n ? n : o) ? n(e, t) : o;
                  return r === o ? Mr(e, t, o, n) : !!r;
                }),
                (Fn.isError = Qa),
                (Fn.isFinite = function (e) {
                  return "number" == typeof e && bt(e);
                }),
                (Fn.isFunction = Za),
                (Fn.isInteger = Ja),
                (Fn.isLength = Xa),
                (Fn.isMap = ns),
                (Fn.isMatch = function (e, t) {
                  return e === t || Rr(e, t, di(t));
                }),
                (Fn.isMatchWith = function (e, t, n) {
                  return (
                    (n = "function" == typeof n ? n : o), Rr(e, t, di(t), n)
                  );
                }),
                (Fn.isNaN = function (e) {
                  return rs(e) && e != +e;
                }),
                (Fn.isNative = function (e) {
                  if (Si(e))
                    throw new se(
                      "Unsupported core-js use. Try https://npms.io/search?q=ponyfill."
                    );
                  return Pr(e);
                }),
                (Fn.isNil = function (e) {
                  return null == e;
                }),
                (Fn.isNull = function (e) {
                  return null === e;
                }),
                (Fn.isNumber = rs),
                (Fn.isObject = es),
                (Fn.isObjectLike = ts),
                (Fn.isPlainObject = os),
                (Fn.isRegExp = is),
                (Fn.isSafeInteger = function (e) {
                  return Ja(e) && e >= -9007199254740991 && e <= f;
                }),
                (Fn.isSet = as),
                (Fn.isString = ss),
                (Fn.isSymbol = ls),
                (Fn.isTypedArray = cs),
                (Fn.isUndefined = function (e) {
                  return e === o;
                }),
                (Fn.isWeakMap = function (e) {
                  return ts(e) && gi(e) == R;
                }),
                (Fn.isWeakSet = function (e) {
                  return ts(e) && "[object WeakSet]" == Ar(e);
                }),
                (Fn.join = function (e, t) {
                  return null == e ? "" : wt.call(e, t);
                }),
                (Fn.kebabCase = Hs),
                (Fn.last = Qi),
                (Fn.lastIndexOf = function (e, t, n) {
                  var r = null == e ? 0 : e.length;
                  if (!r) return -1;
                  var i = r;
                  return (
                    n !== o &&
                      (i = (i = fs(n)) < 0 ? Kt(r + i, 0) : bn(i, r - 1)),
                    t === t
                      ? (function (e, t, n) {
                          for (var r = n + 1; r--; ) if (e[r] === t) return r;
                          return r;
                        })(e, t, i)
                      : zt(e, $t, i, !0)
                  );
                }),
                (Fn.lowerCase = $s),
                (Fn.lowerFirst = Gs),
                (Fn.lt = us),
                (Fn.lte = ds),
                (Fn.max = function (e) {
                  return e && e.length ? gr(e, rl, Cr) : o;
                }),
                (Fn.maxBy = function (e, t) {
                  return e && e.length ? gr(e, ci(t, 2), Cr) : o;
                }),
                (Fn.mean = function (e) {
                  return Gt(e, rl);
                }),
                (Fn.meanBy = function (e, t) {
                  return Gt(e, ci(t, 2));
                }),
                (Fn.min = function (e) {
                  return e && e.length ? gr(e, rl, jr) : o;
                }),
                (Fn.minBy = function (e, t) {
                  return e && e.length ? gr(e, ci(t, 2), jr) : o;
                }),
                (Fn.stubArray = gl),
                (Fn.stubFalse = ml),
                (Fn.stubObject = function () {
                  return {};
                }),
                (Fn.stubString = function () {
                  return "";
                }),
                (Fn.stubTrue = function () {
                  return !0;
                }),
                (Fn.multiply = _l),
                (Fn.nth = function (e, t) {
                  return e && e.length ? Br(e, fs(t)) : o;
                }),
                (Fn.noConflict = function () {
                  return gt._ === this && (gt._ = Fe), this;
                }),
                (Fn.noop = ll),
                (Fn.now = Ca),
                (Fn.pad = function (e, t, n) {
                  e = ys(e);
                  var r = (t = fs(t)) ? fn(e) : 0;
                  if (!t || r >= t) return e;
                  var o = (t - r) / 2;
                  return $o(ft(o), n) + e + $o(pt(o), n);
                }),
                (Fn.padEnd = function (e, t, n) {
                  e = ys(e);
                  var r = (t = fs(t)) ? fn(e) : 0;
                  return t && r < t ? e + $o(t - r, n) : e;
                }),
                (Fn.padStart = function (e, t, n) {
                  e = ys(e);
                  var r = (t = fs(t)) ? fn(e) : 0;
                  return t && r < t ? $o(t - r, n) + e : e;
                }),
                (Fn.parseInt = function (e, t, n) {
                  return (
                    n || null == t ? (t = 0) : t && (t = +t),
                    _n(ys(e).replace(ae, ""), t || 0)
                  );
                }),
                (Fn.random = function (e, t, n) {
                  if (
                    (n && "boolean" != typeof n && wi(e, t, n) && (t = n = o),
                    n === o &&
                      ("boolean" == typeof t
                        ? ((n = t), (t = o))
                        : "boolean" == typeof e && ((n = e), (e = o))),
                    e === o && t === o
                      ? ((e = 0), (t = 1))
                      : ((e = ps(e)),
                        t === o ? ((t = e), (e = 0)) : (t = ps(t))),
                    e > t)
                  ) {
                    var r = e;
                    (e = t), (t = r);
                  }
                  if (n || e % 1 || t % 1) {
                    var i = xn();
                    return bn(
                      e + i * (t - e + dt("1e-" + ((i + "").length - 1))),
                      t
                    );
                  }
                  return Kr(e, t);
                }),
                (Fn.reduce = function (e, t, n) {
                  var r = Ha(e) ? qt : Yt,
                    o = arguments.length < 3;
                  return r(e, ci(t, 4), n, o, hr);
                }),
                (Fn.reduceRight = function (e, t, n) {
                  var r = Ha(e) ? jt : Yt,
                    o = arguments.length < 3;
                  return r(e, ci(t, 4), n, o, pr);
                }),
                (Fn.repeat = function (e, t, n) {
                  return (
                    (t = (n ? wi(e, t, n) : t === o) ? 1 : fs(t)), Yr(ys(e), t)
                  );
                }),
                (Fn.replace = function () {
                  var e = arguments,
                    t = ys(e[0]);
                  return e.length < 3 ? t : t.replace(e[1], e[2]);
                }),
                (Fn.result = function (e, t, n) {
                  var r = -1,
                    i = (t = wo(t, e)).length;
                  for (i || ((i = 1), (e = o)); ++r < i; ) {
                    var a = null == e ? o : e[qi(t[r])];
                    a === o && ((r = i), (a = n)), (e = Za(a) ? a.call(e) : a);
                  }
                  return e;
                }),
                (Fn.round = xl),
                (Fn.runInContext = e),
                (Fn.sample = function (e) {
                  return (Ha(e) ? Zn : Zr)(e);
                }),
                (Fn.size = function (e) {
                  if (null == e) return 0;
                  if (Ga(e)) return ss(e) ? fn(e) : e.length;
                  var t = gi(e);
                  return t == A || t == L ? e.size : Dr(e).length;
                }),
                (Fn.snakeCase = Vs),
                (Fn.some = function (e, t, n) {
                  var r = Ha(e) ? Ut : oo;
                  return n && wi(e, t, n) && (t = o), r(e, ci(t, 3));
                }),
                (Fn.sortedIndex = function (e, t) {
                  return io(e, t);
                }),
                (Fn.sortedIndexBy = function (e, t, n) {
                  return ao(e, t, ci(n, 2));
                }),
                (Fn.sortedIndexOf = function (e, t) {
                  var n = null == e ? 0 : e.length;
                  if (n) {
                    var r = io(e, t);
                    if (r < n && Fa(e[r], t)) return r;
                  }
                  return -1;
                }),
                (Fn.sortedLastIndex = function (e, t) {
                  return io(e, t, !0);
                }),
                (Fn.sortedLastIndexBy = function (e, t, n) {
                  return ao(e, t, ci(n, 2), !0);
                }),
                (Fn.sortedLastIndexOf = function (e, t) {
                  if (null == e ? 0 : e.length) {
                    var n = io(e, t, !0) - 1;
                    if (Fa(e[n], t)) return n;
                  }
                  return -1;
                }),
                (Fn.startCase = Ks),
                (Fn.startsWith = function (e, t, n) {
                  return (
                    (e = ys(e)),
                    (n = null == n ? 0 : sr(fs(n), 0, e.length)),
                    (t = co(t)),
                    e.slice(n, n + t.length) == t
                  );
                }),
                (Fn.subtract = Sl),
                (Fn.sum = function (e) {
                  return e && e.length ? Qt(e, rl) : 0;
                }),
                (Fn.sumBy = function (e, t) {
                  return e && e.length ? Qt(e, ci(t, 2)) : 0;
                }),
                (Fn.template = function (e, t, n) {
                  var r = Fn.templateSettings;
                  n && wi(e, t, n) && (t = o),
                    (e = ys(e)),
                    (t = _s({}, t, r, Xo));
                  var i,
                    a,
                    s = _s({}, t.imports, r.imports, Xo),
                    l = Os(s),
                    c = en(s, l),
                    u = 0,
                    d = t.interpolate || xe,
                    h = "__p += '",
                    p = Ee(
                      (t.escape || xe).source +
                        "|" +
                        d.source +
                        "|" +
                        (d === ee ? fe : xe).source +
                        "|" +
                        (t.evaluate || xe).source +
                        "|$",
                      "g"
                    ),
                    f =
                      "//# sourceURL=" +
                      (Ne.call(t, "sourceURL")
                        ? (t.sourceURL + "").replace(/\s/g, " ")
                        : "lodash.templateSources[" + ++st + "]") +
                      "\n";
                  e.replace(p, function (t, n, r, o, s, l) {
                    return (
                      r || (r = o),
                      (h += e.slice(u, l).replace(Se, sn)),
                      n && ((i = !0), (h += "' +\n__e(" + n + ") +\n'")),
                      s && ((a = !0), (h += "';\n" + s + ";\n__p += '")),
                      r &&
                        (h +=
                          "' +\n((__t = (" + r + ")) == null ? '' : __t) +\n'"),
                      (u = l + t.length),
                      t
                    );
                  }),
                    (h += "';\n");
                  var g = Ne.call(t, "variable") && t.variable;
                  if (g) {
                    if (he.test(g))
                      throw new se(
                        "Invalid `variable` option passed into `_.template`"
                      );
                  } else h = "with (obj) {\n" + h + "\n}\n";
                  (h = (a ? h.replace($, "") : h)
                    .replace(G, "$1")
                    .replace(V, "$1;")),
                    (h =
                      "function(" +
                      (g || "obj") +
                      ") {\n" +
                      (g ? "" : "obj || (obj = {});\n") +
                      "var __t, __p = ''" +
                      (i ? ", __e = _.escape" : "") +
                      (a
                        ? ", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n"
                        : ";\n") +
                      h +
                      "return __p\n}");
                  var m = Js(function () {
                    return ke(l, f + "return " + h).apply(o, c);
                  });
                  if (((m.source = h), Qa(m))) throw m;
                  return m;
                }),
                (Fn.times = function (e, t) {
                  if ((e = fs(e)) < 1 || e > f) return [];
                  var n = m,
                    r = bn(e, m);
                  (t = ci(t)), (e -= m);
                  for (var o = Zt(r, t); ++n < e; ) t(n);
                  return o;
                }),
                (Fn.toFinite = ps),
                (Fn.toInteger = fs),
                (Fn.toLength = gs),
                (Fn.toLower = function (e) {
                  return ys(e).toLowerCase();
                }),
                (Fn.toNumber = ms),
                (Fn.toSafeInteger = function (e) {
                  return e ? sr(fs(e), -9007199254740991, f) : 0 === e ? e : 0;
                }),
                (Fn.toString = ys),
                (Fn.toUpper = function (e) {
                  return ys(e).toUpperCase();
                }),
                (Fn.trim = function (e, t, n) {
                  if ((e = ys(e)) && (n || t === o)) return Jt(e);
                  if (!e || !(t = co(t))) return e;
                  var r = gn(e),
                    i = gn(t);
                  return xo(r, nn(r, i), rn(r, i) + 1).join("");
                }),
                (Fn.trimEnd = function (e, t, n) {
                  if ((e = ys(e)) && (n || t === o))
                    return e.slice(0, mn(e) + 1);
                  if (!e || !(t = co(t))) return e;
                  var r = gn(e);
                  return xo(r, 0, rn(r, gn(t)) + 1).join("");
                }),
                (Fn.trimStart = function (e, t, n) {
                  if ((e = ys(e)) && (n || t === o)) return e.replace(ae, "");
                  if (!e || !(t = co(t))) return e;
                  var r = gn(e);
                  return xo(r, nn(r, gn(t))).join("");
                }),
                (Fn.truncate = function (e, t) {
                  var n = 30,
                    r = "...";
                  if (es(t)) {
                    var i = "separator" in t ? t.separator : i;
                    (n = "length" in t ? fs(t.length) : n),
                      (r = "omission" in t ? co(t.omission) : r);
                  }
                  var a = (e = ys(e)).length;
                  if (ln(e)) {
                    var s = gn(e);
                    a = s.length;
                  }
                  if (n >= a) return e;
                  var l = n - fn(r);
                  if (l < 1) return r;
                  var c = s ? xo(s, 0, l).join("") : e.slice(0, l);
                  if (i === o) return c + r;
                  if ((s && (l += c.length - l), is(i))) {
                    if (e.slice(l).search(i)) {
                      var u,
                        d = c;
                      for (
                        i.global || (i = Ee(i.source, ys(ge.exec(i)) + "g")),
                          i.lastIndex = 0;
                        (u = i.exec(d));

                      )
                        var h = u.index;
                      c = c.slice(0, h === o ? l : h);
                    }
                  } else if (e.indexOf(co(i), l) != l) {
                    var p = c.lastIndexOf(i);
                    p > -1 && (c = c.slice(0, p));
                  }
                  return c + r;
                }),
                (Fn.unescape = function (e) {
                  return (e = ys(e)) && Q.test(e) ? e.replace(K, vn) : e;
                }),
                (Fn.uniqueId = function (e) {
                  var t = ++De;
                  return ys(e) + t;
                }),
                (Fn.upperCase = Ys),
                (Fn.upperFirst = Qs),
                (Fn.each = ya),
                (Fn.eachRight = ba),
                (Fn.first = Gi),
                sl(
                  Fn,
                  (function () {
                    var e = {};
                    return (
                      wr(Fn, function (t, n) {
                        Ne.call(Fn.prototype, n) || (e[n] = t);
                      }),
                      e
                    );
                  })(),
                  { chain: !1 }
                ),
                (Fn.VERSION = "4.17.21"),
                It(
                  [
                    "bind",
                    "bindKey",
                    "curry",
                    "curryRight",
                    "partial",
                    "partialRight",
                  ],
                  function (e) {
                    Fn[e].placeholder = Fn;
                  }
                ),
                It(["drop", "take"], function (e, t) {
                  (Hn.prototype[e] = function (n) {
                    n = n === o ? 1 : Kt(fs(n), 0);
                    var r =
                      this.__filtered__ && !t ? new Hn(this) : this.clone();
                    return (
                      r.__filtered__
                        ? (r.__takeCount__ = bn(n, r.__takeCount__))
                        : r.__views__.push({
                            size: bn(n, m),
                            type: e + (r.__dir__ < 0 ? "Right" : ""),
                          }),
                      r
                    );
                  }),
                    (Hn.prototype[e + "Right"] = function (t) {
                      return this.reverse()[e](t).reverse();
                    });
                }),
                It(["filter", "map", "takeWhile"], function (e, t) {
                  var n = t + 1,
                    r = 1 == n || 3 == n;
                  Hn.prototype[e] = function (e) {
                    var t = this.clone();
                    return (
                      t.__iteratees__.push({ iteratee: ci(e, 3), type: n }),
                      (t.__filtered__ = t.__filtered__ || r),
                      t
                    );
                  };
                }),
                It(["head", "last"], function (e, t) {
                  var n = "take" + (t ? "Right" : "");
                  Hn.prototype[e] = function () {
                    return this[n](1).value()[0];
                  };
                }),
                It(["initial", "tail"], function (e, t) {
                  var n = "drop" + (t ? "" : "Right");
                  Hn.prototype[e] = function () {
                    return this.__filtered__ ? new Hn(this) : this[n](1);
                  };
                }),
                (Hn.prototype.compact = function () {
                  return this.filter(rl);
                }),
                (Hn.prototype.find = function (e) {
                  return this.filter(e).head();
                }),
                (Hn.prototype.findLast = function (e) {
                  return this.reverse().find(e);
                }),
                (Hn.prototype.invokeMap = Qr(function (e, t) {
                  return "function" == typeof e
                    ? new Hn(this)
                    : this.map(function (n) {
                        return Lr(n, e, t);
                      });
                })),
                (Hn.prototype.reject = function (e) {
                  return this.filter(Na(ci(e)));
                }),
                (Hn.prototype.slice = function (e, t) {
                  e = fs(e);
                  var n = this;
                  return n.__filtered__ && (e > 0 || t < 0)
                    ? new Hn(n)
                    : (e < 0 ? (n = n.takeRight(-e)) : e && (n = n.drop(e)),
                      t !== o &&
                        (n = (t = fs(t)) < 0 ? n.dropRight(-t) : n.take(t - e)),
                      n);
                }),
                (Hn.prototype.takeRightWhile = function (e) {
                  return this.reverse().takeWhile(e).reverse();
                }),
                (Hn.prototype.toArray = function () {
                  return this.take(m);
                }),
                wr(Hn.prototype, function (e, t) {
                  var n = /^(?:filter|find|map|reject)|While$/.test(t),
                    r = /^(?:head|last)$/.test(t),
                    i = Fn[r ? "take" + ("last" == t ? "Right" : "") : t],
                    a = r || /^find/.test(t);
                  i &&
                    (Fn.prototype[t] = function () {
                      var t = this.__wrapped__,
                        s = r ? [1] : arguments,
                        l = t instanceof Hn,
                        c = s[0],
                        u = l || Ha(t),
                        d = function (e) {
                          var t = i.apply(Fn, Dt([e], s));
                          return r && h ? t[0] : t;
                        };
                      u &&
                        n &&
                        "function" == typeof c &&
                        1 != c.length &&
                        (l = u = !1);
                      var h = this.__chain__,
                        p = !!this.__actions__.length,
                        f = a && !h,
                        g = l && !p;
                      if (!a && u) {
                        t = g ? t : new Hn(this);
                        var m = e.apply(t, s);
                        return (
                          m.__actions__.push({
                            func: pa,
                            args: [d],
                            thisArg: o,
                          }),
                          new Bn(m, h)
                        );
                      }
                      return f && g
                        ? e.apply(this, s)
                        : ((m = this.thru(d)),
                          f ? (r ? m.value()[0] : m.value()) : m);
                    });
                }),
                It(
                  ["pop", "push", "shift", "sort", "splice", "unshift"],
                  function (e) {
                    var t = Le[e],
                      n = /^(?:push|sort|unshift)$/.test(e) ? "tap" : "thru",
                      r = /^(?:pop|shift)$/.test(e);
                    Fn.prototype[e] = function () {
                      var e = arguments;
                      if (r && !this.__chain__) {
                        var o = this.value();
                        return t.apply(Ha(o) ? o : [], e);
                      }
                      return this[n](function (n) {
                        return t.apply(Ha(n) ? n : [], e);
                      });
                    };
                  }
                ),
                wr(Hn.prototype, function (e, t) {
                  var n = Fn[t];
                  if (n) {
                    var r = n.name + "";
                    Ne.call(On, r) || (On[r] = []),
                      On[r].push({ name: t, func: n });
                  }
                }),
                (On[Wo(o, 2).name] = [{ name: "wrapper", func: o }]),
                (Hn.prototype.clone = function () {
                  var e = new Hn(this.__wrapped__);
                  return (
                    (e.__actions__ = Lo(this.__actions__)),
                    (e.__dir__ = this.__dir__),
                    (e.__filtered__ = this.__filtered__),
                    (e.__iteratees__ = Lo(this.__iteratees__)),
                    (e.__takeCount__ = this.__takeCount__),
                    (e.__views__ = Lo(this.__views__)),
                    e
                  );
                }),
                (Hn.prototype.reverse = function () {
                  if (this.__filtered__) {
                    var e = new Hn(this);
                    (e.__dir__ = -1), (e.__filtered__ = !0);
                  } else (e = this.clone()).__dir__ *= -1;
                  return e;
                }),
                (Hn.prototype.value = function () {
                  var e = this.__wrapped__.value(),
                    t = this.__dir__,
                    n = Ha(e),
                    r = t < 0,
                    o = n ? e.length : 0,
                    i = (function (e, t, n) {
                      var r = -1,
                        o = n.length;
                      for (; ++r < o; ) {
                        var i = n[r],
                          a = i.size;
                        switch (i.type) {
                          case "drop":
                            e += a;
                            break;
                          case "dropRight":
                            t -= a;
                            break;
                          case "take":
                            t = bn(t, e + a);
                            break;
                          case "takeRight":
                            e = Kt(e, t - a);
                        }
                      }
                      return { start: e, end: t };
                    })(0, o, this.__views__),
                    a = i.start,
                    s = i.end,
                    l = s - a,
                    c = r ? s : a - 1,
                    u = this.__iteratees__,
                    d = u.length,
                    h = 0,
                    p = bn(l, this.__takeCount__);
                  if (!n || (!r && o == l && p == l))
                    return go(e, this.__actions__);
                  var f = [];
                  e: for (; l-- && h < p; ) {
                    for (var g = -1, m = e[(c += t)]; ++g < d; ) {
                      var v = u[g],
                        y = v.iteratee,
                        b = v.type,
                        w = y(m);
                      if (2 == b) m = w;
                      else if (!w) {
                        if (1 == b) continue e;
                        break e;
                      }
                    }
                    f[h++] = m;
                  }
                  return f;
                }),
                (Fn.prototype.at = fa),
                (Fn.prototype.chain = function () {
                  return ha(this);
                }),
                (Fn.prototype.commit = function () {
                  return new Bn(this.value(), this.__chain__);
                }),
                (Fn.prototype.next = function () {
                  this.__values__ === o && (this.__values__ = hs(this.value()));
                  var e = this.__index__ >= this.__values__.length;
                  return {
                    done: e,
                    value: e ? o : this.__values__[this.__index__++],
                  };
                }),
                (Fn.prototype.plant = function (e) {
                  for (var t, n = this; n instanceof zn; ) {
                    var r = Ui(n);
                    (r.__index__ = 0),
                      (r.__values__ = o),
                      t ? (i.__wrapped__ = r) : (t = r);
                    var i = r;
                    n = n.__wrapped__;
                  }
                  return (i.__wrapped__ = e), t;
                }),
                (Fn.prototype.reverse = function () {
                  var e = this.__wrapped__;
                  if (e instanceof Hn) {
                    var t = e;
                    return (
                      this.__actions__.length && (t = new Hn(this)),
                      (t = t.reverse()).__actions__.push({
                        func: pa,
                        args: [ea],
                        thisArg: o,
                      }),
                      new Bn(t, this.__chain__)
                    );
                  }
                  return this.thru(ea);
                }),
                (Fn.prototype.toJSON =
                  Fn.prototype.valueOf =
                  Fn.prototype.value =
                    function () {
                      return go(this.__wrapped__, this.__actions__);
                    }),
                (Fn.prototype.first = Fn.prototype.head),
                Ze &&
                  (Fn.prototype[Ze] = function () {
                    return this;
                  }),
                Fn
              );
            })();
            (gt._ = yn),
              (r = function () {
                return yn;
              }.call(t, n, t, e)) === o || (e.exports = r);
          }.call(this);
      },
      35291: (e, t, n) => {
        "use strict";
        n.d(t, { Z: () => o });
        var r = n(72072);
        const o = (e, t) => {
          const n = (0, r.P0)(e),
            o = (0, r.P0)(t),
            i = n.pop(),
            a = o.pop(),
            s = (0, r.Uy)(n, o);
          return 0 !== s
            ? s
            : i && a
            ? (0, r.Uy)(i.split("."), a.split("."))
            : i || a
            ? i
              ? -1
              : 1
            : 0;
        };
      },
      35388: (e, t, n) => {
        "use strict";
        n.d(t, { Ay: () => p, E1: () => d, HL: () => s, yY: () => h });
        var r = n(47041),
          o = n(27443);
        let i = null,
          a = {
            NODE_ENV: "production",
            PUBLIC_URL: "",
            WDS_SOCKET_HOST: void 0,
            WDS_SOCKET_PATH: void 0,
            WDS_SOCKET_PORT: void 0,
            FAST_REFRESH: !0,
            REACT_APP_ENV: null,
            REACT_APP_VM: !1,
            REACT_APP_ACCOUNT: "chatglm",
          }.REACT_APP_MODEL;
        const s = !!i || !1,
          l = "browser_extension";
        let c = o.Hr.domain;
        const u = {
            host: "https://".concat(c),
            go2login: "https://"
              .concat(c, "/main/alltoolsdetail?fr=")
              .concat(l, "&sr=3rd"),
            get cookieDomain() {
              return new URL(u.go2login).hostname;
            },
            cookiesName: o.Hr.cookiesName,
            get tokenCookieKey() {
              return this.cookiesName[1];
            },
            get refreshTokenCookieKey() {
              return this.cookiesName[2];
            },
            get tokenExpiresCookieKey() {
              return this.cookiesName[0];
            },
            get userIdCookieKey() {
              return this.cookiesName[3];
            },
            storageName: [
              "token_expires",
              "access_token",
              "refresh_token",
              "user_id",
            ],
            get tokenStorageKey() {
              return this.storageName[1];
            },
            get refreshTokenStorageKey() {
              return this.storageName[2];
            },
            get tokenExpiresStorageKey() {
              return this.storageName[0];
            },
            get userIdStorageKey() {
              return this.storageName[3];
            },
            help: "https://zhipu-ai.feishu.cn/wiki/ICTHwxNtjiol3RkvAFrc7mRYnVK",
            feedback:
              "https://bjzphzkjyxgsha.qiyukf.com/worksheet/page/plugin/{{page}}?pluginId=b28a9957693b46f9b36067c43be41c9d&type=1&fid={{user_id}}",
            feedbackWithUserId: function (e) {
              let t =
                arguments.length > 1 && void 0 !== arguments[1]
                  ? arguments[1]
                  : "submit";
              return u.feedback
                .replace("{{page}}", t)
                .replace(
                  "{{user_id}}",
                  e || Math.random().toString(36).slice(2)
                );
            },
            history: "https://"
              .concat(c, "/main/gdetail/671b5e6096f6efe46eb13c4c?lang=zh&fr=")
              .concat(l, "&history=open"),
            update:
              "https://zhipu-ai.feishu.cn/wiki/WReCw9zfvii1Yakwd2gcYUiGnSl",
            landing:
              "https://new-front.chatglm.cn/webagent/landing/index.html?channel=",
            authorized: "https://".concat(c, "/advanced-authpolicy"),
            codeGeeX: "https://codegeex.cn?channel_utm_campaign="
              .concat(l, "&utm_campaign=")
              .concat(l),
            get webStore() {
              return "edge" === (0, r.cO)()
                ? "https://microsoftedge.microsoft.com/addons/detail/knbkdepkhkdnipfhlfhbdomkejmghmjj"
                : "https://chromewebstore.google.com/detail/mnpdbmgpebfihcndnpgdaihnkmloclkd";
            },
            becomeVip: "https://"
              .concat(c, "/main/alltoolsdetail?lang=zh&action=become_vip&fr=")
              .concat(l),
          },
          d = () => a,
          h = {
            webagent: {
              host: o.Hr.host.webagent,
              get prefix() {
                return o.Hr.envPath;
              },
              path: {
                chat: "/chat",
                userInfo: "/user_info",
                userConfig: "/user_config",
                feedback: "/feedback",
                controller: "/controller",
                planner: "/planner",
                config: "/config",
                ocr: "/ocr",
                translate: "/translate",
                genReport: "/gen_report",
                searchIssues: "/search_issues",
                upload: "/upload",
                workflow: "/workflow",
                assistant_upload_file: "/assistant_upload_file",
                dr_format: "/dr_format",
                refreshToken: "/userapi/refresh",
              },
              publicPath: { chat: "/public_chat" },
            },
            vmWs: { host: o.Hr.host.vmWs },
            userApi: {
              host: o.Hr.host.userApi,
              get prefix() {
                return "/userapi";
              },
              path: { refreshToken: "/refresh", userInfo: "/user-info" },
            },
            getUrl: function (e, t) {
              let n =
                arguments.length > 2 && void 0 !== arguments[2]
                  ? arguments[2]
                  : "v1";
              const r = this[e];
              return r.host + r.prefix + "/" + n + r.path[t];
            },
            getPublicUrl: function (e, t) {
              let n =
                arguments.length > 2 && void 0 !== arguments[2]
                  ? arguments[2]
                  : "v1";
              const r = this[e];
              return r.host + r.prefix + "/" + n + r.publicPath[t];
            },
            getVmWsUrl: function (e) {
              return this[e].host;
            },
          },
          p = u;
      },
      36465: (e, t, n) => {
        "use strict";
        let r;
        n.d(t, { V: () => o });
        const o = (e) => {
          r = e;
        };
      },
      41864: (e, t, n) => {
        "use strict";
        n.a(e, async (e, t) => {
          try {
            var r = n(88567),
              o = e([r]);
            r = (o.then ? (await o)() : o)[0];
            t();
          } catch (i) {
            t(i);
          }
        });
      },
      44174: (e) => {
        "use strict";
        e.exports = JSON.parse(
          '{"common":{"close":"Close","confirm":"Confirm","stop":"Stop","paused":"Paused","regenerate":"Regenerate","copy":"Copy","copySuccess":"Copy succeeded","insert":"Insert","upgrade":"Upgrade","renew":"Renew","prompt":"Prompt","translate":"Translate","summarize":"summarize","explain":"Explain","polish":"Polish","settings":"Settings","logout":"Log out","export":"Export","year":"Year","month":"Month","day":"Day","ok":"OK","found":"Found","lng":"Language","generating":"Generating","batchTask":"Batch Task","changeLng":"\ud83c\udde8\ud83c\uddf3 \u4e2d\u6587","qingyanBrowserExtension":"ChatGLM Browser Extension","insertContentIntoInput":"Insert content into input box","aiGeneratedContentNotice":"Generated by AI for reference.","aiGeneratedContentNotice2":"Generated by AI for reference.","welcomeToQingyan":"Welcome to ChatGLM, please tell me what you need to write...","chatGLMAndAutoGLM":"ChatGLM & AutoGLM, AI assistant for work and study"},"tools":{"unpin":"Unpin","pin":"Pin","textToSpeech":"Text to Speech","pauseSpeech":"Pause Speech","expand":"Expand","collapse":"Collapse","search":"Search","click":"Click","input":"Input","searchAction":"Search","enterKey":"Enter","selectAction":"Select","hover":"Hover","view":"View","cancel":"Cancel","confirm":"Confirm","downloadImage":"Download Image","like":"Like","dislike":"Dislike"},"error":{"errorRetry":"Request error, please try again later","errorRetryLatter":"Request error, please try again later","fetchSettingsError":"Error fetching settings information, please retry","knowledgeYield":"I\'m very sorry, I currently cannot provide the specific information you need. If you have other questions or need to look up other information, I\'m happy to help.","serviceError":"Service error, please try again later","restrictedPageMessage":"This page does not support the browser extension. Restricted pages usually include new tabs, web stores, other extensions, and settings (chrome://URLs). Please try using a regular page.","currentPageNotSupported":"The current page does not support the browser extension","unsupportedPages":"Unsupported pages: extension store, new tab, settings (chrome:// URLs), etc. Please try on other pages!"},"headerArea":{"title":"ChatGLM","mode":{"general":"General","advanced":"Advanced"},"setting":{"historyRecord":"History","instructionForUse":"Help","userFeedback":"Contact us","settings":"Settings"}},"recommendTools":{"AutoGLM":"AutoGLM","title":"Tools","academicDaily":"Academic Daily","generatedDailyReport":"Here is the daily report based on your description","siteSearch":"Advanced Site Search","multiLinkSummary":"Multi-link Summary","advancedSiteSearch":"Advanced Site Search","advancedSiteSearchPoint":"Advanced Site Search"},"pageContent":{"currentPage":"Current page","attemptBriefSummary":"Page Summary - Brief","tryDetailedSummary":"Page Summary - Detailed"},"footerArea":{"tools":{"createNew":"","startNewTask":"New task","pageSummary":"Summary","WebTranslation":"Translation","aiSearch":"Ai search","ai_search":"Ai search"},"input":{"pageDialogue":"Chat with Page","screenshotDialogue":"Screenshot","fileUpload":"File Upload","send":"Enter","placeholder":"Welcome to ChatGLM, ask me anything!","organizeInformation":"Organize Information","recognizeText":"Recognize Text","explain":"Explain","imageSizeLimit":"Image size cannot exceed","maxSupported":"Up to","piece":"pieces","postsToStrategy":"Please form a complete strategy or summary based on the above post content","analyzeLiteratureMarkdown":"Please analyze the following literature content, output in markdown format. First, output the main content of each literature, including title, research question, research method, research results, etc., then output a complete summary of all literatures","summarizeContent":"Please summarize the above content. If there are different views on a topic, indicate the points of contention; if not, summarize normally","summarizeTextBody":"Please summarize the main text content","continueQuestioning":"Continue questioning","selectLinkToExtract":"Select links to extract key points","inputCommandExecuteOperation":"Enter command to perform operation","inputCommandGenerateDailyReport":"Enter command to generate Academic daily report","inputCommandPreciseSearch":"Enter command for precise search and summary","connectAllContent":"Connect web content, search, analyze and summarize"}},"advanced":{"viewAll":"View All","siteNotSupported":"Not supported yet,","recommendation":"Capabilities of Advanced Mode","noCommonSitesVisit":"No common sites you visit? Go to","submitSuggestion":"submit suggestions","checkMoreTutorials":"Want to see more tutorials? Check","usageInstructions":"User Manuals","refreshItems":"Refresh Items","advanced_select":{"name":"Multi-link Summary","text":"Learn how to use this feature","more":"Click here to view >","modalContent":{"small":"Select multiple links to quickly extract key points.","step1":{"title":"Step 1","description":"After clicking <strong>\u201cMulti-link Summary\u201d</strong>, checkboxes appear left of the links."},"step2":{"title":"Step 2","description":"<strong>Click checkbox</strong> to select links."},"step3":{"title":"Step 3","description":"<strong>Click Send</strong> to generate summary."}}},"advanced_autoglm_agent":{"name":"AutoGLM Web","text":"Try the following sites.","more":"AutoGLM","available":{"zhihu":{"name":"Zhihu","content":"Content filtering, summarization of answers/articles/hot lists/messages/private messages, writing of articles/answers/thoughts/questions, personal information editing, draft box operations, etc."},"weibo":{"name":"Weibo","content":"Posting Weibo, liking/forwarding/commenting on Weibo, summarizing information, posting in super topics, following Weibo accounts, signing in to super topics, pinning/deleting personal Weibo, etc."},"baidu":{"name":"Baidu","content":"Website navigation, content summarization."},"google":{"name":"Google","content":"Website navigation, content summarization."},"bing":{"name":"Bing","content":"Website navigation, content summarization."},"douban":{"name":"Douban","content":"Summarizing/extracting content, sharing movies/books, viewing/writing reviews, joining Douban groups, following users, creating Douban lists, participating in Douban local events, viewing personal information."},"baidu_tieba":{"name":"Baidu Tieba","content":"Summarizing/extracting content, collecting posts, viewing/writing comments, following/signing in to Tieba."},"ar_xiv":{"name":"arXiv","content":"Searching for papers (summarizing/extracting content), viewing PDFs of papers, obtaining paper citations."},"baidu_xueshu":{"name":"Baidu Scholar","content":"Searching for papers (summarizing/extracting content), collecting/downloading papers, obtaining paper citations."},"google_xueshu":{"name":"Google Scholar","content":"Searching for papers (summarizing/extracting content), collecting/downloading papers, obtaining paper citations."},"github":{"name":"Github","content":"Searching and finding projects, downloading projects, simple file management, branch creation, tag management, starring."},"wangyi":{"name":"NetEase News","content":"Summarizing/extracting information."},"twitter":{"name":"X (Twitter)","content":"Tweet liking, retweeting, posting, searching, commenting, etc."}}},"advanced_search":{"name":"Advanced Site Search","text":"Try the following sites.","more":"","available":{"xiaohongshu":{"name":"Red","content":"Summarize travel guides, customize learning plans, inquire about life questions."},"zhiwang":{"name":"CNKI","content":"Customized article search, review of papers/journals/patents, extraction of core content, etc."},"weipu":{"name":"VIP","content":"Customized article search, review of papers/journals/patents, extraction of core content, etc."},"baidu_xueshu":{"name":"Baidu Scholar","content":"Customized article search, review of papers/journals/patents, extraction of core content, etc."},"google_xueshu":{"name":"Google Scholar","content":"Customized article search, review of papers/journals/patents, extraction of core content, etc."},"zhihu":{"name":"Zhihu","content":"Learn from experiences, follow technological developments, search for answers to questions."},"baidu":{"name":"Baidu Search","content":"Website navigation, content summary."},"google":{"name":"Google Search","content":"Website navigation, content summary."},"bing":{"name":"Bing Search","content":"Website navigation, content summary."}}},"advanced_daily_report":{"name":"Academic Daily","text":"Try the following sites. ","textSuffix":"","more":"Academic Daily","available":{"ar_xiv":{"name":"ArXiv","content":"Summarize information, generate professional ArXiv daily report"},"pub_med":{"name":"PubMed","content":"Summarize information, generate professional PubMed daily report"},"hugging_face":{"name":"Huggingface","content":"Summarize information, generate professional HuggingFace daily report"}}},"github_search_issues":{"name":"Issue Q&A","text":"Please go to","textSuffix":"specific repository to ask questions"}},"consumption":{"retry":"Retry","completed":"Completed","thinkAgain":"Let me think again","failure":"Failed,","completeInZhiPu":"Please complete in Zhipu ChatGLM","membership":"Membership","experienceMembership":"Success, go experience the membership features now","upgradeToMembership":"Upgrade to Membership","attention":"Attention","noTaskUsageToday":"No more uses of this task today, please ","tryOtherTasks":"try other tasks","upgradeToMembershipPrompt":"upgrade to membership","tryAgainTomorrow":"Or try again tomorrow"},"upgrade_popover":{"membership":"ChatGLM Membership","pluginBenefits":"Plugin Benefits","autoGLM":"AutoGLM","academicDaily":"Academic Daily","moreBenefits":"More Benefits","acceleration":"Qingying Acceleration for faster video generation","hdRedraw":"HD Redraw for clearer AI paintings","videoCall":"Video Call with XiaoZhi for fun","immediately":"Immediately","viewMoreBenefits":"View more benefits information"},"advanced_desc":{"voiceCommand":"Free your hands, execute web tasks with simple commands.","researchUpdate":"Input research direction, get the latest progress reported.","searchFilterSummarize":"Input commands and conditions to help you search, filter, and summarize.","extractKeyPoints":"Select multiple links to quickly extract key points."},"globalInput":{"autoRespond":"When enabled, ChatGLM responds based on the web content on the left..","generateReport":"Generate","parseApprox":"Parse about","disableAISearch":"Disable AI Search","summarizeDocument":"Summarize this document","selected":"Selected","dailyReport":"Daily Report"},"scribingTool":{"reading":"Reading","codeAssistant":"Code Explain","answerTheQuestion":"Answer the Question","managementOperations":"Management Operations","hideUntilNextVisit":"Hide Until Last Time","disableOnThisPage":"Disable on This Page","disableOnAllPages":"Disable on All Pages","restartInSettings":"You can restart in settings","showOnTheLayer":"Show on the Text","showOnSidebar":"Show on Sidebar","youCan":"You can","restart":"restart","translateEnToZh":"English to Chinese","translateZhToEn":"Chinese to English","translateOtherToZh":"Other to Chinese","autoTranslate":"Auto Translate","enterQuestion":"Please enter your question","followUpResultsSidebar":"Results will be shown in the sidebar","continueAsking":"Continue asking..."},"option":{"zhipuQingyan":"Zhipu ChatGLM","zhipuLogo":"Zhipu ChatGLM Logo","floatBall":"Floating Avatar","pluginInstallTip":"You will see the ChatGLM floating avatar in the lower right corner of most web pages. This is an AI web toolbar tailored for you, designed to help you easily complete various web tasks and make your browsing experience smarter and more efficient.","showFloatingIcon":"Show floating avatar on all sites","searchEngineAssistant":"Search  Assistant","aiSearchResultTip":"When using a search engine, ChatGLM will display AI search results next to the search results.","showAssistantInSearch":"Show assistant next to search results","selectionToolbar":"Text selection toolbar","selectionToolbarTip":"The text selection toolbar is designed for quick text operations. You can choose whether to activate it every time you select text.","alwaysEnableSelectionToolbar":"Enable on text selection","writingAssistant":"Writing Assistant","writingAssistantTip":"The writing assistant will appear next to each input box. It can help you easily write comments and posts. It can also help you write replies to emails.","enableAiWritingAssistant":"Enable AI Writing Assistant","codeExplanation":"Explain Code (CodeGeeX)","codeAssistantTip":"The Code Assistant appears in each code block and helps you understand the code content.","enableCodeAssistant":"Enable by default","quickPopup":"Quick Popup","quickPopupTip":"Choose to summon the AI assistant via shortcut. (Usually hidden)","triggerQuickPopup":"Summon Quick Popup","shortcutSettingsTip":"You can modify the settings in the browser\'s \'Settings\' \'Extensions\' \'Keyboard Shortcuts\' option.","filingTitle":"More Information","icpFiling":"ICP Filing / License No.","algorithmFiling":"Algorithm Filing","modelFiling":"Model Filing","contactUs":"Contact Us","feedbackTip":"We welcome your valuable feedback and will keep improving to offer you better service.","giveFeedback":"Go to Feedback","feedbackHistory":"Feedback History","disableWebsite":"Disable Website","disableThisWebsite":"Disable this website","version":"Version","user":{"logoutConfirm":"Are you sure you want to log out?","accountInfo":"My Account","phoneNumber":"Phone Number"},"clickAgainToDeselect":"Click again to deselect"},"AISearch":{"searchInputNotFound":"Search input box not found!","searchContentEmpty":"Search content is empty!","recommendationListEmpty":"Recommendation list is empty!","getRecommendationListError":"Error getting recommendation list:","zhipuAiGlobalSearch":"ChatGLM AI Global Search","continueAskQingyan":"Ask More","continueInChat":"Continue in chat","getAIResult":"Get AI result","requestFailed":"Request failed","requestFailed401":"Please log in first","requestFailed403":"Please log in first","requestFailed500":"Request failed, please try again later","requestFailed503":"Request failed, please try again later","requestFailed504":"Request failed, please try again later"},"qingyanHelp":{"writeWeiboPostAboutTopic":"Help me write a Weibo post about [topic].","writeArticleAboutTopic":"Write an article about [the topic].","writeCommentForOpinion":"Write a brief comment to support/oppose this view.","writeEvaluation":"Help me write an evaluation.","writeReplyForOpinion":"Write a brief reply to support/oppose this view.","writeCleverReplyForOpinion":"Write a funny reply to this point of view, less than 1500 words.","organizeOpinion":"Help me organize this view.","writeReplyEmail":"Help me write a reply email.","writeEmailAboutTopic":"Help me write an email about [topic].","writeDailyReport":"Help me write today\'s daily report, including [work content] and [results].","writeWeeklyReport":"Help me write this week\'s weekly report summary, including [work content] and [results].","writeMonthlyReport":"Help me write this month\'s monthly report summary, including [work content] and [results].","noInputContent":"You have not entered any content!","ChatGLMWriteWeibo":"ChatGLM helps you write Weibo","ChatGLMWriteArticle":"ChatGLM helps you write articles","ChatGLMWriteComment":"ChatGLM helps you write comments","ChatGLMWriteLongComment":"ChatGLM helps you write comments","ChatGLMWriteReply":"ChatGLM helps you write replies","ChatGLMWriteAnswer":"ChatGLM helps you write answers","ChatGLMWriteReplyEmail":"ChatGLM helps you reply to emails","ChatGLMWriteEmail":"ChatGLM helps you write emails","ChatGLMWriteDailyReport":"ChatGLM helps you write daily reports","ChatGLMWriteWeeklyReport":"ChatGLM helps you write weekly reports","ChatGLMWriteMonthlyReport":"ChatGLM helps you write monthly reports","ChatGLMWrite":"ChatGLM helps you write","thisOpinionIsAsFollows":"This view is as follows"},"login":{"redirectToQingyanLogin":"Redirect to ChatGLM Login","loginNow":"Login Now","loginFailedSteps":"Can\'t log in? Please follow these steps and try again","step1":"Step 1","step2":"Step 2","step3":"Step 3","clickExtensionIcon":"Click the extension icon in the upper right corner, find ChatGLM, and click \'More\' next to \'Zhipu ChatGLM\' browser extension","clickReadAndChangeSiteData":"Click \'Can read and change site data\'","selectAllowOnAllSites":"Select \'On all sites\'","page":"Page","notLoggedInCheck":"Check shows you are still not logged in","pleaseLogin":"Please log in","thenContinue":"and then continue","logoutConfirm":"Are you sure you want to log out?","user":"User","loggedIn":"Logged In"},"updateModal":{"updateNow":"Update Now","learnMore":"Learn More","giveUsGoodReview":"\ud83d\udc4d Give us a good review","newFeatures":"New Features","submitFeedback":"Submit Feedback","newVersionUpdated":"New version available. Upgrade now.","forceUpdateContent":"The extension version you installed is too old. Please update to the latest version for a better experience."},"chatWindow":{"pleaseSelectPost":"Please select a post","selectPostLimit":"Only 5 selections are supported","taskInProgressTry":"A task is in progress, please try again later","exitAiSearchMode":"Please exit AI search mode first!","codeExplanation":"Explain Code","postEmpty":"Post is empty","summaryOf":"Summary of the","postCount":"post","exitOperationOf":"Exit operation of the","pleaseStartNewChat":"Please start a new chat!","webpageProcessing":"Webpage processing","contentProcessing":"Content processing","taskUnderstanding":"Understanding the task - Please wait patiently","searchAnalysisInProgress":"Search analysis in progress","taskCompleted":"Task Over","taskInProgress":"Task in progress","advancedFilteringResults":"Click - Advanced filtering results","imageRecognitionReading":"Recognizing images and reading text","resultRefining":"Refining results - Please wait patiently","generatingDailyReport":"Generating daily report - Please wait patiently","identifyingKeywords":"Identifying keywords in the question","searchingIssues":"Searching for issues","identifyingIssueComments":"Identifying comments on the issue","noRelevantInfo":"No relevant information found - Try another keyword","generateShortSummary":"Please help me generate a short summary","summarizeFullText":"Please help me summarize the full text","summarizeDocumentContent":"Help me summarize the document content","taskTerminated":"Task terminated - Please resend the task","taskNotCompliant":"Non-compliant task"},"userTour":{"welcomeToQingyanPlugin":"Welcome to the ChatGLM plugin \ud83c\udf89","advancedMode":"Advanced Mode \ud83d\ude80","quickAccess":"Quick Access","quickAccessDescription":"Summon ChatGLM with the floating avatar and quick popup","quickAccessIntro":"Quick Access Introduction","writingAssistant":"Writing Assistant \ud83d\udd8c\ufe0f","writingAssistantDescription":"No writing inspiration? The writing assistant is here to help","writingScenarioAssistant":"Writing Scenario Assistant","newUserTutorialCompleted":"New User Tutorial Completed \ud83c\udf89","congratsTutorialCompleted":"Congratulations! You\u2019ve finished the tutorial. Start exploring now. For more info","skip":"Skip","generalMode":"General Mode:","have":"","practicalFeatures":"Practical features such as page summary, page translation, page chat, and screenshot questions","andMoreFeatures":"and more features.","powerfulFeatures":"Powerful features such as AutoGLM and Advanced site search","andMorePowerfulFeatures":"and more powerful features. Click the button to enjoy the ultimate efficiency","clickHereToViewUserManual":"click here for the user manual."},"authorized":{"userAgreementAndPrivacy":"User Agreement and Privacy Protection","agreeAndContinue":"Agree and Continue","disagree":"Disagree","readAndAgreeNotice":"To protect your rights, please read and agree to the following agreements.","advancedModeUserAgreement":"Advanced Mode User Agreement"},"messageDisplay":{"currentPage":"Current Page","experienceCapabilities":"You can experience the following capabilities","helloWelcomeChat":"Hello! Welcome to chat with me\uff5e","currentPageAbilities":"On the current webpage, you can experience the following capabilities:","helloWelcomeChatAgain":"Hello! Welcome to chat with me\uff5e","copyResults":"Copy Results","referencePage":"Reference Page","contentWaiting":"Content Waiting","reading":"Reading","recognizeImageAndText":"Recognizing Images and Text","generating":"Generating","resultPolishing":"Polishing Results","dailyReportPolishing":"Polishing Daily Report","understanding":"Understanding","recognizingKeywords":"Recognizing Keywords in the Question","searching":"Searching","relatedIssue":"Related Issue","relatedIssueComments":"Comments on Related Issue","noRelevantInfo":"No relevant information found - Try another keyword","taskCompleted":"Task Over","generatingAgain":"Generating Again","summaryAnswerBasedOn":"Summary Answer: Based on","searchSourcesCount":"search sources","websitesCount":"websites","taskInProgressMessage":"Now, according to your instructions, I am doing the following\ud83d\udc47","taskInProgressReady":"According to your instructions, I have done the following\ud83d\udc47","newChatOpening":"I will open a new chat for you soon","canYouBeMoreDetailed":"Can you be more detailed?","canYouBeMoreConcise":"Can you be more concise?","operationHistory":"Operation History","inProgress":"In Progress"},"floatBall":{"quickPopup":"Quick Popup","webpageTranslation":"Webpage Translation","pageSummary":"Page Summary","webpageSummary":"Webpage Summary","multiLinkSummary":"Multi-link Summary","showQuickPopupWithFeatures":"Show quick popup with features like \'Page Summary\', \'Multi-link Summary\', \'Webpage Translation\', \'English to Chinese\', and an input box","translateEntireWebpage":"Translate the entire webpage","openSidebarSummarizePage":"Open the sidebar to summarize the entire page content","selectLinksSummarizeAll":"Select links to summarize all content","pageChatSupportsPDF":"Page chat now supports PDF Q&A!","closeTranslation":"Close Translation","englishToChinese":"English to Chinese"},"writingEntryModal":{"writeArticle":"Article","comment":"Review","reply":"Reply","writeEmail":"Write Email","replyEmail":"Reply Email","cleverReply":"Funny Reply","shortComment":"Short Comment","writeReview":"Comment","writeWeibo":"Post","dailyReport":"Daily Report","weeklyReport":"Weekly Report","monthlyReport":"Monthly Report","writeAnswer":"Answer"},"detailPopover":{"membershipVersion":"Membership Version","freeVersion":"Free Version","membership":"Membership","willBeOn":" will expire on ","alreadyOn":"expired on ","expire":"","academicDaily":"Academic daily","eachSummaryPapers":"Summarize","papers":"articles each time","upgradeForExclusiveBenefits":"Upgrade for Perks"},"greetings":{"morning":[{"line1":"Good morning","line2":"What are your plans for today\uff5e"},{"line1":"Good morning","line2":"I hope you have a wonderful day"},{"line1":"Work can be very tiring","line2":"But I\'m here with you"},{"line1":"Good morning","line2":"Let\'s start working together"},{"line1":"Good morning","line2":"ChatGLM Assistant is ready"}],"afternoon":[{"line1":"Good afternoon","line2":"Do you need any help\uff5e"},{"line1":"Good afternoon","line2":"Is there something I can do for you\uff5e"},{"line1":"In the afternoon","line2":"What would you like to do\uff5e"}],"evening":[{"line1":"Good evening","line2":"Do you have any needs\uff5e"},{"line1":"Good evening","line2":"Is there anything else I can help you with\uff5e"},{"line1":"As night falls","line2":"I am here with you"},{"line1":"Good night","line2":"Sweet dreams"}],"all":[{"line1":"Do you have any plans or goals","line2":"I can help you achieve them\uff5e"},{"line1":"What are you going to do today?","line2":"Please let me know anytime\uff5e"},{"line1":"If you have any questions","line2":"I\'ll solve them for you"},{"line1":"If you need to rest or chat","line2":"I\'m always on standby"},{"line1":"Reliable ChatGLM","line2":"Always on standby"}]}}'
        );
      },
      44613: (e, t, n) => {
        "use strict";
        n.a(
          e,
          async (e, r) => {
            try {
              n.d(t, { _2: () => S, sr: () => _ });
              var o = n(89379),
                i = n(69192),
                a = n(25517),
                s = n(52127),
                l = n(47041),
                c = n(88567),
                u = n(35388),
                d = e([c]),
                h = d.then ? (await d)() : d;
              c = h[0];
              const f = chrome.runtime.getManifest().version,
                g = "extension",
                m = "popup";
              function v() {
                return a.MA && a.Fc
                  ? a.Fc
                  : ((0, i.A)() + "").replace(/-/g, "");
              }
              async function y() {
                const e = "device_id";
                let t = (await chrome.storage.local.get(e))[e];
                if (t) return t;
                return (t = v()), await chrome.storage.local.set({ [e]: t }), t;
              }
              function b(e) {
                return "browser_extension" + (e ? "-".concat(e) : "");
              }
              function w(e) {
                return "browser_extension" + (e ? "-".concat(e) : "");
              }
              const _ = {
                deid: await y(),
                reid: v(),
                pd: "chatglm",
                version: f,
              };
              async function x(e) {
                var t, n, r, i, a, d;
                let h =
                    arguments.length > 1 && void 0 !== arguments[1]
                      ? arguments[1]
                      : 0,
                  p =
                    e.usid ||
                    (null === (t = chrome.userInfo) || void 0 === t
                      ? void 0
                      : t.id) ||
                    "",
                  v = await (0, c.AY)();
                const y = (0, l.UM)("autoglm_web_channel", v),
                  S = !(
                    null === (n = chrome) ||
                    void 0 === n ||
                    null === (r = n.extension) ||
                    void 0 === r ||
                    !r.getViews
                  );
                if (
                  (p || S || (p = (0, l.UM)("chatglm_user_id", v)), !p && h < 3)
                )
                  return void setTimeout(() => {
                    x(e, ++h);
                  }, 500);
                let k =
                  null === (i = location) || void 0 === i ? void 0 : i.href;
                try {
                  if (0 === k.indexOf("chrome-extension://")) {
                    k = (await (0, s.id)()).url;
                  }
                } catch (L) {}
                const A = {
                    tm: g,
                    usid: p,
                    t: Date.now(),
                    url: k,
                    vs: f,
                    ab: "",
                    md: m,
                    ct: "search_start",
                    fr: b(y),
                    ffr: w(y) || b(y),
                  },
                  C = (0, o.A)((0, o.A)((0, o.A)({}, A), _), e);
                null === C || void 0 === C || C.bt,
                  JSON.stringify({
                    md: null === C || void 0 === C ? void 0 : C.md,
                    ct: null === C || void 0 === C ? void 0 : C.ct,
                    bt: null === C || void 0 === C ? void 0 : C.bt,
                  }),
                  u.HL;
                const E = new URLSearchParams(C).toString();
                let T =
                  "chrome-extension:" ===
                  (null === (a = location) || void 0 === a
                    ? void 0
                    : a.protocol)
                    ? "https:"
                    : null === (d = location) || void 0 === d
                    ? void 0
                    : d.protocol;
                const I = ""
                  .concat(T, "//analysis.chatglm.cn/bdms/p.gif?")
                  .concat(E);
                if ("undefined" !== typeof Image) {
                  new Image().src = I;
                } else await (0, c.y3)(I);
              }
              async function S() {
                let e =
                  arguments.length > 0 && void 0 !== arguments[0]
                    ? arguments[0]
                    : {};
                try {
                  (e.bt = "cl"), await x(e);
                } catch (t) {}
              }
              r();
            } catch (p) {
              r(p);
            }
          },
          1
        );
      },
      47041: (e, t, n) => {
        "use strict";
        n.d(t, {
          Fh: () => o,
          Kh: () => s,
          UM: () => a,
          Vu: () => d,
          cO: () => l,
          cX: () => i,
          er: () => c,
          ft: () => u,
        });
        var r = n(89379);
        n(70481);
        const o = function (e) {
            let t =
                arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
              n = null;
            try {
              n = JSON.parse(e);
            } catch (r) {
              return !1;
            }
            return !t || n;
          },
          i = /macintosh|mac os x/i.test(navigator.userAgent),
          a = function (e) {
            var t;
            return (
              (null ===
                (t = (
                  arguments.length > 1 && void 0 !== arguments[1]
                    ? arguments[1]
                    : document.cookie
                ).match("(^|;)\\s*" + e + "\\s*=\\s*([^;]+)")) || void 0 === t
                ? void 0
                : t.pop()) || ""
            );
          },
          s = function () {
            let e =
              arguments.length > 0 && void 0 !== arguments[0]
                ? arguments[0]
                : document.cookie;
            return Object.fromEntries(
              e.split(/; */).map(function (e) {
                var t = e.indexOf("="),
                  n = e.slice(0, t),
                  r = e.slice(t + 1);
                return [decodeURIComponent(n), decodeURIComponent(r)];
              })
            );
          };
        const l = (e) => {
          const t = navigator.userAgent;
          return "undefined" !== typeof browser &&
            "undefined" !== typeof browser.runtime
            ? "firefox"
            : t.indexOf("Edg") > -1
            ? "edge"
            : t.indexOf("Chrome") > -1
            ? "chrome"
            : t.indexOf("Safari") > -1
            ? "safari"
            : e || !1;
        };
        function c(e) {
          if (!e) return {};
          e.includes("\n") || (e = "\n" + e);
          const t = e.split("\n"),
            n = t[0];
          const o = (function (e) {
            const t = e.match(/(\w+)\s*\(\s*([^)]*)\s*\)/);
            if (!t) throw new Error("Invalid function string");
            const n = t[1],
              r = t[2]
                .trim()
                .split(",")
                .map((e) => e.trim()),
              o = {};
            for (let i of r) {
              const [e, t] = i.split("=").map((e) => e.trim());
              if (!e) continue;
              const n =
                null !== t &&
                void 0 !== t &&
                t.startsWith('"') &&
                t.endsWith('"')
                  ? t.slice(1, -1)
                  : isNaN(t)
                  ? t
                  : Number(t);
              o[e] = n;
            }
            return { action: n, arguments: o };
          })(t[1]);
          return (0, r.A)({ message: n }, o);
        }
        const u = () =>
            "undefined" !== typeof chrome &&
            chrome.runtime &&
            "undefined" !== typeof chrome.runtime.onInstalled &&
            "undefined" === typeof window,
          d = function (e) {
            let t =
              arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
            if (e instanceof Response) {
              if (200 !== e.status || !e.ok || !e) return !1;
            } else if (e.__body && e.__body.code) return !1;
            return t && delete e.__body, !0;
          };
      },
      48622: (e, t, n) => {
        "use strict";
        n.d(t, { U: () => o });
        var r = n(35291);
        const o = (e, t, n) => {
            s(n);
            const o = (0, r.Z)(e, t);
            return i[n].includes(o);
          },
          i = {
            ">": [1],
            ">=": [0, 1],
            "=": [0],
            "<=": [-1, 0],
            "<": [-1],
            "!=": [-1, 1],
          },
          a = Object.keys(i),
          s = (e) => {
            if ("string" !== typeof e)
              throw new TypeError(
                "Invalid operator type, expected string but got ".concat(
                  typeof e
                )
              );
            if (-1 === a.indexOf(e))
              throw new Error(
                "Invalid operator, expected one of ".concat(a.join("|"))
              );
          };
      },
      49600: (e, t, n) => {
        "use strict";
        n.d(t, { x: () => a });
        var r = n(48622),
          o = n(28639);
        const i = chrome.runtime.getManifest().version,
          a = (e) => {
            var t;
            const n =
              null === e ||
              void 0 === e ||
              null === (t = e.version_info) ||
              void 0 === t
                ? void 0
                : t.force_update;
            return !(!(0, o.t)(n) || !(0, r.U)(n, i, ">"));
          };
      },
      50477: () => {},
      51477: (e, t, n) => {
        "use strict";
        e.exports = n(63396);
      },
      52127: (e, t, n) => {
        "use strict";
        n.d(t, { id: () => l, o: () => d });
        var r = n(48622),
          o = n(35291),
          i = n(28639),
          a = n(47041);
        const s = chrome.runtime.getManifest().version,
          l = (e) =>
            new Promise((t, n) => {
              e
                ? chrome.tabs.get(e, (e) => {
                    if (chrome.runtime.lastError)
                      return n(chrome.runtime.lastError);
                    if (!e) return n(new Error("Can't find this tab"));
                    const r = e,
                      o = r.url;
                    if (!o || o.startsWith("devtools://"))
                      return n(new Error("Cannot access devtools URL"));
                    t(r);
                  })
                : chrome.tabs.query({ active: !0, currentWindow: !0 }, (e) => {
                    if (chrome.runtime.lastError)
                      return n(chrome.runtime.lastError);
                    if (!e || 0 === e.length)
                      return n(new Error("No active tabs found"));
                    const r = e[0],
                      o = r.url;
                    if (!o || o.startsWith("devtools://"))
                      return n(new Error("Cannot access devtools URL"));
                    t(r);
                  });
            }),
          c = "update_opened",
          u = (e) => {
            chrome.storage.local.set({ [c]: e });
          },
          d = async (e) => {
            var t;
            let {
                globalConfig: n,
                userInfo: l,
                needRecord: d = !1,
                callback: h = () => {},
              } = e,
              p = null === n || void 0 === n ? void 0 : n.version_info;
            if (!p) return !1;
            p = p[(0, a.cO)("chrome")] || p.chrome;
            const f = (0, o.Z)(p.version, s);
            if ((h({ versionInfo: p, compareVsResult: f }), f < 0)) return !1;
            if (
              null === l ||
              void 0 === l ||
              null === (t = l.config) ||
              void 0 === t ||
              !t.is_authorized
            )
              return d && u(p.version), !1;
            const g = (await chrome.storage.local.get(c))[c];
            return (
              !((0, i.t)(g) && !(0, r.U)(p.version, g, ">")) &&
              (d && u(p.version), !0)
            );
          };
      },
      61294: (e) => {
        e.exports = {
          area: !0,
          base: !0,
          br: !0,
          col: !0,
          embed: !0,
          hr: !0,
          img: !0,
          input: !0,
          link: !0,
          meta: !0,
          param: !0,
          source: !0,
          track: !0,
          wbr: !0,
        };
      },
      63396: (e, t) => {
        "use strict";
        var n = Symbol.for("react.element"),
          r = Symbol.for("react.portal"),
          o = Symbol.for("react.fragment"),
          i = Symbol.for("react.strict_mode"),
          a = Symbol.for("react.profiler"),
          s = Symbol.for("react.provider"),
          l = Symbol.for("react.context"),
          c = Symbol.for("react.forward_ref"),
          u = Symbol.for("react.suspense"),
          d = Symbol.for("react.memo"),
          h = Symbol.for("react.lazy"),
          p = Symbol.iterator;
        var f = {
            isMounted: function () {
              return !1;
            },
            enqueueForceUpdate: function () {},
            enqueueReplaceState: function () {},
            enqueueSetState: function () {},
          },
          g = Object.assign,
          m = {};
        function v(e, t, n) {
          (this.props = e),
            (this.context = t),
            (this.refs = m),
            (this.updater = n || f);
        }
        function y() {}
        function b(e, t, n) {
          (this.props = e),
            (this.context = t),
            (this.refs = m),
            (this.updater = n || f);
        }
        (v.prototype.isReactComponent = {}),
          (v.prototype.setState = function (e, t) {
            if ("object" !== typeof e && "function" !== typeof e && null != e)
              throw Error(
                "setState(...): takes an object of state variables to update or a function which returns an object of state variables."
              );
            this.updater.enqueueSetState(this, e, t, "setState");
          }),
          (v.prototype.forceUpdate = function (e) {
            this.updater.enqueueForceUpdate(this, e, "forceUpdate");
          }),
          (y.prototype = v.prototype);
        var w = (b.prototype = new y());
        (w.constructor = b), g(w, v.prototype), (w.isPureReactComponent = !0);
        var _ = Array.isArray,
          x = Object.prototype.hasOwnProperty,
          S = { current: null },
          k = { key: !0, ref: !0, __self: !0, __source: !0 };
        function A(e, t, r) {
          var o,
            i = {},
            a = null,
            s = null;
          if (null != t)
            for (o in (void 0 !== t.ref && (s = t.ref),
            void 0 !== t.key && (a = "" + t.key),
            t))
              x.call(t, o) && !k.hasOwnProperty(o) && (i[o] = t[o]);
          var l = arguments.length - 2;
          if (1 === l) i.children = r;
          else if (1 < l) {
            for (var c = Array(l), u = 0; u < l; u++) c[u] = arguments[u + 2];
            i.children = c;
          }
          if (e && e.defaultProps)
            for (o in (l = e.defaultProps)) void 0 === i[o] && (i[o] = l[o]);
          return {
            $$typeof: n,
            type: e,
            key: a,
            ref: s,
            props: i,
            _owner: S.current,
          };
        }
        function C(e) {
          return "object" === typeof e && null !== e && e.$$typeof === n;
        }
        var E = /\/+/g;
        function T(e, t) {
          return "object" === typeof e && null !== e && null != e.key
            ? (function (e) {
                var t = { "=": "=0", ":": "=2" };
                return (
                  "$" +
                  e.replace(/[=:]/g, function (e) {
                    return t[e];
                  })
                );
              })("" + e.key)
            : t.toString(36);
        }
        function I(e, t, o, i, a) {
          var s = typeof e;
          ("undefined" !== s && "boolean" !== s) || (e = null);
          var l = !1;
          if (null === e) l = !0;
          else
            switch (s) {
              case "string":
              case "number":
                l = !0;
                break;
              case "object":
                switch (e.$$typeof) {
                  case n:
                  case r:
                    l = !0;
                }
            }
          if (l)
            return (
              (a = a((l = e))),
              (e = "" === i ? "." + T(l, 0) : i),
              _(a)
                ? ((o = ""),
                  null != e && (o = e.replace(E, "$&/") + "/"),
                  I(a, t, o, "", function (e) {
                    return e;
                  }))
                : null != a &&
                  (C(a) &&
                    (a = (function (e, t) {
                      return {
                        $$typeof: n,
                        type: e.type,
                        key: t,
                        ref: e.ref,
                        props: e.props,
                        _owner: e._owner,
                      };
                    })(
                      a,
                      o +
                        (!a.key || (l && l.key === a.key)
                          ? ""
                          : ("" + a.key).replace(E, "$&/") + "/") +
                        e
                    )),
                  t.push(a)),
              1
            );
          if (((l = 0), (i = "" === i ? "." : i + ":"), _(e)))
            for (var c = 0; c < e.length; c++) {
              var u = i + T((s = e[c]), c);
              l += I(s, t, o, u, a);
            }
          else if (
            ((u = (function (e) {
              return null === e || "object" !== typeof e
                ? null
                : "function" === typeof (e = (p && e[p]) || e["@@iterator"])
                ? e
                : null;
            })(e)),
            "function" === typeof u)
          )
            for (e = u.call(e), c = 0; !(s = e.next()).done; )
              l += I((s = s.value), t, o, (u = i + T(s, c++)), a);
          else if ("object" === s)
            throw (
              ((t = String(e)),
              Error(
                "Objects are not valid as a React child (found: " +
                  ("[object Object]" === t
                    ? "object with keys {" + Object.keys(e).join(", ") + "}"
                    : t) +
                  "). If you meant to render a collection of children, use an array instead."
              ))
            );
          return l;
        }
        function L(e, t, n) {
          if (null == e) return e;
          var r = [],
            o = 0;
          return (
            I(e, r, "", "", function (e) {
              return t.call(n, e, o++);
            }),
            r
          );
        }
        function O(e) {
          if (-1 === e._status) {
            var t = e._result;
            (t = t()).then(
              function (t) {
                (0 !== e._status && -1 !== e._status) ||
                  ((e._status = 1), (e._result = t));
              },
              function (t) {
                (0 !== e._status && -1 !== e._status) ||
                  ((e._status = 2), (e._result = t));
              }
            ),
              -1 === e._status && ((e._status = 0), (e._result = t));
          }
          if (1 === e._status) return e._result.default;
          throw e._result;
        }
        var M = { current: null },
          R = { transition: null },
          P = {
            ReactCurrentDispatcher: M,
            ReactCurrentBatchConfig: R,
            ReactCurrentOwner: S,
          };
        function N() {
          throw Error(
            "act(...) is not supported in production builds of React."
          );
        }
        (t.Children = {
          map: L,
          forEach: function (e, t, n) {
            L(
              e,
              function () {
                t.apply(this, arguments);
              },
              n
            );
          },
          count: function (e) {
            var t = 0;
            return (
              L(e, function () {
                t++;
              }),
              t
            );
          },
          toArray: function (e) {
            return (
              L(e, function (e) {
                return e;
              }) || []
            );
          },
          only: function (e) {
            if (!C(e))
              throw Error(
                "React.Children.only expected to receive a single React element child."
              );
            return e;
          },
        }),
          (t.Component = v),
          (t.Fragment = o),
          (t.Profiler = a),
          (t.PureComponent = b),
          (t.StrictMode = i),
          (t.Suspense = u),
          (t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = P),
          (t.act = N),
          (t.cloneElement = function (e, t, r) {
            if (null === e || void 0 === e)
              throw Error(
                "React.cloneElement(...): The argument must be a React element, but you passed " +
                  e +
                  "."
              );
            var o = g({}, e.props),
              i = e.key,
              a = e.ref,
              s = e._owner;
            if (null != t) {
              if (
                (void 0 !== t.ref && ((a = t.ref), (s = S.current)),
                void 0 !== t.key && (i = "" + t.key),
                e.type && e.type.defaultProps)
              )
                var l = e.type.defaultProps;
              for (c in t)
                x.call(t, c) &&
                  !k.hasOwnProperty(c) &&
                  (o[c] = void 0 === t[c] && void 0 !== l ? l[c] : t[c]);
            }
            var c = arguments.length - 2;
            if (1 === c) o.children = r;
            else if (1 < c) {
              l = Array(c);
              for (var u = 0; u < c; u++) l[u] = arguments[u + 2];
              o.children = l;
            }
            return {
              $$typeof: n,
              type: e.type,
              key: i,
              ref: a,
              props: o,
              _owner: s,
            };
          }),
          (t.createContext = function (e) {
            return (
              ((e = {
                $$typeof: l,
                _currentValue: e,
                _currentValue2: e,
                _threadCount: 0,
                Provider: null,
                Consumer: null,
                _defaultValue: null,
                _globalName: null,
              }).Provider = { $$typeof: s, _context: e }),
              (e.Consumer = e)
            );
          }),
          (t.createElement = A),
          (t.createFactory = function (e) {
            var t = A.bind(null, e);
            return (t.type = e), t;
          }),
          (t.createRef = function () {
            return { current: null };
          }),
          (t.forwardRef = function (e) {
            return { $$typeof: c, render: e };
          }),
          (t.isValidElement = C),
          (t.lazy = function (e) {
            return {
              $$typeof: h,
              _payload: { _status: -1, _result: e },
              _init: O,
            };
          }),
          (t.memo = function (e, t) {
            return { $$typeof: d, type: e, compare: void 0 === t ? null : t };
          }),
          (t.startTransition = function (e) {
            var t = R.transition;
            R.transition = {};
            try {
              e();
            } finally {
              R.transition = t;
            }
          }),
          (t.unstable_act = N),
          (t.useCallback = function (e, t) {
            return M.current.useCallback(e, t);
          }),
          (t.useContext = function (e) {
            return M.current.useContext(e);
          }),
          (t.useDebugValue = function () {}),
          (t.useDeferredValue = function (e) {
            return M.current.useDeferredValue(e);
          }),
          (t.useEffect = function (e, t) {
            return M.current.useEffect(e, t);
          }),
          (t.useId = function () {
            return M.current.useId();
          }),
          (t.useImperativeHandle = function (e, t, n) {
            return M.current.useImperativeHandle(e, t, n);
          }),
          (t.useInsertionEffect = function (e, t) {
            return M.current.useInsertionEffect(e, t);
          }),
          (t.useLayoutEffect = function (e, t) {
            return M.current.useLayoutEffect(e, t);
          }),
          (t.useMemo = function (e, t) {
            return M.current.useMemo(e, t);
          }),
          (t.useReducer = function (e, t, n) {
            return M.current.useReducer(e, t, n);
          }),
          (t.useRef = function (e) {
            return M.current.useRef(e);
          }),
          (t.useState = function (e) {
            return M.current.useState(e);
          }),
          (t.useSyncExternalStore = function (e, t, n) {
            return M.current.useSyncExternalStore(e, t, n);
          }),
          (t.useTransition = function () {
            return M.current.useTransition();
          }),
          (t.version = "18.3.1");
      },
      63919: (e, t, n) => {
        "use strict";
        n.a(e, async (e, r) => {
          try {
            n.d(t, { F: () => z });
            var o,
              i,
              a = n(89379),
              s = n(35388),
              l = n(47041),
              c = n(88567),
              u = n(68667),
              d = n(8852),
              h = n(52127),
              p = (n(76358), n(87882)),
              f = n(97866),
              g = n(12209),
              m = n(49600),
              v = n(17876),
              y = n.n(v),
              b = n(71118),
              w = n(25309),
              _ = e([c, u, p, g, b, w]),
              x = _.then ? (await _)() : _;
            (c = x[0]),
              (u = x[1]),
              (p = x[2]),
              (g = x[3]),
              (b = x[4]),
              (w = x[5]);
            const k = !1;
            let A = {};
            const C = "com.sample.native_host_golang";
            let E,
              T = !1,
              I = null;
            const L = new Set();
            if (k) {
              I = (() => ({
                postMessage: async (e) => {
                  try {
                    var t;
                    if (L.has(JSON.stringify(e))) return;
                    L.add(JSON.stringify(e));
                    const n = {
                      uid: await (0, c.gf)(
                        s.Ay.userIdStorageKey,
                        s.Ay.userIdCookieKey
                      ),
                      user_type: "cloud",
                      task_type: "result",
                      text: e,
                    };
                    null === (t = E) ||
                      void 0 === t ||
                      t.send(JSON.stringify(n));
                  } catch (n) {}
                },
                onMessage: { addListener: () => {} },
                onDisconnect: { addListener: () => {} },
              }))();
            } else I = chrome.runtime.connectNative(C);
            let O = null;
            const M = "alarmEveryday";
            chrome.alarms.create(M, {
              delayInMinutes: 0.1,
              periodInMinutes: 1440,
            });
            const R = async (e) => {
              if (e.name === M) {
                const e = await (0, u.u)(),
                  t = await (0, u.Y)({ timeout: -1 });
                (await (0, h.o)({ globalConfig: t, userInfo: e })) &&
                  (chrome.action.setBadgeText({ text: "NEW" }),
                  chrome.action.setBadgeTextColor({ color: "#FFF" }),
                  chrome.action.setBadgeBackgroundColor({ color: "#F64835" }));
              }
            };
            chrome.alarms.onAlarm.hasListener(R) ||
              chrome.alarms.onAlarm.addListener(R);
            const P = {};
            chrome.action.onClicked.addListener(async (e) => {
              const t = e.id;
              var n, r;
              null === (n = chrome.sidePanel) ||
                void 0 === n ||
                n.setOptions({ tabId: t, path: "index.html", enabled: !0 }),
                null === (r = chrome.sidePanel) ||
                  void 0 === r ||
                  r.open({ tabId: t }, () => {
                    P[t] = !0;
                  });
            });
            let N = null,
              D = null;
            chrome.runtime.onMessage.addListener((e, t, n) => {
              if ("openSidePanel" === e.action) {
                if (((t.tab = e.tab || t.tab), !t.tab))
                  return void n({
                    status: "failure",
                    message: "No active tabs found",
                  });
                const i = t.tab,
                  a = i.id,
                  s = i.url,
                  l =
                    s &&
                    (s.startsWith("chrome://") ||
                      s.startsWith("chrome-extension://") ||
                      s.startsWith("edge://") ||
                      s.startsWith("about:") ||
                      [
                        "https://chrome.google.com/webstore",
                        "https://microsoftedge.microsoft.com/addons",
                        "https://addons.mozilla.org/en-US/firefox",
                        "https://chromewebstore.google.com/",
                      ].some((e) => s.startsWith(e)));
                var r, o;
                if (
                  s &&
                  s.match(
                    /^(https?:\/\/)?(?!chrome(?:webstore)?\.google\.com)(?!chrome\.)((?:[\w.-]+)|(?:\d{1,3}\.){3}\d{1,3})(:\d+)?(\/\S*)?(#\S*)?$/
                  ) &&
                  !l
                )
                  null === (r = chrome.sidePanel) ||
                    void 0 === r ||
                    r.setOptions(
                      { tabId: a, path: "index.html", enabled: !0 },
                      () => {
                        var t;
                        null === (t = chrome.sidePanel) ||
                          void 0 === t ||
                          t.open({ tabId: a }, () => {
                            (P[a] = !0),
                              e.openLogin &&
                                chrome.runtime.sendMessage(
                                  { action: "openLogin" },
                                  (e) => {}
                                ),
                              e.subsequentMessage &&
                                chrome.storage.session.set({
                                  init: e.subsequentMessage,
                                }),
                              n({
                                status: "success",
                                message: "Side panel opened successfully",
                              });
                          });
                      }
                    );
                else
                  null === (o = chrome.sidePanel) ||
                    void 0 === o ||
                    o.setOptions({ tabId: a, enabled: !1 }),
                    n({
                      status: "success",
                      message: "Side panel not enabled for this URL",
                    });
                return !0;
              }
              if ("setMessages" === e.action)
                return (
                  Promise.all([
                    chrome.storage.session.set({
                      prevMessages: e.prevMessages,
                    }),
                    chrome.storage.session.set({
                      followUpRequest: e.followUpRequest,
                    }),
                    chrome.storage.session.set({ sessionId: e.sessionId }),
                    chrome.storage.session.set({
                      followUpRequestParam: e.followUpRequestParam,
                    }),
                  ])
                    .then(() => {
                      n({
                        status: "success",
                        message: "Messages set successfully",
                      }),
                        chrome.runtime.sendMessage({
                          action: "updateMessages",
                        });
                    })
                    .catch((e) => {
                      n({ status: "failure", message: e.message });
                    }),
                  !0
                );
              if ("toggleSidePanel" === e.action) {
                try {
                  const r = chrome.sidePanel;
                  null === r ||
                    void 0 === r ||
                    r.getOptions({ tabId: t.tab.id }, async (o) => {
                      (null === o || void 0 === o ? void 0 : o.enabled)
                        ? (null === r ||
                            void 0 === r ||
                            r.setOptions({ tabId: t.tab.id, enabled: !1 }),
                          n({ status: "closed" }),
                          e.isEdge &&
                            chrome.storage.session.set({
                              [t.tab.id]: "closed",
                            }))
                        : (null === r ||
                            void 0 === r ||
                            r.setOptions({
                              tabId: t.tab.id,
                              path: "index.html",
                              enabled: !0,
                            }),
                          null === r ||
                            void 0 === r ||
                            r.open({ tabId: t.tab.id }),
                          n({ status: "opened" }),
                          e.isEdge &&
                            chrome.storage.session.set({
                              [t.tab.id]: "opened",
                            }));
                    });
                } catch (x) {
                  var i, h;
                  null === (i = sidePanel) ||
                    void 0 === i ||
                    i.setOptions({
                      tabId: t.tab.id,
                      path: "index.html",
                      enabled: !0,
                    }),
                    null === (h = sidePanel) ||
                      void 0 === h ||
                      h.open({ tabId: t.tab.id }),
                    n({ status: "opened" });
                }
                return !0;
              }
              if ("getTabId" === e.action) {
                const e = t.tab.id;
                n({ tabId: e });
              } else {
                if ("getGlmCookies" === e.action)
                  return (
                    chrome.cookies.getAll(
                      { domain: s.Ay.cookieDomain },
                      function (e) {
                        n((0, c.wf)(e));
                      }
                    ),
                    !0
                  );
                if ("getToken" === e.action) {
                  const { tokenKey: t } = e;
                  return (
                    (async () => {
                      let e = await (0, c.LQ)(t);
                      n(e);
                    })(),
                    !0
                  );
                }
                if ("storageLocal" === e.action) {
                  const { fn: t, args: r } = e;
                  return (
                    (async () => {
                      let e = await chrome.storage.local[t](...r);
                      n(e);
                    })(),
                    !0
                  );
                }
                if ("setTokens" === e.action)
                  return (
                    (async () => {
                      let t = await (0, c.cg)(e.cookieStr);
                      n(t);
                    })(),
                    !0
                  );
                if ("logout" === e.action)
                  return (
                    (async () => {
                      let e = await (0, w.Sg)();
                      n(e);
                    })(),
                    !0
                  );
                if ("playVoice" === e.action)
                  return (
                    e.playStatus || chrome.tts.stop(),
                    e.content &&
                      e.playStatus &&
                      chrome.tts.speak(e.content, {
                        rate: 1,
                        pitch: 1,
                        volume: 1,
                        onEvent: (e) => {
                          "end" === e.type &&
                            n({ status: "success", message: "TTS end" });
                        },
                      }),
                    !0
                  );
                if ("getUserInfo" === e.action)
                  return (
                    (0, u.u)().then((e) => {
                      n({
                        data: e,
                        status: "success",
                        message: "Get user info successfully",
                      });
                    }),
                    !0
                  );
                if ("refreshUserInfo" === e.action)
                  return (
                    (0, u.u)(!0).then((e) => {
                      n({
                        data: e,
                        status: "success",
                        message: "Get user info successfully",
                      });
                    }),
                    !0
                  );
                if ("openOptionsPage" === e.action) {
                  const t = e.hash ? "#" + e.hash : "";
                  chrome.tabs.create({
                    url: chrome.runtime.getURL("options.html") + t,
                  });
                } else if ("notifyHideInAllTabs" === e.action)
                  chrome.tabs.query({}, function (t) {
                    t.forEach(function (t) {
                      chrome.tabs.sendMessage(t.id, {
                        target: e.target,
                        hide: e.hide,
                        action: "hideInAllTabs",
                      });
                    });
                  });
                else {
                  if ("getCommandsDynamically" === e.action)
                    return (
                      chrome.commands.getAll((e) => {
                        let t = {};
                        e.forEach((e) => {
                          t[e.name] = {
                            suggested_key: { default: e.shortcut },
                            description: e.description,
                          };
                        }),
                          n({
                            data: (0, d.E)(t),
                            status: "success",
                            message: "Get commands dynamically successfully",
                          });
                      }),
                      !0
                    );
                  if ("aiSearch" === e.action)
                    return (
                      q({
                        tabId: t.tab.id,
                        action: e.action,
                        instruction: e.instruction,
                      }),
                      !0
                    );
                  if ("setBadge" === e.action)
                    chrome.action.setBadgeText({ text: e.text }),
                      e.textColor &&
                        chrome.action.setBadgeTextColor({ color: e.textColor }),
                      e.color &&
                        chrome.action.setBadgeBackgroundColor({
                          color: e.color,
                        });
                  else if ("clearBadgeNew" === e.action)
                    chrome.action.getBadgeText({ tabId: null }, (e) => {
                      "NEW" === e && chrome.action.setBadgeText({ text: "" });
                    });
                  else if ("shouldOpenForceUpdateModal" === e.action)
                    (0, u.Y)().then((e) => {
                      n((0, m.x)(e));
                    });
                  else {
                    if ("toggleWorkflow" === e.action)
                      return (
                        chrome.storage.local.get(
                          ["taskWindowId", "taskTabId", "functionCall"],
                          async (r) => {
                            if (
                              (null === r || void 0 === r
                                ? void 0
                                : r.taskWindowId) === t.tab.windowId &&
                              (null === r || void 0 === r
                                ? void 0
                                : r.taskTabId) === t.tab.id
                            ) {
                              const {
                                instruction: n,
                                return_type: h,
                                isRunning: g,
                                oriTabId: m,
                              } = null === r || void 0 === r
                                ? void 0
                                : r.functionCall;
                              if (e.skip) {
                                var o;
                                let t = (0, a.A)(
                                  {
                                    id:
                                      null === r ||
                                      void 0 === r ||
                                      null === (o = r.functionCall) ||
                                      void 0 === o
                                        ? void 0
                                        : o.id,
                                  },
                                  e.skip
                                );
                                if (
                                  ((t.logic_id = t.id),
                                  null !== r &&
                                    void 0 !== r &&
                                    r.functionCall.return_type)
                                ) {
                                  var i, s, c, u, d;
                                  if (
                                    null === (i = e.skip) ||
                                    void 0 === i ||
                                    !i.ignoreDrFormat
                                  ) {
                                    t = (await (0, p.WD)(t)) || t;
                                  }
                                  if (
                                    null !== (s = e.skip) &&
                                    void 0 !== s &&
                                    s.message_type
                                  )
                                    t = {
                                      content: t,
                                      type:
                                        null === r ||
                                        void 0 === r ||
                                        null === (c = r.functionCall) ||
                                        void 0 === c
                                          ? void 0
                                          : c.type,
                                      message_type:
                                        null === (u = e.skip) || void 0 === u
                                          ? void 0
                                          : u.message_type,
                                      message:
                                        null === (d = e.skip) || void 0 === d
                                          ? void 0
                                          : d.message,
                                    };
                                }
                                return void (m
                                  ? chrome.tabs.sendMessage(m, {
                                      action: "replyExternalApp",
                                      data: t,
                                    })
                                  : I.postMessage(t));
                              }
                              if (
                                (await chrome.scripting.executeScript({
                                  target: { tabId: r.taskTabId },
                                  func: f.R,
                                }),
                                null === r || void 0 === r || !r.functionCall)
                              )
                                return;
                              if (!g || e.goOn) {
                                const e = (0, a.A)(
                                  (0, a.A)(
                                    {},
                                    null === r || void 0 === r
                                      ? void 0
                                      : r.functionCall
                                  ),
                                  {},
                                  { isRunning: !0 }
                                );
                                await chrome.storage.local.set({
                                  functionCall: e,
                                });
                                let o = null,
                                  i = null;
                                const s = (e) =>
                                    new Promise((t) => {
                                      setTimeout(t, e);
                                    }),
                                  c = async () => {
                                    let e = 1,
                                      c = !1;
                                    for (; e <= 30 && !c; ) {
                                      try {
                                        const e = t.tab.id,
                                          s = await (0, p.w1)(n, 3, e);
                                        if (!s || "success" !== s.status) {
                                          var u;
                                          chrome.storage.local.get(
                                            ["advancedMessages"],
                                            async (e) => {
                                              let t = e.advancedMessages || [];
                                              t.length > 0 &&
                                                ((t[t.length - 1].stop = !0),
                                                (t[t.length - 1].error = !0)),
                                                await chrome.storage.local.set({
                                                  advancedMessages: t,
                                                });
                                            }
                                          );
                                          let e = {
                                            id:
                                              null === (u = r.functionCall) ||
                                              void 0 === u
                                                ? void 0
                                                : u.id,
                                            feedback_content:
                                              "\u4efb\u52a1\u6267\u884c\u51fa\u9519\uff0c\u5df2\u7ec8\u6b62",
                                            task_status: "agent_error",
                                          };
                                          if (h) {
                                            const t = await (0, p.WD)(e);
                                            t && (e = t);
                                          }
                                          m
                                            ? chrome.tabs.sendMessage(m, {
                                                action: "replyExternalApp",
                                                data: e,
                                              })
                                            : I.postMessage(e),
                                            await chrome.storage.local.remove([
                                              "functionCall",
                                            ]);
                                          break;
                                        }
                                        {
                                          var d;
                                          let t = s.data;
                                          h && (t.config = { return_type: h });
                                          const n = await (0, p.Ms)(t, o, i);
                                          if (!n) {
                                            var f;
                                            let e = {
                                              id:
                                                null === (f = r.functionCall) ||
                                                void 0 === f
                                                  ? void 0
                                                  : f.id,
                                              feedback_content:
                                                "\u4efb\u52a1\u6267\u884c\u51fa\u9519\uff0c\u5df2\u7ec8\u6b62",
                                              task_status: "agent_error",
                                            };
                                            if (h) {
                                              const t = await (0, p.WD)(e);
                                              t && (e = t);
                                            }
                                            return (
                                              m
                                                ? chrome.tabs.sendMessage(m, {
                                                    action: "replyExternalApp",
                                                    data: e,
                                                  })
                                                : I.postMessage(e),
                                              void (await chrome.storage.local.remove(
                                                ["functionCall"]
                                              ))
                                            );
                                          }
                                          (o = n.session_id), (i = n.agent_id);
                                          let u =
                                            n.session_id +
                                            "@" +
                                            n.agent_id +
                                            "agent";
                                          if (
                                            n.response &&
                                            n.response.includes("exit(")
                                          ) {
                                            var g;
                                            let e =
                                                n.response.match(
                                                  /message="([^"]*)"/
                                                ),
                                              t = e ? e[1] : null,
                                              o = (0, a.A)(
                                                (0, a.A)(
                                                  {
                                                    operation: "do",
                                                    action: "exit",
                                                    round: n.round,
                                                    kwargs: { observation: t },
                                                    url: s.data.url,
                                                    title: s.data.title,
                                                    id:
                                                      null ===
                                                        (g = r.functionCall) ||
                                                      void 0 === g
                                                        ? void 0
                                                        : g.id,
                                                  },
                                                  (null === n || void 0 === n
                                                    ? void 0
                                                    : n.agent_id) && {
                                                    agent_id: n.agent_id,
                                                  }
                                                ),
                                                (null === n || void 0 === n
                                                  ? void 0
                                                  : n.observation) && {
                                                  observation: n.observation,
                                                }
                                              );
                                            if ("list" === h) {
                                              const e = await new Promise(
                                                (e, t) => {
                                                  chrome.scripting.executeScript(
                                                    {
                                                      target: {
                                                        tabId: r.taskTabId,
                                                      },
                                                      function: H,
                                                    },
                                                    (n) => {
                                                      var r;
                                                      chrome.runtime.lastError
                                                        ? t(
                                                            chrome.runtime
                                                              .lastError
                                                          )
                                                        : e(
                                                            (null ===
                                                              (r = n[0]) ||
                                                            void 0 === r
                                                              ? void 0
                                                              : r.result) || []
                                                          );
                                                    }
                                                  );
                                                }
                                              );
                                              (o.result = e.listResult),
                                                (o.page_info = e.page_info),
                                                (o.feedback_content =
                                                  null !== n &&
                                                  void 0 !== n &&
                                                  n.observation
                                                    ? ""
                                                        .concat(t, "\n")
                                                        .concat(n.observation)
                                                    : t),
                                                (o.task_status = "success"),
                                                (o.return_type = h);
                                              const i =
                                                (await (0, p.WD)(o)) || o;
                                              m
                                                ? chrome.tabs.sendMessage(m, {
                                                    action: "replyExternalApp",
                                                    data: i,
                                                  })
                                                : I.postMessage(i);
                                            } else if (h) {
                                              let e = await new Promise(
                                                (e, t) => {
                                                  chrome.scripting.executeScript(
                                                    {
                                                      target: {
                                                        tabId: r.taskTabId,
                                                      },
                                                      func: $,
                                                    },
                                                    (n) => {
                                                      var r;
                                                      chrome.runtime.lastError
                                                        ? t(
                                                            chrome.runtime
                                                              .lastError
                                                          )
                                                        : e(
                                                            (null ===
                                                              (r = n[0]) ||
                                                            void 0 === r
                                                              ? void 0
                                                              : r.result) ||
                                                              "No content"
                                                          );
                                                    }
                                                  );
                                                }
                                              );
                                              if (
                                                null !== e &&
                                                void 0 !== e &&
                                                e.is_pdf_url
                                              ) {
                                                let t = await (0, p.ob)(
                                                  s.data.url
                                                );
                                                "success" ===
                                                  (null === t || void 0 === t
                                                    ? void 0
                                                    : t.status) &&
                                                  (e.file_id =
                                                    null === t || void 0 === t
                                                      ? void 0
                                                      : t.file_id);
                                              }
                                              (o.page_info = e),
                                                (o.feedback_content =
                                                  null !== n &&
                                                  void 0 !== n &&
                                                  n.observation
                                                    ? ""
                                                        .concat(t, "\n")
                                                        .concat(n.observation)
                                                    : t),
                                                (o.task_status = "success"),
                                                (o.return_type = h);
                                              const i =
                                                (await (0, p.WD)(o)) || o;
                                              m
                                                ? chrome.tabs.sendMessage(m, {
                                                    action: "replyExternalApp",
                                                    data: i,
                                                  })
                                                : I.postMessage(i);
                                            } else {
                                              var v;
                                              const e = {
                                                id:
                                                  null ===
                                                    (v = r.functionCall) ||
                                                  void 0 === v
                                                    ? void 0
                                                    : v.id,
                                                feedback_content:
                                                  null !== n &&
                                                  void 0 !== n &&
                                                  n.observation
                                                    ? ""
                                                        .concat(t, "\n")
                                                        .concat(n.observation)
                                                    : t,
                                                task_status: "success",
                                              };
                                              m
                                                ? chrome.tabs.sendMessage(m, {
                                                    action: "replyExternalApp",
                                                    data: e,
                                                  })
                                                : I.postMessage(e);
                                            }
                                            chrome.storage.local.get(
                                              ["advancedMessages"],
                                              async (e) => {
                                                const t =
                                                  e.advancedMessages || [];
                                                if (t.length > 0) {
                                                  var n, r;
                                                  let e = t[t.length - 1],
                                                    i =
                                                      null === e || void 0 === e
                                                        ? void 0
                                                        : e.parts;
                                                  i &&
                                                    i.length > 0 &&
                                                    "Call API" ===
                                                      (null ===
                                                        (n = i[i.length - 1]) ||
                                                      void 0 === n ||
                                                      null ===
                                                        (r = n.content) ||
                                                      void 0 === r
                                                        ? void 0
                                                        : r.action) &&
                                                    (o.kwargs.observation +=
                                                      "\n" +
                                                      i[i.length - 1].content
                                                        .kwargs.instruction);
                                                }
                                                const i = t.findIndex(
                                                  (e) => e.id === u
                                                );
                                                let a;
                                                -1 !== i
                                                  ? ((a = [...t]),
                                                    (a[i].parts = [
                                                      ...a[i].parts,
                                                      {
                                                        content: o,
                                                        type: "text",
                                                      },
                                                    ]),
                                                    (a[i].stop = !0),
                                                    (a[i].messageType =
                                                      "autoglm"))
                                                  : (a = [
                                                      ...t,
                                                      {
                                                        id: u,
                                                        role: "Bot",
                                                        parts: [
                                                          {
                                                            content: o,
                                                            type: "text",
                                                          },
                                                        ],
                                                        stop: !0,
                                                        messageType: "autoglm",
                                                      },
                                                    ]),
                                                  await chrome.storage.local.set(
                                                    { advancedMessages: a }
                                                  );
                                              }
                                            ),
                                              (c = !0),
                                              await chrome.storage.local.remove(
                                                ["functionCall"]
                                              );
                                            break;
                                          }
                                          const b = (0, l.er)(
                                              null === n || void 0 === n
                                                ? void 0
                                                : n.response
                                            ),
                                            w = (0, l.er)(
                                              null === n ||
                                                void 0 === n ||
                                                null === (d = n.detail) ||
                                                void 0 === d
                                                ? void 0
                                                : d.response
                                            );
                                          if (
                                            [b.action, w.action].includes(
                                              "interact"
                                            )
                                          ) {
                                            await chrome.storage.local.set({
                                              interact: {
                                                storageData: r,
                                                detail: n.detail,
                                                responseObj: b || w,
                                              },
                                            });
                                            break;
                                          }
                                          const _ = await (0, p.HY)(
                                            n.response,
                                            n.element_id
                                              ? n.element_id || n.element
                                              : 0,
                                            n.element_bbox
                                              ? n.element_bbox
                                              : {
                                                  height: 0,
                                                  width: 0,
                                                  x: 0,
                                                  y: 0,
                                                },
                                            s.data.viewport_size,
                                            n.observation
                                              ? n.observation
                                              : null,
                                            e
                                          );
                                          if (_) {
                                            if ("exit" === _.action) {
                                              var y;
                                              const e = {
                                                operation: "do",
                                                action: "exit",
                                                round: n.round,
                                                kwargs: {
                                                  observation:
                                                    "\u6d89\u53ca\u5230\u654f\u611f\u64cd\u4f5c\uff0c\u4efb\u52a1\u63d0\u524d\u7ed3\u675f",
                                                },
                                              };
                                              chrome.storage.local.get(
                                                ["advancedMessages"],
                                                async (t) => {
                                                  const n = (
                                                    t.advancedMessages || []
                                                  ).map((t) =>
                                                    t.id === u
                                                      ? (0, a.A)(
                                                          (0, a.A)({}, t),
                                                          {},
                                                          {
                                                            parts: [
                                                              ...t.parts,
                                                              {
                                                                content: e,
                                                                type: "text",
                                                              },
                                                            ],
                                                            stop: !0,
                                                            messageType:
                                                              "autoglm",
                                                          }
                                                        )
                                                      : t
                                                  );
                                                  n.some((e) => e.id === u) ||
                                                    n.push({
                                                      id: u,
                                                      role: "Bot",
                                                      parts: [
                                                        {
                                                          content: e,
                                                          type: "text",
                                                        },
                                                      ],
                                                      stop: !0,
                                                      messageType: "autoglm",
                                                    }),
                                                    await chrome.storage.local.set(
                                                      { advancedMessages: n }
                                                    );
                                                }
                                              );
                                              let t = {
                                                id:
                                                  null === r ||
                                                  void 0 === r ||
                                                  null ===
                                                    (y = r.functionCall) ||
                                                  void 0 === y
                                                    ? void 0
                                                    : y.id,
                                                feedback_content:
                                                  "\u6d89\u53ca\u654f\u611f\u64cd\u4f5c\uff0c\u7528\u6237\u7ec8\u6b62\u4efb\u52a1",
                                                task_status: "sensitive",
                                              };
                                              if (h) {
                                                const e = await (0, p.WD)(t);
                                                e && (t = e);
                                              }
                                              m
                                                ? chrome.tabs.sendMessage(m, {
                                                    action: "replyExternalApp",
                                                    data: t,
                                                  })
                                                : I.postMessage(t),
                                                (c = !0),
                                                await chrome.storage.local.remove(
                                                  ["functionCall"]
                                                );
                                              break;
                                            }
                                            const e = async (e, t, n, r, o) => {
                                              var i, s, l, c, u, d, h, p;
                                              let f = "";
                                              switch (n.action) {
                                                case "Click":
                                                case "Right Click":
                                                  f = "\u70b9\u51fb - ".concat(
                                                    null ===
                                                      (i = n.elementTagName) ||
                                                      void 0 === i
                                                      ? void 0
                                                      : i.slice(0, 17)
                                                  );
                                                  break;
                                                case "Type":
                                                  f = "\u8f93\u5165 - ".concat(
                                                    null === (s = n.kwargs) ||
                                                      void 0 === s ||
                                                      null ===
                                                        (l = s.argument) ||
                                                      void 0 === l
                                                      ? void 0
                                                      : l.slice(0, 17)
                                                  );
                                                  break;
                                                case "Search":
                                                  f = "\u641c\u7d22 - ".concat(
                                                    null === (c = n.kwargs) ||
                                                      void 0 === c ||
                                                      null ===
                                                        (u = c.argument) ||
                                                      void 0 === u
                                                      ? void 0
                                                      : u.slice(0, 17)
                                                  );
                                                  break;
                                                case "Press Enter":
                                                  f = "\u56de\u8f66";
                                                  break;
                                                case "Select Dropdown Option":
                                                  f = "\u9009\u62e9";
                                                  break;
                                                case "Hover":
                                                  f = "\u60ac\u505c - ".concat(
                                                    null ===
                                                      (d = n.elementTagName) ||
                                                      void 0 === d
                                                      ? void 0
                                                      : d.slice(0, 17)
                                                  );
                                                  break;
                                                case "Scroll Down":
                                                case "Scroll Up":
                                                  f = "\u67e5\u770b";
                                                  break;
                                                case "Go Backward":
                                                case "Go Forward":
                                                case "Refresh":
                                                case "Wait":
                                                  f =
                                                    "\u7f51\u9875\u5904\u7406";
                                                  break;
                                                case "Call API":
                                                case "Quote":
                                                  f =
                                                    null !== (h = n.kwargs) &&
                                                    void 0 !== h &&
                                                    h.observation
                                                      ? "\u5185\u5bb9\u5904\u7406 - ".concat(
                                                          n.kwargs.observation.slice(
                                                            0,
                                                            17
                                                          )
                                                        )
                                                      : "\u5185\u5bb9\u5904\u7406";
                                                  break;
                                                case "Waiting":
                                                  f =
                                                    "\u4efb\u52a1\u7406\u89e3\u4e2d - \u8bf7\u8010\u5fc3\u7b49\u5f85";
                                                  break;
                                                case "exit":
                                                  f =
                                                    null !== (p = n.kwargs) &&
                                                    void 0 !== p &&
                                                    p.observation
                                                      ? "\u4efb\u52a1\u7ed3\u675f - ".concat(
                                                          n.kwargs.observation.slice(
                                                            0,
                                                            17
                                                          )
                                                        )
                                                      : "\u4efb\u52a1\u7ed3\u675f";
                                                  break;
                                                case "open_url":
                                                  f =
                                                    "\u6253\u5f00\u7f51\u7ad9-".concat(
                                                      n.open_url
                                                    );
                                                  break;
                                                default:
                                                  f =
                                                    "\u4efb\u52a1\u8fdb\u884c\u4e2d";
                                              }
                                              chrome.storage.local.get(
                                                ["advancedMessages"],
                                                async (i) => {
                                                  const s =
                                                      i.advancedMessages || [],
                                                    l = s.findIndex(
                                                      (t) => t.id === e
                                                    );
                                                  let c;
                                                  -1 !== l && r
                                                    ? ((c = [...s]),
                                                      c[l].parts.push({
                                                        content: (0, a.A)(
                                                          { round: t },
                                                          n
                                                        ),
                                                        type: "text",
                                                      }),
                                                      (c[l].stop = !0))
                                                    : -1 !== l
                                                    ? ((c = [...s]),
                                                      c[l].parts.push({
                                                        content: (0, a.A)(
                                                          { round: t },
                                                          n
                                                        ),
                                                        type: "text",
                                                      }),
                                                      (c[l].taskShowName = f))
                                                    : (c = r
                                                        ? [
                                                            ...s,
                                                            (0, a.A)(
                                                              {
                                                                id: e,
                                                                role: "Bot",
                                                                parts: [
                                                                  {
                                                                    content: (0,
                                                                    a.A)(
                                                                      {
                                                                        round:
                                                                          t,
                                                                      },
                                                                      n
                                                                    ),
                                                                    type: "text",
                                                                  },
                                                                ],
                                                                stop: !0,
                                                              },
                                                              o && {
                                                                messageType: o,
                                                              }
                                                            ),
                                                          ]
                                                        : [
                                                            ...s,
                                                            {
                                                              id: e,
                                                              role: "Bot",
                                                              parts: [
                                                                {
                                                                  content: (0,
                                                                  a.A)(
                                                                    {
                                                                      round: t,
                                                                    },
                                                                    n
                                                                  ),
                                                                  type: "text",
                                                                },
                                                              ],
                                                              taskShowName: f,
                                                            },
                                                          ]),
                                                    await chrome.storage.local.set(
                                                      { advancedMessages: c }
                                                    );
                                                }
                                              );
                                            };
                                            await e(
                                              u,
                                              n.round,
                                              _,
                                              !1,
                                              "autoglm"
                                            );
                                          }
                                        }
                                      } catch (x) {
                                        var b;
                                        chrome.storage.local.get(
                                          ["advancedMessages"],
                                          async (e) => {
                                            let t = e.advancedMessages || [];
                                            t.length > 0 &&
                                              ((t[t.length - 1].stop = !0),
                                              (t[t.length - 1].error = !0)),
                                              await chrome.storage.local.set({
                                                advancedMessages: t,
                                              });
                                          }
                                        );
                                        let t = {
                                          id:
                                            null === (b = r.functionCall) ||
                                            void 0 === b
                                              ? void 0
                                              : b.id,
                                          feedback_content:
                                            "\u4efb\u52a1\u6267\u884c\u51fa\u9519\uff0c\u5df2\u7ec8\u6b62",
                                          task_status: "agent_error",
                                        };
                                        if (h) {
                                          const e = await (0, p.WD)(t);
                                          e && (t = e);
                                        }
                                        m
                                          ? chrome.tabs.sendMessage(m, {
                                              action: "replyExternalApp",
                                              data: t,
                                            })
                                          : I.postMessage(t),
                                          await chrome.storage.local.remove([
                                            "functionCall",
                                          ]);
                                        break;
                                      }
                                      (e += 1), await s(2e3);
                                    }
                                  };
                                await s(500), await c();
                              }
                            }
                            n({
                              status: "success",
                              message: "Toggle workflow successfully",
                            });
                          }
                        ),
                        !0
                      );
                    var v;
                    if ("externalApp" === e.action)
                      return (
                        (b =
                          null === e ||
                          void 0 === e ||
                          null === (v = e.data) ||
                          void 0 === v
                            ? void 0
                            : v.id),
                        (_ = () => {
                          (0, g.l)(e.data, e.tabId);
                        }),
                        b !== N &&
                          (clearTimeout(D),
                          (D = setTimeout(() => {
                            (N = b), _();
                          }, 300))),
                        n({
                          success: !0,
                          message:
                            "External app message processed successfully",
                        }),
                        !0
                      );
                    if ("toggleOpenUrl" === e.action)
                      (async () => {
                        const { taskWindowId: t } =
                          await chrome.storage.local.get(["taskWindowId"]);
                        await chrome.tabs.create(
                          { url: e.url, windowId: t },
                          async (e) => {
                            await chrome.storage.local.set({ taskTabId: e.id }),
                              z(e, O);
                          }
                        );
                      })();
                    else {
                      if ("setAuthCookie" !== e.action)
                        return (
                          n({
                            status: "failure",
                            message: "Unknown action",
                            data: e,
                          }),
                          !0
                        );
                      {
                        const t = e.cookieStr;
                        if (!t) return;
                        const r = (0, l.Kh)(t),
                          o = y()(),
                          i = {
                            url: s.Ay.host,
                            path: "/",
                            secure: !0,
                            httpOnly: !1,
                            sameSite: "no_restriction",
                            expirationDate: o.add(2, "day").unix(),
                          };
                        [
                          (0, a.A)(
                            (0, a.A)({}, i),
                            {},
                            {
                              name: "chatglm_refresh_token",
                              value: r.chatglm_refresh_token,
                              expirationDate: o.add(6, "month").unix(),
                            }
                          ),
                          (0, a.A)(
                            (0, a.A)({}, i),
                            {},
                            { name: "chatglm_token", value: r.chatglm_token }
                          ),
                          (0, a.A)(
                            (0, a.A)({}, i),
                            {},
                            {
                              name: "chatglm_token_expires",
                              value: o
                                .add(2, "day")
                                .format("YYYY-MM-DD%20HH:mm:ss"),
                            }
                          ),
                        ].forEach(async (e) => {
                          await chrome.cookies.set(e);
                        }),
                          n({
                            status: "success",
                            message: "Set Auth Cookie successfully",
                          });
                      }
                    }
                  }
                }
              }
              var b, _;
              return !0;
            });
            const q = (e) => {
              var t;
              let { tabId: n, action: r, instruction: o } = e;
              null === (t = chrome.sidePanel) ||
                void 0 === t ||
                t.setOptions(
                  { tabId: n, path: "index.html", enabled: !0 },
                  () => {
                    var e;
                    null === (e = chrome.sidePanel) ||
                      void 0 === e ||
                      e.open({ tabId: n }, () => {
                        const e = {
                          tabId: n,
                          action: r,
                          followUpRequest: o,
                          sessionId: null,
                          prevMessages: [],
                        };
                        chrome.storage.session.set({ init: e });
                      });
                  }
                );
            };
            async function j(e) {
              const t = e.url,
                n =
                  t.startsWith("chrome://") ||
                  t.startsWith("chrome-extension://") ||
                  t.startsWith("edge://") ||
                  t.startsWith("about:") ||
                  [
                    "https://chrome.google.com/webstore",
                    "https://microsoftedge.microsoft.com/addons",
                    "https://addons.mozilla.org/en-US/firefox",
                    "https://chromewebstore.google.com/",
                  ].some((e) => t.startsWith(e));
              if (
                t &&
                /^(https?:\/\/)?(?!chrome(?:webstore)?\.google\.com)(?!chrome\.)((?:[\w.-]+)|(?:\d{1,3}\.){3}\d{1,3})(:\d+)?(\/\S*)?(#\S*)?$/.test(
                  t
                ) &&
                !n
              )
                try {
                  if (A[e.id]) {
                    const n = ["google.com", "bing.com", "baidu.com", "so.com"];
                    let r = new URL(t);
                    n.some((e) => r.hostname.includes(e)) && U(e.id);
                  } else {
                    (await F(e.id)) || ((A[e.id] = !0), U(e.id));
                  }
                } catch (r) {}
            }
            function U(e) {
              chrome.scripting.executeScript(
                { target: { tabId: e }, files: ["static/js/content.js"] },
                () => {}
              );
            }
            async function F(e) {
              return new Promise((t) => {
                chrome.tabs.sendMessage(
                  e,
                  { action: "checkContentScript" },
                  (e) => {
                    chrome.runtime.lastError
                      ? t(!1)
                      : e && "loaded" === e.status
                      ? t(!0)
                      : t(!1);
                  }
                );
              });
            }
            async function W(e) {
              return new Promise((t) => {
                chrome.tabs.get(e, (e) => {
                  t(e);
                });
              });
            }
            null === (o = chrome.commands) ||
              void 0 === o ||
              null === (i = o.onCommand) ||
              void 0 === i ||
              i.addListener((e, t) => {
                const n = t.id;
                "commands_modal" === e
                  ? chrome.tabs.sendMessage(n, {
                      action: "toggleCommandsModal",
                    })
                  : "web_translate" === e
                  ? chrome.tabs.sendMessage(n, {
                      action: "webTranslate",
                      source: "commands",
                    })
                  : "advanced_select" === e
                  ? q({ tabId: n, action: "advancedSelect" })
                  : "summary_page" === e &&
                    q({ tabId: n, action: "summaryPage" });
              }),
              chrome.tabs.onActivated.addListener(async (e) => {
                const t = await W(e.tabId);
                t && j(t);
              }),
              chrome.tabs.onUpdated.addListener((e, t, n) => {
                "complete" === t.status && j(n);
              }),
              chrome.contextMenus.removeAll(() => {
                chrome.contextMenus.create(
                  {
                    id: "webact-summary",
                    title: "\u6e05\u8a00",
                    contexts: ["all"],
                  },
                  () => {
                    chrome.runtime.lastError ||
                      (chrome.contextMenus.create(
                        {
                          id: "webact-summary-all",
                          title: "\u7f51\u9875\u603b\u7ed3",
                          contexts: ["all"],
                          parentId: "webact-summary",
                        },
                        () => {
                          chrome.runtime.lastError;
                        }
                      ),
                      chrome.contextMenus.create(
                        {
                          id: "webact-translate-all",
                          title: "\u7f51\u9875\u7ffb\u8bd1",
                          contexts: ["all"],
                          parentId: "webact-summary",
                        },
                        () => {
                          chrome.runtime.lastError;
                        }
                      ),
                      chrome.contextMenus.create(
                        {
                          id: "webact-options",
                          title: "\u8bbe\u7f6e",
                          contexts: ["all"],
                          parentId: "webact-summary",
                        },
                        () => {
                          chrome.runtime.lastError;
                        }
                      ));
                  }
                );
              }),
              chrome.contextMenus.onClicked.addListener((e, t) => {
                "webact-summary-all" === e.menuItemId &&
                  chrome.tabs.sendMessage(t.id, {
                    action: "showSummaryAll",
                    source: "context_menus",
                  }),
                  "webact-translate-all" === e.menuItemId &&
                    chrome.tabs.sendMessage(t.id, {
                      action: "webTranslate",
                      source: "context_menus",
                    }),
                  "webact-options" === e.menuItemId &&
                    chrome.runtime.openOptionsPage();
              });
            function z(e, t) {
              let n;
              function r() {
                chrome.tabs.onUpdated.removeListener(o), clearTimeout(n);
              }
              function o(n, o) {
                n === e.id &&
                  "complete" === o.status &&
                  (r(),
                  (t.tabId = e.id),
                  chrome.scripting
                    .executeScript({ target: { tabId: e.id }, func: f.R })
                    .catch(async (e) => {
                      const n = {
                        id: null === t || void 0 === t ? void 0 : t.id,
                        feedback_content:
                          "\u4efb\u52a1\u6267\u884c\u51fa\u9519\uff0c\u5df2\u7ec8\u6b62",
                        task_status: "agent_error",
                      };
                      let r = (await (0, p.WD)(n)) || n;
                      null !== t && void 0 !== t && t.oriTabId
                        ? chrome.tabs.sendMessage(
                            null === t || void 0 === t ? void 0 : t.oriTabId,
                            { action: "replyExternalApp", data: r }
                          )
                        : I.postMessage(
                            null !== t && void 0 !== t && t.return_type ? r : n
                          ),
                        await chrome.storage.local.remove(["functionCall"]);
                    }));
              }
              chrome.tabs.onUpdated.addListener(o),
                (n = setTimeout(async () => {
                  r();
                  const e = {
                      id: null === t || void 0 === t ? void 0 : t.id,
                      feedback_content:
                        "\u4efb\u52a1\u6267\u884c\u8d85\u65f6\uff0c\u5df2\u7ec8\u6b62",
                      task_status: "agent_error",
                    },
                    n = (await (0, p.WD)(e)) || e;
                  null !== t && void 0 !== t && t.oriTabId
                    ? chrome.tabs.sendMessage(
                        null === t || void 0 === t ? void 0 : t.oriTabId,
                        { action: "replyExternalApp", data: n }
                      )
                    : I.postMessage(
                        null !== t && void 0 !== t && t.return_type ? n : e
                      ),
                    await chrome.storage.local.remove(["functionCall"]);
                }, 6e4));
            }
            function B() {
              if (T) return;
              const e = s.yY.getVmWsUrl("vmWs");
              (E = new WebSocket(e)),
                (T = !0),
                (E.onopen = async () => {
                  E.send(
                    JSON.stringify({
                      uid: await (0, c.gf)(
                        s.Ay.userIdStorageKey,
                        s.Ay.userIdCookieKey
                      ),
                      user_type: "cloud",
                      task_type: "connect",
                    })
                  );
                }),
                (E.onmessage = (e) => {
                  const t = e.data.match(/{.*}/),
                    n = JSON.parse(t[0]);
                  if (n && "execute" === n.task_type)
                    try {
                      (0, g.l)(n.text);
                    } catch (r) {}
                }),
                (E.onclose = () => {
                  T = !1;
                });
            }
            if (
              (I.onMessage.addListener(async (e) => {
                if (
                  "HANDSHAKE" === (null === e || void 0 === e ? void 0 : e.type)
                ) {
                  function t() {
                    const e = navigator.userAgent;
                    return -1 !== e.indexOf("QIHU")
                      ? "QIHU"
                      : -1 !== e.indexOf("SamanthaDoubao/")
                      ? "SamanthaDoubao"
                      : -1 !== e.indexOf("QQBrowser")
                      ? "QQBrowser"
                      : -1 !== e.indexOf("Chrome") &&
                        -1 !== e.indexOf("Safari") &&
                        -1 === e.indexOf("Edg")
                      ? "Chrome"
                      : -1 !== e.indexOf("Firefox")
                      ? "Firefox"
                      : -1 !== e.indexOf("Safari") &&
                        -1 === e.indexOf("Chrome") &&
                        -1 === e.indexOf("Edge")
                      ? "Safari"
                      : -1 !== e.indexOf("Edg")
                      ? "Edge"
                      : "Unknown";
                  }
                  return void I.postMessage({
                    browser_type: t(),
                    version: chrome.runtime.getManifest().version,
                  });
                }
                if (
                  "send_cookie" ===
                  (null === e || void 0 === e ? void 0 : e.type)
                ) {
                  null === e || void 0 === e || e.content;
                  return;
                }
                "set_config" !==
                  (null === e || void 0 === e ? void 0 : e.type) &&
                  (null === e || void 0 === e ? void 0 : e.id) !== N &&
                  (clearTimeout(D),
                  (D = setTimeout(async () => {
                    (N = null === e || void 0 === e ? void 0 : e.id),
                      null !== e &&
                        void 0 !== e &&
                        e.id &&
                        (O = {
                          id: null === e || void 0 === e ? void 0 : e.id,
                        }),
                      (0, g.l)(e);
                  }, 300)));
              }),
              I.onDisconnect.addListener(() => {}),
              k)
            ) {
              const G = setInterval(async () => {
                var e;
                await (null === (e = chrome.storage) || void 0 === e
                  ? void 0
                  : e.local.remove(s.Ay.userIdStorageKey));
                (await (0, c.gf)(
                  s.Ay.userIdStorageKey,
                  s.Ay.userIdCookieKey
                )) && (clearInterval(G), B());
              }, 1e3);
            }
            chrome.windows.onRemoved.addListener(async (e) => {
              chrome.windows.getAll({}, async (e) => {
                if (0 === e.length) {
                  var t, n;
                  let e = {
                    id: null === (t = O) || void 0 === t ? void 0 : t.id,
                    feedback_content: "\u5e94\u7528\u5173\u95ed",
                    task_status: "browser_close",
                  };
                  if (null !== (n = O) && void 0 !== n && n.return_type) {
                    const t = await (0, p.Ms)(e);
                    t ? I.postMessage(t) : I.postMessage(e);
                  } else I.postMessage(e);
                }
              });
              if (
                (await chrome.storage.local.get("taskWindowId"))
                  .taskWindowId === e
              ) {
                var t, n;
                let e = {
                  id: null === (t = O) || void 0 === t ? void 0 : t.id,
                  feedback_content: "\u7a97\u53e3\u5173\u95ed",
                  task_status: "window_close",
                };
                if (null !== (n = O) && void 0 !== n && n.return_type) {
                  const t = await (0, p.Ms)(e);
                  t ? I.postMessage(t) : I.postMessage(e);
                } else I.postMessage(e);
                await chrome.storage.local.remove([
                  "taskWindowId",
                  "taskTabId",
                  "functionCall",
                  "advancedMessages",
                ]);
              }
            }),
              chrome.tabs.onRemoved.addListener(async (e, t) => {
                chrome.tts.stop();
                const { taskTabId: n } = await chrome.storage.local.get([
                  "taskWindowId",
                  "taskTabId",
                ]);
                e === n && (await chrome.storage.local.remove("taskTabId")),
                  A[e] && delete A[e];
              }),
              chrome.runtime.onSuspend.addListener(async () => {
                chrome.storage.local.remove([
                  "taskWindowId",
                  "taskTabId",
                  "functionCall",
                  "advancedMessages",
                ]);
              }),
              chrome.runtime.onStartup.addListener(() => {
                chrome.storage.local.remove([
                  "taskWindowId",
                  "taskTabId",
                  "functionCall",
                  "advancedMessages",
                ]);
              }),
              chrome.runtime.onInstalled.addListener((e) => {
                let { reason: t } = e;
                t === chrome.runtime.OnInstalledReason.INSTALL &&
                  chrome.storage.local.remove([
                    "taskWindowId",
                    "taskTabId",
                    "functionCall",
                    "advancedMessages",
                  ]);
              });
            const H = async () => {
                function e(e) {
                  const t = (e = (e = (e = (e = (e = (e = (e = e.replace(
                    /<!--[\s\S]*?-->/g,
                    ""
                  )).replace(/<script[\s\S]*?<\/script>/g, "")).replace(
                    /<link[\s\S]*?>/g,
                    ""
                  )).replace(/<noscript[\s\S]*?<\/noscript>/g, "")).replace(
                    /<style[\s\S]*?<\/style>/g,
                    ""
                  )).replace(/<plasmo-csui[\s\S]*?<\/plasmo-csui>/g, ""))
                    ? e.replace(/\s+/g, " ").trim()
                    : "").match(/<meta charset="([^"]*)">/);
                  let n = new DOMParser({
                    explicitDocumentType: !0,
                    proxyDocument: { encoding: "utf-8" },
                  });
                  if (t) {
                    const e = t[1];
                    n = new DOMParser({
                      explicitDocumentType: !0,
                      proxyDocument: { encoding: e },
                    });
                  }
                  let r = n.parseFromString(e, "text/html");
                  try {
                    Array.from(r.querySelectorAll("*")).forEach((e) => {
                      e.removeAttribute("class"),
                        e.removeAttribute("data-value"),
                        e.removeAttribute("data-text"),
                        e.removeAttribute("data-label"),
                        e.removeAttribute("data-bbox"),
                        e.removeAttribute("data-status"),
                        e.removeAttribute("data-backend-node-id"),
                        e.removeAttribute("data-label-id");
                    });
                  } catch (o) {}
                  return (
                    (function (e) {
                      e.querySelectorAll("*").forEach((e) => {
                        const t = e.getAttribute("style"),
                          n =
                            e &&
                            ("xft-popup-container" ===
                              e.tagName.toLowerCase() ||
                              e.classList.contains("dropdown-items") ||
                              e.classList.contains("start-chat-btn")),
                          r =
                            e &&
                            e.hasAttribute("class") &&
                            "hide" === e.getAttribute("class");
                        t &&
                          !n &&
                          (t.includes("display: none") ||
                            t.includes("display:none") ||
                            t.includes("visibility: hidden") ||
                            t.includes("visibility:hidden") ||
                            t.includes("opacity: 0") ||
                            t.includes("opacity:0") ||
                            (t.includes("position: absolute") &&
                              (t.includes("left: -9999px") ||
                                t.includes("left: -10000px"))) ||
                            t.includes("clip: rect(0, 0, 0, 0)") ||
                            t.includes("clip-path: inset(100%)")) &&
                          e.remove(),
                          r && e.remove();
                      });
                    })(r),
                    r.documentElement.outerHTML
                  );
                }
                function t(e) {
                  return (
                    (e = (e = (e = (e = (e = (e = (e = (e = (e = e.replace(
                      /<style[^>]*>([\s\S]*?)<\/style>/gi,
                      ""
                    )).replace(/<meta[^>]*>([\s\S]*?)<\/meta>/gi, "")).replace(
                      /<br[^>]*>/gi,
                      ""
                    )).replace(/<meta[^>]*>/gi, "")).replace(
                      /<html\b([^>]*)\bdata-bbox="[^"]*"\s*/g,
                      "<html$1"
                    )).replace(
                      /<body\b([^>]*)\bdata-bbox="[^"]*"\s*/g,
                      "<body$1"
                    )).replace(/>\s+</g, "><")).replace(
                      /<html\s*>/g,
                      "<html>"
                    )).replace(/<body\s*>/g, "<body>")).match(
                      /<html\b[^>]*>/i
                    ) || (e = "<html>" + e),
                    e.match(/<\/html>/i) || (e += "</html>"),
                    e.match(/<body\b[^>]*>/i) ||
                      (e = (e = e.replace(
                        /<html\b[^>]*>/i,
                        "<html><body>"
                      )).replace(/<\/html>/i, "</body></html>")),
                    e.match(/<\/body>/i) ||
                      (e = e.replace(/<\/html>/i, "</body></html>")),
                    (e = (e = (e = (e = e.replace(
                      /<svg\b([^>]*)data-text=["']([^"']*)["']([^>]*)>([\s\S]*?)<\/svg>/gi,
                      (e, t, n, r, o) => {
                        let i = n || "";
                        return "<svg"
                          .concat(t, 'data-text="')
                          .concat(n, '"')
                          .concat(r, ">")
                          .concat(i, "</svg>");
                      }
                    )).replace(
                      /<textarea\b([^>]*)placeholder=["']([^"']*)["']([^>]*)>([\s\S]*?)<\/textarea>/gi,
                      (e, t, n, r, o) =>
                        "<textarea"
                          .concat(t, 'data-text="')
                          .concat(n, '"')
                          .concat(r, ">")
                          .concat(o, "</textarea>")
                    )).replace(
                      /<button\b([^>]*)title=["']([^"']*)["']([^>]*)>([\s\S]*?)<\/button>/gi,
                      (e, t, n, r, o) =>
                        "<button"
                          .concat(t, 'data-text="')
                          .concat(n, '"')
                          .concat(r, ">")
                          .concat(o, "</button>")
                    )).replace(/\s*title\s*=\s*["'][^"']*["']/g, ""))
                  );
                }
                try {
                  await new Promise((e, t) => {
                    const n = setTimeout(() => {
                        e();
                      }, 1e4),
                      r = () => {
                        "complete" === document.readyState
                          ? (clearTimeout(n), e())
                          : setTimeout(r, 100);
                      };
                    r();
                  });
                  let x = [],
                    S = window.location.href;
                  if (S.includes("xiaohongshu.com")) {
                    const n = document.querySelectorAll("section.note-item");
                    if (0 === n.length)
                      return {
                        listResult: x,
                        page_info: {
                          html: t(e(document.documentElement.outerHTML)),
                          url: window.location.href,
                          title: document.title,
                        },
                      };
                    let r = 0;
                    for (; r < n.length; ) {
                      if (!n[r].querySelector('a[target*="_self"] img')) {
                        r += 1;
                        continue;
                      }
                      let e =
                          n[r].querySelector("a img") &&
                          n[r].querySelector("a img").closest("a"),
                        t = n[r]
                          .querySelector('div[class="footer"]')
                          .querySelector('a[class*="title"]')
                          ? n[r]
                              .querySelector('div[class="footer"]')
                              .querySelector('a[class*="title"]')
                              .textContent.trim()
                          : "\u65e0\u6807\u9898";
                      e &&
                        e.href &&
                        x.push({
                          date_published: new Date().toISOString(),
                          display_url: e.href,
                          name: t,
                          url: e.href,
                        }),
                        r++;
                    }
                  } else if (S.includes("cnki")) {
                    const n = document.querySelector("#gridTable");
                    if (n) {
                      const r = n.querySelectorAll('td[class*="name"]');
                      if (0 === r.length)
                        return {
                          listResult: x,
                          page_info: {
                            html: t(e(document.documentElement.outerHTML)),
                            url: window.location.href,
                            title: document.title,
                          },
                        };
                      let o = 0;
                      for (; o < r.length; ) {
                        let e = r[o].querySelector("a");
                        e &&
                          e.href &&
                          x.push({
                            date_published: new Date().toISOString(),
                            display_url: e.href,
                            name: e.textContent.trim() || "\u65e0\u6807\u9898",
                            url: e.href,
                          }),
                          o++;
                      }
                    }
                  } else if (S.includes("zhihu.com")) {
                    const n = document.querySelectorAll(
                      'div[class*="ContentItem"][class*="AnswerItem"], div[class*="ContentItem"][class*="ArticleItem"], div[class="ContentItem"]'
                    );
                    if (0 === n.length)
                      return {
                        listResult: x,
                        page_info: {
                          html: t(e(document.documentElement.outerHTML)),
                          url: window.location.href,
                          title: document.title,
                        },
                      };
                    let r = 0;
                    for (; r < n.length; ) {
                      let e = n[r].querySelector("a"),
                        t = n[r].querySelector(
                          "div[class*='RichContent-innner'], span[class*='RichText ztext CopyrightRichText-richText']"
                        );
                      e &&
                        e.href &&
                        x.push(
                          (0, a.A)(
                            {
                              date_published: new Date().toISOString(),
                              display_url: e.href,
                              name:
                                e.textContent.trim() || "\u65e0\u6807\u9898",
                              url: e.href,
                            },
                            t &&
                              t.textContent.trim() && {
                                snippet: t.textContent.trim(),
                              }
                          )
                        ),
                        r++;
                    }
                  } else if (S.includes("xueshu.baidu.")) {
                    const n = document.querySelector(
                      "div[id*='bdxs_result_lists']"
                    );
                    if (n) {
                      const r = n.querySelectorAll(
                        'a[href^="https://xueshu.baidu.com"]'
                      );
                      if (0 === r.length)
                        return {
                          listResult: x,
                          page_info: {
                            html: t(e(document.documentElement.outerHTML)),
                            url: window.location.href,
                            title: document.title,
                          },
                        };
                      let o = 0;
                      for (; o < r.length; ) {
                        let e = r[o];
                        e &&
                          e.href &&
                          x.push({
                            date_published: new Date().toISOString(),
                            display_url: e.href,
                            name: e.textContent.trim() || "\u65e0\u6807\u9898",
                            url: e.href,
                          }),
                          o++;
                      }
                    }
                  } else if (S.includes("scholar.google.")) {
                    const n = document.querySelector(
                      "div[id='gs_res_ccl_mid']"
                    );
                    if (n) {
                      const r = n.querySelectorAll("h3[class*='gs_rt']");
                      if (0 === r.length)
                        return {
                          listResult: x,
                          page_info: {
                            html: t(e(document.documentElement.outerHTML)),
                            url: window.location.href,
                            title: document.title,
                          },
                        };
                      let o = 0;
                      for (; o < r.length; ) {
                        let e = r[o].querySelector("a");
                        e &&
                          e.href &&
                          x.push({
                            date_published: new Date().toISOString(),
                            display_url: e.href,
                            name: e.textContent.trim() || "\u65e0\u6807\u9898",
                            url: e.href,
                          }),
                          o++;
                      }
                    }
                  } else if (S.includes("www.baidu.com")) {
                    const n = document.querySelector("div[id='content_left']");
                    if (n) {
                      const r = n.querySelectorAll(
                        "h3.c-title.t.t.tts-title, h3[class*='t'][class*='kg-title']"
                      );
                      if (0 === r.length)
                        return {
                          listResult: x,
                          page_info: {
                            html: t(e(document.documentElement.outerHTML)),
                            url: window.location.href,
                            title: document.title,
                          },
                        };
                      let o = 0;
                      for (; o < r.length; ) {
                        let e = r[o].querySelector("a");
                        e &&
                          e.href &&
                          x.push({
                            date_published: new Date().toISOString(),
                            display_url: e.href,
                            name: e.textContent.trim() || "\u65e0\u6807\u9898",
                            url: e.href,
                          }),
                          o++;
                      }
                    }
                  } else if (
                    S.includes("www.bing.com") ||
                    S.includes("cn.bing.com")
                  ) {
                    const n = document.querySelector("ol[id*='b_results']");
                    if (n) {
                      const r = n.querySelectorAll("h2:not(.mmtitle)");
                      if (0 === r.length)
                        return {
                          listResult: x,
                          page_info: {
                            html: t(e(document.documentElement.outerHTML)),
                            url: window.location.href,
                            title: document.title,
                          },
                        };
                      let o = 0;
                      for (; o < r.length; ) {
                        let e = r[o].querySelector("a");
                        e &&
                          e.href &&
                          x.push({
                            date_published: new Date().toISOString(),
                            display_url: e.href,
                            name: e.textContent.trim() || "\u65e0\u6807\u9898",
                            url: e.href,
                          }),
                          o++;
                      }
                    }
                  } else if (S.includes("www.google.com")) {
                    const n = document.querySelector("div[id='search']");
                    if (n) {
                      const r = n.querySelectorAll(
                        "a[jsname]:not([jsname=''])"
                      );
                      if (0 === r.length)
                        return {
                          listResult: x,
                          page_info: {
                            html: t(e(document.documentElement.outerHTML)),
                            url: window.location.href,
                            title: document.title,
                          },
                        };
                      let o = 0;
                      for (; o < r.length; ) {
                        let e = r[o];
                        e &&
                          e.href &&
                          x.push({
                            date_published: new Date().toISOString(),
                            display_url: e.href,
                            name: e.textContent.trim() || "\u65e0\u6807\u9898",
                            url: e.href,
                          }),
                          o++;
                      }
                    }
                  } else if (S.includes("arxiv.org")) {
                    const n = document.querySelector(
                      "main[id='main-container']"
                    );
                    if (n) {
                      const r = n.querySelectorAll("li[class*='arxiv-result']");
                      if (0 === r.length)
                        return {
                          listResult: x,
                          page_info: {
                            html: t(e(document.documentElement.outerHTML)),
                            url: window.location.href,
                            title: document.title,
                          },
                        };
                      let o = 0;
                      for (; o < r.length; ) {
                        let e = r[o]
                            .querySelector("p[class*='list-title']")
                            .querySelector("a"),
                          t = r[o].querySelector(
                            "p[class*='title is-5 mathjax']"
                          ),
                          n = r[o].querySelector(
                            "p[class*='abstract mathjax']"
                          );
                        e &&
                          e.href &&
                          x.push(
                            (0, a.A)(
                              {
                                date_published: new Date().toISOString(),
                                display_url: e.href,
                                name:
                                  t.textContent.trim() || "\u65e0\u6807\u9898",
                                url: e.href,
                              },
                              n && { snippet: n.textContent.trim() }
                            )
                          ),
                          o++;
                      }
                    }
                  } else if (S.includes("cqvip.com"))
                    if (S.includes("lib.cqvip.com")) {
                      const n = document.querySelector("div[id*='remark']");
                      if (n) {
                        const r = n.querySelectorAll("dl");
                        if (0 === r.length)
                          return {
                            listResult: x,
                            page_info: {
                              html: t(e(document.documentElement.outerHTML)),
                              url: window.location.href,
                              title: document.title,
                            },
                          };
                        let o = 0;
                        for (; o < r.length; ) {
                          let e = r[o].querySelector("dt a[target='_blank']"),
                            t = r[o].querySelector("dd span[class='abstract']");
                          e &&
                            e.href &&
                            x.push(
                              (0, a.A)(
                                {
                                  date_published: new Date().toISOString(),
                                  display_url: e.href,
                                  name:
                                    e.textContent.trim() ||
                                    "\u65e0\u6807\u9898",
                                  url: e.href,
                                },
                                t && { snippet: t.textContent.trim() }
                              )
                            ),
                            o++;
                        }
                      }
                    } else {
                      const i = document.querySelector(
                        "div[id='search_container']"
                      );
                      if (i) {
                        const s = i.querySelectorAll(
                          "div[class*='searchTitle']"
                        );
                        if (0 === s.length)
                          return {
                            listResult: x,
                            page_info: {
                              html: t(e(document.documentElement.outerHTML)),
                              url: window.location.href,
                              title: document.title,
                            },
                          };
                        let l = 0;
                        for (; l < s.length; ) {
                          var n, r, o;
                          let e = s[l].querySelector("a"),
                            t =
                              null === (n = s[l]) ||
                              void 0 === n ||
                              null === (r = n.parentNode) ||
                              void 0 === r ||
                              null ===
                                (o = r.querySelector(
                                  "div[class*='abstract']"
                                )) ||
                              void 0 === o
                                ? void 0
                                : o.querySelector("span[class*='abstr']");
                          e &&
                            e.href &&
                            x.push(
                              (0, a.A)(
                                {
                                  date_published: new Date().toISOString(),
                                  display_url: e.href,
                                  name:
                                    e.textContent.trim() ||
                                    "\u65e0\u6807\u9898",
                                  url: e.href,
                                },
                                t && { snippet: t.textContent.trim() }
                              )
                            ),
                            l++;
                        }
                      }
                    }
                  else if (S.includes(".wanfangdata.com.cn")) {
                    const n = document.querySelector(
                      "div[class*='result-list']"
                    );
                    if (n) {
                      const r = n.querySelectorAll("div[class*='title-area']");
                      if (0 === r.length)
                        return {
                          listResult: x,
                          page_info: {
                            html: t(e(document.documentElement.outerHTML)),
                            url: window.location.href,
                            title: document.title,
                          },
                        };
                      let o = 0;
                      for (; o < r.length; ) {
                        r[o].querySelector("span[class*='title']");
                        o++;
                      }
                    }
                  } else if (S.includes("pubmed.ncbi.nlm.nih.gov")) {
                    const n = document.querySelector(
                      "div[class*='results-chunk']"
                    );
                    if (n) {
                      const r = n.querySelectorAll(
                        "div[class='docsum-content']"
                      );
                      if (0 === r.length)
                        return {
                          listResult: x,
                          page_info: {
                            html: t(e(document.documentElement.outerHTML)),
                            url: window.location.href,
                            title: document.title,
                          },
                        };
                      let o = 0;
                      for (; o < r.length; ) {
                        let e = r[o].querySelector("a[class*='docsum-title']"),
                          t = r[o].querySelector(
                            "div[class*='docsum-snippet']"
                          );
                        e &&
                          e.href &&
                          x.push(
                            (0, a.A)(
                              {
                                date_published: new Date().toISOString(),
                                display_url: e.href,
                                name:
                                  e.textContent.trim() || "\u65e0\u6807\u9898",
                                url: e.href,
                              },
                              t.textContent.trim() && {
                                snippet: t.textContent.trim(),
                              }
                            )
                          ),
                          o++;
                      }
                    }
                  } else if (S.includes("weibo.com")) {
                    const n = document.querySelector(
                      "div[id*='pl_feedlist_index']"
                    );
                    if (n) {
                      const r = n.querySelectorAll(
                        "div[action-type*='feed_list_item']"
                      );
                      if (0 === r.length)
                        return {
                          listResult: x,
                          page_info: {
                            html: t(e(document.documentElement.outerHTML)),
                            url: window.location.href,
                            title: document.title,
                          },
                        };
                      let o = 0;
                      for (; o < r.length; ) {
                        let e = r[o].querySelector(
                            "p[node-type*='feed_list_content']"
                          ),
                          t = r[o].querySelector("div[class*='from']");
                        e &&
                          x.push({
                            date_published: t.querySelector(
                              "a[target='_blank']"
                            )
                              ? t
                                  .querySelector("a[target='_blank']")
                                  .textContent.trim()
                              : null,
                            display_url:
                              t.querySelector("a[target='_blank']").href || "",
                            name: e.textContent.trim() || "\u65e0\u6807\u9898",
                            url: t.querySelector("a[target='_blank']")
                              ? t.querySelector("a[target='_blank']").href
                              : null,
                          }),
                          o++;
                      }
                    }
                  } else if (S.includes("jd.com")) {
                    const n = document.querySelector("div[id*='J_goodsList']");
                    if (n) {
                      const r = n.querySelectorAll("div[class*='p-name']");
                      if (0 === r.length)
                        return {
                          listResult: x,
                          page_info: {
                            html: t(e(document.documentElement.outerHTML)),
                            url: window.location.href,
                            title: document.title,
                          },
                        };
                      let o = 0;
                      for (; o < r.length; ) {
                        var i, s, l, c, u, d, h, p, f, g, m, v, y, b, w, _;
                        let e = r[o].querySelector("a"),
                          t = [
                            null === (i = r[o]) ||
                            void 0 === i ||
                            null === (s = i.parentNode) ||
                            void 0 === s ||
                            null ===
                              (l = s.querySelector("div[class*='p-price']")) ||
                            void 0 === l ||
                            null === (c = l.innerText) ||
                            void 0 === c
                              ? void 0
                              : c.trim(),
                            null === (u = r[o]) ||
                            void 0 === u ||
                            null === (d = u.parentNode) ||
                            void 0 === d ||
                            null ===
                              (h = d.querySelector("div[class*='p-name']")) ||
                            void 0 === h ||
                            null === (p = h.innerText) ||
                            void 0 === p
                              ? void 0
                              : p.trim(),
                            null === (f = r[o]) ||
                            void 0 === f ||
                            null === (g = f.parentNode) ||
                            void 0 === g ||
                            null ===
                              (m = g.querySelector("div[class*='p-commit']")) ||
                            void 0 === m ||
                            null === (v = m.innerText) ||
                            void 0 === v
                              ? void 0
                              : v.trim(),
                            null === (y = r[o]) ||
                            void 0 === y ||
                            null === (b = y.parentNode) ||
                            void 0 === b ||
                            null ===
                              (w = b.querySelector(
                                "div[class*='p-shopnum']"
                              )) ||
                            void 0 === w ||
                            null === (_ = w.innerText) ||
                            void 0 === _
                              ? void 0
                              : _.trim(),
                          ]
                            .filter(Boolean)
                            .join("\n");
                        e &&
                          e.href &&
                          x.push(
                            (0, a.A)(
                              {
                                date_published: new Date().toISOString(),
                                display_url: e.href,
                                name:
                                  e.innerText.trim() || "\u65e0\u6807\u9898",
                                url: e.href,
                              },
                              t && { snippet: t }
                            )
                          ),
                          o++;
                      }
                    }
                  } else if (S.includes("taobao.com")) {
                    const n = document.querySelector(
                      "div[id*='content_items_wrapper']"
                    );
                    if (n) {
                      const r = n.querySelectorAll("div[class*='title--']");
                      if (0 === r.length)
                        return {
                          listResult: x,
                          page_info: {
                            html: t(e(document.documentElement.outerHTML)),
                            url: window.location.href,
                            title: document.title,
                          },
                        };
                      let o = 0;
                      for (; o < r.length; ) {
                        let e = r[o].closest("a[target='_blank']");
                        if (e && e.href) {
                          let t = [
                            e.querySelector("div[class*='summaryADWrapper--']"),
                            e.querySelector("div[class*='subIconWrapper--']"),
                            e.querySelector("div[class*='priceWrapper--']"),
                            e.querySelector("div[class*='shopInfo--']"),
                          ]
                            .map((e) => {
                              var t;
                              return null === e ||
                                void 0 === e ||
                                null === (t = e.textContent) ||
                                void 0 === t
                                ? void 0
                                : t.trim();
                            })
                            .filter(Boolean)
                            .join("\n");
                          x.push(
                            (0, a.A)(
                              {
                                date_published: new Date().toISOString(),
                                display_url: e.href,
                                name:
                                  r[o].textContent.trim() ||
                                  "\u65e0\u6807\u9898",
                                url: e.href,
                              },
                              t && { snippet: t }
                            )
                          );
                        }
                        o++;
                      }
                    }
                  } else if (S.includes("weixin.sogou.com")) {
                    const n = document.querySelector("div[id*='main']");
                    if (n) {
                      const r = n.querySelectorAll("div[class*='txt-box']");
                      if (0 === r.length)
                        return {
                          listResult: x,
                          page_info: {
                            html: t(e(document.documentElement.outerHTML)),
                            url: window.location.href,
                            title: document.title,
                          },
                        };
                      let o = 0;
                      for (; o < r.length; ) {
                        let e = r[o].querySelector("a[target='_blank']"),
                          t = r[o].querySelector("p[class*='txt-info']"),
                          n = r[o].querySelector("script");
                        e &&
                          e.href &&
                          x.push(
                            (0, a.A)(
                              {
                                date_published:
                                  n &&
                                  n.textContent.trim() &&
                                  n.textContent
                                    .trim()
                                    .match(/timeConvert\('(\d+)'\)/)
                                    ? new Date(
                                        1e3 *
                                          parseInt(
                                            n.textContent
                                              .trim()
                                              .match(
                                                /timeConvert\('(\d+)'\)/
                                              )[1]
                                          )
                                      ).toISOString()
                                    : new Date().toISOString(),
                                display_url: e.href,
                                name:
                                  e.textContent.trim() || "\u65e0\u6807\u9898",
                                url: e.href,
                              },
                              t && { snippet: t.textContent.trim() }
                            )
                          ),
                          o++;
                      }
                    }
                  } else if (S.includes(".bilibili.com")) {
                    const n = document.querySelector(
                      "div[class*='video-list']"
                    );
                    if (n) {
                      const r = n.querySelectorAll(
                        "div[class='bili-video-card__info']"
                      );
                      if (0 === r.length)
                        return {
                          listResult: x,
                          page_info: {
                            html: t(e(document.documentElement.outerHTML)),
                            url: window.location.href,
                            title: document.title,
                          },
                        };
                      let o = 0;
                      for (; o < r.length; ) {
                        let e = r[o].querySelector("a[target='_blank']"),
                          t = r[o].querySelector(
                            "span[class*='bili-video-card__info--date']"
                          );
                        if (e && e.href) {
                          let n = new Date().toISOString(),
                            r =
                              t &&
                              t.textContent &&
                              t.textContent.trim() &&
                              t.textContent.trim().replace(/^[\xb7\s]+/, "");
                          if (r) {
                            let e = Date.parse(r.replace(/-/g, "/"));
                            n = (
                              isNaN(e) ? new Date() : new Date(e)
                            ).toISOString();
                          }
                          x.push({
                            date_published: n,
                            display_url: e.href,
                            name: e.textContent.trim() || "\u65e0\u6807\u9898",
                            url: e.href,
                          });
                        }
                        o++;
                      }
                    }
                  } else if (S.includes(".douyin.com")) {
                    let n = document.querySelector(
                      "div[id='search-result-container']"
                    );
                    if (n) {
                      let r = n.querySelectorAll("div[id*='waterfall_item_']");
                      if (0 === r.length)
                        return {
                          listResult: x,
                          page_info: {
                            html: t(e(document.documentElement.outerHTML)),
                            url: window.location.href,
                            title: document.title,
                          },
                        };
                      let o = 0;
                      for (; o < r.length; ) {
                        r[o].querySelector("a[target='_blank']");
                        o++;
                      }
                    }
                  } else if (S.includes(".youtube.com")) {
                    let n = document.querySelector(
                      "div[id='contents'][class*='ytd-section-list-renderer']"
                    );
                    if (n) {
                      let r = n.querySelectorAll(
                        "ytd-video-renderer[class*='ytd-item-section-renderer']"
                      );
                      if (0 === r.length)
                        return {
                          listResult: x,
                          page_info: {
                            html: t(e(document.documentElement.outerHTML)),
                            url: window.location.href,
                            title: document.title,
                          },
                        };
                      let o = 0;
                      for (; o < r.length; ) {
                        let e = r[o].querySelector("a[id='video-title']");
                        if (e && e.href) {
                          let t = r[o].querySelector(
                            "yt-formatted-string[class*='metadata-snippet-text']"
                          );
                          x.push(
                            (0, a.A)(
                              {
                                date_published: new Date().toISOString(),
                                display_url: e.href,
                                name:
                                  e.textContent.trim() || "\u65e0\u6807\u9898",
                                url: e.href,
                              },
                              t && { snippet: t.textContent.trim() }
                            )
                          );
                        }
                        o++;
                      }
                    }
                  } else if (S.includes(".douban.com")) {
                    let n = document.querySelector(
                      "div[id='search-result-root']"
                    );
                    if (n) {
                      let r = n.querySelectorAll(
                        "div[class*='article-preview-content']"
                      );
                      if (0 === r.length)
                        return {
                          listResult: x,
                          page_info: {
                            html: t(e(document.documentElement.outerHTML)),
                            url: window.location.href,
                            title: document.title,
                          },
                        };
                      let o = 0;
                      for (; o < r.length; ) {
                        let e = r[o].querySelector(
                            "span[class*='article-preview-title']"
                          ),
                          t = r[o].querySelector(
                            "span[class*='article-preview-abstract']"
                          );
                        if (e) {
                          let n = e.querySelector("a[target='_blank']");
                          n &&
                            n.href &&
                            x.push(
                              (0, a.A)(
                                {
                                  date_published: new Date().toISOString(),
                                  display_url: n.href,
                                  name:
                                    n.textContent.trim() ||
                                    "\u65e0\u6807\u9898",
                                  url: n.href,
                                },
                                t && { snippet: t.textContent.trim() }
                              )
                            );
                        }
                        o++;
                      }
                    }
                  } else {
                    let n = document.querySelectorAll('a:not([href=""])');
                    if (0 === n.length)
                      return {
                        listResult: x,
                        page_info: {
                          html: t(e(document.documentElement.outerHTML)),
                          url: window.location.href,
                          title: document.title,
                        },
                      };
                    let r = 0,
                      o = window.location.hostname;
                    for (; r < n.length; ) {
                      let e = n[r];
                      if (
                        e &&
                        e.href &&
                        e.href.startsWith("http") &&
                        (e.textContent || e.title)
                      ) {
                        new URL(null === e || void 0 === e ? void 0 : e.href)
                          .hostname === o &&
                          x.push({
                            date_published: new Date().toISOString(),
                            display_url: e.href,
                            name:
                              e.textContent.trim() ||
                              e.title ||
                              "\u65e0\u6807\u9898",
                            url: e.href,
                          });
                      }
                      r++;
                    }
                  }
                  return {
                    listResult: x,
                    page_info: {
                      html: t(e(document.documentElement.outerHTML)),
                      url: window.location.href,
                      title: document.title,
                    },
                  };
                } catch (x) {}
              },
              $ = async () => {
                try {
                  await new Promise((e, t) => {
                    const n = setTimeout(() => {
                        e();
                      }, 1e4),
                      r = () => {
                        "complete" === document.readyState
                          ? (clearTimeout(n), e())
                          : setTimeout(r, 100);
                      };
                    r();
                  });
                  const o = (e) =>
                    new Promise((t) => {
                      setTimeout(t, e);
                    });
                  await o(3e3);
                  const i = window.location.href.endsWith(".pdf"),
                    s = document.body.querySelector(
                      'embed[type="application/pdf"], object[type="application/pdf"], iframe[src$=".pdf"]'
                    );
                  async function l(e) {
                    try {
                      const t = await originalFetch(e);
                      if (!t.ok)
                        throw new Error("Network response was not ok.");
                      const n = await t.blob(),
                        r = new Image();
                      return new Promise((e, t) => {
                        (r.onload = () => {
                          const t = document.createElement("canvas");
                          (t.width = r.width), (t.height = r.height);
                          t.getContext("2d").drawImage(r, 0, 0);
                          const n = t.toDataURL("image/jpeg", 0.1);
                          e(n);
                        }),
                          (r.onerror = () => {
                            t(new Error("Image failed to load."));
                          }),
                          (r.src = URL.createObjectURL(n));
                      });
                    } catch (t) {
                      throw t;
                    }
                  }
                  async function c() {
                    const e = [],
                      t = document.querySelector("#noteContainer");
                    if (t) {
                      const n = Array.prototype.slice
                        .call(t.querySelectorAll("*"))
                        .map(async (t) => {
                          if (
                            "IMG" === t.tagName &&
                            t.hasAttribute("src") &&
                            t.getAttribute("src").includes("xhscdn.com") &&
                            t.getAttribute("class") &&
                            t.getAttribute("class").includes("note-slider-img")
                          ) {
                            const r = t.getAttribute("src");
                            try {
                              const t = await l(r);
                              e.push(t);
                            } catch (n) {}
                          }
                        });
                      await Promise.all(n);
                    }
                    return e;
                  }
                  function u(e, t) {
                    const n = (e = (e = (e = (e = (e = (e = (e = e.replace(
                      /<!--[\s\S]*?-->/g,
                      ""
                    )).replace(/<script[\s\S]*?<\/script>/g, "")).replace(
                      /<link[\s\S]*?>/g,
                      ""
                    )).replace(/<noscript[\s\S]*?<\/noscript>/g, "")).replace(
                      /<style[\s\S]*?<\/style>/g,
                      ""
                    )).replace(/<plasmo-csui[\s\S]*?<\/plasmo-csui>/g, ""))
                      ? e.replace(/\s+/g, " ").trim()
                      : "").match(/<meta charset="([^"]*)">/);
                    let r = new DOMParser({
                      explicitDocumentType: !0,
                      proxyDocument: { encoding: "utf-8" },
                    });
                    if (n) {
                      const e = n[1];
                      r = new DOMParser({
                        explicitDocumentType: !0,
                        proxyDocument: { encoding: e },
                      });
                    }
                    let o = r.parseFromString(e, "text/html");
                    try {
                      Array.from(o.querySelectorAll("*")).forEach((e) => {
                        e.removeAttribute("class"),
                          e.removeAttribute("data-value"),
                          e.removeAttribute("data-text"),
                          e.removeAttribute("data-label"),
                          e.removeAttribute("data-bbox"),
                          e.removeAttribute("data-status"),
                          e.removeAttribute("data-backend-node-id"),
                          e.removeAttribute("data-label-id");
                      });
                    } catch (i) {}
                    if (t) {
                      let e = o.querySelector("video");
                      e && (e.textContent = t);
                    }
                    return (
                      (function (e) {
                        e.querySelectorAll("*").forEach((e) => {
                          const t = e.getAttribute("style"),
                            n =
                              e &&
                              ("xft-popup-container" ===
                                e.tagName.toLowerCase() ||
                                e.classList.contains("dropdown-items") ||
                                e.classList.contains("start-chat-btn")),
                            r =
                              e &&
                              e.hasAttribute("class") &&
                              "hide" === e.getAttribute("class");
                          t &&
                            !n &&
                            (t.includes("display: none") ||
                              t.includes("display:none") ||
                              t.includes("visibility: hidden") ||
                              t.includes("visibility:hidden") ||
                              t.includes("opacity: 0") ||
                              t.includes("opacity:0") ||
                              (t.includes("position: absolute") &&
                                (t.includes("left: -9999px") ||
                                  t.includes("left: -10000px"))) ||
                              t.includes("clip: rect(0, 0, 0, 0)") ||
                              t.includes("clip-path: inset(100%)")) &&
                            e.remove(),
                            r && e.remove();
                        });
                      })(o),
                      o.documentElement.outerHTML
                    );
                  }
                  function d(e) {
                    return (
                      (e = (e = (e = (e = (e = (e = (e = (e = (e = e.replace(
                        /<style[^>]*>([\s\S]*?)<\/style>/gi,
                        ""
                      )).replace(
                        /<meta[^>]*>([\s\S]*?)<\/meta>/gi,
                        ""
                      )).replace(/<br[^>]*>/gi, "")).replace(
                        /<meta[^>]*>/gi,
                        ""
                      )).replace(
                        /<html\b([^>]*)\bdata-bbox="[^"]*"\s*/g,
                        "<html$1"
                      )).replace(
                        /<body\b([^>]*)\bdata-bbox="[^"]*"\s*/g,
                        "<body$1"
                      )).replace(/>\s+</g, "><")).replace(
                        /<html\s*>/g,
                        "<html>"
                      )).replace(/<body\s*>/g, "<body>")).match(
                        /<html\b[^>]*>/i
                      ) || (e = "<html>" + e),
                      e.match(/<\/html>/i) || (e += "</html>"),
                      e.match(/<body\b[^>]*>/i) ||
                        (e = (e = e.replace(
                          /<html\b[^>]*>/i,
                          "<html><body>"
                        )).replace(/<\/html>/i, "</body></html>")),
                      e.match(/<\/body>/i) ||
                        (e = e.replace(/<\/html>/i, "</body></html>")),
                      (e = (e = (e = (e = e.replace(
                        /<svg\b([^>]*)data-text=["']([^"']*)["']([^>]*)>([\s\S]*?)<\/svg>/gi,
                        (e, t, n, r, o) => {
                          let i = n || "";
                          return "<svg"
                            .concat(t, 'data-text="')
                            .concat(n, '"')
                            .concat(r, ">")
                            .concat(i, "</svg>");
                        }
                      )).replace(
                        /<textarea\b([^>]*)placeholder=["']([^"']*)["']([^>]*)>([\s\S]*?)<\/textarea>/gi,
                        (e, t, n, r, o) =>
                          "<textarea"
                            .concat(t, 'data-text="')
                            .concat(n, '"')
                            .concat(r, ">")
                            .concat(o, "</textarea>")
                      )).replace(
                        /<button\b([^>]*)title=["']([^"']*)["']([^>]*)>([\s\S]*?)<\/button>/gi,
                        (e, t, n, r, o) =>
                          "<button"
                            .concat(t, 'data-text="')
                            .concat(n, '"')
                            .concat(r, ">")
                            .concat(o, "</button>")
                      )).replace(/\s*title\s*=\s*["'][^"']*["']/g, ""))
                    );
                  }
                  if (!window.location.href.includes(".bilibili.com/video")) {
                    const h = await c();
                    return (0, a.A)(
                      (0, a.A)(
                        {
                          url: window.location.href,
                          title: document.title,
                          date: new Date().toISOString(),
                          domain: document.domain,
                          excerpt: "",
                          html: d(u(document.documentElement.outerHTML)),
                        },
                        (i || s) && { is_pdf_url: !0 }
                      ),
                      h && h.length > 0 && { image_list: h }
                    );
                  }
                  {
                    let p = window.location.pathname.split("/"),
                      f = p.pop();
                    async function g(e, t) {
                      document.cookie,
                        navigator.userAgent,
                        window.location.origin,
                        window.location.href;
                      return await window
                        .originalFetch(
                          e,
                          (0, a.A)(
                            { method: "GET", mode: "cors" },
                            t && { credentials: "include" }
                          )
                        )
                        .then((e) => e.json())
                        .then((e) => {
                          if (0 != e.code) throw new Error(e.message);
                          return e;
                        });
                    }
                    async function m(e) {
                      return (
                        await g(
                          "https://api.bilibili.com/x/web-interface/view?bvid=".concat(
                            e
                          ),
                          !0
                        )
                      ).data;
                    }
                    async function v(e, t) {
                      return (
                        await g(
                          "https://api.bilibili.com/x/player/v2?aid="
                            .concat(e, "&cid=")
                            .concat(t),
                          !0
                        )
                      ).data;
                    }
                    "" == f && (f = p.pop());
                    let y =
                      new URLSearchParams(window.location.search).get("p") - 1;
                    (y && -1 != y) || (y = 0);
                    try {
                      let b = await m(f),
                        w = (await v(b.aid, b.pages[y].cid)).subtitle.subtitles;
                      if (0 == w.length)
                        return {
                          url: window.location.href,
                          title: document.title,
                          date: new Date().toISOString(),
                          domain: document.domain,
                          excerpt: "",
                          html: d(u(document.documentElement.outerHTML)),
                          video_subtitle: "\u65e0\u5b57\u5e55",
                        };
                      if (w[0].subtitle_url) {
                        var e, t;
                        const _ = await window.originalFetch(
                            w[0].subtitle_url,
                            { method: "GET" }
                          ),
                          x = await _.json();
                        let S =
                          null === x ||
                          void 0 === x ||
                          null === (e = x.body) ||
                          void 0 === e
                            ? void 0
                            : e.map((e) => e.content).join("\n");
                        return {
                          url: window.location.href,
                          title: document.title,
                          date: new Date().toISOString(),
                          domain: document.domain,
                          excerpt: "",
                          html: d(u(document.documentElement.outerHTML, S)),
                          video_subtitle:
                            (null === x ||
                            void 0 === x ||
                            null === (t = x.body) ||
                            void 0 === t
                              ? void 0
                              : t.map((e) => e.content).join("\n")) ||
                            "\u65e0\u5b57\u5e55",
                        };
                      }
                      return {
                        url: window.location.href,
                        title: document.title,
                        date: new Date().toISOString(),
                        domain: document.domain,
                        excerpt: "",
                        html: d(u(document.documentElement.outerHTML)),
                        video_subtitle: "\u65e0\u5b57\u5e55",
                      };
                    } catch (n) {
                      return {
                        url: window.location.href,
                        title: document.title,
                        date: new Date().toISOString(),
                        domain: document.domain,
                        excerpt: "",
                        html: d(u(document.documentElement.outerHTML)),
                        video_subtitle: "\u65e0\u5b57\u5e55",
                      };
                    }
                  }
                } catch (r) {}
              };
            r();
          } catch (S) {
            r(S);
          }
        });
      },
      64467: (e, t, n) => {
        "use strict";
        n.d(t, { A: () => o });
        var r = n(20816);
        function o(e, t, n) {
          return (
            (t = (0, r.A)(t)) in e
              ? Object.defineProperty(e, t, {
                  value: n,
                  enumerable: !0,
                  configurable: !0,
                  writable: !0,
                })
              : (e[t] = n),
            e
          );
        }
      },
      67827: (e, t, n) => {
        "use strict";
        n.d(t, { r9: () => u });
        var r = n(51477);
        n(61294);
        Object.create(null);
        var o = n(89379);
        const i =
            /&(?:amp|#38|lt|#60|gt|#62|apos|#39|quot|#34|nbsp|#160|copy|#169|reg|#174|hellip|#8230|#x2F|#47);/g,
          a = {
            "&amp;": "&",
            "&#38;": "&",
            "&lt;": "<",
            "&#60;": "<",
            "&gt;": ">",
            "&#62;": ">",
            "&apos;": "'",
            "&#39;": "'",
            "&quot;": '"',
            "&#34;": '"',
            "&nbsp;": " ",
            "&#160;": " ",
            "&copy;": "\xa9",
            "&#169;": "\xa9",
            "&reg;": "\xae",
            "&#174;": "\xae",
            "&hellip;": "\u2026",
            "&#8230;": "\u2026",
            "&#x2F;": "/",
            "&#47;": "/",
          },
          s = (e) => a[e];
        let l = {
          bindI18n: "languageChanged",
          bindI18nStore: "",
          transEmptyNodeValue: "",
          transSupportBasicHtmlNodes: !0,
          transWrapTextNodes: "",
          transKeepBasicHtmlNodesFor: ["br", "strong", "i", "p"],
          useSuspense: !0,
          unescape: (e) => e.replace(i, s),
        };
        var c = n(36465);
        const u = {
          type: "3rdParty",
          init(e) {
            !(function () {
              let e =
                arguments.length > 0 && void 0 !== arguments[0]
                  ? arguments[0]
                  : {};
              l = (0, o.A)((0, o.A)({}, l), e);
            })(e.options.react),
              (0, c.V)(e);
          },
        };
        (0, r.createContext)();
      },
      68667: (e, t, n) => {
        "use strict";
        n.a(e, async (e, r) => {
          try {
            n.d(t, { Y: () => p, u: () => h });
            var o = n(89379),
              i = (n(29942), n(35388)),
              a = n(88567),
              s = n(17846),
              l = e([a]),
              c = l.then ? (await l)() : l;
            a = c[0];
            let u = null;
            const d = 864e5,
              h = async (e) => {
                var t, n, r, o, l;
                const c = await (0, a.gf)();
                if (!c) return {};
                if (c) {
                  const e = (0, s.A)(c);
                  if (null !== e && void 0 !== e && e.is_guest) return {};
                }
                if (
                  !e &&
                  null !== (t = u) &&
                  void 0 !== t &&
                  t.id &&
                  ((null === (n = u) || void 0 === n ? void 0 : n.getAt) || 0) +
                    d >
                    new Date().getTime()
                )
                  return u;
                let h = await (0, a.Zl)(i.yY.getUrl("webagent", "userInfo"), {
                  ignoreEventTracking: !0,
                });
                return (
                  (h =
                    null !== (r = h) &&
                    void 0 !== r &&
                    r.ok &&
                    null !== (o = h) &&
                    void 0 !== o &&
                    o.json
                      ? await h.json()
                      : h),
                  null !== (l = h) && void 0 !== l && l.id
                    ? ((h.getAt = new Date().getTime()), (u = h))
                    : (u = {}),
                  u
                );
              },
              p = async function () {
                let { timeout: e = 864e5, callback: t } =
                  arguments.length > 0 && void 0 !== arguments[0]
                    ? arguments[0]
                    : {};
                const n = "config",
                  r = new Date(),
                  s = r.getTime();
                let l = (await chrome.storage.local.get(n))[n];
                if (!l || !l.timestamp || s - l.timestamp > e) {
                  const e = await (0, a.Zl)(i.yY.getUrl("webagent", "config"), {
                    ignoreEventTracking: !0,
                  });
                  if (
                    null !== e &&
                    void 0 !== e &&
                    e.httpStatus &&
                    200 !== (null === e || void 0 === e ? void 0 : e.httpStatus)
                  )
                    return;
                  (l = (0, o.A)(
                    (0, o.A)({}, e),
                    {},
                    { timestamp: s, time: r.toString() }
                  )),
                    chrome.storage.local.set({ [n]: l });
                }
                return t && t(l), l;
              };
            r();
          } catch (u) {
            r(u);
          }
        });
      },
      69192: (e, t, n) => {
        "use strict";
        var r;
        n.d(t, { A: () => d });
        var o = new Uint8Array(16);
        function i() {
          if (
            !r &&
            !(r =
              ("undefined" !== typeof crypto &&
                crypto.getRandomValues &&
                crypto.getRandomValues.bind(crypto)) ||
              ("undefined" !== typeof msCrypto &&
                "function" === typeof msCrypto.getRandomValues &&
                msCrypto.getRandomValues.bind(msCrypto)))
          )
            throw new Error(
              "crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported"
            );
          return r(o);
        }
        const a =
          /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
        const s = function (e) {
          return "string" === typeof e && a.test(e);
        };
        for (var l = [], c = 0; c < 256; ++c)
          l.push((c + 256).toString(16).substr(1));
        const u = function (e) {
          var t =
              arguments.length > 1 && void 0 !== arguments[1]
                ? arguments[1]
                : 0,
            n = (
              l[e[t + 0]] +
              l[e[t + 1]] +
              l[e[t + 2]] +
              l[e[t + 3]] +
              "-" +
              l[e[t + 4]] +
              l[e[t + 5]] +
              "-" +
              l[e[t + 6]] +
              l[e[t + 7]] +
              "-" +
              l[e[t + 8]] +
              l[e[t + 9]] +
              "-" +
              l[e[t + 10]] +
              l[e[t + 11]] +
              l[e[t + 12]] +
              l[e[t + 13]] +
              l[e[t + 14]] +
              l[e[t + 15]]
            ).toLowerCase();
          if (!s(n)) throw TypeError("Stringified UUID is invalid");
          return n;
        };
        const d = function (e, t, n) {
          var r = (e = e || {}).random || (e.rng || i)();
          if (((r[6] = (15 & r[6]) | 64), (r[8] = (63 & r[8]) | 128), t)) {
            n = n || 0;
            for (var o = 0; o < 16; ++o) t[n + o] = r[o];
            return t;
          }
          return u(r);
        };
      },
      70481: (e, t, n) => {
        "use strict";
        n(97683);
      },
      71118: (e, t, n) => {
        "use strict";
        n.a(e, async (e, r) => {
          try {
            n.d(t, { Zr: () => c });
            var o = n(89379),
              i = (n(35388), n(47041), n(44613)),
              a = n(88567),
              s = e([i, a]),
              l = s.then ? (await s)() : s;
            (i = l[0]), (a = l[1]);
            const c = async (e, t, n) => {
              fetch.__position ? fetch : a.Zl;
              const r = t.type,
                s = "chat";
              var l, c;
              "content" === fetch.__position ||
                ("chat" !== e.split("/").pop() &&
                  "public_chat" !== e.split("/").pop()) ||
                (r
                  ? (0, i._2)(
                      (0, o.A)(
                        {
                          ct: s,
                          ctvl:
                            "public_chat" === e.split("/").pop()
                              ? "public_".concat(r)
                              : r,
                        },
                        (null === t || void 0 === t ? void 0 : t.config) &&
                          (null === t ||
                          void 0 === t ||
                          null === (l = t.config) ||
                          void 0 === l
                            ? void 0
                            : l.assistant_id) && {
                            ctid:
                              null === t ||
                              void 0 === t ||
                              null === (c = t.config) ||
                              void 0 === c
                                ? void 0
                                : c.assistant_id,
                          }
                      )
                    )
                  : (0, i._2)({ ct: s, ctvl: "chat" }));
              try {
                return await (0, a.SA)(
                  e,
                  (0, o.A)(
                    {
                      method: t.method || "POST",
                      headers: (0, o.A)(
                        { "Content-Type": "application/json" },
                        t.headers
                      ),
                      body: t.body || JSON.stringify(t),
                    },
                    n
                  )
                );
              } catch (u) {}
            };
            r();
          } catch (c) {
            r(c);
          }
        });
      },
      72072: (e, t, n) => {
        "use strict";
        n.d(t, { P0: () => o, Uy: () => l, hO: () => r });
        const r =
            /^[v^~<>=]*?(\d+)(?:\.([x*]|\d+)(?:\.([x*]|\d+)(?:\.([x*]|\d+))?(?:-([\da-z\-]+(?:\.[\da-z\-]+)*))?(?:\+[\da-z\-]+(?:\.[\da-z\-]+)*)?)?)?$/i,
          o = (e) => {
            if ("string" !== typeof e)
              throw new TypeError("Invalid argument expected string");
            const t = e.match(r);
            if (!t)
              throw new Error(
                "Invalid argument not valid semver ('".concat(e, "' received)")
              );
            return t.shift(), t;
          },
          i = (e) => "*" === e || "x" === e || "X" === e,
          a = (e) => {
            const t = parseInt(e, 10);
            return isNaN(t) ? e : t;
          },
          s = (e, t) => {
            if (i(e) || i(t)) return 0;
            const [n, r] = ((e, t) =>
              typeof e !== typeof t ? [String(e), String(t)] : [e, t])(
              a(e),
              a(t)
            );
            return n > r ? 1 : n < r ? -1 : 0;
          },
          l = (e, t) => {
            for (let n = 0; n < Math.max(e.length, t.length); n++) {
              const r = s(e[n] || "0", t[n] || "0");
              if (0 !== r) return r;
            }
            return 0;
          };
      },
      76358: (e, t, n) => {
        "use strict";
        n.d(t, { i: () => o });
        var r = n(47041);
        const o = (e) => {
          const t = { metaData: "", functions: [] },
            n = e.split("\n");
          return (
            n.length < 2 ||
              ((t.metaData = n[0]), (t.functions = (0, r.Fh)(n[1], !0) || [])),
            t
          );
        };
      },
      79527: (e) => {
        "use strict";
        e.exports = JSON.parse(
          '{"common":{"close":"\u5173\u95ed","confirm":"\u786e\u5b9a","copy":"\u590d\u5236","copySuccess":"\u590d\u5236\u6210\u529f","stop":"\u505c\u6b62","paused":"\u5df2\u6682\u505c","regenerate":"\u91cd\u65b0\u751f\u6210","upgrade":"\u5347\u7ea7","insert":"\u63d2\u5165","renew":"\u7eed\u8d39","prompt":"\u63d0\u793a","explain":"\u89e3\u91ca","summarize":"\u603b\u7ed3","translate":"\u7ffb\u8bd1","polish":"\u6da6\u8272","settings":"\u8bbe\u7f6e","logout":"\u9000\u51fa","export":"\u5bfc\u51fa","year":"\u5e74","month":"\u6708","day":"\u65e5","ok":"\u597d\u7684","found":"\u627e\u5230","lng":"\u8bed\u8a00","batchTask":"\u6279\u91cf\u4efb\u52a1","generating":"\u6b63\u5728\u751f\u6210","changeLng":"\ud83c\uddec\ud83c\udde7 ENG","qingyanBrowserExtension":"\u6e05\u8a00\u6d4f\u89c8\u5668\u63d2\u4ef6","insertContentIntoInput":"\u5c06\u5185\u5bb9\u63d2\u5165\u5230\u8f93\u5165\u6846\u4e2d","aiGeneratedContentNotice":"\u4ee5\u4e0a\u5185\u5bb9\u5747\u7531AI\u751f\u6210\uff0c\u4ec5\u4f9b\u53c2\u8003\u548c\u501f\u9274","aiGeneratedContentNotice2":"\u5185\u5bb9\u5747\u7531AI \u751f\u6210\uff0c\u4ec5\u4f9b\u53c2\u8003\u548c\u501f\u9274","welcomeToQingyan":"\u6b22\u8fce\u6765\u5230\u6e05\u8a00\uff0c\u8bf7\u544a\u8bc9\u6211\u9700\u8981\u5199\u4ec0\u4e48...","chatGLMAndAutoGLM":"ChatGLM & AutoGLM, \u5de5\u4f5c\u5b66\u4e60 AI \u52a9\u624b"},"tools":{"unpin":"\u53d6\u6d88\u56fa\u5b9a","pin":"\u56fa\u5b9a","textToSpeech":"\u8bed\u97f3\u6717\u8bfb","pauseSpeech":"\u6682\u505c\u6717\u8bfb","expand":"\u5c55\u5f00","collapse":"\u6536\u8d77","search":"\u641c\u4e00\u4e0b","click":"\u70b9\u51fb","input":"\u8f93\u5165","searchAction":"\u641c\u7d22","enterKey":"\u56de\u8f66","selectAction":"\u9009\u62e9","hover":"\u60ac\u505c","view":"\u67e5\u770b","cancel":"\u53d6\u6d88","confirm":"\u786e\u8ba4","downloadImage":"\u4e0b\u8f7d\u56fe\u7247","like":"\u8d5e","dislike":"\u8e29"},"error":{"errorRetry":"\u8bf7\u6c42\u9519\u8bef\uff0c\u8bf7\u91cd\u8bd5","errorRetryLatter":"\u8bf7\u6c42\u51fa\u9519\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5","fetchSettingsError":"\u83b7\u53d6\u8bbe\u7f6e\u4fe1\u606f\u9519\u8bef\uff0c\u8bf7\u91cd\u8bd5","knowledgeYield":"\u975e\u5e38\u62b1\u6b49\uff0c\u6211\u76ee\u524d\u65e0\u6cd5\u63d0\u4f9b\u4f60\u9700\u8981\u7684\u5177\u4f53\u4fe1\u606f\uff0c\u5982\u679c\u4f60\u6709\u5176\u4ed6\u7684\u95ee\u9898\u6216\u8005\u9700\u8981\u67e5\u627e\u5176\u4ed6\u4fe1\u606f\uff0c\u6211\u975e\u5e38\u4e50\u610f\u5e2e\u52a9\u4f60\u3002","serviceError":"\u670d\u52a1\u62a5\u9519\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5","restrictedPageMessage":"\u6b64\u9875\u9762\u4e0d\u652f\u6301\u6d4f\u89c8\u5668\u6269\u5c55\u3002\u53d7\u9650\u9875\u9762\u901a\u5e38\u5305\u62ec\u65b0\u6807\u7b7e\u9875\u3001\u7f51\u7edc\u5546\u5e97\u3001\u5176\u4ed6\u6269\u5c55\u548c\u8bbe\u7f6e\u8bbe\u7f6e(chrome://URLs)\u3002\u8bf7\u5c1d\u8bd5\u4f7f\u7528\u666e\u901a\u9875\u9762\u3002","currentPageNotSupported":"\u5f53\u524d\u9875\u9762\u4e0d\u652f\u6301\u6d4f\u89c8\u5668\u6269\u5c55","unsupportedPages":"\u4e0d\u652f\u6301\u9875\u9762\uff1a\u62d3\u5c55\u7a0b\u5e8f\u5546\u5e97\u3001\u65b0\u6807\u7b7e\u9875\u3001\u8bbe\u7f6e\uff08chrome:// URLs\uff09\u7b49\uff0c\u8bf7\u5728\u5176\u4ed6\u9875\u9762\u5c1d\u8bd5\uff01"},"headerArea":{"title":"\u6e05\u8a00","mode":{"general":"\u901a\u7528\u6a21\u5f0f","advanced":"\u9ad8\u7ea7\u6a21\u5f0f"},"setting":{"historyRecord":"\u5386\u53f2\u8bb0\u5f55","instructionForUse":"\u4f7f\u7528\u8bf4\u660e","userFeedback":"\u7528\u6237\u53cd\u9988","settings":"\u8bbe\u7f6e"}},"recommendTools":{"AutoGLM":"AutoGLM","title":"\u63a8\u8350\u5de5\u5177","academicDaily":"\u5b66\u672f\u65e5\u62a5","generatedDailyReport":"\u4ee5\u4e0b\u662f\u6839\u636e\u60a8\u7684\u63cf\u8ff0\u751f\u6210\u7684\u65e5\u62a5","siteSearch":"\u7ad9\u5185\u68c0\u7d22","multiLinkSummary":"\u591a\u94fe\u63a5\u603b\u7ed3","advancedSiteSearch":"\u7ad9\u5185\u9ad8\u7ea7\u68c0\u7d22","advancedSiteSearchPoint":"\u7ad9\u70b9\u5185\u9ad8\u7ea7\u68c0\u7d22"},"pageContent":{"currentPage":"\u5f53\u524d\u9875\u9762","attemptBriefSummary":"\u5c1d\u8bd5\u7b80\u77ed\u603b\u7ed3","tryDetailedSummary":"\u5c1d\u8bd5\u8be6\u7ec6\u603b\u7ed3"},"footerArea":{"tools":{"createNew":"\u65b0\u5efa","startNewTask":"\u5f00\u542f\u65b0\u4efb\u52a1","pageSummary":"\u9875\u9762\u603b\u7ed3","WebTranslation":"\u7f51\u9875\u7ffb\u8bd1","aiSearch":"AI \u641c\u7d22","ai_search":"AI\u641c\u7d22"},"input":{"pageDialogue":"\u4e0e\u9875\u9762\u5bf9\u8bdd","screenshotDialogue":"\u622a\u5c4f\u5bf9\u8bdd","fileUpload":"\u6587\u4ef6\u4e0a\u4f20","send":"\u53d1\u9001","placeholder":"\u6b22\u8fce\u6765\u5230\u6e05\u8a00\uff0c\u60a8\u53ef\u4ee5\u95ee\u6211\u4efb\u4f55\u95ee\u9898","organizeInformation":"\u6574\u7406\u4fe1\u606f","recognizeText":"\u8bc6\u522b\u6587\u5b57","explain":"\u89e3\u91ca","imageSizeLimit":"\u56fe\u7247\u5927\u5c0f\u4e0d\u80fd\u8d85\u8fc7","maxSupported":"\u4e00\u6b21\u6700\u591a\u652f\u6301","piece":"\u5f20","postsToStrategy":"\u8bf7\u6839\u636e\u4ee5\u4e0a\u5e16\u5b50\u5185\u5bb9\u5f62\u6210\u4e00\u4efd\u5b8c\u6574\u7684\u653b\u7565\u6216\u603b\u7ed3","analyzeLiteratureMarkdown":"\u8bf7\u5206\u6790\u4ee5\u4e0b\u6587\u732e\u5185\u5bb9\uff0c\u6309\u7167markdown\u683c\u5f0f\u8f93\u51fa\u5148\u5206\u522b\u8f93\u51fa\u6bcf\u7bc7\u6587\u732e\u7684\u4e3b\u8981\u5185\u5bb9\uff0c\u5305\u542b\u6587\u732e\u6807\u9898\u3001\u7814\u7a76\u95ee\u9898\u3001\u7814\u7a76\u65b9\u6cd5\u3001\u7814\u7a76\u6210\u679c\u7b49\u518d\u8f93\u51fa\u6240\u6709\u6587\u732e\u7684\u5b8c\u6574\u603b\u7ed3","summarizeContent":"\u8bf7\u603b\u7ed3\u4ee5\u4e0a\u5185\u5bb9\u3002\u5982\u679c\u5bf9\u4e8e\u4e00\u4e2a\u8bdd\u9898\u6709\u4e0d\u540c\u7684\u89c2\u70b9\uff0c\u9700\u6307\u660e\u5176\u4e2d\u7684\u4e89\u8bba\u7126\u70b9\uff0c\u5982\u679c\u6ca1\u6709\uff0c\u5219\u6b63\u5e38\u603b\u7ed3","summarizeTextBody":"\u8bf7\u603b\u7ed3\u6587\u672c\u6b63\u6587\u5185\u5bb9","continueQuestioning":"\u7ee7\u7eed\u63d0\u95ee","selectLinkToExtract":"\u9009\u62e9\u611f\u5174\u8da3\u94fe\u63a5\uff0c\u6e05\u8a00\u5feb\u901f\u63d0\u70bc\u8981\u70b9","inputCommandExecuteOperation":"\u8f93\u5165\u6307\u4ee4\uff0c\u6e05\u8a00\u5e2e\u4f60\u6267\u884c\u64cd\u4f5c","inputCommandGenerateDailyReport":"\u8f93\u5165\u6307\u4ee4\uff0c\u6e05\u8a00\u5e2e\u4f60\u751f\u6210\u65e5\u62a5","inputCommandPreciseSearch":"\u8f93\u5165\u6307\u4ee4\uff0c\u6e05\u8a00\u5e2e\u60a8\u7cbe\u51c6\u641c\u7d22\u3001\u7b5b\u9009\u3001\u6c47\u603b","connectAllContent":"\u8fde\u63a5\u5168\u7f51\u5185\u5bb9\uff0c\u7cbe\u51c6\u641c\u7d22\uff0c\u5feb\u901f\u5206\u6790\u5e76\u603b\u7ed3"}},"advanced":{"viewAll":"\u67e5\u770b\u5168\u90e8","siteNotSupported":"\u6682\u672a\u652f\u6301\u8be5\u7f51\u7ad9\uff0c","recommendation":"\u9ad8\u7ea7\u6a21\u5f0f\u80fd\u529b\u8303\u56f4","noCommonSitesVisit":"\u6ca1\u6709\u4f60\u5e38\u7528\u7684\u7f51\u7ad9\uff1f\u524d\u5f80","submitSuggestion":"\u63d0\u4ea4\u5efa\u8bae","checkMoreTutorials":"\u60f3\u67e5\u770b\u66f4\u591a\u6559\u7a0b\uff1f\u67e5\u770b","usageInstructions":"\u4f7f\u7528\u8bf4\u660e","refreshItems":"\u6362\u4e00\u6362","advanced_select":{"name":"\u591a\u94fe\u63a5\u603b\u7ed3","text":"\u63a2\u7d22\u591a\u94fe\u63a5\u603b\u7ed3\u6240\u6709\u73a9\u6cd5","more":"\u70b9\u51fb\u67e5\u770b >","modalContent":{"small":"\u52fe\u9009\u4efb\u610f\u7f51\u7ad9\u591a\u7bc7\u94fe\u63a5\uff0c\u6e05\u8a00\u5e2e\u4f60\u5feb\u901f\u603b\u7ed3","step1":{"title":"Step1","description":"\u70b9\u51fb<strong>\u201c\u591a\u94fe\u63a5\u603b\u7ed3\u201d</strong>\u540e\u5de6\u4fa7\u94fe\u63a5\u51fa\u73b0\u52fe\u9009\u6846"},"step2":{"title":"Step2","description":"<strong>\u5355\u51fb\u52fe\u9009\u6846</strong>\uff0c\u9009\u62e9\u60f3\u8981\u603b\u7ed3\u7684\u5185\u5bb9\u94fe\u63a5"},"step3":{"title":"Step3","description":"<strong>\u70b9\u51fb\u53d1\u9001</strong>\uff0c\u6e05\u8a00\u81ea\u52a8\u4e3a\u60a8\u751f\u6210\u603b\u7ed3\u5185\u5bb9"}}},"advanced_autoglm_agent":{"name":"AutoGLM Web","text":"\u60a8 <0>\u4e5f</0> \u53ef\u4ee5\u5728\u4ee5\u4e0b\u7f51\u7ad9\u4f53\u9a8c","more":"AutoGLM","available":{"zhihu":{"name":"\u77e5\u4e4e","content":"\u5185\u5bb9\u7b5b\u9009\uff0c\u56de\u7b54/\u6587\u7ae0/\u70ed\u699c/\u6d88\u606f/\u79c1\u4fe1\u603b\u7ed3\uff0c\u6587\u7ae0/\u56de\u7b54/\u60f3\u6cd5\u64b0\u5199\uff0c\u4e2a\u4eba\u4fe1\u606f\u4fee\u6539\uff0c\u8349\u7a3f\u64cd\u4f5c\u7b49"},"weibo":{"name":"\u5fae\u535a","content":"\u53d1\u5fae\u535a\uff0c\u5fae\u535a\u70b9\u8d5e/\u8f6c\u53d1/\u8bc4\u8bba\uff0c\u603b\u7ed3\u4fe1\u606f\uff0c\u8d85\u8bdd\u53d1\u5e16\uff0c\u5173\u6ce8\u5fae\u535a\uff0c\u8d85\u8bdd\u7b7e\u5230\uff0c\u7f6e\u9876/\u5220\u9664\u4e2a\u4eba\u5fae\u535a\u7b49"},"baidu":{"name":"\u767e\u5ea6","content":"\u7f51\u7ad9\u5bfc\u822a\uff0c\u5185\u5bb9\u603b\u7ed3\uff0c\u5168\u7f51\u63a2\u7d22"},"google":{"name":"Google","content":"\u7f51\u7ad9\u5bfc\u822a\uff0c\u5185\u5bb9\u603b\u7ed3\uff0c\u5168\u7f51\u63a2\u7d22"},"bing":{"name":"Bing","content":"\u7f51\u7ad9\u5bfc\u822a\uff0c\u5185\u5bb9\u603b\u7ed3\uff0c\u5168\u7f51\u63a2\u7d22"},"douban":{"name":"\u8c46\u74e3","content":"\u603b\u7ed3/\u63d0\u53d6\u5185\u5bb9\uff0c\u5206\u4eab\u7535\u5f71/\u4e66\u7c4d\uff0c\u67e5\u770b/\u64b0\u5199\u8bc4\u8bba\uff0c\u52a0\u5165\u8c46\u74e3\u5c0f\u7ec4\uff0c\u5173\u6ce8\u7528\u6237\uff0c\u521b\u5efa\u8c46\u5217\uff0c\u53c2\u52a0\u8c46\u74e3\u540c\u57ce\u6d3b\u52a8\uff0c\u67e5\u770b\u4e2a\u4eba\u4fe1\u606f"},"baidu_tieba":{"name":"\u767e\u5ea6\u8d34\u5427","content":"\u603b\u7ed3/\u63d0\u53d6\u5185\u5bb9\uff0c\u6536\u85cf\u5e16\u5b50\uff0c\u67e5\u770b/\u64b0\u5199\u8bc4\u8bba\uff0c\u8d34\u5427\u5173\u6ce8/\u7b7e\u5230\u7b49"},"ar_xiv":{"name":"arXiv","content":"\u68c0\u7d22\u8bba\u6587(\u603b\u7ed3/\u63d0\u53d6\u5185\u5bb9)\uff0c\u67e5\u770b\u8bba\u6587pdf\uff0c\u83b7\u53d6\u8bba\u6587\u5f15\u7528"},"baidu_xueshu":{"name":"\u767e\u5ea6\u5b66\u672f","content":"\u68c0\u7d22\u8bba\u6587(\u603b\u7ed3/\u63d0\u53d6\u5185\u5bb9)\uff0c\u6536\u85cf/\u4e0b\u8f7d\u8bba\u6587\uff0c\u83b7\u53d6\u8bba\u6587\u5f15\u7528"},"google_xueshu":{"name":"\u8c37\u6b4c\u5b66\u672f","content":"\u68c0\u7d22\u8bba\u6587(\u603b\u7ed3/\u63d0\u53d6\u5185\u5bb9)\uff0c\u6536\u85cf/\u4e0b\u8f7d\u8bba\u6587\uff0c\u83b7\u53d6\u8bba\u6587\u5f15\u7528"},"github":{"name":"Github","content":"\u641c\u7d22\u548c\u67e5\u627e\u9879\u76ee\uff0c\u4e0b\u8f7d\u9879\u76ee\uff0c\u7b80\u6613\u6587\u4ef6\u7ba1\u7406\uff0c\u5206\u652f\u521b\u5efa\uff0c\u6807\u7b7e\u7ba1\u7406\uff0cstar"},"wangyi":{"name":"\u7f51\u6613\u65b0\u95fb","content":"\u603b\u7ed3/\u63d0\u53d6\u4fe1\u606f"},"twitter":{"name":"X (Twitter)","content":"\u63a8\u6587\u70b9\u8d5e\uff0c\u63a8\u6587\u8f6c\u53d1\uff0c\u53d1\u5e03\u63a8\u6587\uff0c\u641c\u7d22\u63a8\u6587\uff0c\u8bc4\u8bba\u63a8\u6587\u7b49\u64cd\u4f5c"}}},"advanced_search":{"name":"\u7ad9\u5185\u9ad8\u7ea7\u68c0\u7d22","text":"\u60a8 <0>\u4e5f</0> \u53ef\u4ee5\u5728\u4ee5\u4e0b\u7f51\u7ad9\u4f53\u9a8c","more":"\u7ad9\u5185\u9ad8\u7ea7\u68c0\u7d22","available":{"xiaohongshu":{"name":"\u5c0f\u7ea2\u4e66","content":"\u603b\u7ed3\u65c5\u6e38\u653b\u7565\uff0c\u5b9a\u5236\u5b66\u4e60\u65b9\u6848\uff0c\u67e5\u8be2\u751f\u6d3b\u7591\u95ee"},"zhiwang":{"name":"\u77e5\u7f51","content":"\u5b9a\u5236\u5316\u6587\u7ae0\u67e5\u627e\uff0c\u8bba\u6587/\u671f\u520a/\u4e13\u5229\u7efc\u8ff0\uff0c\u6838\u5fc3\u5185\u5bb9\u63d0\u53d6\u7b49"},"weipu":{"name":"\u7ef4\u666e","content":"\u5b9a\u5236\u5316\u6587\u7ae0\u67e5\u627e\uff0c\u8bba\u6587/\u671f\u520a/\u4e13\u5229\u7efc\u8ff0\uff0c\u6838\u5fc3\u5185\u5bb9\u63d0\u53d6\u7b49"},"baidu_xueshu":{"name":"\u767e\u5ea6\u5b66\u672f","content":"\u5b9a\u5236\u5316\u6587\u7ae0\u67e5\u627e\uff0c\u8bba\u6587/\u671f\u520a/\u4e13\u5229\u7efc\u8ff0\uff0c\u6838\u5fc3\u5185\u5bb9\u63d0\u53d6\u7b49"},"google_xueshu":{"name":"\u8c37\u6b4c\u5b66\u672f","content":"\u5b9a\u5236\u5316\u6587\u7ae0\u67e5\u627e\uff0c\u8bba\u6587/\u671f\u520a/\u4e13\u5229\u7efc\u8ff0\uff0c\u6838\u5fc3\u5185\u5bb9\u63d0\u53d6\u7b49"},"zhihu":{"name":"\u77e5\u4e4e","content":"\u5b66\u4e60\u7ecf\u5386\u7ecf\u9a8c\uff0c\u5173\u6ce8\u79d1\u6280\u53d1\u5c55\uff0c\u641c\u5bfb\u95ee\u9898\u7b54\u6848"},"baidu":{"name":"\u767e\u5ea6\u641c\u7d22","content":"\u7f51\u7ad9\u5bfc\u822a\uff0c\u5185\u5bb9\u603b\u7ed3"},"google":{"name":"Google \u641c\u7d22","content":"\u7f51\u7ad9\u5bfc\u822a\uff0c\u5185\u5bb9\u603b\u7ed3"},"bing":{"name":"Bing \u641c\u7d22","content":"\u7f51\u7ad9\u5bfc\u822a\uff0c\u5185\u5bb9\u603b\u7ed3"}}},"advanced_daily_report":{"name":"\u5b66\u672f\u65e5\u62a5","text":"\u8bf7\u524d\u5f80","textSuffix":"\u63a2\u7d22\u65e5\u62a5\u4f7f\u7528\u65b9\u6cd5","more":"\u5b66\u672f\u65e5\u62a5","available":{"ar_xiv":{"name":"ArXiv","content":"\u603b\u7ed3\u4fe1\u606f\uff0c\u751f\u6210\u4e13\u4e1aArXiv\u65e5\u62a5"},"pub_med":{"name":"PubMed","content":"\u603b\u7ed3\u4fe1\u606f\uff0c\u751f\u6210\u4e13\u4e1aPubMed\u65e5\u62a5"},"hugging_face":{"name":"Huggingface","content":"\u603b\u7ed3\u4fe1\u606f\uff0c\u751f\u6210\u4e13\u4e1aHuggingFace\u65e5\u62a5"}}},"github_search_issues":{"name":"Issue \u95ee\u7b54","text":"\u8bf7\u524d\u5f80","textSuffix":"\u7684\u5177\u4f53\u4ed3\u5e93\u518d\u63d0\u95ee"}},"consumption":{"retry":"\u518d\u6b21","completed":"\u5df2\u5b8c\u6210","thinkAgain":"\u6211\u518d\u60f3\u60f3","failure":"\u5931\u8d25\uff0c","completeInZhiPu":"\u8bf7\u5728\u667a\u8c31\u6e05\u8a00\u5b8c\u6210","membership":"\u4f1a\u5458","experienceMembership":"\u6210\u529f\uff0c\u5feb\u53bb\u4f53\u9a8c\u4f1a\u5458\u529f\u80fd\u5427","upgradeToMembership":"\u5347\u7ea7\u4e3a\u4f1a\u5458","attention":"\u6ce8\u610f","noTaskUsageToday":"\u4eca\u65e5\u5df2\u65e0\u6b64\u4efb\u52a1\u4f7f\u7528\u6b21\u6570\uff0c\u8bf7","tryOtherTasks":"\u5c1d\u8bd5\u5176\u4ed6\u4efb\u52a1","upgradeToMembershipPrompt":"\u5347\u7ea7\u4e3a\u4f1a\u5458","tryAgainTomorrow":"\u6216\u660e\u65e5\u518d\u8bd5"},"upgrade_popover":{"membership":"\u6e05\u8a00\u4f1a\u5458","pluginBenefits":"\u63d2\u4ef6\u6743\u76ca","autoGLM":"AutoGLM","academicDaily":"\u5b66\u672f\u65e5\u62a5","moreBenefits":"\u66f4\u591a\u6743\u76ca","acceleration":"\u6e05\u5f71\u52a0\u901f \u52a0\u901f\u89c6\u9891\u751f\u6210","hdRedraw":"\u9ad8\u6e05\u91cd\u7ed8 Al\u7ed8\u753b\u66f4\u9ad8\u6e05","videoCall":"\u89c6\u9891\u901a\u8bdd \u4e0e\u5c0f\u667a\u5feb\u4e50\u804a","immediately":"\u7acb\u5373","viewMoreBenefits":"\u67e5\u770b\u66f4\u591a\u6743\u76ca\u4fe1\u606f"},"advanced_desc":{"voiceCommand":"\u89e3\u653e\u53cc\u624b\uff0c\u4e00\u53e5\u8bdd\u8ba9\u6e05\u8a00\u5728\u7f51\u9875\u4e0a\u6267\u884c\u4efb\u52a1\uff01","researchUpdate":"\u8f93\u5165\u7814\u7a76\u65b9\u5411\uff0c\u7ed9\u4f60\u6c47\u62a5\u6700\u65b0\u7684\u7814\u7a76\u8fdb\u5c55\uff01","searchFilterSummarize":"\u8f93\u5165\u6307\u4ee4\u548c\u6761\u4ef6\uff0c\u5e2e\u4f60\u641c\u7d22\u3001\u7b5b\u9009\u548c\u603b\u7ed3\uff01","extractKeyPoints":"\u52fe\u9009\u591a\u7bc7\u94fe\u63a5\uff0c\u5feb\u901f\u63d0\u70bc\u6838\u5fc3\u8981\u70b9\uff01"},"globalInput":{"autoRespond":"\u5f00\u542f\u540e\uff0c\u6e05\u8a00\u5c06\u4f1a\u6839\u636e<br />\u5de6\u4fa7\u7f51\u9875\u4e2d\u7684\u5185\u5bb9\u505a\u51fa\u56de\u7b54","generateReport":"\u8bf7\u5e2e\u6211\u751f\u6210","parseApprox":"\u89e3\u6790\u7ea6","disableAISearch":"\u5173\u95edAI\u641c\u7d22","summarizeDocument":"\u603b\u7ed3\u6b64\u6587\u6863","selected":"\u5df2\u52fe\u9009","dailyReport":"\u7684\u65e5\u62a5"},"scribingTool":{"reading":"\u6717\u8bfb","codeAssistant":"\u89e3\u91ca\u4ee3\u7801","answerTheQuestion":"\u56de\u7b54\u95ee\u9898","managementOperations":"\u7ba1\u7406\u64cd\u4f5c","hideUntilNextVisit":"\u9690\u85cf\u76f4\u5230\u4e0b\u6b21\u8bbf\u95ee","disableOnThisPage":"\u5728\u6b64\u7f51\u9875\u7981\u7528","disableOnAllPages":"\u5168\u5c40\u7981\u7528","restartInSettings":"\u60a8\u53ef\u5728\u8bbe\u7f6e\u4e2d\u91cd\u65b0\u542f\u52a8","showOnTheLayer":"\u6d6e\u5c42\u663e\u793a","showOnSidebar":"\u4fa7\u8fb9\u680f\u663e\u793a","youCan":"\u60a8\u53ef\u5728","restart":"\u4e2d\u91cd\u65b0\u542f\u7528","translateEnToZh":"\u82f1\u8bd1\u4e2d","translateZhToEn":"\u4e2d\u8bd1\u82f1","translateOtherToZh":"\u5176\u4ed6\u8bd1\u4e2d","autoTranslate":"\u81ea\u52a8","enterQuestion":"\u8bf7\u8f93\u5165\u95ee\u9898","followUpResultsSidebar":"\u8ffd\u95ee\u7ed3\u679c\u5c06\u5728\u4fa7\u8fb9\u680f\u5c55\u793a","continueAsking":"\u7ee7\u7eed\u63d0\u95ee..."},"option":{"zhipuQingyan":"\u667a\u8c31\u6e05\u8a00","zhipuLogo":"\u667a\u8c31\u6e05\u8a00\u6807\u5fd7logo","floatBall":"\u60ac\u6d6e\u7403","pluginInstallTip":"\u5b89\u88c5\u63d2\u4ef6\u540e\uff0c\u6e05\u8a00 LOGO \u56fe\u6807\u4f1a\u51fa\u73b0\u5728\u5927\u591a\u6570\u7f51\u9875\u7684\u53f3\u4e0b\u89d2\u3002\u5b83\u53ef\u4ee5\u5e2e\u4f60\u66f4\u5feb\u5730\u5524\u8d77\u6e05\u8a00\uff0c\u66f4\u9ad8\u6548\u5730\u5b8c\u6210\u4efb\u52a1\u3002","showFloatingIcon":"\u5728\u6240\u6709\u7f51\u7ad9\u663e\u793a\u60ac\u6d6e\u56fe\u6807","searchEngineAssistant":"\u641c\u7d22\u5f15\u64ce\u52a9\u624b","aiSearchResultTip":"\u5728\u4f7f\u7528\u641c\u7d22\u5f15\u64ce\u65f6\uff0c\u6e05\u8a00\u5c06\u4f1a\u5728\u641c\u7d22\u7ed3\u679c\u65c1\u663e\u793aAI\u641c\u7d22\u7ed3\u679c\u3002","showAssistantInSearch":"\u5728\u641c\u7d22\u7ed3\u679c\u65c1\u663e\u793a\u52a9\u624b","selectionToolbar":"\u5212\u8bcd\u5de5\u5177\u680f","selectionToolbarTip":"\u5212\u8bcd\u5de5\u5177\u680f\u662f\u4e3a\u6587\u672c\u5feb\u6377\u64cd\u4f5c\u8bbe\u8ba1\u7684\u3002\u60a8\u53ef\u4ee5\u9009\u62e9\u662f\u5426\u5728\u6bcf\u6b21\u9009\u4e2d\u6587\u672c\u65f6\u5524\u8d77\u5b83\u3002","alwaysEnableSelectionToolbar":"\u59cb\u7ec8\u5728\u9009\u4e2d\u6587\u5b57\u65f6\u542f\u7528","writingAssistant":"\u5199\u4f5c\u52a9\u624b","writingAssistantTip":"\u5199\u4f5c\u52a9\u624b\u4f1a\u5728\u6bcf\u4e2a\u8f93\u5165\u6846\u65c1\u51fa\u73b0\uff0c\u5b83\u80fd\u5e2e\u60a8\u8f7b\u677e\u64b0\u5199\u8bc4\u8bba\u548c\u5e16\u5b50\u3002\u5b83\u8fd8\u80fd\u5e2e\u60a8\u64b0\u5199\u56de\u590d\u7535\u5b50\u90ae\u4ef6\u3002","enableAiWritingAssistant":"\u542f\u7528AI\u5199\u4f5c\u52a9\u624b","codeExplanation":"\u4ee3\u7801\u89e3\u91ca (CodeGeeX)","codeAssistantTip":"\u4ee3\u7801\u52a9\u624b\u4f1a\u51fa\u73b0\u5728\u6bcf\u4e2a\u4ee3\u7801\u5757\u4e2d\uff0c\u5e76\u5e2e\u52a9\u60a8\u7406\u89e3\u4ee3\u7801\u5185\u5bb9\u3002","enableCodeAssistant":"\u542f\u7528\u4ee3\u7801\u52a9\u624b","quickPopup":"\u5feb\u6377\u5f39\u7a97","quickPopupTip":"\u60a8\u53ef\u4ee5\u9009\u62e9\u662f\u5426\u8981\u901a\u8fc7\u5feb\u6377\u952e\u5524\u8d77AI\u52a9\u624b\u3002\uff08\u5e73\u65f6AI\u52a9\u624b\u5c06\u5904\u4e8e\u9690\u85cf\u72b6\u6001\uff09","triggerQuickPopup":"\u5524\u8d77\u5feb\u6377\u5f39\u7a97","shortcutSettingsTip":"\u60a8\u53ef\u4ee5\u6253\u5f00\u6d4f\u89c8\u5668\u201c\u8bbe\u7f6e\u201d\u201c\u6269\u5c55\u7a0b\u5e8f\u201d\u4e0b\u7684\u201c\u952e\u76d8\u5feb\u6377\u952e\u201d\u9009\u9879\u8fdb\u884c\u4fee\u6539","filingTitle":"\u66f4\u591a\u4fe1\u606f","icpFiling":"ICP\u5907\u6848/\u8bb8\u53ef\u8bc1\u53f7","icpFilingContent":"\u4eacICP\u590720011824\u53f7-18","algorithmFiling":"\u7b97\u6cd5\u5907\u6848","algorithmFilingContentGenerate":"\u667a\u8c31ChatGLM\u751f\u6210\u7b97\u6cd5(\u7f51\u4fe1\u7b97\u5907110108105858001230019\u53f7)","algorithmFilingContentSearch":"\u667a\u8c31ChatGLM\u641c\u7d22\u7b97\u6cd5(\u7f51\u4fe1\u7b97\u5907110108105858004240011\u53f7)","modelFiling":"\u6a21\u578b\u5907\u6848","modelFilingContent":"\u667a\u8c31\u6e05\u8a00(ChatGLM):Beijing-ChatGLM-20230821)","contactUs":"\u8054\u7cfb\u6211\u4eec","feedbackTip":"\u6b22\u8fce\u60a8\u4e3a\u6211\u4eec\u63d0\u51fa\u5b9d\u8d35\u7684\u5efa\u8bae\uff0c\u6211\u4eec\u5c06\u4e0d\u65ad\u6539\u8fdb\u4e3a\u60a8\u63d0\u4f9b\u66f4\u597d\u7684\u670d\u52a1\u3002","giveFeedback":"\u53bb\u53cd\u9988","feedbackHistory":"\u5386\u53f2\u53cd\u9988","disableWebsite":"\u7981\u7528\u7f51\u7ad9","disableThisWebsite":"\u7981\u7528\u6b64\u7f51\u7ad9","version":"\u7248\u672c","user":{"logoutConfirm":"\u60a8\u786e\u5b9a\u8981\u9000\u51fa\u767b\u5f55\u5417\uff1f","accountInfo":"\u8d26\u6237\u4fe1\u606f","phoneNumber":"\u624b\u673a\u53f7"},"clickAgainToDeselect":"\u518d\u6b21\u70b9\u51fb\u53d6\u6d88\u9009\u62e9"},"AISearch":{"searchInputNotFound":"\u672a\u627e\u5230\u641c\u7d22\u8f93\u5165\u6846\uff01","searchContentEmpty":"\u641c\u7d22\u5185\u5bb9\u4e3a\u7a7a\uff01","recommendationListEmpty":"\u63a8\u8350\u5217\u8868\u4e3a\u7a7a\uff01","getRecommendationListError":"\u83b7\u53d6\u63a8\u8350\u5217\u8868\u51fa\u9519\uff1a","zhipuAiGlobalSearch":"\u6e05\u8a00 AI \u5168\u57df\u641c\u7d22","continueAskQingyan":"\u7ee7\u7eed\u95ee\u6e05\u8a00","continueInChat":"\u5728\u804a\u5929\u4e2d\u7ee7\u7eed","getAIResult":"\u83b7\u53d6AI\u7ed3\u679c","requestFailed":"\u8bf7\u6c42\u5931\u8d25","requestFailed401":"\u8bf7\u60a8\u5148\u767b\u5f55","requestFailed403":"\u8bf7\u60a8\u5148\u767b\u5f55","requestFailed500":"\u8bf7\u6c42\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5","requestFailed503":"\u8bf7\u6c42\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5","requestFailed504":"\u8bf7\u6c42\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5"},"qingyanHelp":{"writeWeiboPostAboutTopic":"\u5e2e\u6211\u5199\u4e00\u7bc7\u5173\u4e8e\u3010\u4e3b\u9898\u3011\u7684\u5fae\u535a\u5e16\u5b50\u3002","writeArticleAboutTopic":"\u5e2e\u6211\u5199\u4e00\u7bc7\u5173\u4e8e\u3010\u4e3b\u9898\u3011\u7684\u6587\u7ae0\u3002","writeCommentForOpinion":"\u5e2e\u6211\u5199\u4e00\u4e0b\u3010\u652f\u6301/\u53cd\u5bf9\u3011\u8fd9\u4e2a\u89c2\u70b9\u7684\u8bc4\u8bba\u3002\u5c11\u4e8e150\u5b57\u3002","writeEvaluation":"\u5e2e\u6211\u5199\u4e00\u4e0b\u8bc4\u4ef7\u3002","writeReplyForOpinion":"\u5e2e\u6211\u5199\u4e00\u4e0b\u3010\u652f\u6301/\u53cd\u5bf9\u3011\u8fd9\u4e2a\u89c2\u70b9\u7684\u56de\u590d\u3002\u5c11\u4e8e150\u5b57\u3002","writeCleverReplyForOpinion":"\u5e2e\u6211\u5199\u4e00\u4e0b\u8fd9\u4e2a\u89c2\u70b9\u7684\u795e\u56de\u590d\u3002\u5c11\u4e8e150\u5b57\u3002","organizeOpinion":"\u5e2e\u6211\u68b3\u7406\u4e00\u4e0b\u89c2\u70b9\u3002","writeReplyEmail":"\u5e2e\u6211\u5199\u4e00\u5c01\u56de\u590d\u90ae\u4ef6\u3002","writeEmailAboutTopic":"\u5e2e\u6211\u5199\u4e00\u5c01\u5173\u4e8e\u3010\u4e3b\u9898\u3011\u7684\u90ae\u4ef6\u3002","writeDailyReport":"\u5e2e\u6211\u5199\u4e00\u4efd\u4eca\u5929\u7684\u65e5\u62a5\uff0c\u5305\u542b\u3010\u5de5\u4f5c\u5185\u5bb9\u3011\u548c\u3010\u6210\u679c\u3011\u3002","writeWeeklyReport":"\u5e2e\u6211\u5199\u4e00\u4efd\u672c\u5468\u7684\u5468\u62a5\u603b\u7ed3\uff0c\u5305\u542b\u3010\u5de5\u4f5c\u5185\u5bb9\u3011\u548c\u3010\u6210\u679c\u3011\u3002","writeMonthlyReport":"\u5e2e\u6211\u5199\u4e00\u4efd\u672c\u6708\u7684\u6708\u62a5\u603b\u7ed3\uff0c\u5305\u542b\u3010\u5de5\u4f5c\u5185\u5bb9\u3011\u548c\u3010\u6210\u679c\u3011\u3002","noInputContent":"\u60a8\u6ca1\u6709\u8f93\u5165\u4efb\u4f55\u5185\u5bb9!","qingyanWriteWeibo":"\u6e05\u8a00\u5e2e\u4f60\u5199\u5fae\u535a","qingyanWriteArticle":"\u6e05\u8a00\u5e2e\u4f60\u5199\u6587\u7ae0","qingyanWriteComment":"\u6e05\u8a00\u5e2e\u4f60\u5199\u8bc4\u8bba","qingyanWriteLongComment":"\u6e05\u8a00\u5e2e\u4f60\u5199\u8bc4\u8bba","qingyanWriteReply":"\u6e05\u8a00\u5e2e\u4f60\u5199\u56de\u590d","qingyanWriteAnswer":"\u6e05\u8a00\u5e2e\u4f60\u5199\u56de\u7b54","qingyanWriteReplyEmail":"\u6e05\u8a00\u5e2e\u4f60\u56de\u590d\u90ae\u4ef6","qingyanWriteEmail":"\u6e05\u8a00\u5e2e\u4f60\u5199\u90ae\u4ef6","qingyanWriteDailyReport":"\u6e05\u8a00\u5e2e\u4f60\u5199\u65e5\u62a5","qingyanWriteWeeklyReport":"\u6e05\u8a00\u5e2e\u4f60\u5199\u5468\u62a5","qingyanWriteMonthlyReport":"\u6e05\u8a00\u5e2e\u4f60\u5199\u6708\u62a5","qingyanWrite":"\u6e05\u8a00\u5e2e\u4f60\u5199","thisOpinionIsAsFollows":"\u6b64\u89c2\u70b9\u5982\u4e0b"},"login":{"redirectToQingyanLogin":"\u8df3\u8f6c\u6e05\u8a00\u767b\u5f55","loginNow":"\u7acb\u5373\u767b\u5f55","loginFailedSteps":"\u65e0\u6cd5\u767b\u5f55\uff1f\u8bf7\u6309\u4ee5\u4e0b\u6b65\u9aa4\u64cd\u4f5c\u540e\u91cd\u8bd5","step1":"\u7b2c1\u6b65","step2":"\u7b2c2\u6b65","step3":"\u7b2c3\u6b65","clickExtensionIcon":"\u70b9\u51fb\u53f3\u4e0a\u89d2\u201c\u62d3\u5c55\u7a0b\u5e8f\u56fe\u6807\u201d\uff0c\u627e\u5230\u6e05\u8a00,\u70b9\u51fb\u201c\u667a\u8c31\u6e05\u8a00\u201d\u6d4f\u89c8\u5668\u63d2\u4ef6\u53f3\u8fb9\u7684\u201c\u66f4\u591a\u9009\u9879\u201d","clickReadAndChangeSiteData":"\u70b9\u51fb\u201c\u53ef\u8bfb\u53d6\u548c\u66f4\u6539\u7f51\u7ad9\u6570\u636e\u201d","selectAllowOnAllSites":"\u9009\u62e9\u201c\u5728\u6240\u6709\u7f51\u7ad9\u4e0a\u201d","page":"\u9875\u9762","notLoggedInCheck":"\u7ecf\u68c0\u67e5\uff0c\u60a8\u4ecd\u672a\u767b\u5f55","pleaseLogin":"\u8bf7\u767b\u5f55","thenContinue":"\u540e\u7ee7\u7eed\u64cd\u4f5c","logoutConfirm":"\u60a8\u786e\u5b9a\u8981\u9000\u51fa\u767b\u5f55\u5417\uff1f","user":"\u7528\u6237","loggedIn":"\u5df2\u767b\u5f55"},"updateModal":{"updateNow":"\u7acb\u5373\u66f4\u65b0","learnMore":"\u4e86\u89e3\u66f4\u591a","giveUsGoodReview":"\ud83d\udc4d \u7ed9\u6211\u4eec\u597d\u8bc4","newFeatures":"\u65b0\u529f\u80fd","submitFeedback":"\u63d0\u4ea4\u53cd\u9988","newVersionUpdated":"\u65b0\u7248\u672c\u5df2\u66f4\u65b0\uff0c\u8bf7\u5c3d\u5feb\u5347\u7ea7","forceUpdateContent":"\u60a8\u5b89\u88c5\u7684\u63d2\u4ef6\u7248\u672c\u8fc7\u4f4e\uff0c\u8bf7\u66f4\u65b0\u5230\u6700\u65b0\u7248\u672c\u4ee5\u83b7\u5f97\u66f4\u597d\u7684\u4f53\u9a8c"},"chatWindow":{"pleaseSelectPost":"\u8bf7\u52fe\u9009\u5e16\u5b50","selectPostLimit":"\u4eb2\uff01\u76ee\u524d\u53ea\u652f\u6301\u52fe\u90095\u7bc7\u54e6","taskInProgressTry":"\u6709\u4efb\u52a1\u6267\u884c\u4e2d\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5","exitAiSearchMode":"\u8bf7\u5148\u9000\u51faAI \u641c\u7d22\u6a21\u5f0f\uff01","codeExplanation":"\u4ee3\u7801\u89e3\u91ca","postEmpty":"\u5e16\u5b50\u4e3a\u7a7a","summaryOf":"\u603b\u7ed3\u7b2c","postCount":"\u7bc7\u5e16\u5b50","exitOperationOf":"\u9000\u51fa\u64cd\u4f5c\u7b2c","pleaseStartNewChat":"\u8bf7\u5f00\u542f\u65b0\u5bf9\u8bdd!","webpageProcessing":"\u7f51\u9875\u5904\u7406","contentProcessing":"\u5185\u5bb9\u5904\u7406","taskUnderstanding":"\u4efb\u52a1\u7406\u89e3\u4e2d - \u8bf7\u8010\u5fc3\u7b49\u5f85","searchAnalysisInProgress":"\u641c\u7d22\u5206\u6790\u4e2d","taskCompleted":"\u4efb\u52a1\u7ed3\u675f","taskInProgress":"\u4efb\u52a1\u8fdb\u884c\u4e2d","advancedFilteringResults":"\u70b9\u51fb - \u9ad8\u7ea7\u7b5b\u9009\u7ed3\u679c","imageRecognitionReading":"\u8bc6\u522b\u56fe\u7247\u548c\u9605\u8bfb\u6587\u5b57\u4e2d","resultRefining":"\u7ed3\u679c\u6da6\u8272\u4e2d - \u8bf7\u8010\u5fc3\u7b49\u5f85","generatingDailyReport":"\u62fc\u547d\u751f\u6210\u65e5\u62a5\u4e2d - \u8bf7\u8010\u5fc3\u7b49\u5f85","identifyingKeywords":"\u8bc6\u522b\u95ee\u9898\u5173\u952e\u8bcd\u4e2d","searchingIssues":"\u641c\u7d22\u95ee\u9898\u4e2d","identifyingIssueComments":"\u8bc6\u522b\u95ee\u9898\u8bc4\u8bba\u4e2d","noRelevantInfo":"\u672a\u627e\u5230\u76f8\u5173\u4fe1\u606f - \u6362\u4e0b\u5173\u952e\u5b57","generateShortSummary":"\u8bf7\u5e2e\u6211\u751f\u6210\u7b80\u77ed\u6458\u8981","summarizeFullText":"\u8bf7\u5e2e\u6211\u603b\u7ed3\u5168\u6587","summarizeDocumentContent":"\u5e2e\u6211\u603b\u7ed3\u6587\u6863\u5185\u5bb9","taskTerminated":"\u4efb\u52a1\u5df2\u7ec8\u6b62 - \u8bf7\u91cd\u65b0\u53d1\u9001\u4efb\u52a1","taskNotCompliant":"\u4efb\u52a1\u4e0d\u5408\u89c4"},"userTour":{"welcomeToQingyanPlugin":"\u6b22\u8fce\u4f7f\u7528\u6e05\u8a00\u63d2\u4ef6 \ud83c\udf89","advancedMode":"\u9ad8\u7ea7\u6a21\u5f0f \ud83d\ude80","quickAccess":"\u5feb\u6377\u5165\u53e3","quickAccessDescription":"\u901a\u8fc7\u60ac\u6d6e\u7403\u548c\u5feb\u6377\u5f39\u7a97,\u4e00\u952e\u53ec\u5524\u6e05\u8a00 ","quickAccessIntro":"\u5feb\u6377\u5165\u53e3\u4ecb\u7ecd","writingAssistant":"\u5199\u4f5c\u52a9\u624b \ud83d\udd8c\ufe0f","writingAssistantDescription":"\u5199\u4f5c\u6ca1\u7075\u611f\uff1f\u5199\u4f5c\u52a9\u624b\u6765\u5e2e\u60a8","writingScenarioAssistant":"\u5199\u4f5c\u573a\u666f\u52a9\u624b","newUserTutorialCompleted":"\u65b0\u624b\u6559\u7a0b\u5b8c\u6210 \ud83c\udf89","congratsTutorialCompleted":"\u606d\u559c\u60a8\u5df2\u5b8c\u6210\u65b0\u624b\u6559\u7a0b\uff0c\u73b0\u5728\u5f00\u59cb\u4f53\u9a8c\u5427\uff01\u60f3\u4e86\u89e3\u66f4\u591a\u4fe1\u606f","skip":"\u8df3\u8fc7","generalMode":"\u901a\u7528\u6a21\u5f0f\uff1a","have":"\u62e5\u6709","practicalFeatures":"\u9875\u9762\u603b\u7ed3\u3001\u7f51\u9875\u7ffb\u8bd1\u3001\u9875\u9762\u5bf9\u8bdd\u3001\u622a\u56fe\u63d0\u95ee","andMoreFeatures":"\u7b49\u5b9e\u7528\u529f\u80fd","powerfulFeatures":"AutoGLM\u3001\u7ad9\u5185\u9ad8\u7ea7\u68c0\u7d22","andMorePowerfulFeatures":"\u7b49\u5f3a\u5927\u529f\u80fd\u3002\u70b9\u51fb\u6309\u94ae\uff0c\u4eab\u53d7\u6781\u81f4\u9ad8\u6548","clickHereToViewUserManual":"\u70b9\u51fb\u8fd9\u91cc\u67e5\u770b\u8be6\u7ec6\u7528\u6237\u624b\u518c"},"authorized":{"userAgreementAndPrivacy":"\u7528\u6237\u534f\u8bae\u53ca\u9690\u79c1\u4fdd\u62a4","agreeAndContinue":"\u540c\u610f\u5e76\u7ee7\u7eed","disagree":"\u4e0d\u540c\u610f","readAndAgreeNotice":"\u4e3a\u4e86\u66f4\u597d\u7684\u4fdd\u969c\u60a8\u7684\u5408\u6cd5\u6743\u76ca\uff0c\u8bf7\u60a8\u9605\u8bfb\u5e76\u540c\u610f\u4ee5\u4e0b\u534f\u8bae","advancedModeUserAgreement":"\u300a\u9ad8\u7ea7\u6a21\u5f0f\u7528\u6237\u534f\u8bae\u300b"},"messageDisplay":{"currentPage":"\u5f53\u524d\u9875\u9762","experienceCapabilities":"\u53ef\u4ee5\u4f53\u9a8c\u4ee5\u4e0b\u7684\u80fd\u529b","helloWelcomeChat":"\u4f60\u597d! \u6b22\u8fce\u4e0e\u6211\u804a\u5929\uff5e","currentPageAbilities":"\u5f53\u524d\u7f51\u9875\u60a8\u53ef\u4f53\u9a8c\u4ee5\u4e0b\u80fd\u529b:","helloWelcomeChatAgain":"\u4f60\u597d! \u6b22\u8fce\u4e0e\u6211\u804a\u5929\uff5e","copyResults":"\u590d\u5236\u7ed3\u679c","referencePage":"\u53c2\u8003\u7f51\u9875","contentWaiting":"\u5185\u5bb9\u7b49\u5f85","reading":"\u9605\u8bfb\u4e2d","recognizeImageAndText":"\u8bc6\u522b\u56fe\u7247\u548c\u9605\u8bfb\u6587\u5b57","generating":"\u751f\u6210\u4e2d","resultPolishing":"\u7ed3\u679c\u6da6\u8272","dailyReportPolishing":"\u65e5\u62a5\u6da6\u8272","understanding":"\u7406\u89e3\u4e2d","recognizingKeywords":"\u8bc6\u522b\u95ee\u9898\u5173\u952e\u8bcd","searching":"\u641c\u7d22","relatedIssue":"\u76f8\u5173Issue","relatedIssueComments":"\u76f8\u5173Issue\u8bc4\u8bba","noRelevantInfo":"\u672a\u627e\u5230\u76f8\u5173\u4fe1\u606f - \u6362\u4e0b\u5173\u952e\u5b57","taskCompleted":"\u4efb\u52a1\u7ed3\u675f","generatingAgain":"\u751f\u6210\u4e2d","summaryAnswerBasedOn":"\u603b\u7ed3\u7b54\u6848\uff1a\u57fa\u4e8e","searchSourcesCount":"\u4e2a\u641c\u7d22\u6765\u6e90","websitesCount":"\u4e2a\u7f51\u5740","taskInProgressMessage":"\u73b0\u5728\uff0c\u6839\u636e\u60a8\u7684\u6307\u4ee4\uff0c\u6211\u6b63\u5728\u505a\u5982\u4e0b\u64cd\u4f5c\ud83d\udc47","taskInProgressReady":"\u6839\u636e\u60a8\u7684\u6307\u4ee4\uff0c\u5df2\u7ecf\u505a\u4e86\u5982\u4e0b\u64cd\u4f5c\ud83d\udc47","newChatOpening":"\u5373\u5c06\u4e3a\u4f60\u6253\u5f00\u5168\u65b0\u5bf9\u8bdd","canYouBeMoreDetailed":"\u53ef\u4ee5\u8be6\u7ec6\u4e00\u70b9\u5417\uff1f","canYouBeMoreConcise":"\u53ef\u4ee5\u7cbe\u7b80\u4e00\u70b9\u5417\uff1f","operationHistory":"\u64cd\u4f5c\u5386\u53f2","inProgress":"\u8fdb\u884c\u4e2d"},"floatBall":{"quickPopup":"\u5feb\u6377\u5f39\u7a97","webpageTranslation":"\u7f51\u9875\u7ffb\u8bd1","webpageSummary":"\u7f51\u9875\u603b\u7ed3","pageSummary":"\u9875\u9762\u603b\u7ed3","multiLinkSummary":"\u591a\u94fe\u63a5\u603b\u7ed3","showQuickPopupWithFeatures":"\u663e\u793a\u5305\u542b\u201c\u9875\u9762\u603b\u8ba1\u201d\u3001\u201c\u591a\u94fe\u63a5\u603b\u7ed3\u201d\u3001\u201c\u7f51\u9875\u7ffb\u8bd1\u201d\u3001\u201c\u82f1\u7ffb\u4e2d\u201d\u53ca\u8f93\u5165\u6846\u7684\u5feb\u6377\u5f39\u7a97","translateEntireWebpage":"\u7ffb\u8bd1\u6574\u4e2a\u7f51\u9875","openSidebarSummarizePage":"\u6253\u5f00\u4fa7\u8fb9\u680f\uff0c\u5bf9\u6574\u4e2a\u9875\u9762\u5185\u5bb9\u8fdb\u884c\u603b\u7ed3","selectLinksSummarizeAll":"\u52fe\u9009\u94fe\u63a5\uff0c\u8bfb\u53d6\u6240\u6709\u94fe\u63a5\u5185\u5bb9\u5e76\u603b\u7ed3","pageChatSupportsPDF":"\u9875\u9762\u5bf9\u8bdd\u652f\u6301pdf\u95ee\u7b54\u5566\uff01","closeTranslation":"\u5173\u95ed\u7ffb\u8bd1","englishToChinese":"\u82f1\u7ffb\u4e2d"},"writingEntryModal":{"writeArticle":"\u5199\u6587\u7ae0","comment":"\u8bc4\u8bba","reply":"\u56de\u590d","writeEmail":"\u5199\u90ae\u4ef6","replyEmail":"\u56de\u590d\u90ae\u4ef6","cleverReply":"\u795e\u56de\u590d","shortComment":"\u77ed\u8bc4","writeReview":"\u5199\u8bc4\u8bba(\u5f71\u8bc4|\u4e66\u8bc4|\u4e50\u8bc4|\u8bdd\u9898\u8ba8\u8bba)","writeWeibo":"\u5199\u5fae\u535a","dailyReport":"\u65e5\u62a5","weeklyReport":"\u5468\u62a5","monthlyReport":"\u6708\u62a5","writeAnswer":"\u5199\u56de\u7b54"},"detailPopover":{"membershipVersion":"\u4f1a\u5458\u7248","freeVersion":"\u514d\u8d39\u7248","membership":"\u4f1a\u5458","willBeOn":"\u5c06\u4e8e","alreadyOn":"\u5df2\u4e8e","expire":"\u5230\u671f","academicDaily":"\u5b66\u672f\u65e5\u62a5","eachSummaryPapers":"\u6bcf\u6b21\u603b\u7ed3\u6587\u732e","papers":"\u7bc7","upgradeForExclusiveBenefits":"\u5347\u7ea7\u4eab\u4e13\u5c5e\u7279\u6743"},"greetings":{"morning":[{"line1":"\u65e9\u4e0a\u597d","line2":"\u4eca\u5929\u6709\u4ec0\u4e48\u8ba1\u5212?"},{"line1":"\u65e9\u4e0a\u597d","line2":"\u5e0c\u671b\u4f60\u6709\u7f8e\u597d\u7684\u4e00\u5929\u3002"},{"line1":"\u5de5\u4f5c\u5f88\u6d88\u8017\u7cbe\u529b\u5462","line2":"\u4f46\u6709\u6211\u548c\u4f60\u4e00\u8d77\u3002"},{"line1":"\u65e9\u5b89","line2":"\u8ba9\u6211\u4eec\u4e00\u8d77\u5f00\u542f\u5de5\u4f5c\u3002"},{"line1":"\u65e9\u5b89","line2":"\u6e05\u8a00\u52a9\u624b\u5df2\u7ecf\u5f85\u547d\u3002"}],"afternoon":[{"line1":"\u4e0b\u5348\u597d","line2":"\u8bf7\u95ee\u9700\u8981\u4ec0\u4e48\u5e2e\u52a9\uff1f"},{"line1":"\u4e0b\u5348\u597d","line2":"\u6709\u4ec0\u4e48\u6211\u53ef\u4ee5\u4e3a\u4f60\u505a\u7684\u5417\uff1f"},{"line1":"\u5348\u540e\u7684\u65f6\u5149","line2":"\u4f60\u60f3\u505a\u70b9\u4ec0\u4e48\uff1f"}],"evening":[{"line1":"\u665a\u4e0a\u597d","line2":"\u8bf7\u95ee\u4f60\u6709\u4ec0\u4e48\u9700\u6c42\u5417\uff1f"},{"line1":"\u665a\u4e0a\u597d","line2":"\u6211\u8fd8\u80fd\u5e2e\u4f60\u505a\u4e9b\u4ec0\u4e48\uff1f"},{"line1":"\u591c\u5e55\u964d\u4e34","line2":"\u6211\u4e0e\u4f60\u540c\u5728\u3002"},{"line1":"\u665a\u5b89","line2":"\u597d\u68a6"}],"all":[{"line1":"\u8bf7\u95ee\u6709\u4ec0\u4e48\u8ba1\u5212\u6216\u76ee\u6807","line2":"\u6211\u80fd\u5e2e\u52a9\u4f60\u5b9e\u73b0\uff1f"},{"line1":"\u4eca\u5929\u8981\u505a\u4ec0\u4e48\uff1f","line2":"\u8bf7\u968f\u65f6\u544a\u8bc9\u6211\u3002"},{"line1":"\u5982\u679c\u4f60\u6709\u4efb\u4f55\u7591\u95ee","line2":"\u6211\u6765\u4e3a\u4f60\u89e3\u51b3\u3002"},{"line1":"\u5982\u679c\u4f60\u9700\u8981\u4f11\u606f\u6216\u804a\u5929","line2":"\u6211\u968f\u65f6\u5f85\u547d\u3002"},{"line1":"\u9760\u8c31\u6e05\u8a00","line2":"\u968f\u65f6\u5f85\u547d"}]}}'
        );
      },
      80369: (e, t, n) => {
        "use strict";
        n.d(t, { A: () => r });
        const r = async function (e, t, n, r, o, i, a, s) {
          if (t) {
            let p = !1,
              f = t.match(/action="([^"]*)"/);
            const g = t.match(/argument="([^"]*)"/),
              m = t.match(/instruction="((?:\\"|[^"])*)"/),
              v = t.match(/query="([^"]*)"/),
              y = t.match(/with_screen_info="([^"]*)"/),
              b = t.match(/url="([^"]*)"/),
              w = t.match(/number="([^"]*)"/);
            let _ = f
                ? f[1]
                : (function (e) {
                    return e.includes("go_backward()")
                      ? "Go Backward"
                      : e.includes("go_forward()")
                      ? "Go Forward"
                      : e.includes("refresh()")
                      ? "Refresh"
                      : null;
                  })(t),
              x = t.match(/the\s+'([^']+)' (\w+)/);
            const S = g ? g[1] : i,
              k = m ? m[1].replace(/\\"/g, '"') : null,
              A = v ? v[1] : null,
              C = y ? y[1] : null,
              E = b ? b[1] : null,
              T = w ? w[1] : null;
            let I = r.x + r.width / 2,
              L = r.y + r.height / 2,
              O = "";
            const M = (e) =>
              new Promise((t) => {
                setTimeout(t, e);
              });
            function R(e, t, n) {
              let r =
                arguments.length > 3 && void 0 !== arguments[3]
                  ? arguments[3]
                  : "left";
              if (e) {
                const t = new MouseEvent("mousedown", {
                  bubbles: !0,
                  cancelable: !0,
                  view: window,
                  button: "right" === r ? 2 : 0,
                });
                e.dispatchEvent(t);
                const n = new MouseEvent("mouseup", {
                  bubbles: !0,
                  cancelable: !0,
                  view: window,
                  button: "right" === r ? 2 : 0,
                });
                e.dispatchEvent(n);
                const o = new MouseEvent("click", {
                  bubbles: !0,
                  cancelable: !0,
                  view: window,
                  button: "right" === r ? 2 : 0,
                });
                e.dispatchEvent(o);
              }
            }
            function P(e, t) {
              const n = new KeyboardEvent(
                !(arguments.length > 2 && void 0 !== arguments[2]) ||
                arguments[2]
                  ? "keydown"
                  : "keyup",
                {
                  bubbles: !0,
                  cancelable: !0,
                  key: t,
                  code: "Key".concat(t.toUpperCase()),
                  location: window.KeyboardEvent.DOM_KEY_LOCATION_STANDARD,
                  view: window,
                }
              );
              e.dispatchEvent(n);
            }
            async function N(e, t) {
              e.value = "";
              for (let n = 0; n < t.length; n++) {
                const r = t[n];
                P(e, r, !0),
                  await new Promise((e) => setTimeout(e, 50)),
                  (e.value = e.value + r);
                const o = new InputEvent("input", {
                  bubbles: !0,
                  cancelable: !0,
                  data: r,
                });
                e.dispatchEvent(o),
                  P(e, r, !1),
                  await new Promise((e) => setTimeout(e, 50));
              }
            }
            async function D(e, t, n) {
              P(e, t, !0),
                await new Promise((e) => setTimeout(e, 50)),
                P(e, n, !0),
                await new Promise((e) => setTimeout(e, 50)),
                P(e, n, !1),
                await new Promise((e) => setTimeout(e, 50)),
                P(e, t, !1);
            }
            function q(e, t, n) {
              const r = new MouseEvent("mouseover", {
                bubbles: !0,
                cancelable: !0,
                view: window,
              });
              e.dispatchEvent(r);
            }
            function j(e, t, n) {
              const r = new MouseEvent("mousemove", {
                bubbles: !0,
                cancelable: !0,
                view: window,
              });
              e.dispatchEvent(r);
            }
            function U(e, t, n) {
              const r = new MouseEvent("mouseenter", {
                bubbles: !0,
                cancelable: !0,
                view: window,
              });
              e.dispatchEvent(r);
            }
            const F = (e) => {
              let t = new FocusEvent("focusin", {
                bubbles: !0,
                cancelable: !1,
                type: "focusin",
                composed: !0,
                defaultPrevented: !1,
                detail: 0,
                returnValue: !0,
                view: window,
              });
              e.dispatchEvent(t);
              let n = new PointerEvent("click", {
                bubbles: !0,
                cancelable: !0,
                cancelBubble: !1,
                composed: !0,
                ctrlKey: !1,
                metaKey: !1,
                shiftKey: !1,
                button: 0,
                buttons: 0,
                pointerId: 1,
                pointerType: "mouse",
                view: window,
                which: 1,
              });
              e.dispatchEvent(n);
              const r = new KeyboardEvent("keydown", {
                bubbles: !0,
                cancelable: !0,
                key: "Enter",
                code: "Enter",
                keyCode: 13,
                which: 13,
              });
              e.dispatchEvent(r);
              const o = new KeyboardEvent("keypress", {
                bubbles: !0,
                cancelable: !0,
                key: "Enter",
                code: "Enter",
                keyCode: 13,
                which: 13,
              });
              e.dispatchEvent(o);
              const i = new KeyboardEvent("keyup", {
                bubbles: !0,
                cancelable: !0,
                key: "Enter",
                code: "Enter",
                keyCode: 13,
                which: 13,
              });
              e.dispatchEvent(i);
            };
            function W() {
              let e =
                arguments.length > 0 && void 0 !== arguments[0]
                  ? arguments[0]
                  : 6e3;
              return new Promise((t) => {
                setTimeout(() => {
                  window.history.back(), t();
                }, e);
              });
            }
            function z() {
              let e =
                arguments.length > 0 && void 0 !== arguments[0]
                  ? arguments[0]
                  : 6e3;
              return new Promise((t) => {
                setTimeout(() => {
                  window.history.forward(), t();
                }, e);
              });
            }
            function B() {
              if (!document.getElementById("windowOpenScript")) {
                let e = document.createElement("script");
                e.setAttribute("type", "text/javascript"),
                  e.setAttribute("id", "windowOpenScript"),
                  (e.src = chrome.runtime.getURL("windowOpen.js")),
                  document.body.appendChild(e);
              }
            }
            if ("open_url" === _ && E && "None" !== E)
              (window.location.href = E),
                (O = {
                  operation: "do",
                  action: _,
                  kwargs: {
                    currentTabUrl: e,
                    currentTabTitle: a,
                    currentTabFaviconUrl: s,
                  },
                  open_url: E,
                });
            else if ("Click" === _) {
              let H =
                document.querySelector(
                  "[data-backend-node-id='".concat(n, "']")
                ) ||
                document.querySelector("[data-label-id='".concat(n, "']")) ||
                document.querySelector(
                  "[data-bbox='"
                    .concat(r.x, ", ")
                    .concat(r.y, ", ")
                    .concat(r.width, ", ")
                    .concat(r.height, "']")
                ) ||
                document.querySelector(
                  "[data-backend-node-id='".concat(n, "']")
                );
              if (H) {
                if (
                  ((p = [
                    "\u53d1\u5e03",
                    "\u53d1\u9001",
                    "\u4fdd\u5b58",
                    "\u53bb\u652f\u4ed8",
                    "\u8bc4\u8bba",
                    "\u786e\u5b9a",
                    "\u63d0\u4ea4",
                    "\u8f6c\u53d1",
                    "\u66f4\u65b0\u8bbe\u7f6e",
                    "\u9000\u51fa",
                    "\u6ce8\u9500",
                    "Send",
                  ].some((e) =>
                    "\u53d1\u5e03" === e
                      ? t.includes("\u53d1\u5e03") &&
                        !t.includes("\u53d1\u5e03\u8bbe\u7f6e") &&
                        !t.includes("\u6700\u65b0\u53d1\u5e03")
                      : "\u8bc4\u8bba" === e
                      ? t.includes("\u8bc4\u8bba") &&
                        !t.includes("\u4e0d\u5141\u8bb8\u8bc4\u8bba") &&
                        !t.includes("\u6761\u8bc4\u8bba") &&
                        !t.includes("\u8bc4\u8bba\u6570")
                      : t.includes(e)
                  )),
                  p && !window.location.href.includes("xft.cmbchina.com"))
                ) {
                  if (
                    !confirm(
                      "\u786e\u5b9a\u9700\u8981\u6267\u884c\u8be5\u64cd\u4f5c\u5417\uff1f"
                    )
                  )
                    return { operation: "do", action: "exit" };
                }
                await B(),
                  await document.addEventListener(
                    "click",
                    function (e) {
                      let t = e.target.closest("a");
                      if (!t || !t.href) return;
                      const n = [
                        /^#/,
                        /^javascript:/,
                        /^javascript:void\(0\);?$/,
                        /#$/,
                      ];
                      var r;
                      (t.href !== window.location.origin + "/" ||
                        t.hasAttribute("target")) &&
                        ((r = t.href),
                        n.some((e) => e.test(r)) ||
                          ("_blank" === t.target || "_black" === t.target
                            ? (e.preventDefault(),
                              (t.target = "_self"),
                              (window.location.href = t.href))
                            : t.hasAttribute("target") ||
                              (e.preventDefault(),
                              (t.target = "_self"),
                              (window.location.href = t.href))));
                    },
                    !0
                  ),
                  H.style.setProperty("border", "4px solid green", "important"),
                  await M(100),
                  (H.style.border = ""),
                  await R(H, I, L, "left");
              }
              O = {
                operation: "do",
                action: _,
                kwargs: {
                  instruction: k,
                  currentTabUrl: e,
                  currentTabTitle: a,
                  currentTabFaviconUrl: s,
                },
                bbox: r,
                elementTagName: x ? x[0] : H.tagName.toLowerCase(),
              };
            } else if ("Right Click" === _) {
              let $ =
                document.querySelector(
                  "[data-backend-node-id='".concat(n, "']")
                ) ||
                document.querySelector("[data-label-id='".concat(n, "']")) ||
                document.querySelector(
                  "[data-bbox='".concat((r.x, r.y, r.width, r.height), "']")
                ) ||
                document.querySelector(
                  "[data-backend-node-id='".concat(n, "']")
                );
              $ &&
                ($.style.setProperty("border", "4px solid green", "important"),
                await M(100),
                ($.style.border = ""),
                await $.dispatchEvent(
                  new MouseEvent("contextmenu", {
                    bubbles: !0,
                    cancelable: !0,
                    view: window,
                  })
                )),
                (O = {
                  operation: "do",
                  action: _,
                  kwargs: {
                    instruction: k,
                    currentTabUrl: e,
                    currentTabTitle: a,
                    currentTabFaviconUrl: s,
                  },
                  bbox: r,
                  elementTagName: x ? x[0] : $.tagName.toLowerCase(),
                });
            } else if ("Type" === _ || "Call_Type" === _) {
              let G =
                  document.querySelector(
                    "[data-backend-node-id='".concat(n, "']")
                  ) ||
                  document.querySelector("[data-label-id='".concat(n, "']")) ||
                  document.querySelector(
                    "[data-bbox='".concat((r.x, r.y, r.width, r.height), "']")
                  ) ||
                  document.querySelector(
                    "[data-backend-node-id='".concat(n, "']")
                  ),
                V = new FocusEvent("focusin", {
                  bubbles: !0,
                  cancelable: !1,
                  type: "focusin",
                  composed: !0,
                  defaultPrevented: !1,
                  detail: 0,
                  returnValue: !0,
                  view: window,
                });
              if (
                (G &&
                  (localStorage.setItem(
                    "webact-current-type-element",
                    JSON.stringify({ element_id: n, element_bbox: r })
                  ),
                  G.style.setProperty("border", "4px solid green", "important"),
                  await M(100),
                  (G.style.border = "")),
                G && "input" !== G.tagName.toLowerCase())
              ) {
                for (var l = 0; l < G.childNodes.length; l++)
                  if (
                    G.childNodes[l].nodeType === Node.ELEMENT_NODE &&
                    "input" === G.childNodes[l].tagName.toLowerCase()
                  ) {
                    G = G.childNodes[l];
                    break;
                  }
                "input" === G.parentElement.tagName.toLowerCase() &&
                  (G = G.parentElement);
              }
              if (G && "iframe" === G.tagName.toLowerCase()) {
                var c = G,
                  u = c.contentDocument || c.contentWindow.document;
                if (!u) return;
                let Z = "//html/body",
                  J =
                    u.evaluate(
                      Z,
                      u,
                      null,
                      XPathResult.FIRST_ORDERED_NODE_TYPE,
                      null
                    ).singleNodeValue ||
                    u.querySelector("body[contenteditable='true']") ||
                    u.elementFromPoint(r.x, r.y);
                return void (
                  J &&
                  ("input" === J.tagName.toLowerCase() ||
                    "textarea" === J.tagName.toLowerCase() ||
                    J.classList.contains("cke_editable") ||
                    J.isContentEditable) &&
                  (await M(500),
                  J.focus(),
                  window.location.href.includes("mail.163.com") ||
                    (J.innerHTML = ""),
                  await K(u, J, S))
                );
              }
              async function K(e, t, n) {
                function r(e, n, r) {
                  const o = new KeyboardEvent(e, {
                    bubbles: !0,
                    cancelable: !0,
                    key: n,
                    code: r,
                    charCode: n.charCodeAt(0),
                    keyCode: n.charCodeAt(0),
                  });
                  t.dispatchEvent(o);
                }
                if (
                  (t.focus(), window.location.href.includes("mail.163.com"))
                ) {
                  t.focus();
                  const n = S.replace(/\\n/g, "\n");
                  e.execCommand("insertText", !1, n);
                } else {
                  let o = 0;
                  for (; o < n.length; ) {
                    const i = n[o],
                      a = "Key".concat(i.toUpperCase());
                    r("keydown", i, a),
                      r("keypress", i, a),
                      e.execCommand("insertText", !1, i);
                    const s = new Event("input", { bubbles: !0 });
                    t.dispatchEvent(s),
                      r("keyup", i, a),
                      await M(100),
                      t.focus();
                    const l = e.getSelection(),
                      c = e.createRange();
                    c.selectNodeContents(t),
                      c.collapse(!1),
                      l.removeAllRanges(),
                      l.addRange(c),
                      o++;
                  }
                }
              }
              if (
                G &&
                (G.isContentEditable ||
                  "paragraph" === G.getAttribute("data-morpho-type")) &&
                !window.location.href.includes(".zhihu.com")
              )
                if (
                  window.location.href.includes(".feishu.cn/wiki/") &&
                  !G.closest("h1") &&
                  "h1" !== G.tagName.toLowerCase()
                ) {
                  async function X(e, t, n) {
                    t.focus();
                    const r = new Event("input", { bubbles: !0 });
                    t.dispatchEvent(r), t.focus(), t.dispatchEvent(V);
                    const o = e.getSelection(),
                      i = e.createRange();
                    i.selectNodeContents(t),
                      i.collapse(!1),
                      o.removeAllRanges(),
                      o.addRange(i),
                      e.execCommand("insertHTML", !1, n);
                  }
                  async function ee(e, t) {
                    t.focus(),
                      t.dispatchEvent(V),
                      e.execCommand("insertParagraph", !1, null);
                    const n = new Event("input", { bubbles: !0 });
                    t.dispatchEvent(n);
                  }
                  const te = async (e, t) => {
                    const n = t.split("\n");
                    let r =
                      document.querySelectorAll(
                        'div[data-block-id][class*="docx-text-block"]'
                      ) &&
                      document.querySelectorAll(
                        'div[data-block-id][class*="docx-text-block"]'
                      ).length > 0
                        ? document.querySelectorAll(
                            'div[data-block-id][class*="docx-text-block"]'
                          )[
                            document.querySelectorAll(
                              'div[data-block-id][class*="docx-text-block"]'
                            ).length - 1
                          ]
                        : null;
                    for (const [o, i] of n.entries()) {
                      if (!r) return;
                      r.focus(),
                        await X(document, r, i),
                        o < n.length - 1 && (await ee(document, r)),
                        (r =
                          document.querySelectorAll(
                            'div[data-block-id][class*="docx-text-block"]'
                          ) &&
                          document.querySelectorAll(
                            'div[data-block-id][class*="docx-text-block"]'
                          ).length > 0
                            ? document.querySelectorAll(
                                'div[data-block-id][class*="docx-text-block"]'
                              )[
                                document.querySelectorAll(
                                  'div[data-block-id][class*="docx-text-block"]'
                                ).length - 1
                              ]
                            : null);
                    }
                  };
                  G.focus(), G.dispatchEvent(V);
                  const ne = S.replace(/\\n/g, "\n");
                  te(G, ne);
                } else if ("paragraph" === G.getAttribute("data-morpho-type")) {
                  async function re(e, t) {
                    for (let n of e) {
                      let e = document.createTextNode(n);
                      t.appendChild(e);
                      const r = new Event("input", {
                        bubbles: !0,
                        cancelable: !0,
                      });
                      t.dispatchEvent(r);
                      const o = new Event("change", {
                        bubbles: !0,
                        cancelable: !0,
                      });
                      t.dispatchEvent(o), await M(100);
                    }
                  }
                  function oe() {
                    const e = G;
                    if (!e) return;
                    e.focus();
                    const t = window.getSelection(),
                      n = document.createRange();
                    n.selectNodeContents(e), t.removeAllRanges(), t.addRange(n);
                    const r = new KeyboardEvent("keydown", {
                      bubbles: !0,
                      cancelBubble: !1,
                      cancelable: !0,
                      defaultPrevented: !0,
                      key: "Delete",
                      code: "Delete",
                      keyCode: 46,
                      which: 46,
                      view: window,
                    });
                    e.dispatchEvent(r);
                    const o = new KeyboardEvent("keydown", {
                      bubbles: !0,
                      cancelBubble: !1,
                      cancelable: !0,
                      defaultPrevented: !0,
                      key: "Backspace",
                      code: "Backspace",
                      keyCode: 8,
                      which: 8,
                      view: window,
                    });
                    e.dispatchEvent(o);
                    const i = new Event("input", { bubbles: !0 });
                    e.dispatchEvent(i);
                  }
                  G.focus(), oe(), re(S, G);
                } else if (
                  window.location.href.includes("mail.yahoo.") ||
                  window.location.href.includes("app.slack.com") ||
                  window.location.href.includes(".feishu.cn/") ||
                  window.location.href.includes(".bilibili.com")
                )
                  if (
                    window.location.href.includes(".bilibili.com") &&
                    "editor" === G.getAttribute("id")
                  ) {
                    async function ie(e, t) {
                      e.focus();
                      for (let n of t) {
                        const t = n.charCodeAt(0),
                          r = {
                            key: n,
                            code: "Key" + n.toUpperCase(),
                            keyCode: t,
                            which: t,
                            charCode: t,
                            bubbles: !0,
                            cancelable: !0,
                          };
                        let o = new KeyboardEvent("keydown", r);
                        e.dispatchEvent(o);
                        let i = new KeyboardEvent("keypress", r);
                        e.dispatchEvent(i);
                        const a = new Event("input", { bubbles: !0 });
                        e.dispatchEvent(a);
                        let s = new KeyboardEvent("keyup", r);
                        e.dispatchEvent(s), await M(50);
                      }
                    }
                    G.focus(), await ie(G, S);
                  } else
                    G.focus(),
                      G.dispatchEvent(V),
                      document.execCommand("insertHTML", !1, S),
                      document.querySelector(
                        "div[class*='render-unit-wrapper']"
                      ) &&
                        document
                          .querySelector("div[class*='render-unit-wrapper']")
                          .click();
                else {
                  const ae =
                    G &&
                    G.isContentEditable &&
                    G.classList.contains("public-DraftEditor-content") &&
                    window.location.href.includes(".douban.com")
                      ? document.querySelector(
                          "div[class*='public-DraftStyleDefault-block']"
                        )
                      : G;
                  ae.innerHTML = "";
                  const se = S.replace(/\\n/g, "\n");
                  async function le(e, t) {
                    for (let n of e) {
                      if ("\n" === n)
                        t.appendChild(document.createElement("br"));
                      else {
                        let e = document.createTextNode(n);
                        t.appendChild(e);
                      }
                      const e = new Event("input", {
                        bubbles: !0,
                        cancelable: !0,
                      });
                      t.dispatchEvent(e);
                      const r = new Event("change", {
                        bubbles: !0,
                        cancelable: !0,
                      });
                      t.dispatchEvent(r), await M(100);
                    }
                  }
                  ae.focus(),
                    ae.closest("div[class='edui-container']") &&
                      ae
                        .closest("div[class='edui-container']")
                        .querySelector("div[class='tb_poster_placeholder']") &&
                      "block" ===
                        ae
                          .closest("div[class='edui-container']")
                          .querySelector("div[class='tb_poster_placeholder']")
                          .style.display &&
                      (ae
                        .closest("div[class='edui-container']")
                        .querySelector(
                          "div[class='tb_poster_placeholder']"
                        ).style.display = "none"),
                    await le(se, ae);
                }
              if (
                G &&
                ("input" === G.tagName.toLowerCase() ||
                  "textarea" === G.tagName.toLowerCase())
              ) {
                await M(500),
                  G.focus(),
                  G.dispatchEvent(V),
                  !window.location.href.includes("cqvip.com") ||
                    ("\u5f00\u59cb\u65e5\u671f" !== G.placeholder &&
                      "\u7ed3\u675f\u65e5\u671f" !== G.placeholder) ||
                    (G.click(), await M(500));
                const ce = S.replace(/\\n/g, "\n");
                if (
                  ((G.value = ce),
                  G.dispatchEvent(new Event("input", { bubbles: !0 })),
                  G.dispatchEvent(new Event("change", { bubbles: !0 })),
                  G.dispatchEvent(new Event("blur", { bubbles: !0 })),
                  G.hasAttribute("id") &&
                    document.querySelector("div[id='".concat(G.id, "_tip']")) &&
                    (document.querySelector(
                      "div[id='".concat(G.id, "_tip']")
                    ).style.display = "none"),
                  "number" === G.getAttribute("type") &&
                    "start-year" === G.getAttribute("name") &&
                    window.location.href.includes("pubmed.ncbi.nlm.nih.gov") &&
                    G.closest("div[id*='datepicker']"))
                ) {
                  let ue = G.closest("div[id*='datepicker']").querySelector(
                    "button[type*='submit']"
                  );
                  ue && ue.disabled && ue.removeAttribute("disabled");
                }
                if (
                  window.location.href.includes("cqvip.com") &&
                  ("\u5f00\u59cb\u65e5\u671f" === G.placeholder ||
                    "\u7ed3\u675f\u65e5\u671f" === G.placeholder)
                ) {
                  if (
                    Array.from(
                      document.querySelectorAll("input.el-range-input")
                    ).every((e) => "" !== e.value.trim())
                  ) {
                    const de = document.createElement("div");
                    document.body.appendChild(de),
                      de.addEventListener("mouseup", function (e) {
                        document.body.removeChild(de);
                      });
                    const he = new MouseEvent("mousedown", {
                      bubbles: !0,
                      cancelable: !0,
                      view: window,
                      button: 0,
                    });
                    de.dispatchEvent(he);
                    const pe = new MouseEvent("mouseup", {
                      bubbles: !0,
                      cancelable: !0,
                      view: window,
                      button: 0,
                    });
                    de.dispatchEvent(pe);
                  }
                }
              }
              function Y() {
                const e =
                  G &&
                  G.isContentEditable &&
                  G.classList.contains("public-DraftEditor-content")
                    ? G
                    : document.querySelector(".public-DraftEditor-content");
                if (!e) return;
                e.focus();
                const t = window.getSelection(),
                  n = document.createRange();
                n.selectNodeContents(e), t.removeAllRanges(), t.addRange(n);
                const r = new KeyboardEvent("keydown", {
                  bubbles: !0,
                  cancelBubble: !1,
                  cancelable: !0,
                  defaultPrevented: !0,
                  key: "Delete",
                  code: "Delete",
                  keyCode: 46,
                  which: 46,
                  view: window,
                });
                e.dispatchEvent(r);
                const o = new KeyboardEvent("keydown", {
                  bubbles: !0,
                  cancelBubble: !1,
                  cancelable: !0,
                  defaultPrevented: !0,
                  key: "Backspace",
                  code: "Backspace",
                  keyCode: 8,
                  which: 8,
                  view: window,
                });
                e.dispatchEvent(o);
                const i = new Event("input", { bubbles: !0 });
                e.dispatchEvent(i);
              }
              async function Q(e) {
                const t =
                  G &&
                  G.isContentEditable &&
                  G.classList.contains("public-DraftEditor-content")
                    ? G
                    : document.querySelector(
                        "div[class*='public-DraftEditor-content']"
                      );
                if (!t) return;
                const n = S.replace(/\\n/g, "\n");
                t.focus(), document.execCommand("insertHTML", !1, n);
              }
              G &&
                (G.classList.contains("public-DraftStyleDefault-block") ||
                  G.classList.contains("public-DraftEditor-content") ||
                  G.classList.contains("DraftEditor-editorContainer")) &&
                "div" === G.tagName.toLowerCase() &&
                (Y(), Q()),
                (O = {
                  operation: "do",
                  action: _,
                  kwargs: {
                    instruction: k,
                    currentTabUrl: e,
                    currentTabTitle: a,
                    currentTabFaviconUrl: s,
                    argument: S,
                  },
                  bbox: r,
                });
            } else if ("Search" === _) {
              let fe =
                document.querySelector(
                  "[data-backend-node-id='".concat(n, "']")
                ) ||
                document.querySelector("[data-label-id='".concat(n, "']")) ||
                document.querySelector(
                  "[data-bbox='".concat((r.x, r.y, r.width, r.height), "']")
                ) ||
                document.querySelector(
                  "[data-backend-node-id='".concat(n, "']")
                );
              if (fe) {
                fe.style.setProperty("border", "4px solid green", "important"),
                  await M(100),
                  (fe.style.border = "");
                let ge = fe.closest("form"),
                  me = fe.closest("div[class*='form-field']");
                var d =
                    (ge && ge.querySelector('button[type="submit"]')) ||
                    (me && me.querySelector('button[type="submit"]')),
                  h = ge && ge.querySelector('input[type="submit"]');
                if ((await B(), me))
                  (fe.value = S), await M(500), await R(d, 0, 0, "left");
                else if (ge && ge.checkValidity() && d && !d.disabled)
                  (fe.value = S),
                    (ge.target = "_self"),
                    await M(500),
                    window.location.href.includes("tieba.baidu.com")
                      ? d.click()
                      : ge.submit();
                else if (ge && ge.checkValidity() && h && !h.disabled)
                  (fe.value = S),
                    (ge.target = "_self"),
                    await M(500),
                    h.click();
                else {
                  await D(fe, "Meta", "A"),
                    await P(fe, "Backspace"),
                    await N(fe, S),
                    await F(fe);
                  const ve =
                    /^https?:\/\/((\d{1,3}\.){3}\d{1,3})(:\d+)?(\/\S*)?$/;
                  (window.location.href.includes(".baidu.com") ||
                    window.location.href.includes("x.com") ||
                    window.location.href.includes("wolframalpha.com") ||
                    window.location.href.includes(".investing.com") ||
                    ve.test(window.location.href)) &&
                    ge &&
                    ge.checkValidity() &&
                    (window.location.href.includes("tieba.baidu.com")
                      ? (window.location.href =
                          "https://tieba.baidu.com/f?ie=utf-8&kw=".concat(
                            encodeURIComponent(S),
                            "&fr=search"
                          ))
                      : window.location.href.includes("x.com")
                      ? (window.location.href =
                          "https://x.com/search?q=".concat(
                            encodeURIComponent(S)
                          ))
                      : ge.submit()),
                    window.location.href.includes("https://arxiv.org/") &&
                      ge &&
                      ge.checkValidity() &&
                      ge.submit(),
                    (window.location.href.includes("https://www.weibo.com") ||
                      window.location.href.includes("https://weibo.com") ||
                      window.location.href.includes("https://s.weibo.com")) &&
                      S &&
                      (window.location.href =
                        "https://s.weibo.com/weibo?q=".concat(
                          encodeURIComponent(S)
                        )),
                    window.location.href.includes("github.com") &&
                      S &&
                      (fe && fe.id && "repository-input" === fe.id
                        ? (fe.value = S)
                        : (window.location.href =
                            "https://github.com/search?q=".concat(
                              encodeURIComponent(S)
                            ))),
                    window.location.href.includes(".bilibili.com") &&
                      fe.closest("form[id='nav-searchform']") &&
                      (window.location.href =
                        "https://search.bilibili.com/all?keyword=".concat(
                          encodeURIComponent(S)
                        ));
                }
              }
              O = {
                operation: "do",
                action: _,
                kwargs: {
                  instruction: k,
                  currentTabUrl: e,
                  currentTabTitle: a,
                  currentTabFaviconUrl: s,
                  argument: S,
                },
                bbox: r,
              };
            } else if ("Hover" === _) {
              let ye =
                document.querySelector(
                  "[data-backend-node-id='".concat(n, "']")
                ) ||
                document.querySelector("[data-label-id='".concat(n, "']")) ||
                document.querySelector(
                  "[data-bbox='".concat((r.x, r.y, r.width, r.height), "']")
                ) ||
                document.querySelector(
                  "[data-backend-node-id='".concat(n, "']")
                );
              ye &&
                (ye.style.setProperty("border", "4px solid green", "important"),
                await M(100),
                (ye.style.border = ""),
                await q(ye),
                await j(ye),
                await U(ye)),
                (O = {
                  operation: "do",
                  action: _,
                  kwargs: {
                    instruction: k,
                    currentTabUrl: e,
                    currentTabTitle: a,
                    currentTabFaviconUrl: s,
                  },
                  bbox: r,
                  elementTagName: x ? x[0] : ye.tagName.toLowerCase(),
                });
            } else if ("Scroll Down" === _) {
              const be = 10,
                we = document.documentElement,
                _e = document.body,
                xe = (e) => {
                  "hidden" === window.getComputedStyle(e).overflow &&
                    (e.style.overflow = "");
                };
              xe(we), xe(_e);
              let Se = document.querySelector("#noteContainer"),
                ke = document.querySelector("div[id='billFormWrapper']"),
                Ae = document.querySelector("div[id=':3']");
              const Ce = function () {
                  let e =
                      arguments.length > 0 && void 0 !== arguments[0]
                        ? arguments[0]
                        : 3,
                    t = document.documentElement;
                  if (Se) {
                    let n = Se.querySelector(".note-scroller");
                    (t = n), xe(n);
                    const r = (2 * n.getBoundingClientRect().height) / e;
                    n.scrollBy(0, r);
                  } else if (ke) {
                    t = ke;
                    const n = (2 * ke.getBoundingClientRect().height) / e;
                    ke.scrollBy(0, n);
                  } else if (Ae) {
                    t = Ae;
                    const n = (2 * Ae.getBoundingClientRect().height) / e;
                    Ae.scrollBy(0, n);
                  } else {
                    const t = (2 * o.viewport_height) / e;
                    window.scrollBy(0, t);
                  }
                  return parseInt(t.dataset.glm_scrollTop) >= t.scrollTop
                    ? (delete t.dataset.glm_scrollTop, !0)
                    : ((t.dataset.glm_scrollTop = t.scrollTop), !1);
                },
                Ee = (e) => new Promise((t) => setTimeout(t, e)),
                Te = parseInt(T) || 1;
              if ("max" === T)
                for (let Ie = 0; Ie < be; Ie++) {
                  if (Ce(1)) break;
                  await Ee(1e3);
                }
              else for (let Le = 0; Le < Te; Le++) Ce();
              O = {
                operation: "do",
                action: _,
                kwargs: {
                  currentTabUrl: e,
                  currentTabTitle: a,
                  currentTabFaviconUrl: s,
                },
              };
            } else if ("Scroll Up" === _) {
              const Oe = document.documentElement,
                Me = document.body,
                Re = (e) => {
                  "hidden" === window.getComputedStyle(e).overflow &&
                    (e.style.overflow = "");
                };
              Re(Oe), Re(Me);
              let Pe = document.querySelector("#noteContainer"),
                Ne = document.querySelector("div[id='billFormWrapper']"),
                De = document.querySelector("div[@id=':3']");
              if (Pe) {
                let qe = Pe.querySelector(".note-scroller");
                Re(qe);
                const je = (2 * qe.getBoundingClientRect().height) / 3;
                qe.scrollBy(0, -je);
              } else if (Ne) {
                const Ue = (2 * Ne.getBoundingClientRect().height) / 3;
                Ne.scrollBy(0, -Ue);
              } else if (De) {
                const Fe = (2 * De.getBoundingClientRect().height) / 3;
                De.scrollBy(0, -Fe);
              } else window.scrollBy(0, (-2 * o.viewport_height) / 3);
              O = { operation: "do", action: _ };
            } else if ("Press Enter" === _) {
              let We = new KeyboardEvent("keydown", {
                  key: "Enter",
                  code: "Enter",
                  keyCode: 13,
                  which: 13,
                  bubbles: !0,
                  cancelable: !0,
                }),
                ze = new KeyboardEvent("keyup", {
                  key: "Enter",
                  code: "Enter",
                  keyCode: 13,
                  which: 13,
                  bubbles: !0,
                  cancelable: !0,
                }),
                Be =
                  JSON.parse(
                    localStorage.getItem("webact-current-type-element")
                  ) || "{}";
              if (Be) {
                let He =
                  (await document.querySelector(
                    "[data-label-id='".concat(Be.element_id, "']")
                  )) ||
                  document.querySelector(
                    "[data-bbox='".concat(
                      (Be.element_bbox.x,
                      Be.element_bbox.y,
                      Be.element_bbox.width,
                      Be.element_bbox.height),
                      "']"
                    )
                  ) ||
                  document.querySelector(
                    "[data-backend-node-id='".concat(Be.element_id, "']")
                  );
                He &&
                  (await He.focus(),
                  await He.dispatchEvent(We),
                  await He.dispatchEvent(ze),
                  await localStorage.removeItem("webact-current-type-element"));
              }
              O = {
                operation: "do",
                action: _,
                kwargs: {
                  instruction: k,
                  currentTabUrl: e,
                  currentTabTitle: a,
                  currentTabFaviconUrl: s,
                },
              };
            } else if ("Select Dropdown Option" === _) {
              let $e =
                document.querySelector(
                  "[data-backend-node-id='".concat(n, "']")
                ) ||
                document.querySelector("[data-label-id='".concat(n, "']")) ||
                document.querySelector(
                  "[data-bbox='".concat((r.x, r.y, r.width, r.height), "']")
                ) ||
                document.querySelector(
                  "[data-backend-node-id='".concat(n, "']")
                );
              if ($e)
                if (
                  ($e.style.setProperty(
                    "border",
                    "4px solid green",
                    "important"
                  ),
                  await M(100),
                  ($e.style.border = ""),
                  "select" === $e.tagName.toLowerCase())
                ) {
                  let Ge = !1;
                  for (let Ve of $e.options)
                    if (Ve.text === S || Ve.value === S) {
                      ($e.value = Ve.value),
                        (Ve.selected = !0),
                        $e.dispatchEvent(new Event("change", { bubbles: !0 })),
                        (Ge = !0);
                      break;
                    }
                } else if (
                  "input" === $e.tagName.toLowerCase() &&
                  "radio" === $e.type
                ) {
                  let Ke = document.getElementsByName($e.name),
                    Ye = !1;
                  for (let Qe of Ke)
                    if (Qe.value === S || Qe.id === S) {
                      (Qe.checked = !0),
                        Qe.dispatchEvent(new Event("change", { bubbles: !0 })),
                        (Ye = !0);
                      break;
                    }
                } else
                  "input" === $e.tagName.toLowerCase() &&
                    "checkbox" === $e.type &&
                    ("true" === S.toLowerCase() || "1" === S
                      ? ($e.checked = !0)
                      : ("false" !== S.toLowerCase() && "0" !== S) ||
                        ($e.checked = !1),
                    $e.dispatchEvent(new Event("change", { bubbles: !0 })));
              O = {
                operation: "do",
                action: "Select Dropdown Option",
                kwargs: {
                  instruction: k,
                  currentTabUrl: e,
                  currentTabTitle: a,
                  currentTabFaviconUrl: s,
                },
              };
            } else if ("Wait" === _)
              await M(5e3),
                (O = {
                  operation: "do",
                  action: "Wait",
                  kwargs: {
                    currentTabUrl: e,
                    currentTabTitle: a,
                    currentTabFaviconUrl: s,
                  },
                });
            else if ("Go Backward" === _)
              await W(),
                (O = {
                  operation: "do",
                  action: "Go Backward",
                  kwargs: {
                    currentTabUrl: e,
                    currentTabTitle: a,
                    currentTabFaviconUrl: s,
                  },
                });
            else if ("Go Forward" === _)
              await z(),
                (O = {
                  operation: "do",
                  action: "Go Forward",
                  kwargs: {
                    currentTabUrl: e,
                    currentTabTitle: a,
                    currentTabFaviconUrl: s,
                  },
                });
            else if ("Refresh" === _)
              await M(2e3),
                await window.location.reload(),
                await M(2e3),
                (O = {
                  operation: "do",
                  action: "Refresh",
                  kwargs: {
                    currentTabUrl: e,
                    currentTabTitle: a,
                    currentTabFaviconUrl: s,
                  },
                });
            else if ("Call_API" === _)
              O = {
                operation: "do",
                action: "Call API",
                kwargs: {
                  argument: A,
                  with_screen_info: C,
                  instruction: i,
                  currentTabUrl: e,
                  currentTabTitle: a,
                  currentTabFaviconUrl: s,
                },
              };
            else {
              if ("Quote" !== _)
                throw ((O = ""), new Error("Unsupported action: ".concat(_)));
              await M(500),
                (O = {
                  operation: "do",
                  action: "Quote",
                  kwargs: {
                    query: A,
                    with_screen_info: C,
                    currentTabUrl: e,
                    currentTabTitle: a,
                    currentTabFaviconUrl: s,
                  },
                });
            }
            return O;
          }
        };
      },
      82284: (e, t, n) => {
        "use strict";
        function r(e) {
          return (
            (r =
              "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
                ? function (e) {
                    return typeof e;
                  }
                : function (e) {
                    return e &&
                      "function" == typeof Symbol &&
                      e.constructor === Symbol &&
                      e !== Symbol.prototype
                      ? "symbol"
                      : typeof e;
                  }),
            r(e)
          );
        }
        n.d(t, { A: () => r });
      },
      87882: (e, t, n) => {
        "use strict";
        n.a(e, async (e, r) => {
          try {
            n.d(t, {
              HY: () => v,
              Ms: () => y,
              WD: () => b,
              ob: () => w,
              w1: () => m,
            });
            var o = n(89379),
              i = n(5821),
              a = n(80369),
              s = n(2689),
              l = n(71118),
              c = n(35388),
              u = n(88567),
              d = n(13676),
              h = n(23718),
              p = n(47041),
              f = e([l, u, h]),
              g = f.then ? (await f)() : f;
            (l = g[0]), (u = g[1]), (h = g[2]);
            const m = async function (e) {
                let t =
                    arguments.length > 1 && void 0 !== arguments[1]
                      ? arguments[1]
                      : 3,
                  n =
                    arguments.length > 2 && void 0 !== arguments[2]
                      ? arguments[2]
                      : null;
                return (
                  (n = n || (0, s.L)("getCurrentTab").at(-1).id),
                  new Promise((r, o) => {
                    const a = (t) => {
                      chrome.tabs.captureVisibleTab(
                        null,
                        { format: "png" },
                        (s) => {
                          chrome.tabs.get(n, async (l) => {
                            if (chrome.runtime.lastError)
                              return t > 0
                                ? void a(t - 1)
                                : o(chrome.runtime.lastError);
                            if (!l)
                              return t > 0
                                ? void a(t - 1)
                                : o(new Error("No active tabs found"));
                            const c = l,
                              u = c.url,
                              d = c.title,
                              h = c.favIconUrl;
                            if (!u || u.startsWith("devtools://"))
                              return t > 0
                                ? void a(t - 1)
                                : o(new Error("Cannot access devtools URL"));
                            chrome.scripting.executeScript(
                              { target: { tabId: n }, func: i.A },
                              (n) => {
                                if (n && n[0] && n[0].result) {
                                  const {
                                    html_text: t,
                                    viewport_size: o,
                                    image_list: i,
                                    note_container_html: a,
                                  } = n[0].result;
                                  r({
                                    status: "success",
                                    data: {
                                      instruction: e,
                                      html_text: t,
                                      image: s,
                                      url: u,
                                      viewport_size: o,
                                      image_list: i,
                                      note_container_html: a,
                                      title: d,
                                      favicon: h,
                                    },
                                  });
                                } else
                                  t > 0
                                    ? a(t - 1)
                                    : (r({
                                        status: "failure",
                                        data: "getHtmlInfo Request Failed to execute script.",
                                      }),
                                      o(
                                        new Error(
                                          "getHtmlInfo Request Failed after retries"
                                        )
                                      ));
                              }
                            );
                          });
                        }
                      );
                    };
                    a(t);
                  })
                );
              },
              v = async function (e, t, n, r, o) {
                let i =
                  arguments.length > 5 && void 0 !== arguments[5]
                    ? arguments[5]
                    : null;
                return (
                  (i = i || (0, s.L)("getCurrentTab").at(-1).id),
                  new Promise((s, l) => {
                    chrome.tabs.get(i, (c) => {
                      if (chrome.runtime.lastError)
                        return l(chrome.runtime.lastError);
                      if (!c) return l(new Error("No active tabs found"));
                      const u = c,
                        d = u.url,
                        h = u.title,
                        p = u.favIconUrl;
                      if (!d || d.startsWith("devtools://"))
                        return l(new Error("Cannot access devtools URL"));
                      chrome.scripting.executeScript(
                        {
                          target: { tabId: i },
                          func: a.A,
                          args: p
                            ? [d, e, t, n, r, o, h, p]
                            : [d, e, t, n, r, o, h],
                        },
                        (e) => {
                          e && e[0] && e[0].result
                            ? s(e[0].result)
                            : (s({
                                status: "failure",
                                data: "Doaction Failed to execute script.",
                              }),
                              l(
                                new Error("Doaction Failed to execute script")
                              ));
                        }
                      );
                    });
                  })
                );
              },
              y = async function (e, t, n) {
                var r, i;
                let a =
                  arguments.length > 3 && void 0 !== arguments[3]
                    ? arguments[3]
                    : "controller";
                const s = c.yY.getUrl("webagent", a);
                e.image_list && delete e.image_list,
                  e.note_container_html && delete e.note_container_html;
                const u = await (0, l.Zr)(
                  s,
                  (0, o.A)((0, o.A)({}, e), {}, { session_id: t, agent_id: n })
                );
                if (!(0, p.Vu)(u)) return null;
                const d =
                    null === u ||
                    void 0 === u ||
                    null === (r = u.headers) ||
                    void 0 === r
                      ? void 0
                      : r.get("content-type"),
                  h =
                    null === u ||
                    void 0 === u ||
                    null === (i = u.body) ||
                    void 0 === i
                      ? void 0
                      : i.getReader();
                let f = new TextDecoder("utf-8"),
                  g = !1,
                  m = "",
                  v = "";
                if (d && d.includes("text/event-stream")) {
                  let e = "",
                    t = !1;
                  for (; !g; ) {
                    const { value: n, done: r } = await h.read();
                    if (n) {
                      e += f.decode(n, { stream: !0 });
                      let r = e.indexOf("\n");
                      for (; -1 !== r; ) {
                        if (e.length >= 5 && !e.startsWith("data:")) {
                          (e = e.slice(r + 1)), (r = e.indexOf("\n"));
                          continue;
                        }
                        const n = e.slice(5, r).trim();
                        if (((e = e.slice(r + 1)), n))
                          try {
                            const o = JSON.parse(n);
                            if (o.response) {
                              (v = n), (t = !0);
                              break;
                            }
                            if (
                              o.finish_reason &&
                              "sensitive" === o.finish_reason
                            ) {
                              (m += SENSITIVE_RESPONSE_TEXT), (t = !0);
                              break;
                            }
                            (m += o.message_delta), (r = e.indexOf("\n"));
                          } catch (y) {}
                      }
                      if (t) break;
                    }
                    g = r;
                  }
                  if (e.trim())
                    try {
                      const t = JSON.parse(e.trim());
                      t.response ? (v = e.trim()) : (m += t.message_delta);
                    } catch (y) {}
                  return (0, o.A)(
                    (0, o.A)({}, JSON.parse(v)),
                    {},
                    { observation: m }
                  );
                }
                return u;
              },
              b = async function (e) {
                let t =
                  arguments.length > 1 && void 0 !== arguments[1]
                    ? arguments[1]
                    : "dr_format";
                const n = c.yY.getUrl("webagent", t),
                  r = await (0, l.Zr)(
                    n,
                    (0, o.A)(
                      (0, o.A)({}, e),
                      {},
                      {
                        logic_id: null === e || void 0 === e ? void 0 : e.id,
                        method: "POST",
                      }
                    )
                  );
                return (0, p.Vu)(r)
                  ? r.json()
                  : {
                      feedback_content:
                        "DR \u683c\u5f0f\u8f6c\u6362\u63a5\u53e3\u5931\u8d25",
                      task_status: "DR format failure",
                      id: null === e || void 0 === e ? void 0 : e.id,
                    };
              },
              w = async (e) => {
                if (e) {
                  const t = await (0, u.y3)(e, {
                    method: "GET",
                    headers: { "Content-Type": "application/pdf" },
                  });
                  if (!t.ok) return "";
                  const n = await t.blob(),
                    r = await (0, d.A)(n),
                    o = c.yY.getUrl("webagent", "assistant_upload_file");
                  return await (0, h.A)(r, o, e);
                }
              };
            r();
          } catch (m) {
            r(m);
          }
        });
      },
      88567: (e, t, n) => {
        "use strict";
        n.a(e, async (e, r) => {
          try {
            n.d(t, {
              AY: () => E,
              LQ: () => _,
              SA: () => A,
              Zl: () => C,
              cg: () => S,
              gf: () => x,
              wf: () => b,
              y3: () => y,
            });
            var o = n(89379),
              i = n(29942),
              a = n.n(i),
              s = n(35388),
              l = n(47041),
              c = n(44613),
              u = n(27443),
              d = n(28694),
              h = n(17846),
              p = e([c]),
              f = p.then ? (await p)() : p;
            c = f[0];
            const g = chrome.runtime.getManifest().version;
            let m = !1;
            const v = "glm_biscuits",
              y = fetch,
              b = (e) => {
                let t = "";
                return (
                  e.forEach(function (e) {
                    e.domain.indexOf(s.Ay.cookieDomain) > 1 ||
                      (t += e.name + "=" + e.value + ";");
                  }),
                  t
                );
              },
              w = async function () {
                let e =
                    arguments.length > 0 &&
                    void 0 !== arguments[0] &&
                    arguments[0],
                  t = "";
                return new Promise((n, r) => {
                  chrome.cookies.getAll(
                    { domain: s.Ay.cookieDomain },
                    function (r) {
                      (t = b(r)), n(e ? (0, l.Kh)(t) : t);
                    }
                  );
                });
              },
              _ = async function () {
                var e, t, n;
                let r =
                    arguments.length > 0 && void 0 !== arguments[0]
                      ? arguments[0]
                      : s.Ay.tokenStorageKey,
                  o =
                    null ===
                      (e = await (null === (t = chrome.storage) || void 0 === t
                        ? void 0
                        : t.local.get(r))) || void 0 === e
                      ? void 0
                      : e[r];
                return (
                  o ||
                    (o =
                      null === (n = await S()) || void 0 === n ? void 0 : n[r]),
                  o
                );
              },
              x = async function () {
                let e =
                  arguments.length > 0 && void 0 !== arguments[0]
                    ? arguments[0]
                    : s.Ay.tokenStorageKey;
                if ((0, l.ft)()) return await _(e);
                return await chrome.runtime.sendMessage({
                  action: "getToken",
                  tokenKey: e,
                });
              },
              S = async (e) => {
                var t, n;
                const r = e ? (0, l.Kh)(e) : await w(!0),
                  o = a().pick(r, s.Ay.cookiesName),
                  i =
                    null === o || void 0 === o
                      ? void 0
                      : o[s.Ay.tokenCookieKey];
                if (!i) return;
                let c;
                try {
                  c = (0, h.A)(i);
                } catch (d) {
                  return;
                }
                if (null !== (t = c) && void 0 !== t && t.is_guest) return;
                const u = {
                  [s.Ay.tokenStorageKey]: i,
                  [s.Ay.refreshTokenStorageKey]:
                    (null === o || void 0 === o
                      ? void 0
                      : o[s.Ay.refreshTokenCookieKey]) || "",
                  [s.Ay.tokenExpiresStorageKey]:
                    (null === o || void 0 === o
                      ? void 0
                      : o[s.Ay.tokenExpiresCookieKey]) || "",
                  [s.Ay.userIdStorageKey]:
                    (null === o || void 0 === o
                      ? void 0
                      : o[s.Ay.userIdCookieKey]) || "",
                };
                return (
                  await (null === (n = chrome.storage) || void 0 === n
                    ? void 0
                    : n.local.set(u)),
                  u
                );
              },
              k = new Proxy(
                {},
                {
                  get: (e, t) =>
                    async function () {
                      for (
                        var e = arguments.length, n = new Array(e), r = 0;
                        r < e;
                        r++
                      )
                        n[r] = arguments[r];
                      return (0, l.ft)()
                        ? await chrome.storage.local[t](...n)
                        : await chrome.runtime.sendMessage({
                            action: "storageLocal",
                            fn: t,
                            args: n,
                          });
                    },
                }
              ),
              A = async function () {
                for (
                  var e,
                    t,
                    n,
                    r,
                    i,
                    p = arguments.length,
                    f = new Array(p),
                    v = 0;
                  v < p;
                  v++
                )
                  f[v] = arguments[v];
                let [b, w] = f;
                const _ = await x();
                if (_) {
                  const e = (0, h.A)(_);
                  if (null !== e && void 0 !== e && e.is_guest)
                    return void (await k.remove(s.Ay.storageName));
                }
                const S = (0, s.E1)();
                a().merge(w || {}, {
                  headers: (0, o.A)(
                    (0, o.A)(
                      (0, o.A)({ Authorization: _ }, (0, u.Zl)()),
                      {},
                      { "Extension-Version": g, "X-Device-Id": c.sr.deid },
                      S ? { "X-Model": S } : null
                    ),
                    {},
                    { lang: d.A.language }
                  ),
                });
                let C = await y(b, w);
                let T = null;
                if (
                  !(null === (e = C) ||
                  void 0 === e ||
                  null === (t = e.headers) ||
                  void 0 === t ||
                  null === (n = t.get("Content-Type")) ||
                  void 0 === n
                    ? void 0
                    : n.includes("text/event-stream")) &&
                  (null === w || void 0 === w || !w.oriResponse)
                ) {
                  T = await C.json();
                  let e = {};
                  null !== w && void 0 !== w && w.fullBody
                    ? (e = T)
                    : ((e = T.data || {}), (e.__body = a().omit(T, "data"))),
                    (e.json = () => e),
                    (C = e);
                }
                if (
                  401 ===
                    (null === (r = C) || void 0 === r ? void 0 : r.status) ||
                  4e5 === (null === (i = T) || void 0 === i ? void 0 : i.code)
                ) {
                  const e = s.yY.getUrl(
                      m ? "userApi" : "webagent",
                      "refreshToken"
                    ),
                    t = (0, l.UM)("device_id", await E()),
                    n = await x(s.Ay.refreshTokenStorageKey);
                  if (n) {
                    var I;
                    let r = await y(e, {
                      method: "POST",
                      headers: (0, o.A)({}, (0, u.Zl)()),
                      body: JSON.stringify({
                        refresh_token: n,
                        device_id: t,
                        source_id: "plug",
                      }),
                    });
                    var L;
                    if (
                      ((r = await r.json()),
                      0 ===
                        (null === (I = r) || void 0 === I ? void 0 : I.code))
                    )
                      return (
                        await k.set({
                          [s.Ay.tokenStorageKey]:
                            null === (L = r.data) || void 0 === L
                              ? void 0
                              : L.access_token,
                        }),
                        await A(...f)
                      );
                    await k.remove(s.Ay.storageName);
                  }
                }
                return C;
              },
              C = async function () {
                for (
                  var e, t, n = arguments.length, r = new Array(n), o = 0;
                  o < n;
                  o++
                )
                  r[o] = arguments[o];
                let [i, a] = r;
                const s = new Date().getTime();
                let l = await A(...r);
                if (
                  (null === a || void 0 === a || !a.ignoreEventTracking) &&
                  ("undefined" === typeof __bl ||
                    i.indexOf(
                      null === (e = __bl) || void 0 === e
                        ? void 0
                        : e._conf.imgUrl
                    ))
                ) {
                  const e = new Date().getTime();
                  (0, c._2)({
                    ctnm: e - s,
                    extra: JSON.stringify({ api: encodeURIComponent(i) }),
                  });
                }
                var u, d;
                (401 !== (null === l || void 0 === l ? void 0 : l.status) &&
                  4e5 !== (null === l || void 0 === l ? void 0 : l.code) &&
                  4e5 !==
                    (null === l ||
                    void 0 === l ||
                    null === (t = l.__body) ||
                    void 0 === t
                      ? void 0
                      : t.code)) ||
                  ((null === (u = chrome) || void 0 === u
                    ? void 0
                    : u.setIsLogged) &&
                    (null === (d = chrome) ||
                      void 0 === d ||
                      d.setIsLogged(!1)));
                return l;
              };
            C.__position = "popup";
            const E = async function () {
                let e =
                  arguments.length > 0 &&
                  void 0 !== arguments[0] &&
                  arguments[0];
                return new Promise((t, n) => {
                  (0, l.ft)()
                    ? chrome.cookies.getAll(
                        { domain: s.Ay.cookieDomain },
                        function (e) {
                          t(b(e));
                        }
                      )
                    : chrome.runtime
                        .sendMessage({ action: "getGlmCookies" })
                        .then((n) => {
                          var r, o;
                          e &&
                            !n &&
                            "" !== n &&
                            (n =
                              null === (o = localStorage) || void 0 === o
                                ? void 0
                                : o.getItem(v));
                          t(n),
                            e &&
                              (null === (r = localStorage) ||
                                void 0 === r ||
                                r.setItem(v, n));
                        })
                        .catch((r) => {
                          var o;
                          const i = e
                            ? null === (o = localStorage) || void 0 === o
                              ? void 0
                              : o.getItem(v)
                            : null;
                          e && i ? t(i) : n(r);
                        });
                });
              },
              T = function () {
                let e =
                  arguments.length > 0 && void 0 !== arguments[0]
                    ? arguments[0]
                    : {};
                return new Promise((t, n) => {
                  chrome.runtime
                    .sendMessage(
                      (0, o.A)((0, o.A)({}, e), {}, { action: "openSidePanel" })
                    )
                    .then((e) => {
                      t(e);
                    })
                    .catch((e) => {
                      n(e);
                    });
                });
              };
            ((async function () {
              for (
                var e, t = arguments.length, n = new Array(t), r = 0;
                r < t;
                r++
              )
                n[r] = arguments[r];
              let [o, i] = n;
              const a = new Date().getTime();
              if (
                await chrome.runtime.sendMessage({
                  action: "shouldOpenForceUpdateModal",
                })
              )
                return (
                  await T(),
                  new Response("Upgrade Required", {
                    status: 426,
                    statusText: "You need to update the extension",
                  })
                );
              let l = await A(...n);
              if (null === i || void 0 === i || !i.ignoreEventTracking) {
                const e = new Date().getTime();
                (0, c._2)({
                  usid: await x(s.Ay.userIdStorageKey),
                  ctnm: e - a,
                  extra: JSON.stringify({ api: encodeURIComponent(o) }),
                });
              }
              return (
                (401 !== (null === l || void 0 === l ? void 0 : l.status) &&
                  4e5 !== (null === l || void 0 === l ? void 0 : l.code) &&
                  4e5 !==
                    (null === l ||
                    void 0 === l ||
                    null === (e = l.__body) ||
                    void 0 === e
                      ? void 0
                      : e.code)) ||
                  (await T({ openLogin: !0 })),
                l
              );
            }).__position = "content"),
              r();
          } catch (g) {
            r(g);
          }
        });
      },
      89379: (e, t, n) => {
        "use strict";
        n.d(t, { A: () => i });
        var r = n(64467);
        function o(e, t) {
          var n = Object.keys(e);
          if (Object.getOwnPropertySymbols) {
            var r = Object.getOwnPropertySymbols(e);
            t &&
              (r = r.filter(function (t) {
                return Object.getOwnPropertyDescriptor(e, t).enumerable;
              })),
              n.push.apply(n, r);
          }
          return n;
        }
        function i(e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = null != arguments[t] ? arguments[t] : {};
            t % 2
              ? o(Object(n), !0).forEach(function (t) {
                  (0, r.A)(e, t, n[t]);
                })
              : Object.getOwnPropertyDescriptors
              ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
              : o(Object(n)).forEach(function (t) {
                  Object.defineProperty(
                    e,
                    t,
                    Object.getOwnPropertyDescriptor(n, t)
                  );
                });
          }
          return e;
        }
      },
      97683: (e, t, n) => {
        "use strict";
        var r = n(51477),
          o = Symbol.for("react.element"),
          i = Symbol.for("react.fragment"),
          a = Object.prototype.hasOwnProperty,
          s =
            r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
              .ReactCurrentOwner,
          l = { key: !0, ref: !0, __self: !0, __source: !0 };
        function c(e, t, n) {
          var r,
            i = {},
            c = null,
            u = null;
          for (r in (void 0 !== n && (c = "" + n),
          void 0 !== t.key && (c = "" + t.key),
          void 0 !== t.ref && (u = t.ref),
          t))
            a.call(t, r) && !l.hasOwnProperty(r) && (i[r] = t[r]);
          if (e && e.defaultProps)
            for (r in (t = e.defaultProps)) void 0 === i[r] && (i[r] = t[r]);
          return {
            $$typeof: o,
            type: e,
            key: c,
            ref: u,
            props: i,
            _owner: s.current,
          };
        }
      },
      97866: (e, t, n) => {
        "use strict";
        n.d(t, { R: () => r });
        const r = () => {
          const e = document
            .querySelector("#glmos-main-content")
            .shadowRoot.querySelector("#glmos-workflow-container");
          if (e) {
            e.querySelector(".workflow-container") &&
              (e.style.removeProperty("display"),
              e.classList.add("glmos-workflow-container-show"));
          }
        };
      },
    },
    t = {};
  function n(r) {
    var o = t[r];
    if (void 0 !== o) return o.exports;
    var i = (t[r] = { id: r, loaded: !1, exports: {} });
    return e[r].call(i.exports, i, i.exports, n), (i.loaded = !0), i.exports;
  }
  (() => {
    var e = "function" === typeof Symbol,
      t = e ? Symbol("webpack queues") : "__webpack_queues__",
      r = e ? Symbol("webpack exports") : "__webpack_exports__",
      o = e ? Symbol("webpack error") : "__webpack_error__",
      i = (e) => {
        e &&
          e.d < 1 &&
          ((e.d = 1),
          e.forEach((e) => e.r--),
          e.forEach((e) => (e.r-- ? e.r++ : e())));
      };
    n.a = (e, n, a) => {
      var s;
      a && ((s = []).d = -1);
      var l,
        c,
        u,
        d = new Set(),
        h = e.exports,
        p = new Promise((e, t) => {
          (u = t), (c = e);
        });
      (p[r] = h),
        (p[t] = (e) => (s && e(s), d.forEach(e), p.catch((e) => {}))),
        (e.exports = p);
      n(
        (e) => {
          var n;
          l = ((e) =>
            e.map((e) => {
              if (null !== e && "object" === typeof e) {
                if (e[t]) return e;
                if (e.then) {
                  var n = [];
                  (n.d = 0),
                    e.then(
                      (e) => {
                        (a[r] = e), i(n);
                      },
                      (e) => {
                        (a[o] = e), i(n);
                      }
                    );
                  var a = {};
                  return (a[t] = (e) => e(n)), a;
                }
              }
              var s = {};
              return (s[t] = (e) => {}), (s[r] = e), s;
            }))(e);
          var a = () =>
              l.map((e) => {
                if (e[o]) throw e[o];
                return e[r];
              }),
            c = new Promise((e) => {
              (n = () => e(a)).r = 0;
              var r = (e) =>
                e !== s &&
                !d.has(e) &&
                (d.add(e), e && !e.d && (n.r++, e.push(n)));
              l.map((e) => e[t](r));
            });
          return n.r ? c : a();
        },
        (e) => (e ? u((p[o] = e)) : c(h), i(s))
      ),
        s && s.d < 0 && (s.d = 0);
    };
  })(),
    (n.n = (e) => {
      var t = e && e.__esModule ? () => e.default : () => e;
      return n.d(t, { a: t }), t;
    }),
    (n.d = (e, t) => {
      for (var r in t)
        n.o(t, r) &&
          !n.o(e, r) &&
          Object.defineProperty(e, r, { enumerable: !0, get: t[r] });
    }),
    (n.g = (function () {
      if ("object" === typeof globalThis) return globalThis;
      try {
        return this || new Function("return this")();
      } catch (e) {
        if ("object" === typeof window) return window;
      }
    })()),
    (n.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t)),
    (n.nmd = (e) => ((e.paths = []), e.children || (e.children = []), e));
  n(63919);
})();
