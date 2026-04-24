import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/clients/$clientId/invoices/')({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/clients/$clientId",
      params: { clientId: params.clientId }
    })
  }
})
