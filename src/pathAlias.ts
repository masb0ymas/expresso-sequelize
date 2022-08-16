import ModuleAlias from 'module-alias'

ModuleAlias.addAliases({
  '@expresso': `${__dirname}/@expresso`,
  '@config': `${__dirname}/config`,
  '@controllers': `${__dirname}/controllers`,
  '@database': `${__dirname}/database`,
  '@jobs': `${__dirname}/jobs`,
  '@middlewares': `${__dirname}/middlewares`,
  '@routes': `${__dirname}/routes`,
  '@scripts': `${__dirname}/scripts`,
  '@views': `${__dirname}/views`,
})
