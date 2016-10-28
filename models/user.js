var bcrypt = require('bcryptjs');
var _ = require('underscore');
var cryptojs = require('crypto-js');
var jwt = require('jsonwebtoken');

module.exports = function(sequelize, DataTypes) {
	var user = sequelize.define('user', {
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true
			}
		},
		salt: {
			type: DataTypes.STRING
		},
		password_hash: {
			type: DataTypes.STRING
		},
		password: {
			type: DataTypes.VIRTUAL,
			allowNull: false,
			validate: {
				len: [7, 100]
			},
			set: function(value) {
				var salt = bcrypt.genSaltSync(10);
				var hashedPassword = bcrypt.hashSync(value, salt);

				this.setDataValue('password', value);
				this.setDataValue('salt', salt);
				this.setDataValue('password_hash', hashedPassword);
			}
		}
	}, {
		hooks: {
			beforeValidate: function(user, options) {
				if (typeof user.email === 'string') {
					user.email = user.email.toLowerCase(); // convert email to lowercase
				}
			}
		},

		// classMethods: {
		// 	authenticate: function(body) {
		// 		return new Promise(function(resolve, reject) {
		// 			if (typeof body.email !== 'string' || typeof body.password !== 'string') {
		// 				return reject();
		// 			}

		// 			user.findOne({
		// 				where: {
		// 					email: body.email
		// 				}
		// 			}).then(function(user) {
		// 				if (!user || !bcrypt.compareSync(body.password, user.get('password_hash'))) {
		// 					return reject();
		// 				}
		// 				resolve(user);
		// 			}, function(e) {
		// 				reject();
		// 			});
		// 		});
		// 	},
		// 			findByToken: function (token) {
		// 				return new Promise(function (resolve, reject) {
		// 					try {
		// 						var decodedJWT = jwt.verify(token, 'gerry0807');
		// 						console.log("jWT" + decodedJWT.token);
		// 						var bytes = cryptojs.AES.decrypt(decodedJWT.token, 'test123');
		// 						console.log('Bytes' + bytes);
		// 						var tokenData = JSON.parse(bytes.toString(cryptojs.enc.Utf8));
		// 						console.log('tokenData' + tokenDataId);

		// 						user.findById(tokenData.id).then(function (user) {
		// 							if (user) {
		// 								resolve(user);
		// 							} else {
		// 								console.log("2")
		// 								reject();
		// 							}
		// 						}, function (e) {
		// 							console.log("1")
		// 							reject();
		// 						});
		// 					} catch (e){
		// 						console.log(e);
		// 						reject();
		// 					}
		// 				});
		// 			}
		// 		},
		// 		instanceMethods: {
		// 			toPublicJSON: function() {
		// 				var json = this.toJSON();
		// 				return _.pick(json, 'id', 'email', 'updatedAt', 'createdAt');
		// 			},
		// 			generateToken: function(type) {
		// 				if (!_.isString(type)) {
		// 					return undefined;
		// 				}

		// 				try{
		// 					stringData = JSON.stringify({id: this.get('id'), type: type});
		// 					var encryptedData = cryptojs.AES.encrypt(stringData, 'test123').toString();
		// 					var token = jwt.sign({
		// 						token: encryptedData
		// 					}, 'gerry0807');

		// 					return token;
		// 				} catch(e) {
		// 					console.error(e);
		// 					return undefined;
		// 				}
		// 			}
		// 		}
		// 	});

		// 	return user;
		// }
		classMethods: {
			authenticate: function(body) {
				return new Promise(function(resolve, reject) {
					if (typeof body.email !== 'string' || typeof body.password !== 'string') {
						return reject();
					}

					user.findOne({
						where: {
							email: body.email
						}
					}).then(function(user) {
						if (!user || !bcrypt.compareSync(body.password, user.get('password_hash'))) {
							return reject();
						}

						resolve(user);
					}, function(e) {
						reject();
					});
				});
			},
			findByToken: function(token) {
				return new Promise(function(resolve, reject) {
					try {
						var decodedJWT = jwt.verify(token, 'gerry0807');
						var bytes = cryptojs.AES.decrypt(decodedJWT.token, 'test123');
						var tokenData = JSON.parse(bytes.toString(cryptojs.enc.Utf8));

						user.findById(tokenData.id).then(function(user) {
							if (user) {
								resolve(user);
							} else {
								reject();
							}
						}, function(e) {
							reject();
						});
					} catch (e) {
						reject();
					}
				});
			}
		},
		instanceMethods: {
			toPublicJSON: function() {
				var json = this.toJSON();
				return _.pick(json, 'id', 'email', 'createdAt', 'updatedAt');
			},
			generateToken: function(type) {
				if (!_.isString(type)) {
					return undefined;
				}

				try {
					var stringData = JSON.stringify({
						id: this.get('id'),
						type: type
					});
					var encryptedData = cryptojs.AES.encrypt(stringData, 'test123').toString();
					var token = jwt.sign({
						token: encryptedData
					}, 'gerry0807');

					return token;
				} catch (e) {
					console.error(e);
					return undefined;
				}
			}
		}
	});
	return user;
};