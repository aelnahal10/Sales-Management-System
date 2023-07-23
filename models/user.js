const UserModel = (sequelize, DataTypes) => {
    return sequelize.define('User', {
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "First name cannot be empty."
          },
          len: {
            args: [1, 255],
            msg: "First name should be between 1 and 255 characters."
          }
        }
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "Last name cannot be empty."
          },
          len: {
            args: [1, 255],
            msg: "Last name should be between 1 and 255 characters."
          }
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: "Email address already in use."
        },
        validate: {
          notEmpty: {
            args: true,
            msg: "Email cannot be empty."
          },
          isEmail: {
            args: true,
            msg: "Invalid email format."
          },
          len: {
            args: [5, 255],
            msg: "Email should be between 5 and 255 characters."
          }
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: "Password cannot be empty."
          },
          len: {
            args: [8, 255],
            msg: "Password should be between 8 and 255 characters."
          },
          isStrongPassword: function(value) {
            const strongRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})');
            if (!strongRegex.test(value)) {
              throw new Error('Password must have at least: 1 lowercase letter, 1 uppercase letter, 1 number, 1 special character (!@#$%^&*), and be at least 8 characters long.');
            }
          }
        }
      },
      postcode: {
        type: DataTypes.STRING,
        validate: {
          len: {
            args: [3, 10],
            msg: "Postcode should be between 3 and 10 characters."
          }
        }
      },
      address: {
        type: DataTypes.TEXT,
        validate: {
          len: {
            args: [5, 500],
            msg: "Address should be between 5 and 500 characters."
          }
        }
      },
      phone_number: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            args: true,
            msg: "Phone number cannot be empty."
          },
          len: {
            args: [10, 15],
            msg: "Phone number should be between 10 and 15 characters."
          },
          isNumeric: {
            args: true,
            msg: "Phone number should only contain numbers."
          }
        }
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    }, {
      underscored: true,
      tableName: 'users'
    });
  };
  
  module.exports = UserModel;