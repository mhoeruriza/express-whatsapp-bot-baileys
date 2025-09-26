import User from './user-model.js'
import Roles from './roles-model.js'

export const setupAssociations = () => {
    User.belongsTo(Roles, {
        foreignKey: 'id_role',
        as: 'role',
    })
}
