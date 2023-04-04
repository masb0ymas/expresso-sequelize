import { afterAll, describe, expect, test } from '@jest/globals'
import request from 'supertest'
import App from '../../app'

const server = new App()
const app = server.app()

describe('index routes test', () => {
  afterAll(async () => {
    await new Promise<void>((resolve) =>
      setTimeout(() => {
        resolve()
      }, 500)
    ) // avoid jest open handle error
  })

  test('should root route', async () => {
    const response = await request(app)
      .get('/')
      .set('Accept', 'application/json')

    expect(response.status).toEqual(200)
  })

  test('should health route', async () => {
    const response = await request(app)
      .get('/health')
      .set('Accept', 'application/json')

    expect(response.status).toEqual(200)
    expect(response.body.message).toBe('Server Uptime')
  })

  test('should v1 route', async () => {
    const response = await request(app)
      .get('/v1')
      .set('Accept', 'application/json')

    expect(response.status).toEqual(403)
  })

  test('should docs swagger route', async () => {
    const response = await request(app)
      .get('/v1/api-docs')
      .set('Accept', 'application/json')

    expect(response.status).toEqual(301)
  })

  test('should docs swagger route json', async () => {
    const response = await request(app)
      .get('/v1/api-docs.json')
      .set('Accept', 'application/json')

    expect(response.status).toEqual(200)
  })

  test('should any route', async () => {
    const response = await request(app)
      .get('/any-route')
      .set('Accept', 'application/json')

    expect(response.status).toEqual(404)
  })
})
