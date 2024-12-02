export const DBConfig = {
  name: "WebGPT",
  version: 10,
  objectStoresMeta: [
    {
      store: "notes",
      storeConfig: { keyPath: "id", autoIncrement: true },
      storeSchema: [
        { name: "value", keypath: "value", options: { unique: false } },
        { name: "title", keypath: "title", options: { unique: false } },
      ],
    },
    {
      store: "conversations",
      storeConfig: { keyPath: "id", autoIncrement: true },
      storeSchema: [
        { name: "title", keypath: "title", options: { unique: false } },
        { name: "messages", keypath: "messages", options: { unique: false } },
      ],
    },
    {
      store: "inventory",
      storeConfig: { keyPath: "id", autoIncrement: true },
      storeSchema: [
        // { name: "amount", keypath: "amount", options: { unique: false } },
        // { name: "quantity", keypath: "quantity", options: { unique: false } },
        // { name: "title", keypath: "title", options: { unique: false } },
        // {
        //   name: "description",
        //   keypath: "description",
        //   options: { unique: false },
        // },
        // { name: "imgId", keypath: "imgId", options: { unique: false } },
        // { name: "price", keypath: "price", options: { unique: false } },
        {
          name: "list",
          keypath: "list",
          options: { unique: false },
        },
      ],
    },
    {
      store: "formulas",
      storeConfig: { keyPath: "id", autoIncrement: true },
      storeSchema: [
        { name: "title", keypath: "title", options: { unique: false } },
        { name: "ingredients", keypath: "ingredients", options: { unique: false } },
      ],
    },
  ],
};
