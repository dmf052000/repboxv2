import clsx from 'clsx'

type HeadingProps = { level?: 1 | 2 | 3 | 4 | 5 | 6 } & React.ComponentPropsWithoutRef<
  'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
>

export function Heading({ className, level = 1, ...props }: HeadingProps) {
  let Element: `h${typeof level}` = `h${level}`

  return (
    <Element
      {...props}
      className={clsx(
        className,
        level === 1 && 'text-3xl/9 font-bold text-zinc-900 sm:text-2xl/8 dark:text-white',
        level === 2 && 'text-2xl/8 font-semibold text-zinc-900 sm:text-xl/8 dark:text-white',
        level === 3 && 'text-xl/7 font-semibold text-zinc-900 sm:text-lg/7 dark:text-white',
        level >= 4 && 'text-lg/7 font-semibold text-zinc-900 sm:text-base/7 dark:text-white'
      )}
    />
  )
}

export function Subheading({ className, level = 2, ...props }: HeadingProps) {
  let Element: `h${typeof level}` = `h${level}`

  return (
    <Element
      {...props}
      className={clsx(className, 'text-lg/7 font-semibold text-zinc-900 sm:text-base/7 dark:text-white')}
    />
  )
}
