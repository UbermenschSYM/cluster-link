import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { ClusterLink } from "../target/types/cluster_link";

describe("cluster-link", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.ClusterLink as Program<ClusterLink>;

  it("Testing SDK!", async () => {
    // Add your test here.
    
  });
});
