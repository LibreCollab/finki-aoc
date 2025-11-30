import ProblemsController from '#controllers/problems_controller'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

router.group(() => {
  router.post('/problem', [ProblemsController, 'getProblem'])
  router.post('/submit', [ProblemsController, 'submitAnswer'])
  router.get('/leaderboard', [ProblemsController, 'getLeaderboard'])
}).use(middleware.botAuth())