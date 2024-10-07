import React, { ReactNode } from 'react'

type Props = {
   children: ReactNode
}

const layout = ({ children }: Props) => {
  return (
    <main>
      {children}
    </main>
  )
}

export default layout
