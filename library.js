function wrapCallback(cb) {
  return (...args) => wrapper(cb, ...args)
}

function addFlashingRect(bounds, style = {}, innerHTML, isIntersecting) {
  const { width, left, height, top } = bounds
  const div = document.createElement("div")
  div.style.position = "fixed"
  div.style.width = width + "px"
  div.style.left = left + "px"
  div.style.top = top + "px"
  div.style.height = height + "px"
  div.style.pointerEvents = "none"
  div.style.zIndex = 2000

  div.style.transition = "opacity 5s ease-in"
  const text = document.createElement("span")
  innerHTML ? (text.innerHTML = innerHTML) : null
  text.style.backgroundColor = isIntersecting
    ? iodOptions.enterColor
    : iodOptions.exitColor

  div.appendChild(text)

  Object.assign(div.style, style)
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      div.style.opacity = 0
    })
  )
  div.addEventListener("transitionend", () => {
    document.body.removeChild(div)
  })
  document.body.appendChild(div)
  return div
}

const iodOptions = {
  rootColor: "#9428AB",
  enterColor: "#B35C00",
  exitColor: "#035570",
  interColor: "#9CAF00BB",
}

function showEntry(entry) {
  const text = `${entry.target.id && "ID:" + entry.target.id}${
    entry.target.id && entry.target.className && "<br/>"
  }${
    entry.target.className && "Classes:" + entry.target.className
  }<br/>isIntersecting: ${entry.isIntersecting}`

  addFlashingRect(entry.intersectionRect, {
    backgroundColor: iodOptions.interColor,
  })

  addFlashingRect(
    entry.boundingClientRect,
    {
      border: `${Math.min(10, entry.boundingClientRect.height / 2)}px solid ${
        entry.isIntersecting ? iodOptions.enterColor : iodOptions.exitColor
      }`,
      overflow: "hidden",
      boxSizing: "border-box",
    },
    text,
    entry.isIntersecting
  )
  addFlashingRect(
    entry.rootBounds,
    {
      border: `${Math.min(10, entry.rootBounds.height / 2)}px solid ${
        iodOptions.rootColor
      }`,
      overflow: "hidden",
      boxSizing: "border-box",
    },
    text,
    entry.isIntersecting
  )
}

function wrapper(cb, entries, observer) {
  entries.forEach(showEntry)
  return cb(entries, observer)
}

if (typeof window != "undefined") {
  window.IntersectionObserver = class extends IntersectionObserver {
    constructor(cb, o) {
      super(wrapCallback(cb), o)
    }
  }
}
