import ProblemsController from '#controllers/problems_controller'
import router from '@adonisjs/core/services/router'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.get('/health', async () => {
  return { status: 'im healthy' }
})

router.post('/problem', [ProblemsController, 'getProblem'])