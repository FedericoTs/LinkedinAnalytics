import neo4j, { Driver, Session } from "neo4j-driver";

let driver: Driver | null = null;

/**
 * Initialize the Neo4j driver with connection details
 */
export const initNeo4j = () => {
  try {
    const uri = import.meta.env.VITE_NEO4J_URI;
    const user = import.meta.env.VITE_NEO4J_USER;
    const password = import.meta.env.VITE_NEO4J_PASSWORD;

    if (!uri || !user || !password) {
      console.error(
        "Neo4j connection details missing. Please check environment variables.",
      );
      return null;
    }

    driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
    console.log("Neo4j driver initialized");
    return driver;
  } catch (error) {
    console.error("Failed to initialize Neo4j driver:", error);
    return null;
  }
};

/**
 * Get the Neo4j driver instance
 */
export const getDriver = () => {
  if (!driver) {
    return initNeo4j();
  }
  return driver;
};

/**
 * Close the Neo4j driver connection
 */
export const closeDriver = async () => {
  if (driver) {
    await driver.close();
    driver = null;
    console.log("Neo4j driver closed");
  }
};

/**
 * Execute a Cypher query and return the results
 */
export const runQuery = async (cypher: string, params = {}) => {
  const driver = getDriver();
  if (!driver) {
    throw new Error("Neo4j driver not initialized");
  }

  const session: Session = driver.session();
  try {
    const result = await session.run(cypher, params);
    return result.records.map((record) => {
      const obj: Record<string, any> = {};
      record.keys.forEach((key) => {
        obj[key] = record.get(key);
      });
      return obj;
    });
  } catch (error) {
    console.error("Error executing Neo4j query:", error);
    throw error;
  } finally {
    await session.close();
  }
};

/**
 * Get network data for visualization
 */
export const getNetworkData = async (userId: string) => {
  try {
    // Example query to get a user's network
    // This should be customized based on your data model
    const query = `
      MATCH (user:User {id: $userId})-[r:CONNECTED_TO]-(connection:User)
      OPTIONAL MATCH (connection)-[r2:CONNECTED_TO]-(secondDegree:User)
      WHERE secondDegree <> user
      RETURN user, connection, secondDegree, r, r2
      LIMIT 100
    `;

    const result = await runQuery(query, { userId });

    // Transform the result into a format suitable for visualization
    const nodes: any[] = [];
    const links: any[] = [];
    const nodeMap = new Map();

    // Process results and create nodes and links
    result.forEach((record) => {
      // Add logic to extract nodes and relationships
      // This is a simplified example
    });

    // For testing, return mock data if no results
    if (nodes.length === 0) {
      return getMockNetworkData();
    }

    return { nodes, links };
  } catch (error) {
    console.error("Error fetching network data:", error);
    return getMockNetworkData(); // Fallback to mock data
  }
};

/**
 * Get mock network data for testing
 */
export const getMockNetworkData = () => {
  // Create mock data for testing
  const nodes = [
    { id: "you", label: "You", group: "central", size: 25 },
    { id: "c1", label: "Sarah Johnson", group: "first", size: 15 },
    { id: "c2", label: "Michael Chen", group: "first", size: 15 },
    { id: "c3", label: "Aisha Patel", group: "first", size: 20 },
    { id: "c4", label: "David Kim", group: "first", size: 12 },
    { id: "c5", label: "Emma Wilson", group: "second", size: 10 },
    { id: "c6", label: "James Taylor", group: "second", size: 10 },
    { id: "c7", label: "Olivia Martinez", group: "second", size: 10 },
    { id: "c8", label: "Robert Johnson", group: "second", size: 10 },
    { id: "c9", label: "Sophia Lee", group: "third", size: 8 },
    { id: "c10", label: "William Brown", group: "third", size: 8 },
  ];

  const links = [
    { source: "you", target: "c1", value: 5 },
    { source: "you", target: "c2", value: 3 },
    { source: "you", target: "c3", value: 8 },
    { source: "you", target: "c4", value: 2 },
    { source: "c1", target: "c5", value: 2 },
    { source: "c1", target: "c6", value: 2 },
    { source: "c2", target: "c7", value: 2 },
    { source: "c3", target: "c8", value: 2 },
    { source: "c4", target: "c9", value: 2 },
    { source: "c4", target: "c10", value: 2 },
  ];

  return { nodes, links };
};
