
export async function getAgentById(api, id) {
    try {
      const response = await api.get(`http://localhost:5000/agents/${id}`);
  
      const data = await response;
      if (!data.success) {
        throw new Error(data.message || "Impossible de charger l'agent");
      }
  
      return data.agent;
    } catch (error) {
      console.error("getAgentById error:", error);
      throw error;
    }
  }
  