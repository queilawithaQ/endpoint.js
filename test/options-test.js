const chai = require('chai')
const getUserAgent = require('universal-user-agent')
const sinonChai = require('sinon-chai')

const endpoint = require('..')
const pkg = require('../package.json')
const userAgent = `octokit-endpoint.js/${pkg.version} ${getUserAgent()}`

const expect = chai.expect
chai.use(sinonChai)

describe('endpoint.options()', () => {
  it('is a function', () => {
    expect(endpoint.options).to.be.a('function')
  })

  it('README example', () => {
    const myProjectEndpoint = endpoint.defaults({
      baseUrl: 'https://github-enterprise.acme-inc.com/api/v3',
      headers: {
        'user-agent': 'myApp/1.2.3'
      },
      org: 'my-project'
    })
    const options = myProjectEndpoint.options('GET /orgs/:org/repos', {
      headers: {
        authorization: `token 0000000000000000000000000000000000000001`
      },
      type: 'private'
    })

    expect(options).to.deep.equal({
      baseUrl: 'https://github-enterprise.acme-inc.com/api/v3',
      method: 'GET',
      url: '/orgs/:org/repos',
      headers: {
        accept: 'application/vnd.github.v3+json',
        authorization: `token 0000000000000000000000000000000000000001`,
        'user-agent': 'myApp/1.2.3'
      },
      org: 'my-project',
      type: 'private'
    })
  })

  it('repeated defaults', () => {
    const myProjectEndpoint = endpoint.defaults({
      baseUrl: 'https://github-enterprise.acme-inc.com/api/v3',
      headers: {
        'user-agent': 'myApp/1.2.3'
      },
      org: 'my-project'
    })
    const myProjectEndpointWithAuth = myProjectEndpoint.defaults({
      headers: {
        authorization: `token 0000000000000000000000000000000000000001`
      }
    })

    const options = myProjectEndpointWithAuth.options(`GET /orgs/:org/repos`)

    expect(options).to.deep.equal({
      baseUrl: 'https://github-enterprise.acme-inc.com/api/v3',
      method: 'GET',
      url: '/orgs/:org/repos',
      headers: {
        accept: 'application/vnd.github.v3+json',
        'user-agent': 'myApp/1.2.3',
        authorization: `token 0000000000000000000000000000000000000001`
      },
      org: 'my-project'
    })
  })

  it('no arguments', () => {
    const options = endpoint.options()
    expect(options).to.deep.equal({
      baseUrl: 'https://api.github.com',
      method: 'GET',
      headers: {
        accept: 'application/vnd.github.v3+json',
        'user-agent': userAgent
      }
    })
  })
})