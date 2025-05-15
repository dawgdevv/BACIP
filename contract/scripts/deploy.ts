import { ethers } from "hardhat";

async function main() {
  console.log("Deploying DegreeIssuance contract...");

  const DegreeIssuance = await ethers.getContractFactory("DegreeIssuance");
  const degreeIssuance = await DegreeIssuance.deploy();

  await degreeIssuance.waitForDeployment();

  console.log(`DegreeIssuance deployed to ${degreeIssuance.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
