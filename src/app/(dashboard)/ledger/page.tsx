import BasicTable from "@/components/global/basic-table"
import { getLedgerDetails } from "./actions"
import TransactionSheet from "./components/transaction-sheet"
import { accountsColumns } from "./columns"

const Page = async () => {
  const { accounts, otherAccounts, trancheIDs } = await getLedgerDetails()
  console.log("ledeger detials are as follows: ", accounts)

  const allAccounts = [...accounts, ...otherAccounts]

  return (
    <div className="min-h-screen">
      <div className="flex justify-between items-center">
        <div></div>
        <h1 className="text-5xl text-center font-relative-medium text-white-font">Accounts</h1>
        <TransactionSheet
          accounts={allAccounts}
          trancheIds={trancheIDs}
          mode="add"
        />
      </div>
      <BasicTable
        data={accounts}
        columns={accountsColumns}
        filters={[]}
        needFilters={false}
      />
    </div>
  )
}

export default Page
