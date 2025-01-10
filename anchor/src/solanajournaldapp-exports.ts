// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { Cluster, PublicKey } from "@solana/web3.js";
import SolanajournaldappIDL from "../target/idl/solanajournaldapp.json";
import type { Solanajournaldapp } from "../target/types/solanajournaldapp";

// Re-export the generated IDL and type
export { Solanajournaldapp, SolanajournaldappIDL };

// The programId is imported from the program IDL.
export const SOLANAJOURNALDAPP_PROGRAM_ID = new PublicKey(
  SolanajournaldappIDL.address,
);

// This is a helper function to get the Solanajournaldapp Anchor program.
export function getSolanajournaldappProgram(
  provider: AnchorProvider,
  address?: PublicKey,
) {
  return new Program(
    {
      ...SolanajournaldappIDL,
      address: address ? address.toBase58() : SolanajournaldappIDL.address,
    } as Solanajournaldapp,
    provider,
  );
}

// This is a helper function to get the program ID for the Solanajournaldapp program depending on the cluster.
export function getSolanajournaldappProgramId(cluster: Cluster) {
  switch (cluster) {
    case "devnet":
    case "testnet":
      // This is the program ID for the Solanajournaldapp program on devnet and testnet.
      return new PublicKey("4jKysN18C1QfBvNNKbRCx7pBy21eeLiiyxLfuETpnG16");
    case "mainnet-beta":
    default:
      return SOLANAJOURNALDAPP_PROGRAM_ID;
  }
}
