const appConfig = {
    development: {
        port: 3000,
        security: {
            jwt: {
                jwtSecret: "MyS3cr3tK3Y0000iii",
                jwtSession: {
                    session: false
                }
            }
        }
    },
    local: {
        port: 3000,
        security: {
            jwt: {
                jwtSecret: "MyS3cr3tK3Y0000iii",
                jwtSession: {
                    session: false
                }
            }
        }
    },
    production: {
        port: 3000
    }
};

module.exports = (() => appConfig[process.env.NODE_ENV])();