// ==UserScript==
// @name         suite-helper
// @version      0.0
// @author       tnRaro
// @match        https://*.superb-ai.com/annotation/edit?*
// @grant        none
// ==/UserScript==

// const prefixSum = (s) => [
//   0,
//   ...Array.from(s, (c) => c.charCodeAt()).map(
//     (
//       (s) => (v) =>
//         (s += v)
//     )(0)
//   ),
// ];

// const matchSubstring = (s0, s1) => {
//   const ps0 = prefixSum(s0);
//   const ps1 = prefixSum(s1);

//   for (let l = 3; l > 0; l--) {
//     for (let i = 0; i < ps0.length; i++) {
//       for (let j = 0; j < ps1.length; j++) {
//         const p0 = ps0[i + l] - ps0[i];
//         const p1 = ps1[j + l] - ps1[j];
//         if (p0 === p1) {
//           const ss0 = s0.slice(i, i + l);
//           const ss1 = s1.slice(j, j + l);
//           if (ss0 === ss1) {
//             console.log(i, j, l, ss0, ss1);
//           }
//         }
//       }
//     }
//   }
// };

// const matchSubstrings = (strings) => {
//   if (strings.length <= 1) {
//     return strings[0];
//   }
//   const pss = strings.map(prefixSum);
//   const [s0, ...srest] = strings;
//   const [ps0, ...psrest] = pss;
//   for (let l = 3; l > 0; l--) {
//     for (let i = 0; i < ps0.length; i++) {
//       const p0 = ps0[i + l] - ps0[i];
//       const ss0 = s0.slice(i, i + l);
//       let everyTestPassed = false;
//       for (const i in psrest) {
//         const psn = psrest[i];
//         const sn = srest[i];
//         for (let j = 0; j < psn.length; j++) {
//           const p1 = psn[j + l] - psn[j];

//           if (p0 === p1) {
//             const ssn = sn.slice(j, j + l);
//           }
//         }
//       }
//     }
//   }
// };

const getClasses = async (filename) => {
  const res = await fetch(`http://localhost:8080/classes/${filename}`);
  if (!res.ok) {
    throw res.statusText;
  }
  const classes = await res.json();
  return classes;
};

window.addEventListener("load", () => {
  document
    .getElementById("__next")
    .insertAdjacentHTML("afterEnd", "<div id='tnroot'></div>");
  const $tnroot = document.getElementById("tnroot");
  $tnroot.style.position = "absolute";
  $tnroot.style.left = "55px";
  $tnroot.style.top = "59px";
  $tnroot.style.fontSize = "13px";
  $tnroot.style.zIndex = "10000000000";
  $tnroot.addEventListener("click", () => {
    navigator.permissions.query({ name: "clipboard-write" }).then((result) => {
      if (result.state == "granted" || result.state == "prompt") {
        const s = $tnroot.textContent.split(",").map((s) => s.split("/")[0]);

        navigator.clipboard.writeText(s.join());
      }
    });
  });
  const update = () => {
    const $target = document.querySelector(".head");
    console.info($target);
    const changeText = (text) => {
      getClasses(text)
        .then((v) => {
          console.info(text, v);
          $tnroot.textContent = v;
        })
        .catch((error) => {
          alert(error);
        });
    };
    if ($target == null) {
      setTimeout(update, 500);
      return;
    }
    const observer = new MutationObserver((ms) => {
      console.log(ms);
      for (const m of ms) {
        if (m.type === "characterData") changeText(m.target.data);
      }
    });
    observer.observe($target, { characterData: true, subtree: true });
    changeText($target.textContent);
  };
  setTimeout(update, 500);
});
