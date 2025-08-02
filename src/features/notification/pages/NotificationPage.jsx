import { useEffect, useState } from "react";
import { getNotificationsByUser, markNotificationAsRead, deleteNotification, getAllNotificationsForAdmin } from "../service/NotificationService";
import NotificationList from "../notificationsComponent/NotificationList";
import { useAuth } from "@/context/useAuth";
import { Spinner, Typography, Card, CardHeader, CardBody } from "@material-tailwind/react";
import NotificationSocket from "../service/WebSocketService";

export default function NotificationPage() {
  const { user, isInitialized } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);


  const pageRequest = {
    pageNumber: 0,
    pageSize: 10,
    columnName: "createTime",
    asc: false,
  };

  useEffect(() => {
    if (!isInitialized, !user?.id) {
      console.warn(" Kullanıcı ID'si yok. Bildirimler yüklenemez.");
      return
    };

    setLoading(true);

    if (user.role === "ADMIN") {
      getAllNotificationsForAdmin(pageRequest)
        .then((data) => {
          setNotifications(data.content || []);
        }).catch((e) => {
          console.error(" Bildirim API HATASI:", e);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {

      getNotificationsByUser(user.id, pageRequest)
        .then((data) => {

          setNotifications(data.content || []);
        })
        .catch((e) => {
          console.error(" Bildirim API HATASI:", e);
        })
        .finally(() => {
          setLoading(false);
        });
    }

  }, [user, isInitialized]);

  const handleMarkAsRead = async (notifId) => {
    await markNotificationAsRead(notifId);
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
    );
  };
  const deleteNotify = async (notifId) => {
    await deleteNotification(notifId);

    setNotifications((prev) =>
      prev.filter((n) => (n.id !== notifId)
      ));

  };

  if (!isInitialized) {
    return (
      <div className="flex justify-center mt-12">
        <Spinner className="h-6 w-6 text-blue-500" />
      </div>
    );
  }

  return (

    <div className="mx-auto my-12 max-w-screen-md p-4">
      <NotificationSocket user={user} token={""} />
      <Typography variant="h4" className="mb-6"> Sistem Bildirimleri</Typography>
      <Card>
        <CardHeader floated={false} shadow={false} className="p-4">
          <Typography variant="h6">Bildirim Listesi</Typography>
        </CardHeader>
        <CardBody className="p-4">
          {loading ? (
            <div className="flex justify-center">
              <Spinner className="h-6 w-6 text-blue-500" />
            </div>
          ) : (
            <NotificationList
              notifications={notifications}
              onClose={deleteNotify}

            />
          )}
        </CardBody>
      </Card>
    </div>
  );
}
