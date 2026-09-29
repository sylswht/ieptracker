/* =========================================================
   PATHWAY — School Selector
   Polished, accessible, and resilient front-end behavior
   ========================================================= */

(() => {
  "use strict";

  /* ---------------------------------------------------------
     School data
     --------------------------------------------------------- */

  const schools = [
    ["Castle High School", "• High School • Student support"],
    // Add additional schools here:
    // ["School Name", "• High School • Student support"],
  ];


  /* ---------------------------------------------------------
     DOM references
     --------------------------------------------------------- */

  const card = document.getElementById("selectorCard");
  const input = document.getElementById("schoolSearch");
  const list = document.getElementById("schoolList");
  const empty = document.getElementById("empty");
  const clear = document.getElementById("clear");
  const btn = document.getElementById("continueBtn");
  const status = document.getElementById("status");

  const accessibilityBtn =
    document.getElementById("accessibilityBtn");

  const accessibilityPanel =
    document.getElementById("accessibilityPanel");

  const themeToggle =
    document.getElementById("themeToggle");


  /* ---------------------------------------------------------
     State
     --------------------------------------------------------- */

  let selected = "";
  let highlightedIndex = -1;

  const STORAGE_KEYS = {
    school: "pathwaySelectedSchool",
    darkMode: "pathwayDarkMode"
  };


  /* ---------------------------------------------------------
     Utility helpers
     --------------------------------------------------------- */

  function escapeHTML(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }


  function announce(message) {
    if (!status) return;

    status.textContent = message;

    /*
      Briefly make the status visible to screen readers without
      unnecessarily moving focus around the page.
    */
    status.setAttribute("aria-live", "polite");
  }


  function schoolIcon() {
    return `
      <span class="building" aria-hidden="true">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          focusable="false"
        >
          <path
            d="M4 20h16
               M6 20V8.8L12 5l6 3.8V20
               M9 20v-5h6v5
               M8 10.5h8"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>
    `;
  }


  function getOptions() {
    return list
      ? Array.from(list.querySelectorAll(".option"))
      : [];
  }


  /* ---------------------------------------------------------
     Search / rendering
     --------------------------------------------------------- */

  function render() {
    if (!input || !list) return;

    const query = input.value.trim().toLowerCase();

    const matches = schools.filter((school) => {
      const name = school[0].toLowerCase();
      const meta = school[1].toLowerCase();

      return (
        name.includes(query) ||
        meta.includes(query)
      );
    });

    list.innerHTML = "";
    highlightedIndex = -1;

    if (empty) {
      empty.hidden = matches.length !== 0;
    }

    if (clear) {
      clear.classList.toggle("show", Boolean(query));
      clear.hidden = !query;
    }

    matches.forEach((school) => {
      const [name, meta] = school;

      const option = document.createElement("button");

      option.type = "button";
      option.className = "option";
      option.setAttribute("role", "option");
      option.setAttribute(
        "aria-selected",
        String(selected === name)
      );

      option.innerHTML = `
        ${schoolIcon()}
        <span class="option-content">
          <span class="option-name">
            ${escapeHTML(name)}
          </span>
          <span class="option-meta">
            ${escapeHTML(meta)}
          </span>
        </span>
      `;

      option.addEventListener("click", () => {
        selectSchool(name);
      });

      option.addEventListener("mouseenter", () => {
        highlightedIndex =
          getOptions().indexOf(option);

        updateHighlight();
      });

      list.appendChild(option);
    });

    /*
      Give the listbox a useful accessible state.
    */
    list.setAttribute(
      "aria-label",
      matches.length
        ? `${matches.length} school${matches.length === 1 ? "" : "s"} found`
        : "No schools found"
    );
  }


  /* ---------------------------------------------------------
     Dropdown state
     --------------------------------------------------------- */

  function openSelector() {
    if (!card || !input) return;

    card.classList.add("open");

    input.setAttribute("aria-expanded", "true");

    render();
  }


  function closeSelector() {
    if (!card || !input) return;

    card.classList.remove("open");

    input.setAttribute("aria-expanded", "false");

    highlightedIndex = -1;
  }


  /* ---------------------------------------------------------
     Highlight / keyboard navigation
     --------------------------------------------------------- */

  function updateHighlight() {
    const options = getOptions();

    options.forEach((option, index) => {
      const isHighlighted =
        index === highlightedIndex;

      option.classList.toggle(
        "keyboard-highlight",
        isHighlighted
      );

      if (isHighlighted) {
        option.scrollIntoView({
          block: "nearest"
        });
      }
    });
  }


  function moveHighlight(direction) {
    const options = getOptions();

    if (!options.length) return;

    if (highlightedIndex === -1) {
      highlightedIndex =
        direction > 0 ? 0 : options.length - 1;
    } else {
      highlightedIndex += direction;

      if (highlightedIndex < 0) {
        highlightedIndex = options.length - 1;
      }

      if (highlightedIndex >= options.length) {
        highlightedIndex = 0;
      }
    }

    updateHighlight();
  }


  /* ---------------------------------------------------------
     School selection
     --------------------------------------------------------- */

  function selectSchool(name) {
    if (!name) return;

    selected = name;

    if (input) {
      input.value = name;
    }

    if (btn) {
      btn.disabled = false;
      btn.classList.add("ready");
    }

    announce("");

    /*
      Remember the user's choice so returning to the page
      feels intentional rather than resetting everything.
    */
    try {
      localStorage.setItem(
        STORAGE_KEYS.school,
        name
      );
    } catch (error) {
      // Storage may be disabled; selection still works.
    }

    closeSelector();
    render();
  }


  /* ---------------------------------------------------------
     Clear selection
     --------------------------------------------------------- */

  function clearSelection() {
    selected = "";

    if (input) {
      input.value = "";
    }

    if (btn) {
      btn.disabled = true;
      btn.classList.remove("ready");
    }

    try {
      localStorage.removeItem(
        STORAGE_KEYS.school
      );
    } catch (error) {
      // Ignore storage errors.
    }

    announce("");

    render();

    if (input) {
      input.focus();
    }
  }


  /* ---------------------------------------------------------
     Input behavior
     --------------------------------------------------------- */

  if (input) {
    input.addEventListener("focus", () => {
      openSelector();
    });

    input.addEventListener("click", () => {
      openSelector();
    });

    input.addEventListener("input", () => {
      /*
        Typing means the previously selected school should no
        longer be considered valid until the user selects one.
      */
      selected = "";

      if (btn) {
        btn.disabled = true;
        btn.classList.remove("ready");
      }

      announce("");

      openSelector();
      render();
    });


    input.addEventListener("keydown", (event) => {
      switch (event.key) {

        case "ArrowDown":
          event.preventDefault();
          openSelector();
          moveHighlight(1);
          break;


        case "ArrowUp":
          event.preventDefault();
          openSelector();
          moveHighlight(-1);
          break;


        case "Enter": {
          const options = getOptions();

          if (
            card &&
            card.classList.contains("open") &&
            highlightedIndex >= 0 &&
            options[highlightedIndex]
          ) {
            event.preventDefault();

            const selectedOption =
              options[highlightedIndex];

            const name =
              selectedOption.querySelector(
                ".option-name"
              )?.textContent.trim();

            if (name) {
              selectSchool(name);
            }
          }

          break;
        }


        case "Escape":
          event.preventDefault();

          closeSelector();
          input.blur();

          break;


        case "Tab":
          closeSelector();
          break;
      }
    });
  }


  /* ---------------------------------------------------------
     Clear button
     --------------------------------------------------------- */

  if (clear) {
    clear.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      clearSelection();
    });
  }


  /* ---------------------------------------------------------
     Outside click
     --------------------------------------------------------- */

  document.addEventListener("click", (event) => {
    if (
      card &&
      !card.contains(event.target)
    ) {
      closeSelector();
    }
  });


  /* ---------------------------------------------------------
     Continue button
     --------------------------------------------------------- */

  if (btn) {
    btn.addEventListener("click", () => {
      if (!selected) {
        announce(
          "Please select your school before continuing."
        );

        if (input) {
          input.focus();
        }

        return;
      }

      /*
        Prevent double-clicking while the transition runs.
      */
      btn.disabled = true;
      btn.classList.add("loading");

      announce(
        `Opening ${selected}…`
      );

      /*
        Give the interface a small amount of feedback before
        navigating. Change the destination below to the page
        you want the Continue button to open.
      */
      setTimeout(() => {

        /*
          If your new site has a school-specific page,
          you can replace this with something like:

          window.location.href =
            "dashboard.html?school=" +
            encodeURIComponent(selected);
        */

        announce(
          `${selected} selected.`
        );

        btn.disabled = false;
        btn.classList.remove("loading");

      }, 650);
    });
  }


  /* =========================================================
     ACCESSIBILITY PANEL
     ========================================================= */

  function closeAccessibilityPanel() {
    if (!accessibilityPanel || !accessibilityBtn) {
      return;
    }

    accessibilityPanel.classList.remove("open");

    accessibilityBtn.setAttribute(
      "aria-expanded",
      "false"
    );
  }


  function openAccessibilityPanel() {
    if (!accessibilityPanel || !accessibilityBtn) {
      return;
    }

    accessibilityPanel.classList.add("open");

    accessibilityBtn.setAttribute(
      "aria-expanded",
      "true"
    );
  }


  if (accessibilityBtn) {
    accessibilityBtn.addEventListener("click", (event) => {
      event.stopPropagation();

      const isOpen =
        accessibilityPanel?.classList.contains("open");

      if (isOpen) {
        closeAccessibilityPanel();
      } else {
        openAccessibilityPanel();
      }
    });
  }


  if (accessibilityPanel) {
    accessibilityPanel.addEventListener(
      "click",
      (event) => {
        event.stopPropagation();
      }
    );
  }


  document.addEventListener("click", (event) => {
    const accessibilityWrap =
      document.querySelector(
        ".accessibility-wrap"
      );

    if (
      accessibilityWrap &&
      !accessibilityWrap.contains(event.target)
    ) {
      closeAccessibilityPanel();
    }
  });


  /* =========================================================
     DARK MODE
     ========================================================= */

  function setDarkMode(enabled, save = true) {
    const html = document.documentElement;

    html.classList.toggle(
      "dark",
      enabled
    );

    if (themeToggle) {
      themeToggle.classList.toggle(
        "active",
        enabled
      );

      themeToggle.setAttribute(
        "aria-checked",
        String(enabled)
      );
    }

    if (save) {
      try {
        localStorage.setItem(
          STORAGE_KEYS.darkMode,
          enabled ? "on" : "off"
        );
      } catch (error) {
        // Ignore storage errors.
      }
    }
  }


  function getInitialTheme() {
    /*
      First preference: saved user choice.
    */
    try {
      const saved =
        localStorage.getItem(
          STORAGE_KEYS.darkMode
        );

      if (saved === "on") return true;
      if (saved === "off") return false;
    } catch (error) {
      // Continue to system preference.
    }

    /*
      Second preference: operating system/browser theme.
    */
    return (
      window.matchMedia &&
      window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches
    );
  }


  setDarkMode(
    getInitialTheme(),
    false
  );


  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentlyDark =
        document.documentElement.classList.contains(
          "dark"
        );

      setDarkMode(!currentlyDark);
    });
  }


  /*
    If the user hasn't manually chosen a theme, respond to
    operating-system theme changes.
  */
  if (window.matchMedia) {
    const mediaQuery =
      window.matchMedia(
        "(prefers-color-scheme: dark)"
      );

    mediaQuery.addEventListener?.(
      "change",
      (event) => {
        let saved = null;

        try {
          saved = localStorage.getItem(
            STORAGE_KEYS.darkMode
          );
        } catch (error) {
          // Ignore.
        }

        if (saved === null) {
          setDarkMode(
            event.matches,
            false
          );
        }
      }
    );
  }


  /* =========================================================
     RESTORE PREVIOUS SCHOOL
     ========================================================= */

  function restoreSchool() {
    let savedSchool = null;

    try {
      savedSchool =
        localStorage.getItem(
          STORAGE_KEYS.school
        );
    } catch (error) {
      return;
    }

    if (!savedSchool) return;

    const exists = schools.some(
      (school) =>
        school[0] === savedSchool
    );

    if (!exists) return;

    selected = savedSchool;

    if (input) {
      input.value = savedSchool;
    }

    if (btn) {
      btn.disabled = false;
      btn.classList.add("ready");
    }
  }


  restoreSchool();


  /* =========================================================
     ACCESSIBILITY — REDUCED MOTION
     ========================================================= */

  const reducedMotion =
    window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    );

  if (reducedMotion?.matches) {
    document.documentElement.classList.add(
      "reduce-motion"
    );
  }


  reducedMotion?.addEventListener?.(
    "change",
    (event) => {
      document.documentElement.classList.toggle(
        "reduce-motion",
        event.matches
      );
    }
  );


  /* =========================================================
     GLOBAL ESCAPE HANDLING
     ========================================================= */

  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key !== "Escape") {
        return;
      }

      closeSelector();
      closeAccessibilityPanel();
    }
  );


  /* =========================================================
     INITIAL RENDER
     ========================================================= */

  render();

})();
