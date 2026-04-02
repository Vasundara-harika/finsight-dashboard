import { useState, useEffect } from 'react'

/**
 * useCountUp — animates a number from 0 to the target value.
 * Used in SummaryCard and InsightCard for a smooth count-up effect.
 * @param {number} target - The final number to count up to
 * @param {number} duration - Animation duration in ms (default 1000)
 * @returns {number} The current animated value
 */
const useCountUp = (target, duration = 1000) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (target === 0) {
      setCount(0)
      return
    }

    let startTime = null
    let animationFrame

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      setCount(Math.floor(progress * target))
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [target, duration])

  return count
}

export default useCountUp
