import { deleteAccountAction } from "@/lib/actions";

type DeleteAccountFormProps = {
  accountId: string;
  accountName: string;
};

export function DeleteAccountForm({ accountId, accountName }: DeleteAccountFormProps) {
  return (
    <form action={deleteAccountAction} className="rounded-[24px] border border-ember/20 bg-ember/8 p-5">
      <input type="hidden" name="accountId" value={accountId} />
      <p className="font-medium text-ink">Delete {accountName}</p>
      <p className="mt-2 text-sm text-ink/65">
        This removes the account and all imported trades for it. Use only when you want to clear the journal completely.
      </p>
      <button className="mt-4 w-full rounded-full border border-ember/35 px-4 py-2 text-sm font-medium text-[#8E4B38] transition hover:bg-ember/10 sm:w-fit">
        Delete account
      </button>
    </form>
  );
}
