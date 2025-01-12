"use client";

import { Keypair, PublicKey } from "@solana/web3.js";
import { useEffect, useMemo, useState } from "react";
import { ellipsify } from "../ui/ui-layout";
import { ExplorerLink } from "../cluster/cluster-ui";
import {
  useSolanajournaldappProgram,
  useSolanajournaldappProgramAccount,
} from "./solanajournaldapp-data-access";
import { useWallet } from "@solana/wallet-adapter-react";
import dayjs from "dayjs";

export function JournalCreate() {
  const { createEntry, accounts } = useSolanajournaldappProgram();
  const { publicKey } = useWallet();
  const { deleteEntry, updateEntry } = useSolanajournaldappProgramAccount({
    account: publicKey as PublicKey,
  });


  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const isFormValid = title.trim() !== "" && message.trim() !== "";

  const handlerSubmit = () => {
    createEntry.mutateAsync({ title, message, owner: publicKey });
  };





  if (!publicKey) {
    return <div>Connect your wallet</div>;
  }



  return (
    <div className="flex w-full h-full content-start flex-wrap p-[20px] gap-[15px]  overflow-y-auto">
      <div className="hover:bg-[rgba(0,0,0,0.5)] hover:backdrop-blur-xl transition-card backdrop-blur-md bg-[rgba(0,0,0,0.3)] text-white flex w-full sm:w-[250px] p-[15px]  flex-col items-center gap-[10px]  rounded-xl">
        <div>
          NEW</div>
        <input
          value={title}
          type="text"
          placeholder="title"
          onChange={(e) => setTitle(e.target.value)}
          className="w-full shadow-md p-4 outline-none rounded-md bg-[rgba(0,0,0,0.2)] "
        />

        <textarea
          value={message}
          placeholder="message"
          onChange={(e) => setMessage(e.target.value)}
          className="textarea textarea-bordered outline-none h-[200px] w-full bg-[rgba(0,0,0,0.2)] "
        ></textarea>

        <button
          onClick={handlerSubmit}
          disabled={!isFormValid || createEntry.isPending}
          className="btn btn-primary w-full  "
        >
          Create {createEntry.isPending && "..."}
        </button>
      </div>
      <JournalList></JournalList>

    </div>
  );
}

function JournalCard({ account }: { account: PublicKey }) {
  const { updateEntry, accountQuery, deleteEntry } = useSolanajournaldappProgramAccount({ account });
  const [title, setTitle] = useState(accountQuery.data?.title);
  const [message, setMessage] = useState(accountQuery.data?.message);

  useEffect(() => {
    if (accountQuery.isFetched) {
      setTitle(accountQuery.data?.title ?? "");
      setMessage(accountQuery.data?.message ?? "");
    }
  }, [accountQuery.isFetched, accountQuery.data]);

  if (accountQuery.isPending) {
    return (<span className="loading loading-spinner loading-lg"></span>)
  }

  const isFormValid = title?.trim() !== "" && message?.trim() !== "";
  const handlerUpdate = () => {
    updateEntry.mutateAsync({ title, message });
  }

  const handlerDelete = (title: string) => {
    deleteEntry.mutateAsync(title);
  };
  return (
    <div className="hover:bg-[rgba(0,0,0,0.5)] hover:backdrop-blur-xl transition-card backdrop-blur-md bg-[rgba(0,0,0,0.3)] text-white flex w-full sm:w-[250px] p-[15px]   flex-col items-center gap-[10px] relative  rounded-xl" >
      <div>
        <ExplorerLink
          path={`account/${account}`}
          label={ellipsify(account.toString())}
        /></div>
      <input
        value={title}
        type="text"
        placeholder="title"
        onChange={(e) => setTitle(e.target.value)}
        disabled
        className="w-full shadow-md p-4 outline-none rounded-md bg-[rgba(0,0,0,0.2)]"
      />

      <textarea
        value={message}
        placeholder="message"
        onChange={(e) => setMessage(e.target.value)}
        className="textarea textarea-bordered outline-none h-[200px] w-full bg-[rgba(0,0,0,0.2)]"
      ></textarea>

      <button
        onClick={handlerUpdate}
        disabled={!isFormValid || updateEntry.isPending}
        className="btn btn-primary w-full "
      >
        Update {updateEntry.isPending && "..."}
      </button>

      <div onClick={() => { handlerDelete(title as string) }} className={`w-[20px] h-[20px] rounded-[50%] flex items-center justify-center text-white ${deleteEntry.isPending ? 'bg-red-100 pointer-events-none' : 'bg-red-500 cursor-pointer'}  text-[12px] absolute top-[-10px] right-[-10px]`} >{deleteEntry.isPending ? '...' :
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>


      }</div>
    </div>)
}

function JournalList() {
  const { accounts } = useSolanajournaldappProgram();
  const { publicKey } = useWallet();
  if (accounts.data) {
    return (
      <>
        {accounts.data.filter(item => item.account.owner.equals(publicKey as PublicKey)).sort((a, b) => Number(b.account.timestamp) - Number(a.account.timestamp)).map((entry, index) => (
          <JournalCard account={entry.publicKey} key={entry.publicKey.toBase58()}></JournalCard>
        ))}
      </>
    );
  } else {
    return null;
  }
}



