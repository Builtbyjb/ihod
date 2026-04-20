import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_guest/terms-of-service/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_guest/terms-of-service/"!</div>
}
