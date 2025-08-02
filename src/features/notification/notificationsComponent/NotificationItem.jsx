import { Alert } from "@material-tailwind/react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

export default function NotificationItem({ notification, onClose }) {


    return (
        <div className="p-4 my-4 rounded-xl border border-gray-300 shadow-md bg-white">
            <Alert
                open={true}
                color={notification.read ? "gray" : "green"}
                icon={<InformationCircleIcon strokeWidth={2} className="h-6 w-6" />}
                onClose={() => onClose(notification.id)}
            >
                <div className="text-sm">
                    <strong className="text-base text-gray-900">{notification.title}</strong> — {notification.message}
                    <br />
                    <small className="text-gray-600">{new Date(notification.createTime).toLocaleString()}</small>
                </div>
            </Alert>
        </div>

    );
}
