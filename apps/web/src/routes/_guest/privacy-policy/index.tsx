import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_guest/privacy-policy/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_guest/privacy-policy/"!</div>
}
