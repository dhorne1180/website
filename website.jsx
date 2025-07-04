import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Main App component for the personal portfolio website
const App = () => {
  // State variables for Firebase services and user ID
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Initialize Firebase and handle authentication
  useEffect(() => {
    try {
      // Retrieve Firebase config and app ID from global variables
      const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
      const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

      // Initialize Firebase app
      const app = initializeApp(firebaseConfig, appId);
      const firestore = getFirestore(app);
      const firebaseAuth = getAuth(app);

      setDb(firestore);
      setAuth(firebaseAuth);

      // Listen for authentication state changes
      const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
        if (user) {
          setUserId(user.uid);
        } else {
          // If no user, sign in anonymously if no custom token is provided
          if (typeof __initial_auth_token === 'undefined') {
            try {
              const anonymousUser = await signInAnonymously(firebaseAuth);
              setUserId(anonymousUser.user.uid);
            } catch (error) {
              console.error("Error signing in anonymously:", error);
            }
          }
        }
        setIsAuthReady(true); // Mark authentication as ready
      });

      // Attempt to sign in with custom token if available
      if (typeof __initial_auth_token !== 'undefined') {
        signInWithCustomToken(firebaseAuth, __initial_auth_token)
          .then((userCredential) => {
            console.log("Signed in with custom token:", userCredential.user.uid);
          })
          .catch((error) => {
            console.error("Error signing in with custom token:", error);
            // Fallback to anonymous sign-in if custom token fails
            signInAnonymously(firebaseAuth)
              .then((userCredential) => {
                console.log("Signed in anonymously after custom token failure:", userCredential.user.uid);
                setUserId(userCredential.user.uid);
              })
              .catch((anonError) => {
                console.error("Error signing in anonymously after custom token failure:", anonError);
              });
          });
      } else {
        // If no initial auth token, ensure anonymous sign-in is handled by onAuthStateChanged
        console.log("No initial auth token provided. Anonymous sign-in will be handled by onAuthStateChanged.");
      }

      // Cleanup subscription on unmount
      return () => unsubscribe();
    } catch (error) {
      console.error("Error initializing Firebase:", error);
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  // Main layout of the portfolio website
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 antialiased">
      {/* Tailwind CSS CDN for styling */}
      <script src="https://cdn.tailwindcss.com"></script>
      {/* Inter font from Google Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      {/* Conditional rendering for Firebase user ID */}
      {isAuthReady && userId && (
        <div className="absolute top-2 right-2 text-xs text-gray-500 p-1 bg-gray-100 rounded-md shadow-sm">
          User ID: {userId}
        </div>
      )}

      {/* Header Section */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-6 shadow-lg">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-2 rounded-lg p-2 inline-block bg-white bg-opacity-10 shadow-md">
            [Your Name Here]
          </h1>
          <p className="text-xl font-light opacity-90">Experienced Professional IT Architect</p>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto px-4 py-12">
        {/* About Me Section */}
        <section id="about" className="mb-16 bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-4xl font-semibold text-blue-700 mb-6 border-b-4 border-blue-300 pb-2 inline-block">
            About Me
          </h2>
          <p className="text-lg leading-relaxed text-gray-700 mb-4">
            I am a highly **professional** and **experienced** IT Architect with a proven track record of designing,
            implementing, and optimizing robust technology solutions. My career has been defined by a commitment to
            driving innovation and delivering tangible business value through strategic IT initiatives.
          </p>
          <p className="text-lg leading-relaxed text-gray-700">
            With a deep understanding of enterprise architecture, cloud computing, cybersecurity, and data management,
            I excel at translating complex technical requirements into scalable and efficient systems. I am passionate
            about leveraging cutting-edge technologies to solve real-world problems and empower organizations to achieve
            their strategic objectives.
          </p>
        </section>

        {/* Skills Section */}
        <section id="skills" className="mb-16 bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-4xl font-semibold text-blue-700 mb-6 border-b-4 border-blue-300 pb-2 inline-block">
            Skills
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Example Skill Categories */}
            <div className="bg-blue-50 p-6 rounded-lg shadow-md border border-blue-100">
              <h3 className="text-2xl font-medium text-blue-800 mb-3">Cloud Platforms</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>AWS (EC2, S3, Lambda, RDS)</li>
                <li>Azure (VMs, Azure Functions, Cosmos DB)</li>
                <li>Google Cloud Platform (GCP)</li>
              </ul>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg shadow-md border border-blue-100">
              <h3 className="text-2xl font-medium text-blue-800 mb-3">Programming & Scripting</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Python</li>
                <li>JavaScript (Node.js, React)</li>
                <li>Bash/Shell Scripting</li>
                <li>SQL</li>
              </ul>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg shadow-md border border-blue-100">
              <h3 className="text-2xl font-medium text-blue-800 mb-3">DevOps & CI/CD</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Docker, Kubernetes</li>
                <li>Jenkins, GitLab CI/CD</li>
                <li>Terraform, Ansible</li>
              </ul>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg shadow-md border border-blue-100">
              <h3 className="text-2xl font-medium text-blue-800 mb-3">Databases</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>PostgreSQL, MySQL</li>
                <li>MongoDB, Cassandra</li>
                <li>Redis</li>
              </ul>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg shadow-md border border-blue-100">
              <h3 className="text-2xl font-medium text-blue-800 mb-3">Networking & Security</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>TCP/IP, DNS, VPN</li>
                <li>Firewalls, IDS/IPS</li>
                <li>Identity and Access Management (IAM)</li>
              </ul>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg shadow-md border border-blue-100">
              <h3 className="text-2xl font-medium text-blue-800 mb-3">Methodologies</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Agile, Scrum</li>
                <li>ITIL</li>
                <li>Enterprise Architecture Frameworks (e.g., TOGAF)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Portfolio/Projects Section */}
        <section id="projects" className="mb-16 bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-4xl font-semibold text-blue-700 mb-6 border-b-4 border-blue-300 pb-2 inline-block">
            Portfolio / Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Example Project Card 1 */}
            <div className="bg-gray-100 p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <img
                src="https://placehold.co/400x250/E0F2F7/2C5282?text=Project+Image+1"
                alt="Project 1"
                className="w-full h-auto rounded-md mb-4 object-cover"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x250/E0F2F7/2C5282?text=Image+Load+Error"; }}
              />
              <h3 className="text-2xl font-medium text-gray-900 mb-2">Cloud Migration Strategy</h3>
              <p className="text-gray-700 text-sm mb-4">
                Led the strategic planning and execution of a large-scale cloud migration for a financial services client,
                resulting in a 30% reduction in infrastructure costs and improved scalability.
              </p>
              <a href="#" className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200">
                View Details &rarr;
              </a>
            </div>

            {/* Example Project Card 2 */}
            <div className="bg-gray-100 p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <img
                src="https://placehold.co/400x250/E0F2F7/2C5282?text=Project+Image+2"
                alt="Project 2"
                className="w-full h-auto rounded-md mb-4 object-cover"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x250/E0F2F7/2C5282?text=Image+Load+Error"; }}
              />
              <h3 className="text-2xl font-medium text-gray-900 mb-2">Automated CI/CD Pipeline</h3>
              <p className="text-gray-700 text-sm mb-4">
                Designed and implemented a fully automated CI/CD pipeline using Jenkins, Docker, and Kubernetes,
                reducing deployment times by 75% and improving release reliability.
              </p>
              <a href="#" className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200">
                View Details &rarr;
              </a>
            </div>

            {/* Example Project Card 3 */}
            <div className="bg-gray-100 p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <img
                src="https://placehold.co/400x250/E0F2F7/2C5282?text=Project+Image+3"
                alt="Project 3"
                className="w-full h-auto rounded-md mb-4 object-cover"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x250/E0F2F7/2C5282?text=Image+Load+Error"; }}
              />
              <h3 className="text-2xl font-medium text-gray-900 mb-2">Enterprise Security Architecture</h3>
              <p className="text-gray-700 text-sm mb-4">
                Developed and enforced enterprise-wide security policies and architectures, integrating advanced threat
                detection systems and ensuring compliance with industry standards.
              </p>
              <a href="#" className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200">
                View Details &rarr;
              </a>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-4xl font-semibold text-blue-700 mb-6 border-b-4 border-blue-300 pb-2 inline-block">
            Contact Me
          </h2>
          <p className="text-lg leading-relaxed text-gray-700 mb-6">
            I'm always open to discussing new projects, collaboration opportunities, or potential roles. Feel free to reach out!
          </p>
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-lg font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
                placeholder="your.email@example.com"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-lg font-medium text-gray-700 mb-2">Message</label>
              <textarea
                id="message"
                name="message"
                rows="6"
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-lg"
                placeholder="Your message here..."
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Send Message
            </button>
          </form>
        </section>
      </main>

      {/* Footer Section */}
      <footer className="bg-gray-800 text-white py-6 mt-12 shadow-inner">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} [Your Name]. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-4">
            {/* Example Social Media Links */}
            <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">LinkedIn</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">GitHub</a>
            {/* Add more social links as needed */}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
