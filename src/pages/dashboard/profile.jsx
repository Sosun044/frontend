import { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Avatar,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { getMyProfile } from "../../features/personal/services/personalService";
import { getMyAssignments } from "@/features/InventoryAssignment/services/inventoryAssignmentService";

export function Profile() {
  const [personal, setPersonal] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.warn("💣 Token yok, giriş sayfasına atılıyor.");
      navigate("/sign-in");
      return;
    }

    const fetchData = async () => {
      try {
        const [personalData, assignmentData] = await Promise.all([
          getMyProfile(),
          getMyAssignments(),
        ]);

        console.log("🧍 Personal:", personalData);
        console.log("📦 Assignments:", assignmentData);

        setPersonal(personalData);
        setAssignments(assignmentData);
      } catch (error) {
        console.error("❌ Hata:", error);
        console.log("⚠️ Hata Status:", error.response?.status);
        if (error.response?.status === 401) {
          navigate("/sign-in");
        }
      }
    };

    fetchData();
  }, []);



  if (loading) return <p className="p-4">Yükleniyor...</p>;

  return (
    <div className="w-full">
      <div className="relative h-64 w-full bg-cover bg-center rounded-b-xl bg-[url('/img/background-image.png')]">
        <div className="absolute inset-0 bg-gray-900/75" />
      </div>

      <Card className="relative mx-auto -mt-20 w-[95%] max-w-6xl p-6 shadow-xl">
        <div className="flex items-center gap-6 mb-8">
          <Avatar
            src={`/rest/api/personal/${personal.id}/photo`}
            alt="Profile"
            size="xxl"
            variant="rounded"
            className="shadow-md shadow-blue-gray-500/50"
          />
          <div>
            <Typography variant="h4" color="blue-gray">
              {personal.firstName} {personal.lastName}
            </Typography>
            <Typography variant="small" color="gray" className="uppercase font-medium">
              {personal.taskTitle.replaceAll("_", " ")}
            </Typography>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          <ProfileField label="Cinsiyet" value={personal.gender} />
          <ProfileField label="Doğum Tarihi" value={personal.birthDate} />
          <ProfileField label="Medeni Durum" value={personal.maritalStatus} />
          <ProfileField label="TCKN" value={personal.tckn} />
          <ProfileField label="Sicil No" value={personal.registrationNo} />
          <ProfileField label="Mezuniyet" value={personal.educationLevel} />
          <ProfileField label="Birim" value={personal.unit.replaceAll("_", " ")} />
          <ProfileField label="Çalışıyor mu" value={personal.working ? "Evet" : "Hayır"} />
          <ProfileField label="İşe Başlama" value={personal.startDate} />
          <ProfileField label="Başlangıç Pozisyonu" value={personal.startingPosition || "-"} />
          <ProfileField label="Başlangıç Ünvanı" value={personal.startingTitle || "-"} />
          <ProfileField label="Ayrılma Tarihi" value={personal.resignationDate || "-"} />
          <ProfileField label="Ayrılma Nedeni" value={personal.resignationReason || "-"} />
          <ProfileField label="Aktif mi" value={personal.isActive ? "Evet" : "Hayır"} />
        </div>

        <Typography variant="h5" className="mb-4 text-blue-gray-700">
          Zimmetli Envanterler
        </Typography>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {assignments.length > 0 ? (
            assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="border p-4 rounded-lg shadow-sm bg-white"
              >
                <Typography variant="h6" color="blue-gray">
                  {assignment.inventory.brand} {assignment.inventory.model}
                </Typography>
                <Typography variant="small" color="gray">
                  Tip: {assignment.inventory.typeName}
                </Typography>
                <Typography variant="small" color="gray">
                  Seri No: {assignment.inventory.serialNumber}
                </Typography>
                <Typography variant="small" color="gray">
                  Durum: {assignment.inventory.status}
                </Typography>
                <Typography variant="small" color="gray">
                  Zimmet Tarihi: {assignment.assignDate}
                </Typography>
              </div>
            ))
          ) : (
            <Typography color="gray">Zimmetli ürün bulunmamaktadır.</Typography>
          )}
        </div>
      </Card>
    </div>
  );
}

function ProfileField({ label, value }) {
  return (
    <div className="border rounded-lg p-4 shadow-sm bg-gray-50">
      <Typography variant="small" color="blue-gray" className="font-semibold mb-1">
        {label}
      </Typography>
      <Typography variant="paragraph" color="gray" className="text-sm">
        {value}
      </Typography>
    </div>
  );
}

export default Profile;
