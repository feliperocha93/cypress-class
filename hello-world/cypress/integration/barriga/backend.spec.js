/// <reference types="cypress"/>

describe("Should test at a functional level", () => {
  before(() => {
    cy.getToken('felipe.rocha@hotmail.com', '123456');
  });

  beforeEach(() => {
    cy.resetRest();
  })

  it('Should insert a account', () => {
    const nome = 'Conta via rest';
  
    cy.request({
      url: '/contas',
      method: 'POST',
      
      body: {
        nome
      },
    }).as('response');

    cy.get('@response').then(res => {
      expect(res.status).to.be.equal(201);
      expect(res.body).to.have.property('id');
      expect(res.body).to.have.property('nome', nome);
    });
  });

  it('Should update an account', () => {
    cy.getContaByName("Conta para alterar")
      .then(contaId => {
        cy.request({
          url: `/contas/${contaId}`,
          method: 'PUT',
          
          body: {
            nome: `conta alterada via rest`
          },
        }).as('response');
    
        cy.get('@response').its('status').should('be.equal', 200);
      })
  });

  it('Should not create an ccount with the same name', () => {
    cy.request({
      method: 'POST',
      url: '/contas',
      
      body: {
        nome: 'Conta mesmo nome'
      },
      failOnStatusCode: false,
    }).as('response');
      
    cy.get('@response').then(res => {
      expect(res.status).to.be.equal(400);
      expect(res.body.error).to.be.equal("Já existe uma conta com esse nome!");
    });
  });

  it('Should create a transaction', () => {
    cy.getContaByName("Conta para movimentacoes")
      .then(conta_id => {
        cy.request({
          method: 'POST',
          url: '/transacoes',
          
          body: {
            conta_id,
            data_pagamento: Cypress.moment().add({days:1}).format('DD/MM/YYYY'),
            data_transacao: Cypress.moment().format('DD/MM/YYYY'),
            descricao: "desc",
            envolvido: "inter",
            status: true,
            tipo: "REC",
            valor: "123",
          },
        }).as('response');
    
        cy.get('@response').then(res => {
          expect(res.status).to.be.equal(201);
        });
      })
  });

  it('Should get balance', () => {
    cy.request({
      url: '/saldo',
      method: 'GET',
      
    }).as('response');

    cy.get('@response')
      .then(res => {
        let saldoConta = null;
        res.body.forEach(c => {
          if (c.conta === 'Conta para saldo') saldoConta = c.saldo
        });
        expect(saldoConta).to.be.equal('534.00');
      });

    cy.request({
      method: 'GET',
      url: '/transacoes',
      
      qs: {
        descricao: 'Movimentacao 1, calculo saldo'
      }
    }).then(res => {
        cy.request({
          url: '/transacoes/' + res.body[0].id,
          method: 'PUT',
          
          body: {
            status: true,
            data_transacao: Cypress.moment(res.body[0].data_transacao).format('DD/MM/YYYY'),
            data_pagamento: Cypress.moment(res.body[0].data_pagamento).format('DD/MM/YYYY'),
            descricao: res.body[0].descricao,
            envolvido: res.body[0].envolvido,
            valor: res.body[0].valor,
            conta_id: res.body[0].conta_id,
          }
        }).its('status').should('be.equal', 200);
    });

  });

  it('Should remove a transaction', () => {
    cy.request({
      method: 'GET',
      url: '/transacoes',
      
      qs: {
        descricao: 'Movimentacao para exclusao'
      }
    }).then(res => {
        cy.request({
          url: '/transacoes/' + res.body[0].id,
          method: 'DELETE',
          
        }).its('status').should('be.equal', 204);
    });
  });
});