import LicenseValidator from '@/components/LicenseValidator';
import DownloadRequestForm from '@/components/DownloadRequestForm';

export default function SovereignUtilityPage() {
  return (
    <main className="container mx-auto px-6 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          Sovereign Utility
        </h1>
        <p className="text-lg text-gray-400 mb-12">
          Manage Your DeepThought Assets
        </p>
      </div>

      <div className="flex flex-col items-center space-y-12">
        <section id="license-validation" className="w-full flex justify-center">
          <LicenseValidator />
        </section>

        <div className="border-b border-gray-700 w-full max-w-md"></div>

        <section id="software-downloads" className="w-full flex justify-center">
          <DownloadRequestForm />
        </section>
      </div>
    </main>
  );
}
