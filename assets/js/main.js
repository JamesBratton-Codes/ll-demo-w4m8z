/* Reads window.SITE_CONFIG (config.js) and fills the page. No dependencies. */
(function () {
  var c = window.SITE_CONFIG;
  if (!c) { console.error("config.js missing or invalid"); return; }

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // ----- <head> / SEO -----
  var m = c.meta || {};
  var setMeta = function (attr, key, val) {
    if (!val) return;
    var el = $('meta[' + attr + '="' + key + '"]');
    if (!el) { el = document.createElement("meta"); el.setAttribute(attr, key); document.head.appendChild(el); }
    el.setAttribute("content", val);
  };
  document.title = m.title || c.brand;
  setMeta("name", "description", m.description);
  setMeta("name", "theme-color", m.themeColor);
  setMeta("property", "og:type", "website");
  setMeta("property", "og:site_name", c.brand);
  setMeta("property", "og:title", m.title);
  setMeta("property", "og:description", m.description);
  setMeta("property", "og:url", m.url);
  setMeta("property", "og:image", m.image);
  setMeta("name", "twitter:card", m.image ? "summary_large_image" : "summary");
  setMeta("name", "twitter:title", m.title);
  setMeta("name", "twitter:description", m.description);
  setMeta("name", "twitter:image", m.image);
  setMeta("name", "twitter:site", m.twitterHandle);
  if (m.url) {
    var link = $('link[rel="canonical"]');
    if (!link) { link = document.createElement("link"); link.rel = "canonical"; document.head.appendChild(link); }
    link.href = m.url;
  }

  // ----- text + images -----
  $$("[data-text]").forEach(function (el) { el.textContent = c[el.dataset.text] || ""; });
  $$("[data-bind]").forEach(function (el) {
    var src = c[el.dataset.bind];
    if (!src) { el.hidden = true; return; }
    el.src = src;
    if (el.dataset.alt) el.alt = c[el.dataset.alt] || "";
  });
  var bd = $("[data-backdrop]");
  if (bd && c.backdrop) bd.style.backgroundImage = "url('" + c.backdrop + "')";

  // CTAs
  var bindBtn = function (el, cfg) {
    if (!cfg || !cfg.label) { el.hidden = true; return; }
    el.textContent = cfg.label;
    el.href = cfg.href;
    if (/^https?:/.test(cfg.href)) { el.target = "_blank"; el.rel = "noopener noreferrer"; }
  };
  bindBtn($("[data-cta]"), c.cta);
  bindBtn($("[data-cta2]"), c.secondaryCta);

  // Mottos
  var mottos = $("[data-mottos]");
  (c.mottos || []).forEach(function (t) {
    var li = document.createElement("li");
    li.textContent = t;
    mottos.appendChild(li);
  });

  // Socials
  $$("[data-socials]").forEach(function (ul) {
    (c.socials || []).forEach(function (s) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = s.url; a.target = "_blank"; a.rel = "noopener noreferrer";
      a.setAttribute("aria-label", s.name); a.title = s.name;
      var img = document.createElement("img");
      img.src = s.icon; img.alt = ""; img.width = 20; img.height = 20;
      a.appendChild(img); li.appendChild(a); ul.appendChild(li);
    });
  });

  // Footer
  var f = $("[data-footer]");
  if (f) f.textContent = String(c.footer || "").replace("{year}", new Date().getFullYear());

  // Entrance animation
  var copy = $(".hero__copy");
  Array.prototype.forEach.call(copy.children, function (el, i) { el.style.setProperty("--i", i); });
  copy.classList.add("reveal");
  $(".hero__visual").classList.add("reveal-visual");
})();
