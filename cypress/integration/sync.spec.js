/// <reference types="cypress"/>

describe("Esperas...", () => {
  before(() => {
    cy.visit("https://www.wcaquino.me/cypress/componentes.html");
  });

  beforeEach(() => {
    cy.reload();
  });

  it("Deve aguardar elemento disponível", () => {
    cy.get("#novoCampo").should("not.exist");
    cy.get("#buttonDelay").click();
    cy.get("#novoCampo").should("not.exist");
    cy.get("#novoCampo").should("exist");
    cy.get("#novoCampo").type("funciona");
  });

  it("Deve fazer retrys", () => {
    cy.get("#novoCampo").should("not.exist");
    cy.get("#buttonDelay").click();
    cy.get("#novoCampo").should("not.exist");
    cy.get("#novoCampo").should("exist").type("funciona");
  });

  it("Uso do find", () => {
    cy.get("#buttonList").click();
    cy.get("#lista li").find("span").should("contain", "Item 1");
    // cy.get("#lista li")  Não funciona pois o lista li é carregado sem o segundo item
    //   .find("span")      E o retry é feito em cima dele
    //   .should("contain", "Item 2");
    cy.get("#lista li span").should("contain", "Item 2");

    /**
     * Outras observação importante, é que durante o retry, comando como o get são refeitos.
     * Entratanto, comandos que alteram o HTML (eventos de JS) NÃO são refeitos, como click.
     */
  });

  it("Uso do timeout", () => {
    cy.get("#buttonListDOM").click();
    cy.get("#lista li span", { timeout: 30000 }).should("contain", "Item 2");

    cy.get("#buttonListDOM").click();
    cy.get("#lista li span").should("have.length", 1);

    cy.get("#lista li span").should("have.length", 2);
  });

  it("Click retry", () => {
    cy.get("#buttonCount").click().should("have.value", "1");
  });

  it("Should Vs Then", () => {
    cy.get("#buttonListDOM").click();

    cy.get("#lista li span").then((el) => {
      //Then considera o return
      expect(el).to.have.length(1);
    });

    cy.get("#lista li span").should((el) => {
      //Should realiza retrys
      expect(el).to.have.length(1);
    });
  });
});
