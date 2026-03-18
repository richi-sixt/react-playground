/**
 * Demo box for rendering live React component previews inside MDX content.
 * Uses `not-prose` to escape Tailwind typography styles and
 * `preview-defaults` to restore native browser appearance for form elements
 * (buttons, inputs, selects, textareas) that Tailwind's preflight resets.
 */
export function Preview({ children }: { children: React.ReactNode }) {
  return (
    <div className="not-prose preview-defaults my-7 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800/50">
      {children}
    </div>
  )
}
