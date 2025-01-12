"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletButton } from "../solana/solana-provider";
import { AppHero, ellipsify } from "../ui/ui-layout";
import { ExplorerLink } from "../cluster/cluster-ui";
import { useSolanajournaldappProgram } from "./solanajournaldapp-data-access";
import { JournalCreate } from "./solanajournaldapp-ui";

export default function SolanajournaldappFeature() {
  const { publicKey } = useWallet();
  const { programId } = useSolanajournaldappProgram();

  return publicKey ? (
    <div className="w-screen h-full flex items-center justify-center">
      <JournalCreate />
    </div>
  ) : (
    <div className="max-w-4xl mx-auto">
      <div className="hero py-[64px]">
        <div className="hero-content text-center">
          <WalletButton />
        </div>
      </div>
    </div>
  );
}
