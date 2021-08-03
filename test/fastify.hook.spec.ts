// fastifyProtectSwagger({
//   cookieGuard: token =>
//     getConnection()
//       .getRepository(TokenEntity)
//       .findOneOrFail(token)
//       .then(t => t.token === token),
//   cookieKey: 'swagger_token',
//   entryPath: '/api/+',
// })
