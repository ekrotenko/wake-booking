const MaskHelpers = require('./mask.helpers');
const Blocker = require('../models/Blocker');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const moment = require('moment');
const timeFormat = 'HH:mm';
const dateFormat = 'YYYY-MM-DD';

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