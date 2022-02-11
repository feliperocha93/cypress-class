const buildEnv = () => {
  cy.server();

  cy.route({
    method: 'POST',
    url: '/signin',
    response: {
      id: 1000,
      nome: "Fake User",
      token: "Fake token"
    },
  });

  cy.route({
    method: 'GET',
    url: '/saldo',
    response: [
    {
      conta_id: 999,
      conta: "Fake Account 1",
      saldo: "100.00"
    },
    {
      conta_id: 998,
      conta: "Fake Account 2",
      saldo: "100000000.00"
    },
  ],
  }).as('saldo');

  cy.route({
    method: 'GET',
    url: '/contas',
    response: [
      {
        id: 1,
        nome: "Fake Account 1",
        saldo: "100.00",
        visivel: true,
        usuario_id: 1,
      },
      {
        id: 2,
        nome: "Fake Account 2",
        saldo: "100000000.00",
        visivel: true,
        usuario_id: 1
      },
    ],
  }).as("contas");

  cy.route({
    method: 'GET',
    url: '/extrato/**',
    response: 'fixture:movimentacaoSalva',
  }).as("extrato");
};

export default buildEnv;