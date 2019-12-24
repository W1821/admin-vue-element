import {Notification} from 'element-ui';

export default class NotificationService {
    static success = (content) => {
        Notification.success({title: '成功', message: content, duration: 2500});
    };

    static error = (content) => {
        Notification.error({title: '失败', message: content, duration: 2500});
    };
}
