import * as bcrypt from 'bcrypt'
import { prisma } from "~/lib/utils/prisma";

/**
 * Data source: 1 object per team, mapped 1:1 from the BMEC 2026 backup
 * form responses (Google Form). Grouped as { team, mentor, members, registration }
 * so each team is a self-contained record — just push more entries into this
 * array as more form responses come in.
 */
const teamSeeds = [
  {
    team: {
      // NOTE: the form has no "Kode Tim" field — schema requires Team.code to be
      // unique, so this is generated. Swap for your real numbering convention if you have one.
      code: "OLM-300",
      name: "Tim Teripang (Trio Kesbang)",
      // Form lists two emails for "Email Tim (Ketua Tim)": school + personal gmail.
      // Using the school email as the canonical Team.email (unique field can only hold one).
      email: "almira@kesatuanbangsa.sch.id",
      password: "1234567890",
      phone: "0817-0000-778",
      schoolName: "SMA Kesatuan Bangsa",
      schoolAddress:
        "Jl. Wates Jl. Karanglo No.km 10, Karanglo, Argomulyo, Kec. Sedayu, Kabupaten Bantul, Daerah Istimewa Yogyakarta 55753",
      sourceInfo: "Instagram",
      competitionType: "OLIMPIADE" as const,
      documentUrl:
        "https://4s0138q05g.ufs.sh/f/L7c2JRqY80pwYoVN2YWfOjA9FX5d0g4S8IH2itWeuKsoPlMT",
      twibbonUrl:
        "https://drive.google.com/drive/folders/18lwZUakcZMLg5Q3qnZVSzg9YQsL8jP-Q",
    },
    mentor: {
      name: "Fianicha Shalihah",
      email: "fianichashalihah2@gmail.com",
      phone: "082293297591",
    },
    members: [
      {
        name: "Almira Syakira Rifda Yokhisuno",
        role: "KETUA" as const,
        // Form gives two gmail variants for the ketua ("yokhisuno@gmail.com" at the
        // top vs "yokhisunochi@gmail.com" in the detail row). Used the school email
        // here to sidestep the mismatch — worth confirming the correct gmail with the team.
        email: "almira@kesatuanbangsa.sch.id",
        phone: "081360888272",
      },
      {
        name: "Krishnamurti Anindya Maharani",
        role: "ANGGOTA" as const,
        email: "krishnamurti@kesatuanbangsa.sch.id",
        phone: "+62 821-4208-4842",
      },
      {
        name: "Nayra Aqilah Putri",
        role: "ANGGOTA" as const,
        email: "nayra@kesatuanbangsa.sch.id",
        phone: "+62 857-7869-6181",
      },
    ],
    registration: {
      batchId: "bff0a515-40d7-477e-b0c1-301fa59d3c19",
      paymentProof:
        "https://4s0138q05g.ufs.sh/f/L7c2JRqY80pwe8Qm7Ra0ub7cDRxGkm2Y1owjpyNhigHdqZQz",
      // Defaulting to PENDING (schema default) since the form is just a backup
      // data-collection channel — flip to "APPROVED" here if payment is already verified.
      status: "PENDING" as const,
    },
  },
  {
    team: {
      code: "OLM-301",
      name: "INVICTA",
      email: "invecta24@gmail.com",
      password: "INVECTAJOS",
      phone: "(0351) 749089",
      schoolName: "SMA Negeri 1 Ngawi",
      schoolAddress:
        "Jalan Ahmad Yani No. 45, Kelurahan Beran, Kecamatan Ngawi, Kabupaten Ngawi, Jawa Timur",
      sourceInfo: "Guru / Dosen",
      competitionType: "OLIMPIADE" as const,
      documentUrl:
        "https://4s0138q05g.ufs.sh/f/L7c2JRqY80pwrzYYYRQPnQumST3YjgeNrH6ACWoLIxOdBKbE",
      twibbonUrl:
        "https://drive.google.com/drive/folders/1ihklMGylv72tveHZJt-h-uT1EOmAt8VV",
    },
    mentor: {
      name: "Sulastri",
      email: "sulastrilastri415@gmail.com",
      phone: "081335758827",
    },
    members: [
      {
        name: "Naura Azqiya Iqnatiwi",
        role: "KETUA" as const,
        email: "naazqiya17@gmail.com",
        phone: "082132375221",
      },
      {
        name: "Pandhu Rhausyan Fikr",
        role: "ANGGOTA" as const,
        email: "pandhufikr2@gmail.com",
        phone: "085608535725",
      },
      {
        name: "Verlyn Meira Kusuma",
        role: "ANGGOTA" as const,
        email: "lynnkusuma@gmail.com",
        phone: "085791567459",
      },
    ],
    registration: {
      // No batchId given for this entry — reused the same batch as Tim Teripang above.
      // Update if INVICTA registered under a different batch/gelombang.
      batchId: "bff0a515-40d7-477e-b0c1-301fa59d3c19",
      paymentProof:
        "https://4s0138q05g.ufs.sh/f/L7c2JRqY80pwCVO3KFNvi83xRmu9bWpkrMePGsTw4XUqho0J",
      status: "PENDING" as const,
    },
  },
  {
    team: {
      code: "ifs-10",
      name: "Perintis asal HC",
      email: "aletha.puspa@gmail.com",
      password: "Sapi100M",
      phone: "0217341806",
      schoolName: "SMAS Kartika X-1 Jakarta",
      schoolAddress: "Jl. Raya Kodam Bintaro No. 53, Pesanggrahan, Jakarta Selatan",
      sourceInfo: "Instagram",
      competitionType: "INFOGRAFIS" as const,
      documentUrl:
        "https://4s0138q05g.ufs.sh/f/L7c2JRqY80pwda2TbUkApQVZmhvCiwI134RqXrYBGUHdFE6S",
      twibbonUrl:
        "https://drive.google.com/drive/folders/1AcRnSNR-NVB55OZah6Lh8i7gA4YHanvd",
    },
    mentor: {
      name: "Abdul Haris S. Pd.",
      email: "gurufisika77@gmail.com",
      phone: "085156790096",
    },
    members: [
      {
        name: "Aletha Puspa Clarissa Subegti",
        role: "KETUA" as const,
        email: "aletha.puspa@gmail.com",
        phone: "088210752928",
      },
      // Anggota 1 (Adinda Mutiara Pratiwi) dan Anggota 2 (Carina Aprilia Vega)
      // sengaja nggak dimasukin — form nggak nyertain email mereka, sementara
      // Member.email wajib & unique di schema. Tambahin manual kalau emailnya udah ada.
    ],
    registration: {
      batchId: "c57236ab-23dc-461a-9a53-18d7aadac379",
      paymentProof:
        "https://4s0138q05g.ufs.sh/f/L7c2JRqY80pw28bAAc1UgZdPEslO1BGatSqCA7NiVujIfWKk",
      status: "PENDING" as const,
    },
  },
  {
    team: {
      code: "OLM-302",
      name: "Tim Cihuy",
      email: "fitrialdina41@gmail.com",
      password: "Faragenatdina73",
      phone: "(031) 8284261",
      schoolName: "SMA Khadijah Surabaya",
      schoolAddress:
        "Jalan Ahmad Yani Nomor 2-4, Kelurahan Wonokromo, Kecamatan Wonokromo, Kota Surabaya, Provinsi Jawa Timur (Kode Pos: 60243)",
      sourceInfo: "Teman / Kenalan",
      competitionType: "OLIMPIADE" as const,
      documentUrl:
        "https://4s0138q05g.ufs.sh/f/L7c2JRqY80pwdTs9GmApQVZmhvCiwI134RqXrYBGUHdFE6S8",
      twibbonUrl:
        "https://drive.google.com/drive/folders/1GGdKQY7qvMLKRDY3zkt8RacvtBo7JGYZ",
    },
    mentor: {
      name: "Sendy Zulia Witanecahya",
      email: "sendyzuliawitanecahya@gmail.com",
      phone: "+62 821-3271-9619",
    },
    members: [
      {
        name: "Aldina Fitri Pamungkas",
        role: "KETUA" as const,
        email: "fitrialdina41@gmail.com",
        phone: "082131270011",
      },
      {
        name: "Nur Syifa Ramadhani",
        role: "ANGGOTA" as const,
        email: "nursyifa.fara08@gmail.com",
        phone: "+62 852-3160-7369",
      },
      {
        name: "Intan Alfiona Novanti",
        role: "ANGGOTA" as const,
        email: "natnianoifla@gmail.com",
        phone: "+62 877-5537-2518",
      },
    ],
    registration: {
      // Same OLM batch as OLM-300 / OLM-301 (bff0a515-40d7-477e-b0c1-301fa59d3c19), per instruction.
      batchId: "bff0a515-40d7-477e-b0c1-301fa59d3c19",
      paymentProof:
        "https://4s0138q05g.ufs.sh/f/L7c2JRqY80pw0qL8sOUHfBpvXzW5PbG2ZIu98JQnViqgNOYR",
      status: "PENDING" as const,
    },
  },
];

export async function seedTeams() {
  for (const entry of teamSeeds) {
    const hashedPassword = await bcrypt.hash(entry.team.password, 10);

    const team = await prisma.team.upsert({
      where: { email: entry.team.email },
      update: {},
      create: {
        ...entry.team,
        password: hashedPassword,
      },
    });

    await prisma.mentor.upsert({
      where: { teamId: team.id },
      update: {},
      create: {
        ...entry.mentor,
        teamId: team.id,
      },
    });

    for (const member of entry.members) {
      await prisma.member.upsert({
        where: { email: member.email },
        update: {},
        create: {
          ...member,
          teamId: team.id,
        },
      });
    }

    // competitionId isn't part of the form data — derive it from the batch
    // instead of hardcoding it, so it can never drift from the batch's actual competition.
    const batch = await prisma.batch.findUniqueOrThrow({
      where: { id: entry.registration.batchId },
    });

    await prisma.registration.upsert({
      where: { teamId: team.id },
      update: {},
      create: {
        teamId: team.id,
        batchId: batch.id,
        competitionId: batch.competitionId,
        paymentProof: entry.registration.paymentProof,
        status: entry.registration.status,
      },
    });
  }

  console.log(`✅ ${teamSeeds.length} team(s) seeded`);
}