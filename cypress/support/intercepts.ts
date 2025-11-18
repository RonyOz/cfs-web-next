type GraphQLRequestBody = {
  query?: string;
};

const isLoginQuery = (body: GraphQLRequestBody | undefined): boolean => {
  return Boolean(body?.query && body.query.includes('login'));
};

export const mockLoginSuccess = () => {
  cy.intercept('POST', '**/graphql', (req) => {
    const body = req.body as GraphQLRequestBody | undefined;
    if (isLoginQuery(body)) {
      req.reply({ data: { login: { token: 'fake-token' } } });
    }
  }).as('loginMutation');
};

export const mockLoginFailure = () => {
  cy.intercept('POST', '**/graphql', (req) => {
    const body = req.body as GraphQLRequestBody | undefined;
    if (isLoginQuery(body)) {
      req.reply({
        errors: [{ message: 'Invalid credentials' }],
      });
    }
  }).as('loginMutationFailed');
};
