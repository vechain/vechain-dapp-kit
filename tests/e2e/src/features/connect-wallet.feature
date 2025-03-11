Feature: The user can connect to a wallet

  Background:
    * The user has previously onboarded
    * The user has unlocked VeWorld

  Scenario: the user can connect and disconnect from the wallet
    * The user connect to VeWorld wallet in dapp "<dapp>"
    * The user disconnect from the wallet
    * The user connect to VeWorld wallet with custom button in dapp "<dapp>"
    * The user disconnect from the wallet with custom button
    Examples:
      | dapp    |
      | remix   |
      | react   |
      | next    |
      | svelte  |
      | vue     |
      | angular |
      | vanilla |

  Scenario: the user can send a transaction
    * The user connect to VeWorld wallet in dapp "<dapp>"
    * The user sends a transaction
    Examples:
      | dapp    |
      | remix   |
      | react   |
      | next    |
      | svelte  |
      | vue     |
      | angular |
      | vanilla |


  Scenario: the user can sign typed data
    * The user connect to VeWorld wallet in dapp "<dapp>"
    * The user signs typed data
    Examples:
      | dapp    |
      | remix   |
      | react   |
      | next    |
      | svelte  |
      | vue     |
      | angular |
      | vanilla |
