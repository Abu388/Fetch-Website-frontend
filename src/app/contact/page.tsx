'use client';

export default function FetchPluginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 p-6 md:p-10">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8 md:p-12 transform transition-all duration-300 hover:shadow-3xl">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 animate-pulse drop-shadow-lg tracking-tight">
          Fetch Plugin Download
        </h1>

        <p className="text-gray-600 text-lg md:text-xl mb-8 text-center leading-relaxed">
          Download our Fetch Plugin to effortlessly fetch full HTML pages with beautifully formatted code, ready to use locally on your computer.
        </p>

        <div className="text-center mb-10">
          <a
            href="/plugins/fetch-plugin.zip"
            download
            className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 font-semibold text-lg"
          >
            Download Fetch Plugin
          </a>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-blue-600">Step-by-Step Guide</h2>
        <ol className="list-decimal list-inside space-y-4 text-gray-700 text-lg md:text-xl">
          <li><strong>Download</strong> the zip file using the button above.</li>
          <li><strong>Extract</strong> the folder to your preferred location on your computer.</li>
          <li><strong>Open a terminal</strong> inside the extracted folder.</li>
          <li>
            <strong>Install dependencies:</strong>
            <pre className="bg-gray-100 p-4 rounded-lg mt-2 font-mono text-sm text-gray-800">npm install</pre>
            This installs <code className="bg-gray-200 px-1 rounded">node-fetch</code> and <code className="bg-gray-200 px-1 rounded">prettier</code>.
          </li>
          <li>
            <strong>Run the plugin:</strong>
            <pre className="bg-gray-100 p-4 rounded-lg mt-2 font-mono text-sm text-gray-800">node test.js</pre>
          </li>
          <li>
            <strong>Enter the URL</strong> you want to fetch when prompted in the terminal.
          </li>
          <li>
            The plugin will fetch the full page and display <strong>well-formatted HTML</strong> in the terminal.
          </li>
        </ol>

        <div className="mt-8 p-6 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 rounded-lg">
          <p className="font sarcoma-semibold">Important:</p>
          <p>Ensure you have Node.js installed on your computer before running the plugin. A stable internet connection is required to fetch URLs.</p>
        </div>
      </div>
    </div>
  );
}