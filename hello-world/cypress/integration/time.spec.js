/// <reference types="cypress"/>

describe("Dinamic tests", () => {
  beforeEach(() => {
    cy.visit("https://www.wcaquino.me/cypress/componentes.html");
  });

  it('Going back to the past', () => {
    cy.get('#buttonNow').click();
    cy.get('#resultado > span').should('contain', '22/01/2022');

    // cy.clock();
    // cy.get('#buttonNow').click();
    // cy.get('#resultado > span').should('contain', '31/12/1969');

    const dt = new Date(2012, 3, 10, 15, 23, 50);
    cy.clock(dt.getTime());
    cy.get('#buttonNow').click();
    cy.get('#resultado > span').should('contain', '10/04/2012');
  });

  it.only('Goes to the future', () => {
    cy.get('#buttonTimePassed').click();
    cy.get('#resultado > span').invoke('text').should('gt', 1334082230000);

    cy.clock();
    cy.get('#buttonTimePassed').click();
    cy.get('#resultado > span').invoke('text').should('lte', 0);

    // cy.wait(1000);
    // cy.get('#buttonTimePassed').click();
    // cy.get('#resultado > span').invoke('text').should('gte', 1000);

    cy.tick(1000);
    cy.get('#buttonTimePassed').click();
    cy.get('#resultado > span').invoke('text').should('gte', 1000);
  });
});
