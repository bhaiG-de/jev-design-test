import { icons, SparklesIcon, type LucideProps } from "lucide-react"

// Efferd blocks reference an `IconPlaceholder` their site resolves at build
// time from per-library icon names. Resolve the lucide name when we have it,
// otherwise fall back to a neutral icon; the other libraries are ignored.
type Props = LucideProps & {
  lucide?: string
  hugeicons?: string
  phosphor?: string
  remixicon?: string
  tabler?: string
}

function toPascal(name: string) {
  return name.replace(/(^|[-_ ])(\w)/g, (_, __, c: string) => c.toUpperCase())
}

export function IconPlaceholder({ lucide, hugeicons, phosphor, remixicon, tabler, ...props }: Props) {
  void hugeicons; void phosphor; void remixicon; void tabler
  const Icon = (lucide && (icons as Record<string, typeof SparklesIcon>)[toPascal(lucide)]) || SparklesIcon
  return <Icon {...props} />
}
