/// <reference types="cypress"/>

/**
 * Exite uma ordem de prioridade padrão para argumentos de busca
 * https://docs.cypress.io/api/cypress-api/selector-playground-api#Arguments
 * 
 * É possível, no nosso arquivo index da pasta support, alterarmos essa prioridade padrão
 * Na lista com a nova ordem, devemos lembrar de passar todas as estratégias de busca
 * O playground do cypress não irá reconhecer estratégias que não forem passadas nesse array
 * Também é possível criarmos atributos persnalizados
 * https://docs.cypress.io/api/cypress-api/selector-playground-api#Selector-Priority
 * 
 */

describe("Locators...", () => {
  before(() => {
    cy.visit("https://www.wcaquino.me/cypress/componentes.html");
  });

  beforeEach(() => {
    cy.reload();
  });

  it('using jquery selector', () => {
    cy.get('table#tabelaUsuarios tbody > tr:eq(0) td:nth-child(3) > input');
    cy.get('[onClick*=Francisco]');
    cy.get('table#tabelaUsuarios td:contains("Doutorado"):eq(0) ~ td:eq(3) > input');
    cy.get('table#tabelaUsuarios tr:contains("Doutorado"):eq(0) td:eq(6) input');
  });

  it('using xpath', () => {
    cy.xpath('//input[contains(@onclick, "Francisco")]');
    cy.xpath("//table[@id='tabelaUsuarios']//td[contains(., 'Francisco')]/..//input[@type='text']");
    cy.xpath("//td[contains(., 'Usuario A')]/following-sibling::td[contains(., 'Mestrado')]/..//input[@type='text']")
      .type('Funciona');
  });
});