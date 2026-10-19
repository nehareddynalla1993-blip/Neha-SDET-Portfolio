Feature: Identity Desk access control
  As a quality engineer
  I want identity access controls verified through user-facing behavior
  So that privileged functions remain inaccessible to unauthorized roles

  Scenario: Analyst cannot provision users
    Given I open the fictional Identity Desk
    When I sign in as an "analyst"
    Then I should see the "analyst" role
    And I should not see the provisioning controls

  Scenario: Admin completes MFA and provisions a viewer
    Given I open the fictional Identity Desk
    When I sign in as an "admin"
    And I verify the demonstration MFA code
    Then I should see the "admin" role
    And I should see the provisioning controls
    When I provision "example.viewer@demo.test" as a "viewer"
    Then I should see a confirmation for "example.viewer@demo.test"
