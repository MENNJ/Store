import { ModalProvider } from '@/providers/modal-store'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className='w-full h-full flex flex-col'>
          <ModalProvider />
          {children}
    </main>
  )
}