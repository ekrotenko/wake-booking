const Moment = require('moment');
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const MaskHelpers = require('./mask.helpers');
const Blocker = require('../models/Blocker');

const timeFormat = 'HH:mm';

class BlockerHelpers {

    static getBlockers(ropewayId, date) {
        return Blocker.findAll({
            where: {
                ropewayId: {[Op.eq]: ropewayId},
                dateFrom: {[Op.lte]: new Date(date)},
                dateTo: {[Op.gte]: new Date(date)}
            }
        })
            .then(blockers => {
                const bFiltered = {};

                bFiltered.disposable = _parseDisposables(blockers.filter(b => {
                    return b.type === 'disposable';
                }));

                bFiltered.recurring = _parseRecurrings(blockers.filter(b => {
                    return b.type === 'recurring';
                }));

                return bFiltered;
            })
    }

    static getBlockerIntersections(reqBlocker) {
        const Blocker = require('../models/Blocker');
        return Blocker.findAll({
            where: {
                ropewayId: {[Op.eq]: reqBlocker.ropewayId},
                [Op.or]: {
                    dateFrom: {
                        [Op.between]: [new Date(reqBlocker.dateFrom), new Date(reqBlocker.dateTo)]
                    },
                    dateTo: {
                        [Op.between]: [new Date(reqBlocker.dateFrom), new Date(reqBlocker.dateTo)]
                    }
                }
            }
        })
            .then(blockers => {
                const intersections = blockers.filter(b => {
                    const bTimeFrom = moment(b.timeFrom, 'HH:mm:ss');
                    const bTimeTo = moment(b.timeTo, 'HH:mm:ss').subtract(1, 'second');
                    const rTimeFrom = moment(reqBlocker.timeFrom, timeFormat);
                    const rTimeTo = moment(reqBlocker.timeTo, timeFormat);

                    const rRange = moment.range(rTimeFrom, rTimeTo);

                    if (rRange.contains(bTimeFrom) || rRange.contains(bTimeTo)) {
                        return (b.type === 'disposable') ||
                            (b.type === 'recurring' && (b.weekMask & reqBlocker.weekMask) > 0)
                    }
                });

                return intersections;
            });
    }
}

function _parseDisposables(disposables) {
    return disposables.map(blocker => {
        return {
            from: `${blocker.dateFrom} ${blocker.timeFrom}`,
            to: `${blocker.dateTo} ${blocker.timeTo}`
        }
    })
}

function _parseRecurrings(recurrings) {
    const parseResult = {};

    recurrings.forEach(setting => {
        MaskHelpers.maskToArray(setting.weekMask).forEach((day, index) => {
            const weekDay = moment.weekdays(index).toLowerCase();

            parseResult[`${weekDay}`] = (!parseResult[`${weekDay}`]) ? [] : parseResult[`${weekDay}`];

            if (day > 0) {
                parseResult[`${weekDay}`].push({
                    from: setting.timeFrom,
                    to: setting.timeTo
                })
            }
        })
    });

    return parseResult;
}

module.exports = BlockerHelpers;