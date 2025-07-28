import React from "react";
import {
  Typography,
  Alert,
  Card,
  CardHeader,
  CardBody,
} from "@material-tailwind/react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

export function Notifications() {
  const [showAlerts, setShowAlerts] = React.useState({
    blue: true,
    green: true,
    orange: true,
    red: true,
  });

  const [showAlertsWithIcon, setShowAlertsWithIcon] = React.useState({
    blue: true,
    green: true,
    orange: true,
    red: true,
  });

  const alerts = [
    { color: "blue", message: "Bilgilendirme mesajı." },
    { color: "green", message: "İşlem başarıyla tamamlandı." },
    { color: "orange", message: "Dikkat! Bazı eksikler olabilir." },
    { color: "red", message: "Hata! Bir sorun oluştu." },
  ];

  return (
    <div className="mx-auto my-12 max-w-screen-md p-4">
      <Typography variant="h4" color="blue-gray" className="mb-6">
        Sistem Bildirimleri
      </Typography>

      <Card className="mb-8">
        <CardHeader color="transparent" floated={false} shadow={false} className="p-4">
          <Typography variant="h6" color="blue-gray">
            Basit Uyarılar
          </Typography>
        </CardHeader>
        <CardBody className="flex flex-col gap-4 p-4">
          {alerts.map(({ color, message }) => (
            <Alert
              key={color}
              open={showAlerts[color]}
              color={color}
              onClose={() => setShowAlerts((current) => ({ ...current, [color]: false }))}
            >
              {message}
            </Alert>
          ))}
        </CardBody>
      </Card>

      <Card>
        <CardHeader color="transparent" floated={false} shadow={false} className="p-4">
          <Typography variant="h6" color="blue-gray">
            Simgeli Uyarılar
          </Typography>
        </CardHeader>
        <CardBody className="flex flex-col gap-4 p-4">
          {alerts.map(({ color, message }) => (
            <Alert
              key={color}
              open={showAlertsWithIcon[color]}
              color={color}
              icon={<InformationCircleIcon strokeWidth={2} className="h-6 w-6" />}
              onClose={() =>
                setShowAlertsWithIcon((current) => ({
                  ...current,
                  [color]: false,
                }))
              }
            >
              {message}
            </Alert>
          ))}
        </CardBody>
      </Card>
    </div>
  );
}

export default Notifications;