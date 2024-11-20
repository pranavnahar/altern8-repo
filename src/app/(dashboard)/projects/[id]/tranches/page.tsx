import React from 'react'
import { fetchTranches } from './_actions/fetch-tranches.actions'
import BasicTable from '@/components/global/basic-table'
import trancheColumns from './columns'

type Props = {
  params: {
    id: string
  }
}

const Page = async ({ params }: Props) => {
  const projectId = params.id
  const data = await fetchTranches(projectId)

  return (
    <div>
      <h1 className='text-4xl text-white tracking-tight text-center'>Tranches</h1>
      <BasicTable data={data.results} columns={trancheColumns} filters={[]} needFilters={false} />
    </div>
  )
}

export default Page
