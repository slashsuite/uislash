/**
 * JavaScript to inline once on a page that is rendered to static HTML and never hydrated, so every
 * `CopyButton` (and the `CopyLine`, `CodeBlock` and `CodeExample` copy buttons) works there too.
 * One click listener on `document` reads what to copy from the button's `data-copy-text`, writes the
 * clipboard, then does what `CopyButton` does: cancels a run in progress, holds the copied (or, on a
 * refused or missing clipboard, the failed) label in view for two seconds with two Web Animations,
 * and puts a new node holding that label in the status region beside the button, so a screen reader
 * hears each press; the run's end empties the region. No timer and no stylesheet. Whichever of the
 * script and a hydrated button's own handler hears a click first copies and flags the event
 * (`copyHandled`), and the other skips it: one copy per click.
 */
export const copyScript: string = `document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-copy-text]"),c=navigator.clipboard;if(!b||e.copyHandled||b.disabled)return;e.copyHandled=1;function f(k){var s=b.querySelector("[data-copy-"+k+"]"),i=b.querySelector("[data-copy-idle]"),r=b.nextElementSibling;if(!r||!r.matches("[data-copy-status]"))r=null;if(r)r.replaceChildren(s?s.textContent:"");if(!s||!s.animate||!i)return;b.getAnimations({subtree:true}).forEach(function(a){a.cancel()});i.animate({visibility:["hidden","hidden"]},2e3);s.animate({visibility:["visible","visible"]},2e3).onfinish=function(){if(r)r.replaceChildren()}}if(!c)return f("failed");c.writeText(b.dataset.copyText).then(function(){f("done")},function(){f("failed")})})`;
