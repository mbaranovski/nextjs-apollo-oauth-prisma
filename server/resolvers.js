const {generateJWT} = require('../lib/utils');

const {AuthenticationError} = require('apollo-server-express');
const checkUser = require('../lib/utils').checkUser;
const getGithubUser = require('./github').getGithubUser;
const getGithubToken = require('./github').getGithubToken;

module.exports = {
    default:
        {
            Query: {
                note: async (_, {id}, ctx, info) => {
                  //  const userId = getUserId(ctx)
                    const hasPermission = await ctx.prisma.db.exists.Note({
                        id,
                        owner: {id: userId}
                    })

                    if (!hasPermission) {
                        throw new AuthenticationError("Insufficient permission!")
                    }

                    return await ctx.db.query.note({where: {id}})
                },

                me: (_, args, ctx, info) => {
                    checkUser(ctx);

                    return {
                        name: 'Michal'
                    }
                }
            },
            Mutation: {
                authenticate: async (parent, {githubCode}, ctx, info) => {
                    const token = await getGithubToken(githubCode);
                    const {id, name, email} = await getGithubUser(token);
                   /// console.log('MICHAL: ', user)

                    return {
                        token: generateJWT({useruuid: id, name, email})
                    }
                }
            },
        }
}