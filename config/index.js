module.exports = {
    "development": {
        "app": {
            "port": 3000,
            "security": {
                "jwt": {
                    "jwtSecret": "MyS3cr3tK3Y0000iii",
                    "jwtSession": {
                        "session": false
                    }
                }
            }
        },
        "port": 3306,
        "username": "root",
        "password": null,
        "database": "wake_booking",
        "host": "mysqldb",
        "dialect": "mysql"
    },
    "local": {
        "app": {
            "port": 3000,
            "security": {
                "jwt": {
                    "jwtSecret": "MyS3cr3tK3Y0000iii",
                    "jwtSession": {
                        "session": false
                    }
                }
            }
        },
        "port": 3306,
        "username": "root",
        "password": null,
        "database": "wake_booking",
        "host": "localhost",
        "dialect": "mysql"
    },
    "production": {
        "app": {
            "port": 3000
        },
        "username": "root",
        "password": null,
        "database": "database_test",
        "host": "127.0.0.1",
        "dialect": "mysql"
    }
}