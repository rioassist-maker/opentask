/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);
  
  const projects = new Collection({
    id: "es23vfsic2artwl",
    name: "projects",
    type: "base",
    system: false,
    auth: false,
    listRule: null,
    viewRule: null,
    createRule: null,
    updateRule: null,
    deleteRule: null,
    options: {},
  });

  projects.schema.addField(new TextField({
    system: false,
    id: "projects_name",
    name: "name",
    type: "text",
    hidden: false,
    unique: false,
    required: true,
    presentable: false,
    indexed: true,
  }));

  projects.schema.addField(new TextField({
    system: false,
    id: "projects_slug",
    name: "slug",
    type: "text",
    hidden: false,
    unique: true,
    required: false,
    presentable: false,
    indexed: true,
  }));

  projects.schema.addField(new TextField({
    system: false,
    id: "projects_description",
    name: "description",
    type: "text",
    hidden: false,
    unique: false,
    required: false,
    presentable: false,
    indexed: false,
  }));

  return dao.saveCollection(projects);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("es23vfsic2artwl");
  return dao.deleteCollection(collection);
})
