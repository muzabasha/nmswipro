import { useState } from 'react';
import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, ChevronRight, Check, BookOpen, Code, Terminal, 
  Download, Play, Settings, FileCode, Folder, CheckCircle2,
  AlertCircle, Package, Server, Network, Layers, Plus, X
} from 'lucide-react';

interface TutorialStep {
  id: number;
  title: string;
  description: string;
  content: ReactNode;
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
      title: 'SNMP Operations via NETCONF & RESTCONF',
      description: 'Implement SNMP-like operations using modern protocols with YANG data models',
      content: (
        <div className="space-y-4">
          <div className="bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 rounded-lg p-4">
            <p className="text-sm text-cyan-900 dark:text-cyan-200 mb-3">
              Learn how traditional SNMP operations (GET, SET, WALK, TRAP) are implemented using NETCONF and RESTCONF with YANG data models. This demonstrates the evolution from SNMP MIB to YANG-based management.
            </p>
          </div>

          <div className="space-y-4">
            {/* SNMP to NETCONF/RESTCONF Mapping */}
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
              <h5 className="font-bold text-sm mb-3 flex items-center gap-2">
                <Network size={16} className="text-primary-500" />
                SNMP Operations Mapping
              </h5>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-slate-200 dark:bg-slate-700">
                    <tr>
                      <th className="text-left p-2 border border-slate-300 dark:border-slate-600">SNMP Operation</th>
                      <th className="text-left p-2 border border-slate-300 dark:border-slate-600">NETCONF Equivalent</th>
                      <th className="text-left p-2 border border-slate-300 dark:border-slate-600">RESTCONF Equivalent</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-700 dark:text-slate-300">
                    <tr>
                      <td className="p-2 border border-slate-300 dark:border-slate-600 font-mono">GET</td>
                      <td className="p-2 border border-slate-300 dark:border-slate-600">&lt;get&gt; or &lt;get-config&gt;</td>
                      <td className="p-2 border border-slate-300 dark:border-slate-600">HTTP GET</td>
                    </tr>
                    <tr className="bg-slate-100 dark:bg-slate-900/50">
                      <td className="p-2 border border-slate-300 dark:border-slate-600 font-mono">SET</td>
                      <td className="p-2 border border-slate-300 dark:border-slate-600">&lt;edit-config&gt;</td>
                      <td className="p-2 border border-slate-300 dark:border-slate-600">HTTP PUT/PATCH</td>
                    </tr>
                    <tr>
                      <td className="p-2 border border-slate-300 dark:border-slate-600 font-mono">GETNEXT/WALK</td>
                      <td className="p-2 border border-slate-300 dark:border-slate-600">&lt;get&gt; with subtree filter</td>
                      <td className="p-2 border border-slate-300 dark:border-slate-600">HTTP GET with depth param</td>
                    </tr>
                    <tr className="bg-slate-100 dark:bg-slate-900/50">
                      <td className="p-2 border border-slate-300 dark:border-slate-600 font-mono">TRAP</td>
                      <td className="p-2 border border-slate-300 dark:border-slate-600">&lt;notification&gt;</td>
                      <td className="p-2 border border-slate-300 dark:border-slate-600">SSE/WebSocket stream</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Enhanced NetconfClient with SNMP operations */}
            <div>
              <h5 className="font-bold text-sm mb-2 flex items-center gap-2">
                <Code size={16} className="text-primary-500" />
                Step 9.1: Enhanced NetconfClient with SNMP-like Operations
              </h5>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                Add these methods to your NetconfClient.java file:
              </p>
              <pre className="bg-slate-900 text-green-400 p-3 rounded-lg text-xs overflow-x-auto">
                <code>{`/**
 * SNMP GET equivalent: Retrieve specific YANG leaf
 * Maps to: SNMP GET on OID 1.3.6.1.2.1.1.5.0 (sysName)
 */
public void getSystemName(String host, int port, String username, String password) {
    System.out.println("📡 NETCONF: Getting system name (SNMP GET equivalent)");
    
    SshClient client = SshClient.setUpDefaultClient();
    client.start();
    
    try {
        // Establish connection (reuse connection logic from connect method)
        ClientSession session = client.connect(username, host, port)
                .verify(10000).getSession();
        session.addPasswordIdentity(password);
        session.auth().verify(10000);
        
        ClientChannel channel = session.createSubsystemChannel("netconf");
        channel.open().verify(5000);
        
        // Send hello first (required by NETCONF)
        OutputStream out = channel.getInvertedIn();
        out.write(HELLO_MESSAGE.getBytes(StandardCharsets.UTF_8));
        out.flush();
        
        // Wait for server hello (skip reading for brevity - handle in production)
        Thread.sleep(1000);
        
        // NETCONF <get> RPC with filter for system/hostname
        // YANG model: ietf-system (RFC 7317)
        String getRpc = 
            "<rpc message-id=\\"101\\" xmlns=\\"urn:ietf:params:xml:ns:netconf:base:1.0\\">\\n" +
            "  <get>\\n" +
            "    <filter type=\\"subtree\\">\\n" +
            "      <system xmlns=\\"urn:ietf:params:xml:ns:yang:ietf-system\\">\\n" +
            "        <hostname/>\\n" +
            "      </system>\\n" +
            "    </filter>\\n" +
            "  </get>\\n" +
            "</rpc>\\n]]>]]>";
        
        out.write(getRpc.getBytes(StandardCharsets.UTF_8));
        out.flush();
        System.out.println("📤 Sent: <get> RPC for system hostname");
        
        // Read response
        InputStream in = channel.getInvertedOut();
        BufferedReader reader = new BufferedReader(
            new InputStreamReader(in, StandardCharsets.UTF_8)
        );
        
        StringBuilder response = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            response.append(line).append("\\n");
            if (line.contains("]]>]]>")) break;
        }
        
        System.out.println("📥 Response:");
        System.out.println(response.toString());
        System.out.println("✅ YANG data model: ietf-system (replaces SNMP MIB-II sysName)");
        
        channel.close();
        session.close();
        client.stop();
        
    } catch (Exception e) {
        System.err.println("❌ Error: " + e.getMessage());
    }
}

/**
 * SNMP SET equivalent: Update configuration via YANG
 * Maps to: SNMP SET on interface admin status
 */
public void setInterfaceStatus(String host, int port, String username, String password,
                                String interfaceName, boolean enabled) {
    System.out.println("📡 NETCONF: Setting interface status (SNMP SET equivalent)");
    
    SshClient client = SshClient.setUpDefaultClient();
    client.start();
    
    try {
        ClientSession session = client.connect(username, host, port)
                .verify(10000).getSession();
        session.addPasswordIdentity(password);
        session.auth().verify(10000);
        
        ClientChannel channel = session.createSubsystemChannel("netconf");
        channel.open().verify(5000);
        
        OutputStream out = channel.getInvertedOut();
        out.write(HELLO_MESSAGE.getBytes(StandardCharsets.UTF_8));
        out.flush();
        Thread.sleep(1000);
        
        // NETCONF <edit-config> with candidate datastore
        // YANG model: ietf-interfaces (RFC 8343)
        String editRpc = String.format(
            "<rpc message-id=\\"102\\" xmlns=\\"urn:ietf:params:xml:ns:netconf:base:1.0\\">\\n" +
            "  <edit-config>\\n" +
            "    <target><candidate/></target>\\n" +
            "    <config>\\n" +
            "      <interfaces xmlns=\\"urn:ietf:params:xml:ns:yang:ietf-interfaces\\">\\n" +
            "        <interface>\\n" +
            "          <name>%s</name>\\n" +
            "          <enabled>%s</enabled>\\n" +
            "        </interface>\\n" +
            "      </interfaces>\\n" +
            "    </config>\\n" +
            "  </edit-config>\\n" +
            "</rpc>\\n]]>]]>",
            interfaceName, enabled
        );
        
        out.write(editRpc.getBytes(StandardCharsets.UTF_8));
        out.flush();
        System.out.println("📤 Sent: <edit-config> to set " + interfaceName + " enabled=" + enabled);
        
        // Read response
        InputStream in = channel.getInvertedIn();
        BufferedReader reader = new BufferedReader(
            new InputStreamReader(in, StandardCharsets.UTF_8)
        );
        
        StringBuilder response = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            response.append(line).append("\\n");
            if (line.contains("]]>]]>")) break;
        }
        
        System.out.println("📥 Response: " + response.toString());
        
        // Commit the change (NETCONF transaction model)
        String commitRpc = 
            "<rpc message-id=\\"103\\" xmlns=\\"urn:ietf:params:xml:ns:netconf:base:1.0\\">\\n" +
            "  <commit/>\\n" +
            "</rpc>\\n]]>]]>";
        
        out.write(commitRpc.getBytes(StandardCharsets.UTF_8));
        out.flush();
        System.out.println("📤 Sent: <commit> RPC");
        System.out.println("✅ YANG transaction model ensures atomic config change");
        
        channel.close();
        session.close();
        client.stop();
        
    } catch (Exception e) {
        System.err.println("❌ Error: " + e.getMessage());
    }
}

/**
 * SNMP WALK equivalent: Retrieve entire subtree
 * Maps to: SNMP WALK on interfaces table
 */
public void walkInterfaces(String host, int port, String username, String password) {
    System.out.println("📡 NETCONF: Walking all interfaces (SNMP WALK equivalent)");
    
    SshClient client = SshClient.setUpDefaultClient();
    client.start();
    
    try {
        ClientSession session = client.connect(username, host, port)
                .verify(10000).getSession();
        session.addPasswordIdentity(password);
        session.auth().verify(10000);
        
        ClientChannel channel = session.createSubsystemChannel("netconf");
        channel.open().verify(5000);
        
        OutputStream out = channel.getInvertedIn();
        out.write(HELLO_MESSAGE.getBytes(StandardCharsets.UTF_8));
        out.flush();
        Thread.sleep(1000);
        
        // Get entire interfaces subtree (like SNMP WALK)
        String getRpc = 
            "<rpc message-id=\\"104\\" xmlns=\\"urn:ietf:params:xml:ns:netconf:base:1.0\\">\\n" +
            "  <get>\\n" +
            "    <filter type=\\"subtree\\">\\n" +
            "      <interfaces xmlns=\\"urn:ietf:params:xml:ns:yang:ietf-interfaces\\"/>\\n" +
            "    </filter>\\n" +
            "  </get>\\n" +
            "</rpc>\\n]]>]]>";
        
        out.write(getRpc.getBytes(StandardCharsets.UTF_8));
        out.flush();
        System.out.println("📤 Sent: <get> with subtree filter for all interfaces");
        
        InputStream in = channel.getInvertedOut();
        BufferedReader reader = new BufferedReader(
            new InputStreamReader(in, StandardCharsets.UTF_8)
        );
        
        StringBuilder response = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            response.append(line).append("\\n");
            if (line.contains("]]>]]>")) break;
        }
        
        System.out.println("📥 Received all interfaces in YANG-XML format:");
        System.out.println(response.toString());
        System.out.println("✅ Single request retrieves entire tree (more efficient than SNMP WALK)");
        
        channel.close();
        session.close();
        client.stop();
        
    } catch (Exception e) {
        System.err.println("❌ Error: " + e.getMessage());
    }
}

/**
 * SNMP TRAP equivalent: Subscribe to NETCONF notifications
 * Maps to: SNMP TRAP for link up/down events
 */
public void subscribeToNotifications(String host, int port, String username, String password) {
    System.out.println("📡 NETCONF: Subscribing to notifications (SNMP TRAP equivalent)");
    
    SshClient client = SshClient.setUpDefaultClient();
    client.start();
    
    try {
        ClientSession session = client.connect(username, host, port)
                .verify(10000).getSession();
        session.addPasswordIdentity(password);
        session.auth().verify(10000);
        
        ClientChannel channel = session.createSubsystemChannel("netconf");
        channel.open().verify(5000);
        
        OutputStream out = channel.getInvertedOut();
        out.write(HELLO_MESSAGE.getBytes(StandardCharsets.UTF_8));
        out.flush();
        Thread.sleep(1000);
        
        // Create notification subscription (RFC 5277)
        String subscribeRpc = 
            "<rpc message-id=\\"105\\" xmlns=\\"urn:ietf:params:xml:ns:netconf:base:1.0\\">\\n" +
            "  <create-subscription xmlns=\\"urn:ietf:params:xml:ns:netconf:notification:1.0\\">\\n" +
            "    <stream>NETCONF</stream>\\n" +
            "  </create-subscription>\\n" +
            "</rpc>\\n]]>]]>";
        
        out.write(subscribeRpc.getBytes(StandardCharsets.UTF_8));
        out.flush();
        System.out.println("📤 Sent: <create-subscription> RPC");
        System.out.println("⏳ Listening for notifications (like SNMP TRAP receiver)...");
        
        // Listen for notifications
        InputStream in = channel.getInvertedIn();
        BufferedReader reader = new BufferedReader(
            new InputStreamReader(in, StandardCharsets.UTF_8)
        );
        
        String line;
        int notificationCount = 0;
        long startTime = System.currentTimeMillis();
        
        // Listen for 30 seconds or 5 notifications
        while ((line = reader.readLine()) != null && notificationCount < 5) {
            if (line.contains("<notification")) {
                System.out.println("🔔 Received notification:");
                StringBuilder notification = new StringBuilder(line + "\\n");
                while ((line = reader.readLine()) != null) {
                    notification.append(line).append("\\n");
                    if (line.contains("</notification>")) break;
                }
                System.out.println(notification.toString());
                notificationCount++;
            }
            
            // Timeout after 30 seconds
            if (System.currentTimeMillis() - startTime > 30000) {
                System.out.println("⏱️ Timeout: No notifications received in 30 seconds");
                break;
            }
        }
        
        System.out.println("✅ YANG notifications are structured (unlike SNMP TRAP OIDs)");
        
        channel.close();
        session.close();
        client.stop();
        
    } catch (Exception e) {
        System.err.println("❌ Error: " + e.getMessage());
    }
}`}</code>
              </pre>
            </div>

            {/* Enhanced RestconfClient */}
            <div className="mt-4">
              <h5 className="font-bold text-sm mb-2 flex items-center gap-2">
                <Server size={16} className="text-primary-500" />
                Step 9.2: Enhanced RestconfClient with SNMP-like Operations
              </h5>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                Add these methods to your RestconfClient.java file:
              </p>
              <pre className="bg-slate-900 text-green-400 p-3 rounded-lg text-xs overflow-x-auto">
                <code>{`/**
 * SNMP GET via RESTCONF: Retrieve specific YANG node
 */
public void getSystemInfo(String baseUrl, String username, String password) {
    System.out.println("🌐 RESTCONF: Getting system info (SNMP GET equivalent)");
    
    try {
        // RESTCONF path: /restconf/data/{module}:{container}/{leaf}
        String url = baseUrl + "/restconf/data/ietf-system:system";
        
        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", "application/yang-data+json");
        String auth = username + ":" + password;
        headers.set("Authorization", "Basic " + 
            Base64.getEncoder().encodeToString(auth.getBytes())
        );
        
        HttpEntity<String> entity = new HttpEntity<>(headers);
        
        ResponseEntity<String> response = restTemplate.exchange(
            url, HttpMethod.GET, entity, String.class
        );
        
        System.out.println("✅ Status: " + response.getStatusCode());
        System.out.println("📥 YANG-JSON response:");
        System.out.println(response.getBody());
        
        // Example response structure:
        // {
        //   "ietf-system:system": {
        //     "hostname": "router01",
        //     "contact": "admin@example.com",
        //     "location": "DataCenter-1"
        //   }
        // }
        
    } catch (Exception e) {
        System.err.println("❌ Error: " + e.getMessage());
    }
}

/**
 * SNMP SET via RESTCONF: Update configuration
 */
public void updateInterface(String baseUrl, String username, String password,
                            String interfaceName, boolean enabled, String description) {
    System.out.println("🌐 RESTCONF: Updating interface (SNMP SET equivalent)");
    
    try {
        // RESTCONF path includes list key
        String url = baseUrl + "/restconf/data/ietf-interfaces:interfaces/interface=" + interfaceName;
        
        // YANG-JSON payload
        String jsonPayload = String.format(
            "{" +
            "  \\"ietf-interfaces:interface\\": {" +
            "    \\"name\\": \\"%s\\"," +
            "    \\"description\\": \\"%s\\"," +
            "    \\"type\\": \\"iana-if-type:ethernetCsmacd\\"," +
            "    \\"enabled\\": %s" +
            "  }" +
            "}",
            interfaceName, description, enabled
        );
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.valueOf("application/yang-data+json"));
        headers.set("Accept", "application/yang-data+json");
        String auth = username + ":" + password;
        headers.set("Authorization", "Basic " + 
            Base64.getEncoder().encodeToString(auth.getBytes())
        );
        
        HttpEntity<String> entity = new HttpEntity<>(jsonPayload, headers);
        
        // PUT replaces entire resource, PATCH modifies specific fields
        ResponseEntity<String> response = restTemplate.exchange(
            url, HttpMethod.PUT, entity, String.class
        );
        
        System.out.println("✅ Interface updated! Status: " + response.getStatusCode());
        System.out.println("💡 RESTCONF uses HTTP PUT/PATCH (simpler than SNMP SET)");
        
    } catch (Exception e) {
        System.err.println("❌ Error: " + e.getMessage());
    }
}

/**
 * SNMP WALK via RESTCONF: Retrieve entire collection
 */
public void getAllInterfaces(String baseUrl, String username, String password) {
    System.out.println("🌐 RESTCONF: Getting all interfaces (SNMP WALK equivalent)");
    
    try {
        // Get entire interfaces collection
        String url = baseUrl + "/restconf/data/ietf-interfaces:interfaces?depth=unbounded";
        
        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", "application/yang-data+json");
        String auth = username + ":" + password;
        headers.set("Authorization", "Basic " + 
            Base64.getEncoder().encodeToString(auth.getBytes())
        );
        
        HttpEntity<String> entity = new HttpEntity<>(headers);
        
        ResponseEntity<String> response = restTemplate.exchange(
            url, HttpMethod.GET, entity, String.class
        );
        
        System.out.println("✅ Status: " + response.getStatusCode());
        System.out.println("📥 All interfaces (YANG-JSON):");
        System.out.println(response.getBody());
        
        // Response includes array of all interfaces with full YANG structure
        // Much more efficient than SNMP GETNEXT loop!
        
    } catch (Exception e) {
        System.err.println("❌ Error: " + e.getMessage());
    }
}

/**
 * SNMP TRAP via RESTCONF: Stream notifications using SSE
 * Note: Requires Server-Sent Events support in device
 */
public void subscribeToEvents(String baseUrl, String username, String password) {
    System.out.println("🌐 RESTCONF: Subscribing to event stream (SNMP TRAP equivalent)");
    System.out.println("💡 Note: This requires Server-Sent Events (SSE) support");
    
    try {
        // RESTCONF notification stream path (RFC 8040 §6.3)
        String url = baseUrl + "/restconf/streams/NETCONF";
        
        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", "text/event-stream");
        String auth = username + ":" + password;
        headers.set("Authorization", "Basic " + 
            Base64.getEncoder().encodeToString(auth.getBytes())
        );
        
        System.out.println("📡 Opening SSE stream...");
        System.out.println("⏳ Listening for events (link-up, link-down, config-change, etc.)");
        
        // In production, use WebClient or SSE library
        // Example SSE event format:
        // event: notification
        // data: {
        //   "ietf-restconf:notification": {
        //     "eventTime": "2024-01-15T10:30:00Z",
        //     "ietf-interfaces:interface-state-change": {
        //       "name": "GigabitEthernet0/0",
        //       "admin-status": "down",
        //       "oper-status": "down"
        //     }
        //   }
        // }
        
        System.out.println("✅ SSE stream provides real-time push notifications");
        System.out.println("💡 More reliable than SNMP TRAPs (uses TCP, not UDP)");
        
    } catch (Exception e) {
        System.err.println("❌ Error: " + e.getMessage());
    }
}`}</code>
              </pre>
            </div>

            {/* YANG Data Model Explanation */}
            <div className="mt-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
              <h5 className="font-bold text-sm mb-3 flex items-center gap-2 text-purple-900 dark:text-purple-200">
                <Layers size={16} />
                YANG Data Models vs SNMP MIB
              </h5>
              <div className="space-y-2 text-xs text-purple-900 dark:text-purple-200">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/50 dark:bg-slate-800/50 p-3 rounded">
                    <strong className="block mb-1">SNMP MIB-II</strong>
                    <ul className="list-disc ml-4 space-y-1 text-[10px]">
                      <li>OID: 1.3.6.1.2.1.1.5.0</li>
                      <li>ASN.1 syntax</li>
                      <li>Scalar/tabular only</li>
                      <li>Limited data types</li>
                      <li>No validation rules</li>
                    </ul>
                  </div>
                  <div className="bg-white/50 dark:bg-slate-800/50 p-3 rounded">
                    <strong className="block mb-1">YANG Model</strong>
                    <ul className="list-disc ml-4 space-y-1 text-[10px]">
                      <li>Path: /ietf-system:system/hostname</li>
                      <li>Human-readable</li>
                      <li>Hierarchical containers</li>
                      <li>Rich data types</li>
                      <li>Built-in validation (must, when)</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-white/50 dark:bg-slate-800/50 p-3 rounded mt-2">
                  <strong className="block mb-1">Standard YANG Models for Management:</strong>
                  <ul className="list-disc ml-4 space-y-1 text-[10px]">
                    <li><strong>ietf-interfaces</strong> (RFC 8343): replaces IF-MIB</li>
                    <li><strong>ietf-system</strong> (RFC 7317): replaces SNMPv2-MIB system group</li>
                    <li><strong>ietf-ip</strong> (RFC 8344): replaces IP-MIB</li>
                    <li><strong>ietf-routing</strong> (RFC 8349): routing protocols</li>
                    <li><strong>openconfig-*</strong>: vendor-neutral operational models</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Testing Instructions */}
            <div className="flex items-start gap-2 text-xs text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
              <div>
                <strong>To test these operations:</strong>
                <ol className="mt-1 space-y-1 list-decimal ml-4">
                  <li>Use a NETCONF/RESTCONF capable device (Cisco IOS-XE, Junos, etc.)</li>
                  <li>Enable NETCONF: <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">netconf-yang</code></li>
                  <li>Enable RESTCONF: <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">restconf</code></li>
                  <li>Load standard YANG models (ietf-interfaces, ietf-system)</li>
                  <li>Call these methods from DemoRunner.java</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 10,
      title: 'Test RESTCONF with Postman',
      description: 'Use Postman to manually test RESTCONF API calls',
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
            <p className="text-sm text-orange-900 dark:text-orange-200 mb-3">
              Postman is a popular API testing tool that makes it easy to test RESTCONF without writing code. This is perfect for learning and debugging!
            </p>
          </div>

          <div className="space-y-4">
            {/* Install Postman */}
            <div>
              <h5 className="font-bold text-sm mb-2 flex items-center gap-2">
                <Download size={16} className="text-primary-500" />
                Step 10.1: Install Postman
              </h5>
              <ol className="text-sm space-y-2 ml-6 list-decimal">
                <li>Visit: <a href="https://www.postman.com/downloads/" target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 underline">postman.com/downloads</a></li>
                <li>Download and install Postman for Windows</li>
                <li>Create a free account or skip sign-in</li>
                <li>Click "Create New" → "HTTP Request"</li>
              </ol>
            </div>

            {/* RESTCONF URL Structure */}
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
              <h5 className="font-bold text-sm mb-3">RESTCONF URL Structure (RFC 8040)</h5>
              <div className="space-y-2 text-xs font-mono">
                <div className="bg-white dark:bg-slate-900 p-2 rounded border border-slate-300 dark:border-slate-600">
                  <span className="text-blue-600 dark:text-blue-400">https://</span>
                  <span className="text-green-600 dark:text-green-400">device-ip</span>
                  <span className="text-purple-600 dark:text-purple-400">:443</span>
                  <span className="text-orange-600 dark:text-orange-400">/restconf/data/</span>
                  <span className="text-pink-600 dark:text-pink-400">module:container</span>
                  <span className="text-cyan-600 dark:text-cyan-400">/path</span>
                </div>
                <div className="text-[10px] text-slate-600 dark:text-slate-400 space-y-1">
                  <div>• <strong>device-ip</strong>: Your router/device IP (e.g., 192.168.1.1 or sandbox-iosxe.cisco.com)</div>
                  <div>• <strong>:443</strong>: HTTPS port (some devices use :9443)</div>
                  <div>• <strong>/restconf/data/</strong>: Fixed path for configuration/operational data</div>
                  <div>• <strong>module:container</strong>: YANG module and top-level container</div>
                  <div>• <strong>/path</strong>: Optional path to specific resource</div>
                </div>
              </div>
            </div>

            {/* Example 1: GET System Info */}
            <div className="border-2 border-green-200 dark:border-green-800 rounded-lg p-4">
              <h5 className="font-bold text-sm mb-3 flex items-center gap-2 text-green-700 dark:text-green-300">
                <CheckCircle2 size={16} />
                Example 1: GET - Retrieve System Information
              </h5>
              
              <div className="space-y-3">
                <div>
                  <strong className="text-xs block mb-1">Request Configuration:</strong>
                  <div className="bg-slate-900 text-green-400 p-3 rounded-lg text-xs space-y-2">
                    <div>
                      <span className="text-amber-400">Method:</span> <span className="bg-green-700 px-2 py-0.5 rounded text-white">GET</span>
                    </div>
                    <div>
                      <span className="text-amber-400">URL:</span><br />
                      <code>https://sandbox-iosxe-latest-1.cisco.com/restconf/data/ietf-system:system</code>
                    </div>
                  </div>
                </div>

                <div>
                  <strong className="text-xs block mb-1">Headers Tab:</strong>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs bg-slate-900 text-green-400 rounded-lg">
                      <thead>
                        <tr className="border-b border-slate-700">
                          <th className="text-left p-2 text-amber-400">KEY</th>
                          <th className="text-left p-2 text-amber-400">VALUE</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-slate-800">
                          <td className="p-2 font-mono">Accept</td>
                          <td className="p-2 font-mono">application/yang-data+json</td>
                        </tr>
                        <tr className="border-b border-slate-800">
                          <td className="p-2 font-mono">Content-Type</td>
                          <td className="p-2 font-mono">application/yang-data+json</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <strong className="text-xs block mb-1">Authorization Tab:</strong>
                  <ul className="text-xs space-y-1 ml-4 list-disc">
                    <li>Type: <strong>Basic Auth</strong></li>
                    <li>Username: <code className="bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded">developer</code></li>
                    <li>Password: <code className="bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded">C1sco12345</code></li>
                  </ul>
                </div>

                <div>
                  <strong className="text-xs block mb-1">Expected Response (200 OK):</strong>
                  <pre className="bg-slate-900 text-green-400 p-3 rounded-lg text-[10px] overflow-x-auto">
                    <code>{`{
  "ietf-system:system": {
    "hostname": "csr1000v",
    "clock": {
      "timezone-name": "UTC",
      "timezone-utc-offset": 0
    },
    "contact": "admin@example.com",
    "location": "San Jose, CA"
  }
}`}</code>
                  </pre>
                </div>

                <div className="flex items-start gap-2 text-xs bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded p-2">
                  <CheckCircle2 size={14} className="shrink-0 mt-0.5 text-green-600 dark:text-green-400" />
                  <span className="text-green-800 dark:text-green-300">
                    <strong>Click "Send"</strong> in Postman. If you see JSON data, it worked! This is equivalent to SNMP GET on sysName/sysLocation.
                  </span>
                </div>
              </div>
            </div>

            {/* Example 2: GET All Interfaces */}
            <div className="border-2 border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h5 className="font-bold text-sm mb-3 flex items-center gap-2 text-blue-700 dark:text-blue-300">
                <Network size={16} />
                Example 2: GET - List All Interfaces
              </h5>
              
              <div className="space-y-3">
                <div>
                  <strong className="text-xs block mb-1">Request:</strong>
                  <div className="bg-slate-900 text-blue-400 p-3 rounded-lg text-xs space-y-2">
                    <div>
                      <span className="text-amber-400">Method:</span> <span className="bg-blue-700 px-2 py-0.5 rounded text-white">GET</span>
                    </div>
                    <div>
                      <span className="text-amber-400">URL:</span><br />
                      <code>https://sandbox-iosxe-latest-1.cisco.com/restconf/data/ietf-interfaces:interfaces</code>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      💡 This retrieves ALL interfaces - equivalent to SNMP WALK on IF-MIB
                    </div>
                  </div>
                </div>

                <div>
                  <strong className="text-xs block mb-1">Expected Response:</strong>
                  <pre className="bg-slate-900 text-blue-400 p-3 rounded-lg text-[10px] overflow-x-auto">
                    <code>{`{
  "ietf-interfaces:interfaces": {
    "interface": [
      {
        "name": "GigabitEthernet1",
        "type": "iana-if-type:ethernetCsmacd",
        "enabled": true,
        "ietf-ip:ipv4": {
          "address": [
            {
              "ip": "10.10.20.48",
              "netmask": "255.255.255.0"
            }
          ]
        },
        "ietf-ip:ipv6": {}
      },
      {
        "name": "GigabitEthernet2",
        "type": "iana-if-type:ethernetCsmacd",
        "enabled": false
      }
    ]
  }
}`}</code>
                  </pre>
                </div>
              </div>
            </div>

            {/* Example 3: GET Specific Interface */}
            <div className="border-2 border-purple-200 dark:border-purple-800 rounded-lg p-4">
              <h5 className="font-bold text-sm mb-3 flex items-center gap-2 text-purple-700 dark:text-purple-300">
                <Terminal size={16} />
                Example 3: GET - Specific Interface
              </h5>
              
              <div className="space-y-3">
                <div>
                  <strong className="text-xs block mb-1">Request:</strong>
                  <div className="bg-slate-900 text-purple-400 p-3 rounded-lg text-xs space-y-2">
                    <div>
                      <span className="text-amber-400">Method:</span> <span className="bg-purple-700 px-2 py-0.5 rounded text-white">GET</span>
                    </div>
                    <div>
                      <span className="text-amber-400">URL:</span><br />
                      <code>https://sandbox-iosxe-latest-1.cisco.com/restconf/data/ietf-interfaces:interfaces/interface=GigabitEthernet1</code>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      💡 Note: "=GigabitEthernet1" is the list key selector
                    </div>
                  </div>
                </div>

                <div>
                  <strong className="text-xs block mb-1">Expected Response:</strong>
                  <pre className="bg-slate-900 text-purple-400 p-3 rounded-lg text-[10px] overflow-x-auto">
                    <code>{`{
  "ietf-interfaces:interface": {
    "name": "GigabitEthernet1",
    "type": "iana-if-type:ethernetCsmacd",
    "enabled": true,
    "description": "Management Interface",
    "ietf-ip:ipv4": {
      "address": [
        {
          "ip": "10.10.20.48",
          "netmask": "255.255.255.0"
        }
      ]
    }
  }
}`}</code>
                  </pre>
                </div>
              </div>
            </div>

            {/* Example 4: PUT - Update Interface */}
            <div className="border-2 border-orange-200 dark:border-orange-800 rounded-lg p-4">
              <h5 className="font-bold text-sm mb-3 flex items-center gap-2 text-orange-700 dark:text-orange-300">
                <Settings size={16} />
                Example 4: PUT - Update Interface Description
              </h5>
              
              <div className="space-y-3">
                <div>
                  <strong className="text-xs block mb-1">Request:</strong>
                  <div className="bg-slate-900 text-orange-400 p-3 rounded-lg text-xs space-y-2">
                    <div>
                      <span className="text-amber-400">Method:</span> <span className="bg-orange-600 px-2 py-0.5 rounded text-white">PUT</span>
                    </div>
                    <div>
                      <span className="text-amber-400">URL:</span><br />
                      <code>https://sandbox-iosxe-latest-1.cisco.com/restconf/data/ietf-interfaces:interfaces/interface=GigabitEthernet2</code>
                    </div>
                  </div>
                </div>

                <div>
                  <strong className="text-xs block mb-1">Body Tab (select "raw" and "JSON"):</strong>
                  <pre className="bg-slate-900 text-orange-400 p-3 rounded-lg text-[10px] overflow-x-auto">
                    <code>{`{
  "ietf-interfaces:interface": {
    "name": "GigabitEthernet2",
    "type": "iana-if-type:ethernetCsmacd",
    "description": "Updated via RESTCONF Postman",
    "enabled": true
  }
}`}</code>
                  </pre>
                </div>

                <div className="flex items-start gap-2 text-xs bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded p-2">
                  <AlertCircle size={14} className="shrink-0 mt-0.5 text-orange-600 dark:text-orange-400" />
                  <span className="text-orange-800 dark:text-orange-300">
                    <strong>Warning:</strong> PUT replaces the entire resource. Use PATCH to modify only specific fields.
                  </span>
                </div>

                <div>
                  <strong className="text-xs block mb-1">Expected Response (204 No Content or 200 OK):</strong>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Success! No body returned, but the interface description is now updated. Verify with a GET request.
                  </p>
                </div>
              </div>
            </div>

            {/* Example 5: PATCH - Partial Update */}
            <div className="border-2 border-teal-200 dark:border-teal-800 rounded-lg p-4">
              <h5 className="font-bold text-sm mb-3 flex items-center gap-2 text-teal-700 dark:text-teal-300">
                <Code size={16} />
                Example 5: PATCH - Enable/Disable Interface
              </h5>
              
              <div className="space-y-3">
                <div>
                  <strong className="text-xs block mb-1">Request:</strong>
                  <div className="bg-slate-900 text-teal-400 p-3 rounded-lg text-xs space-y-2">
                    <div>
                      <span className="text-amber-400">Method:</span> <span className="bg-teal-600 px-2 py-0.5 rounded text-white">PATCH</span>
                    </div>
                    <div>
                      <span className="text-amber-400">URL:</span><br />
                      <code>https://sandbox-iosxe-latest-1.cisco.com/restconf/data/ietf-interfaces:interfaces/interface=GigabitEthernet2</code>
                    </div>
                  </div>
                </div>

                <div>
                  <strong className="text-xs block mb-1">Body (only the field to change):</strong>
                  <pre className="bg-slate-900 text-teal-400 p-3 rounded-lg text-[10px] overflow-x-auto">
                    <code>{`{
  "ietf-interfaces:interface": {
    "name": "GigabitEthernet2",
    "enabled": false
  }
}`}</code>
                  </pre>
                </div>

                <div className="flex items-start gap-2 text-xs bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded p-2">
                  <CheckCircle2 size={14} className="shrink-0 mt-0.5 text-teal-600 dark:text-teal-400" />
                  <span className="text-teal-800 dark:text-teal-300">
                    <strong>PATCH vs PUT:</strong> PATCH only updates the "enabled" field, leaving description and other fields unchanged. This is equivalent to SNMP SET on ifAdminStatus.
                  </span>
                </div>
              </div>
            </div>

            {/* Example 6: POST - Create New Loopback Interface */}
            <div className="border-2 border-pink-200 dark:border-pink-800 rounded-lg p-4">
              <h5 className="font-bold text-sm mb-3 flex items-center gap-2 text-pink-700 dark:text-pink-300">
                <Plus size={16} />
                Example 6: POST - Create New Interface
              </h5>
              
              <div className="space-y-3">
                <div>
                  <strong className="text-xs block mb-1">Request:</strong>
                  <div className="bg-slate-900 text-pink-400 p-3 rounded-lg text-xs space-y-2">
                    <div>
                      <span className="text-amber-400">Method:</span> <span className="bg-pink-600 px-2 py-0.5 rounded text-white">POST</span>
                    </div>
                    <div>
                      <span className="text-amber-400">URL:</span><br />
                      <code>https://sandbox-iosxe-latest-1.cisco.com/restconf/data/ietf-interfaces:interfaces</code>
                    </div>
                  </div>
                </div>

                <div>
                  <strong className="text-xs block mb-1">Body:</strong>
                  <pre className="bg-slate-900 text-pink-400 p-3 rounded-lg text-[10px] overflow-x-auto">
                    <code>{`{
  "ietf-interfaces:interface": {
    "name": "Loopback100",
    "type": "iana-if-type:softwareLoopback",
    "description": "Created via RESTCONF POST",
    "enabled": true,
    "ietf-ip:ipv4": {
      "address": [
        {
          "ip": "172.16.100.1",
          "netmask": "255.255.255.0"
        }
      ]
    }
  }
}`}</code>
                  </pre>
                </div>

                <div>
                  <strong className="text-xs block mb-1">Expected Response (201 Created):</strong>
                  <pre className="bg-slate-900 text-pink-400 p-3 rounded-lg text-[10px]">
                    <code>Location: /restconf/data/ietf-interfaces:interfaces/interface=Loopback100</code>
                  </pre>
                </div>
              </div>
            </div>

            {/* Example 7: DELETE - Remove Interface */}
            <div className="border-2 border-red-200 dark:border-red-800 rounded-lg p-4">
              <h5 className="font-bold text-sm mb-3 flex items-center gap-2 text-red-700 dark:text-red-300">
                <X size={16} />
                Example 7: DELETE - Remove Interface
              </h5>
              
              <div className="space-y-3">
                <div>
                  <strong className="text-xs block mb-1">Request:</strong>
                  <div className="bg-slate-900 text-red-400 p-3 rounded-lg text-xs space-y-2">
                    <div>
                      <span className="text-amber-400">Method:</span> <span className="bg-red-600 px-2 py-0.5 rounded text-white">DELETE</span>
                    </div>
                    <div>
                      <span className="text-amber-400">URL:</span><br />
                      <code>https://sandbox-iosxe-latest-1.cisco.com/restconf/data/ietf-interfaces:interfaces/interface=Loopback100</code>
                    </div>
                  </div>
                </div>

                <div>
                  <strong className="text-xs block mb-1">Expected Response (204 No Content):</strong>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Interface deleted successfully. No response body returned.
                  </p>
                </div>

                <div className="flex items-start gap-2 text-xs bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-2">
                  <AlertCircle size={14} className="shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
                  <span className="text-red-800 dark:text-red-300">
                    <strong>Caution:</strong> DELETE operations cannot be undone! Always test on lab devices first.
                  </span>
                </div>
              </div>
            </div>

            {/* Save as Postman Collection */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4">
              <h5 className="font-bold text-sm mb-3 flex items-center gap-2 text-indigo-900 dark:text-indigo-200">
                <Folder size={16} />
                Save as Postman Collection
              </h5>
              <ol className="text-xs space-y-2 ml-4 list-decimal text-indigo-900 dark:text-indigo-200">
                <li>In Postman, click "Save" button for each request</li>
                <li>Create a new collection: "RESTCONF Network Management"</li>
                <li>Save all 7 examples in this collection</li>
                <li>Click "..." next to collection name → "Export"</li>
                <li>Choose "Collection v2.1"</li>
                <li>Save the JSON file for sharing with classmates!</li>
              </ol>
            </div>

            {/* Testing with Cisco DevNet Sandbox */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h5 className="font-bold text-sm mb-3 flex items-center gap-2">
                <Network size={16} className="text-blue-600 dark:text-blue-400" />
                Free Testing Environment: Cisco DevNet Sandbox
              </h5>
              <div className="space-y-2 text-xs">
                <p className="text-blue-900 dark:text-blue-200">
                  You can test these examples for FREE using Cisco DevNet Sandbox:
                </p>
                <ol className="list-decimal ml-6 space-y-1 text-blue-800 dark:text-blue-300">
                  <li>Visit: <a href="https://devnetsandbox.cisco.com/" target="_blank" rel="noopener noreferrer" className="underline">devnetsandbox.cisco.com</a></li>
                  <li>Create free account (no credit card required)</li>
                  <li>Search for "IOS XE on Cat 8000V" or "IOS XE on CSR"</li>
                  <li>Click "Reserve" → Wait 5-10 minutes for device to start</li>
                  <li>Get VPN credentials and connect (or use Always-On sandboxes)</li>
                  <li>Use device IP, username, and password in Postman</li>
                </ol>
                <div className="mt-3 bg-white/50 dark:bg-slate-800/50 p-3 rounded">
                  <strong className="block mb-1">Always-On Sandbox (no reservation needed):</strong>
                  <div className="font-mono text-[10px] space-y-1">
                    <div><strong>Host:</strong> sandbox-iosxe-latest-1.cisco.com</div>
                    <div><strong>Port:</strong> 443</div>
                    <div><strong>Username:</strong> developer</div>
                    <div><strong>Password:</strong> C1sco12345</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Common Errors */}
            <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
              <h5 className="font-bold text-sm mb-3">Common Postman Errors & Solutions</h5>
              <div className="space-y-3">
                <div className="text-xs">
                  <strong className="text-red-600 dark:text-red-400">❌ Error 401 Unauthorized</strong>
                  <p className="text-slate-600 dark:text-slate-400 ml-4 mt-1">
                    → Check username/password in Authorization tab<br />
                    → Ensure "Type: Basic Auth" is selected
                  </p>
                </div>
                <div className="text-xs">
                  <strong className="text-red-600 dark:text-red-400">❌ Error 415 Unsupported Media Type</strong>
                  <p className="text-slate-600 dark:text-slate-400 ml-4 mt-1">
                    → Missing header: Content-Type: application/yang-data+json<br />
                    → Or Accept: application/yang-data+json
                  </p>
                </div>
                <div className="text-xs">
                  <strong className="text-red-600 dark:text-red-400">❌ SSL Certificate Error</strong>
                  <p className="text-slate-600 dark:text-slate-400 ml-4 mt-1">
                    → Go to Postman Settings → Disable "SSL certificate verification"<br />
                    → (For lab/testing only - enable in production!)
                  </p>
                </div>
                <div className="text-xs">
                  <strong className="text-red-600 dark:text-red-400">❌ Error 404 Not Found</strong>
                  <p className="text-slate-600 dark:text-slate-400 ml-4 mt-1">
                    → Check URL path (case-sensitive!)<br />
                    → Verify YANG module is loaded on device
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 11,
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
                    Spring Boot NETCONF & RESTCONF Tutorial with YANG Data Modelling
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Complete step-by-step guide • Spring Boot setup • Protocol demonstrations • YANG models • SNMP operations mapping
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
              🌐 RESTCONF over HTTPS
            </span>
            <span className="text-xs px-3 py-1 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 font-medium">
              📋 YANG Data Models
            </span>
            <span className="text-xs px-3 py-1 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 font-medium">
              🔄 SNMP Mapping
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
