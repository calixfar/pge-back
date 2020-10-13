const Notification = require('../models/notification');

exports.getNotifications = async (req, res) => {
    try {
        const { user } = req;

        let params = {};
        if( user.type_user === 'FIELD_MANAGER' || user.type_user === 'EMPLOYEE' ) {
            params[`${user.type_user === 'FIELD_MANAGER' ? 'triggered' : 'altered'}User`] = user._id;
        }

        const notifications = await Notification.find(params).populate('triggeredUser');

        console.log('notifications', notifications);
        res.json({
            notifications
        });

    } catch (error) {
        console.log(error);
        res.status(502).json({
            msg: 'Ocurrio un error al obtener las notificaciones'
        })
    }
}