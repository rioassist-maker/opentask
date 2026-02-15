/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("projects");
  
  // Add color field if it doesn't exist
  let hasColorField = false;
  
  // Handle both array and non-array fields (different PocketBase versions)
  const fields = Array.isArray(collection.schema.fields) 
    ? collection.schema.fields 
    : [];
  
  fields.forEach(f => {
    if (f.name === "color") hasColorField = true;
  });

  if (!hasColorField) {
    collection.schema.addField(new SchemaField({
      name: "color",
      type: "text",
      required: false,
      presentable: false,
      unique: false,
      options: {
        min: null,
        max: 7
      }
    }));
    
    dao.saveCollection(collection);
  }

  // Set default colors for existing projects
  const defaults = {
    opentask: "#3B82F6",
    hecate: "#A855F7",
    delegate: "#10B981",
    general: "#6B7280",
    ideas: "#F59E0B"
  };

  try {
    const projects = dao.findRecordsByExpr("projects");
    if (projects && Array.isArray(projects)) {
      projects.forEach(p => {
        const slug = p.get("slug");
        const currentColor = p.get("color");
        
        if (!currentColor) {
          const defaultColor = defaults[slug] || "#6B7280";
          p.set("color", defaultColor);
          dao.saveRecord(p);
        }
      });
    }
  } catch (e) {
    // No records yet or other error, continue
  }

  return null;
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("projects");
  
  // Handle both array and non-array fields
  const fields = Array.isArray(collection.schema.fields) 
    ? collection.schema.fields.filter(f => f.name !== "color")
    : [];
  
  collection.schema.fields = fields;
  
  return dao.saveCollection(collection);
});
