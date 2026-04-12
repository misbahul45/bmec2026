import * as bcrypt from 'bcrypt'
import { prisma } from "~/lib/utils/prisma";

export async function seedAdmin() {
  const admins = [
    {
      name: "Super Admin",
      email: "bmec-admin@gmail.com",
      password: "admin123",
    },
    {
      name: "Admin 2",
      email: "admin2@gmail.com",
      password: "admin123",
    },
    {
      name: "Admin 3",
      email: "admin3@gmail.com",
      password: "admin123",
    },
  ];

  for (const admin of admins) {
    const hashedPassword = await bcrypt.hash(admin.password, 10);

    await prisma.admin.upsert({
      where: { email: admin.email },
      update: {},
      create: {
        name: admin.name,
        email: admin.email,
        password: hashedPassword,
      },
    });
  }

  console.log("✅ Admin seeded");
}