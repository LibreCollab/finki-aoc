import ProblemsController from '#controllers/problems_controller'
import router from '@adonisjs/core/services/router'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.get('/health', async () => {
  return { status: 'im healthy thx for asking :)' }
})

router.post('/problem', [ProblemsController, 'getProblem'])
router.post('/submit', [ProblemsController, 'submitAnswer'])