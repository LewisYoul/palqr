import { options } from "./api/auth/[...nextauth]/options"
import { getServerSession } from 'next-auth/next'
import Header from "./components/Header"
import { redirect } from 'next/navigation';
import dynamic from 'next/dynamic'
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const LoggedOutQrCodeGenerator = dynamic(() => import('./components/qr-code-generators/LoggedOutQrCodeGenerator'), {
  ssr: false
})

export default async function Home() {
  const session = await getServerSession(options)

  if (session === null) {
    return (
      <div className="bg-white h-screen">
        <div className="max-w-6xl m-auto">
          <Header />

          <div className="relative isolate px-6 pt-14 lg:px-8">
            {/* <div
              className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
              aria-hidden="true"
            >
              <div
                className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                style={{
                  clipPath:
                    'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                }}
              />
            </div> */}
            <div className="mx-auto max-w-3xl py-16">
              <div className="text-center">
                <h1 className="text-5xl font-bold tracking-tight text-gray-900">
                  Create QR codes for free
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  Create and download QR codes
                </p>
              </div>
            </div>
            <div className="w-full md:w-[1080px] mx-auto">
              <LoggedOutQrCodeGenerator />
            </div>
            <div
              className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
              aria-hidden="true"
            >
              <div
                className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                style={{
                  clipPath:
                    'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    )
  } else {
    redirect("dashboard")
  }
}
