import ModuleAlias from 'module-alias'

ModuleAlias.addAliases({
  '@apps': `${__dirname}/apps`,
  '@core': `${__dirname}/core`,
  '@config': `${__dirname}/config`,
  '@database': `${__dirname}/database`,
  '@routes': `${__dirname}/routes`,
})
