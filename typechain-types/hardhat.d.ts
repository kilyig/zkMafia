/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from "ethers";
import {
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomiclabs/hardhat-ethers/types";

import * as Contracts from ".";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: "IProveRoleVerifier",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IProveRoleVerifier__factory>;
    getContractFactory(
      name: "IRoleRevealVerifier",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.IRoleRevealVerifier__factory>;
    getContractFactory(
      name: "Mafia",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Mafia__factory>;
    getContractFactory(
      name: "TurboVerifier",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.TurboVerifier__factory>;
    getContractFactory(
      name: "TurboVerifier",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.TurboVerifier__factory>;

    getContractAt(
      name: "IProveRoleVerifier",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IProveRoleVerifier>;
    getContractAt(
      name: "IRoleRevealVerifier",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.IRoleRevealVerifier>;
    getContractAt(
      name: "Mafia",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Mafia>;
    getContractAt(
      name: "TurboVerifier",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.TurboVerifier>;
    getContractAt(
      name: "TurboVerifier",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.TurboVerifier>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.utils.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
    getContractAt(
      nameOrAbi: string | any[],
      address: string,
      signer?: ethers.Signer
    ): Promise<ethers.Contract>;
  }
}
