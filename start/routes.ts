import ProblemsController from '#controllers/problems_controller'
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import { gameLimiter, globalLimiter } from './limiter.js'

router
  .group(() => {
    router
      .group(() => {
        router.post('/problem', [ProblemsController, 'getProblem'])
        router.post('/submit', [ProblemsController, 'submitAnswer'])
        router.post('/problem/bonus', [ProblemsController, 'getBonusProblem'])
        router.post('/submit/bonus', [ProblemsController, 'submitBonusAnswer'])
      })
      .middleware([middleware.botAuth(), gameLimiter])

    router
      .get('/leaderboard', [ProblemsController, 'getLeaderboard'])
      .middleware(middleware.botAuth())
  })
  .use(globalLimiter)
