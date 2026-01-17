// Error pages layout - minimal without client-side analytics
// This prevents SSR issues during static generation

export default function ErrorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
