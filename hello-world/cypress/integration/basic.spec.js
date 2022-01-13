/// <reference types="cypress"/>

//https://www.wcaquino.me/cypress/componentes.html

describe("Cypress basics", () => {
  it("Should visit a page and assert title", () => {
    cy.visit("https://www.wcaquino.me/cypress/componentes.html");

    cy.title().should("be.equal", "Campo de Treinamento");
    cy.title().should("contain", "Campo");

    cy.title()
      .should("be.equal", "Campo de Treinamento")
      .and("contain", "Campo");

    cy.title().then((title) => {
      console.log(title);
    });
  });

  it("Should find and interact with an element", () => {
    cy.visit("https://www.wcaquino.me/cypress/componentes.html");

    cy.get("#buttonSimple").click();
    cy.get("#buttonSimple").should("have.value", "Obrigado!");
  });
});
