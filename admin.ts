import express from 'express';
import mongoose from "mongoose";
import AdminBro from 'admin-bro';
import AdminBroExpress from '@admin-bro/express';
import AdminBroMongoose from '@admin-bro/mongoose';

const ProjectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    completed: Boolean,
    created_at: {
        type: Date,
        default: Date.now
    }
})

const Project = mongoose.model("Project", ProjectSchema)

AdminBro.registerAdapter(AdminBroMongoose)

const app = express();

const adminBroOptions = new AdminBro({
    resources: [
        {
            resource: Project,
            options: {
                properties: {
                    description: { type: 'richtext' },
                    created_at: {
                        isVisible: {edit: false, list: true, show:true, filter: true}
                    }
                }
            }
        },
    ],
    locale: {
        language: 'pt',
        translations: {
            labels: {
                Project: "Meus Projetos"
            }
        }
    },

    rootPath: '/admin',
})

const router = AdminBroExpress.buildRouter(adminBroOptions)

app.use(adminBroOptions.options.rootPath, router)

const run = async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/AdminBro", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    app.listen(8080, () => console.log("Server started"))
}

run();