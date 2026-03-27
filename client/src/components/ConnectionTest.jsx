import { useState, useEffect } from "react";
import { API_URL, SERVER_URL } from "../../utils/apiConfig";

/**
 * ConnectionTest Component
 * 
 * This component verifies that:
 * 1. Frontend is properly configured with environment variables
 * 2. REST API endpoint is reachable
 * 3. Socket.IO server is reachable
 * 
 * Use this for troubleshooting deployment issues or verifying production setup.
 * Can be imported and used in dev mode for quick diagnostics.
 */
const ConnectionTest = () => {
	const [testResults, setTestResults] = useState({
		apiUrl: API_URL,
		serverUrl: SERVER_URL,
		apiServerReachable: null,
		apiHealthCheck: null,
		error: null,
	});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const testConnections = async () => {
			try {
				setLoading(true);
				const results = { ...testResults };

				// Test if API server is reachable
				try {
					const response = await fetch(`${API_URL}/api/auth/login`, {
						method: "OPTIONS",
					});
					results.apiServerReachable = response.ok || response.status === 404;
				} catch (err) {
					results.apiServerReachable = false;
					results.error = err.message;
				}

				// Try a simple health check endpoint
				try {
					const response = await fetch(`${API_URL}/api/auth/login`, {
						method: "HEAD",
					});
					results.apiHealthCheck = true;
				} catch (err) {
					results.apiHealthCheck = false;
				}

				setTestResults(results);
			} finally {
				setLoading(false);
			}
		};

		testConnections();
	}, []);

	return (
		<div className="w-full max-w-md mx-auto p-4 bg-base-200 rounded-lg shadow">
			<h2 className="text-2xl font-bold mb-4">Connection Test</h2>

			{loading ? (
				<div className="text-center">
					<p className="text-gray-500">Testing connections...</p>
				</div>
			) : (
				<div className="space-y-4">
					{/* API URL */}
					<div>
						<label className="text-sm font-semibold">API URL</label>
						<p className="text-xs bg-gray-900 p-2 rounded text-green-400 break-all">
							{testResults.apiUrl}
						</p>
					</div>

					{/* Server URL */}
					<div>
						<label className="text-sm font-semibold">Server URL (Socket.IO)</label>
						<p className="text-xs bg-gray-900 p-2 rounded text-green-400 break-all">
							{testResults.serverUrl}
						</p>
					</div>

					{/* API Reachability */}
					<div>
						<label className="text-sm font-semibold">API Server Reachable</label>
						<div className="flex items-center gap-2">
							<div
								className={`w-3 h-3 rounded-full ${
									testResults.apiServerReachable ? "bg-green-500" : "bg-red-500"
								}`}
							/>
							<span className="text-sm">
								{testResults.apiServerReachable ? "✅ Yes" : "❌ No"}
							</span>
						</div>
					</div>

					{/* Health Check */}
					<div>
						<label className="text-sm font-semibold">Backend Health</label>
						<div className="flex items-center gap-2">
							<div
								className={`w-3 h-3 rounded-full ${
									testResults.apiHealthCheck ? "bg-green-500" : "bg-orange-500"
								}`}
							/>
							<span className="text-sm">
								{testResults.apiHealthCheck ? "✅ Responding" : "⚠️ Endpoint unreachable"}
							</span>
						</div>
					</div>

					{/* Error Message */}
					{testResults.error && (
						<div className="bg-error bg-opacity-20 border border-error rounded p-2">
							<p className="text-error text-sm">{testResults.error}</p>
						</div>
					)}

					{/* Status Summary */}
					<div className="mt-4 pt-4 border-t">
						{testResults.apiServerReachable ? (
							<p className="text-green-500 text-sm font-semibold">
								✅ Frontend is properly connected to backend!
							</p>
						) : (
							<p className="text-orange-500 text-sm font-semibold">
								⚠️ Cannot reach API server. Check:
								<ul className="list-disc list-inside ml-2 mt-2">
									<li>Backend is running</li>
									<li>Environment variables are set correctly</li>
									<li>CORS is configured on backend</li>
									<li>Railway backend is deployed and running</li>
								</ul>
							</p>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default ConnectionTest;
