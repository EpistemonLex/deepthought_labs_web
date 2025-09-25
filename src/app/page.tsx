import Header from '../components/Header';
import ChaosToClarityStoryboard from '../components/ChaosToClarityStoryboard';

export default function Home() {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Header />

      <main className="container mx-auto px-6 py-20">
        <ChaosToClarityStoryboard />
      </main>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 py-10">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} DeepThought Labs. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
