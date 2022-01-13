/// <reference types="cypress"/>

describe("Cypress basics", () => {
  it.only("Should visit a page and assert title", () => {
    cy.visit("https://www.wcaquino.me/cypress/componentes.html");

    cy.title().should("be.equal", "Campo de Treinamento");
    cy.title().should("contain", "Campo");

    cy.title()
      .should("be.equal", "Campo de Treinamento")
      .and("contain", "Campo");

    let syncTitle;

    cy.title().then((title) => {
      cy.get("#formNome").type(title);
      console.log(title);
      syncTitle = title;
    });

    cy.get("[data-cy=dataSobrenome]").then((el) => el.val(syncTitle));
    cy.get("#elementosForm\\:sugestoes").then((el) =>
      cy.wrap(el).type(syncTitle)
    );
  });

  it("Should find and interact with an element", () => {
    cy.visit("https://www.wcaquino.me/cypress/componentes.html");

    cy.get("#buttonSimple").click();
    cy.get("#buttonSimple").should("have.value", "Obrigado!");
  });
});
