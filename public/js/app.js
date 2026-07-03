(function () {
  "use strict";

  // ---- Mobile navigation ----
  var toggle = document.querySelector(".nav-toggle");
  var navList = document.getElementById("nav-list");
  if (toggle && navList) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      navList.classList.toggle("open");
    });
  }

  // ---- Time zone aware schedule ----
  var select = document.getElementById("tz-select");
  if (!select) return;

  var STORAGE_KEY = "clara_tz";
  var detected = "UTC";
  try { detected = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"; } catch (e) {}

  // Show the detected zone next to the "auto" option
  var autoOpt = select.querySelector('option[value="auto"]');
  if (autoOpt) { autoOpt.textContent = autoOpt.textContent + " (" + detected + ")"; }

  function storedChoice() {
    var v = localStorage.getItem(STORAGE_KEY) || "auto";
    var exists = Array.prototype.some.call(select.options, function (o) { return o.value === v; });
    return exists ? v : "auto";
  }

  function zoneFor(value) { return value === "auto" ? detected : value; }

  function render(value) {
    var zone = zoneFor(value);
    var dateFmt, timeFmt;
    try {
      dateFmt = new Intl.DateTimeFormat([], { weekday: "short", day: "numeric", month: "short", timeZone: zone });
      timeFmt = new Intl.DateTimeFormat([], { hour: "2-digit", minute: "2-digit", timeZone: zone });
    } catch (e) { return; }

    document.querySelectorAll(".session-time").forEach(function (el) {
      var start = new Date(el.dataset.start);
      var end = el.dataset.end ? new Date(el.dataset.end) : null;
      var out = dateFmt.format(start) + ", " + timeFmt.format(start);
      if (end) { out += " to " + timeFmt.format(end); }
      el.textContent = out;
      el.setAttribute("title", zone);
    });
  }

  try { select.value = storedChoice(); } catch (e) {}
  render(select.value);

  select.addEventListener("change", function () {
    try { localStorage.setItem(STORAGE_KEY, select.value); } catch (e) {}
    render(select.value);
  });
})();
