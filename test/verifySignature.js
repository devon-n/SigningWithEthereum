const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("Verify Signature", function () {
  it("Should return the right hash and signer", async function () {

    const accounts = await ethers.getSigners(2)
    const VerifySignature = await ethers.getContractFactory("VerifySignature")

    const contract = await VerifySignature.deploy()
    await contract.deployed()

    // const PRIV_KEY = ''
    // const signer = new ethers.Wallet(PRIV_KEY)

    const signer = accounts[0]
    const to = accounts[1]
    const amount = 999
    const message = "Hello"
    const nonce = 123

    const hash = await contract.getMessageHash(to.address, amount, message, nonce)
    const sig = await signer.signMessage(ethers.utils.arrayify(hash))

    const ethHash = await contract.getEthSignedMessageHash(hash)
    const recoveredSigner = await contract.recoverSigner(ethHash, sig)

    expect(recoveredSigner == signer.address)

    expect(await contract.verify(signer.address, to.address, amount, message, nonce, sig)).to.equal(true)
    expect(await contract.verify(signer.address, to.address, amount + 1, message, nonce, sig)).to.equal(false)

  })
})
