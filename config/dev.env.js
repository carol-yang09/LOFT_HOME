'use strict'
require('dotenv').config();

const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_TOKEN: process.env.API_TOKEN,
})
