// import qrCodeCreator from "@/app/utils/qr-codes/qrCodeCreator"

import prisma from "@/app/utils/prisma"

describe('QR Code Creator', () => {
  beforeEach(async () => {
    const tablenames = await prisma.$queryRaw`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

    const tables = tablenames
      .map(({ tablename }) => tablename)
      .filter((name) => name !== '_prisma_migrations')
      .map((name) => `"public"."${name}"`)
      .join(', ')

    try {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`)
    } catch (error) {
      console.log({ error })
    }
  })

  it('creates a QR Code', async () => {
    const team = await prisma.Team.create({
      data: {
        name: 'Test Team'
      }
    })

    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        passwordDigest: 'passwordDigest',
      },
    })

    const teamUser = await prisma.TeamUser.create({
      data: {
        teamId: team.id,
        userId: user.id,
      }
    })

    console.log('team', team)
    console.log('user', user)
    console.log('teamUser', teamUser)

    expect(true).toBe(true)
  })
})