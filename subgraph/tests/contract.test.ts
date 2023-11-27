import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as"
import { BigInt } from "@graphprotocol/graph-ts"
import { Deposit } from "../generated/schema"
import { Deposit as DepositEvent } from "../generated/Contract/Contract"
import { handleDeposit } from "../src/contract"
import { createDepositEvent } from "./contract-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let vaultId = BigInt.fromI32(234)
    let newDepositEvent = createDepositEvent(vaultId)
    handleDeposit(newDepositEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("Deposit created and stored", () => {
    assert.entityCount("Deposit", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "Deposit",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "vaultId",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
