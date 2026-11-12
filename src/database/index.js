import mongoose from 'mongoose';
import { Sequelize } from 'sequelize';
import Category from '../app/models/Category.js';
import Product from '../app/models/Product.js';
import User from '../app/models/User.js';
import databaseConfig from '../config/database.cjs';

const models = [User, Product, Category];

class Database {
	constructor() {
		this.init();
		this.mongo();
	}

	init() {
		this.connection = new Sequelize(databaseConfig);
		models
			.map((model) => model.init(this.connection))
			.map((model) => model.associate && model.associate(this.connection.models));
	}

	mongo() {
		const mongoUrl = process.env.MONGO_URL;

		if (!mongoUrl) {
			throw new Error('MONGO_URL must be set to connect to MongoDB');
		}

		this.mongooseConnection = mongoose.connect(mongoUrl);
	}
}

export default new Database();
