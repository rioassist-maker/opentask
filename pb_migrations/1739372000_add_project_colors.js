/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("projects");
  
  // Add color field if it doesn't exist
  let hasColorField = false;
  for (let i = 0; i < collection.schema.fields.length; i++) {
    if (collection.schema.fields[i].name === "color") {
      hasColorField = true;
      break;
    }
  }

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
  }

  dao.saveCollection(collection);

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
    for (let i = 0; i < projects.length; i++) {
      const p = projects[i];
      const slug = p.get("slug");
      const currentColor = p.get("color");
      
      if (!currentColor) {
        const defaultColor = defaults[slug] || "#6B7280";
        p.set("color", defaultColor);
        dao.saveRecord(p);
      }
    }
  } catch (e) {
    // No records yet or other error, continue
  }

  return null;
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("projects");
  
  // Remove color field on rollback
  const newFields = [];
  for (let i = 0; i < collection.schema.fields.length; i++) {
    if (collection.schema.fields[i].name !== "color") {
      newFields.push(collection.schema.fields[i]);
    }
  }
  collection.schema.fields = newFields;
  
  return dao.saveCollection(collection);
});
