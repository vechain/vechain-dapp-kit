Feature: The user can connect to a wallet

  Background:
    * The user has previously onboarded
    * The user has unlocked VeWorld

  Scenario: the user can connect the wallet
    * The user connect to VeWorld wallet in dapp "<dapp>"
    Examples:
      | dapp |
      | angular |
      | vanilla |
      | react   |
      | next    |
      | svelte  |
      | vue     |
