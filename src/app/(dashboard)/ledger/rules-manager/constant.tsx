import useLedgerRules from '../../../../hooks/ledger/rule-manager/use-ledger-rules';
import DeleteConfirmation from '../../../../components/ledger/rule-manager/delete-confirmation';
import RuleSheet from '../../../../components/ledger/rule-manager/rule-sheet';
import { useToast } from '../../../../utils/show-toasts';

export const toSnakeCase = (str: string) => {
  return str
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^\w_]+/g, '');
};

export const columns = (accounts: string[], handleFetchRules: () => void) => [
  {
    header: 'ID',
    accessorKey: 'id',
  },
  {
    header: 'Name',
    accessorKey: 'name',
    cell: (info: { getValue: () => void }) => (
      <h1 className="font-normal tracking-wider cursor-pointer">{info.getValue()!}</h1>
    ),
  },
  {
    header: 'From',
    accessorKey: 'from_account',
    cell: (info: { getValue: () => void }) => {
      const accountId = info.getValue()!;
      const account = accounts.find(acc => acc === accountId)!;
      return <h1 className="font-normal tracking-wider cursor-pointer">{account}</h1>;
    },
  },
  {
    header: 'To',
    accessorKey: 'to_account',
    cell: (info: { getValue: () => void }) => {
      const accountId = info.getValue()!;
      const account = accounts.find(acc => acc === accountId)!;
      return <h1 className="font-normal tracking-wider cursor-pointer">{account}</h1>;
    },
  },
  {
    header: 'Condition',
    accessorKey: 'condition_type',
    cell: (info: { getValue: () => string; row: { original: { rule_amount: string } } }) => {
      const conditionType = info.getValue()!;
      const ruleAmount = info.row.original.rule_amount;
      return (
        <div className="text-sm">{`Balance ${toSnakeCase(conditionType)} ${ruleAmount} ₹`}</div>
      );
    },
  },
  {
    header: 'Pay Amount',
    accessorKey: 'pay_amount',
    cell: (info: { getValue: () => void }) => (
      <h1 className="font-normal tracking-wider cursor-pointer">{info.getValue()!}</h1>
    ),
  },
  {
    header: 'Payout Date',
    accessorKey: 'payout_date',
    cell: (info: { getValue: () => void }) => (
      <h1 className="font-normal tracking-wider cursor-pointer">{info.getValue()!}</h1>
    ),
  },
  {
    header: 'Mode of Payment',
    accessorKey: 'mode_of_payment',
    cell: (info: { getValue: () => void }) => (
      <h1 className="font-normal tracking-wider cursor-pointer">{info.getValue()!}</h1>
    ),
  },
  {
    header: 'Last Evaluated',
    accessorKey: 'last_evaluated',
    //@ts-expect-error cell types not compatible
    cell: ({ cell }) => {
      const timestamp = cell.getValue();
      return timestamp ? new Date(timestamp).toLocaleString() : 'N/A';
    },
  },
  {
    header: 'Actions',
    //@ts-expect-error row types not compatible
    cell: ({ row }) => {
      const { handleDeleteRules } = useLedgerRules();
      const ruleData = row.original;
      const ruleId = row.original.id;
      const { showToast } = useToast();

      const handleDelete = async () => {
        try {
          const success = await handleDeleteRules(ruleId);
          if (success) {
            handleFetchRules();
          } else {
            showToast('Please try later', 'warning');
          }
        } catch {
          showToast('An error occurred', 'error');
        }
      };

      return (
        <div className="flex gap-2">
          <RuleSheet
            mode="edit"
            rule={ruleData}
            ruleID={ruleId}
            handleFetchRules={handleFetchRules}
          />
          <DeleteConfirmation onConfirm={handleDelete} />
        </div>
      );
    },
  },
];

export const RULE_FREQUENCIES = [
  { value: 'EOD', label: 'End of Day' },
  // { value: "HOURLY", label: "Hourly" },
  // { value: "DAILY", label: "Daily" },
];

export const CONDITION_TYPES = [
  { value: 'greater_than', label: 'Greater Than' },
  { value: 'less_than', label: 'Less Than' },
  // { value: "equal_to", label: "Equal To" },
];

export const CONDITION_FIELDS = [{ value: 'balance', label: 'Balance' }];
