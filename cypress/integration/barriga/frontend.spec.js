/// <reference types="cypress"/>

import loc from '../../support/locators';
import '../../support/commandsContas';
import buildEnv from '../../support/buildEnv';

describe("Should test at a functional level", () => {
  after(() => {
    cy.clearLocalStorage();
  });

  beforeEach(() => {
    buildEnv();
    cy.login('felipe.rocha@hotmail.com', 'senha errada');
    cy.get(loc.MENU.HOME).click();
  });

  it('Should test the responsiveness', () => {
    cy.get(loc.MENU.HOME).should('exist').and('be.visible');
    
    cy.viewport('iphone-5');
    cy.get(loc.MENU.HOME).should('exist').and('not.be.visible');

    cy.viewport('ipad-2');
    cy.get(loc.MENU.HOME).should('exist').and('be.visible');
  });

  it('Should insert a account', () => {
    cy.route({
      method: 'POST',
      url: '/contas',
      response: [
        {
          id: 3,
          nome: "Conta de teste",
          saldo: "100.00",
          visivel: true,
          usuario_id: 1
        },
      ],
    }).as("saveContas");

    cy.acessarMenuConta();

    cy.route({
      method: 'GET',
      url: '/contas',
      response: [
        {
          id: 1,
          nome: "Fake Account 1",
          saldo: "100.00",
          visivel: true,
          usuario_id: 1
        },
        {
          id: 2,
          nome: "Fake Account 2",
          saldo: "100000000.00",
          visivel: true,
          usuario_id: 1
        },
        {
          id: 3,
          nome: "Conta de teste",
          saldo: "100000000.00",
          visivel: true,
          usuario_id: 1
        },
      ],
    }).as("contasSave");

    cy.inserirConta('Conta de teste');
    cy.get(loc.MESSAGE).should('contain', 'Conta inserida com sucesso');
  });

  it('Should update an account', () => {
    cy.route({
      method: 'PUT',
      url: '/contas/**',
      response: {
          id: 1,
          nome: "Conta alterada",
          visivel: true,
          usuario_id: 1
        },
      });

    cy.acessarMenuConta();

    cy.xpath(loc.CONTAS.FN_XP_BTN_ALTERAR('Fake Account 1')).click();
    cy.get(loc.CONTAS.NOME).clear().type('Conta alterada');
    cy.get(loc.CONTAS.BTN_SALVAR).click();
    cy.get(loc.MESSAGE).should('contain', 'Conta atualizada com sucesso');
  });

  it('Should not create an ccount with the same name', () => {
    cy.route({
      method: 'POST',
      url: '/contas',
      response: [
        {
         error: "Já existe uma conta com esse nome!"
        },
      ],
      status: 400,
    }).as("saveContaMesmoNome");

    cy.acessarMenuConta();

    cy.get(loc.CONTAS.NOME).type('Conta mesmo nome');
    cy.get(loc.CONTAS.BTN_SALVAR).click();
    cy.get(loc.MESSAGE).should('contain', 'code 400');
  });

  it('Should create a transaction', () => {
    cy.route({
      method: 'POST',
      url: '/transacoes',
      response: {
        conta_id: 999,
        data_pagamento: Cypress.moment().add({days:1}).format('DD/MM/YYYY'),
        data_transacao: Cypress.moment().format('DD/MM/YYYY'),
        descricao: "desc",
        envolvido: "inter",
        status: true,
        tipo: "REC",
        valor: "123",
      },
    }).as("saveContaMesmoNome");

    cy.get(loc.MENU.MOVIMENTACAO).click();

    cy.get(loc.MOVIMENTACAO.DESCRICAO).type('Desc');
    cy.get(loc.MOVIMENTACAO.VALOR).type('123');
    cy.get(loc.MOVIMENTACAO.INTERESSADO).type('Inter');
    cy.get(loc.MOVIMENTACAO.CONTA).select('Fake Account 2');
    cy.get(loc.MOVIMENTACAO.STATUS).click();
    cy.get(loc.MOVIMENTACAO.BTN_SALVAR).click();
    cy.get(loc.MESSAGE).should('contain', 'sucesso');

    cy.get(loc.EXTRATO.LINHAS).should('have.length', 5);
    cy.xpath(loc.EXTRATO.FN_XP_BUSCA_ELEMENTO('Movimentacao para extrato', '123')).should('exist');
  });

  it('Should get balance', () => {
    cy.route({
      method: 'GET',
      url: '/transacoes/**',
      response: {
        "conta":"Conta para saldo",
        "id":1003157,"descricao":"Movimentacao 1, calculo saldo",
        "envolvido":"CCC",
        "observacao":null,
        "tipo":"REC",
        "data_transacao":"2022-02-09T03:00:00.000Z","data_pagamento":"2022-02-09T03:00:00.000Z",
        "valor":"3500.00","status":false,
        "conta_id":1076201,
        "usuario_id":27510,
        "transferencia_id":null,
        "parcelamento_id":null},
    });

    cy.route({
      method: 'PUT',
      url: '/transacoes/**',
      response: {
        "conta":"Conta para saldo",
        "id":1003157,"descricao":"Movimentacao 1, calculo saldo",
        "envolvido":"CCC",
        "observacao":null,
        "tipo":"REC",
        "data_transacao":"2022-02-09T03:00:00.000Z","data_pagamento":"2022-02-09T03:00:00.000Z",
        "valor":"3500.00","status":false,
        "conta_id":1076201,
        "usuario_id":27510,
        "transferencia_id":null,
        "parcelamento_id":null},
    });

    cy.get(loc.MENU.HOME).click();
    cy.xpath(loc.SALDO.FN_XP_SALDO_CONTA('Fake Account 1')).should('contain', '100,00');

    cy.get(loc.MENU.EXTRATO).click();
    cy.xpath(loc.EXTRATO.FN_XP_ALTERAR_ELEMENTO('Movimentacao 1, calculo saldo')).click();
    cy.get(loc.MOVIMENTACAO.CONTA).select('Fake Account 1');
    cy.get(loc.MOVIMENTACAO.DESCRICAO).should('have.value', 'Movimentacao 1, calculo saldo');
    cy.get(loc.MOVIMENTACAO.STATUS).click();
    cy.get(loc.MOVIMENTACAO.BTN_SALVAR).click();
    cy.get(loc.MESSAGE).should('contain', 'sucesso');

    cy.get(loc.MENU.HOME).click();
    cy.xpath(loc.SALDO.FN_XP_SALDO_CONTA('Fake Account 1')).should('contain', '100,00');
  });

  it('Should remove a transaction', () => {
    cy.route({
      method: 'DELETE',
      url: '/transacoes/**',
      response: {},
      status: 204
    }).as('del');

    cy.get(loc.MENU.EXTRATO).click();
    cy.xpath(loc.EXTRATO.FN_XP_REMOVER_ELEMENTO('Movimentacao de conta')).click();
    cy.get(loc.MESSAGE).should('contain', 'sucesso');
  });

  it('Should validate data to insert a account', () => {
    const reqStub = cy.stub();
    cy.route({
      method: 'POST',
      url: '/contas',
      response: [
        {
          id: 3,
          nome: "Conta de teste",
          saldo: "100.00",
          visivel: true,
          usuario_id: 1
        },
      ],
      //onRequest: req => expect(req.request.body.nome).to.be.not.null
      onRequest: reqStub
    }).as("saveContas");

    cy.acessarMenuConta();

    cy.route({
      method: 'GET',
      url: '/contas',
      response: [
        {
          id: 1,
          nome: "Fake Account 1",
          saldo: "100.00",
          visivel: true,
          usuario_id: 1
        },
        {
          id: 2,
          nome: "Fake Account 2",
          saldo: "100000000.00",
          visivel: true,
          usuario_id: 1
        },
        {
          id: 3,
          nome: "Conta de teste",
          saldo: "100000000.00",
          visivel: true,
          usuario_id: 1
        },
      ],
    }).as("contasSave");

    cy.inserirConta('{CONTROL}');
    //cy.wait('@saveContas').its('request.body.nome').should('not.be.empty');
    cy.wait('@saveContas').then(() => {
      expect(reqStub.args[0][0].request.body.nome).to.be.empty
    });
    cy.get(loc.MESSAGE).should('contain', 'Conta inserida com sucesso');
  });

  it('Should test colors', () => {
    cy.get(loc.MENU.EXTRATO).click();
    cy.xpath(loc.EXTRATO.FN_XP_LINHA('Movimentacao 1, calculo saldo')).should('have.class', 'receitaPendente');
    cy.xpath(loc.EXTRATO.FN_XP_LINHA('Movimentacao 2, calculo saldo')).should('have.class', 'despesaPaga');
    cy.xpath(loc.EXTRATO.FN_XP_LINHA('Movimentacao 3, calculo saldo')).should('have.class', 'receitaPaga');
  });
});