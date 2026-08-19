import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, ChevronRight, Check, BookOpen, Code, Terminal, 
  Download, Play, Settings, FileCode, Folder, CheckCircle2,
  AlertCircle, Package, Server, Network, Layers
} from 'lucide-react';

interface TutorialStep {
  id: number;
  title: string;
  description: string;
  content: JSX.Element;
}

export default function SpringBootTutorial() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const toggleStep = (stepId: number) => {
    setCompletedSteps(prev => ({ ...prev, [stepId]: !prev[stepId] }));
  };

  const steps: TutorialStep[] = [
    {
      id: 1,
      title: 'Install Java JDK',
      description: 'Set up Java Development Kit on your computer',
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-900 dark:text-blue-200 mb-3">
              Java is required to run Spring Boot applications. We'll install Java 17 LTS (Long Term Support).
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Download size={16} className="text-primary-500" />
              Step 1.1: Download Java JDK
            </h4>
            <ol className="text-sm space-y-2 ml-6 list-decimal">
              <li>Open your web browser and visit: <a href="https://adoptium.net/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 underline">adoptium.net</a></li>
              <li>Click the big blue "Download" button for Java 17</li>
              <li>Save the installer file to your Downloads folder</li>
            </ol>

            <h4 className="font-semibold text-sm flex items-center gap-2 mt-4">
              <Settings size={16} className="text-primary-500" />
              Step 1.2: Install Java
            </h4>
            <ol className="text-sm space-y-2 ml-6 list-decimal">
              <li>Double-click the downloaded installer file</li>
              <li>Click "Next" through the installation wizard</li>
              <li>Keep the default installation path (e.g., C:\Program Files\Eclipse Adoptium\jdk-17...)</li>
              <li>✅ Check the box "Add to PATH" if shown</li>
              <li>Click "Install" and wait for completion</li>
            </ol>

            <h4 className="font-semibold text-sm flex items-center gap-2 mt-4">
              <Terminal size={16} className="text-primary-500" />
              Step 1.3: Verify Installation
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Open Command Prompt (press <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded">Windows + R</kbd>, type "cmd", press Enter) and run:
            </p>
            <pre className="bg-slate-900 text-green-400 p-3 rounded-lg text-xs overflow-x-auto">
              <code>java -version</code>
            </pre>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Expected output:
            </p>
            <pre className="bg-slate-900 text-green-400 p-3 rounded-lg text-xs overflow-x-auto">
              <code>{`openjdk version "17.0.X" 2024-XX-XX
OpenJDK Runtime Environment Temurin-17+XX
OpenJDK 64-Bit Server VM Temurin-17+XX`}</code>
            </pre>
            <div className="flex items-start gap-2 text-xs text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>If you get an error "java is not recognized", restart your Command Prompt and try again.</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: 'Install IntelliJ IDEA Community Edition',
      description: 'Set up your development environment',
      content: (
        <div className="space-y-4">
          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
            <p className="text-sm text-purple-900 dark:text-purple-200 mb-3">
              IntelliJ IDEA is a powerful IDE (Integrated Development Environment) that makes writing Java code easier. We'll use the free Community Edition.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Download size={16} className="text-primary-500" />
              Step 2.1: Download IntelliJ IDEA
            </h4>
            <ol className="text-sm space-y-2 ml-6 list-decimal">
              <li>Visit: <a href="https://www.jetbrains.com/idea/download/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 underline">jetbrains.com/idea/download</a></li>
              <li>Scroll down to "IntelliJ IDEA Community Edition"</li>
              <li>Click "Download" (it's FREE!)</li>
            </ol>

            <h4 className="font-semibold text-sm flex items-center gap-2 mt-4">
              <Settings size={16} className="text-primary-500" />
              Step 2.2: Install IntelliJ IDEA
            </h4>
            <ol className="text-sm space-y-2 ml-6 list-decimal">
              <li>Run the downloaded installer</li>
              <li>Click "Next" → Choose installation path (default is fine)</li>
              <li>In "Installation Options", check:
                <ul className="ml-6 mt-2 space-y-1 list-disc">
                  <li>✅ 64-bit launcher</li>
                  <li>✅ Add "bin" folder to PATH</li>
                  <li>✅ .java file association</li>
                </ul>
              </li>
              <li>Click "Install" → Wait → Click "Finish"</li>
            </ol>

            <h4 className="font-semibold text-sm flex items-center gap-2 mt-4">
              <Play size={16} className="text-primary-500" />
              Step 2.3: First Launch
            </h4>
            <ol className="text-sm space-y-2 ml-6 list-decimal">
              <li>Launch IntelliJ IDEA from Start Menu</li>
              <li>Choose "Do not import settings" (first time)</li>
              <li>Select your preferred theme (Light or Dark)</li>
              <li>Click "Skip Remaining and Set Defaults"</li>
            </ol>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: 'Create Spring Boot Project',
      description: 'Use Spring Initializr to generate your project',
      content: (
        <div className="space-y-4">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <p className="text-sm text-green-900 dark:text-green-200 mb-3">
              Spring Initializr is a web tool that generates a ready-to-use Spring Boot project with all necessary files and dependencies.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Network size={16} className="text-primary-500" />
              Step 3.1: Generate Project
            </h4>
            <ol className="text-sm space-y-2 ml-6 list-decimal">
              <li>Open your browser and go to: <a href="https://start.spring.io/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 underline">start.spring.io</a></li>
              <li>Configure your project:
                <div className="mt-2 bg-slate-50 dark:bg-slate-800 p-3 rounded text-xs space-y-1">
                  <div><strong>Project:</strong> Maven</div>
                  <div><strong>Language:</strong> Java</div>
                  <div><strong>Spring Boot:</strong> 3.2.0 (or latest stable)</div>
                  <div><strong>Group:</strong> com.network.management</div>
                  <div><strong>Artifact:</strong> netconf-restconf-demo</div>
                  <div><strong>Name:</strong> netconf-restconf-demo</div>
                  <div><strong>Description:</strong> NETCONF and RESTCONF Protocol Demo</div>
                  <div><strong>Package name:</strong> com.network.management.demo</div>
                  <div><strong>Packaging:</strong> Jar</div>
                  <div><strong>Java:</strong> 17</div>
                </div>
              </li>
              <li>Click "ADD DEPENDENCIES" button and search for:
                <ul className="ml-6 mt-2 space-y-1 list-disc">
                  <li>✅ <strong>Spring Web</strong> (for REST APIs)</li>
                  <li>✅ <strong>Lombok</strong> (reduces boilerplate code)</li>
                </ul>
              </li>
              <li>Click the "GENERATE" button (downloads a .zip file)</li>
            </ol>

            <h4 className="font-semibold text-sm flex items-center gap-2 mt-4">
              <Folder size={16} className="text-primary-500" />
              Step 3.2: Extract and Open Project
            </h4>
            <ol className="text-sm space-y-2 ml-6 list-decimal">
              <li>Extract the downloaded .zip file to a folder (e.g., C:\Projects\)</li>
              <li>Open IntelliJ IDEA</li>
              <li>Click "Open" on the welcome screen</li>
              <li>Navigate to the extracted folder and select it</li>
              <li>Click "Trust Project" when prompted</li>
              <li>Wait for IntelliJ to download dependencies (see progress bar at bottom) - this may take 2-5 minutes</li>
            </ol>

            <div className="flex items-start gap-2 text-xs text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
              <span>When you see "Build: Successful" at the bottom, your project is ready!</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      title: 'Add NETCONF Dependencies',
      description: 'Add libraries for NETCONF protocol',
      content: (
        <div className="space-y-4">
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
            <p className="text-sm text-orange-900 dark:text-orange-200 mb-3">
              To work with NETCONF, we need to add a third-party library. We'll use Apache MINA for SSH communication.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <FileCode size={16} className="text-primary-500" />
              Step 4.1: Edit pom.xml
            </h4>
            <ol className="text-sm space-y-2 ml-6 list-decimal">
              <li>In IntelliJ, find "pom.xml" in the project tree on the left</li>
              <li>Double-click to open it</li>
              <li>Find the <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">&lt;dependencies&gt;</code> section</li>
              <li>Add these dependencies inside <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">&lt;dependencies&gt;...&lt;/dependencies&gt;</code>:</li>
            </ol>

            <pre className="bg-slate-900 text-green-400 p-3 rounded-lg text-xs overflow-x-auto mt-2">
              <code>{`<!-- NETCONF client library -->
<dependency>
    <groupId>org.apache.sshd</groupId>
    <artifactId>sshd-netconf</artifactId>
    <version>2.10.0</version>
</dependency>

<!-- SSH core -->
<dependency>
    <groupId>org.apache.sshd</groupId>
    <artifactId>sshd-core</artifactId>
    <version>2.10.0</version>
</dependency>

<!-- XML processing -->
<dependency>
    <groupId>javax.xml.bind</groupId>
    <artifactId>jaxb-api</artifactId>
    <version>2.3.1</version>
</dependency>`}</code>
            </pre>

            <h4 className="font-semibold text-sm flex items-center gap-2 mt-4">
              <Package size={16} className="text-primary-500" />
              Step 4.2: Reload Maven
            </h4>
            <ol className="text-sm space-y-2 ml-6 list-decimal">
              <li>After saving pom.xml, look for a small Maven icon (M) in the top-right corner of the editor</li>
              <li>Click the "Reload" icon or press <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded">Ctrl + Shift + O</kbd></li>
              <li>Wait for dependencies to download (check progress at bottom)</li>
            </ol>

            <div className="flex items-start gap-2 text-xs text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>If you see any red underlines in the pom.xml, make sure you're connected to the internet and try reloading again.</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 5,
      title: 'Create NETCONF Client Code',
      description: 'Write code to connect to a NETCONF server',
      content: (
        <div className="space-y-4">
          <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4">
            <p className="text-sm text-indigo-900 dark:text-indigo-200 mb-3">
              Now we'll write Java code to establish an SSH connection and send NETCONF messages.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Code size={16} className="text-primary-500" />
              Step 5.1: Create NetconfClient.java
            </h4>
            <ol className="text-sm space-y-2 ml-6 list-decimal">
              <li>Right-click on <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">src/main/java/com/network/management/demo</code></li>
              <li>Select "New" → "Java Class"</li>
              <li>Name it "NetconfClient" and press Enter</li>
              <li>Copy and paste this complete code:</li>
            </ol>

            <pre className="bg-slate-900 text-green-400 p-3 rounded-lg text-xs overflow-x-auto mt-2">
              <code>{`package com.network.management.demo;

import org.apache.sshd.client.SshClient;
import org.apache.sshd.client.session.ClientSession;
import org.apache.sshd.client.channel.ClientChannel;
import org.springframework.stereotype.Component;
import java.io.*;
import java.nio.charset.StandardCharsets;

/**
 * Simple NETCONF Client using SSH
 * This demonstrates how to connect to a NETCONF server
 */
@Component
public class NetconfClient {

    // NETCONF hello message - tells server what we support
    private static final String HELLO_MESSAGE = 
        "<?xml version=\\"1.0\\" encoding=\\"UTF-8\\"?>\\n" +
        "<hello xmlns=\\"urn:ietf:params:xml:ns:netconf:base:1.0\\">\\n" +
        "  <capabilities>\\n" +
        "    <capability>urn:ietf:params:netconf:base:1.0</capability>\\n" +
        "  </capabilities>\\n" +
        "</hello>\\n]]>]]>";

    /**
     * Connect to NETCONF server and exchange hello messages
     */
    public void connect(String host, int port, String username, String password) {
        System.out.println("🔌 Connecting to NETCONF server at " + host + ":" + port);
        
        // Create SSH client
        SshClient client = SshClient.setUpDefaultClient();
        client.start();
        
        try {
            // Establish SSH connection
            ClientSession session = client.connect(username, host, port)
                    .verify(10000)  // 10 second timeout
                    .getSession();
            
            // Authenticate with password
            session.addPasswordIdentity(password);
            session.auth().verify(10000);
            
            System.out.println("✅ SSH connection established");
            
            // Open NETCONF subsystem channel
            ClientChannel channel = session.createSubsystemChannel("netconf");
            channel.open().verify(5000);
            
            System.out.println("✅ NETCONF subsystem opened");
            
            // Send HELLO message
            OutputStream out = channel.getInvertedIn();
            out.write(HELLO_MESSAGE.getBytes(StandardCharsets.UTF_8));
            out.flush();
            
            System.out.println("📤 Sent HELLO message to server");
            
            // Read server's HELLO response
            InputStream in = channel.getInvertedOut();
            BufferedReader reader = new BufferedReader(
                new InputStreamReader(in, StandardCharsets.UTF_8)
            );
            
            StringBuilder response = new StringBuilder();
            String line;
            System.out.println("📥 Receiving server HELLO...");
            
            while ((line = reader.readLine()) != null) {
                response.append(line).append("\\n");
                if (line.contains("]]>]]>")) {
                    break;  // End of NETCONF message
                }
            }
            
            System.out.println("✅ Received server capabilities:");
            System.out.println(response.toString());
            
            // Clean up
            channel.close();
            session.close();
            client.stop();
            
            System.out.println("🔒 Connection closed");
            
        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    /**
     * Example: Send a get-config RPC
     */
    public void getConfig(String host, int port, String username, String password) {
        // Similar structure - students can implement this as practice!
        System.out.println("TODO: Implement get-config RPC");
    }
}`}</code>
            </pre>

            <div className="flex items-start gap-2 text-xs text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mt-2">
              <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
              <div>
                <strong>What this code does:</strong>
                <ul className="mt-1 space-y-1 list-disc ml-4">
                  <li>Creates an SSH connection to port 830 (NETCONF default)</li>
                  <li>Sends a HELLO message with our capabilities</li>
                  <li>Receives the server's HELLO response</li>
                  <li>Prints everything to console so you can see what's happening</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 6,
      title: 'Create RESTCONF Client Code',
      description: 'Write code to interact with RESTCONF API',
      content: (
        <div className="space-y-4">
          <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg p-4">
            <p className="text-sm text-teal-900 dark:text-teal-200 mb-3">
              RESTCONF is simpler than NETCONF - it uses standard HTTP methods (GET, POST, PUT, DELETE) like a regular web API.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Code size={16} className="text-primary-500" />
              Step 6.1: Create RestconfClient.java
            </h4>
            <ol className="text-sm space-y-2 ml-6 list-decimal">
              <li>Right-click on your package folder again</li>
              <li>Select "New" → "Java Class"</li>
              <li>Name it "RestconfClient"</li>
              <li>Paste this code:</li>
            </ol>

            <pre className="bg-slate-900 text-green-400 p-3 rounded-lg text-xs overflow-x-auto mt-2">
              <code>{`package com.network.management.demo;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import java.util.Base64;

/**
 * Simple RESTCONF Client using Spring's RestTemplate
 * RESTCONF = NETCONF over HTTP/HTTPS with REST principles
 */
@Component
public class RestconfClient {

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * GET request - retrieve configuration data
     */
    public void getInterfaces(String baseUrl, String username, String password) {
        System.out.println("🌐 Sending GET request to RESTCONF server");
        
        try {
            // RESTCONF URL format: {baseUrl}/restconf/data/{module}:{container}
            String url = baseUrl + "/restconf/data/ietf-interfaces:interfaces";
            
            // Create HTTP headers with authentication
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.valueOf("application/yang-data+json"));
            headers.set("Accept", "application/yang-data+json");
            
            // Add Basic Authentication (username:password in Base64)
            String auth = username + ":" + password;
            String encodedAuth = Base64.getEncoder().encodeToString(
                auth.getBytes()
            );
            headers.set("Authorization", "Basic " + encodedAuth);
            
            // Create HTTP entity with headers
            HttpEntity<String> entity = new HttpEntity<>(headers);
            
            // Send GET request
            ResponseEntity<String> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                String.class
            );
            
            // Print response
            System.out.println("✅ Response Status: " + response.getStatusCode());
            System.out.println("📥 Response Body:");
            System.out.println(response.getBody());
            
        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    /**
     * POST request - create new configuration
     */
    public void createInterface(String baseUrl, String username, String password, 
                                 String interfaceName, String ipAddress) {
        System.out.println("🌐 Sending POST request to create interface");
        
        try {
            String url = baseUrl + "/restconf/data/ietf-interfaces:interfaces";
            
            // Build JSON payload (YANG data in JSON format)
            String jsonPayload = String.format(
                "{" +
                "  \\"ietf-interfaces:interface\\": {" +
                "    \\"name\\": \\"%s\\"," +
                "    \\"type\\": \\"iana-if-type:ethernetCsmacd\\"," +
                "    \\"enabled\\": true," +
                "    \\"ietf-ip:ipv4\\": {" +
                "      \\"address\\": [{" +
                "        \\"ip\\": \\"%s\\"," +
                "        \\"netmask\\": \\"255.255.255.0\\"" +
                "      }]" +
                "    }" +
                "  }" +
                "}",
                interfaceName, ipAddress
            );
            
            // Set headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.valueOf("application/yang-data+json"));
            headers.set("Accept", "application/yang-data+json");
            String auth = username + ":" + password;
            headers.set("Authorization", "Basic " + 
                Base64.getEncoder().encodeToString(auth.getBytes())
            );
            
            // Create entity with payload
            HttpEntity<String> entity = new HttpEntity<>(jsonPayload, headers);
            
            // Send POST request
            ResponseEntity<String> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                entity,
                String.class
            );
            
            System.out.println("✅ Interface created! Status: " + response.getStatusCode());
            
        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
        }
    }
}`}</code>
            </pre>

            <div className="flex items-start gap-2 text-xs text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg p-3 mt-2">
              <Server size={16} className="shrink-0 mt-0.5" />
              <div>
                <strong>Key Differences from NETCONF:</strong>
                <ul className="mt-1 space-y-1 list-disc ml-4">
                  <li>Uses HTTP methods: GET (read), POST (create), PUT (update), DELETE (remove)</li>
                  <li>Data format: JSON instead of XML</li>
                  <li>No SSH tunnel needed - works over HTTPS</li>
                  <li>Uses HTTP Basic Authentication</li>
                  <li>Special header: "application/yang-data+json"</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 7,
      title: 'Create Main Application Runner',
      description: 'Wire everything together and run your code',
      content: (
        <div className="space-y-4">
          <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-lg p-4">
            <p className="text-sm text-rose-900 dark:text-rose-200 mb-3">
              Let's create a main class that runs when you start the application. This will call our NETCONF and RESTCONF clients.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Terminal size={16} className="text-primary-500" />
              Step 7.1: Create DemoRunner.java
            </h4>
            <ol className="text-sm space-y-2 ml-6 list-decimal">
              <li>Create a new class called "DemoRunner"</li>
              <li>Paste this code:</li>
            </ol>

            <pre className="bg-slate-900 text-green-400 p-3 rounded-lg text-xs overflow-x-auto mt-2">
              <code>{`package com.network.management.demo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import lombok.RequiredArgsConstructor;

/**
 * Runs automatically when Spring Boot starts
 * This is where we test our NETCONF and RESTCONF clients
 */
@Component
@RequiredArgsConstructor
public class DemoRunner implements CommandLineRunner {

    private final NetconfClient netconfClient;
    private final RestconfClient restconfClient;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("\\n" + "=".repeat(60));
        System.out.println("🚀 Starting NETCONF and RESTCONF Demo");
        System.out.println("=".repeat(60) + "\\n");
        
        // --- NETCONF Demo ---
        System.out.println("📡 Testing NETCONF Protocol");
        System.out.println("-".repeat(60));
        
        // NOTE: Replace these with your actual device details
        // For testing, you can use a simulator like:
        // - Cisco DevNet Sandbox: https://developer.cisco.com/site/sandbox/
        // - EVE-NG with Cisco routers
        // - Docker container: docker run -p 830:830 ciscotestautomation/netconf
        
        String netconfHost = "localhost";  // or your device IP
        int netconfPort = 830;
        String netconfUser = "admin";
        String netconfPass = "admin";
        
        try {
            netconfClient.connect(netconfHost, netconfPort, netconfUser, netconfPass);
        } catch (Exception e) {
            System.out.println("⚠️  NETCONF connection failed (is a server running?)");
            System.out.println("   Error: " + e.getMessage());
        }
        
        System.out.println();
        
        // --- RESTCONF Demo ---
        System.out.println("📡 Testing RESTCONF Protocol");
        System.out.println("-".repeat(60));
        
        String restconfUrl = "https://localhost:443";  // or your device
        String restconfUser = "admin";
        String restconfPass = "admin";
        
        try {
            // GET example
            restconfClient.getInterfaces(restconfUrl, restconfUser, restconfPass);
            
            System.out.println();
            
            // POST example (commented out to avoid accidental config changes)
            // restconfClient.createInterface(
            //     restconfUrl, restconfUser, restconfPass,
            //     "GigabitEthernet0/0/1", "192.168.100.1"
            // );
            
        } catch (Exception e) {
            System.out.println("⚠️  RESTCONF connection failed (is a server running?)");
            System.out.println("   Error: " + e.getMessage());
        }
        
        System.out.println("\\n" + "=".repeat(60));
        System.out.println("✅ Demo Complete!");
        System.out.println("=".repeat(60));
        System.out.println("\\n💡 To test with a real device:");
        System.out.println("   1. Get access to a Cisco DevNet sandbox");
        System.out.println("   2. Or run: docker run -p 830:830 ciscotestautomation/netconf");
        System.out.println("   3. Update the host/port/credentials in DemoRunner.java");
        System.out.println("   4. Run the application again\\n");
    }
}`}</code>
            </pre>

            <div className="flex items-start gap-2 text-xs text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mt-2">
              <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
              <div>
                <strong>What happens when you run this:</strong>
                <ul className="mt-1 space-y-1 list-disc ml-4">
                  <li>Spring Boot starts your application</li>
                  <li>The <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">run()</code> method executes automatically</li>
                  <li>It tries to connect to NETCONF server on port 830</li>
                  <li>Then tries to call RESTCONF API on port 443</li>
                  <li>All output prints to your console</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 8,
      title: 'Run and Test Your Application',
      description: 'Execute your code and see the results',
      content: (
        <div className="space-y-4">
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
            <p className="text-sm text-emerald-900 dark:text-emerald-200 mb-3">
              Time to run your application! Don't worry if you see connection errors - you need a real NETCONF/RESTCONF server to fully test.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Play size={16} className="text-primary-500" />
              Step 8.1: Run from IntelliJ
            </h4>
            <ol className="text-sm space-y-2 ml-6 list-decimal">
              <li>Find the main application file (ends with "Application.java")</li>
              <li>You'll see a green play button ▶️ next to the class name</li>
              <li>Click the play button → Select "Run 'Application'"</li>
              <li>Watch the console at the bottom for output</li>
            </ol>

            <h4 className="font-semibold text-sm flex items-center gap-2 mt-4">
              <Terminal size={16} className="text-primary-500" />
              Step 8.2: Alternative - Run from Terminal
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Open terminal in IntelliJ (bottom toolbar) and run:
            </p>
            <pre className="bg-slate-900 text-green-400 p-3 rounded-lg text-xs overflow-x-auto">
              <code>mvnw spring-boot:run</code>
            </pre>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              On Windows, use:
            </p>
            <pre className="bg-slate-900 text-green-400 p-3 rounded-lg text-xs overflow-x-auto">
              <code>mvnw.cmd spring-boot:run</code>
            </pre>

            <h4 className="font-semibold text-sm flex items-center gap-2 mt-4">
              <CheckCircle2 size={16} className="text-primary-500" />
              Step 8.3: Expected Output
            </h4>
            <pre className="bg-slate-900 text-green-400 p-3 rounded-lg text-xs overflow-x-auto">
              <code>{`============================================================
🚀 Starting NETCONF and RESTCONF Demo
============================================================

📡 Testing NETCONF Protocol
------------------------------------------------------------
🔌 Connecting to NETCONF server at localhost:830
⚠️  NETCONF connection failed (is a server running?)
   Error: Connection refused: connect

📡 Testing RESTCONF Protocol
------------------------------------------------------------
🌐 Sending GET request to RESTCONF server
⚠️  RESTCONF connection failed (is a server running?)
   Error: Connection refused

============================================================
✅ Demo Complete!
============================================================

💡 To test with a real device:
   1. Get access to a Cisco DevNet sandbox
   2. Or run: docker run -p 830:830 ciscotestautomation/netconf
   3. Update the host/port/credentials in DemoRunner.java
   4. Run the application again`}</code>
            </pre>

            <div className="space-y-2 mt-4">
              <div className="flex items-start gap-2 text-xs text-green-800 dark:text-green-300 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                <div>
                  <strong>✅ Success!</strong> If you see this output, your application compiled and ran correctly! The connection errors are normal - you need a NETCONF/RESTCONF server to test against.
                </div>
              </div>

              <div className="flex items-start gap-2 text-xs text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <div>
                  <strong>To test with a real device:</strong>
                  <ul className="mt-1 space-y-1 list-disc ml-4">
                    <li>Free option: <a href="https://devnetsandbox.cisco.com/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 underline">Cisco DevNet Sandbox</a> (requires free registration)</li>
                    <li>Docker option: Run <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">docker run -p 830:830 ciscotestautomation/netconf</code></li>
                    <li>Network lab: Use real Cisco/Juniper routers with NETCONF enabled</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 9,
      title: 'Troubleshooting Common Issues',
      description: 'Fix common problems you might encounter',
      content: (
        <div className="space-y-4">
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <p className="text-sm text-amber-900 dark:text-amber-200 mb-3">
              Don't panic if something doesn't work! Here are solutions to common problems beginners face.
            </p>
          </div>

          <div className="space-y-4">
            <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
              <h5 className="font-bold text-sm text-red-600 dark:text-red-400 mb-2">
                ❌ Error: "java: cannot find symbol"
              </h5>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                <strong>Cause:</strong> Missing import or typo in class name
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                <strong>Solution:</strong> Place cursor on the red underlined text and press <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded">Alt + Enter</kbd> → Select "Import class"
              </p>
            </div>

            <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
              <h5 className="font-bold text-sm text-red-600 dark:text-red-400 mb-2">
                ❌ Error: "Could not find or load main class"
              </h5>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                <strong>Cause:</strong> Maven didn't build the project properly
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                <strong>Solution:</strong> In IntelliJ, go to View → Tool Windows → Maven → Click "Reload All Maven Projects" (circular arrow icon)
              </p>
            </div>

            <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
              <h5 className="font-bold text-sm text-red-600 dark:text-red-400 mb-2">
                ❌ Error: "Port 8080 is already in use"
              </h5>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                <strong>Cause:</strong> Another application is using port 8080
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                <strong>Solution:</strong> Create <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">src/main/resources/application.properties</code> and add:
              </p>
              <pre className="bg-slate-900 text-green-400 p-2 rounded text-xs mt-1">
                <code>server.port=8081</code>
              </pre>
            </div>

            <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
              <h5 className="font-bold text-sm text-red-600 dark:text-red-400 mb-2">
                ❌ Error: "Connection refused" or "ConnectException"
              </h5>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                <strong>Cause:</strong> No NETCONF/RESTCONF server is running
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                <strong>Solution:</strong> This is EXPECTED! You need a real network device or simulator. Your code is correct - there's just nothing to connect to yet. See Step 8.3 for testing options.
              </p>
            </div>

            <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
              <h5 className="font-bold text-sm text-red-600 dark:text-red-400 mb-2">
                ❌ Error: "Project JDK is not defined"
              </h5>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                <strong>Cause:</strong> IntelliJ doesn't know where Java is installed
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                <strong>Solution:</strong> File → Project Structure → Project → SDK → Click "Add SDK" → Select your Java 17 installation folder
              </p>
            </div>

            <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
              <h5 className="font-bold text-sm text-orange-600 dark:text-orange-400 mb-2">
                ⚠️ Maven is downloading dependencies forever
              </h5>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                <strong>Cause:</strong> Slow internet or Maven repository issues
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                <strong>Solution:</strong> First time setup can take 5-10 minutes. Check your internet connection. If stuck, click the "Stop" button in IntelliJ, then Maven → Reimport.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2 text-xs text-primary-800 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-3">
            <Layers size={16} className="shrink-0 mt-0.5" />
            <div>
              <strong>💡 Pro Tip:</strong> When you encounter an error, copy the error message and search for it on <a href="https://stackoverflow.com/" target="_blank" rel="noopener noreferrer" className="underline">StackOverflow</a>. Chances are someone else solved it before!
            </div>
          </div>
        </div>
      ),
    },
  ];

  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="mb-6 border-2 border-primary-200 dark:border-primary-800 rounded-2xl overflow-hidden bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20">
      {/* Tutorial Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-blue-600 opacity-10" />
        <div className="relative p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/40">
                  <BookOpen size={24} className="text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Spring Boot NETCONF & RESTCONF Tutorial
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Complete beginner-friendly guide • Zero Java knowledge required
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="shrink-0 p-2 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
              aria-label={isExpanded ? 'Collapse tutorial' : 'Expand tutorial'}
            >
              {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-white dark:bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary-500 to-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span className="text-sm font-semibold text-primary-700 dark:text-primary-300 whitespace-nowrap">
              {completedCount}/{steps.length} steps
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-xs px-3 py-1 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 font-medium">
              ☕ Java 17
            </span>
            <span className="text-xs px-3 py-1 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 font-medium">
              🍃 Spring Boot 3.2+
            </span>
            <span className="text-xs px-3 py-1 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 font-medium">
              📡 NETCONF over SSH
            </span>
            <span className="text-xs px-3 py-1 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 font-medium">
              🌐 RESTCONF over HTTP
            </span>
          </div>
        </div>
      </div>

      {/* Tutorial Steps */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-6 pt-0 space-y-3">
              {steps.map((step) => {
                const isCompleted = completedSteps[step.id];
                const isActive = activeStep === step.id;

                return (
                  <div
                    key={step.id}
                    className={`border-2 rounded-xl overflow-hidden transition-all ${
                      isActive
                        ? 'border-primary-400 dark:border-primary-600 shadow-lg'
                        : isCompleted
                        ? 'border-green-300 dark:border-green-700 bg-green-50/50 dark:bg-green-900/10'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                    }`}
                  >
                    {/* Step Header */}
                    <button
                      onClick={() => setActiveStep(isActive ? null : step.id)}
                      className="w-full flex items-start gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left"
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStep(step.id);
                        }}
                        className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          isCompleted
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-slate-300 dark:border-slate-600 hover:border-primary-400'
                        }`}
                      >
                        {isCompleted && <Check size={14} />}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-primary-600 dark:text-primary-400">
                            Step {step.id}
                          </span>
                          {isCompleted && (
                            <span className="text-xs text-green-600 dark:text-green-400 font-semibold">
                              ✓ Completed
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                          {step.title}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          {step.description}
                        </p>
                      </div>

                      <motion.div
                        animate={{ rotate: isActive ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="shrink-0 text-slate-400"
                      >
                        <ChevronDown size={20} />
                      </motion.div>
                    </button>

                    {/* Step Content */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 pt-0 border-t border-slate-200 dark:border-slate-700">
                            <div className="mt-4">{step.content}</div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}

              {/* Completion Message */}
              {completedCount === steps.length && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="mt-6 p-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-white text-center"
                >
                  <div className="text-4xl mb-2">🎉</div>
                  <h4 className="text-xl font-bold mb-2">Congratulations!</h4>
                  <p className="text-sm opacity-90">
                    You've completed the Spring Boot NETCONF & RESTCONF tutorial!
                    You're now ready to explore the lab experiments below.
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
