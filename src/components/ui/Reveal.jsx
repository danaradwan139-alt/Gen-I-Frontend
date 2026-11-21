import useInView from '@/hooks/useInView'
import './Reveal.css'

/**
 * Scroll-reveal wrapper. Wrap anything; it fades/slides in once when it
 * enters the viewport. It adds no styling of its own beyond the animation.
 *
 * variant: 'up' | 'fade' | 'zoom' | 'left' | 'right' | 'stagger'
 *   'stagger' animates the direct children one after another (cards, logos…)
 * delay / duration: milliseconds
 */
export default function Reveal({
  as: Tag = 'div',
  variant = 'up',
  delay = 0,
  duration,
  threshold,
  className = '',
  style,
  children,
  ...rest
}) {
  const [ref, inView] = useInView({ threshold })

  return (
    <Tag
      ref={ref}
      className={`reveal reveal-${variant} ${inView ? 'is-visible' : ''} ${className}`.trim()}
      style={{
        '--reveal-delay': `${delay}ms`,
        ...(duration ? { '--reveal-duration': `${duration}ms` } : null),
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  )
}