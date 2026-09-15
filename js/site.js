/* Compliance On Demand: site behaviour. Progressive: every page reads fine without it. */
(function () {
  "use strict";

  /* mobile drawer */
  var burger = document.querySelector(".burger");
  var drawer = document.querySelector(".drawer");
  if (burger && drawer) {
    burger.addEventListener("click", function () {
      var open = drawer.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* home hero crossfade */
  var frames = document.querySelectorAll(".hero__frame");
  if (frames.length > 1 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var i = 0;
    setInterval(function () {
      frames[i].classList.remove("is-on");
      i = (i + 1) % frames.length;
      frames[i].classList.add("is-on");
    }, 10000);
  }

  /* services: sidebar selects a panel */
  var svcButtons = document.querySelectorAll(".svc__list button");
  if (svcButtons.length) {
    var showService = function (key) {
      svcButtons.forEach(function (b) {
        b.setAttribute("aria-selected", b.dataset.svc === key ? "true" : "false");
      });
      document.querySelectorAll(".svc__panel").forEach(function (p) {
        p.hidden = p.dataset.svc !== key;
      });
      if (history.replaceState) history.replaceState(null, "", "#" + key);
    };
    svcButtons.forEach(function (b) {
      b.addEventListener("click", function () { showService(b.dataset.svc); });
    });
    var hash = (location.hash || "").slice(1);
    if (hash && document.querySelector('.svc__panel[data-svc="' + hash + '"]')) showService(hash);
  }

  /* accordions */
  document.querySelectorAll(".acc__q").forEach(function (q) {
    q.addEventListener("click", function () {
      var open = q.getAttribute("aria-expanded") === "true";
      var panel = document.getElementById(q.getAttribute("aria-controls"));
      q.setAttribute("aria-expanded", open ? "false" : "true");
      if (panel) panel.hidden = open;
    });
  });

  /* bio modal */
  var modal = document.querySelector(".modal");
  if (modal) {
    var boxes = {};
    document.querySelectorAll("[data-bio]").forEach(function (t) { boxes[t.dataset.bio] = t; });
    var body = modal.querySelector(".modal__content");
    var open = function (key) {
      if (!boxes[key]) return;
      body.innerHTML = boxes[key].innerHTML;
      modal.hidden = false;
      document.body.style.overflow = "hidden";
    };
    var close = function () {
      modal.hidden = true;
      body.innerHTML = "";
      document.body.style.overflow = "";
    };
    document.querySelectorAll("[data-bio-open]").forEach(function (b) {
      b.addEventListener("click", function () { open(b.dataset.bioOpen); });
    });
    modal.addEventListener("click", function (e) {
      if (e.target === modal || e.target.closest(".modal__close")) close();
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !modal.hidden) close(); });
  }

  /* cookie preferences */
  var toggles = document.querySelectorAll(".toggle[data-pref]");
  if (toggles.length) {
    var KEY = "cod-cookie-consent";
    var prefs = { preferences: false, statistics: false, marketing: false };
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) prefs = Object.assign(prefs, JSON.parse(raw));
    } catch (e) {}
    var saved = document.querySelector(".cookie-saved");
    var paint = function () {
      toggles.forEach(function (t) {
        var on = !!prefs[t.dataset.pref];
        t.setAttribute("aria-checked", on ? "true" : "false");
        var label = t.parentElement.querySelector(".toggle-state");
        if (label) label.textContent = on ? "Enabled" : "Disabled";
      });
    };
    var store = function () {
      try { localStorage.setItem(KEY, JSON.stringify(prefs)); } catch (e) {}
      if (saved) saved.hidden = false;
    };
    toggles.forEach(function (t) {
      t.addEventListener("click", function () {
        prefs[t.dataset.pref] = !prefs[t.dataset.pref];
        if (saved) saved.hidden = true;
        paint();
      });
    });
    var setAll = function (v) {
      Object.keys(prefs).forEach(function (k) { prefs[k] = v; });
      paint();
      store();
    };
    var accept = document.querySelector("[data-cookie-accept]");
    var deny = document.querySelector("[data-cookie-deny]");
    var save = document.querySelector("[data-cookie-save]");
    if (accept) accept.addEventListener("click", function () { setAll(true); });
    if (deny) deny.addEventListener("click", function () { setAll(false); });
    if (save) save.addEventListener("click", store);
    paint();
  }

  /* enquiry form: posts to Web3Forms */
  var form = document.querySelector("#enquiry");
  if (form) {
    var err = form.querySelector(".form-err");
    var btn = form.querySelector("button[type=submit]");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var name = (data.get("name") || "").trim();
      var email = (data.get("email") || "").trim();
      var message = (data.get("message") || "").trim();
      var fail = function (msg) { err.hidden = false; err.textContent = msg; };
      err.hidden = true;
      if (!name || !email || !message) return fail("Please add your name, email and a short message.");
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return fail("That email address does not look right.");
      btn.disabled = true;
      btn.textContent = "Sending\u2026";
      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: form.dataset.key,
          subject: "Website enquiry from " + name,
          from_name: "Compliance On Demand website",
          name: name,
          email: email,
          company: (data.get("company") || "").trim() || "not given",
          message: message
        })
      }).then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) {
        if (!r.ok || d.success === false) throw new Error("send failed");
        form.innerHTML = '<div class="form-ok"><div style="font-size:17px;font-weight:700;letter-spacing:-0.02em">Thank you, your enquiry has been sent.</div><div style="margin-top:10px;font-size:14.5px;line-height:1.58;color:#4A5A64">We will come back to you shortly. If it is urgent, call +44 20 3963 9966.</div></div>';
      }); }).catch(function () {
        btn.disabled = false;
        btn.textContent = "Send enquiry";
        fail("Something went wrong sending that. Please try again or email us directly.");
      });
    });
  }
})();
