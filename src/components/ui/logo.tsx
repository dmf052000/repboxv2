export function Logo({ className, ...props }: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props} className={className}>
      {/* 3D Box icon */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2L3 7v10l9 5 9-5V7l-9-5zm-7 5.5L12 4l7 3.5L12 11 5 7.5zM4 8.5v8l7 3.5v-8L4 8.5zm9 11.5l7-3.5v-8l-7 3.5v8z"
      />
    </svg>
  )
}
