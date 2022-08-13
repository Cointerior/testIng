const { 
  GraphQLObjectType, 
  GraphQLString,
  GraphQLID,
  GraphQLNonNull,
  GraphQLList,
  GraphQLSchema,
  GraphQLEnumType
} = require("graphql")

const ClientPro = require("../models/ClientPro")
const ProjectPro = require("../models/ProjectPro")

const { clients, projects } = require("../config/sampleData")

const ClientType = new GraphQLObjectType({
  name: "Client",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString }
  })
})

const ProjectType = new GraphQLObjectType({
  name: "Project",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
    client: {
      type: ClientType,
      resolve(parent, args) {
        return clients.find(client => client.id === parent.clientId)
      }
    }
  })
})

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    client: {
      type: ClientType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parent, args) {
        return ClientPro.findById(args.id)
      }
    },
    clients: {
      type: new GraphQLList(ClientType),
      resolve(parent, args) {
        return ClientPro.find()
      }
    },
    project: {
      type: ProjectType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parent, args) {
        return ProjectPro.findById(args.id)
      }
    },
    projects: {
      type: new GraphQLList(ProjectType),
      resolve(parent, args) {
        return ProjectPro.find()
      }
    }
  }
})

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addClient: {
      type: ClientType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        phone: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve(parent, args) {
        return ClientPro.create({
          name: args.name,
          email: args.email,
          phone: args.phone
        })
      }
    },
    
    addProject: {
      type: ProjectType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        status: {
          type: new GraphQLEnumType({
            name: "ProjectStatus",
            values: {
              "new": { value: "Not Started" },
              "progress": { value: "In Progress" },
              "completed": { value: "Completed" },
            }
          }),
          defaultValue: "Not Started"
        }
      },
      resolve(parent, args) {
        return ProjectPro.create({
          clientId: args.id,
          name: args.id,
          description: args.description,
          status: args.status
        })
      }
    },
    
    deleteClient: {
      type: ClientType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parent, args) {
        return ClientPro.findByIdAndRemove(args.id)
      }
    },
    
    updateClient: {
      type: ClientType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString }
      },
      resolve(parent, args) {
        return ClientPro.findByIdAndUpdate(args.id, { $set: { 
          name: args.name,
          email: args.email,
          phone: args.phone
        }}, { new: true })
      }
    },
    
    updateProject: {
      type: ProjectType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        clientId: { type: GraphQLID },
        status: {
          type: new GraphQLEnumType({
            name: "ProjectStatusUpdate",
            values: {
              "new": { value: "Not Started" },
              "progress": { value: "In Progress" },
              "completed": { value: "Completed" }
            }
          })
        }
      },
      resolve(parent, args) {
        return ProjectPro.findByIdAndUpdate(args.id, { $set: {
          name: args.name,
          description: args.description,
          status: args.status,
          clientIs: args.clientId
        }}, { new: true })
      }
    },
    
    deleteProject: {
      type: ProjectType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) }  },
      resolve(parent, args) {
        return ProjectPro.findByIdAndRemove(args.id)
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
})