/// <reference types="cypress"/>

describe("Helpers", () => {
  before(() => {
    cy.visit("https://www.wcaquino.me/cypress/componentes.html");
  });

  beforeEach(() => {
    cy.reload();
  });

  it("Wrap", () => {
    /**
     * Wrap converte objetos JS em objetos Cypress para que seja possível usarmos
     * a API do cypress para fazer manipulações nesses objetos.
     */
    const obj = { nome: "User", idade: 20 };

    expect(obj).to.have.property("nome");

    cy.wrap(obj).should("have.property", "nome");

    cy.get("#formNome").then((el) => cy.wrap(el).type("funciona"));

    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(10);
      }, 500);
    });

    cy.get("#buttonSimple").then(() =>
      console.log("Encontrei o primeiro botão")
    );
    cy.wrap(promise).then((num) => console.log(num));
    cy.get("#buttonList").then(() => console.log("Encontrei o segundo botão"));
  });

  it("Its", () => {
    const obj = { nome: "User", idade: 20 };

    cy.wrap(obj).should("have.property", "nome", "User");
    cy.wrap(obj).its("nome").should("be.equal", "User");

    const obj2 = {
      nome: "User",
      idade: 20,
      endereco: { rua: "Avenida do Taboao" },
    };
    cy.wrap(obj2).its("endereco").should("have.property", "rua");
    cy.wrap(obj2).its("endereco").its("rua").should("contain", "Taboao");
    cy.wrap(obj2).its("endereco.rua").should("contain", "Taboao");

    cy.title().its("length").should("be.equal", 20);
  });

  it("Invoke...", () => {
    const getValue = () => 1;
    const soma = (a, b) => a + b;

    cy.wrap({ fn: getValue }).invoke("fn").should("be.equal", 1);
    cy.wrap({ fn: soma }).invoke("fn", 2, 5).should("be.equal", 7);

    cy.get("#formNome").invoke("val", "Texto via invoke");

    cy.window().invoke("alert", "Dá pra ver?");
    //Cypress by default catch the alert and close it
    cy.get("#resultado").invoke(
      "html",
      '<input type="button", value="hacked!"/>'
    );
  });
});
