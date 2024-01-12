Feature: The user can connect to a wallet

  Background:
    Given The user is in the homepage

  Scenario Outline: The user can see every wallet option
    When The user click the CTA to connect to a wallet
    Then The user should see every wallet option

