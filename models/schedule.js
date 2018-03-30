const Sequelize = require('sequelize');
const moment = require('moment');
const Op = Sequelize.Op;
// TODO: add order add/cancel time options

module.exports = (sequelize, DataTypes) => {
    class Schedule extends sequelize.Model {
        static associate(models) {
            Schedule.belongsTo(models.Ropeway);
        }
    }

    Schedule.init({
        dateFrom: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        dateTo: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        timeFrom: {
            type: DataTypes.TIME,
            allowNull: false
        },
        timeTo: {
            type: DataTypes.TIME,
            allowNull: false
        },
        duration: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 60,
            validation: {
                min: 10,
                max: 60,
                multiple() {
                    if (this.duration % 5) {
                        throw new Error('Should be multiple of 5 minutes')
                    }
                }
            }
        },
        interval: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 30,
            validation: {
                min: 1,
                max: 60,
                multiple() {
                    if (this.duration % 5) {
                        throw new Error('Should be multiple of 5 minutes')
                    }
                }
            }
        },
        weekMask: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 127,
            validate: {
                min: 0,
                max: 127,
            }
        }
    }, {
        sequelize,
        tableName: 'schedules',
        paranoid: true,
        validate: {
            isIntersected() {
                return Schedule.findAll({
                    where: {ropewayId: {[Op.eq]: this.ropewayId}}
                })
                    .then(schedules => {
                        if (schedules.length) {
                            const intersections = schedules.filter(sc => {
                                return moment(sc.dateFrom).isSameOrBefore(moment(this.dateFrom)) ||
                                    moment(sc.dateTo).isSameOrAfter(moment(this.dateTo));
                            });
                            if (intersections.length) {
                                throw new Error('Schedule dates conflict');
                            }
                        }
                    })
            }
        }
    });

    return Schedule;
};
