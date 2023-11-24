import { PrismaClient } from '@prisma/client';
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { options } from "../auth/[...nextauth]/options";
import { getServerSession } from 'next-auth/next'

export async function POST(req) {
  const session = await getServerSession(options)

  const formData = await req.formData();
  const png = formData.get('png');
  const pngBuffer = await png.arrayBuffer();
  const svg = formData.get('svg');
  const svgText = await svg.text();

  const prisma = new PrismaClient();

  const qrCode = await prisma.QRCode.create({
    data: {
      teamId: session.team.id,
      createdById: session.user.id,
      link: formData.get('link'),
    }
  })

  console.log('qrCode', qrCode);

  const client = new S3Client({ region: process.env.AWS_DEFAULT_REGION });

  const pngKey = `qrCodes/${qrCode.id}/qr.png`;
  const svgKey = `qrCodes/${qrCode.id}/qr.svg`;

  let command = new PutObjectCommand({
    Bucket: "palqr-development",
    Key: pngKey,
    Body: pngBuffer,
    ContentType: "image/png",
  });

  try {
    const response = await client.send(command);
    console.log(response);
  } catch (err) {
    console.error(err);
  }

  command = new PutObjectCommand({
    Bucket: "palqr-development",
    Key: svgKey,
    Body: svgText,
    ContentType: "`qrCodes/${qrCode.id}/qr.png`",
  });

  try {
    const response = await client.send(command);
    console.log(response);
  } catch (err) {
    console.error(err);
  }

  prisma.File.create({
    data: {
      key: pngKey,
      fileName: 'qr.png',
      fileType: 'image/png',
      fileableId: qrCode.id,
      fileableType: 'QRCode',
    }
  })

  prisma.File.create({
    data: {
      key: svgKey,
      fileName: 'qr.svg',
      fileType: 'image/svg+xml',
      fileableId: qrCode.id,
      fileableType: 'QRCode',
    }
  })

  return Response.json({ message: 'QR Code created!' })
}