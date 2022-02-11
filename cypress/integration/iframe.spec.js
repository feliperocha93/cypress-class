/// <reference types="cypress"/>

describe("Work with iframes", () => {
  it('Deve preencher campo de teste', () => {
    cy.visit("https://www.wcaquino.me/cypress/componentes.html");

    cy.get('#frame1').then((iframe) => {
      const body = iframe.contents().find('body');

      cy.wrap(body).find('#tfield')
        .type('Funciona???')
        .should('have.value', 'Funciona???');
    });
    /**
     * Usando iframes, temos uma limitação para trabalhar com alerts.
     */
  })

  it('Deve testar frame diretamente', () => {
    cy.visit("https://www.wcaquino.me/cypress/frame.html");

    cy.on('window:alert', msg => {
      expect(msg).to.be.equal('Click OK!');
    });
    cy.get('#otherButton').click();
    /**
     * Uma solução para diminuir a complexidade ao trabalharmos com frame é testarmos
     * diretamente a página do frame.
     */
  })
});