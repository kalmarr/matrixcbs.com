// MATRIX CBS - Database Seed
// Alapértelmezett adatok: kategóriák, admin felhasználó

import { PrismaClient, AdminRole } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seed...')

  // ============================================
  // ADMIN FELHASZNÁLÓK
  // ============================================
  // FONTOS: Jelszavak környezeti változókból! Soha ne hardcode-olj jelszót!
  const adminPassword = process.env.SEED_ADMIN_PASSWORD
  if (!adminPassword) {
    console.log('SEED_ADMIN_PASSWORD not set - skipping admin creation')
    console.log('Set SEED_ADMIN_PASSWORD env var to create admin users')
  } else {
    const passwordHash = await hash(adminPassword, 12)

    const admins = [
      {
        email: 'kalmarr@gmail.com',
        name: 'Kalmár Róbert',
        role: AdminRole.SUPER_ADMIN,
      },
      {
        email: 'balogh.monek@gmail.com',
        name: 'Balogh Mónika',
        role: AdminRole.ADMIN,
      },
    ]

    for (const adminData of admins) {
      const admin = await prisma.admin.upsert({
        where: { email: adminData.email },
        update: {
          name: adminData.name,
          role: adminData.role,
        },
        create: {
          email: adminData.email,
          passwordHash,
          name: adminData.name,
          role: adminData.role,
          isActive: true,
        },
      })
      console.log('Admin user created/updated:', admin.email)
    }
  }

  // ============================================
  // BLOG KATEGÓRIÁK (specifikáció szerint)
  // ============================================
  const categories = [
    {
      name: 'Szervezetfejlesztés',
      slug: 'szervezetfejlesztes',
      description: 'Szervezeti működés, struktúra és kultúra fejlesztése',
      color: '#3B82F6', // Kék
      sortOrder: 1,
    },
    {
      name: 'Csapatépítés',
      slug: 'csapatepites',
      description: 'Csapatok építése és fejlesztése',
      color: '#10B981', // Zöld
      sortOrder: 2,
    },
    {
      name: 'Növekedés',
      slug: 'novekedes',
      description: 'Vállalati növekedés és fejlődés',
      color: '#F59E0B', // Narancs
      sortOrder: 3,
    },
    {
      name: 'Stratégia',
      slug: 'strategia',
      description: 'Üzleti és szervezeti stratégia',
      color: '#8B5CF6', // Lila
      sortOrder: 4,
    },
    {
      name: 'Esettanulmányok',
      slug: 'esettanulmanyok',
      description: 'Valós projektek és eredmények bemutatása',
      color: '#EF4444', // Piros
      sortOrder: 5,
    },
  ]

  for (const category of categories) {
    const created = await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    })
    console.log('Category created:', created.name)
  }

  // ============================================
  // KARBANTARTÁSI MÓD (alapértelmezett)
  // ============================================
  await prisma.maintenanceMode.upsert({
    where: { id: 1 },
    update: {},
    create: {
      isActive: false,
      message: 'Karbantartás alatt vagyunk, hamarosan visszatérünk!',
      allowedIps: '[]',
    },
  })
  console.log('Maintenance mode settings created')

  // ============================================
  // MINTA FAQ ELEMEK
  // ============================================
  const faqs = [
    {
      question: 'Milyen típusú szervezetekkel dolgoznak?',
      answer: 'Kis- és középvállalkozásoktól a nagyvállalatokig minden méretű szervezettel dolgozunk. Főként IT, pénzügyi és szolgáltató szektorban van tapasztalatunk, de más iparágakban is szívesen segítünk.',
      category: 'Általános',
      sortOrder: 1,
    },
    {
      question: 'Mennyi ideig tart egy tipikus projekt?',
      answer: 'A projektek időtartama a feladat komplexitásától függ. Egy egyszerűbb folyamatoptimalizálás néhány hét, míg egy átfogó szervezetfejlesztési projekt akár több hónapot is igénybe vehet.',
      category: 'Általános',
      sortOrder: 2,
    },
    {
      question: 'Hogyan kezdődik az együttműködés?',
      answer: 'Minden együttműködés egy ingyenes konzultációval kezdődik, ahol megismerjük az Ön szervezetét és kihívásait. Ezt követően személyre szabott ajánlatot készítünk.',
      category: 'Együttműködés',
      sortOrder: 3,
    },
    {
      question: 'Online is tudnak tanácsadást nyújtani?',
      answer: 'Igen, szolgáltatásaink jelentős része online is elérhető. Videókonferenciás megbeszélések, online workshopok és digitális eszközök segítségével hatékonyan tudunk együttműködni távoli partnerekkel is.',
      category: 'Együttműködés',
      sortOrder: 4,
    },
  ]

  for (const faq of faqs) {
    await prisma.faq.create({
      data: faq,
    })
  }
  console.log('Sample FAQs created')

  console.log('Database seed completed!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
