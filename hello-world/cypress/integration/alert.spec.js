/// <reference types="cypress"/>

describe("Work with alerts", () => {
  before(() => {
    cy.visit("https://www.wcaquino.me/cypress/componentes.html");
  });

  beforeEach(() => {
    cy.reload();
  });

  it('Alert', () => {
    cy.on('window:alert', msg => {
      console.log(msg);
      expect(msg).to.be.equal('Alert Simples');
      /**
       * Apesar de fazer um bypass nos alerts por padrão, podemos capturá-los utilizando
       * o listener de eventos do cypress, e assim fazer as nossas assertivas.
       */
    })

    cy.get('#alert').click();
  })

  it('Alert using commands', () => {
    cy.clickAlert('#alert', 'Alert Simples');
  });

  it('Alert com mock', () => {
    const stub = cy.stub().as('alerta');
    cy.on('window:alert', stub);
    cy.get('#alert').click().then(() => {
      expect(stub.getCall(0)).to.be.calledWith('Alert Simples');
    });
  })

  it('Confirm', () => {
    cy.on('window:confirm', msg => {
      expect(msg).to.be.equal('Confirm Simples');
    })

    cy.on('window:alert', msg => {
      expect(msg).to.be.equal('Confirmado');
    })

    cy.get('#confirm').click();
  })

  it('Deny', () => {
    cy.on('window:confirm', msg => {
      expect(msg).to.be.equal('Confirm Simples');
      return false;
      /**
       * Por padrão, o cypress clica no botão de confirmar. Retornando false, ele
       * clica no botão de cancelar.
       */
    })

    cy.on('window:alert', msg => {
      expect(msg).to.be.equal('Negado');
    })

    cy.get('#confirm').click();
  })

  it('Prompt', () => {
    cy.window().then((win) => {
      cy.stub(win, 'prompt').returns('42');
    });

    cy.on('window:confirm', msg => {
      expect(msg).to.be.equal('Era 42?');
    })

    cy.on('window:alert', msg => {
      expect(msg).to.be.equal(':D');
    })

    cy.get('#prompt').click();
  })

  it('Validando mensagens', () => {
    const stub = cy.stub().as('alerta');
    cy.on('window:alert', stub);

    cy.get('#formCadastrar').click().then(() => {
      expect(stub.getCall(0)).to.be.calledWith('Nome eh obrigatorio');
    });

    cy.get('#formNome').type('Felipe')
    cy.get('#formCadastrar').click().then(() => {
      expect(stub.getCall(1)).to.be.calledWith('Sobrenome eh obrigatorio');
    });

    cy.get('[data-cy=dataSobrenome]').type('Rocha')
    cy.get('#formCadastrar').click().then(() => {
      expect(stub.getCall(2)).to.be.calledWith('Sexo eh obrigatorio');
    });

    cy.get('#formSexoMasc').click();
    cy.get('#formCadastrar').click().then(() => {
      cy.get('#resultado > :nth-child(1)').should('have.text', 'Cadastrado!');
    });
  })
});

