import { ethers } from "hardhat";
import { runVerifierTests } from "./helpers/verifierTests";
import {
  GITCOIN_SCORE_SCHEMA,
  GITCOIN_STAMP_SCHEMA,
} from "./helpers/verifierTests";

runVerifierTests(
  "GitcoinVerifierWithVeraxPortal",
  async (contract, issuer, attester) => {
    const GitcoinVeraxPortal = await ethers.getContractFactory(
      "GitcoinVeraxPortal"
    );

    // You'd need to deploy or mock other contracts (IAttestationRegistry, ISchemaResolver) to initialize the portal
    const MockResolver = await ethers.getContractFactory("MockResolver"); // Assume you have mock contracts
    const MockRegistry = await ethers.getContractFactory(
      "VeraxAttestationRegistry"
    );
    const resolver = await MockResolver.deploy();
    const registry = await MockRegistry.deploy();

    const gitcoinVeraxPortal = await GitcoinVeraxPortal.deploy();
    await gitcoinVeraxPortal["initialize(address,address,address)"](
      attester,
      await resolver.getAddress(),
      await registry.getAddress()
    );

    await contract["initialize(address,address,address)"](
      issuer,
      attester,
      await gitcoinVeraxPortal.getAddress()
    );

    await gitcoinVeraxPortal.addToAllowlist(await contract.getAddress());
    await gitcoinVeraxPortal.addSchemaMapping(
      GITCOIN_SCORE_SCHEMA,
      GITCOIN_SCORE_SCHEMA
    );
    await gitcoinVeraxPortal.addSchemaMapping(
      GITCOIN_STAMP_SCHEMA,
      GITCOIN_STAMP_SCHEMA
    );
  }
);
