/* =========================================================
   iBM – Ingenieurbüro Memic — Interaktionen
   Kein Framework, keine externen Abhängigkeiten.
   Alles hier ist Zugabe: Ohne diese Datei ist die Seite
   vollständig lesbar, die Zeichnungen stehen einfach fertig da.
   ========================================================= */
(function () {
  "use strict";

  var html = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hatIO = "IntersectionObserver" in window;

  function klemme(wert, min, max) { return Math.min(max, Math.max(min, wert)); }

  /* ---------- Jahreszahl in der Fußzeile ---------- */
  var jahr = document.getElementById("jahr");
  if (jahr) jahr.textContent = new Date().getFullYear();

  /* ---------- Mobiles Menü ---------- */
  var burger = document.getElementById("burger");
  var nav = document.getElementById("nav");

  function schliesseNav() {
    if (!burger || !nav) return;
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Menü öffnen");
    nav.classList.remove("is-open");
    document.body.classList.remove("nav-open");
  }

  if (burger && nav) {
    burger.addEventListener("click", function () {
      if (burger.getAttribute("aria-expanded") === "true") {
        schliesseNav();
      } else {
        burger.setAttribute("aria-expanded", "true");
        burger.setAttribute("aria-label", "Menü schließen");
        nav.classList.add("is-open");
        document.body.classList.add("nav-open");
      }
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) schliesseNav();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") schliesseNav();
    });
    window.matchMedia("(min-width: 901px)").addEventListener("change", function (e) {
      if (e.matches) schliesseNav();
    });
  }

  /* ---------- Kopfleiste: Linie beim Scrollen, Höhe messen ---------- */
  var kopf = document.getElementById("kopf") || document.querySelector(".kopf");
  function messeKopf() {
    if (kopf) html.style.setProperty("--kopf-h", kopf.offsetHeight + "px");
  }
  messeKopf();
  window.addEventListener("resize", messeKopf);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(messeKopf);

  /* ---------- Aktiver Menüpunkt ---------- */
  var navLinks = nav ? nav.querySelectorAll('.nav__liste a[href^="#"]') : [];
  var spyZiele = [];
  navLinks.forEach(function (link) {
    var el = document.querySelector(link.getAttribute("href"));
    if (el) spyZiele.push({ link: link, el: el });
  });
  if (spyZiele.length && hatIO) {
    var spy = new IntersectionObserver(function (eintraege) {
      eintraege.forEach(function (e) {
        if (!e.isIntersecting) return;
        spyZiele.forEach(function (z) { z.link.classList.toggle("is-active", z.el === e.target); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    spyZiele.forEach(function (z) { spy.observe(z.el); });
  }

  /* ---------- Zeichnungen Strich für Strich ----------
     Jede Linie bekommt eine Strichelung, die genau so lang ist wie sie
     selbst, und wird dann „herausgeschoben". Weil die Linien mit
     vector-effect: non-scaling-stroke gezeichnet sind, rechnet der
     Browser die Strichelung in Bildschirm-Pixeln — deshalb wird die
     Länge mit dem aktuellen Maßstab der Zeichnung multipliziert. */
  var zeichnungen = Array.prototype.slice.call(document.querySelectorAll("[data-zeichnung]"));

  function zeichne(svg) {
    if (!svg || svg.classList.contains("is-gezeichnet") && !svg._neu) return;
    svg._neu = false;
    var box = svg.viewBox && svg.viewBox.baseVal;
    var breite = svg.getBoundingClientRect().width;
    var massstab = box && box.width ? breite / box.width : 1;
    var linien = Array.prototype.filter.call(svg.querySelectorAll(".s"), function (el) {
      return !el.closest(".f") && typeof el.getTotalLength === "function";
    });
    if (!breite || !linien.length) { svg.classList.add("is-gezeichnet"); return; }

    var schritt = Math.min(0.045, 1.4 / linien.length);
    var dauer = 0.9;
    linien.forEach(function (el, i) {
      var laenge;
      try { laenge = el.getTotalLength() * massstab + 2; } catch (err) { return; }
      el.style.transition = "none";
      el.style.strokeDasharray = laenge + " " + laenge;
      el.style.strokeDashoffset = laenge;
      // Neu aufbauen erzwingen, damit der Übergang auch beim zweiten Mal startet
      el.getBoundingClientRect();
      el.style.transition = "stroke-dashoffset " + dauer + "s cubic-bezier(.65,0,.35,1) " + (i * schritt).toFixed(3) + "s";
    });
    var ende = linien.length * schritt + dauer * 0.6;
    svg.style.setProperty("--f-delay", ende.toFixed(2) + "s");

    window.requestAnimationFrame(function () {
      svg.classList.add("is-gezeichnet");
      linien.forEach(function (el) { el.style.strokeDashoffset = "0"; });
    });

    // Danach aufräumen: Ohne Strichelung bleibt die Linie auch nach
    // einer Größenänderung des Fensters vollständig.
    window.setTimeout(function () {
      linien.forEach(function (el) {
        el.style.transition = "";
        el.style.strokeDasharray = "";
        el.style.strokeDashoffset = "";
      });
    }, (ende + dauer) * 1000 + 200);
  }

  var werdegang = document.querySelector(".werdegang__liste");

  if (!reduceMotion && hatIO && zeichnungen.length) {
    html.classList.add("zeichnen-an");
    var zio = new IntersectionObserver(function (eintraege, obs) {
      eintraege.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        obs.unobserve(el);
        if (el === werdegang) { el.classList.add("is-gezeichnet"); return; }
        // In der Leistungs-Zeichnung nur das gerade sichtbare Blatt
        if (el.hasAttribute("data-leistung-bild") && !el.classList.contains("is-sichtbar")) return;
        zeichne(el);
      });
    }, { threshold: 0.2 });
    zeichnungen.forEach(function (svg) { zio.observe(svg); });
    if (werdegang) zio.observe(werdegang);

    // Notbremse: Falls der Beobachter nicht auslöst, alles sofort zeigen.
    window.setTimeout(function () {
      if (!document.querySelector(".is-gezeichnet")) html.classList.remove("zeichnen-an");
    }, 2500);
  }

  /* ---------- Leistungen: Akkordeon wechselt die Zeichnung ---------- */
  var leistungen = document.querySelector("[data-leistungen]");
  if (leistungen) {
    var punkte = Array.prototype.slice.call(leistungen.querySelectorAll("details"));
    var planTitel = document.querySelector("[data-plan-titel]");
    var planNr = document.querySelector("[data-plan-nr]");

    punkte.forEach(function (punkt) {
      punkt.addEventListener("toggle", function () {
        if (!punkt.open) return;
        // Ältere Browser kennen <details name> nicht: dort selbst schließen
        punkte.forEach(function (anderer) { if (anderer !== punkt && anderer.open) anderer.open = false; });

        var nr = punkt.getAttribute("data-nr");
        document.querySelectorAll("[data-leistung-bild]").forEach(function (svg) {
          var an = svg.getAttribute("data-leistung-bild") === nr;
          svg.classList.toggle("is-sichtbar", an);
          if (an && html.classList.contains("zeichnen-an")) {
            svg.classList.remove("is-gezeichnet");
            svg._neu = true;
            zeichne(svg);
          }
        });
        if (planTitel) planTitel.textContent = punkt.getAttribute("data-titel");
        if (planNr) planNr.textContent = ("0" + nr).slice(-2);
      });
    });
  }

  /* ---------- Aussage: Wörter werden beim Lesen dunkel ---------- */
  var aussage = document.querySelector("[data-woerter]");
  var woerter = [];

  function zerlege(knoten) {
    Array.prototype.slice.call(knoten.childNodes).forEach(function (kind) {
      if (kind.nodeType === 3) {
        var teile = kind.textContent.split(/(\s+)/);
        var stueck = document.createDocumentFragment();
        teile.forEach(function (teil) {
          if (!teil) return;
          if (/^\s+$/.test(teil)) {
            stueck.appendChild(document.createTextNode(" "));
          } else {
            var span = document.createElement("span");
            span.className = "w";
            span.textContent = teil;
            stueck.appendChild(span);
            woerter.push(span);
          }
        });
        knoten.replaceChild(stueck, kind);
      } else if (kind.nodeType === 1) {
        zerlege(kind);
      }
    });
  }

  if (aussage && !reduceMotion) {
    zerlege(aussage);
    html.classList.add("woerter-an");
  }

  /* ---------- Foto-Band: leichte Parallaxe ---------- */
  var baender = reduceMotion ? [] : Array.prototype.slice.call(document.querySelectorAll("[data-parallaxe]"));

  /* ---------- Der Lastpfad ----------
     Nur am großen Bildschirm mit genug Höhe: Die Zeichnung bleibt stehen,
     der Scrollweg des Abschnitts wird in fünf gleiche Stücke geteilt. */
  var lastpfad = document.querySelector("[data-lastpfad]");
  var buehne = lastpfad ? lastpfad.querySelector(".lastpfad__buehne") : null;
  var schritte = lastpfad ? Array.prototype.slice.call(lastpfad.querySelectorAll(".schritt")) : [];
  var schrittNr = lastpfad ? lastpfad.querySelector("[data-lastpfad-nr]") : null;
  var schrittListe = lastpfad ? lastpfad.querySelector(".schritte") : null;
  var lastpfadMedien = window.matchMedia("(min-width: 1001px) and (min-height: 640px)");
  var lastpfadAn = false;
  var letzterSchritt = -1;

  function setzeSchritt(n) {
    if (n === letzterSchritt) return;
    letzterSchritt = n;
    for (var i = 1; i <= 5; i++) lastpfad.classList.toggle("ab-" + i, i <= n);
    schritte.forEach(function (li, i) { li.classList.toggle("is-aktiv", i + 1 === n); });
    if (schrittNr) schrittNr.textContent = "0" + n;
    if (schrittListe) schrittListe.style.setProperty("--fortschritt", (n / 5).toFixed(2));
  }

  function pruefeLastpfad() {
    if (!lastpfad) return;
    var soll = !reduceMotion && lastpfadMedien.matches;
    if (soll === lastpfadAn) return;
    lastpfadAn = soll;
    html.classList.toggle("lastpfad-an", soll);
    letzterSchritt = -1;
    if (!soll) {
      for (var i = 1; i <= 5; i++) lastpfad.classList.remove("ab-" + i);
      schritte.forEach(function (li) { li.classList.remove("is-aktiv"); });
      if (schrittNr) schrittNr.textContent = "05";
      if (schrittListe) schrittListe.style.removeProperty("--fortschritt");
    }
  }
  pruefeLastpfad();
  if (lastpfadMedien.addEventListener) lastpfadMedien.addEventListener("change", function () { pruefeLastpfad(); bild(); });

  // Klick auf einen Schritt springt an dessen Stelle im Scrollweg
  schritte.forEach(function (li, i) {
    li.addEventListener("click", function () {
      if (!lastpfadAn) return;
      var weg = lastpfad.offsetHeight - buehne.offsetHeight;
      var oben = lastpfad.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: oben + weg * (i + 0.5) / 5, behavior: "smooth" });
    });
  });

  /* ---------- Ein gemeinsamer Scroll-Takt für alles ---------- */
  var geplant = false;

  function bild() {
    geplant = false;
    var vh = window.innerHeight;

    if (kopf) kopf.classList.toggle("is-stuck", window.scrollY > 8);

    if (woerter.length) {
      var r = aussage.getBoundingClientRect();
      var p = klemme((vh * 0.88 - r.top) / (r.height + vh * 0.35), 0, 1);
      var anzahl = Math.round(p * woerter.length);
      for (var i = 0; i < woerter.length; i++) woerter[i].classList.toggle("is-an", i < anzahl);
    }

    baender.forEach(function (band) {
      var rb = band.getBoundingClientRect();
      if (rb.bottom < 0 || rb.top > vh) return;
      var mitte = rb.top + rb.height / 2 - vh / 2;
      var img = band.querySelector("img");
      if (img) img.style.setProperty("--versatz", (mitte * -0.12).toFixed(1) + "px");
    });

    if (lastpfadAn && buehne) {
      var rl = lastpfad.getBoundingClientRect();
      var weg = lastpfad.offsetHeight - buehne.offsetHeight;
      var fortschritt = weg > 0 ? klemme(-rl.top / weg, 0, 0.9999) : 1;
      setzeSchritt(Math.floor(fortschritt * 5) + 1);
    }
  }

  function planeBild() {
    if (geplant) return;
    geplant = true;
    window.requestAnimationFrame(bild);
  }
  window.addEventListener("scroll", planeBild, { passive: true });
  window.addEventListener("resize", planeBild);
  bild();

  /* ---------- Einblenden beim Scrollen ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if (reveals.length && !reduceMotion && hatIO) {
    html.classList.add("reveal-on");
    var rio = new IntersectionObserver(function (eintraege, obs) {
      eintraege.forEach(function (e, i) {
        if (!e.isIntersecting) return;
        var el = e.target;
        window.setTimeout(function () { el.classList.add("is-in"); }, Math.min(i, 5) * 70);
        obs.unobserve(el);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { rio.observe(el); });
    window.setTimeout(function () {
      if (!document.querySelector(".reveal.is-in")) reveals.forEach(function (el) { el.classList.add("is-in"); });
    }, 1500);
  }

  /* ---------- Pläne: Karte öffnet das ganze Blatt ----------
     Das große Blatt wird erst beim Öffnen geladen. Im Fenster blättern die
     Pfeile (auch die Pfeiltasten), Escape schließt. Die Lupe gibt es nur im
     Fenster und nur mit Maus; sie lädt die 2800-px-Fassung erst beim ersten
     Überfahren. Auf dem Stapel selbst ist bewusst keine Lupe. */
  /* ---------- Referenzen: Projekte umschalten und filtern ----------
     Jedes Projekt hat einen Eintrag in der Liste und einen eigenen Planstapel,
     verbunden über data-projekt. Filterknöpfe für die Bereiche (data-bereich)
     entstehen hier von selbst, sobald mindestens zwei Bereiche vorkommen. */
  var projektKnoepfe = Array.prototype.slice.call(document.querySelectorAll(".projekt__knopf[data-projekt]"));
  var projektStapel = Array.prototype.slice.call(document.querySelectorAll(".planstapel[data-projekt]"));

  var zeigeProjekt = function (name) {
    projektKnoepfe.forEach(function (k) {
      k.setAttribute("aria-pressed", k.getAttribute("data-projekt") === name ? "true" : "false");
    });
    projektStapel.forEach(function (s) { s.hidden = s.getAttribute("data-projekt") !== name; });
  };

  projektKnoepfe.forEach(function (k) {
    k.addEventListener("click", function () { zeigeProjekt(k.getAttribute("data-projekt")); });
  });

  var filterLeiste = document.querySelector("[data-projekte-filter]");
  if (filterLeiste && projektKnoepfe.length) {
    var bereiche = [];
    projektKnoepfe.forEach(function (k) {
      var b = k.closest(".projekt").getAttribute("data-bereich");
      if (b && bereiche.indexOf(b) === -1) bereiche.push(b);
    });
    if (bereiche.length > 1) {
      ["Alle"].concat(bereiche).forEach(function (bereich, i) {
        var knopf = document.createElement("button");
        knopf.type = "button";
        knopf.textContent = bereich;
        knopf.setAttribute("aria-pressed", i === 0 ? "true" : "false");
        knopf.addEventListener("click", function () {
          filterLeiste.querySelectorAll("button").forEach(function (x) {
            x.setAttribute("aria-pressed", x === knopf ? "true" : "false");
          });
          var erstes = null;
          projektKnoepfe.forEach(function (k) {
            var li = k.closest(".projekt");
            var passt = bereich === "Alle" || li.getAttribute("data-bereich") === bereich;
            li.hidden = !passt;
            if (passt && !erstes) erstes = k;
          });
          // Ist das gewählte Projekt weggefiltert, das erste passende zeigen
          var aktiv = projektKnoepfe.filter(function (k) {
            return k.getAttribute("aria-pressed") === "true" && !k.closest(".projekt").hidden;
          })[0];
          if (!aktiv && erstes) zeigeProjekt(erstes.getAttribute("data-projekt"));
        });
        filterLeiste.appendChild(knopf);
      });
      filterLeiste.hidden = false;
    }
  }

  if (projektKnoepfe.length) {
    var startProjekt = projektKnoepfe.filter(function (k) { return k.getAttribute("aria-pressed") === "true"; })[0] || projektKnoepfe[0];
    zeigeProjekt(startProjekt.getAttribute("data-projekt"));
  }

  // Alle Blätter aller Stapel. Im Fenster wird nur innerhalb des Stapels
  // geblättert, zu dem das angeklickte Blatt gehört — sortiert nach Plannummer,
  // weil das oberste Blatt im HTML zuletzt steht.
  var planKarten = Array.prototype.slice.call(document.querySelectorAll(".planblatt[data-voll]"));
  var blaetterVon = function (karte) {
    var stapel = karte.closest(".planstapel") || document;
    return Array.prototype.slice.call(stapel.querySelectorAll(".planblatt[data-voll]"))
      .sort(function (a, b) { return a.getAttribute("data-nr").localeCompare(b.getAttribute("data-nr")); });
  };
  var planfenster = document.getElementById("planfenster");

  if (planKarten.length && planfenster && typeof planfenster.showModal === "function") {
    var pfBild = planfenster.querySelector("[data-pf-bild]");
    var pfNr = planfenster.querySelector("[data-pf-nr]");
    var pfTitel = planfenster.querySelector("[data-pf-titel]");
    var pfLink = planfenster.querySelector("[data-pf-link]");
    var pfRahmen = planfenster.querySelector(".planfenster__rahmen");
    var pfLupe = planfenster.querySelector(".lupe");
    var pfIndex = 0;
    var pfLupeBild = "";
    var aktuelleBlaetter = planKarten;

    var zeigePlan = function (index) {
      pfIndex = (index + aktuelleBlaetter.length) % aktuelleBlaetter.length;
      var karte = aktuelleBlaetter[pfIndex];
      var basis = karte.getAttribute("data-voll");
      pfBild.removeAttribute("srcset");
      pfBild.sizes = "(max-width: 560px) 900px, 94vw";
      pfBild.srcset = basis + "-1400.webp 1400w, " + basis + "-2800.webp 2800w";
      pfBild.src = basis + "-1400.webp";
      pfBild.alt = karte.getAttribute("data-alt");
      pfNr.textContent = karte.getAttribute("data-nr");
      pfTitel.textContent = karte.getAttribute("data-titel");
      pfLink.href = basis + "-2800.jpg";
      pfLupeBild = basis + "-2800.webp";
      if (pfLupe) pfLupe.style.backgroundImage = "";
      if (pfRahmen) pfRahmen.classList.remove("is-lupe");
    };

    planKarten.forEach(function (karte) {
      karte.addEventListener("click", function () {
        aktuelleBlaetter = blaetterVon(karte);
        zeigePlan(aktuelleBlaetter.indexOf(karte));
        planfenster.showModal();
        document.body.classList.add("fenster-offen");
      });
    });
    // Die Seite darf nach dem Schließen nie gesperrt bleiben. Das „close"-
    // Ereignis kommt erst verzögert — deshalb räumen Schließen-Knopf und
    // Hintergrund sofort selbst auf; „close" deckt zusätzlich Escape ab.
    var nachDemSchliessen = function () {
      if (!document.body.classList.contains("fenster-offen")) return;
      document.body.classList.remove("fenster-offen");
      if (aktuelleBlaetter[pfIndex]) aktuelleBlaetter[pfIndex].focus();
    };
    var schliesseFenster = function () {
      if (planfenster.open) planfenster.close();
      nachDemSchliessen();
    };
    planfenster.addEventListener("close", nachDemSchliessen);
    planfenster.addEventListener("cancel", nachDemSchliessen); // Escape, kommt sofort
    planfenster.querySelectorAll("[data-pf-schritt]").forEach(function (knopf) {
      knopf.addEventListener("click", function () {
        zeigePlan(pfIndex + Number(knopf.getAttribute("data-pf-schritt")));
      });
    });
    planfenster.querySelector("[data-pf-zu]").addEventListener("click", schliesseFenster);
    // Klick auf den abgedunkelten Hintergrund schließt ebenfalls
    planfenster.addEventListener("click", function (e) { if (e.target === planfenster) schliesseFenster(); });
    planfenster.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); zeigePlan(pfIndex + 1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); zeigePlan(pfIndex - 1); }
    });

    if (pfRahmen && pfLupe && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      var ZOOM = 2.4;
      pfRahmen.addEventListener("pointerenter", function () {
        if (!pfLupe.style.backgroundImage) pfLupe.style.backgroundImage = "url(\"" + pfLupeBild + "\")";
        pfRahmen.classList.add("is-lupe");
      });
      pfRahmen.addEventListener("pointerleave", function () { pfRahmen.classList.remove("is-lupe"); });
      pfRahmen.addEventListener("pointermove", function (e) {
        var box = pfRahmen.getBoundingClientRect();
        var x = e.clientX - box.left;
        var y = e.clientY - box.top;
        var d = pfLupe.offsetWidth;
        pfLupe.style.transform = "translate(" + (x - d / 2) + "px," + (y - d / 2) + "px)";
        pfLupe.style.backgroundSize = (box.width * ZOOM) + "px " + (box.height * ZOOM) + "px";
        pfLupe.style.backgroundPosition = (d / 2 - x * ZOOM) + "px " + (d / 2 - y * ZOOM) + "px";
      });
    }
  } else {
    // Sehr alte Browser ohne <dialog>: das große Blatt einfach in neuem Tab
    planKarten.forEach(function (karte) {
      karte.addEventListener("click", function () {
        window.open(karte.getAttribute("data-voll") + "-2800.jpg", "_blank", "noopener");
      });
    });
  }

  /* ---------- Anfrageformular ----------
     Bewusst ohne Server: Aus den Eingaben wird eine fertige E-Mail gebaut,
     die das E-Mail-Programm des Besuchers öffnet. Pläne kann man dort
     direkt anhängen — das kann kein einfaches Formular.

     TODO Bilal: Ändert sich die Adresse, MAIL hier austauschen und
     zusätzlich in index.html, impressum.html und datenschutz.html. */
  var MAIL = "info@ib-memic.de";

  var formular = document.getElementById("anfrage");
  var meldung = document.getElementById("formNote");

  function wert(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : "";
  }

  function melde(text, art) {
    if (!meldung) return;
    meldung.textContent = text;
    meldung.className = "formular__meldung" + (art ? " is-" + art : "");
  }

  function pruefe() {
    if (wert("f-web") !== "") return false; // Spam-Falle
    var ok = true;
    var erstes = null;
    ["f-name", "f-mail", "f-text", "f-dsgvo"].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      var falsch = el.type === "checkbox" ? !el.checked : (el.value.trim() === "" || !el.checkValidity());
      el.classList.toggle("is-invalid", falsch);
      if (falsch && !erstes) erstes = el;
      if (falsch) ok = false;
    });
    if (!ok) {
      melde("Bitte Name, eine gültige E-Mail-Adresse und Ihr Vorhaben angeben und den Datenschutzhinweis bestätigen.", "error");
      if (erstes) erstes.focus();
    }
    return ok;
  }

  function vorhabenArt() {
    var gewaehlt = formular ? formular.querySelector('input[name="art"]:checked') : null;
    return gewaehlt ? gewaehlt.value : "Allgemeine Anfrage";
  }

  if (formular) {
    formular.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!pruefe()) return;
      var zeilen = ["Name: " + wert("f-name"), "E-Mail: " + wert("f-mail")];
      if (wert("f-tel")) zeilen.push("Telefon: " + wert("f-tel"));
      if (wert("f-ort")) zeilen.push("Ort des Bauvorhabens: " + wert("f-ort"));
      zeilen.push("Art: " + vorhabenArt(), "", wert("f-text"));
      window.location.href = "mailto:" + MAIL +
        "?subject=" + encodeURIComponent("Anfrage über die Website – " + vorhabenArt()) +
        "&body=" + encodeURIComponent(zeilen.join("\n"));
      melde("Ihr E-Mail-Programm öffnet sich mit der fertigen Nachricht. Bitte dort noch auf „Senden“ klicken.", "ok");
    });
    formular.addEventListener("input", function (e) {
      if (e.target.classList) e.target.classList.remove("is-invalid");
    });
    formular.addEventListener("change", function (e) {
      if (e.target.classList) e.target.classList.remove("is-invalid");
    });
  }
})();
