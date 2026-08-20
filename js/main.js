(function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector("nav.main");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.textContent = open ? "Close" : "Menu";
  });

  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.textContent = "Menu";
    });
  });
})();

(function () {
  var root = document.querySelector("[data-reviews]");
  if (!root) return;

  var viewport = root.querySelector(".reviews-viewport");
  var track = root.querySelector(".reviews-track");
  var cards = Array.prototype.slice.call(track.children);
  var prev = root.querySelector(".reviews-nav--prev");
  var next = root.querySelector(".reviews-nav--next");
  var dotsWrap = document.querySelector("[data-reviews-dots]");
  var index = 0;
  var gap = 22;
  var mq = window.matchMedia("(min-width: 761px)");

  function perView() {
    return mq.matches ? 2 : 1;
  }

  function pageCount() {
    return Math.ceil(cards.length / perView());
  }

  function cardSize() {
    var n = perView();
    var width = viewport.clientWidth;
    return n === 1 ? width : (width - gap) / 2;
  }

  function layout() {
    var width = cardSize();
    cards.forEach(function (card) {
      card.style.flex = "0 0 " + width + "px";
      card.style.width = width + "px";
      card.style.height = "auto";
    });
    var tallest = 0;
    cards.forEach(function (card) {
      tallest = Math.max(tallest, card.offsetHeight);
    });
    cards.forEach(function (card) {
      card.style.height = tallest + "px";
    });
    if (index >= pageCount()) index = 0;
    go(index);
  }

  function renderDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = "";
    var total = pageCount();
    for (var i = 0; i < total; i += 1) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", "Show reviews " + (i + 1) + " of " + total);
      (function (page) {
        dot.addEventListener("click", function () {
          go(page);
        });
      })(i);
      dotsWrap.appendChild(dot);
    }
  }

  function updateDots() {
    if (!dotsWrap) return;
    Array.prototype.forEach.call(dotsWrap.children, function (dot, i) {
      if (i === index) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });
  }

  function go(page) {
    var total = pageCount();
    index = ((page % total) + total) % total;
    var step = perView() * (cardSize() + gap);
    track.style.transform = "translateX(" + -index * step + "px)";
    updateDots();
  }

  prev.addEventListener("click", function () {
    go(index - 1);
  });
  next.addEventListener("click", function () {
    go(index + 1);
  });

  root.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") go(index - 1);
    if (event.key === "ArrowRight") go(index + 1);
  });
  root.setAttribute("tabindex", "0");

  if (mq.addEventListener) mq.addEventListener("change", function () {
    index = 0;
    renderDots();
    layout();
  });
  window.addEventListener("resize", layout);

  renderDots();
  layout();
})();

(function () {
  document.querySelectorAll("[data-photo-carousel]").forEach(function (root) {
    var slides = Array.prototype.slice.call(root.querySelectorAll(".photo-carousel__track img"));
    var prev = root.querySelector(".photo-carousel__nav--prev");
    var next = root.querySelector(".photo-carousel__nav--next");
    var dotsWrap = root.querySelector(".photo-carousel__dots");
    var index = 0;

    function renderDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = "";
      slides.forEach(function (_, i) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.setAttribute("aria-label", "Show photo " + (i + 1) + " of " + slides.length);
        dot.addEventListener("click", function () {
          go(i);
        });
        dotsWrap.appendChild(dot);
      });
    }

    function go(page) {
      index = ((page % slides.length) + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === index);
      });
      if (!dotsWrap) return;
      Array.prototype.forEach.call(dotsWrap.children, function (dot, i) {
        if (i === index) dot.setAttribute("aria-current", "true");
        else dot.removeAttribute("aria-current");
      });
    }

    prev.addEventListener("click", function () {
      go(index - 1);
    });
    next.addEventListener("click", function () {
      go(index + 1);
    });

    renderDots();
    go(0);
  });
})();

(function () {
  var rules = document.querySelectorAll("[data-section-rule]");
  if (!rules.length) return;

  if (!("IntersectionObserver" in window)) {
    rules.forEach(function (rule) {
      rule.classList.add("is-in");
    });
    return;
  }

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.4 }
  );

  rules.forEach(function (rule) {
    io.observe(rule);
  });
})();
